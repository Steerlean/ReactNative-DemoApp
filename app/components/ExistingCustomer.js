import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, TextInput, Button, Alert, Picker, TouchableOpacity } from 'react-native';
import { DatePickerDialog } from 'react-native-datepicker-dialog'
import moment from 'moment';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});
export class ExistingCustomer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      DateText: '',
      DateHolder: null,
      dataSource: [],
      jars_delivered: '',
      jars_picked: '',
      amount_paid: '',
      isDateTimePickerVisible: false,

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
    return fetch('https://sheets.googleapis.com/v4/spreadsheets/1xqigpFw7y0gTuKS1U9txjq7Sgk8qZ-0kIfSfDbx0OV8/values/CustomerDetails!A2%3AA?valueRenderOption=FORMATTED_VALUE&fields=majorDimension%2Crange%2Cvalues&key=AIzaSyCLby0W3hX6SVicmNz0HbZun8A8mHe-5kU')
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

  _onPressButton() {
   var name = "" + this.state.PickerValue;
    if (name == "") {
      alert("Please Select a name");
    } else {

      alert("Selected Name : " + name);
    }

    const newRecord = {
      majorDimension: 'ROWS',
      values: [
        [
          this.state.DateText,
          name,
          this.state.jars_delivered,
          this.state.jars_picked,
          this.state.amount_paid,
        ]
      ]
    };

    var url = 'https://sheets.googleapis.com/v4/spreadsheets/1xqigpFw7y0gTuKS1U9txjq7Sgk8qZ-0kIfSfDbx0OV8/values/Delivery!A886%3AB:append?valueInputOption=RAW&fields=spreadsheetId%2CtableRange%2Cupdates&key=AIzaSyCLby0W3hX6SVicmNz0HbZun8A8mHe-5kU';
    fetch(url, {
      method: 'POST',
      body: JSON.stringify(newRecord),
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer ya29.GlwEBlyPbuL2vW2-9mXOZe5Zy9ILftYJIOI3uZ9xOz8Ex7khMTH1_8GCA0yOqO-LajVyPhCyZVgF63KaUB7OiGPUxcNmHMEcVENxbNI_34XahsguBugHYsTHudxilA",
      }
    })
      .then(res => res.json())
      .catch(error => console.error('Error:', error))
      .then((response) => {
        alert('Customer updated in sheet successfully!!');
        console.log('Success:', response);
      });


  };

  render() {

    return (

      <View style={styles.container}>

        <Text styles={styles.header}>EXISTING CUSTOMER</Text>
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
        <View style={{ flexDirection: 'row' }}  >
          <View style={styles.label}><Text>Jars Delivered</Text></View>
          <View style={styles.textInput}><TextInput placeholder="Jars Delivered"
            onChangeText={(text) => this.updateValue(text, 'jars_delivered')}>
          </TextInput></View>
        </View>
        <View style={{ flexDirection: 'row' }}  >
          <View style={styles.label}><Text>Jars Picked</Text></View>
          <View style={styles.textInput}><TextInput placeholder="Jars Picked"
            onChangeText={(text) => this.updateValue(text, 'jars_picked')}>
          </TextInput></View>
        </View>
        <View style={{ flexDirection: 'row' }}  >
          <View style={styles.label}><Text>Amount Paid</Text></View>
          <View style={styles.textInput}><TextInput placeholder="Amount Paid"
            onChangeText={(text) => this.updateValue(text, 'amount_paid')}>
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


});




