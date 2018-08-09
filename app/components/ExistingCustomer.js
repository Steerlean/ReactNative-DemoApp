import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, TextInput, Button, Alert, Picker, TouchableOpacity, Keyboard, ToastAndroid, ScrollView, FlatList } from 'react-native';
import { DatePickerDialog } from 'react-native-datepicker-dialog';
import moment from 'moment';
import Autocomplete from 'react-native-autocomplete-input';
import { spreadsheet_ID, API_key } from '../../Test_Properties';

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
      DateText: new Date().getFullYear() + "-" + ('0' + (new Date().getMonth() + 1)).slice(-2) + "-" + new Date().getDate(),
      DateHolder: null,
      dataSource: [],
      jars_delivered: 0,
      jars_picked: 0,
      amount_paid: '',
      query: '',
      error_message_name: '',
      error_message_jars_delivered: '',
      error_message_jars_picked: '',
      error_message_amount_paid: '',
      history_records: [],
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
      DateText: moment(date).format('YYYY-MM-D')
    });
  }
  updateValue(text, field) {
    if (field == 'name') {
      this.setState({
        selectName: text,
      })
    } else if (field == 'jars_delivered') {
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
    return fetch('https://sheets.googleapis.com/v4/spreadsheets/' + spreadsheet_ID + '/values/Customer_Details!B3%3AB?key=' + API_key)
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson);
        this.setState({
          dataSource: responseJson.values,
        }, function () { });
      })
      .catch((error) => {
        console.error(error);
      });
  }
  findRecord(query) {
    if (query === '') {
      return [];
    }
    const dataSource2 = [];
    for (let i = 0; i < this.state.dataSource.length; i++) {
      const obj = {};
      obj["name"] = this.state.dataSource[i][0];
      if (obj.name != null) {
        dataSource2.push(obj);
      }
    }
    const regex = new RegExp(`${query.trim()}`, 'i');
    return dataSource2.filter((text) =>
      text.name.search(regex) >= 0
    );
  }

  _onPressButton() {
    var name = this.state.query;
    var jars_delivered = this.state.jars_delivered;
    var jars_picked = this.state.jars_picked;
    var amount_paid = this.state.amount_paid;
    var is_customername_field_empty = false;
    var is_jars_delivered_field_empty = false;
    var is_jars_picked_field_empty = false;
    var is_amount_paid_field_empty = false;
    let reg_ex = /^[0-9]+$/;

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
      var url = 'https://sheets.googleapis.com/v4/spreadsheets/' + spreadsheet_ID + '/values/Delivery!A:F:append?includeValuesInResponse=true&insertDataOption=INSERT_ROWS&responseDateTimeRenderOption=SERIAL_NUMBER&responseValueRenderOption=FORMATTED_VALUE&valueInputOption=RAW&fields=spreadsheetId%2CtableRange%2Cupdates&key=' + API_key;
      fetch(url, {
        method: 'POST',
        body: JSON.stringify(newRecord),
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + this.props.accesstoken,
        }
      }).then(res => res.json())
        .catch(error => console.error('Error:', error))
        .then((response) => {
          if (response.updates != null) {
            ToastAndroid.showWithGravity('Customer added successfully.', ToastAndroid.LONG, ToastAndroid.CENTER);
            console.log('Success:', response);
            this.setState({
              DateText: new Date().getFullYear() + "-" + ('0' + (new Date().getMonth() + 1)).slice(-2) + "-" + new Date().getDate(),
              query: '',
              jars_delivered: 0,
              jars_picked: 0,
              amount_paid: '',

            });
          } else if (response.error.status == 'UNAUTHENTICATED') {
            Alert.alert("Your session has expired please login again!!!")
          }
        });
    };
    Keyboard.dismiss();
  }
  onViewPress() {
    fetch('https://sheets.googleapis.com/v4/spreadsheets/' + spreadsheet_ID + '/values/AddedBy?key=' + API_key)
      .then((response) => response.json())
      .then((responseJson) => {
        console.log('Added By: ', responseJson);
        this.setState({
          history_records: responseJson.values,
        }, function () { });
      })
      .catch((error) => {
        console.error(error);
      });
    // {date:'2018-06-11',key: 'Devin Kumar',JarsDeliverd:5,JarsPicked:2,Amount:500},
  }

  render() {
    const { query } = this.state;
    const dataSource = this.findRecord(query);
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
          <View style={{ width: 200 }}>
            <Autocomplete
              autoCapitalize="none"
              autoCorrect={false}
              containerStyle={styles.autocompleteContainer}
              data={dataSource}
              defaultValue={query}
              onChangeText={text => this.setState({ query: text })}
              placeholder="Please enter name"
              renderItem={({ name }) => (
                <TouchableOpacity onPress={() => this.setState({ query: name })}>
                  <Text style={styles.itemText}>
                    {name}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
        <View style={styles.validating_form_textfield_name}>
          <Text style={styles.error_message_Text}>{this.state.error_message_name}</Text>
        </View>
        <View style={{ flexDirection: 'row' }}  >
          <View style={styles.label}><Text>Jars Delivered</Text></View>
          <View style={styles.textInput}>
            <TextInput
              onChangeText={(text) => this.updateValue(text, 'jars_delivered')}
              keyboardType="number-pad">
              {this.state.jars_delivered}
            </TextInput>
          </View>
        </View>
        <View style={styles.validating_form_textfield_jarsDelivered}>
          <Text style={styles.error_message_Text}>{this.state.error_message_jars_delivered}</Text>
        </View>
        <View style={{ flexDirection: 'row' }}  >
          <View style={styles.label}><Text>Jars Picked</Text></View>
          <View style={styles.textInput}><TextInput
            onChangeText={(text) => this.updateValue(text, 'jars_picked')}
            keyboardType="number-pad">
            {this.state.jars_picked}
          </TextInput></View>
        </View>
        <View style={styles.validating_form_textfield_jarsDelivered}>
          <Text style={styles.error_message_Text}>{this.state.error_message_jars_picked}</Text>
        </View>
        <View style={{ flexDirection: 'row' }}  >
          <View style={styles.label}><Text>Amount Paid</Text></View>
          <View style={styles.textInput}><TextInput
            onChangeText={(text) => this.updateValue(text, 'amount_paid')}
            keyboardType="number-pad">
            {this.state.amount_paid}
          </TextInput></View>
        </View>
        <View style={styles.validating_form_textfield_amount}>
          <Text style={styles.error_message_Text}>{this.state.error_message_amount_paid}</Text>
        </View>
        <View style={{ flexDirection: 'row' }}  >
          <TouchableOpacity onPress={this._onPressButton.bind(this)}>
            <View style={styles.buttonSubmit}>
              <Text style={styles.buttonText}>Submit</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.onViewPress.bind(this)}>
            <View style={styles.buttonSubmit}>
              <Text style={styles.buttonText}>View History</Text>
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.container}>
          <ScrollView horizontal={true}>
            <FlatList
              data={this.state.history_records}
              renderItem={({ item }) => <Text style={styles.item}>{item[1]}   {item[2]}   {item[3]}   {item[4]}   {item[5]}</Text>}
              ItemSeparatorComponent={() => <View style={{ width: 1, height: 1, backgroundColor: '' }} />}
            />
          </ScrollView>
        </View>
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
    marginTop: 10,
    marginBottom: 10,
    marginRight: 10,
    height: 40,
    width: 100,
    alignItems: 'center',
    backgroundColor: '#841584'
  },
  buttonText: {
    color: 'white',
    padding: 10
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
  validating_form_textfield_name: {
    marginLeft: 45,
  },
  validating_form_textfield_jarsDelivered: {
    marginLeft: 110,
  },
  validating_form_textfield_amount: {
    marginLeft: 75,
  },
  autocompleteContainer: {
    flex: 1,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 1,
  },
  itemText: {
    fontSize: 15,
    margin: 2
  },
  item: {
    backgroundColor: 'aquamarine',
  }
});






