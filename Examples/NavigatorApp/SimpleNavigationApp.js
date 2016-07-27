/**
 * Demo For Navigator
 * @CLeopard
 * https://github.com/CLeopard
 * @flow
 */
 
import React, { Component, PropTypes} from 'react';
import { Navigator, StyleSheet, Text, TouchableHighlight, View } from 'react-native';

export default class SimpleNavigationApp extends Component {
  render() {
    return (
      <Navigator
        initialRoute={{ title: 'My Initial Scene', index: 0 }}
        renderScene={(route, navigator) =>
          <MyScene
            title={route.title}

            // Function to call when a new scene should be displayed
            onForward={ () => {
              const nextIndex = route.index + 1;
              navigator.push({
                title: 'Scene ' + nextIndex,
                index: nextIndex,
              });
            }}

            // Function to call to go back to the previous scene
            onBack={() => {
              if (route.index > 0) {
                navigator.pop();
              }
            }}
          />
        }
      />
    )
  }
}

class MyScene extends Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    onForward: PropTypes.func.isRequired,
    onBack: PropTypes.func.isRequired,
  }
  render() {
    return (
      <View style = {styles.containor}>
        <Text style = {styles.titleStyle}>Current Scene: { this.props.title }</Text>
        <TouchableHighlight onPress={this.props.onForward}>
          <Text style = {styles.nextStyle} >Tap me to load the next scene</Text>
        </TouchableHighlight>
        <TouchableHighlight onPress={this.props.onBack}>
          <Text style = {styles.backStyle} >Tap me to go back</Text>
        </TouchableHighlight>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  containor: {
    top: 20,
    backgroundColor: 'white'
  },
  titleStyle: {
    fontSize: 20
  },
  nextStyle: {
    fontSize: 20
  },
  backStyle: {
    fontSize: 20
  },
});
