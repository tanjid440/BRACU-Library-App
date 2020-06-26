import React, { Component } from 'react'
import { View, Text, StyleSheet, Image, ActivityIndicator } from 'react-native'
import { SessionContext } from '../../contexts/SessionContext'
import Header from '../../components/Header'

export default class Profile extends Component {

  state = {
    profile: {},
    isLoaded: false
  }

  static contextType = SessionContext
  session = this.context

  componentDidMount() {
    const HTMLparser = require('fast-html-parser')
    if (this.session.isLoggedIn && !this.state.isLoaded) {
      fetch('http://115.127.80.41/cgi-bin/koha/opac-memberentry.pl', { method: 'GET', headers: { 'cookie': this.session.cookie } })
        .then(res => res.text())
        .then(html => {
          const root = HTMLparser.parse(html)
          let id = (root.querySelector('#memberentry_library').childNodes[3].childNodes[1].childNodes[2].rawText).trim()
          let expiry = (root.querySelector('#memberentry_library').childNodes[3].childNodes[3].childNodes[2].rawText).trim()
          let name = (root.querySelector('#borrower_firstname').rawAttributes.value) +
            (root.querySelector('#borrower_surname').rawAttributes.value)
          let degree = (root.querySelectorAll('fieldset.rows')[6].childNodes[3].childNodes[1].childNodes[2].rawText).trim()
          let dept = (root.querySelectorAll('fieldset.rows')[6].childNodes[3].childNodes[3].childNodes[2].rawText).trim()
          this.setState({
            profile: {
              ...this.state.profile, id, expiry, name, degree, dept
            }
          })
          this.setState({ isLoaded: true })
        })
        .catch(error => console.log(error))
      fetch('http://115.127.80.41/cgi-bin/koha/opac-account.pl', { method: 'GET', headers: { 'set-cookie': this.session.cookie } })
        .then(res => res.text())
        .then(html => {
          const root = HTMLparser.parse(html)
          const totalFine = root.querySelector('td.sum').rawText
          this.setState({ profile: { ...this.state.profile, totalFine } })
        })
        .catch(error => {
          this.setState({ profile: { ...this.state.profile, totalFine: '0.00' } })
          console.log(error)
        })
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Header icon='profile' title='Profile' />
        </View>
        {this.state.isLoaded ?
          <View style={styles.content}>
            <View style={styles.border}>
              <Image source={{
                uri: `http://115.127.80.41/cgi-bin/koha/opac-patron-image.pl?${Math.random().toString().substr(2, 5)}`,
                headers: { 'cookie': this.session.cookie }
              }}
                style={styles.image}
                onError={_=> console.log('Profile Picture Not Loaded!')} />
            </View>
            <Text style={{ fontSize: 30, color: '#4b6584', fontWeight: 'bold', textAlign: 'center' }}>{this.state.profile.name}</Text>
            <Text style={{ fontSize: 14, color: '#778ca3' }}>{this.state.profile.degree}, {this.state.profile.dept}</Text>
            <View style={{ flex: 1, flexDirection: 'row', width: '100%', alignItems: 'center', justifyContent: 'space-around' }}>
              <View>
                <Image source={require('../../../assets/calendar.png')} style={{ width: 38, height: 38 }} />
                <Text style={{ fontSize: 24, marginBottom: 5, color: '#fc5c65', fontWeight: 'bold' }}>Expiry Date</Text>
                <Text style={{ fontWeight: 'bold' }}>{this.state.profile.expiry}</Text>
              </View>
              <View style={{ fex: 1 }}>
                <Image source={require('../../../assets/license.png')} style={{ width: 38, height: 38 }} />
                <Text style={{ fontSize: 24, marginBottom: 5, color: '#fd9644', fontWeight: 'bold' }}>Card No</Text>
                <Text style={{ fontWeight: 'bold' }}>{this.state.profile.id}</Text>
              </View>
              <View style={{ fex: 1 }}>
                <Image source={require('../../../assets/money.png')} style={{ width: 38, height: 38 }} />
                <Text style={{ fontSize: 24, marginBottom: 5, color: '#f7b731', fontWeight: 'bold' }}>Total Fine</Text>
                <Text style={{ fontWeight: 'bold' }}>{this.state.profile.totalFine} BDT</Text>
              </View>
            </View>
          </View>
          :
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size={128} color='#FE4F60' />
          </View>
        }
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
    alignItems: 'center',
  },
  image: {
    width: 250,
    height: 250,
    borderRadius: 125,
    borderWidth: 8,
    borderColor: '#FE4F60'
  },
  border: {
    marginTop: 8,
    marginBottom: 30,
    borderRadius: 200,
    borderWidth: 2,
    borderColor: '#FE4F60',
    padding: 3
  }
})