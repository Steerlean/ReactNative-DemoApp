import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, TextInput, Button,Alert} from 'react-native';
const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});


export class ExistingCustomer extends Component {
    _onPressButton() {
        Alert.alert('You have pressed submit button of Existing Customer!!'); 
       }
  render() {
    return (
     
        <View style={styles.container}>

          <Text styles={styles.header}>EXISTING CUSTOMER</Text>
          <View style={{ flexDirection: 'row' }}  >
            <View style={styles.label}><Text>Name</Text></View>
            <View style={styles.textInput}><TextInput placeholder="Name"></TextInput></View>
          </View>
          <View style={{ flexDirection: 'row' }}  >
            <View style={styles.label}><Text>Jars Delivered</Text></View>
            <View style={styles.textInput}><TextInput placeholder="Jars Delivered"></TextInput></View>
          </View>
          <View style={{ flexDirection: 'row' }}  >
            <View style={styles.label}><Text>Jars Picked</Text></View>
            <View style={styles.textInput}><TextInput placeholder="Jars Picked"></TextInput></View>
          </View>
          <View style={{ flexDirection: 'row' }}  >
            <View style={styles.label}><Text>Amount Paid</Text></View>
            <View style={styles.textInput}><TextInput placeholder="Amount Paid"></TextInput></View>
          </View>
          <View>
            <Button style={styles.buttonSubmit}
              onPress={this._onPressButton}
              title="Submit"
              color="#841584" />
              
          </View>
        </View>
      
    );
  }
}

const styles = StyleSheet.create({


  container: {
    flex: 80,
    justifyContent: 'center',
    backgroundColor: 'aquamarine',
    paddingLeft: 20,
    paddingRight: 20,
    alignItems: 'center',
    alignSelf: 'stretch'
  },

  header: {
    fontSize: 200,
    marginBottom: 40,
    marginLeft: 40,
    color: 'black',
    borderBottomColor: 'darkgrey',
    borderBottomWidth: 1,
    paddingBottom: 20,
  },

  buttonSubmit: {
    width: 70,
    height: 10,
    margin: 130,
    marginTop: 0,
    flex: 20,
  },

  label: {
    fontSize: 20,
    width: 100,
    height: 50,
    marginLeft: 20,
    marginTop: 13,
  },

  textInput: {
    width: 100,
    height: 50,
    borderBottomColor: 'darkgrey',
    borderBottomWidth: 1,
    alignSelf: 'stretch',
  },
  

});




