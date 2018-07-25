import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, TextInput, Button, Alert } from 'react-native';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

export class AddNewCustomer extends Component {


  constructor() {
    super();
    this.state = {
      name: '',
      address: '',
      phoneno: '',
    }
  }
  updateValue(text, field) {

    var name;
    var address;
    var phoneno;
    if (field == 'name') {
      this.setState({
        name: text,
      })
     } else if (field == 'address') {

      this.setState({
        address: text,
      })

    } else if (field == 'phoneno') {

      this.setState({
        phoneno: text,
      })
    }


  }
  _onPressButton() {
    const newRecord = {
      majorDimension: 'ROWS',
      values: [
        [
          this.state.name,
          this.state.phoneno,
          this.state.address,
        ]
      ]
    };
    

    var url = 'https://sheets.googleapis.com/v4/spreadsheets/1xqigpFw7y0gTuKS1U9txjq7Sgk8qZ-0kIfSfDbx0OV8/values/CustomerDetails:append?includeValuesInResponse=true&insertDataOption=INSERT_ROWS&responseDateTimeRenderOption=SERIAL_NUMBER&responseValueRenderOption=FORMATTED_VALUE&valueInputOption=RAW&fields=spreadsheetId%2CtableRange%2Cupdates&key=AIzaSyCLby0W3hX6SVicmNz0HbZun8A8mHe-5kU';
    fetch(url, {
      method: 'POST',
      body: JSON.stringify(newRecord),
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer ya29.GlwDBg2AhbUg-NJPVMsXZpW7WNjtYB7icGLnFmW0Nx2p8HxRTWPQkWs5IYH6H6Putna_tCXLtHgpp5kw_R6J7UjLWPA8AIMJZbqRja8cBEVMSW8tS3e1HaVnqmqacA",
      }
    })
      .then(res => res.json())
      .catch(error => console.error('Error:', error))
      .then((response) => {
        alert('New Customer added successfully!!');
        console.log('Success:', response);
      });
  }

  render() {
    return (

      <View style={styles.container}>

        <Text styles={styles.header}>ADD NEW CUSTOMER</Text>
        <View style={{ flexDirection: 'row' }}  >
          <View style={styles.label}><Text>Name</Text></View>
          <View style={styles.textInput}><TextInput
            placeholder="Name"
            onChangeText={(text) => this.updateValue(text, 'name')}>
          </TextInput>
          </View>
        </View>
        <View style={{ flexDirection: 'row' }}  >
          <View style={styles.label}><Text>Address</Text></View>
          <View style={styles.textInput}><TextInput
            placeholder="Address"
            onChangeText={(text) => this.updateValue(text, 'address')}>
          </TextInput></View>
        </View>
        <View style={{ flexDirection: 'row' }}  >
          <View style={styles.label}><Text>Phone</Text></View>
          <View style={styles.textInput}><TextInput
            placeholder="PhoneNo"
            onChangeText={(text) => this.updateValue(text, 'phoneno')}>
          </TextInput></View>
        </View>
        <View style={{ flexDirection: 'row' }}  >

          <Button
            onPress={this._onPressButton.bind(this)}
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
    paddingLeft: 20,
    paddingRight: 20,
    alignItems: 'center',
    alignSelf: 'stretch'
  },

  header: {
    fontSize: 800,
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
    width: 200,
    height: 50,
    borderBottomColor: 'darkgrey',
    borderBottomWidth: 1,
    alignSelf: 'stretch',
  },


});

