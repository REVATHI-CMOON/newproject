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
    Textarea,
    Card, Item, Input, Toast,
    Picker
} from 'native-base';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import qs from 'qs';
const baseUrl = "http://demoworks.in/php/mypropertree/api/common/";

export default class Help extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user_name: '',
            email: '',
            mobile: '',
            enquiry: '',
            message: '',
            loading: false,
            getData: []
        }
    }
    componentDidMount() {
        this.getData();
    }
    getData = () => {
        this.setState({ loading: true });
        fetch(baseUrl + 'select_box', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'content-type': 'application/x-www-form-urlencoded',
            },
            body: qs.stringify({
                p_link: 'type_of_enquiry'
            })
        }).then((response) => response.json())
            .then((json) => {
                if (json.status == 'valid') {
                    this.setState({
                        getData: json.data,
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
    handleToSubmit = () => {
        this.setState({ loading: true });
        fetch(baseUrl + 'save_help_formdata', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'content-type': 'application/x-www-form-urlencoded',
            },
            body: qs.stringify({
                name: this.state.user_name,
                email: this.state.email,
                mobile: this.state.mobile,
                enq_type: this.state.enquiry,
                description: this.state.message,
                type: "help"
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
                        text: json.message,
                        type: 'success',
                        duration: 2500,
                        textStyle: { fontFamily: 'Ubuntu-Regular', color: "#ffffff", textAlign: 'center' },
                    })
                    this.props.navigation.navigate('Home')
                }
            })
            .catch((error) => {
                this.setState({ loading: false });
                console.error(error);
            });
    }
    goToHome = () => {
        this.props.navigation.navigate('Home')
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
                        <Text style={styles.headerText}>Help / Support</Text>
                    </View>
                </View>
                <View style={{ borderBottomWidth: 0.5, marginTop: "3%", elevation: 1, borderBottomColor: "#F0F0F0" }}></View>
                <Content style={{ marginTop: "5%", }}>

                    <Text style={styles.loginText2}>Name</Text>
                    <Item style={styles.item}>
                        <Input
                            style={styles.input}
                            value={this.state.user_name}
                            onChangeText={(username) => { this.setState({ user_name: username }) }}
                        />
                    </Item>
                    <Text style={styles.loginText2}>Email</Text>
                    <Item style={styles.item}>
                        <Input
                            style={styles.input}
                            value={this.state.email}
                            onChangeText={(email) => { this.setState({ email: email }) }}
                        />
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
                    <Text style={styles.loginText2}>Type of Enquiry</Text>
                    <Item style={styles.item}>
                        <Picker
                            style={styles.pickerStyle}
                            placeholderStyle={{ color: "red" }}
                            placeholderIconColor="#007aff"
                            selectedValue={this.state.enquiry}
                            onValueChange={(itemValue, itemIndex) => { (this.setState({ enquiry: itemValue })) }}
                        >
                            <Picker.Item label="Select" value="" />
                            {

                                this.state.getData.map((item) =>

                                    <Picker.Item label={item.option_value} value={item.id} />

                                )
                            }

                        </Picker>
                    </Item>
                    <Text style={styles.loginText2}>Messages</Text>
                    <Textarea rowSpan={3} style={styles.textinput} value={this.state.message}
                        onChangeText={(message) => { this.setState({ message: message }) }}

                    />
                    <TouchableWithoutFeedback onPress={this.handleToSubmit}>
                        <View style={{ marginTop: hp('2'), marginLeft: wp('5'), marginRight: wp('5'), marginBottom: wp('5') }}>
                            <View style={styles.buttonContainer}>
                                <Text style={styles.submitText}>SUBMIT</Text>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </Content>

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
    textinput: {
        borderBottomWidth: 0.8,
        borderBottomColor: '#000',
        marginLeft: "8%",
        marginRight: "8%",
    },
    pickerStyle: {
        width: "100%",
        justifyContent: 'center',
        marginBottom: "4%",
        marginTop: "3%",
    },
    loginText2: {
        fontFamily: 'Ubuntu-Regular',
        fontSize: 15,
        marginLeft: '9%',
        marginTop: "5%"
    },
    loginText3: {
        fontFamily: 'Ubuntu-Regular',
        fontSize: 15,
        marginLeft: '8%',
        marginTop: "1.5%"
    },
    input: {
        fontFamily: 'Poppins-Regular',
        fontSize: 14,
        marginTop: "2%"

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
    },
    buttonContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#81007F',
        width: '100%',
        padding: '4%',
        borderRadius: 25
    },

})