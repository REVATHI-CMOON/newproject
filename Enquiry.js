import React from 'react';
import { StyleSheet, ScrollView, View, Image, Text, StatusBar, TouchableWithoutFeedback, Modal, Linking } from 'react-native';
import {
    Container,
    Content,
    Header,
    Left,
    Right,
    Card,
    Textarea,
    Item, Icon,
    Input,
    Toast
} from 'native-base';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import qs from 'qs';
const baseUrl = "http://demoworks.in/php/mypropertree/api/common/";
import { MaterialIndicator } from 'react-native-indicators';

export default class Enquiry extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user_name: '',
            email: '',
            mobile: '',
            enquiry: '',
            message: '',
            isVisible: true,
            data: [],
            loading: true,
        }
    }
    goToVillas = () => {
        this.props.navigation.navigate('InteriorDetails')
    }
    handleToSubmit = () => {
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
                description: this.state.message,
                type: "listing",
                list_id: this.props.route.params.id
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
                    this.props.navigation.navigate('InteriorDetails')
                }
            })
            .catch((error) => {
                this.setState({ loading: false });
                console.error(error);
            });
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
    render() {

        return (
            <Container>
                <View>
                    <TouchableWithoutFeedback onPress={this.goToVillas}>
                        <Image source={require('../assets/close_icon.png')} style={{ alignSelf: "flex-end", height: 50, width: 60, marginRight: "5%", marginTop: "7%" }} />
                    </TouchableWithoutFeedback>
                </View>

                <View style={styles.popular}>
                    <Text style={styles.modalText}>Send Enquiry</Text>
                </View>
                <Content style={{ marginTop: "5%", }}>
                    <View style={styles.loclist}>
                        <View>
                            <Text style={styles.loginText2}>Name</Text>
                            <Item style={styles.item}>
                                <Input
                                    placeholderTextColor="#000"
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
                            <Text style={styles.loginText2}>Phone No</Text>
                            <Item style={styles.item}>
                                <Input
                                    style={styles.input}
                                    value={this.state.mobile}
                                    keyboardType="number-pad"
                                    maxLength={10}
                                    onChangeText={(mobile) => { this.setState({ mobile: mobile }) }}
                                />
                            </Item>
                            <Text style={styles.loginText2}>Messages</Text>
                            <Textarea rowSpan={3} style={styles.textinput} value={this.state.message}
                                onChangeText={(message) => { this.setState({ message: message }) }}

                            />
                            <TouchableWithoutFeedback onPress={this.handleToSubmit}>
                                <View style={{ marginTop: hp('2'), alignItems: "center" }}>
                                    <View style={styles.buttonContainer}>
                                        <Text style={styles.submitText}>SUBMIT</Text>
                                    </View>
                                </View>
                            </TouchableWithoutFeedback>
                        </View>
                    </View>
                </Content>
            </Container>
        );
    }
}
const styles = StyleSheet.create({
    popular: {
        backgroundColor: '#81007F',
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        // position: "absolute",
        width: "100%",
        top: "5%",
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: "1%"
    },
    label: {
        fontFamily: 'Ubuntu-Bold',
        fontSize: 14,
        color: '#000'
    },
    labelContainer: {
        margin: '4%'
    },
    textinput: {
        borderBottomWidth: 0.8,
        borderBottomColor: '#000',
        marginLeft: "8%",
        marginRight: "8%",
    },
    submitText: {
        fontFamily: "Ubuntu-Medium",
        fontSize: 18,
        color: '#fff',
        marginLeft: "8%"
    },
    input: {
        fontFamily: 'Ubuntu-Regular',
        fontSize: 14,
        marginTop: "2%"
    },
    menuImage: {
        width: 40,
        height: 40,
        marginTop: '1%'
    },
    locationtext: {
        textAlign: "center",
        marginLeft: "5%",
        fontSize: 13,
        fontFamily: 'Ubuntu-Regular',
    },
    item: {
        borderBottomWidth: 0.8,
        borderBottomColor: '#000',
        marginLeft: "8%",
        marginRight: "8%",
    },
    popularTitle: {
        marginTop: "3%",
        fontFamily: 'Ubuntu-Medium',
        fontSize: 18,
        color: '#fff',
        marginBottom: "10%",
        marginLeft: "7%"
    },
    loclist: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        width: "100%",
    },
    buttonContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#81007F',
        width: '50%',
        borderRadius: 25,
        padding: '4%',
    },
    buttonText: {
        fontFamily: 'Ubuntu-Regular',
        fontSize: 13,
        color: '#ffffff'
    },
    loginText2: {
        fontFamily: 'Ubuntu-Regular',
        fontSize: 15,
        marginLeft: '8%',
        marginTop: "5%"
    },
    modalText: {
        fontFamily: "Ubuntu-Medium",
        fontSize: 18,
        color: '#fff',
        marginLeft: "2%",
        margin: "5%"
    },
})

