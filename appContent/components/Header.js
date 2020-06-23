import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  Image,
} from 'react-native'

export default function Booklist(props) {

  let icon = ''
  switch (props.icon) {
    case 'book':
      icon = require('../../assets/book.png')
      break;
    case 'search':
      icon = require('../../assets/search.png')
      break;
    case 'about':
      icon = require('../../assets/about.png')
      break;
    case 'profile':
      icon = require('../../assets/person.png')
      break;
    default:
      icon = require('../../assets/library.png')
  }

  return (
    <View style={styles.head}>
      <Image source={icon} style={styles.img} />
      <Text style={styles.title}>{props.title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  head: {
    flex: 1,
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center'
  },
  img: {
    height: 42,
    width: 42,
    marginLeft: 24
  },
  title: {
    fontWeight: 'bold',
    fontSize: 28,
    color: '#2B4D66',
    marginLeft: 12
  }
})