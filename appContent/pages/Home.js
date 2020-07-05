import React, { Component } from 'react';
import { Image } from 'react-native'
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { SessionContext } from '../contexts/SessionContext'
import MyBooks from './tabbedScreens/MyBooks';
import Profile from './tabbedScreens/Profile';
import Search from './tabbedScreens/Search';
import About from './tabbedScreens/DevInfo';
import { YellowBox } from 'react-native';

YellowBox.ignoreWarnings([
  'Non-serializable values were found in the navigation state',
]);

const Tab = createMaterialBottomTabNavigator();

export default class Home extends Component {

  static contextType = SessionContext
  session = this.context

  state = {
    booksCount: 0,
    fine: 0
  }

  componentDidMount() {
    const root = this.props.route.params
    const booksCount = root.querySelectorAll('a.title').length
    this.setState({ booksCount })
    fetch('http://115.127.80.41/cgi-bin/koha/opac-account.pl', { method: 'GET', headers: { 'set-cookie': this.session.cookie } })
      .then(res => res.text())
      .then(html => {
        const HTMLparser = require('fast-html-parser')
        const root = HTMLparser.parse(html)
        const fine = root.querySelector('td.sum').rawText
        this.setState({ fine })
      })
      .catch(error => {
        this.setState({ fine: '0.00' })
        this.setState({ profile: { ...this.state.profile, totalFine: '0.00' } })
      })
  }

  render() {
    return (
      <Tab.Navigator
        initialRouteName="MyBooks"
        shifting={true}
        activeColor="#2B4D66"
        backBehavior='none'
        barStyle={{ backgroundColor: 'white', paddingVertical: 4 }}
      >
        <Tab.Screen name="MyBooks" children={_ => <MyBooks root={this.props.route.params} />} options={{
          title: 'My Books',
          tabBarIcon: _ => <Image source={require('../../assets/book.png')} style={{ width: 24, height: 24 }} />,
          tabBarBadge: this.state.booksCount
        }} />
        <Tab.Screen name="Search" component={Search} options={{
          title: 'Search',
          tabBarIcon: _ => <Image source={require('../../assets/search.png')} style={{ width: 24, height: 24 }} />
        }} />
        <Tab.Screen name="Profile" component={Profile} options={{
          title: 'Profile',
          tabBarIcon: _ => <Image source={require('../../assets/person.png')} style={{ width: 24, height: 24 }} />,
          tabBarBadge: this.state.fine
        }} />
        <Tab.Screen name="About" component={About} options={{
          title: 'About',
          tabBarIcon: _ => <Image source={require('../../assets/about.png')} style={{ width: 24, height: 24 }} />
        }} />
      </Tab.Navigator>
    );
  }
}