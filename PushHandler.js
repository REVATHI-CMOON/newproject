import React, { Component } from "react";
import PushNotification from "react-native-push-notification";
import AsyncStorage from '@react-native-community/async-storage';
// var PushNotification = require("react-native-push-notification");
export default class PushHandler extends Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() {
        this.configurePushNotifications();
    }
    configurePushNotifications = () => {
        PushNotification.configure({
            onRegister: function (token) {
                try {
                    AsyncStorage.setItem('device_token', token.token);
                } catch (e) {
                    console.log(e)
                }
            },

            // (required) Called when a remote or local notification is opened or received
            onNotification: function (notification) {

                // process the notification here
                // required on iOS only 
                // notification.finish(PushNotificationIOS.FetchResult.NoData);
            },
            // Android only
            senderID: "819705423895",
            // iOS only
            // permissions: {
            //   alert: true,
            //   badge: true,
            //   sound: true
            // },
            popInitialNotification: true,
            requestPermissions: true,

        });
    }
    render() {
        return null;
    }
}