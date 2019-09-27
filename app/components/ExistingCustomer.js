import React, { Component } from 'react';
import { Platform, Text, View, TextInput, Button, Alert, Picker, TouchableOpacity, Keyboard, ToastAndroid, ScrollView, FlatList } from 'react-native';
import { DatePickerDialog } from 'react-native-datepicker-dialog';
import moment from 'moment';
import Autocomplete from 'react-native-autocomplete-input';
import { spreadsheet_ID, API_key, sheet_ID_GID } from '../../Test_Properties';
import ViewHistory  from '../components/ViewHistory';
import UpdateRecord from '../components/UpdateRecord';
import DeleteRecord from '../components/DeleteRecord';
import { styles } from '../Styles/ExistingCustomerStyles';

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
      amount_paid: 0,
      query: '',
      error_message_name: '',
      error_message_jars_delivered: '',
      error_message_jars_picked: '',
      error_message_amount_paid: '',
      hideAutoList:false,
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
    return dataSource2.filter((text) => text.name.search(regex) >= 0 );
  }
_POST_REQUEST(newRecord) {
    var url = 'https://sheets.googleapis.com/v4/spreadsheets/' + spreadsheet_ID + '/values/Shadab_Jeetu!A:B:append?includeValuesInResponse=true&insertDataOption=INSERT_ROWS&responseDateTimeRenderOption=SERIAL_NUMBER&responseValueRenderOption=FORMATTED_VALUE&valueInputOption=USER_ENTERED&fields=spreadsheetId%2CtableRange%2Cupdates&key=' + API_key;
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
        } else if (response.error.status == 'UNAUTHENTICATED') {
          Alert.alert("Your session has expired please login again!!!")
        }
      });
    }
 _PUT_REQUEST(newRecord) {
    var url = 'https://sheets.googleapis.com/v4/spreadsheets/' + spreadsheet_ID + '/values/Shadab_Jeetu!A' + this.state.cellNo + '%3AB' + this.state.cellNo + '?includeValuesInResponse=true&responseDateTimeRenderOption=FORMATTED_STRING&responseValueRenderOption=FORMATTED_VALUE&valueInputOption=USER_ENTERED&fields=spreadsheetId%2CupdatedCells%2CupdatedColumns%2CupdatedData%2CupdatedRange%2CupdatedRows&key=' + API_key;
    fetch(url, {
      method: 'PUT',
      body: JSON.stringify(newRecord),
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + this.props.accesstoken,
      }
    }).then(res => res.json())
      .catch(error => console.error('Error:', error))
      .then((response) => {
        if (response.updates != null) {
        } else if (response.error.status == 'UNAUTHENTICATED') {
          Alert.alert("Your session has expired please login again!!!")
        }
      });
    }

_GET_REQUEST_to_get_sumOfJarsDelivered_Shadab_JeetuSheet_POST(date) {
    var SQL_QUERY = "SELECT SUM(D) where B = date'" + date + "'";
    var ENCODED_SQL_QUERY = encodeURI(SQL_QUERY);
    var URL = 'https://docs.google.com/spreadsheets/d/' + spreadsheet_ID + '/gviz/tq?gid=' + sheet_ID_GID + '&headers=1&tq=' + ENCODED_SQL_QUERY;
    fetch(URL)
      .then(async (response) => {
        var ResponseObjectnew = await (new Response(response._bodyBlob)).text();
        var newrecord1 = ResponseObjectnew.substring(ResponseObjectnew.indexOf("(") + 1, ResponseObjectnew.lastIndexOf(")"));
        var newrecord = "{" + newrecord1.substring((newrecord1.indexOf("rows") - 1), newrecord1.lastIndexOf("]") + 1) + "}";
        var response1 = JSON.parse(newrecord);
        let newRecord = {};
        if (!response1.rows.length == 0) {
          newRecord = {
            majorDimension: 'ROWS',
            values: [
              [
                date,
                response1.rows[0].c[0].v,
              ]
            ]
          };
        } else {
          newRecord = {
            majorDimension: 'ROWS',
            values: [
              [
                date,
                this.state.jars_delivered,
              ]
            ]
          };
        }
        return fetch('https://sheets.googleapis.com/v4/spreadsheets/' + spreadsheet_ID + '/values/Shadab_Jeetu!A:B?key=' + API_key)
          .then((response) => response.json())
          .then((responseJson) => {
            var customer_records = responseJson.values;
            if (typeof customer_records === 'undefined') {
              this._POST_REQUEST(newRecord);
            } else {
              this.setState({
                cellNo: '',
              });
              for (let i = 0; i < customer_records.length; i++) {
                if (customer_records[i][0] == date) {
                  this.setState({
                    cellNo: i + 1
                  });
                  break;
                }
              }
            }
            if (this.state.cellNo == '') {
              this._POST_REQUEST(newRecord);
            }
            else {
              this._PUT_REQUEST(newRecord);
            }
          });
      });
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
    if (name == "") {
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
        error_message_jars_delivered: "Enter jars delivered.",
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
          error_message_jars_delivered: 'Please enter valid no. of jars delivered.',
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
        error_message_jars_picked: 'Please enter valid no. of jars picked.',
      });
    }
    if (amount_paid == 0) {
      is_amount_paid_field_empty = true;
    }
    if (is_amount_paid_field_empty) {
      this.setState({
        error_message_amount_paid: "Please enter valid amount.",
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
      var url = 'https://sheets.googleapis.com/v4/spreadsheets/' + spreadsheet_ID + '/values/Delivery!A:F:append?includeValuesInResponse=true&insertDataOption=INSERT_ROWS&responseDateTimeRenderOption=SERIAL_NUMBER&responseValueRenderOption=FORMATTED_VALUE&valueInputOption=USER_ENTERED&fields=spreadsheetId%2CtableRange%2Cupdates&key=' + API_key;
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
            var date = this.state.DateText;
            this._GET_REQUEST_to_get_sumOfJarsDelivered_Shadab_JeetuSheet_POST(date);
            this.setState({
              DateText: new Date().getFullYear() + "-" + ('0' + (new Date().getMonth() + 1)).slice(-2) + "-" + new Date().getDate(),
              query: '',
              jars_delivered: 0,
              jars_picked: 0,
              amount_paid: 0,
            });
            ToastAndroid.showWithGravity('Customer added successfully.', ToastAndroid.LONG, ToastAndroid.CENTER);
          } else if (response.error.status == 'UNAUTHENTICATED') {
            Alert.alert("Your session has expired please login again!!!")
          }
        });
    };
    Keyboard.dismiss();
  }
_GET_REQUEST_to_get_allcustomerrecords_DeliverySheet(name, date) {
    this.setState({
      query: name,
      jars_delivered: 0,
      jars_picked: 0,
      amount_paid: 0,
      hideAutoList:true,
    })
    return fetch('https://sheets.googleapis.com/v4/spreadsheets/' + spreadsheet_ID + '/values/Delivery!A:G?key=' + API_key)
      .then((response) => response.json())
      .then((responseJson) => {
        var customer_records = responseJson.values;
        for (let i = 3; i < customer_records.length; i++) {
          if (customer_records[i][1] == date && customer_records[i][2] == name) {
            this.setState({
              jars_delivered: customer_records[i][3],
              jars_picked: customer_records[i][4],
              amount_paid: customer_records[i][5],
            });
            break;
          }
        }
      });
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
              hideResults={this.state.hideAutoList}
              onChangeText={text => this.setState({ query: text,hideAutoList:false})}
              placeholder="Please enter name"
              renderItem={({ item,i }) => (
                <TouchableOpacity onPress={() => this._GET_REQUEST_to_get_allcustomerrecords_DeliverySheet(item.name, this.state.DateText)}>
                  <Text style={styles.itemText}>
                    {item.name}
                  </Text>
                </TouchableOpacity>
              )}
              keyExtractor={(name, index) => index.toString()}
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
          <UpdateRecord query={this.state.query} DateText={this.state.DateText} accesstoken={this.props.accesstoken}
                        jars_delivered={this.state.jars_delivered} jars_picked={this.state.jars_picked} amount_paid={this.state.amount_paid} />
          <DeleteRecord query={this.state.query} DateText={this.state.DateText} accesstoken={this.props.accesstoken} />
        </View>
        <ViewHistory username={this.props.username}/>
      </View >
    );
  }
}


