import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, TextInput, Button, Alert, Picker, TouchableOpacity, Keyboard, ToastAndroid } from 'react-native';
import { DatePickerDialog } from 'react-native-datepicker-dialog'
import { GoogleSignin} from 'react-native-google-signin';
import { createStackNavigator } from 'react-navigation';
import moment from 'moment';
const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

export class ExistingCustomer extends Component {
  constructor() {
    super();
    this.state = {
      PickerValue: '',
      DateText: new Date().getFullYear() + "-" + ((new Date().getMonth()) + 1) + "-" + new Date().getDate(),
      DateHolder: null,
      dataSource: [],
      jars_delivered: 0,
      jars_picked: 0,
      amount_paid: 0,
      error_message_name: '',
      error_message_jars_delivered: '',
      error_message_jars_picked: '',
      error_message_amount_paid: '',
    }

  }
  DatePickerMainFunctionCall = () => {

    let DateHolder = this.state.DateHolder;

    if (!DateHolder || DateHolder == null) {

      DateHolder = new Date();
      this.setState({
        DateHolder: DateHolder
      });
    }

    this.refs.DatePickerDialog.open({

      date: DateHolder,

    });

  }
  onDatePickedFunction = (date) => {
    this.setState({
      dobDate: date,
      DateText: moment(date).format('YYYY-MM-DD')
    });
  }
  updateValue(text, field) {
    var jars_delivered;
    var jars_picked;
    var amount_paid;
    if (field == 'jars_delivered') {
      this.setState({
        jars_delivered: text,
      })

    } else if (field == 'jars_picked') {

      this.setState({
        jars_picked: text,
      })
    } else if (field == 'amount_paid') {

      this.setState({
        amount_paid: text,
      })
    }


  }
  componentDidMount() {
      //Testing-appbiofresh@gmail.com
     return fetch('https://sheets.googleapis.com/v4/spreadsheets/1_sIKjoYU7wDlGysnna9cXvTLQdGGjjmP3lFzMmj0aWU/values/Sheet1!B2%3AB?key=AIzaSyCLby0W3hX6SVicmNz0HbZun8A8mHe-5kU')
  
     //Production-biofresh.hs@gmail.com
      //return fetch('https://sheets.googleapis.com/v4/spreadsheets/1fX-JTVl4V3l9bl30qL2wE-TJ-mI9wjxD1_gUUYJ9I1g/values/Customer_Details!B2%3AB?key=AIzaSyC1XLzcGsad9ji7aMNSdf5-9yliWeHinJQ')
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson);
        this.setState({
          dataSource: responseJson.values,
        }, function () {

        });
      })
      .catch((error) => {
        console.error(error);
      });
  }
  _onPressSignoutButton() {
    GoogleSignin.revokeAccess();HomeScreen
    GoogleSignin.signOut();
    

  }

  _onPressButton() {
    var name = "" + this.state.PickerValue;
    var jars_delivered = this.state.jars_delivered;
    var jars_picked = this.state.jars_picked;
    var amount_paid = this.state.amount_paid;
    var is_customername_field_empty = false;
    var is_jars_delivered_field_empty = false;
    var is_jars_picked_field_empty = false;
    var is_amount_paid_field_empty = false;
    let reg_ex = /^[0-9]+$/;

    console.log(name + " :" + jars_delivered + " :" + jars_picked + " :" + amount_paid);
    if (name == "" || name == "Select Name") {

      is_customername_field_empty = true;
    }
    if (jars_delivered == 0) {
      is_jars_delivered_field_empty = true;
    }
    if (is_customername_field_empty) {
      this.setState({
        error_message_name: "Please select a name.",
      });
    } else {
      this.setState({
        error_message_name: "",
      });
    }
    if (is_jars_delivered_field_empty) {
      this.setState({
        error_message_jars_delivered: "Please enter no. of jars delivered",
      });
    } else {
      if (reg_ex.test(jars_delivered)) {
        is_jars_delivered_field_empty = false;
        this.setState({
          error_message_jars_delivered: '',
        });
      } else {
        is_jars_delivered_field_empty = true;
        this.setState({
          error_message_jars_delivered: 'Please enter valid no. of jars delivered',
        });
      }
    }
    if (is_jars_picked_field_empty) {
      this.setState({
        error_message_jars_picked: "Jars picked cannot be empty.",
      });
    } else {
      if (reg_ex.test(jars_picked)) {
        is_jars_picked_field_empty = false;
        this.setState({
          error_message_jars_picked: '',
        });
      } else {
        is_jars_picked_field_empty = true;
        this.setState({
          error_message_jars_picked: 'Please enter valid no. of jars picked',
        });
      }
    }
    if (is_amount_paid_field_empty) {
      this.setState({
        error_message_amount_paid: "Amount paid cannot be empty.",
      });
    } else {
      if (reg_ex.test(amount_paid)) {
        is_amount_paid_field_empty = false;
        this.setState({
          error_message_amount_paid: '',
        });
      } else {
        is_amount_paid_field_empty = true;
        this.setState({
          error_message_amount_paid: 'Please enter valid amount.',
        });
      }
    }

    if (is_customername_field_empty == false && is_jars_delivered_field_empty == false && is_jars_picked_field_empty == false && is_amount_paid_field_empty == false) {

      const newRecord = {
        majorDimension: 'ROWS',
        values: [
          [
            this.props.username,
            this.state.DateText,
            name,
            jars_delivered,
            this.state.jars_picked,
            this.state.amount_paid,
          ]
        ]
      };
      //Testing-appbiofresh@gmail.com
     var url = 'https://sheets.googleapis.com/v4/spreadsheets/1_sIKjoYU7wDlGysnna9cXvTLQdGGjjmP3lFzMmj0aWU/values/Sheet2!A886:append?includeValuesInResponse=true&insertDataOption=INSERT_ROWS&responseDateTimeRenderOption=SERIAL_NUMBER&responseValueRenderOption=FORMATTED_VALUE&valueInputOption=RAW&fields=spreadsheetId%2CtableRange%2Cupdates&key=AIzaSyBnHeKJ6kNV4EQWEIojB2jFjzrqOKYbtSA';
      
    //Production-biofresh.hs@gmail.com 
     //var url = 'https://sheets.googleapis.com/v4/spreadsheets/1fX-JTVl4V3l9bl30qL2wE-TJ-mI9wjxD1_gUUYJ9I1g/values/Delivery!A886:append?includeValuesInResponse=true&insertDataOption=INSERT_ROWS&responseDateTimeRenderOption=SERIAL_NUMBER&responseValueRenderOption=FORMATTED_VALUE&valueInputOption=RAW&fields=spreadsheetId%2CtableRange%2Cupdates&key=AIzaSyC1XLzcGsad9ji7aMNSdf5-9yliWeHinJQ';
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

          ToastAndroid.showWithGravity('Customer updated successfully.', ToastAndroid.LONG, ToastAndroid.CENTER);

          console.log('Success:', response);
          this.setState({
            DateText: new Date().getFullYear() + "-" + ((new Date().getMonth()) + 1) + "-" + new Date().getDate(),
            PickerValue: '',
            jars_delivered: 0,
            jars_picked: 0,
            amount_paid: 0,
          });
        });
    };
    Keyboard.dismiss();
  }

  render() {

    return (
      
      <View style={styles.container}>
        <View style={{ flexDirection: 'row' }}  >
          <Text styles={styles.header}>EXISTING CUSTOMER</Text>
        </View>
        <View style={{ flexDirection: 'row' }}  >
          <View style={styles.label}><Text>Date</Text></View>
          <View style={styles.textInput}>

            <TouchableOpacity onPress={this.DatePickerMainFunctionCall.bind(this)} >

              <View style={styles.datePickerBox}>

                <Text style={styles.datePickerText}>{this.state.DateText}</Text>

              </View>

            </TouchableOpacity>
            <DatePickerDialog ref="DatePickerDialog" onDatePicked={this.onDatePickedFunction.bind(this)} />

          </View>
        </View>
        <View style={{ flexDirection: 'row' }}  >
          <View style={styles.label}><Text>Name</Text></View>
          <View style={styles.textInput}>
            <Picker
              selectedValue={this.state.PickerValue}
              onValueChange={(itemValue) => this.setState({
                PickerValue: itemValue
              })}>
              {this.state.dataSource.map((l, i) => { return <Picker.Item value={l} label={this.state.dataSource[i][0]} key={i} /> })}
            </Picker>
          </View>

        </View>
        <View style={styles.validating_form_textfield_name}>
          <Text style={styles.error_message_Text}>{this.state.error_message_name}</Text>
        </View>

        <View style={{ flexDirection: 'row' }}  >
          <View style={styles.label}><Text>Jars Delivered</Text></View>
          <View style={styles.textInput}><TextInput
            onChangeText={(text) => this.updateValue(text, 'jars_delivered')}>
            {this.state.jars_delivered}
          </TextInput></View>
        </View>
        <View style={styles.validating_form_textfield_jarsDelivered}>
          <Text style={styles.error_message_Text}>{this.state.error_message_jars_delivered}</Text>
        </View>
        <View style={{ flexDirection: 'row' }}  >
          <View style={styles.label}><Text>Jars Picked</Text></View>
          <View style={styles.textInput}><TextInput
            onChangeText={(text) => this.updateValue(text, 'jars_picked')}>
            {this.state.jars_picked}
          </TextInput></View>
        </View>
        <View style={styles.validating_form_textfield_jarsDelivered}>
          <Text style={styles.error_message_Text}>{this.state.error_message_jars_picked}</Text>
        </View>
        <View style={{ flexDirection: 'row' }}  >
          <View style={styles.label}><Text>Amount Paid</Text></View>
          <View style={styles.textInput}><TextInput
            onChangeText={(text) => this.updateValue(text, 'amount_paid')}>
            {this.state.amount_paid}
          </TextInput></View>
        </View>
        <View style={styles.validating_form_textfield_amount}>
          <Text style={styles.error_message_Text}>{this.state.error_message_amount_paid}</Text>
        </View>
        {/* <View style={{ flexDirection: 'row' }}  >

          <Text style={styles.success_message_Text}>{this.state.customer_updated_message}</Text>

        </View> */}

        <View style={{ flexDirection: 'row' }}  >

          <Button
            onPress={this._onPressButton.bind(this)}
            title="Submit"
            color="#841584" />


        </View>
        {/* <View style={{ width:450,marginTop:240}}  >
          <Button
            onPress={this._onPressSignoutButton.bind(this)}
            title="SignOut"
            color="deepskyblue"
           />
        </View> */}
        </View >
          
        

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
    color: 'green',
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
  datePickerBox: {
    marginTop: 9,
    borderColor: '#FF5722',
    borderWidth: 0.5,
    padding: 0,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
    height: 38,
    justifyContent: 'center'
  },

  datePickerText: {
    fontSize: 14,
    marginLeft: 5,
    borderWidth: 0,
    color: '#000',

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
    marginLeft: 45,
  },
  validating_form_textfield_jarsDelivered: {
    marginLeft: 110,
  },
  validating_form_textfield_amount: {
    marginLeft: 75,
  }
});






