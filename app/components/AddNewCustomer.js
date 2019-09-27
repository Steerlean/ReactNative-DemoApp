import React, { Component } from 'react';
import { Platform, Text, View, TextInput, Button, Alert, Keyboard, ToastAndroid, ScrollView, TouchableOpacity } from 'react-native';
import { spreadsheet_ID, API_key } from '../../Test_Properties';
import { RadioGroup, RadioButton } from 'react-native-flexi-radio-button';
import { styles } from '../Styles/AddNewCustomerStyles';

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
      phoneno: '',
      error_message_name: '',
      error_message_address: '',
      error_message_phoneno: '',
      error_message_total: '',
      is_phone_registered: false,
      deposit_paid: 'No',
      total: '',
      query: '',
    }
    this.onSelect = this.onSelect.bind(this);
  }
  onSelect(index, value) {
    this.setState({
      deposit_paid: `${value}`,
    })
  }
  handleRequestForAllUniquePhoneNo(phone_no) {
    this.setState({ is_phone_registered: false, })
    return fetch('https://sheets.googleapis.com/v4/spreadsheets/' + spreadsheet_ID + '/values/!C2%3AC?key=' + API_key)
      .then((response) => response.json())
      .then((responseJson) => {
        var registered_phone_values = responseJson.values;
        for (let i = 0; i < registered_phone_values.length; i++) {
          if (registered_phone_values[i] == phone_no) {
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
    var total;
    if (field == 'name') {
      this.setState({
        name: text,
      })
    } else if (field == 'address') {
      this.setState({
        query: text,
      })
    } else if (field == 'phoneno') {
      this.setState({
        phoneno: text,
      })
    } else if (field == 'total') {
      this.setState({
        total: text,
      })
    }
  }
  _onPressButton() {
    var name = "" + this.state.name;
    var address = this.state.query;
    var phoneno = "" + this.state.phoneno;
    let reg_ex = /^[0-9]+$/;
    var total = "" + this.state.total;
    var is_customername_field_empty = false;
    var is_customeraddress_field_empty = false;
    var is_customerphoneno_field_empty = false;
    var is_customertotal_field_empty = false;
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
        if (this.state.is_phone_registered == true) {
          this.setState({
            error_message_phoneno: 'MobileNo. already exists.',
          });
        } else {
          if (is_customername_field_empty == false && is_customeraddress_field_empty == false && is_customerphoneno_field_empty == false && this.state.is_phone_registered == false) {
            const newRecord = {
              majorDimension: 'ROWS',
              values: [
                [
                  this.props.username,
                  this.state.name,
                  this.state.phoneno,
                  address,
                  "", "", "", "", "",
                  this.state.total,
                  this.state.deposit_paid,
                ]
              ]
            };
            var url = 'https://sheets.googleapis.com/v4/spreadsheets/' + spreadsheet_ID + '/values/Customer_Details:append?includeValuesInResponse=true&insertDataOption=INSERT_ROWS&responseDateTimeRenderOption=SERIAL_NUMBER&responseValueRenderOption=FORMATTED_VALUE&valueInputOption=USER_ENTERED&fields=spreadsheetId%2CtableRange%2Cupdates&key=' + API_key;
            fetch(url, {
              method: 'POST',
              body: JSON.stringify(newRecord),
              headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + this.props.accesstoken,
              }
            }).then(res => res.json())
              .catch((error) => {
                console.error('Error:', error)
              })
              .then((response) => {
                if (response.updates != null) {
                  ToastAndroid.showWithGravity('Customer added successfully.', ToastAndroid.LONG, ToastAndroid.CENTER);
                  this.setState({
                    name: '',
                    phoneno: '',
                    total: '',
                    query: '',
                  });
                } else if (response.error.status == 'UNAUTHENTICATED') {
                  Alert.alert("Your session has expired please login again!!!")
                }
              });
          }
          Keyboard.dismiss();
        }
      })
    }
    if (total == '') {
      is_customertotal_field_empty = true;
      this.setState({
        error_message_total: 'Please enter total amount',
      });
    } else {
      is_customertotal_field_empty = false;
      this.setState({
        error_message_total: '',
      });
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
          <View style={styles.textInput}>
          <ScrollView>
            <TextInput
            placeholder="Address"
            multiline={true}
            onChangeText={(text) => this.updateValue(text, 'address')}>
            {this.state.query}
          </TextInput>
          </ScrollView>
          </View>
        </View>
        <View style={styles.validating_form_textfield_address}>
          <Text style={styles.error_message_Text}>{this.state.error_message_address}</Text>
        </View>
        <View style={{ flexDirection: 'row' }}  >
          <View style={styles.label}><Text>Phone</Text></View>
          <View style={styles.textInput}>
          <TextInput
            placeholder="PhoneNo"
            onChangeText={(text) => this.updateValue(text, 'phoneno')}
            keyboardType="number-pad">
            {this.state.phoneno}
          </TextInput></View>
        </View>
        <View style={styles.validating_form_textfield_phone}>
          <Text style={styles.error_message_Text}>{this.state.error_message_phoneno}</Text>
        </View>
        <View style={{ flexDirection: 'row' }}  >
          <View style={styles.label}><Text>Total</Text></View>
          <View style={styles.textInput}><TextInput
            placeholder="Total"
            onChangeText={(text) => this.updateValue(text, 'total')}
            keyboardType="number-pad">
            {this.state.total}
          </TextInput></View>
        </View>
        <View style={styles.validating_form_textfield_total}>
          <Text style={styles.error_message_Text}>{this.state.error_message_total}</Text>
        </View>
        <View style={{ flexDirection: 'row' }}  >
          <View style={styles.label}><Text>Deposit Paid</Text></View>
          <View style={{ width: 200, height: 50, marginBottom: 50 }}>
            <RadioGroup
              size={15}
              thickness={2}
              selectedIndex={1}
              onSelect={(index, value) => this.onSelect(index, value)}>
              <RadioButton value='Yes' color='black'>
                <Text>Yes</Text>
              </RadioButton>
              <RadioButton value='No' color='black'>
                <Text>No</Text>
              </RadioButton>
            </RadioGroup>
          </View>
        </View>
        <View style={{ flexDirection: 'row' }}  >
          <TouchableOpacity onPress={this._onPressButton.bind(this)}>
            <View style={styles.buttonSubmit}>
              <Text style={styles.buttonText}>Submit</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}







