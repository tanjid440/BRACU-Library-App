import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  Modal,
  ActivityIndicator,
  Alert,
  CheckBox,
  AsyncStorage,
} from 'react-native';
import { SessionContext } from '../contexts/SessionContext';

export default class Login extends Component {

  static contextType = SessionContext
  session = this.context

  state = {
    userid: this.context.savedid,
    password: '',
    loginURL: `http://115.127.80.41/cgi-bin/koha/opac-user.pl?${Math.random().toString().substr(2, 5)}`,
    saveId: (this.context.saveit == 'true'),
    showPass: true,
    moreThanOneError: false,
    activityModal: false,
    showError: false,
    errorMSG: ''
  }

  setUserId = val => this.setState({ userid: val })
  setPasswd = val => this.setState({ password: val })
  saveid = val => { this.setState({ saveId: val }); if (!val) { this.saveDetails(false) } }
  showModal = _ => this.setState({ activityModal: true })
  hideModal = _ => this.setState({ activityModal: false })
  showError = msg => this.setState({ showError: true, errorMSG: msg })
  hideError = _ => this.setState({ showError: false })

  login = _ => {
    const url = this.state.loginURL
    const id = this.state.userid
    const password = this.state.password
    if (id && password) {
      this.showModal()
      this.saveDetails(this.state.saveId)
      const credential = new FormData()
      credential.append('userid', id)
      credential.append('password', password)
      credential.append('koha_login_context', 'opac')
      fetch(url, { method: 'POST', body: credential })
        .then(res => {
          let cookie = res.headers.map['set-cookie']
          fetch(url, { method: 'GET' })
            .then(res => res.text())
            .then(html => {
              const Parser = require('fast-html-parser')
              const root = Parser.parse(html)
              if (!(root.querySelector('title').rawText).includes('Log in')) {
                this.session.setCookie(cookie)
                this.session.setLogin(true)
                this.hideModal()
                this.props.navigation.push('Home')
              } else {
                this.hideModal()
                this.showError('Login Failed! Wrong userid or password!')
              }
            })
            .catch(error => {
              this.hideModal()
              this.showError('Could not validate Login info!')
            })
        })
        .catch(error => {
          this.hideModal()
          if (!this.state.moreThanOneError) {
            this.showError('Login Failed! Please check your internet connection and try again')
            this.setState({ moreThanOneError: true })
          } else {
            this.showError('It seems that you are having trouble logging in. Please make sure your internet is working and you can login normally using the library website. If this problem persists, please contact with the developer.')
          }
        })
    } else {
      this.showError('USER ID or PASSWORD cannot be empty!')
    }
  }

  showError() {
    this.setState({ error: true })
  }

  saveDetails = async val => {
    if (val) {
      try {
        await AsyncStorage.setItem('@userid', this.state.userid)
        await AsyncStorage.setItem('@saveit', 'true')
      } catch (error) {
        this.hideModal()
        Alert.alert('Error!', 'Could not save userid.')
        this.showModal()
      }
    } else {
      try {
        await AsyncStorage.setItem('@userid', '')
        await AsyncStorage.setItem('@saveit', 'false')
      } catch (error) {
        this.hideModal()
        Alert.alert('Error!', 'Could not remove saved userid.')
        this.showModal()
      }
    }
  }

  render() {
    return (
      <TouchableWithoutFeedback onPress={_ => Keyboard.dismiss()}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Image
              source={require('../../assets/library.png')} style={styles.img} />
            <Text style={styles.title}>Ayesha Abed Library</Text>
          </View>
          <View style={styles.panel}>
            <View style={styles.border}>
              <View style={styles.inputBox}>
                <Image source={require('../../assets/user.png')} style={styles.icon} />
                <TextInput style={styles.inputField}
                  defaultValue={this.state.userid}
                  placeholder='USER ID'
                  onChangeText={this.setUserId} />
              </View>
            </View>
            <View style={styles.border}>
              <View style={styles.inputBox}>
                <Image source={require('../../assets/password.png')} style={styles.icon} />
                <TextInput style={styles.inputField}
                  secureTextEntry={this.state.showPass}
                  placeholder='PASSWORD'
                  onChangeText={this.setPasswd} />
                <TouchableOpacity onPressIn={_ => this.setState({ showPass: false })} onPressOut={_ => this.setState({ showPass: true })}>
                  <Image source={require('../../assets/focus.png')} style={{ marginHorizontal: 5, width: 32, height: 32 }} />
                </TouchableOpacity>
              </View>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginVertical: 5 }}>
              <CheckBox
                value={this.state.saveId}
                onValueChange={this.saveid} />
              <Text>SAVE USER ID</Text>
            </View>
            <TouchableOpacity onPress={this.login}>
              <View style={styles.border}>
                <View style={styles.inputBox}>
                  <Text style={styles.btn}>LOGIN</Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
          <Modal
            animationType="slide"
            transparent={true}
            visible={this.state.activityModal}
          >
            <View style={styles.modalbg}>
              <View style={styles.modalBorder}>
                <View style={styles.modal}>
                  <ActivityIndicator size='large' color='#2B4D66' style={{ marginRight: 16 }} />
                  <Text style={{ fontSize: 20 }}>Logging In...</Text>
                </View>
              </View>
            </View>
          </Modal>
          <Modal
            animationType="slide"
            transparent={true}
            visible={this.state.showError}
          >
            <View style={styles.modalbg}>
              <View style={styles.modalBorder}>
                <View style={styles.errorModal}>
                  <View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20, backgroundColor: '#fab1a025', padding: 10 }}>
                      <Image source={require('../../assets/alert.png')} style={{ width: 38, height: 38, marginHorizontal: 10 }} />
                      <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#555' }}>Error</Text>
                    </View>
                    <Text style={{ fontSize: 16, color: '#555', marginBottom: 20, textAlign: 'center', lineHeight: 22, paddingHorizontal: 20 }}>{this.state.errorMSG}</Text>
                    <TouchableOpacity style={{ borderWidth: 1, borderColor: '#eee', backgroundColor: '#eeeeeeaa' }}
                      onPress={this.hideError}>
                      <Text style={{ color: '#777', paddingVertical: 14, textAlign: 'center', fontSize: 16, fontWeight: 'bold' }}>OK</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          </Modal>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  img: {
    width: 96,
    height: 96,
    marginVertical: 16
  },
  header: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  panel: {
    width: 350,
    flex: 1,
  },
  title: {
    color: '#313131',
    fontSize: 20,
    fontWeight: 'bold'
  },
  inputBox: {
    flexDirection: 'row',
    borderWidth: 3,
    borderColor: '#2B4D66',
    paddingHorizontal: 5,
    paddingVertical: 10,
    backgroundColor: '#F5F5F5'
  },
  icon: {
    marginHorizontal: 5,
    width: 32,
    height: 32
  },
  inputField: {
    width: 245,
    // flex: 1,
    textAlign: 'center',
    fontSize: 18
  },
  btn: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    color: '#2B4D66',
    fontWeight: 'bold',
    marginHorizontal: 30
  },
  border: {
    marginVertical: 5,
    borderWidth: 1,
    borderColor: '#2B4D66',
    padding: 2
  },
  modalbg: {
    flex: 1,
    backgroundColor: '#00000033',
    alignItems: 'center',
    justifyContent: 'flex-end'
  },
  modal: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    height: 100,
    borderWidth: 3,
    borderColor: '#2B4D66'
  },
  errorModal: {
    justifyContent: 'center',
    backgroundColor: 'white',
    borderWidth: 3,
    borderColor: '#ff767590'
  },
  modalBorder: {
    marginVertical: 16,
    borderWidth: 1,
    borderColor: '#ff767590',
    padding: 2,
    width: '95%'
  },
})