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
      color: 'black',
      borderBottomColor: 'darkgrey',
      borderBottomWidth: 1,
      paddingBottom: 20,
      fontWeight: 'bold',
    },
    buttonSubmit: {
      marginTop: 10,
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
    error_message_Text: {
      color: 'red',
      marginLeft: 10,
    },
    validating_form_textfield_name: {
      marginLeft: 30,
    },
    validating_form_textfield_address: {
      marginLeft: 40,
    },
    validating_form_textfield_phone: {
      marginLeft: 80,
    },
    validating_form_textfield_total: {
      marginLeft: 80,
    },
    container_radio: {
      marginTop: 40,
  
    },
    text_radio: {
      padding: 10,
      fontSize: 14,
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
    }
  });

export { styles };      