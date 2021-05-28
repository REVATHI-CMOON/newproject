import React from 'react';
import { View, Image, StyleSheet, Text, KeyboardAvoidingView, StatusBar } from 'react-native';
import { Card, Item, Input, Toast, Form, Icon, Picker } from 'native-base';
import { ScrollView, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import SubHeader from './SubHeader';
import { MaterialIndicator } from 'react-native-indicators';
import AsyncStorage from '@react-native-community/async-storage';
import qs from 'qs';
const baseUrl = "http://demoworks.in/php/mypropertree/api/common/";
const baseUrl2 = "http://demoworks.in/php/mypropertree/api/auth/";
import { CommonActions } from '@react-navigation/native';

export default class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user_name: '',
            password: '',
            loading: false,
            showPassword: true,
            data: [],
            PickerValue: '',
            device_token: ''
        }
    }
    componentDidMount() {
        this.getRegisterTypes();
        AsyncStorage.getItem('device_token').then((device_token) => {
            this.setState({ device_token: device_token })
        })
    }
    showPassword = () => {
        var current = this.state.showPassword
        this.setState({ showPassword: !current })
    }
    handleLogin = () => {
        this.setState({ loading: true });
        fetch(baseUrl2 + 'login', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'content-type': 'application/x-www-form-urlencoded',
            },
            body: qs.stringify({
                user_name: this.state.user_name,
                password: this.state.password,
                register_type_id: this.state.PickerValue,
                device_token: this.state.device_token
            })
        }).then((response) => response.json())
            .then((json) => {
                this.setState({ loading: false });
                if (json.status == "invalid") {
                    Toast.show({
                        text: json.message,
                        duration: 3000,
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
                    AsyncStorage.setItem('user_name', json.name)
                    AsyncStorage.setItem('register_type_id', json.register_type_id)
                    this.props.navigation.navigate('Home')

                }
            })
            .catch((error) => {
                this.setState({ loading: false });
                console.error(error);
            });
    }
    goToRegister = () => {
        this.props.navigation.navigate('Register')
    }
    goToHome = () => {
        this.props.navigation.navigate('Home')
    }
    goTofp = () => {
        this.props.navigation.navigate('ForgotPassword')
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
    render() {
        if (this.state.loading) {
            return (
                <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
                    <StatusBar backgroundColor='#81007F' />
                    <MaterialIndicator color='#81007F' size={30} />
                </View>
            )
        }
        return (
            <KeyboardAvoidingView style={styles.mainContainer}>
                <StatusBar backgroundColor="#81007F" />
                {/* <SubHeader title="" isLogin={true} backScreen="Home" showBack={true} params={{}} showPlus={false} navigation={this.props.navigation} /> */}
                <ScrollView>
                    <View style={styles.view}>
                        <View style={styles.header}>
                            <View>
                                <TouchableWithoutFeedback onPress={this.goToHome}>
                                    <Image source={require('../assets/back_white.png')} style={styles.leftimage} resizeMode="contain" />
                                </TouchableWithoutFeedback>
                            </View>
                        </View>
                        <View style={styles.textContainer}>
                            <Text style={styles.loginText}>Login</Text>
                            <Text style={styles.loginText1}>Hi, Have a Good day!</Text>
                        </View>
                        {/* <Text style={styles.loginText2}>I am </Text>
                        <Item style={styles.item}>
                            <Picker
                                style={styles.pickerStyle}
                                selectedValue={this.state.PickerValue}
                                onValueChange={(itemValue, itemIndex) => { (this.setState({ PickerValue: itemValue })) }}>
                                <Picker.Item label="" value="" />
                                {
                                    this.state.data.map((item) =>

                                        <Picker.Item label={item.name} value={item.id} />
                                    )
                                }
                            </Picker>
                        </Item> */}
                        <Text style={styles.loginText2}>Mobile / Email</Text>
                        <Item style={styles.item}>
                            <Input
                                style={styles.input}
                                value={this.state.user_name}
                                onChangeText={(username) => { this.setState({ user_name: username }) }}
                            />
                            <Icon name="user" type="FontAwesome" style={{ fontSize: 17, color: '#ffff' }} />
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
                        <TouchableWithoutFeedback onPress={this.goTofp}>
                            <View style={styles.fpContainer}>
                                <Text style={styles.fpText}>Forgot Password?</Text>
                            </View>
                        </TouchableWithoutFeedback>

                        <TouchableWithoutFeedback onPress={this.handleLogin}>
                            <View style={{ marginTop: hp('2'), marginLeft: wp('5'), marginRight: wp('5'), marginBottom: wp('5') }}>
                                <View style={styles.buttonContainer}>
                                    <Text style={styles.submitText}>LOGIN</Text>
                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                    <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: hp('4') }}>

                        <View style={styles.rgContainer}>
                            <Text style={styles.rgText1}>Don't have account?</Text>
                            <TouchableWithoutFeedback onPress={this.goToRegister}>
                                <Text style={styles.rgText}>Click Here</Text>
                            </TouchableWithoutFeedback>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
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
    pickerStyle: {
        width: "100%",
        justifyContent: 'center',
        marginBottom: "4%",
        marginTop: "3%",
        color: "#fff"
    },
    header: {
        borderBottomWidth: 0,
        backgroundColor: "#81007F",
        marginTop: "3%",
        marginLeft: "3%",
        marginBottom: "7%"
    },
    barImage: {
        width: 20,
        height: 20
    },
    image: {
        width: '100%',
        position: 'absolute',
    },
    textContainer: {
        marginLeft: '8%',
    },
    cardStyle: {
        borderRadius: 18,
        padding: '2%',
        width: '91%'

    },
    input: {
        fontFamily: 'Poppins-Regular',
        fontSize: 14,
        color: "#ffff"
    },
    item: {
        borderBottomWidth: 0.8,
        borderBottomColor: '#ffffff',
        marginLeft: "8%",
        marginRight: "8%"
    },
    loginText: {
        fontFamily: 'Ubuntu-Bold',
        fontSize: 20,
        color: '#ffffff',
        fontWeight: 'bold'
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
    label: {
        fontFamily: 'Ubuntu-Medium',
        fontSize: 14,
        color: '#000'
    },
    labelContainer: {
        margin: '1.5%'
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
        fontFamily: 'Ubuntu-Medium',
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
        flexDirection: 'row'
    },
    rgText: {
        fontFamily: 'Ubuntu-Regular',
        fontSize: 17,
        color: '#81007F',
        paddingLeft: '2%'
    },
    rgText1: {
        fontFamily: 'Ubuntu-Regular',
        fontSize: 17,
        color: '#000000'
    },
    iam: {
        fontFamily: 'Ubuntu-Regular',
        fontSize: 14,
        color: '#000000',
        paddingLeft: wp('1')
    },
    box: {
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: '#089bfa',
        padding: '3%',
        width: wp('33'),
        height: hp('12'),
        borderRadius: 8
    },
    box1: {
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: '#089bfa',
        padding: '3%',
        width: wp('33'),
        height: hp('12'),
        borderRadius: 8,
        backgroundColor: '#089bfa'
    },
    boxHeder: {
        fontFamily: 'Ubuntu-Regular',
        fontSize: 11,
        color: '#089bfa'
    },
    boxHeder1: {
        fontFamily: 'Ubuntu-Regular',
        fontSize: 11,
        color: '#ffffff'
    }
})