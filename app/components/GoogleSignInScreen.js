import React from 'react';
import { View, Text, Alert, Image, ToastAndroid } from 'react-native';
import { GoogleSignin, GoogleSigninButton } from 'react-native-google-signin';
import { Web_CLient_ID, spreadsheet_ID, API_key } from '../../Test_Properties';
import { styles, styles1 } from '../Styles/GoogleSignInStyles';

export class HomeScreen extends React.Component {
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
    GoogleSignin.hasPlayServices({ autoResolve: true,showPlayServicesUpdateDialog: true })
      .then(() => {
        console.log('Play Services present on device.');
      })
      .catch(err => {
        console.log('Play services error', err.code, err.message);
      })

    GoogleSignin.configure({
      scopes: ["https://www.googleapis.com/auth/drive.readonly", "https://www.googleapis.com/auth/spreadsheets"], // what API you want to access on behalf of the user, default is email and profile
      webClientId: Web_CLient_ID, // client ID of type WEB for your server (needed to verify user ID and offline access)
      offlineAccess: true
    });
  }

  handleRequestForAllAuthorizedEmailList(email) {
    return fetch('https://sheets.googleapis.com/v4/spreadsheets/' + spreadsheet_ID + '/values/Registered_EmailID!A1%3AA?key=' + API_key)
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
        console.log('Response:',user);
        this.handleRequestForAllAuthorizedEmailList(user.user.email).then(() => {
          if (this.state.is_email_registered == true) {
            var userName = user.user.name;
            this.setState({ user: user.user });
            ToastAndroid.showWithGravity('You are logged in as ' + user.user.name, ToastAndroid.LONG, ToastAndroid.CENTER);
            this.setState({
              is_email_registered: false,
            })
            var accessToken = '';
            GoogleSignin.getTokens().then((tokenResponse) => {
              this.props.navigation.navigate('Details', { username: userName, accesstoken: tokenResponse.accessToken })
            })
          } else {
            alert("You don't have permissions to access this app!!");
          }
        })
      }).catch((err) => {
        console.log("WRONG SIGNIN", err);
      })
    })
  }
  render() {
    return (
      <View style={styles.container}>
        <Image
          style={styles1.stretch}
          source={require('../Images/biofresh_logo.png')} />
        <Text>SignIn with google</Text>
        <GoogleSigninButton
          style={{ width: 48, height: 48 }}
          size={GoogleSigninButton.Size.Icon}
          color={GoogleSigninButton.Color.Dark}
          onPress={
            this.googleLogin.bind(this)} />
      </View>
    );
  }
}
