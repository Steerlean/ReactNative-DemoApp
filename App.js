import React from 'react';
import { Button, View, Text, StyleSheet, Alert, Image,ToastAndroid } from 'react-native';
import { createStackNavigator } from 'react-navigation';
import { Customer } from './app/components/Customer';
import { GoogleSignin, GoogleSigninButton } from 'react-native-google-signin';
import { ExistingCustomer } from './app/components/ExistingCustomer';
class HomeScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };
  constructor(props) {
    super(props);
    this.state = {
      is_email_registered: false,
    };

  }
  componentDidMount() {

    GoogleSignin.hasPlayServices({ autoResolve: true })
      .then(() => {
      })
      .catch(errr => {
        console.log('Play services error', err.code, err.message);
      })

    GoogleSignin.configure({
      scopes: ["https://www.googleapis.com/auth/drive.readonly", "https://www.googleapis.com/auth/spreadsheets"], // what API you want to access on behalf of the user, default is email and profile
      webClientId: "5593423861-hg1s7arlubu7u75t7ssjqb3oi0rqj1le.apps.googleusercontent.com", // client ID of type WEB for your server (needed to verify user ID and offline access)

    }).then(() => {

    });

  }
  handleRequestForAllAuthorizedEmailList(email) {

    return fetch('https://sheets.googleapis.com/v4/spreadsheets/1_sIKjoYU7wDlGysnna9cXvTLQdGGjjmP3lFzMmj0aWU/values/Sheet3!A1%3AA?key=AIzaSyCLby0W3hX6SVicmNz0HbZun8A8mHe-5kU')
      .then((response) => response.json())
      .then((responseJson) => {
        var registered_email_values = responseJson.values;

        for (let i = 0; i < registered_email_values.length; i++) {


          if (registered_email_values[i] == email) {


            this.setState({
              is_email_registered: true,

            })


          }
        }



      })
      .catch((error) => {
        console.error(error);
      });
  }

  googleLogin() {

    GoogleSignin.signOut().then(() => {
      GoogleSignin.signIn().then((user) => {
        this.handleRequestForAllAuthorizedEmailList(user.email).then(() => {
          if (this.state.is_email_registered == true) {
            var userName = user.name;
            var accessToken = user.accessToken;
            console.log(user)
            this.setState({ user: user });
            ToastAndroid.showWithGravityAndOffset('Welcome ' + user.name,ToastAndroid.LONG,ToastAndroid.BOTTOM,25,700);
          //  ToastAndroid.showWithGravity('You are logged in as ' + user.name,ToastAndroid.SHORT,ToastAndroid.CENTER);
         //   Alert.alert('You are logged in as ' + user.name)
            this.props.navigation.navigate('Details', { username: userName, accesstoken: accessToken })
            this.setState({
              is_email_registered: false,

            })
          } else {
            alert("You dont have permissions to access this app!!");
          }
        })
      })


    })
      .catch((err) => {
        console.log("WRONG SIGNIN", err);
      })
  }
  render() {


    return (
      <View style={styles.container}>


        <Image
          style={styles1.stretch}
          source={require('./app/Images/biofresh_logo.png')}
        />
        <Text>SignIn with google</Text>
        <GoogleSigninButton
          style={{ width: 48, height: 48 }}
          size={GoogleSigninButton.Size.Icon}
          color={GoogleSigninButton.Color.Dark}
          onPress={
            this.googleLogin.bind(this)

          } />

      </View>
    );
  }
}
const RootStack = createStackNavigator(
  {
    Home: HomeScreen,
    Details: Customer,
  },
);


export default class App extends React.Component {
  render() {
    return (
      <RootStack />

    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
const styles1 = StyleSheet.create({
  stretch: {
    width: 200,
    height: 100
  }
});
const styles2 = StyleSheet.create({
  stretch: {
    width: 150,
    height: 150

  }
});