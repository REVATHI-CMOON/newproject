import React from 'react';
import { View, Image, StyleSheet, StatusBar, Text, TouchableWithoutFeedback, } from 'react-native';
import { Card, Item, Input, Toast, Form, Icon, Picker } from 'native-base';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { MaterialIndicator } from 'react-native-indicators';
import Header from './SubHeader';
import qs from 'qs';
const baseUrl = "http://demoworks.in/php/mypropertree/api/common/";
const baseUrl2 = "http://demoworks.in/php/mypropertree/api/auth/";

export default class ForgotPassword extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            mobile: '',
            loading: false,
            PickerValue: '',
            data: []
        }
    }
    componentDidMount() {
        this.getRegisterTypes();
    }
    handleLogin = () => {
        this.props.navigation.navigate('Login')
    }
    getRegisterTypes = () => {
        fetch(baseUrl + 'get_reigster_tpyes', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'content-type': 'application/x-www-form-urlencoded',
            },
            body: qs.stringify({

            })
        }).then((response) => response.json())
            .then((json) => {
                if (json.status == 'valid') {
                    this.setState({
                        data: json.data,
                        loading: false,
                    });
                } else {
                    this.setState({ loading: false });
                }
            })
            .catch((error) => {
                this.setState({ loading: false });
            });
    }
    handleForgotPassword = () => {
        this.setState({ loading: true });
        fetch(baseUrl2 + 'forgot_password', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'content-type': 'application/x-www-form-urlencoded',
            },
            body: qs.stringify({
                mobile: this.state.mobile,
                register_type_id: this.state.PickerValue
            })
        }).then((response) => response.json())
            .then((json) => {
                this.setState({ loading: false });
                if (json.status == "invalid") {
                    Toast.show({
                        text: json.message,
                        duration: 2500,
                        type: 'danger',
                        textStyle: { fontFamily: 'Ubuntu-Regular', color: "#ffffff", textAlign: 'center' },
                    })
                } else if (json.status == "valid") {
                    Toast.show({
                        text: "Please update your password here",
                        type: 'success',
                        duration: 2500,
                        textStyle: { fontFamily: 'Ubuntu-Regular', color: "#ffffff", textAlign: 'center' },
                    })
                    this.props.navigation.navigate('ResetPassword', { user_id: json.user_id })
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

                <View style={styles.view}>
                    <View style={styles.header}>
                        <View>
                            <TouchableWithoutFeedback onPress={this.handleLogin}>
                                <Image source={require('../assets/back_white.png')} style={styles.leftimage} resizeMode="contain" />
                            </TouchableWithoutFeedback>
                        </View>
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={styles.loginText}>Forgot Password</Text>
                    </View>
                    <Text style={styles.loginText2}>I am</Text>
                    <Item style={styles.item}>
                        <Picker
                            mode="dropdown"
                            style={styles.pickerStyle}
                            selectedValue={this.state.PickerValue}
                            onValueChange={(itemValue, itemIndex) => { (this.setState({ PickerValue: itemValue })) }}>
                            <Picker.Item label="Select" value="" />
                            {
                                this.state.data.map((item) =>

                                    <Picker.Item label={item.name} value={item.id} />
                                )
                            }
                        </Picker>
                    </Item>
                    <Text style={styles.loginText2}>Mobile</Text>
                    <Item style={styles.item}>
                        <Input
                            style={styles.input}
                            value={this.state.mobile}
                            keyboardType="number-pad"
                            maxLength={10}
                            onChangeText={(mobile) => { this.setState({ mobile: mobile }) }}
                        />
                    </Item>
                    <TouchableWithoutFeedback onPress={this.handleForgotPassword}>
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
    pickerStyle: {
        width: "100%",
        justifyContent: 'center',
        marginBottom: "4%",
        marginTop: "3%",
        color: "#fff",
        // backgroundColor: "#fff"
    },
    loginText: {
        fontFamily: 'Ubuntu-Bold',
        fontSize: 20,
        color: '#ffffff',
        fontWeight: 'bold',
        fontSize: 25,
        marginTop: "6%"
    },
    loginText2: {
        fontFamily: 'Ubuntu-Regular',
        fontSize: 15,
        color: '#ffffff',
        marginTop: "15%",
        marginBottom: "5%",
        marginLeft: '10%',
    },
    buttonContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffff',
        width: '100%',
        padding: '4%',
        borderRadius: 25
    },
    header: {
        borderBottomWidth: 0,
        backgroundColor: "#81007F",
        marginTop: "3%",
        marginLeft: "3%",
        marginBottom: "7%"
    },
    submitText: {
        fontFamily: 'Ubuntu-Bold',
        fontSize: 17,
        color: '#000000'
    },

})