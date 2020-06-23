import React, { createContext, Component } from 'react'

export const SessionContext = createContext()

export default class SessionProvider extends Component {
  state = {
    cookie: 'null',
    setCookie: val => this.setState({ cookie: val }),
    isLoggedIn: false,
    setLogin: val => this.setState({ isLoggedIn: val }),
  }

  render() {
    return (
      <SessionContext.Provider value={{ ...this.state }}>
        {this.props.children}
      </SessionContext.Provider>
    )
  }
}
