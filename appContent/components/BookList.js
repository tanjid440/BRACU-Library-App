import React, { Component } from 'react'
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert
} from 'react-native'

export default function Booklist(props) {

  const renewBook = _ => {
    Alert.alert('Renew', props.data.url)
  }

  return (
    <View style={styles.border}>
      <View style={styles.list}>
        <View style={styles.row}>
          <Image source={{ uri: props.data.thumbnail }} style={styles.thumbnail} />
          <View>
            <Text style={styles.title}>{
              (props.data.name).length > 22 ? (props.data.name).substr(0, 25).concat('...') : props.data.name
            }</Text>
            <Text style={styles.info}>Due Date: {props.data.date}</Text>
            <Text style={styles.info}>{props.data.renewals}</Text>
            <Text style={styles.info}>Fines: {props.data.fines}</Text>
          </View>
        </View>
        <TouchableOpacity onPress={renewBook}>
          <View style={styles.renew}>
            <Text style={styles.renText}>Renew</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    flex: 1,
    backgroundColor: '#FF72AD',
    height: 148,
    overflow: 'hidden',
    borderColor: '#FF4293',
    borderWidth: 4
  },
  row: {
    flex: 1,
    flexDirection: 'row',
  },
  thumbnail: {
    width: 80,
    height: 100,
    marginRight: 12
  },
  renew: {
    width: '100%',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FF4293'
  },
  renText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold'
  },
  title: {
    fontWeight: 'bold',
    fontSize: 20,
    color: 'white',
    marginBottom: 5,
    marginTop: 3
  },
  info: {
    color: 'white'
  },
  border: {
    marginVertical: 5,
    borderWidth: 1,
    borderColor: '#FF4293',
    padding: 2,
    marginVertical: 6,
  },
});