import React from 'react';
import { StyleSheet, View, Image, Text, TouchableWithoutFeedback, TouchableNativeFeedback, Picker, StatusBar, Platform } from 'react-native';
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
    Card, Item, Input, Toast, Radio, Footer
} from 'native-base';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Dash from 'react-native-dash';
import { ScrollView } from "react-native-gesture-handler";
import qs from 'qs';
const baseUrl = "http://demoworks.in/php/mypropertree/api/common/";
const baseUrl1 = "http://demoworks.in/php/mypropertree/api/dashboard/";

import AsyncStorage from '@react-native-community/async-storage';
export default class Step7 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            message: '',
            loading: false,
            Rules: [],
            user_id: '',
            rules: '',
            other: 1,
            others: "",
            selectedRules: [],
            property_post_status: "",
        }
    }
    componentDidMount() {
        AsyncStorage.getItem('user_id').then((user_id) => {
            this.getDetails(this.props.route.params.property_id, user_id),
                this.setState({ user_id: user_id });
        })
        this.getDropdownList();
    }
    goToStep6 = () => {
        this.props.navigation.navigate('Step6', { property_id: this.props.route.params.property_id })
    }
    getDetails = (id, user_id) => {
        this.setState({ loading: true });
        fetch(baseUrl1 + 'edit_property/', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'content-type': 'application/x-www-form-urlencoded',
            },
            body: qs.stringify({
                property_id: id,
                user_id: user_id
            })
        }).then((response) => response.json())
            .then((json) => {
                this.setState({ loading: false });
                if (json.status == "invalid") {
                } else if (json.status == "valid") {
                    var Rules = json.data.rules
                    if (Rules) {
                        var rulesArr = Rules.split(",");
                    } else {
                        var rulesArr = [];
                    }
                    this.setState({
                        property_post_status: json.data.property_post_status,
                        selectedRules: rulesArr,
                        message: json.data.description,
                        others: json.data.others,
                    })
                }
            })
            .catch((error) => {
                this.setState({ loading: false });
                console.error(error);
            });
    }
    showalert = () => {
        this.setState({ loading: true });
        fetch(baseUrl1 + 'property_post_step6/', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'content-type': 'application/x-www-form-urlencoded',
            },
            body: qs.stringify({
                user_id: this.state.user_id,
                rules: this.state.selectedRules.join(','),
                description: this.state.message,
                others: this.state.others,
                property_id: this.props.route.params.property_id,
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
                        text: json.message,
                        type: 'success',
                        duration: 2500,
                        textStyle: { fontFamily: 'Roboto-Regular', color: "#ffffff", textAlign: 'center' },
                    })
                    this.state.property_post_status == 1 ?
                        this.props.navigation.navigate('ManageProperties')
                        :
                        this.props.navigation.navigate('Step1', { property_id: json.property_id })
                }
            })
            .catch((error) => {
                this.setState({ loading: false });
                console.error(error);
            });
    }
    getDropdownList = () => {
        this.setState({
            loading: true,
        })
        fetch(baseUrl + 'property_dropdowns_list', {
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
                        Rules: json.data.rules,
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
    PushRules = (id) => {
        let tempArr = this.state.selectedRules;
        if (tempArr.includes(id)) {
            var index = tempArr.indexOf(id)
            if (index !== -1) {
                tempArr.splice(index, 1);
            }
        } else {
            tempArr.push(id)
        }
        this.setState({ selectedRules: tempArr })
    }
    handleOccupanyChange = (id) => {
        this.setState({ other: id })
    }
    ManageProperties = () => {
        this.props.navigation.navigate('ManageProperties', { property_id: this.props.route.params.property_id })
    }

    render() {
        return (
            <Container>
                <StatusBar backgroundColor='#fff' barStyle="dark-content" />
                {this.state.property_post_status == 1 ?
                    <View>
                    </View>
                    :
                    <View style={{ marginTop: "3%", marginLeft: "3%", }}>
                        <View style={{ flexDirection: "row", }}>
                            <TouchableWithoutFeedback onPress={this.goToStep6}>
                                <Image source={require('../assets/back_icon.png')} resizeMode='contain' />
                            </TouchableWithoutFeedback>
                            <Text style={styles.headerText}>Step 6</Text>
                        </View>
                    </View>
                }
                <View style={{ borderBottomWidth: 0.5, marginTop: "3%", elevation: 1, borderBottomColor: "#F0F0F0" }}></View>
                <Content style={{ marginTop: "8%" }}>
                    <View style={styles.content}>
                        <View style={styles.row}>
                            <Dash style={styles.dash} dashColor="#C7C7C7" dashGap={3} />
                            <Image source={require('../assets/about_property.png')} style={styles.image} resizeMode="contain" />
                        </View>
                        <View style={{ marginLeft: "8%", }}>

                            <View>

                                <Text style={styles.TitleText2}>About Property</Text>

                                <Text style={styles.loginText2}>
                                    Description
                                 </Text>
                                <Textarea rowSpan={2} style={styles.textinput} value={this.state.message}
                                    onChangeText={(message) => { this.setState({ message: message }) }}

                                />
                                <Text style={styles.loginText2}>
                                    Rules & Regulations
                                 </Text>
                                <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                                    {
                                        this.state.Rules.map((item, key) => {
                                            return (
                                                <TouchableWithoutFeedback onPress={() => this.PushRules(item.id)}>
                                                    <View style={{ flexDirection: 'row', width: wp('40'), margin: '1.2%' }}>
                                                        <View>
                                                            <View style={this.state.selectedRules.includes(item.id) ? styles.buttonContainer22 : styles.buttonContainer11}>
                                                                <Text style={styles.buttonText}>{item.option_value}</Text>
                                                            </View>
                                                        </View>
                                                    </View>

                                                </TouchableWithoutFeedback>
                                            )
                                        })
                                    }
                                </View>
                                <View style={styles.row1}>
                                    <Radio selected={this.state.other == 1 ? true : false} onPress={() => this.handleOccupanyChange(1)} selectedColor="#9473B2" color="#000" />
                                    <Text style={styles.radiotext}>Others</Text>
                                </View>
                                <Textarea rowSpan={2} style={styles.textinput} value={this.state.others}
                                    onChangeText={(others) => { this.setState({ others: others }) }}
                                />
                            </View>
                            <View style={{ marginBottom: "5%" }}></View>
                        </View>

                    </View>
                    <View style={{ marginBottom: "3%" }}></View>
                </Content>
                {this.state.property_post_status == 1 ?
                    <TouchableWithoutFeedback onPress={this.showalert}>
                        <View>
                            {
                                Platform.OS == "android" && <Footer style={{ backgroundColor: '#81007F', justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={{ fontFamily: 'Ubuntu-Regular', fontSize: 16, color: '#ffffff' }}>UPDATE</Text>
                                </Footer>
                            }
                            {
                                Platform.OS == "ios" && <View style={{ backgroundColor: '#81007F', justifyContent: 'center', alignItems: 'center', padding: '5%' }}>
                                    <Text style={{ fontFamily: 'Ubuntu-Regular', fontSize: 16, color: '#ffffff' }}>UPDATE</Text>
                                </View>
                            }
                        </View>

                    </TouchableWithoutFeedback>
                    :
                    <TouchableWithoutFeedback onPress={this.showalert}>
                        <View style={styles.Button}>
                            <Text style={styles.submitText44}>Post Your Property</Text>
                        </View>
                    </TouchableWithoutFeedback>
                }
            </Container>
        )
    }
}
const styles = StyleSheet.create({
    header: {
        backgroundColor: "#fff",
        borderBottomWidth: 0,
        alignItems: "center",
        justifyContent: 'center'
    },
    headerText: {
        color: "#000",
        fontSize: 17,
        fontFamily: 'Ubuntu-Bold',
        marginLeft: "8%"

    },
    pickerStyle: {
        width: "100%",
        color: '#344953',
    },
    radiotext: {
        marginLeft: "5%",
        color: "#474747",
        fontSize: 16,
        fontFamily: 'Ubuntu-Regular',
        //marginTop: "4%",
    },
    buttonContainer11: {
        width: wp('35'),
        height: hp('5'),
        backgroundColor: '#fff',
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        margin: 5,
        borderColor: "#81007F",
        borderWidth: 0.7
        // padding: "5%"
    },
    buttonContainer22: {
        width: wp('35'),
        height: hp('5'),
        backgroundColor: '#d1e0e0',
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        margin: 5,
        borderColor: "#ccc",
        borderWidth: 0.7
    },
    row1: {
        flexDirection: "row",
        marginTop: "5%"
    },
    textinput: {
        borderBottomWidth: 0.8,
        borderBottomColor: '#000',
        marginLeft: "3%",
        // marginRight: "12%",
        width: "70%"
    },
    locicon: {
        fontSize: 25,
        color: '#E5E5E5',
    },
    locicon1: {
        fontSize: 27,
        color: '#81007F',
        marginTop: "3%",
    },
    content: {
        marginLeft: "8%",
        flexDirection: "row"
    },
    image: {
        position: "absolute",
        left: -36,
        // top: 115
    },
    image1: {
        position: "absolute",
        left: -66,
        top: 5
    },
    dash: {
        width: 1,
        flexDirection: 'column',
    },
    row: {
        flexDirection: "row",
    },
    TitleText: {
        color: "#81007F",
        fontSize: 18,
        fontFamily: "ubuntu-bold",
        marginLeft: "2%",
        marginTop: "8%"
    },
    TitleText2: {
        color: "#81007F",
        fontSize: 18,
        fontFamily: "ubuntu-bold",
        marginLeft: "2%",
        marginTop: "2%"
    },
    loginText2: {
        color: "#474747",
        fontSize: 16,
        fontFamily: "ubuntu-bold",
        marginTop: "3%",
        marginLeft: "3%",
        marginBottom: "4%"
    },
    submitText1: {
        fontSize: 17,
        color: '#fff',
        marginLeft: "15%"
    },
    submitText2: {
        fontSize: 16,
        color: '#000',
        marginRight: "8%"
    },
    submitText44: {
        fontFamily: 'Ubuntu-Bold',
        fontSize: 17,
        color: '#fff'
    },
    Button: {
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: '#81007F',
        // height: "7%",
        marginLeft: "5%",
        marginRight: "5%",
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        padding: "3%"
    },
    buttonContainer: {
        width: wp('18'),
        height: hp('4'),
        backgroundColor: '#ffff',
        margin: '3%',
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: "row",
    },
    item: {
        borderBottomWidth: 0.8,
        borderBottomColor: '#000',
        height: '3%',
        width: "90%"
    },
    input: {
        fontFamily: 'ubuntu-Regular',
        fontSize: 14,
        marginTop: "1%"

    },
    buttonContainer1: {
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#F3F3F3',
        width: '80%',
        padding: "4%",
        borderRadius: 25,
        flexDirection: "row"
    },
    submitText: {
        fontFamily: 'Roboto-Bold',
        fontSize: 15,
        color: '#000000',
        marginLeft: "5%"
    },

})