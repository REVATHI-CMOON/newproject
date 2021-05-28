import React from 'react';
import { StyleSheet, View, Image, Text, TouchableWithoutFeedback, TouchableNativeFeedback, TextInput, Dimensions, StatusBar } from 'react-native';
import {
    Container,
    Content,
    Header,
    Left,
    Right,
    Body,
    Drawer,
    Icon,
    Card, Item, Input, Toast,
} from 'native-base';
import qs from 'qs';
const baseUrl = "http://demoworks.in/php/mypropertree/api/dashboard/";
import AsyncStorage from '@react-native-community/async-storage';
export default class ChangePassword extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            old_password: '',
            new_password: '',
            confirm_password: '',
            user_id: '',
            loading: false,
            showPassword1: true,
            showPassword2: true,
            showPassword3: true,
        }
    }
    goToHome = () => {
        this.props.navigation.navigate('Home')
    }
    componentDidMount = () => {
        AsyncStorage.getItem('user_id').then((user_id) => {
            this.setState({ user_id: user_id })
        })
    }
    showPassword1 = () => {
        var current = this.state.showPassword1
        this.setState({ showPassword1: !current })
    }
    showPassword2 = () => {
        var current = this.state.showPassword2
        this.setState({ showPassword2: !current })
    }
    showPassword3 = () => {
        var current = this.state.showPassword3
        this.setState({ showPassword3: !current })
    }
    handleChangePassword = () => {
        this.setState({ loading: true });
        fetch(baseUrl + 'update_password', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'content-type': 'application/x-www-form-urlencoded',
            },
            body: qs.stringify({
                old_password: this.state.old_password,
                new_password: this.state.new_password,
                confirm_password: this.state.confirm_password,
                user_id: this.state.user_id
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
                    this.setState({
                        old_password: '',
                        new_password: '',
                        confirm_password: '',
                    })
                }
            })
            .catch((error) => {
                this.setState({ loading: false });
                console.error(error);
            });
    }
    render() {
        return (
            <Container style={{ backgroundColor: '#fff' }}>
                <StatusBar backgroundColor='#fff' barStyle="dark-content" />
                <View style={{ marginTop: "3%", marginLeft: "3%", }}>
                    <View style={{ flexDirection: "row", }}>
                        <TouchableWithoutFeedback onPress={this.goToHome}>
                            <Image source={require('../assets/back_icon.png')} resizeMode='contain' />
                        </TouchableWithoutFeedback>
                        <Text style={styles.headerText}>Change Password</Text>
                    </View>
                </View>
                <View style={{ borderBottomWidth: 0.5, marginTop: "3%", elevation: 1, borderBottomColor: "#F0F0F0" }}></View>
                <Content style={{ marginTop: "5%" }}>

                    <Text style={styles.loginText2}>Old Password</Text>
                    <Item style={styles.item}>
                        <Input
                            style={styles.input}
                            value={this.state.old_password}
                            onChangeText={(old_password) => { this.setState({ old_password: old_password }) }}
                            secureTextEntry={this.state.showPassword1}
                        />
                        <Icon active name={this.state.showPassword1 ? 'eye-slash' : 'eye'} type="FontAwesome" style={{ fontSize: 17, color: '#000' }} onPress={this.showPassword1} />
                    </Item>
                    <Text style={styles.loginText2}>New Password</Text>
                    <Item style={styles.item}>
                        <Input
                            style={styles.input}
                            value={this.state.new_password}
                            secureTextEntry={this.state.showPassword2}
                            onChangeText={(new_password) => { this.setState({ new_password: new_password }) }}
                        />
                        <Icon active name={this.state.showPassword2 ? 'eye-slash' : 'eye'} type="FontAwesome" style={{ fontSize: 17, color: '#000' }} onPress={this.showPassword2} />
                    </Item>
                    <Text style={styles.loginText2}>Confirm Password</Text>
                    <Item style={styles.item}>
                        <Input
                            style={styles.input}
                            value={this.state.confirm_password}
                            secureTextEntry={this.state.showPassword3}
                            onChangeText={(confirm_password) => { this.setState({ confirm_password: confirm_password }) }}
                        />
                        <Icon active name={this.state.showPassword3 ? 'eye-slash' : 'eye'} type="FontAwesome" style={{ fontSize: 17, color: '#000' }} onPress={this.showPassword3} />
                    </Item>
                </Content>
                <TouchableWithoutFeedback onPress={this.handleChangePassword}>
                    <View style={styles.Button}>
                        <Text style={styles.submitText}>Update Password</Text>
                    </View>
                </TouchableWithoutFeedback>
            </Container>
        )
    }
}
const styles = StyleSheet.create({
    header: {
        backgroundColor: "#fff",
        borderBottomWidth: 0
    },
    leftimage: {
        width: 25,
        height: 20,
    },
    headerText: {
        color: "#000",
        fontSize: 17,
        fontFamily: 'Ubuntu-Bold',
        marginLeft: "8%"

    },
    item: {
        borderBottomWidth: 0.8,
        borderBottomColor: '#000',
        marginLeft: "8%",
        marginRight: "8%",
        height: '6%'
    },
    loginText2: {
        fontFamily: 'Ubuntu-Regular',
        fontSize: 13,
        marginLeft: '8%',
        marginTop: "5%",
        marginBottom: "2%"
    },
    loginText3: {
        fontFamily: 'Ubuntu-Medium',
        fontSize: 15,
        marginLeft: '8%',
        marginTop: "1.5%"
    },
    input: {
        fontFamily: 'Ubuntu-Regular',
        fontSize: 16,
        marginTop: "4%",
        marginBottom: "4%",
    },
    submitText: {
        fontFamily: 'Ubuntu-Bold',
        fontSize: 17,
        color: '#fff'
    },
    Button: {
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: '#81007F',
        height: "7%",
        marginLeft: "5%",
        marginRight: "5%",
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25
    }
})