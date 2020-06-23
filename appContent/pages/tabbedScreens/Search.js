import React, { Component } from 'react'
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  FlatList
} from 'react-native'
import Header from '../../components/Header'
import SearchList from '../../components/SearchList'

export default class Search extends Component {

  state = {
    keyword: 'python 3',
    result: [],
    count: 0,
    available: 0,
    isLoaded: false
  }

  setKeyWord = val => this.setState({ keyword: val })
  search = _ => {
    if (this.state.keyword) {
      const term = (this.state.keyword).trim().replace(/ /g, '+')
      const url = `http://115.127.80.41/vufind/Search/Results?lookfor=${term}&type=AllFields&submit=Find&limit=20&sort=relevance`
      fetch(url, { method: 'GET' })
        .then(res => res.text())
        .then(html => {
          const HTMLparser = require('fast-html-parser')
          const root = HTMLparser.parse(html)
          let result = []
          let count = root.querySelectorAll('a.title').length
          let available = root.querySelectorAll('.available').length
          for (let i = 0; i < count; i++) {
            let name = (root.querySelectorAll('a.title')[i].rawText).replace(/ \W/g, '').trim()
            let availability = (root.querySelectorAll('div.resultItemLine4')[i].querySelectorAll('span.available')[0]) == undefined ? 'Not Available' : 'Available'
            let details = 'http://115.127.80.41' + (root.querySelectorAll('a.title')[i].rawAttributes.href) + '/Holdings'
            let thumbnail = 'http://115.127.80.41' + (root.querySelectorAll('img.summcover')[i].rawAttributes.src).replace('amp;', '')
            let catagory = (root.querySelectorAll('span.iconlabel')[i].childNodes[0].rawText).trim()
            result.push({
              name, availability, details, thumbnail, catagory
            })
          }
          this.setState({
            result, count, available, isLoaded: true
          })
        })
        .catch(error => console.log('error404:', error))
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Header icon='search' title='Search' />
        </View>
        <View style={styles.panel}>
          <View style={styles.border}>
            <View style={styles.inputBox}>
              <Image source={require('../../../assets/searchIcon.png')} style={styles.icon} />
              <TextInput style={styles.inputField}
                placeholder='Book Title'
                onChangeText={this.setKeyWord} />
            </View>
          </View>
          <TouchableOpacity onPress={this.search}>
            <View style={styles.border}>
              <View style={styles.inputBox}>
                <Text style={styles.btn}>Search</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.content}>
          <FlatList
            style={{ flex: 1, width: '95%' }}
            showsVerticalScrollIndicator={false}
            data={this.state.result}
            renderItem={({ item }) => <SearchList data={item} />}
            keyExtractor={item => item.details} />
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  header: {
    width: '100%',
    height: 90
  },
  content: {
    flex: 1,
    marginTop: 10,
    alignItems: 'center',
  },
  panel: {
    flexDirection: 'row',
    justifyContent: 'center',
    height: 60,
    alignItems: 'center',
  },
  inputBox: {
    flexDirection: 'row',
    borderWidth: 3,
    borderColor: '#2B4D66',
    paddingHorizontal: 5,
    paddingVertical: 10,
    backgroundColor: '#F5F5F5',
  },
  icon: {
    marginHorizontal: 8,
    width: 24,
    height: 24
  },
  inputField: {
    width: 230,
    textAlign: 'left',
    fontSize: 18,
  },
  border: {
    marginVertical: 5,
    borderWidth: 1,
    borderColor: '#2B4D66',
    padding: 3
  },
  btn: {
    textAlign: 'center',
    fontSize: 17,
    color: '#2B4D66',
    fontWeight: 'bold',
    marginHorizontal: 10
  },
})