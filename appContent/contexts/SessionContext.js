import React, { createContext, Component } from 'react'
import { AsyncStorage, Alert, View, ActivityIndicator } from 'react-native'

export const SessionContext = createContext()

export default class SessionProvider extends Component {

  constructor(props) {
    super(props)

    this.state = {
      cookie: 'null',
      setCookie: val => this.setState({ cookie: val }),
      isLoggedIn: false,
      setLogin: val => this.setState({ isLoggedIn: val }),
      asyncDone: false,
      saveit: 'false',
      savedid: ''
    }
    this.getData().then(_ => this.setState({ asyncDone: true }))
  }

  async getData() {
    await AsyncStorage.getItem('@userid').then(val => this.setState({ savedid: val }))
    await AsyncStorage.getItem('@saveit').then(val => this.setState({ saveit: val }))
  }

  render() {
    if (this.state.asyncDone) {
      return (
        <SessionContext.Provider value={{ ...this.state }}>
          {this.props.children}
        </SessionContext.Provider>
      )
    } else {
      return (<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><ActivityIndicator size='large' color='grey' /></View>)
    }
  }
}
