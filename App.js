import React from 'react';
import createSagaMiddleware from 'redux-saga';
import { View, Text, Image, StyleSheet, StatusBar, Linking, Platform, LogBox } from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import AppIntroSlider from 'react-native-app-intro-slider';
import { NavigationContainer } from '@react-navigation/native';
import MainNavigator from './componets/MainNavigator';
import Welcome from './componets/Welcome'
import { Root, Toast } from 'native-base';
import AsyncStorage from '@react-native-community/async-storage';
import PushNotification from "react-native-push-notification";
import NetInfo from "@react-native-community/netinfo";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
LogBox.ignoreAllLogs();
PushNotification.configure({
  onRegister: function (token) {
    try {
      AsyncStorage.setItem('device_token', token.token);
    } catch (e) {
      console.log(e)
    }
  },
  onNotification: function (notification) {
    console.log("NOTIFICATION:", notification)
  },
  senderID: "819705423895",
  popInitialNotification: true,
  requestPermissions: true,
});
const slides = [
  {
    key: "1",
    title: 'Buy/Rent',
    title1: 'Find the best properties to',
    title2: 'buy/rent.',
    text: "",
    image: require('./assets/intro_img_1.png'),
  },
  {
    key: "2",
    title: 'Furniture/Appliances',
    title1: 'Best Furniture/Appliances',
    title2: 'to buy/rent.',
    text: "",
    image: require('./assets/intro_img_2.png'),
  },
  {
    key: "3",
    title: 'Interior Designers',
    title1: 'Select Best interior designer',
    title2: 'for your home',
    text: "",
    image: require('./assets/intro_img_3.png'),
  }
];

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showRealApp: false,
      appIntro: '',
      splashscreen: true,
      connection_status: false,
    }
  }

  configurePushNotifications = () => {

  }
  _renderItem = ({ item }) => {
    return (
      <View style={styles.slide}>
        <View>
          <Image source={item.image} resizeMode="contain" style={styles.image} />
        </View>
        <View style={styles.headingContainer}>
          <Text style={styles.heading}>{item.title}</Text>
        </View>
        <View>
          <Text style={styles.heading1}>{item.title1}</Text>
        </View>
        {
          item.title2 ?
            <View>
              <Text style={styles.heading1}>{item.title2}</Text>
            </View> :
            null
        }
      </View>
    );
  }
  componentDidMount() {
    SplashScreen.hide();
    //this.configurePushNotifications();
    AsyncStorage.getItem('appIntro').then((appIntro) => {
      this.setState({ appIntro: appIntro })
    });
    this.NetInfoSubscribtion = NetInfo.addEventListener(
      this._handleConnectivityChange,
    );
    setTimeout(() => {
      this.setState({ splashscreen: false })
    }, 3000);
  }
  componentWillUnmount() {
    this.NetInfoSubscribtion && this.NetInfoSubscribtion();
  }
  _handleConnectivityChange = (state) => {
    this.setState({
      connection_status: state.isConnected,
    })
  }
  _onDone = () => {
    try {
      AsyncStorage.setItem('appIntro', 'done')
      this.setState({ showRealApp: true, appIntro: 'done' })
    } catch (e) {
      console.log(e)
    }
  }
  renderNextButton = () => {
    return (
      <View style={styles.nextContainer}>
        <Text style={styles.next}>Skip</Text>
      </View>
    );
  };
  renderDoneButton = () => {
    return (
      <View style={styles.nextContainer}>
        <Text style={styles.next}>Done</Text>
      </View>
    );
  };
  render() {
    if (this.state.splashscreen) {
      return (
        <View style={{ flex: 1 }}>
          <StatusBar hidden />
          <Welcome />
        </View>
      )
    }
    if (!this.state.connection_status) {
      return (
        <View style={{ flex: 1, alignItems: "center", backgroundColor: "#81007F" }}>
          <Image source={require('./assets/noconnection.png')} resizeMode="contain" style={{ height: "40%", width: "30%" }} />
          <View style={{ height: hp('100'), width: wp('100'), backgroundColor: "#fff", borderTopLeftRadius: 15, borderTopRightRadius: 15 }}>
            <Text style={{ textAlign: "center", fontFamily: "Ubuntu-Bold", fontSize: 20, marginTop: "25%", color: "#81007F" }}>No Connection</Text>
            <Text style={{ textAlign: "center", fontFamily: "Ubuntu-Medium", fontSize: 17, marginTop: "5%", color: "#B8B8B8" }}>No internent connection found.</Text>
            <Text style={{ textAlign: "center", fontFamily: "Ubuntu-Medium", fontSize: 17, marginTop: "3%", color: "#B8B8B8" }}>Check your Connection & Try Again</Text>
          </View>
        </View>
      )
    }
    if (this.state.appIntro == "done") {
      return (
        <NavigationContainer>
          <Root>
            <MainNavigator />
          </Root>
        </NavigationContainer>
      );
    } else if (this.state.appIntro == "") {
      return (
        <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
          <StatusBar hidden />
          <AppIntroSlider
            renderItem={this._renderItem}
            data={slides}
            activeDotStyle={styles.activeDotStyle}
            dotStyle={styles.inactiveDot}
            onDone={this._onDone}
            renderDoneButton={this.renderDoneButton}
            renderNextButton={this.renderNextButton}
          />
        </View>
      )
    } else {
      return (
        <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
          <StatusBar hidden />
          <AppIntroSlider
            renderItem={this._renderItem}
            data={slides}
            activeDotStyle={styles.activeDotStyle}
            dotStyle={{ width: 15, height: "40%", backgroundColor: '#AAACBF' }}
            onDone={this._onDone}
            renderDoneButton={this.renderDoneButton}
            renderNextButton={this.renderNextButton}
          />
        </View>
      )
    }
  }
}
const styles = StyleSheet.create({
  image: {
    // width: 500,
    height: 400
  },
  slide: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '5%'
  },
  heading: {
    fontFamily: 'TitilliumWeb-Bold',
    fontSize: 22,
    color: '#81007F',
    textAlign: 'center',
    textAlign: 'center',
    marginBottom: '2%',
    marginTop: '5%',
  },
  heading1: {
    fontFamily: 'Futura Lt BT-Bold',
    fontSize: 20,
    color: '#4A5A67',
    textAlign: 'center',
    textAlign: 'center',
  },
  activeDotStyle: {
    backgroundColor: '#2678B2',
    width: "8%",
    height: "40%"
  },
  inactiveDot: {
    width: 15,
    height: "40%",
    backgroundColor: '#AAACBF'
  },
  headingContainer: {
  },
  next: {
    fontFamily: 'Ubuntu-Bold',
    fontSize: 17,
    color: '#000',
  },
  nextContainer: {
    marginTop: '10%',
    marginLeft: '10%'
  }
})