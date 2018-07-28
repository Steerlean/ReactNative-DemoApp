import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, TextInput, Button, Alert } from 'react-native';

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
      customer_added_message: '',
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


    var name = "" + this.state.name;
    var address = "" + this.state.address;
    var phoneno = "" + this.state.phoneno;
    let reg_ex=/^[0-9]+$/;

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
        error_message_phoneno: 'Please enter valid phoneno',
      });
    } else {
      if(reg_ex.test(phoneno)){
        is_customerphoneno_field_empty = false;
        this.setState({
          error_message_phoneno: '',
        });
      }else{
        is_customerphoneno_field_empty = true;
        this.setState({
          error_message_phoneno: 'Please enter valid phoneno',
        });
      }
      

    }

    if (is_customername_field_empty == false && is_customeraddress_field_empty == false && is_customerphoneno_field_empty == false) {
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
          this.setState({
            customer_added_message: 'Customer added successfully.'
          });

          console.log('Success:', response);
          this.setState({
            name:'',
            address:'',
            phoneno:'',
          });
        });
    }
    Keyboard.dismiss();
  }
  render() {
    return (

      <View style={styles.container}>

        <Text styles={styles.header}>ADD NEW CUSTOMER</Text>

        <Text style={styles.error_message_Text}>{this.state.error_message_name}</Text>
        <Text style={styles.error_message_Text}>{this.state.error_message_address}</Text>
        <Text style={styles.error_message_Text}>{this.state.error_message_phoneno}</Text>
        <View style={{ flexDirection: 'row' }}  >
          <View style={styles.label}><Text>Name</Text></View>
          <View style={styles.textInput}><TextInput
            placeholder="Name"
            onChangeText={(text) => this.updateValue(text, 'name')}>
            {this.state.name}
          </TextInput>
          </View>
        </View>
        <View style={{ flexDirection: 'row' }}  >
          <View style={styles.label}><Text>Address</Text></View>
          <View style={styles.textInput}><TextInput
            placeholder="Address"
            onChangeText={(text) => this.updateValue(text, 'address')}>
            {this.state.address}
          </TextInput></View>
        </View>
        <View style={{ flexDirection: 'row' }}  >
          <View style={styles.label}><Text>Phone</Text></View>
          <View style={styles.textInput}><TextInput
            placeholder="PhoneNo"
            onChangeText={(text) => this.updateValue(text, 'phoneno')}>
            {this.state.phoneno}
          </TextInput></View>
        </View>
        <View style={{ flexDirection: 'row' }}  >

          <Button
            onPress={this._onPressButton.bind(this)}
            title="Submit"
            color="#841584" />
        </View>
        <View style={{ flexDirection: 'row' }}  >

          <Text style={styles.success_message_Text}>{this.state.customer_added_message}</Text>

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
  error_message_Text: {
    color: 'red',
  },
  success_message_Text: {
    padding: 20,
    color: 'green',
    fontSize: 20,
  }


});

