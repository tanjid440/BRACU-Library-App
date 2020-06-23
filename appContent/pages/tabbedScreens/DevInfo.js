import React, { Component } from 'react'
import {
  View,
  Text,
  StyleSheet,
  Image
} from 'react-native'
import Header from '../../components/Header'
import { TextInput } from 'react-native-gesture-handler'

export default class DevInfo extends Component {
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Header icon='about' title='About' />
        </View>
        <View style={styles.content}>
          <View style={styles.logo}>
            <Image
              source={require('../../../assets/library.png')} style={styles.img} />
            <Text style={styles.title}>Ayesha Abed Library</Text>
            <Text style={styles.title}>V 1.0.0-Beta</Text>
          </View>
          <View style={styles.panel}>
            <View style={styles.details}>
              <Image source={require('../../../assets/user.png')} style={styles.icon} />
              <View>
                <Text style={styles.key}>Developer</Text>
                <Text style={styles.value}>Tanjid Ahmed</Text>
              </View>
            </View>
            <View style={styles.details}>
              <Image source={require('../../../assets/gmail.png')} style={styles.icon} />
              <View>
                <Text style={styles.key}>Email</Text>
                <Text style={styles.value}>tanjid440@gmail.com</Text>
              </View>
            </View>
            <View style={styles.details}>
              <Image source={require('../../../assets/facebook.png')} style={styles.icon} />
              <View>
                <Text style={styles.key}>Social</Text>
                <Text style={styles.value}>fb.me/tanjid.ahmed440</Text>
              </View>
            </View>
            <View style={styles.details}>
              <Image source={require('../../../assets/github.png')} style={styles.icon} />
              <View>
                <Text style={styles.key}>GitHub</Text>
                <Text style={styles.value}>github.com/tanjid440</Text>
              </View>
            </View>
          </View>
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
  details: { flexDirection: 'row', alignItems: 'center', width: '100%', marginBottom: 12 },
  icon : { width: 32, height: 32, marginRight: 16 },
  header: {
    width: '100%',
    height: 90
  },
  content: {
    flex: 1,
    alignItems: 'center',
  },
  logo: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  img: {
    width: 96,
    height: 96,
    marginVertical: 16
  },
  title: {
    color: '#313131',
    fontSize: 20,
    fontWeight: 'bold'
  },
  panel: {
    flex: 1,
    width: '85%'
  },
  key: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#777'
  },
  value: {
    color: '#444',
    fontSize: 20,
    fontWeight: 'bold',
  }
})