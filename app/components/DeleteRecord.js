import React, { Component } from 'react';
import { spreadsheet_ID, API_key, sheet_ID_GID } from '../../Test_Properties';
import { Text, View, TouchableOpacity, Alert, ToastAndroid } from 'react-native';
import { commonStyles } from '../Styles/CommonStyles';

class DeleteRecord extends Component {
    state = { 
        cellNo: ''
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
    _GET_REQUEST_to_get_sumOfJarsDelivered_Shadab_JeetuSheet_PUT(date, buttonUpdateDelete) {
        var SQL_QUERY = "SELECT SUM(D) where B = date'" + date + "'";
        var ENCODED_SQL_QUERY = encodeURI(SQL_QUERY);
        var URL = 'https://docs.google.com/spreadsheets/d/' + spreadsheet_ID + '/gviz/tq?gid=' + sheet_ID_GID + '&headers=1&tq=' + ENCODED_SQL_QUERY;
        fetch(URL)
          .then(async (response) => {
            var ResponseObjectnew = await (new Response(response._bodyBlob)).text();
            var newrecord1 = ResponseObjectnew.substring(ResponseObjectnew.indexOf("(") + 1, ResponseObjectnew.lastIndexOf(")"));
            var newrecord = "{" + newrecord1.substring((newrecord1.indexOf("rows") - 1), newrecord1.lastIndexOf("]") + 1) + "}";
            var response1 = JSON.parse(newrecord);
            let newRecord;
            if (response1.rows.length == 0 && buttonUpdateDelete == 'delete') {
              newRecord = {
                majorDimension: 'ROWS',
                values: [[ date,0,]]
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
                }
                if (!this.state.cellNo == '') {
                  this._PUT_REQUEST(newRecord);
                } else {
                  this._POST_REQUEST(newRecord);
                }
              });
          });
      }
    _onPressDeleteButton() {
        return fetch('https://sheets.googleapis.com/v4/spreadsheets/' + spreadsheet_ID + '/values/Delivery!A:D?key=' + API_key)
          .then((response) => response.json())
          .then((responseJson) => {
            var name = "" + this.props.query;
            var date = this.props.DateText;
            var customer_records = responseJson.values;
            for (let i = 3; i < customer_records.length; i++) {
              if (customer_records[i][1] == date && customer_records[i][2] == name) {
                this.setState({
                  cellNo: i + 1
                });
                break;
              }
            }
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
                    var date = this.props.DateText;
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
    render() { 
        return ( 
            <View>
                <TouchableOpacity onPress={this._onPressDeleteButton.bind(this)}>
                    <View style={commonStyles.buttonSubmit}>
                        <Text style={commonStyles.buttonText}>Delete</Text>
                    </View>
                </TouchableOpacity>
            </View>    
         );
    }
}
export default DeleteRecord;