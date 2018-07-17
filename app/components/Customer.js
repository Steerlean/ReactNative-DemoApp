import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, TextInput, Button, Alert } from 'react-native';
import { AddNewCustomer } from './AddNewCustomer';
import { ExistingCustomer } from './ExistingCustomer';


const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});


export  class Customer extends Component {
  constructor() {

    super();

    this.state = {

      NewCustomerstatus: false,
      ExistingCustomerstatus: true,

    }
  }

  ShowHideTextComponentNewCustomer = () => {

    this.setState({ ExistingCustomerstatus: false })
    this.setState({ NewCustomerstatus: true })


  }
  ShowHideTextComponentExistingCustomer = () => {


    this.setState({ NewCustomerstatus: false })
    this.setState({ ExistingCustomerstatus: true })

  }
  render() {
    return (
      
      <View style={{ flex: 1, }}>
        
        <View style={styles.buttonTabsContainer}>
          <View style={styles.buttonTab}>
            <Button
              onPress={this.ShowHideTextComponentExistingCustomer}

              title="Existing Customer"
              color="deepskyblue" />
          </View>
          <View style={styles.buttonTab}>
            <Button
              onPress={this.ShowHideTextComponentNewCustomer}

              title="New Customer"
              color="deepskyblue" />
          </View>

        </View>
      
        <View style={styles.container}>{
          this.state.ExistingCustomerstatus ? <ExistingCustomer /> : null
        }
       
          <View style={styles.container}>{
            this.state.NewCustomerstatus ? <AddNewCustomer /> : null
          }
          
          </View>
          </View>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  buttonTabsContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
    paddingTop: 14,
  },
  buttonTab: {
    flex: 1,
  },
  container: {
    flex: 80,
    justifyContent: 'center',
    backgroundColor: 'aquamarine',
    paddingLeft: 20,
    paddingRight: 20,
    alignItems: 'center',
    alignSelf: 'stretch'
  },
});

