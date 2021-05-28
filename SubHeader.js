import React from 'react';
import { View, Image, StyleSheet, Text, TouchableWithoutFeedback, Platform } from 'react-native';
import { Header, Body } from 'native-base';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import AsyncStorage from '@react-native-community/async-storage';
export default function SubHeader(props) {

    return (
        <Header style={styles.header} androidStatusBarColor="#81007F">
            <Body style={styles.row}>
                {
                    props.showBack ?
                        <TouchableWithoutFeedback>
                            <View style={styles.imageContainer}>
                                <Image source={require('../assets/back-icon.png')} resizeMode="contain" style={styles.barImage} />
                            </View>
                        </TouchableWithoutFeedback> :
                        null
                }

                <View style={styles.headerContainer}>
                    <Text style={styles.text}>{props.title}</Text>
                </View>

            </Body>
        </Header>
    )
}
const styles = StyleSheet.create({

    header: {
        backgroundColor: '#81007F',
        height: Platform.OS == "android" ? hp('8') : undefined
    },
    row: {
        flexDirection: 'row',
        paddingTop: Platform.OS == "android" ? '5%' : '0%',
        paddingBottom: Platform.OS == "android" ? '5%' : '4.5%',
    },
    barImage: {
        width: 25,
        height: 25
    },
    headerContainer: {
        marginLeft: '3%',
    },
    text: {
        fontFamily: 'Roboto-Regular',
        fontSize: 17,
        color: '#ffffff'
    },
    imageContainer: {
        marginLeft: '1%',
    },
    imageContainer1: {
        marginTop: '2.5%',
        paddingLeft: wp('12')
    },
    imageContainer2: {
        position: 'absolute',
        right: wp('2'),
        top: Platform.OS == "ios" ? hp('1') : hp('3')
    },
    barImage1: {
        width: 20,
        height: 20
    },
})