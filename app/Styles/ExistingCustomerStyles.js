import { StyleSheet } from 'react-native';

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

export { styles };    