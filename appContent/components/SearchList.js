import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert
} from 'react-native'

export default function Searchlist(props) {

  const showBook = _ => {
    fetch(props.data.details, { method: 'GET' })
      .then(det => det.text())
      .then(detH => {
        const HTMLparser = require('fast-html-parser')
        const root = HTMLparser.parse(detH)
        let callnumber = (props.data.catagory == 'Book') ? (root.querySelectorAll('table.citation')[1].querySelectorAll('td')[0].childNodes[0].rawText).trim() : 'N/A'
        let key = []
        let value = []
        let msg = ''
        for (let i = 0; i < root.querySelectorAll('table.citation')[0].querySelectorAll('th').length; i++) {
          let term = (root.querySelectorAll('table.citation')[0].querySelectorAll('th')[i].rawText).replace(/[\n;,]/g, '').trim()
          if (term != 'Published:' && term != 'Tags:' && term != 'Classic Catalogue:') {
            key.push((root.querySelectorAll('table.citation')[0].querySelectorAll('th')[i].rawText).replace(/[\n;,]/g, '').trim())
            value.push((root.querySelectorAll('table.citation')[0].querySelectorAll('td')[i].rawText).replace(/[\n;,]/g, '').trim())
          }
        }
        for (let i = 0; i < key.length; i++) {
          msg += '\n' + key[i] + ' ' + value[i] + '\n'
        }
        msg += '\nCall Number: ' + callnumber
        Alert.alert(props.data.name, msg)
      })
      .catch(err => console.log('det', err))
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
            <Text style={styles.info}>Catagory: {props.data.catagory}</Text>
            <Text style={styles.info}>Availability: {props.data.availability}</Text>
          </View>
        </View>
        <TouchableOpacity onPress={showBook}>
          <View style={styles.details}>
            <Text style={styles.detText}>Details</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    flex: 1,
    backgroundColor: '#5AB9E6',
    height: 148,
    overflow: 'hidden',
    borderColor: '#2B93CB',
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
  details: {
    width: '100%',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2B93CB'
  },
  detText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold'
  },
  title: {
    fontWeight: 'bold',
    fontSize: 22,
    color: 'white',
    marginBottom: 8,
    marginTop: 5
  },
  info: {
    color: 'white'
  },
  border: {
    marginVertical: 5,
    borderWidth: 1,
    borderColor: '#2B93CB',
    padding: 2,
    marginVertical: 4,
  },
});