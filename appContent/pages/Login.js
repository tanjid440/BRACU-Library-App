import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  Modal,
  ActivityIndicator
} from 'react-native';
import { SessionContext } from '../contexts/SessionContext';

export default class Login extends Component {

  state = {
    userid: '',
    password: '',
    activityModal: false
  }

  static contextType = SessionContext
  session = this.context

  setUserId = val => this.setState({ userid: val })
  setPasswd = val => this.setState({ password: val })
  showModal = _ => this.setState({ activityModal: true })
  hideModal = _ => this.setState({ activityModal: false })

  login = _ => {
    this.showModal()
    const url = 'http://115.127.80.41/cgi-bin/koha/opac-user.pl'
    const id = this.state.userid
    const password = this.state.password
    const credential = new FormData()
    credential.append('userid', id)
    credential.append('password', password)
    credential.append('koha_login_context', 'opac')
    fetch(url, { method: 'POST', body: credential })
      .then(res => {
        let cookie = res.headers.map['set-cookie']
        this.session.setCookie(cookie)
        this.session.setLogin(true)
        this.hideModal()
        this.props.navigation.navigate('Home')
      })
      .catch(err => console.log('error:', err))
  }

  render() {
    return (
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
                placeholder='USER ID'
                onChangeText={this.setUserId} />
            </View>
          </View>
          <View style={styles.border}>
            <View style={styles.inputBox}>
              <Image source={require('../../assets/password.png')} style={styles.icon} />
              <TextInput style={styles.inputField}
                placeholder='PASSWORD'
                onChangeText={this.setPasswd} />
            </View>
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
      </View>
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
    flex: 1,
    alignItems: 'center',
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
    // marginVertical: 8,
    backgroundColor: '#F5F5F5'
  },
  icon: {
    marginHorizontal: 5,
    width: 32,
    height: 32
  },
  inputField: {
    width: "70%",
    textAlign: 'center',
    fontSize: 18
  },
  btn: {
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
    padding: 3
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
  modalBorder: {
    marginVertical: 24,
    borderWidth: 1,
    borderColor: '#2B4D66',
    padding: 3,
    width: '95%'
  },
})