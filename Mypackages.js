import React from 'react';
import { StyleSheet, View, Image, Text, TouchableWithoutFeedback, TouchableNativeFeedback, TextInput, Dimensions, StatusBar, FlatList } from 'react-native';
import {
    Container,
    Content,
    Header,
    Left,
    Right,
    Body
} from 'native-base';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import qs from 'qs';
const baseUrl = "http://demoworks.in/php/mypropertree/api/dashboard/";
import AsyncStorage from '@react-native-community/async-storage';
import NoData from '../componets/NoData';
export default class Mypackages extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            data: [],
            user_id: ""
        }
    }
    componentDidMount() {
        AsyncStorage.getItem('user_id').then((user_id) => {
            this.setState({
                user_id: user_id,
            });
            this.getData();
        });
    }
    goToHome = () => {
        this.props.navigation.navigate('Home')
    }
    goToPackages = () => {
        this.props.navigation.navigate('Packages')
    }
    getData = () => {
        this.setState({ loading: true });
        fetch(baseUrl + 'my_packages', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'content-type': 'application/x-www-form-urlencoded',
            },
            body: qs.stringify({
                user_id: this.state.user_id
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
        return (
            <Container>
                <StatusBar backgroundColor='#fff' barStyle="dark-content" />
                <View style={{ marginTop: "3%", marginLeft: "3%", }}>
                    <View style={{ flexDirection: "row", }}>
                        <TouchableWithoutFeedback onPress={this.goToHome}>
                            <Image source={require('../assets/back_icon.png')} resizeMode='contain' />
                        </TouchableWithoutFeedback>
                        <Text style={styles.headerText}>My Packages</Text>
                    </View>
                </View>
                <View style={{ borderBottomWidth: 0.5, marginTop: "3%", elevation: 1, borderBottomColor: "#F0F0F0" }}></View>
                <Content>
                    <FlatList
                        data={this.state.data}
                        renderItem={({ item }) => (
                            <View style={styles.walletContainer} key={item.id}>
                                <View style={styles.row}>
                                    <View style={{ width: wp('50') }}>
                                        <Text style={styles.header1}>Package Name</Text>
                                    </View>
                                    <View style={{ width: wp('50') }}>
                                        <Text style={styles.headerVal}>{item.package_name}</Text>
                                    </View>
                                </View>
                                <View style={styles.divider}></View>
                                <View style={styles.row}>
                                    <View style={{ width: wp('50') }}>
                                        <Text style={styles.header1}>Total Properties</Text>
                                    </View>
                                    <View style={{ width: wp('50') }}>
                                        <Text style={styles.headerVal}>{item.total_properties}</Text>
                                    </View>
                                </View>
                                <View style={styles.divider}></View>
                                <View style={styles.row}>
                                    <View style={{ width: wp('50') }}>
                                        <Text style={styles.header1}>Posted Properties</Text>
                                    </View>
                                    <View style={{ width: wp('50') }}>
                                        <Text style={styles.headerVal}>{item.posted_properties}</Text>
                                    </View>
                                </View>
                                <View style={styles.divider}></View>
                                <View style={styles.row}>
                                    <View style={{ width: wp('50') }}>
                                        <Text style={styles.header1}>Price</Text>
                                    </View>
                                    <View style={{ width: wp('50') }}>
                                        <Text style={styles.headerVal4}>₹{item.price}</Text>
                                    </View>
                                </View>
                                <View style={styles.divider}></View>
                                <View style={styles.row}>
                                    <View style={{ width: wp('50') }}>
                                        <Text style={styles.header1}>Purchase date</Text>
                                    </View>
                                    <View style={{ width: wp('50') }}>
                                        <Text style={styles.headerVal}>{item.purchased_date}</Text>
                                    </View>
                                </View>
                                <View style={styles.divider}></View>
                                <View style={styles.row}>
                                    <View style={{ width: wp('50') }}>
                                        <Text style={styles.header1}>Expiry date</Text>
                                    </View>
                                    <View style={{ width: wp('50') }}>
                                        <Text style={styles.headerVal}>{item.expiry_date}</Text>
                                    </View>
                                </View>
                                <View style={styles.divider}></View>
                                <View style={styles.row}>
                                    <View style={{ width: wp('50') }}>
                                        <Text style={styles.header1}>Status</Text>
                                    </View>
                                    {
                                        item.status == 1 ?
                                            <View style={{ width: wp('50') }}>
                                                <Text style={styles.headerVal2}>Active</Text>
                                            </View> :
                                            <View style={{ width: wp('50') }}>
                                                <Text style={styles.headerVal1}>Expired</Text>
                                            </View>
                                    }

                                </View>
                            </View>
                        )}
                        keyExtractor={item => item.id}
                        contentContainerStyle={{ margin: '2%', paddingBottom: hp('1'), backgroundColor: '#ffffff' }}
                        ListEmptyComponent={
                            <View style={{ marginTop: hp('45') }}>
                                <NoData />
                            </View>
                        }
                    />
                </Content>
                <TouchableWithoutFeedback onPress={this.goToPackages}>
                    <View style={styles.buttonContainer}>
                        <Text style={styles.buttonText}>UPGRADE</Text>
                    </View>
                </TouchableWithoutFeedback>
            </Container>
        );
    }
}
const styles = StyleSheet.create({
    header: {
        backgroundColor: "#fff",
        borderBottomWidth: 0
    },
    headerText: {
        color: "#000",
        fontSize: 17,
        fontFamily: 'Ubuntu-Bold',
        marginLeft: "8%"

    },
    buttonContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#81007F',
        width: '50%',
        padding: '2%',
        borderRadius: 25,
        alignSelf: "center",
        margin: "2%"
    },
    buttonText: {
        fontFamily: 'Ubuntu-Bold',
        fontSize: 15,
        color: '#fff',
        fontWeight: "bold"
    },
    walletContainer: {
        margin: '2%',
        backgroundColor: '#f3f3f3',
        padding: '5%',
        borderRadius: 10
    },
    row: {
        flexDirection: 'row'
    },
    header1: {
        fontFamily: 'Ubuntu-Regular',
        fontSize: 15,
        color: '#67747d'
    },
    loginText2: {
        fontFamily: 'Ubuntu-Regular',
        fontSize: 15,
        color: "#797979",
        textAlign: 'center',
        lineHeight: 25
    },
    headerVal: {
        fontFamily: 'Ubuntu-Regular',
        fontSize: 13,
        color: '#000000',
    },
    headerVal2: {
        fontFamily: 'Ubuntu-Regular',
        fontSize: 15,
        color: 'green',
    },
    headerVal1: {
        fontFamily: 'Ubuntu-Regular',
        fontSize: 15,
        color: 'red',
    },
    divider: {
        borderWidth: 1,
        borderColor: '#e2e2e2',
        margin: '2%'
    },
    headerVal4: {
        fontFamily: 'Ubuntu-Regular',
        fontSize: 15,
        color: "#81007F"
    },
    text1: {
        textAlign: 'center',
        justifyContent: 'center',
        color: 'red',
        fontFamily: 'Ubuntu-Regular',
        fontSize: 18,
        marginTop: "75%"
    },

})