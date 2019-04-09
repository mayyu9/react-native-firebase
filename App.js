import React, {Component} from 'react';
import { AsyncStorage, View, Text } from 'react-native';
import firebase from 'react-native-firebase';
import type { Notification, NotificationOpen } from 'react-native-firebase';
import type { RemoteMessage } from 'react-native-firebase';

export default class App extends Component {

async componentDidMount() {
  this.checkPermission();
  this.createNotificationListeners();
}

  //1 check if user has alreday granted permission for firebase
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
  console.log("get token outside if: "+fcmToken);
  if (!fcmToken) {
      fcmToken = await firebase.messaging().getToken();
      console.log("get token inside first if: "+fcmToken);
      if (fcmToken) {
          // user has a device token
          await AsyncStorage.setItem('fcmToken', fcmToken);
          console.log("get token inside second if: "+fcmToken);
      }
  }
}

  //2 if user has not given permission for firebase
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
  * */
  //debugger;
  /**
         * When app on foreground, rewrap received notification and re-send it as notification using channelId
         * A workaround because channelId never set by default by FCM API so we need to rewrap to make sure it is
         * shown on user's notification tray
         */
        this.notificationListener = firebase.notifications().onNotification((notification) => {
            //data object must have channelId props as a workaround for foreground notification on Android
            console.log('Notif ', notification);
            notification.android.setChannelId(notification.data.channelId);
            firebase.notifications().displayNotification(notification);
        });

        //On Notification tapped, be it from foreground or background
        this.notificationOpen = firebase.notifications().onNotificationOpened((notificationOpen) => {
            //body and title lost if accessed from background, taking info from data object by default
            const notification = notificationOpen.notification;
            console.log('Open ', notification)
            Alert.alert(notification.data.title, notification.data.body);
        });

        //When notification received when app is closed
        this.initialNotification = firebase.notifications().getInitialNotification()
            .then((notificationOpen) => {
                //body and title lost if accessed this way, taking info from data object where info will persist
                if (notificationOpen) {
                    const notification = notificationOpen.notification;
                    console.log('Initial ', notification)
                    Alert.alert(notification.data.title, notification.data.body);
                }
            });
    }

    componentWillUnmount() {
        this.notificationListener();
        this.initialNotification()
        this.notificationOpen();
    }
  // this.messageListener = firebase.notifications().onNotification(async notification => {
  //
  //       console.log('has sucessful get nototification', notification);
  //
  //       const { title, action } = notification.data; // we can take data from payload to navigate
  //
  //
  //
  //       notification.android.setChannelId("some"); // needed but unused.
  //
  //
  //
  //       await firebase.notifications().displayNotification(notification);
  //
  //
  //
  //   });
  // this.notificationDisplayedListener = firebase.notifications().onNotificationDisplayed((notification: Notification) => {
  //       // Process your notification as required
  //       // ANDROID: Remote notifications do not contain the channel ID. You will have to specify this manually if you'd like to re-display the notification.
  //       // Get the action triggered by the notification being opened
  //       // const action = notificationOpen.action;
  //       //      // Get information about the notification that was opened
  //       // const notification: Notification = notificationOpen.notification;
  //       console.log("display: "+notification);
  //   });
  //
  // this.notificationListener = firebase.notifications().onNotification((notification: Notification) => {
  //
  //   // Get the action triggered by the notification being opened
  //   // const action = notificationOpen.action;
  //   //      // Get information about the notification that was opened
  //   // const notification= notificationOpen.notification;
  //       // Process your notification as required
  //         console.log("listener: "+notification);
  //   });
  // this.notificationListener = firebase.notifications().onNotification((notification) => {
  //     const { title, body } = notification;
  //     this.showAlert(title, body);
  // });
  //
  // /*
  // * If your app is in background, you can listen for when a notification is clicked / tapped / opened as follows:
  // * */
  // this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen) => {
  //   debugger;
  //     const { title, body } = notificationOpen.notification;
  //     this.showAlert(title, body);
  // });
  //
  // /*
  // * If your app is closed, you can check if it was opened by a notification being clicked / tapped / opened as follows:
  // * */
  // const notificationOpen = await firebase.notifications().getInitialNotification();
  // if (notificationOpen) {
  //   debugger;
  //     const { title, body } = notificationOpen.notification;
  //     this.showAlert(title, body);
  // }
  // /*
  // * Triggered for data only payload in foreground
  // * */
  // this.messageListener = firebase.messaging().onMessage((message) => {
  //   //process data message
  //   console.log(JSON.stringify(message));
  // });
//}

showAlert(title, body) {
  debugger;
  Alert.alert(
    title, body,
    [
        { text: 'OK', onPress: () => console.log('OK Pressed') },
    ],
    { cancelable: false },
  );
}

//Remove listeners allocated in createNotificationListeners()
// componentWillUnmount() {
//   this.messageListener();
//   this.notificationDisplayedListener();
// }


  render() {
    return (
      <View style={{flex: 1}}>
        <Text>Welcome to React Native!</Text>
      </View>
    );
  }
}

// async componentDidMount() {
//    await this.SetUpAuth();
//    await this.SetUpMessaging();
//    this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen: NotificationOpen) => {
//      // Get the action triggered by the notification being opened
//      const action = notificationOpen.action;
//      // Get information about the notification that was opened
//      const notification: Notification = notificationOpen.notification;
//    });
//    const notificationOpen: NotificationOpen = await firebase.notifications().getInitialNotification();
//    if (notificationOpen) {
//      console.log(notificationOpen)
//      // App was opened by a notification
//      // Get the action triggered by the notification being opened
//      const action = notificationOpen.action;
//      // Get information about the notification that was opened
//      const notification: Notification = notificationOpen.notification;
//    }
//
//
//  }
//  componentWillUnmount() {
//
//  }
//
//
//  async SetUpAuth() {
//    const credential = await firebase.auth().signInAnonymouslyAndRetrieveData();
//    if (credential) {
//      console.log('default app user ->', credential.user.toJSON());
//    } else {
//      console.error('no credential');
//    }
//  }
//  async SetUpMessaging() {
//    this.notification2 = new firebase.notifications.Notification()
//      .setNotificationId('notificationId')
//      .setTitle('My notification title')
//      .setBody('My notification body')
//      .android.setChannelId('test')
//      .android.setClickAction('action')
//      .setData({
//        key1: 'value1',
//        key2: 'value2',
//      });
//
//    this.notification2
//      .android.setChannelId('channelId')
//      .android.setSmallIcon('ic_launcher');
//    console.log('assa')
//
//    onTokenRefreshListener = firebase.messaging().onTokenRefresh(fcmToken => {
//      console.log('token generated ->', fcmToken);
//      //   store.dispatch(DeviceActions.SetFCMToken(fcmToken));
//    });
//
//    const fcmToken = await firebase.messaging().getToken();
//    if (fcmToken) {
//      // user has a device token
//      console.log('has token ->', fcmToken);
//      console.log(firebase.auth().currentUser._user)
//      firebase.database().ref(`/users/${firebase.auth().currentUser._user.uid}`).set({ pushToken: fcmToken })
//      //   store.dispatch(DeviceActions.SetFCMToken(fcmToken));
//    } else {
//      // user doesn't have a device token yet
//      console.error('no messaging token');
//    }
//
//    const messagingEnabled = await firebase.messaging().hasPermission();
//    if (messagingEnabled) {
//      // user has permissions
//      console.log('User has FCM permissions');
//    } else {
//      // user doesn't have permission
//      console.log('User does not have FCM permissions');
//      await this.RequestMessagePermissions();
//    }
//
//    messageListener = firebase.messaging().onMessage((message: RemoteMessage) => {
//      console.log(`Recieved message - ${JSON.stringify(message)}`);
//    });
//
//    notificationDisplayedListener = firebase
//      .notifications()
//      .onNotificationDisplayed(notification => {
//        // Process your notification as required
//        // ANDROID: Remote notifications do not contain the channel ID. You will have to specify this manually if you'd like to re-display the notification.
//        console.log(`Recieved notification 1`);
//      });
//    notificationListener = firebase
//      .notifications()
//      .onNotification(notification => {
//        console.log(notification)
//        firebase.notifications().displayNotification(this.notification2)
//        // Process your notification as required
//        console.log(`Recieved notification 2`);
//      });
//  }
//
//
//  async RequestMessagePermissions() {
//    console.log('request')
//    console.log('Requesting FCM permission');
//    await firebase
//      .messaging()
//      .requestPermission()
//      .catch(err => console.err(err));
//  }
//
//
//  render() {
//    return (
//      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//       <Text>Welcome to React Native!</Text>
//      </View>
//    )
//  }
// }
