import React from 'react';
import { StyleSheet, View, Image, Text, TouchableWithoutFeedback, TouchableNativeFeedback, TextInput, Dimensions, StatusBar } from 'react-native';
import {
    Container,
    Content,
    Icon,
    Card, Toast,
    Radio,
    Footer,
    Right,
    Left
} from 'native-base';
import Dash from 'react-native-dash';
import { MaterialIndicator } from 'react-native-indicators';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import AsyncStorage from '@react-native-community/async-storage';
import qs from 'qs';
const baseUrl = "http://demoworks.in/php/mypropertree/api/common/";
const baseUrl2 = "http://demoworks.in/php/mypropertree/api/dashboard/"
export default class Property extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loader: true,
            property_type: 1,
            sub_type: '',
            subTypes: [],
            submitStatus: '',
            register_type_id: "",
            user_id: ""
        }
    }
    componentDidMount() {
        AsyncStorage.getItem('user_id').then((user_id) => {
            this.setState({ user_id: user_id });
            this.getSubCategories(user_id);
        })
        AsyncStorage.getItem('register_type_id').then((register_type_id) => {
            this.setState({ register_type_id: register_type_id })
        })
    }
    getSubCategories = (user_id) => {
        this.setState({ loading: true });
        fetch(baseUrl2 + 'subtypes_list', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'content-type': 'application/x-www-form-urlencoded',
            },
            body: qs.stringify({
                user_id: user_id,
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
                    this.setState(
                        {
                            subTypes: []
                        }
                    )
                } else if (json.status == "valid") {
                    this.setState(
                        {
                            subTypes: json.data.subtypes
                        }
                    )
                }
            })
            .catch((error) => {
                this.setState({ loading: false });
                console.error(error);
            });
    }
    goToStep2 = () => {
        this.setState({ loading: true });
        fetch(baseUrl2 + 'property_post_step1', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'content-type': 'application/x-www-form-urlencoded',
            },
            body: qs.stringify({
                property_type: this.state.property_type,
                sub_type: this.state.sub_type,
                payment_id: this.props.route.params.payment_id,
                user_id: this.state.user_id,
            })
        }).then((response) => response.json())
            .then((json) => {
                console.log(json.is_limit_exceeded, json.status,)
                this.setState({ loading: false });
                if (json.status == "invalid") {
                    Toast.show({
                        text: json.message,
                        duration: 2500,
                        type: 'danger',
                        textStyle: { fontFamily: 'Roboto-Regular', color: "#ffffff", textAlign: 'center' },
                    })
                    if (json.is_limit_exceeded == true) {
                        this.props.navigation.navigate('Packages')
                    }
                } else if (json.status == "valid") {
                    Toast.show({
                        text: json.message,
                        type: 'success',
                        duration: 2500,
                        textStyle: { fontFamily: 'Roboto-Regular', color: "#ffffff", textAlign: 'center' },
                    })
                    this.props.navigation.navigate('Step2', { property_id: json.property_id, sub_type: json.sub_type })
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
    goToStep0 = () => {
        this.props.navigation.navigate('Home')
    }
    handleBoxChange = (type) => {
        this.setState({ property_type: type, sub_type: '' }, () => { this.getSubCategories(this.state.user_id) })
    }
    handleRadioChange = (type) => {
        this.setState({ sub_type: type })
    }
    render() {
        if (this.state.loading) {
            return (
                <View style={{ flex: 1 }}>
                    {/* <StatusBar backgroundColor='#fff' barStyle="dark-content" />
                    <View style={{ marginTop: "3%", marginLeft: "3%", }}>
                        <View style={{ flexDirection: "row", }}>
                            <TouchableNativeFeedback onPress={this.goToStep0}>
                                <Image source={require('../assets/back_icon.png')} resizeMode='contain' />
                            </TouchableNativeFeedback>
                            <Text style={styles.headerText}>Post Property</Text>
                        </View>

                    </View> */}
                    <MaterialIndicator color="#81007F" size={30} />
                </View>
            )
        }
        return (
            <Container>
                <StatusBar backgroundColor='#fff' barStyle="dark-content" />
                <View style={{ marginTop: "3%", marginLeft: "3%", }}>
                    <View style={{ flexDirection: "row", }}>
                        <TouchableWithoutFeedback onPress={this.goToStep0}>
                            <Image source={require('../assets/back_icon.png')} resizeMode='contain' />
                        </TouchableWithoutFeedback>
                        <Text style={styles.headerText}>Post Property</Text>
                    </View>
                </View>
                <View style={{ borderBottomWidth: 0.5, marginTop: "3%", elevation: 1, borderBottomColor: "#F0F0F0" }}></View>
                <Content>
                    {(this.state.register_type_id == 1 || this.state.register_type_id == 2) ?
                        <View>
                            <Dash style={styles.dash} dashColor="#CDCDCD" dashGap={5} />
                            <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center' }}>
                                {this.state.property_type == 1 ?
                                    <View style={styles.box1}>
                                        <Image source={require('../assets/buy_icon-violet.png')} style={styles.image} resizeMode="contain" />
                                        <Text style={styles.boxHeder1}>Sell</Text>
                                    </View> : this.state.submit_status != 1 ?
                                        <TouchableWithoutFeedback onPress={() => this.handleBoxChange(1)}>
                                            <View style={styles.box}>
                                                <Image source={require('../assets/buy_icon.png')} style={styles.image} resizeMode="contain" />
                                                <Text style={styles.boxHeder}>Sell</Text>
                                            </View>
                                        </TouchableWithoutFeedback> :
                                        <View style={styles.box}>
                                            <Image source={require('../assets/buy_icon.png')} style={styles.image} resizeMode="contain" />
                                            <Text style={styles.boxHeder}>Sell</Text>
                                        </View>

                                }
                                {this.state.property_type == 2 ?
                                    <View style={styles.box1}>
                                        <Image source={require('../assets/rent_icon-violet.png')} style={styles.image} resizeMode="contain" />
                                        <Text style={styles.boxHeder1}>Rent</Text>
                                    </View> : this.state.submit_status != 1 ?
                                        <TouchableWithoutFeedback onPress={() => this.handleBoxChange(2)}>
                                            <View style={styles.box}>
                                                <Image source={require('../assets/rent_icon.png')} style={styles.image} resizeMode="contain" />
                                                <Text style={styles.boxHeder}>Rent</Text>
                                            </View>
                                        </TouchableWithoutFeedback> :
                                        <View style={styles.box}>
                                            <Image source={require('../assets/rent_icon.png')} style={styles.image} resizeMode="contain" />
                                            <Text style={styles.boxHeder}>Rent</Text>
                                        </View>
                                }
                            </View>
                        </View>
                        :
                        null
                    }
                    {(this.state.register_type_id == 3 || this.state.register_type_id == 4) ?
                        <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center' }}>
                            {this.state.property_type == 1 ?
                                <View style={styles.box1}>
                                    <Image source={require('../assets/buy_icon-violet.png')} style={styles.image} resizeMode="contain" />
                                    <Text style={styles.boxHeder1}>Sell</Text>
                                </View>
                                :
                                null
                            }
                        </View>
                        :
                        null
                    }
                    <Card style={styles.card}>
                        {
                            this.state.subTypes.map((item, index) => {
                                return (
                                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly' }} key={item.id} >
                                        <View style={{ margin: '3%' }}>
                                            <Icon active name={this.state.sub_type == item.id ? 'dot-circle-o' : 'circle-o'} type="FontAwesome" style={{ fontSize: 22, color: '#81007F' }} onPress={() => this.handleRadioChange(item.id)} />
                                            {/* <Radio selected={this.state.sub_type == item.id ? true : false} onPress={() => this.handleRadioChange(item.id)} selectedColor="#81007F" color="#000" /> */}
                                        </View>
                                        <View style={{ margin: '3%', width: wp('70') }}>
                                            <TouchableWithoutFeedback onPress={() => this.handleRadioChange(item.id)}>
                                                <Text style={styles.text}>{item.option_value}</Text>
                                            </TouchableWithoutFeedback>
                                        </View>
                                    </View>
                                )
                            })
                        }
                    </Card>
                    <View style={{ marginBottom: "3%" }}></View>
                </Content>
                <View style={styles.Button}>
                    <TouchableWithoutFeedback onPress={this.goToStep0}>
                        <View style={{ flexDirection: "row", marginLeft: "3%", alignItems: "center" }}>
                            <Icon name="angle-left" type="FontAwesome" style={styles.locicon} />
                            <Text style={styles.submitText1}>Back</Text>
                        </View>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback onPress={this.goToStep2}>
                        <View style={styles.buttonContainer}>
                            <Text style={styles.submitText2}>Next</Text>
                            <Icon name="angle-right" type="FontAwesome" style={{ color: "#81007F" }} />
                        </View>
                    </TouchableWithoutFeedback>
                </View>

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
    secondContainer: {
        backgroundColor: '#f3f3f3',
        marginLeft: wp('4'),
        marginRight: wp('4'),
        borderRadius: 8
    },
    text: {
        fontFamily: 'Ubuntu-Bold',
        fontSize: 17,
    },
    box1: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    boxHeder1: {
        fontFamily: 'Ubuntu-Bold',
        fontSize: 15,
        color: "#81007F",
    },
    box: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    boxHeder: {
        fontFamily: 'Ubuntu-Bold',
        fontSize: 14,
    },
    imageview: {
        flexDirection: "row",
        justifyContent: "center",
        marginBottom: "2%"
    },
    dash: {
        width: "80%",
        height: 1,
        position: "absolute",
        top: "50%",
        marginLeft: "10%",
    },
    Text: {
        color: "#81007F",
        fontSize: 17,
        textAlign: "center",
        fontFamily: 'Ubuntu-Regular',
    },
    Text1: {
        color: "#000",
        fontSize: 17,
        textAlign: "center",
        fontFamily: 'Ubuntu-Regular',
    },
    card: {
        borderRadius: 20,
        backgroundColor: "#F3F3F3",
        marginTop: hp('4'),
    },
    locicon: {
        fontSize: 35,
        color: '#FFFFFF',
    },
    locicon1: {
        fontSize: 35,
        color: '#81007F',
    },
    row: {
        flexDirection: "row",
        marginTop: "4%",
        marginLeft: "8%"
    },
    row1: {
        flexDirection: "row",
        marginTop: "4%",
        marginLeft: "8%",
        marginBottom: "5%"
    },
    notificationText: {
        fontSize: 17,
        marginLeft: "5%",
        fontFamily: 'Ubuntu-Regular',
        marginTop: "1%",
    },
    sText: {
        fontSize: 12,
        color: '#A9A9A9',
        marginLeft: "5%",
        fontFamily: 'Ubuntu-Regular',
    },
    submitText1: {
        fontSize: 17,
        color: '#fff',
        marginLeft: "15%"
    },
    submitText2: {
        fontSize: 16,
        color: '#81007F',
        marginRight: "8%"
    },
    Button: {
        alignItems: "center",
        backgroundColor: '#81007F',
        height: "8%",
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        flexDirection: "row",
        justifyContent: "space-between"
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
})