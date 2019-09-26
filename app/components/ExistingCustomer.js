import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, TextInput, Button, Alert, Picker, TouchableOpacity, Keyboard, ToastAndroid, ScrollView, FlatList } from 'react-native';
import { DatePickerDialog } from 'react-native-datepicker-dialog';
import moment from 'moment';
import Autocomplete from 'react-native-autocomplete-input';
import { spreadsheet_ID, API_key, sheet_ID_GID } from '../../Test_Properties';

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
      history_records: [],
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
        console.log('Customer Data response:',responseJson);
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
    // console.log('query:',query);
    const regex = new RegExp(`${query.trim()}`, 'i');
    // console.log('regex:',regex);
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
          console.log('Success:', response);
        } else if (response.error.status == 'UNAUTHENTICATED') {
          Alert.alert("Your session has expired please login again!!!")
        }
      });

  }
  _PUT_REQUEST(newRecord) {
    var url = 'https://sheets.googleapis.com/v4/spreadsheets/' + spreadsheet_ID + '/values/Shadab_Jeetu!A' + this.state.cellNo + '%3AB' + this.state.cellNo + '?includeValuesInResponse=true&responseDateTimeRenderOption=FORMATTED_STRING&responseValueRenderOption=FORMATTED_VALUE&valueInputOption=USER_ENTERED&fields=spreadsheetId%2CupdatedCells%2CupdatedColumns%2CupdatedData%2CupdatedRange%2CupdatedRows&key=' + API_key;
    console.log("URL", url);
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
          console.log('Success:', response);
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
      .then((response) => {
        var ResponseObjectnew = response._bodyText;
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
            console.log("CUSTOMER_RECORDS::", customer_records);
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
              console.log("CellNoSubmit::", this.state.cellNo);
            }
            console.log("NewRecordNOTNULL::", newRecord);
            if (this.state.cellNo == '') {
              this._POST_REQUEST(newRecord);
            }
            else {
              this._PUT_REQUEST(newRecord);
            }
          });
      });
  }
  _GET_REQUEST_to_get_sumOfJarsDelivered_Shadab_JeetuSheet_PUT(date, buttonUpdateDelete) {
    var SQL_QUERY = "SELECT SUM(D) where B = date'" + date + "'";
    var ENCODED_SQL_QUERY = encodeURI(SQL_QUERY);
    var URL = 'https://docs.google.com/spreadsheets/d/' + spreadsheet_ID + '/gviz/tq?gid=' + sheet_ID_GID + '&headers=1&tq=' + ENCODED_SQL_QUERY;
    fetch(URL)
      .then((response) => {
        var ResponseObjectnew = response._bodyText;
        var newrecord1 = ResponseObjectnew.substring(ResponseObjectnew.indexOf("(") + 1, ResponseObjectnew.lastIndexOf(")"));
        var newrecord = "{" + newrecord1.substring((newrecord1.indexOf("rows") - 1), newrecord1.lastIndexOf("]") + 1) + "}";
        var response1 = JSON.parse(newrecord);
        let newRecord;
        if (response1.rows.length == 0 && buttonUpdateDelete == 'delete') {
          newRecord = {
            majorDimension: 'ROWS',
            values: [
              [
                date,
                0,

              ]
            ]
          };
        }else{
        newRecord = {
          majorDimension: 'ROWS',
          values: [
            [
              date,
              response1.rows[0].c[0].v,

            ]
          ]
        };
      }
        return fetch('https://sheets.googleapis.com/v4/spreadsheets/' + spreadsheet_ID + '/values/Shadab_Jeetu!A:B?key=' + API_key)
          .then((response) => response.json())
          .then((responseJson) => {
            var customer_records = responseJson.values;
            if (typeof customer_records === 'undefined' && buttonUpdateDelete == 'update') {
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
              console.log("CellNoSubmit::", this.state.cellNo);
            }
            if (!this.state.cellNo == '') {
              this._PUT_REQUEST(newRecord);
            } else {
              this._POST_REQUEST(newRecord);
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
      console.log(newRecord)
      var url = 'https://sheets.googleapis.com/v4/spreadsheets/' + spreadsheet_ID + '/values/Delivery!A:F:append?includeValuesInResponse=true&insertDataOption=INSERT_ROWS&responseDateTimeRenderOption=SERIAL_NUMBER&responseValueRenderOption=FORMATTED_VALUE&valueInputOption=USER_ENTERED&fields=spreadsheetId%2CtableRange%2Cupdates&key=' + API_key;

      console.log(url)
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
            console.log('Success:', response);
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
  _onPressUpdateButton() {
    return fetch('https://sheets.googleapis.com/v4/spreadsheets/' + spreadsheet_ID + '/values/Delivery!A:C?key=' + API_key)
      .then((response) => response.json())
      .then((responseJson) => {
        var name = "" + this.state.query;
        var date = this.state.DateText;
        var customer_records = responseJson.values;
        this.setState({
          cellNo: '',
        });
        for (let i = 3; i < customer_records.length; i++) {
          if (customer_records[i][1] == date && customer_records[i][2] == name) {
            this.setState({
              cellNo: i + 1
            });
            break;
          }
        }
        console.log("CellNO3::" + this.state.cellNo)
        if (!this.state.cellNo == '') {
          const newRecord = {
            majorDimension: 'ROWS',
            values: [
              [
                this.state.jars_delivered,
                this.state.jars_picked,
                this.state.amount_paid,

              ]
            ]
          };
          return fetch('https://sheets.googleapis.com/v4/spreadsheets/' + spreadsheet_ID + '/values/Delivery!D' + this.state.cellNo + '%3AF' + this.state.cellNo + '?includeValuesInResponse=true&responseDateTimeRenderOption=FORMATTED_STRING&responseValueRenderOption=FORMATTED_VALUE&valueInputOption=USER_ENTERED&fields=spreadsheetId%2CupdatedCells%2CupdatedColumns%2CupdatedData%2CupdatedRange%2CupdatedRows&key=' + API_key, {
            method: 'PUT',
            body: JSON.stringify(newRecord),
            headers: {
              "Content-Type": "application/json",
              "Authorization": "Bearer " + this.props.accesstoken,
            }
          })
            .then(response => response.json())
            .catch(error => console.error('Error:', error))
            .then((response) => {
              console.log(response)
              if (response.updatedRows != null) {
                console.log('Success:', response);
                var date = this.state.DateText;
                var update = "update";
                this._GET_REQUEST_to_get_sumOfJarsDelivered_Shadab_JeetuSheet_PUT(date, update);
                this.setState({
                  cellNo: '',
                  DateText: new Date().getFullYear() + "-" + ('0' + (new Date().getMonth() + 1)).slice(-2) + "-" + new Date().getDate(),
                  query: '',
                  jars_delivered: 0,
                  jars_picked: 0,
                  amount_paid: 0,
                });
                ToastAndroid.showWithGravity('Customer updated successfully.', ToastAndroid.LONG, ToastAndroid.CENTER);
              } else if (response.error.status == 'UNAUTHENTICATED') {
                Alert.alert("Your session has expired please login again!!!")
              }
            });
        } else {
          Alert.alert("Name:" + this.state.query + " Date:" + date + " does not exists in sheet!!!");
        }
      });
  }
  _onPressDeleteButton() {
    return fetch('https://sheets.googleapis.com/v4/spreadsheets/' + spreadsheet_ID + '/values/Delivery!A:D?key=' + API_key)
      .then((response) => response.json())
      .then((responseJson) => {
        var name = "" + this.state.query;
        var date = this.state.DateText;
        var customer_records = responseJson.values;
        console.log(customer_records)
        for (let i = 3; i < customer_records.length; i++) {
          if (customer_records[i][1] == date && customer_records[i][2] == name) {
            this.setState({
              cellNo: i + 1
            });
            break;
          }
        }
        console.log("CellNO::" + this.state.cellNo)
        if (!this.state.cellNo == '') {
          const newRecord = {
            "requests": [
              {
                "deleteDimension": {
                  "range": {
                    "sheetId": sheet_ID_GID,
                    "dimension": "ROWS",
                    "startIndex": (this.state.cellNo - 1),
                    "endIndex": this.state.cellNo
                  }
                }
              }
            ]

          };
          var url = 'https://sheets.googleapis.com/v4/spreadsheets/' + spreadsheet_ID + ':batchUpdate';
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
              if (response.replies != null) {
                // console.log('Success:', response);
                var date = this.state.DateText;
                var deLete = 'delete';
                this._GET_REQUEST_to_get_sumOfJarsDelivered_Shadab_JeetuSheet_PUT(date, deLete);
                this.setState({
                  cellNo: '',
                  DateText: new Date().getFullYear() + "-" + ('0' + (new Date().getMonth() + 1)).slice(-2) + "-" + new Date().getDate(),
                  query: '',
                  jars_delivered: 0,
                  jars_picked: 0,
                  amount_paid: 0,
                });
                ToastAndroid.showWithGravity('Customer deleted successfully.', ToastAndroid.LONG, ToastAndroid.CENTER);
              } else if (response.error.status == 'UNAUTHENTICATED') {
                Alert.alert("Your session has expired please login again!!!")
              }
            });
        } else {
          Alert.alert("Name:" + name + " Date:" + date + " does not exists in sheet!!!");
        }
      });
  }
  onViewPress() {
    var SQL_QUERY = "SELECT B,C,D,E,F WHERE A = '" + this.props.username + "'ORDER BY B DESC";
    var ENCODED_SQL_QUERY = encodeURI(SQL_QUERY);
    var URL = 'https://docs.google.com/spreadsheets/d/' + spreadsheet_ID + '/gviz/tq?gid=' + sheet_ID_GID + '&headers=1&tq=' + ENCODED_SQL_QUERY;
    // console.log(URL);
    fetch(URL)
      .then(async (response) => {
        var ResponseObjectnew = await (new Response(response._bodyBlob)).text();
        var newrecord1 = ResponseObjectnew.substring(ResponseObjectnew.indexOf("(") + 1, ResponseObjectnew.lastIndexOf(")"));
        var newrecord = "{" + newrecord1.substring((newrecord1.indexOf("rows") - 1), newrecord1.lastIndexOf("]") + 1) + "}";
        var response1 = JSON.parse(newrecord);
        // console.log(response1);
        const customer_records = [];
        if (!response1.rows.length == 0) {
          for (let i = 0; i < response1.rows.length; i++) {
            const obj = {};

            if (response1.rows[i].c[0] != null) {
              obj["Date"] = response1.rows[i].c[0].f + " | ";
            } else {
              obj["Date"] = "NA" + " |";
            }

            if (response1.rows[i].c[1] != null) {
              obj["Name"] = response1.rows[i].c[1].v + " |";
            } else {
              obj["Name"] = "NA" + " |";
            }

            if (response1.rows[i].c[2] != null) {
              obj["JarsDelivered"] = response1.rows[i].c[2].v + " |";
            } else {
              obj["JarsDelivered"] = "NA" + " |";
            }

            if (response1.rows[i].c[3] != null) {
              obj["JarsPicked"] = response1.rows[i].c[3].v + " |";
            } else {
              obj["JarsPicked"] = "NA" + " |";
            }

            if (response1.rows[i].c[4].v != null) {

              obj["AmountPaid"] = response1.rows[i].c[4].v;
            } else {

              obj["AmountPaid"] = "NA";
            }

            customer_records.push(obj);

          }
        } else {
          const obj1 = {};
          obj1["Date"] = 'No records found';
          obj1["Name"] = '';
          obj1["JarsDelivered"] = '';
          obj1["JarsPicked"] = '';
          obj1["AmountPaid"] = '';
          customer_records.push(obj1);
        }
        this.setState({
          history_records: customer_records,
        });
      })
      .then((response) => { })
      .catch((error) => {
        console.error(error);
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
              renderItem={({ name,i }) => (
                <TouchableOpacity onPress={() => this._GET_REQUEST_to_get_allcustomerrecords_DeliverySheet(name, this.state.DateText)}>
                  <Text style={styles.itemText}>
                    {name}
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
          <TouchableOpacity onPress={this._onPressUpdateButton.bind(this)}>
            <View style={styles.buttonSubmit}>
              <Text style={styles.buttonText}>Update</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={this._onPressDeleteButton.bind(this)}>
            <View style={styles.buttonSubmit}>
              <Text style={styles.buttonText}>Delete</Text>
            </View>
          </TouchableOpacity>
        </View>
        <View style={{ flexDirection: 'row' }}  >
          <TouchableOpacity onPress={this.onViewPress.bind(this)}>
            <View style={styles.buttonView}>
              <Text style={styles.buttonText}>View History</Text>
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.container}>
          <ScrollView horizontal={true}>
            <FlatList
              data={this.state.history_records}
              renderItem={({ item }) => <Text style={styles.item}>{item.Date}  {item.Name}  {item.JarsDelivered}  {item.JarsPicked}  {item.AmountPaid}</Text>}
              ItemSeparatorComponent={() => <View style={{ width: 1, height: 1, backgroundColor: '' }} />}
              keyExtractor={(item, index) => index.toString()}
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
    marginBottom: 5,
    marginRight: 10,
    height: 40,
    width: 100,
    alignItems: 'center',
    backgroundColor: '#841584'
  },
  buttonView: {
    marginBottom: 5,
    marginRight: 10,
    height: 40,
    width: 320,
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
    backgroundColor: 'white',
  }
});
