import { GoogleSignin, GoogleSigninButton } from 'react-native-google-signin';
import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, Alert, Button } from 'react-native';
const instructions = Platform.select({
    ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
    android:
        'Double tap R on your keyboard to reload,\n' +
        'Shake or press menu button for dev menu',
});

export class GoogleSignIn extends Component {
    componentDidMount() {
        GoogleSignin.hasPlayServices({ autoResolve: true })
            .then(() => {
            })
            .catch(errr => {
                console.log('Play services error', err.code, err.message);
            })

        GoogleSignin.configure({
            scopes: ["https://www.googleapis.com/auth/drive.readonly"], // what API you want to access on behalf of the user, default is email and profile
            webClientId: "380849253655-hqcddg90fiek85b7i83lfe4n5nojjt0g.apps.googleusercontent.com", // client ID of type WEB for your server (needed to verify user ID and offline access)

        })
            .then(() => {

            });
    }

    googleLogin() {

        GoogleSignin.signIn().then((user) => {
            console.log(user)
            this.setState({ user: user });
            this.props.navigation.dispatch(navigateAction);


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
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'pink',
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
