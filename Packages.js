import React from 'react';
import { StyleSheet, View, Image, Text, TouchableWithoutFeedback, TouchableNativeFeedback, Picker, StatusBar } from 'react-native';
import {
    Container,
    Content,
    Header,
    Left,
    Right,
    Item,
    CardItem,
    Card,
    Toast
} from 'native-base';
import qs from 'qs';
const baseUrl = "http://demoworks.in/php/mypropertree/api/common/";
const baseUrl2 = "http://demoworks.in/php/mypropertree/api/dashboard/";
import AsyncStorage from '@react-native-community/async-storage';
import RazorpayCheckout from 'react-native-razorpay';
import NoData from './NoData'

export default class Packages extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            type: '',
            data: [],
            register_type_name: '',
            getTypes: [],
            user_id: '',
            features: []
        }
    }
    componentDidMount() {
        this.getRegisterTypes();
        AsyncStorage.getItem('user_id').then((user_id) => {
            this.setState({
                user_id: user_id,
            });
            this.getPackeges(user_id);
        });
    }
    goToHome = () => {
        this.props.navigation.navigate('Home')
    }
    goToChairs = () => {
        this.props.navigation.navigate('Chairs')
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
                        getTypes: json.data,
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
    getPackeges = (user_id) => {
        this.setState({ loading: true });
        fetch(baseUrl + 'packages', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'content-type': 'application/x-www-form-urlencoded',
            },
            body: qs.stringify({
                //register_type_id: id
                user_id: user_id
            })
        }).then((response) => response.json())
            .then((json) => {
                if (json.status == 'valid') {
                    this.setState({
                        data: json.data,
                        loading: false,
                        register_type_name: json.register_type_name

                    });
                } else {
                    this.setState({ loading: false });
                }
            })
            .catch((error) => {
                this.setState({ loading: false });
            });
    }

    buyPlan = (id, amount,) => {
        console.log(id, this.state.user_id)
        this.setState({ loading: true });
        fetch("http://demoworks.in/php/mypropertree/api/dashboard/connect_razorpay", {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'content-type': 'application/x-www-form-urlencoded',
            },
            body: qs.stringify({
                user_id: this.state.user_id,
                plan_id: id
            })
        }).then((response) => response.json())
            .then((json) => {
                if (json.status == "valid") {
                    this.setState({
                        loading: false,
                    });
                    var options = {
                        description: 'Payment towards ' + json.order_id,
                        currency: 'INR',
                        key: json.key_id,
                        amount: amount,
                        name: 'My Proper Tree',
                        order_id: json.order_id,
                        prefill: {
                            email: json.email,
                            contact: json.mobile,
                            name: json.name
                        },
                        theme: { color: "#81007F" }
                    }
                    RazorpayCheckout.open(options).then((data) => {
                        this.setState({ loading: true });
                        fetch(baseUrl2 + 'razorpay_response', {
                            method: 'POST',
                            headers: {
                                Accept: 'application/json',
                                'content-type': 'application/x-www-form-urlencoded',
                            },
                            body: qs.stringify({
                                user_id: this.state.user_id,
                                payment_details_id: json.payment_details_id,
                                razorpay_order_id: data.razorpay_order_id,
                                razorpay_payment_id: data.razorpay_payment_id,
                                razorpay_signature: data.razorpay_signature,
                            })
                        }).then((response) => response.json())
                            .then((json) => {
                                this.setState({ loading: false });
                                if (json.status == "invalid") {
                                    Toast.show({
                                        text: json.message,
                                        duration: 7000,
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
                            });
                    }).catch((error) => {
                        this.setState({ loading: false });
                        Toast.show({
                            text: "Payment Processing Cancelled by user",
                            duration: 5000,
                            type: 'danger',
                            textStyle: { fontFamily: 'Ubuntu-Regular', color: "#ffffff", textAlign: 'center' },
                        })
                    });
                } else {
                    this.setState({ loading: false });
                    Toast.show({
                        text: json.message,
                        duration: 5000,
                        type: 'danger',
                        textStyle: { fontFamily: 'Ubuntu-Regular', color: "#ffffff", textAlign: 'center' },
                    })
                }
            }).catch((error) => {
                this.setState({ loading: false });
                Toast.show({
                    text: error.description,
                    duration: 2000,
                    type: 'danger',
                    textStyle: { fontFamily: 'Ubuntu-Regular', color: "#ffffff", textAlign: 'center' },
                })
            });
    }
    render() {
        if (this.state.data.length == 0) {
            return (
                <NoData />
            )
        }
        return (
            <Container>
                <StatusBar backgroundColor='#fff' barStyle="dark-content" />
                <View style={{ marginTop: "3%", marginLeft: "3%", }}>
                    <View style={{ flexDirection: "row", }}>
                        <TouchableWithoutFeedback onPress={this.goToHome}>
                            <Image source={require('../assets/back_icon.png')} resizeMode='contain' />
                        </TouchableWithoutFeedback>
                        <Text style={styles.headerText}>Packages</Text>
                    </View>
                </View>
                <View style={{ borderBottomWidth: 0.5, marginTop: "3%", elevation: 1, borderBottomColor: "#F0F0F0" }}></View>
                <Content>
                    <Text style={styles.PackageText}>
                        {this.state.register_type_name} Packages
                    </Text>

                    {
                        this.state.data.map((item, index) => {
                            let features = item.features
                            let colour = item.colour
                            return (
                                <TouchableWithoutFeedback onPress={() => this.buyPlan(item.id, item.amount,)}>
                                    <Card style={styles.card}>
                                        <View>
                                            <View style={{
                                                backgroundColor: colour,
                                                borderTopLeftRadius: 20,
                                                borderTopRightRadius: 20
                                            }}>
                                                <Text style={styles.text}>
                                                    {item.amount}
                                                </Text>
                                                <Text style={styles.text1}>
                                                    {item.plan_name}
                                                </Text>
                                            </View>
                                            <View>
                                                <Text style={styles.text2}>
                                                    {item.properties_limit}
                                                </Text>
                                            </View>
                                            <Text style={styles.text2}>
                                                {item.plan_sub_name}
                                            </Text>

                                        </View>
                                        {
                                            features.map((item, index) => {
                                                return (
                                                    <View>
                                                        <Text style={styles.text2}>
                                                            {item}
                                                        </Text>
                                                    </View>
                                                )
                                            })}
                                        {
                                            item.is_purchased == 1 ?
                                                <View style={styles.buttonContainer1}>
                                                    <Text style={styles.buttonText}>PURCHASED</Text>
                                                </View>
                                                :
                                                <View style={styles.buttonContainer}>
                                                    <Text style={styles.buttonText}>UPGRADE NOW</Text>
                                                </View>
                                        }
                                        {/* <View style={styles.buttonContainer}>
                                            <Text style={styles.buttonText}>UPGRADE NOW</Text>
                                        </View> */}
                                    </Card>
                                </TouchableWithoutFeedback>
                            )
                        })
                    }
                    <View style={{ marginBottom: "3%" }}></View>
                </Content>
            </Container>
        )
    }
}
const styles = StyleSheet.create({
    header: {
        backgroundColor: "#fff",
    },
    headerText: {
        color: "#000",
        fontSize: 17,
        fontFamily: 'Ubuntu-Bold',
        marginLeft: "8%"

    },
    Title: {
        marginTop: "2%",
        marginLeft: "8%",
        fontFamily: 'Ubuntu-Medium',
        fontSize: 15,
        color: '#5C5C5C',
    },
    item: {
        borderBottomWidth: 0.8,
        borderBottomColor: '#000',
        marginLeft: "7%",
        marginRight: "7%",
    },
    pickerStyle: {
        width: "100%",
        color: '#344953',
        justifyContent: 'center',
        color: "#000",
    },
    PackageText: {
        color: "#81007F",
        fontFamily: 'Ubuntu-Bold',
        fontSize: 18,
        textAlign: 'center',
        marginTop: "3%",
    },
    card: {
        marginTop: "5%",
        marginLeft: "9%",
        marginRight: "9%",
        borderRadius: 20,
    },
    textview: {
        marginLeft: "40%",
        marginTop: "4%"
    },
    text: {
        color: "#fff",
        fontSize: 52,
        fontFamily: 'Ubuntu-Bold',
        textAlign: "center"
    },
    text1: {
        color: '#fff',
        fontSize: 18,
        fontFamily: 'Ubuntu-Regular',
        textAlign: "center"
    },
    text2: {
        color: '#757575',
        fontSize: 15,
        textAlign: "center",
        borderBottomWidth: 0.2,
        borderBottomColor: "#d9d9d9",
        margin: "2.6%",
        fontFamily: 'Ubuntu-Regular',
    },
    buttonContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#81007F',
        width: '70%',
        padding: '4%',
        borderRadius: 25,
        marginBottom: "5%",
        alignSelf: "center"
    },
    buttonText: {
        fontFamily: 'Ubuntu-Bold',
        fontSize: 19,
        color: '#fff',
        fontWeight: "bold"
    },
    buttonContainer1: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ff6666',
        width: '70%',
        padding: '4%',
        borderRadius: 25,
        marginBottom: "5%",
        alignSelf: "center"
    },
    price: {
        backgroundColor: "#CD8032",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20
    },
    price2: {
        backgroundColor: "#C0C0C0",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20
    },
    price3: {
        backgroundColor: "#D3AF37",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20
    },

})