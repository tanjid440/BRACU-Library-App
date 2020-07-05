import React, { Component } from 'react'
import { View, Text, StyleSheet, FlatList, Image, ActivityIndicator, BackHandler, Alert } from 'react-native'
import BookList from '../../components/BookList'

export default class CheckedOut extends Component {

  state = {
    books: this.props.data,
    isLoaded: true
  }
  componentDidMount() {

  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          {this.state.isLoaded ?
            this.state.books.length ?
              <FlatList
                style={{ flex: 1, width: '96%' }}
                data={this.state.books}
                renderItem={({ item }) => <BookList data={item} />}
                keyExtractor={(item) => item.name}
              />
              :
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Image
                  source={require('../../../assets/box.png')}
                  style={{ width: 150, height: 150, opacity: 0.7 }} />
                <Text style={{ fontSize: 26, fontWeight: 'bold', marginTop: 10, color: '#aaa' }}>No Books</Text>
              </View>
            :
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <ActivityIndicator size={128} color='#FF96C2' />
            </View>
          }
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 8,
    backgroundColor: 'white'
  },
  content: {
    flex: 1,
    alignItems: 'center',
  }
})