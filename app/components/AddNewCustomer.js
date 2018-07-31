import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, TextInput, Button, Alert, Keyboard, ToastAndroid } from 'react-native';
const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

export class AddNewCustomer extends Component {


  constructor(props) {
    super(props);
    this.state = {
      name: '',
      address: '',
      phoneno: '',
      error_message_name: '',
      error_message_address: '',
      error_message_phoneno: '',
      is_phone_registered: false,


    }
  }
  handleRequestForAllUniquePhoneNo(phone_no) {

    this.setState({ is_phone_registered: false, })
    return fetch('https://sheets.googleapis.com/v4/spreadsheets/1_sIKjoYU7wDlGysnna9cXvTLQdGGjjmP3lFzMmj0aWU/values/Sheet1!C2%3AC?key=AIzaSyCLby0W3hX6SVicmNz0HbZun8A8mHe-5kU')
      .then((response) => response.json())
      .then((responseJson) => {

        var registered_phone_values = responseJson.values;

        for (let i = 0; i < registered_phone_values.length; i++) {
          console.log(registered_phone_values[i]);
          if (registered_phone_values[i] == phone_no) {
            console.log(registered_phone_values[i]);
            this.setState({ is_phone_registered: true, })

          }

        }

      })
      .catch((error) => {
        console.error(error);
      });
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


    var name = "" + this.state.name;
    var address = "" + this.state.address;
    var phoneno = "" + this.state.phoneno;
    let reg_ex = /^[0-9]+$/;

    var is_customername_field_empty = false;
    var is_customeraddress_field_empty = false;
    var is_customerphoneno_field_empty = false;

    if (name == '') {
      is_customername_field_empty = true;
      this.setState({
        error_message_name: 'Please enter name.',
      });
    } else {
      is_customername_field_empty = false;
      this.setState({
        error_message_name: '',
      });
    }
    if (address == '') {
      is_customeraddress_field_empty = true;
      this.setState({
        error_message_address: 'Please enter address',
      });
    } else {
      is_customeraddress_field_empty = false;
      this.setState({
        error_message_address: '',
      });
    }
    if (phoneno == '') {
      is_customerphoneno_field_empty = true;
      this.setState({
        error_message_phoneno: 'Please enter phoneno',
      });
    } else {
      if (reg_ex.test(phoneno)) {
        is_customerphoneno_field_empty = false;
        this.setState({
          error_message_phoneno: '',
        });
      } else {
        is_customerphoneno_field_empty = true;
        this.setState({
          error_message_phoneno: 'Please enter valid phoneno',
        });

      }
      this.handleRequestForAllUniquePhoneNo(phoneno).then(() => {

        console.log("1" + this.state.is_phone_registered);
        if (this.state.is_phone_registered == true) {
          console.log("2" + this.state.is_phone_registered);
          this.setState({
            error_message_phoneno: 'MobileNo. already exists.',
          });

        }

        else {

          if (is_customername_field_empty == false && is_customeraddress_field_empty == false && is_customerphoneno_field_empty == false && this.state.is_phone_registered == false) {
            const newRecord = {
              majorDimension: 'ROWS',
              values: [
                [
                  this.props.username,
                  this.state.name,
                  this.state.phoneno,
                  this.state.address,
                ]
              ]
            };


            var url = 'https://sheets.googleapis.com/v4/spreadsheets/1_sIKjoYU7wDlGysnna9cXvTLQdGGjjmP3lFzMmj0aWU/values/Sheet1:append?includeValuesInResponse=true&insertDataOption=INSERT_ROWS&responseDateTimeRenderOption=SERIAL_NUMBER&responseValueRenderOption=FORMATTED_VALUE&valueInputOption=RAW&fields=spreadsheetId%2CtableRange%2Cupdates&key=AIzaSyCLby0W3hX6SVicmNz0HbZun8A8mHe-5kU';
            fetch(url, {
              method: 'POST',
              body: JSON.stringify(newRecord),
              headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + this.props.accesstoken,
              }
            })
              .then(res => res.json())
              .catch(error => console.error('Error:', error))
              .then((response) => {
                ToastAndroid.showWithGravity('Customer added successfully.', ToastAndroid.LONG, ToastAndroid.CENTER);


                console.log('Success:', response);
                this.setState({
                  name: '',
                  address: '',
                  phoneno: '',
                });
              });
          }
          Keyboard.dismiss();

        }
      })
    }


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
            {this.state.name}
          </TextInput>
          </View>
        </View>
        <View style={styles.validating_form_textfield_name}>
          <Text style={styles.error_message_Text}>{this.state.error_message_name}</Text>
        </View>
        <View style={{ flexDirection: 'row' }}  >
          <View style={styles.label}><Text>Address</Text></View>
          <View style={styles.textInput}><TextInput
            placeholder="Address"
            onChangeText={(text) => this.updateValue(text, 'address')}>
            {this.state.address}
          </TextInput></View>
        </View>
        <View style={styles.validating_form_textfield_address}>
          <Text style={styles.error_message_Text}>{this.state.error_message_address}</Text>
        </View>
        <View style={{ flexDirection: 'row' }}  >
          <View style={styles.label}><Text>Phone</Text></View>
          <View style={styles.textInput}><TextInput
            placeholder="PhoneNo"
            onChangeText={(text) => this.updateValue(text, 'phoneno')}>
            {this.state.phoneno}
          </TextInput></View>
        </View>
        <View style={styles.validating_form_textfield_phone}>
          <Text style={styles.error_message_Text}>{this.state.error_message_phoneno}</Text>
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
    fontWeight: 'bold',
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
  error_message_Text: {
    color: 'red',
    marginLeft: 10,
  },
  success_message_Text: {
    padding: 20,
    color: 'green',
    fontSize: 20,
  },
  validating_form_textfield_name: {
    marginLeft: 30,
  },
  validating_form_textfield_address: {
    marginLeft: 40,
  },
  validating_form_textfield_phone: {
    marginLeft: 80,
  },



});



