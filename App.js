import React, {Component} from 'react';
import { AsyncStorage,View,Text } from 'react-native';
import firebase from 'react-native-firebase';

import {foo} from './global.js';
import './global.js';


export default class App extends Component {


async componentDidMount() {
  this.checkPermission();
  this.createNotificationListeners();
}



componentWillUnmount() {
  this.notificationListener();
  this.notificationOpenedListener();
}
  //1
async checkPermission() {
  const enabled = await firebase.messaging().hasPermission();
  if (enabled) {
      this.getToken();
  } else {
      this.requestPermission();
  }
}

  //3
async getToken() {
  let fcmToken = await AsyncStorage.getItem('fcmToken');
  console.log("fcm token: "+fcmToken);
  if (!fcmToken) {
      fcmToken = await firebase.messaging().getToken();
     
      if (fcmToken) {
          // user has a device token
          await AsyncStorage.setItem('fcmToken', fcmToken);
      }
  }
}

  //2
async requestPermission() {
  try {
      await firebase.messaging().requestPermission();
      // User has authorised
      this.getToken();
  } catch (error) {
      // User has rejected permissions
      console.log('permission rejected');
  }
}

async createNotificationListeners() {

  /*
  * Triggered when a particular notification has been received in foreground
   */
  this.notificationListener = firebase.notifications().onNotification((notification) => {
      global.foo = global.foo - 1;
      const { title, body } = notification;
      console.log(notification.title);
      this.showAlert1(title, body);
     // alert(existing+1);
  });

  /*
  * If your app is in background, you can listen for when a notification is clicked / tapped / opened as follows:
   */
  this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen) => {
    global.foo = global.foo - 1;
      const { title, body } = notificationOpen.notification;
      console.log(notificationOpen.notification.title);
      this.showAlert1(title, body);
  });

  /*
  * If your app is closed, you can check if it was opened by a notification being clicked / tapped / opened as follows:
   */
  const notificationOpen = await firebase.notifications().getInitialNotification();
  if (notificationOpen) {
    global.foo = global.foo - 1;
      const { title, body } = notificationOpen.notification;
      console.log(notificationOpen.notification.title);
      this.showAlert1(title, body);
  }
  /*
  * Triggered for data only payload in foreground
   */
  this.messageListener = firebase.messaging().onMessage((message) => {
    //process data message
    console.log(JSON.stringify(message));
  });
}

showAlert1(title, body) {
  
  //alert(this.state.count);
  //global.foo = global.foo + 1;
  alert(global.foo);
}
showAlert2(title, body) {
  //alert("hello");
  //this.setState({count:count + 1});
  //alert(this.state.count);
 // global.foo = global.foo + 1;
  alert("hello");
}


  render() {
    return (
      <View style={{flex: 1}}>
        <Text>Welcome to React Native!</Text>
        <Text>Total Count is {global.foo}</Text>
        
      </View>
    );
  }
}