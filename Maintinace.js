import React from 'react';
import { View, StyleSheet, Image, Text, ImageBackground, StatusBar } from 'react-native';
const baseUrl = "http://demoworks.in/php/mypropertree/api/common/";
import qs from 'qs';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

export default class Maintinace extends React.Component {
    constructor(props) {
        super(props)
    }
    render() {
        return (
            <ImageBackground
                source={require('../assets/bg-splash.png')}
                style={{
                    backgroundColor: '#fff',
                    width: '100%',
                    height: '100%'
                }}
            >
                <View style={{ flex: 1, alignItems: 'center', }}>
                    <Image source={require('../assets/logo.png')} style={styles.menuImage} resizeMode={'contain'} />
                    <Image source={require('../assets/undermaintenance.png')} style={styles.menuImage1} resizeMode={'contain'} />
                    <Text style={{ textAlign: "center", fontFamily: "Ubuntu-Bold", fontSize: 30, color: "#7B5E97", marginTop: hp('2') }}>OOPS SORRY</Text>
                    <Text style={{ textAlign: "center", fontFamily: "Ubuntu-Regular", fontSize: 20, color: "#7B5E97" }}>App Under Maintenance</Text>
                </View>
            </ImageBackground>
        )
    }
}
const styles = StyleSheet.create({
    menuImage: {
        width: "50%",
        height: "20%",
        marginTop: hp('10')
    },
    menuImage1: {
        width: "50%",
        height: "20%",
        marginTop: hp('20')
    },
})