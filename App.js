import React from 'react';
import { Button, View, Text,StyleSheet,Alert } from 'react-native';
import { createStackNavigator } from 'react-navigation';
import { Customer } from './app/components/Customer';
import { GoogleSignin, GoogleSigninButton } from 'react-native-google-signin';
import { ExistingCustomer } from './app/components/ExistingCustomer';
class HomeScreen extends React.Component {
    static navigationOptions = {
       title:'BIOFRESH'
      };
    componentDidMount() {
        GoogleSignin.hasPlayServices({ autoResolve: true })
            .then(() => {
            })
            .catch(errr => {
                console.log('Play services error', err.code, err.message);
            })

        GoogleSignin.configure({
            scopes: ["https://www.googleapis.com/auth/drive.readonly","https://www.googleapis.com/auth/spreadsheets"], // what API you want to access on behalf of the user, default is email and profile
            webClientId: "5593423861-hg1s7arlubu7u75t7ssjqb3oi0rqj1le.apps.googleusercontent.com", // client ID of type WEB for your server (needed to verify user ID and offline access)

        }).then(() => {

            });
    }
    googleLogin() {

        GoogleSignin.signIn().then((user) => {
            console.log(user)
            this.setState({ user: user });
            Alert.alert('Hello '+user.name )
            this.props.navigation.navigate('Details')

        })
            .catch((err) => {
                console.log("WRONG SIGNIN", err);
            })
    }


    render() {
        return (
            <View style={styles.container}>
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
        backgroundColor: 'aquamarine',
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