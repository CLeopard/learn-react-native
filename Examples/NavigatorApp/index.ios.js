/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  Navigator,
  Text,
  View
} from 'react-native';
// import MyScene from './MyScene'
import SimpleNavigationApp from './SimpleNavigationApp'

class NavigatorApp extends Component {
  render() {
    return (
      /*<Navigator
        initialRoute = {{title: 'My Initial Scene', index: 0}}
        renderScene = {(route, navigator) => {
          <SimpleNavigationApp navigator={navigator} />
        }}
      />*/
      <SimpleNavigationApp title={'L'} />
    );
  }
}
AppRegistry.registerComponent('NavigatorApp', () => NavigatorApp);
