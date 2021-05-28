import React from 'react';
import { View, Image, StyleSheet, StatusBar, Text, TouchableWithoutFeedback } from 'react-native';
import { Card, Item, Input, Toast, Form, Icon, } from 'native-base';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { MaterialIndicator } from 'react-native-indicators';
import Header from './SubHeader';
import qs from 'qs';
const baseUrl2 = "http://demoworks.in/php/mypropertree/api/auth/";

export default class ResetPassword extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            password: '',
            conpassword: '',
            otp: '',
            user_id: '',
            loading: false,
            showPassword: true,
            showPassword1: true,
        }
    }
    componentDidMount() {
        var user_id = this.props.route.params.user_id
        this.setState({ user_id: user_id })
    }
    handleResetPassword = () => {
        this.setState({ loading: true });
        fetch(baseUrl2 + 'reset_password', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'content-type': 'application/x-www-form-urlencoded',
            },
            body: qs.stringify({
                new_password: this.state.password,
                confirm_password: this.state.conpassword,
                forgot_otp: this.state.otp,
                user_id: this.state.user_id
            })
        }).then((response) => response.json())
            .then((json) => {
                this.setState({ loading: false });
                if (json.status == "invalid") {
                    Toast.show({
                        text: json.message,
                        duration: 2500,
                        type: 'danger',
                        textStyle: { fontFamily: 'Roboto-Regular', color: "#ffffff", textAlign: 'center' },
                    })
                } else if (json.status == "valid") {
                    Toast.show({
                        text: "Password update success.You can login now",
                        type: 'success',
                        duration: 2500,
                        textStyle: { fontFamily: 'Roboto-Regular', color: "#ffffff", textAlign: 'center' },
                    })
                    this.props.navigation.navigate('Login')
                }
            })
            .catch((error) => {
                this.setState({ loading: false });
                console.error(error);
            });
    }
    handleLogin = () => {
        this.props.navigation.navigate('ForgotPassword')
    }
    showPassword = () => {
        var current = this.state.showPassword
        this.setState({ showPassword: !current })
    }
    showPassword1 = () => {
        var current = this.state.showPassword1
        this.setState({ showPassword1: !current })
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
                {/* <Header title="" isLogin={true} backScreen="Home" showBack={true} params={{}} showPlus={false} navigation={this.props.navigation} /> */}

                <View style={styles.view}>
                    <View style={styles.header}>
                        <View>
                            <TouchableWithoutFeedback onPress={this.handleLogin}>
                                <Image source={require('../assets/back_white.png')} style={styles.leftimage} resizeMode="contain" />
                            </TouchableWithoutFeedback>
                        </View>
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={styles.loginText}>Reset Password</Text>
                    </View>
                    <Text style={styles.loginText2}>Otp</Text>
                    <Item style={styles.item}>
                        <Input
                            style={styles.input}
                            value={this.state.otp}
                            onChangeText={(otp) => { this.setState({ otp: otp }) }}
                        />
                    </Item>
                    <Text style={styles.loginText2}>Password</Text>
                    <Item style={styles.item}>
                        <Input
                            style={styles.input}
                            value={this.state.password}
                            onChangeText={(password) => { this.setState({ password: password }) }}
                            secureTextEntry={this.state.showPassword}
                        />
                        <Icon active name={this.state.showPassword ? 'eye-slash' : 'eye'} type="FontAwesome" style={{ fontSize: 17, color: '#ffff' }} onPress={this.showPassword} />
                    </Item>
                    <Text style={styles.loginText2}>Confirm Password</Text>
                    <Item style={styles.item}>
                        <Input
                            style={styles.input}
                            value={this.state.conpassword}
                            secureTextEntry={this.state.showPassword1}
                            onChangeText={(conpassword) => { this.setState({ conpassword: conpassword }) }}
                        />
                        <Icon active name={this.state.showPassword1 ? 'eye-slash' : 'eye'} type="FontAwesome" style={{ fontSize: 17, color: '#ffff' }} onPress={this.showPassword1} />
                    </Item>
                    <TouchableWithoutFeedback onPress={this.handleResetPassword}>
                        <View style={{ marginTop: hp('7'), marginLeft: wp('5'), marginRight: wp('5'), marginBottom: wp('5') }}>
                            <View style={styles.buttonContainer}>
                                <Text style={styles.submitText}>SUBMIT</Text>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </View>

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
    header: {
        borderBottomWidth: 0,
        backgroundColor: "#81007F",
        marginTop: "3%",
        marginLeft: "3%",
        marginBottom: "7%"
    },
    item: {
        borderBottomWidth: 0.8,
        borderBottomColor: '#ffffff',
        marginLeft: "8%",
        marginRight: "8%",
        height: '6%'
    },
    textContainer: {
        marginLeft: '8%',
    },
    input: {
        fontFamily: 'Poppins-Regular',
        fontSize: 14,
        color: "#ffff"

    },
    loginText: {
        fontFamily: 'Roboto-Bold',
        fontSize: 20,
        color: '#ffffff',
        fontWeight: 'bold',
        fontSize: 25,
        marginTop: "6%"
    },
    loginText2: {
        fontFamily: 'Roboto-Regular',
        fontSize: 15,
        color: '#ffffff',
        marginTop: "3%",
        marginBottom: "5%",
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
        fontFamily: 'Roboto-Bold',
        fontSize: 17,
        color: '#000000'
    },

})