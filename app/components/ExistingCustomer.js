import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, TextInput, Button, Alert, Picker } from 'react-native';
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
      PickerValue: "",
      dataSource: [],
    }
   
  }
  componentDidMount() {
   return fetch('https://sheets.googleapis.com/v4/spreadsheets/1xqigpFw7y0gTuKS1U9txjq7Sgk8qZ-0kIfSfDbx0OV8/values/Sheet1!A2%3AA?valueRenderOption=FORMATTED_VALUE&fields=majorDimension%2Crange%2Cvalues&key=AIzaSyByP26870vPBz2HS_Ea8LrJBTHHnZt4eDM')
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
    console.log(this.state.PickerValue[0]);
    var data = this.state.PickerValue;
   if (data == "") {
      alert("Please Select a name");
    } else {
      alert("Selected Name : " + data);
    }
  }
  render() {
   
    return (

      <View style={styles.container}>

        <Text styles={styles.header}>EXISTING CUSTOMER</Text>
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
          <View style={styles.textInput}><TextInput placeholder="Jars Delivered"></TextInput></View>
        </View>
        <View style={{ flexDirection: 'row' }}  >
          <View style={styles.label}><Text>Jars Picked</Text></View>
          <View style={styles.textInput}><TextInput placeholder="Jars Picked"></TextInput></View>
        </View>
        <View style={{ flexDirection: 'row' }}  >
          <View style={styles.label}><Text>Amount Paid</Text></View>
          <View style={styles.textInput}><TextInput placeholder="Amount Paid"></TextInput></View>
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
    //justifyContent: 'center',
    //backgroundColor: 'aquamarine',
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




