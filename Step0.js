import React, { Component } from 'react';
import { StyleSheet, View, Text, TouchableWithoutFeedback, Platform, Image, StatusBar } from 'react-native';
import { Container, Content, Footer, Toast, Card, CardItem, Body, Left, Right, } from 'native-base';
import SubHeader from './SubHeader';
import { MaterialIndicator } from 'react-native-indicators';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import AsyncStorage from '@react-native-community/async-storage';
const baseUrl = "http://demoworks.in/php/mypropertree/api/dashboard/";
import qs from 'qs';
import NoData from './NoData'
export default class Step0 extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            data: [],
            user_id: '',
            payment_id: ''
        }
    }
    componentDidMount() {
        AsyncStorage.getItem('user_id').then((user_id) => {
            this.setState({
                user_id: user_id,
            });
            this.getActivePlans();
        });
    }
    goToHome = () => {
        this.props.navigation.navigate('Home')
    }
    goToPostStep1 = () => {
        if (this.state.payment_id) {
            this.props.navigation.navigate('Property', { payment_id: this.state.payment_id })
        }

        else {
            Toast.show({
                text: "Please Select Package",
                duration: 3000,
                type: 'danger',
                textStyle: { fontFamily: 'Ubuntu-Regular', color: "#ffffff", textAlign: 'center' },
            })
        }
    }
    selectPlan = (payment_id) => {
        this.setState({ payment_id: payment_id })
    }
    getActivePlans = () => {
        this.setState({ loading: true });
        fetch(baseUrl + 'active_packages', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'content-type': 'application/x-www-form-urlencoded',
            },
            body: qs.stringify({
                user_id: this.state.user_id,

            })
        }).then((response) => response.json())
            .then((json) => {
                if (json.status == "valid") {
                    this.setState({
                        loading: false,
                        data: json.data
                    });
                } else {
                    this.setState({
                        loading: false,
                        data: []
                    });
                    Toast.show({
                        text: "Please purchase an offer before proceeding to posting your property",
                        duration: 3000,
                        type: 'success',
                        textStyle: { fontFamily: 'Ubuntu-Regular', color: "#ffffff", textAlign: 'center' },
                    })
                    this.props.navigation.navigate('Packages')
                }
            })
            .catch((error) => {
                this.setState({ loading: false, data: [] });
                console.error(error);
            });
    }

    render() {
        if (this.state.data.length == 0) {
            return (
                <NoData />
            )
        }
        return (
            <Container style={{ backgroundColor: '#ffffff' }}>
                <StatusBar backgroundColor='#fff' barStyle="dark-content" />
                <View style={{ marginTop: "3%", marginLeft: "3%", }}>
                    <View style={{ flexDirection: "row", }}>
                        <TouchableWithoutFeedback onPress={this.goToHome}>
                            <Image source={require('../assets/back_icon.png')} resizeMode='contain' />
                        </TouchableWithoutFeedback>
                        <Text style={styles.headerText}>Select Package</Text>
                    </View>
                </View>
                <View style={{ borderBottomWidth: 0.5, marginTop: "3%", elevation: 1, borderBottomColor: "#F0F0F0" }}></View>
                <Content style={{ margin: '1%', padding: '2%' }}>
                    {
                        this.state.data.map((item, index) => {
                            return (
                                <TouchableWithoutFeedback key={index} onPress={() => this.selectPlan(item.payment_id)}>
                                    <Card style={{ borderRadius: 4, padding: '4%', borderColor: this.state.payment_id == item.payment_id ? '#81007F' : '#ffffff', borderBottomWidth: 2, borderTopWidth: 2, borderLeftWidth: 2, borderRightWidth: 2 }}>
                                        <View style={{ flexDirection: 'row' }}>
                                            <View style={{ width: wp('65') }}>
                                                <Text style={styles.package_name}>{item.package_name}</Text>
                                            </View>
                                            <View>
                                                <Text style={styles.price}>{item.price} INR</Text>
                                            </View>
                                        </View>
                                        <View style={{ flexDirection: 'row' }}>
                                            <View style={{ width: wp('51') }}>
                                                <Text style={styles.package_avai}>Total properties - {item.total_properties}</Text>
                                            </View>
                                            <View>
                                                <Text style={styles.package_avai}>Purchase : {item.purchased_date}</Text>
                                            </View>
                                        </View>
                                        <View style={{ flexDirection: 'row' }}>
                                            <View style={{ width: wp('51') }}>
                                                <Text style={styles.package_avai}>Posted properties - {item.posted_properties}</Text>
                                            </View>
                                            <View>
                                                <Text style={styles.package_avai}>Expiry : {item.expiry_date}</Text>
                                            </View>
                                        </View>
                                    </Card>
                                </TouchableWithoutFeedback>
                            )
                        })
                    }
                </Content>
                <TouchableWithoutFeedback onPress={this.goToPostStep1}>
                    <View>
                        {
                            Platform.OS == "android" && <Footer style={{ backgroundColor: '#81007F', justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ fontFamily: 'Ubuntu-Regular', fontSize: 16, color: '#ffffff' }}>NEXT STEP</Text>
                            </Footer>
                        }

                        {
                            Platform.OS == "ios" && <View style={{ backgroundColor: '#81007F', justifyContent: 'center', alignItems: 'center', padding: '5%' }}>
                                <Text style={{ fontFamily: 'Ubuntu-Regular', fontSize: 16, color: '#ffffff' }}>NEXT STEP</Text>
                            </View>
                        }
                    </View>

                </TouchableWithoutFeedback>

            </Container>
        );
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
    text: {
        fontFamily: 'Ubuntu-Bold',
        fontSize: 15,
    },
    firstContainer: {
        backgroundColor: '#efefef',
        margin: '4%',
        padding: '1%'
    },
    subtext: {
        fontFamily: 'Ubuntu-Regular',
        fontSize: 14,
        color: '#717880'
    },
    footerText: {
        fontFamily: 'Ubuntu-Regular',
        fontSize: 16,
        color: '#ffffff'
    },
    card: {
        borderRadius: 4,
        padding: '4%'
    },
    package_name: {
        fontFamily: 'Ubuntu-Regular',
        fontSize: 15,
    },
    price: {
        fontFamily: 'Ubuntu-Regular',
        fontSize: 16,
        color: "#81007F",
    },
    package_avai: {
        fontFamily: 'Ubuntu-Regular',
        fontSize: 12,
        color: '#889399'
    }
})