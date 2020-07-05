import React, { Component } from 'react'
import { View, Text, StyleSheet, FlatList, Image, ActivityIndicator, BackHandler, Alert } from 'react-native'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Header from '../../components/Header'
import CheckedOut from './CheckedOut'
import Holds from './Holds'

const Tab = createMaterialTopTabNavigator();

export default class MyBooks extends Component {

  state = {
    checkedOutCount: 0,
    holdsCount: 0,
    checkedOutBooks: [],
    holdsBooks: [],
    isLoaded: false
  }

  componentDidMount() {
    const root = this.props.root
    let checkedOutCount = root.querySelector('#opac-user-checkouts')?.querySelectorAll('a.title').length || 0
    let holdsCount = root.querySelector('#opac-user-holds')?.querySelectorAll('a.title').length || 0
    // console.log(checkedOutCount, holdsCount)
    this.setState({ checkedOutCount })
    this.setState({ holdsCount })
    let books = []
    if (checkedOutCount > 0) {
      for (let i = 0; i < checkedOutCount; i++) {
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
      this.setState({ checkedOutBooks: books })
    }
    this.setState({ isLoaded: true })
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Header icon='book' title='My Books' />
        </View>
        <Tab.Navigator
          tabBarOptions={{
            activeTintColor: '#2B4D66',
            indicatorStyle: { backgroundColor: '#FF4293' },
            labelStyle: { fontWeight: 'bold' }
          }}
        >
          <Tab.Screen name={`Checked Out (${this.state.checkedOutCount})`} children={_ => <CheckedOut data={this.state.checkedOutBooks} />} />
          <Tab.Screen name={`Holds (${this.state.holdsCount})`} component={Holds} />
        </Tab.Navigator>
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
  }
})