App gets crashed after push notification from the firebase console.

we need to add the device fcm token in the firebase console, so that the notifications gets pushed to the device.

    steps to add the fcm tokens.
    go to firebase console. cloud messaging. 
    new notification -> write notification title and notification textand click send message button.
        now it will prompt for the device token. paste the token and click on + button so that the tokens gets added.
    now execute the app in background mode, and push the notification you can see the notification on the notification tray.

    Reference:
        https://medium.com/@anum.amin/react-native-integrating-push-notifications-using-fcm-349fff071591

        https://medium.com/@yangnana11/how-to-set-up-firebase-notification-in-react-native-app-android-only-4920eb875eae
        

