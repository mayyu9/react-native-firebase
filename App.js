import React, {Component} from 'react';
import { AsyncStorage,View,Text } from 'react-native';
import firebase from 'react-native-firebase';

import {foo} from './global.js';
import './global.js';


export default class App extends Component {
constructor(props){
  super(props);
  this.state={notification:[]};
  this.notificationObject = {};
}

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
      //const { title, body } = notification;
      this.notificationObject.data = notification._data;
      this.notificationObject.body = "body";//notificationOpen.notification._body;
      this.notificationObject.title = "title";//notificationOpen.notification._title;

        this.setState(prevState => ({
          notification: [...prevState.notification, this.notificationObject]
        }));
      console.log("notification object foreground : "+JSON.stringify(this.notificationObject));
      const { title, body } = notification;
      console.log('foreground: '+notification.title);
      console.log('foreground: '+notification);
      this.showAlert1(title, body);
     // alert(existing+1);
  });

  /*
  * If your app is in background, you can listen for when a notification is clicked / tapped / opened as follows:
   */
  this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen) => {
    global.foo = global.foo - 1;
    this.notificationObject.data = notificationOpen.notification._data;
    this.notificationObject.body = "body";//notificationOpen.notification._body;
    this.notificationObject.title = "title";//notificationOpen.notification._title;

      this.setState(prevState => ({
        notification: [...prevState.notification, this.notificationObject]
      }));

      console.log("notification object background: "+JSON.stringify(this.notificationObject));
      const { title, body } = notificationOpen.notification;
      //console.log('background notification: '+notificationOpen.notification.data);
      //console.log(notificationOpen.notification.title);
      firebase.notifications().getBadge()
        .then( count => console.log('count: '+count))
        .catch(error => console.log("error: "+error));
      this.showAlert1(title, body);
  });

  /*
  * If your app is closed, you can check if it was opened by a notification being clicked / tapped / opened as follows:
   */
  const notificationOpen = await firebase.notifications().getInitialNotification();
  console.log('notification open: '+notificationOpen);
  if (notificationOpen) {
    global.foo = global.foo - 1;
    this.notificationObject.data = notificationOpen.notification._data;
    this.notificationObject.body = "body";//notificationOpen.notification._body;
    this.notificationObject.title = "title";//notificationOpen.notification._title;

      this.setState(prevState => ({
        notification: [...prevState.notification, this.notificationObject]
      }));

      console.log("inside notification open : "+JSON.stringify(this.notificationObject));
      const { title, body } = notificationOpen.notification;
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
    console.log("render : "+JSON.stringify(this.state.notification));
    return (
      <View style={{flex: 1}}>
        <Text>Welcome to React Native!</Text>
        <Text>Total Count is {global.foo}</Text>
      </View>
    );
  }
}