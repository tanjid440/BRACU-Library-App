import React, { Component } from 'react'
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native'
import { SessionContext } from '../../contexts/SessionContext'
import BookList from '../../components/BookList'
import Header from '../../components/Header'

export default class MyBooks extends Component {

  state = {
    books: [],
    isLoaded: false
  }

  static contextType = SessionContext
  session = this.context

  componentDidMount() {
    if (this.session.isLoggedIn && !this.state.isLoaded) {
      fetch('http://115.127.80.41/cgi-bin/koha/opac-user.pl', {
        method: 'GET',
        headers: {
          'cookie': this.session.cookie
        }
      })
        .then(res => res.text())
        .then(html => {
          const HTMLparser = require('fast-html-parser')
          const root = HTMLparser.parse(html)
          let books = []
          for (let i = 0; i < root.querySelectorAll('a.title').length; i++) {
            let name = root.querySelectorAll('a.title')[i].childNodes[0].rawText
            name = name.replace(/ \W/g, '').trim()
            let date = root.querySelectorAll('td.date_due')[i].childNodes[1].rawAttrs
            date = date.replace(/[title="T:]/g, '').substr(0, 10)
            let renewals = root.querySelectorAll('span.renewals')[i].rawText
            renewals = renewals.replace(/[()]/g, '')
            let fines = root.querySelectorAll('td.fines')[i].childNodes[2].rawText
            fines = fines.trim()
            let thumbnail = root.querySelectorAll('img.item-thumbnail')[i].rawAttributes.src
            thumbnail = thumbnail.replace('THUMBZZZ', 'MZZZZZZZ')
            let url = root.querySelectorAll('td.renew')[i].childNodes[3].rawAttributes.href
            url = 'http://115.127.80.41' + url
            books.push({
              name, date, renewals, fines, thumbnail, url
            })
          }
          this.setState({ books })
          this.setState({ isLoaded: true })
        })
        .catch(error => console.log(error))
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Header icon='book' title='My Books' />
        </View>
        <View style={styles.content}>
          {this.state.isLoaded ?
            <FlatList
              style={{ flex: 1, width: '92%'}}
              data={this.state.books}
              renderItem={({ item }) => <BookList data={item} />}
              keyExtractor={(item) => item.name}
            />
            :
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <ActivityIndicator size={128} color='#FF96C2' />
            </View>
          }
        </View>
      </View>
    );
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
    alignItems: 'center',
  }
})