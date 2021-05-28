import React from 'react';
import { View, Image, StyleSheet, Text, KeyboardAvoidingView, StatusBar } from 'react-native';
import { Card, Item, Input, Toast, Form, Icon } from 'native-base';
import { ScrollView, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Header from './SubHeader';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import { MaterialIndicator } from 'react-native-indicators';
const baseUrl2 = "http://demoworks.in/php/mypropertree/api/auth/";
import qs from 'qs';
import AsyncStorage from '@react-native-community/async-storage';

export default class Otp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            otp: '',

        }
    }
    componentDidMount() {
    }
    handleRegister = () => {
        this.props.navigation.navigate('Register')
    }
    handleVerifyOtp = () => {
        this.setState({ loading: true });
        fetch(baseUrl2 + 'otp_verification', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'content-type': 'application/x-www-form-urlencoded',
            },
            body: qs.stringify({
                user_id: this.props.route.params.user_id,
                otp: this.state.otp,
            })
        }).then((response) => response.json())
            .then((json) => {
                this.setState({ loading: false });
                if (json.status == "invalid") {
                    Toast.show({
                        text: json.message,
                        duration: 2000,
                        type: 'danger',
                        textStyle: { fontFamily: 'Ubuntu-Regular', color: "#ffffff", textAlign: 'center' },
                    })
                } else if (json.status == "valid") {
                    Toast.show({
                        text: json.message,
                        type: 'success',
                        duration: 2500,
                        textStyle: { fontFamily: 'Ubuntu-Regular', color: "#ffffff", textAlign: 'center' },
                    })
                    AsyncStorage.setItem('user_id', json.user_id)
                    AsyncStorage.setItem('register_type_name', json.register_type_name)
                    AsyncStorage.setItem('register_type_id', json.register_type_id)
                    AsyncStorage.setItem('user_name', json.name)
                    this.props.navigation.navigate('MainNavigator')
                }
            })
            .catch((error) => {
                this.setState({ loading: false });
                console.error(error);
            });
    }
    handleVerifyResendOtp = () => {
        this.setState({ loading: true });
        fetch(baseUrl2 + 'resend_otp', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'content-type': 'application/x-www-form-urlencoded',
            },
            body: qs.stringify({
                user_id: this.props.route.params.user_id,
            })
        }).then((response) => response.json())
            .then((json) => {
                this.setState({ loading: false });
                if (json.status == "invalid") {
                    Toast.show({
                        text: json.message,
                        duration: 2000,
                        type: 'danger',
                        textStyle: { fontFamily: 'Ubuntu-Regular', color: "#ffffff", textAlign: 'center' },
                    })
                } else if (json.status == "valid") {
                    Toast.show({
                        text: json.message,
                        type: 'success',
                        duration: 2500,
                        textStyle: { fontFamily: 'Ubuntu-Regular', color: "#ffffff", textAlign: 'center' },
                    })
                    // this.props.navigation.navigate('Login')
                }
            })
            .catch((error) => {
                this.setState({ loading: false });
                console.error(error);
            });
    }
    render() {
        if (this.state.loading) {
            return (
                <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
                    <MaterialIndicator color='#81007F' size={30} />
                </View>
            )
        }
        return (
            <View style={styles.mainContainer}>
                <StatusBar backgroundColor="#81007F" />

                <ScrollView>
                    <View style={styles.view}>
                        <View style={styles.header}>
                            <View>
                                <TouchableWithoutFeedback onPress={this.handleRegister}>
                                    <Image source={require('../assets/back_white.png')} style={styles.leftimage} resizeMode="contain" />
                                </TouchableWithoutFeedback>
                            </View>
                        </View>
                        <View>
                            <Image source={require('../assets/otp.png')} resizeMode="contain" style={styles.barImage} />
                        </View>
                        <View style={styles.textContainer}>
                            <Text style={styles.loginText}>OTP Verification</Text>
                            <Text style={styles.loginText1}>sent OTP code to your mobile number</Text>
                            <Text style={styles.loginText1}>{this.props.route.params.mobileNo}</Text>
                        </View>
                        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                            <OTPInputView
                                style={{ width: wp('80'), height: 100 }}
                                pinCount={4}
                                autoFocusOnLoad
                                secureTextEntry={true}
                                codeInputFieldStyle={styles.inputFeilds}
                                codeInputHighlightStyle={styles.inputFeildsFocus}
                                onCodeFilled={(code => {
                                    this.setState({ otp: code })
                                })}
                            />
                        </View>
                        <TouchableWithoutFeedback onPress={this.handleVerifyOtp}>
                            <View style={{ marginTop: hp('2'), marginLeft: wp('5'), marginRight: wp('5'), marginBottom: wp('5') }}>
                                <View style={styles.buttonContainer}>
                                    <Text style={styles.submitText}>VERIFY</Text>
                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                    <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: hp('4') }}>

                        <View style={styles.rgContainer}>
                            <Text style={styles.rgText1}>I did't Receive a code</Text>
                            <TouchableWithoutFeedback onPress={this.handleVerifyResendOtp}>
                                <Text style={styles.rgText}>RESEND</Text>
                            </TouchableWithoutFeedback>
                        </View>
                    </View>
                </ScrollView>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: "#ffff"
    },
    view: {
        backgroundColor: "#81007F",
        borderBottomLeftRadius: 40,
        borderBottomRightRadius: 40,
    },

    inputFeilds: {
        width: 50,
        borderWidth: 0,
        borderBottomWidth: 1.5,
        margin: "6%"
    },

    inputFeildsFocus: {
        borderColor: "#81007F",
        borderBottomWidth: 1.5,
        margin: "6%"
    },
    barImage: {
        width: 150,
        height: 100
    },
    textContainer: {
        marginLeft: '8%',
    },
    input: {
        fontFamily: 'Poppins-Regular',
        fontSize: 14
    },
    loginText: {
        fontFamily: 'Ubuntu-Bold',
        fontSize: 20,
        color: '#ffffff',
        fontWeight: 'bold',
        fontSize: 25,
        marginTop: "6%"
    },
    loginText1: {
        fontFamily: 'Ubuntu-Medium',
        fontSize: 15,
        color: '#ffffff',
        marginTop: "1.5%"
    },
    loginText2: {
        fontFamily: 'Ubuntu-Medium',
        fontSize: 15,
        color: '#ffffff',
        marginTop: "5%",
        marginLeft: '8%',
    },
    buttonContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffff',
        width: '100%',
        padding: '4%',
        borderRadius: 25
    },
    submitText: {
        fontFamily: 'Ubuntu-Bold',
        fontSize: 17,
        color: '#000000'
    },
    fpText: {
        fontFamily: 'Ubuntu-Regular',
        fontSize: 14,
        color: "#ffff",
        marginLeft: "30%"
    },
    fpContainer: {
        paddingLeft: wp('48'),
        paddingTop: '2%',
        margin: '1.5%'
    },
    rgContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    rgText: {
        fontFamily: 'Ubuntu-Medium',
        fontSize: 17,
        color: '#81007F',
        borderBottomWidth: 1.5,
        borderBottomColor: '#81007F'
    },
    rgText1: {
        fontFamily: 'Ubuntu-Regular',
        fontSize: 17,
        color: '#000000'
    },
    header: {
        borderBottomWidth: 0,
        backgroundColor: "#81007F",
        marginTop: "3%",
        marginLeft: "3%",
        marginBottom: "7%"
    },
})