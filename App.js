import React from 'react';
import { createStackNavigator } from 'react-navigation';
import { Customer } from './app/components/Customer';
import { HomeScreen } from './app/components/GoogleSignInScreen';

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

