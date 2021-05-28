import React from 'react';
import { StyleSheet, View, Image, Text, TouchableWithoutFeedback, TouchableNativeFeedback, FlatList, StatusBar, Linking } from 'react-native';
import {
    Container,
    Content,
    Header,
    Left,
    Right,
    Card

} from 'native-base';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import qs from 'qs';
const baseUrl = "http://demoworks.in/php/mypropertree/api/Affiliate_marketing/";
export default class Chairs extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            Data: [],
            loading: true,
            count: '',
            category_name: ''
        }
    }
    componentDidMount() {
        setTimeout(() => {
            this.setState({ loading: false });
        }, 10);
        this.getData();
    }
    goToHome = () => {
        this.props.navigation.navigate('Furniture')
    }
    goToProduct = (url) => {

    }
    getData = () => {
        this.setState({ loading: true });
        fetch(baseUrl + 'products', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'content-type': 'application/x-www-form-urlencoded',
            },
            body: qs.stringify({
                c_id: this.props.route.params.c_id
            })
        }).then((response) => response.json())
            .then((json) => {
                if (json.status == 'valid') {
                    var Data = json.data;
                    this.setState({
                        Data: Data,
                        category_name: json.category_name,
                        count: json.count,
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
                <View style={styles.header}>
                    <TouchableWithoutFeedback onPress={this.goToHome}>
                        <View>
                            <Image source={require('../assets/back_icon.png')} style={styles.leftimage} resizeMode="contain" />
                        </View>
                    </TouchableWithoutFeedback>
                    <View style={{}}>
                        <Text style={styles.headerText}>
                            {this.state.category_name}
                        </Text>
                            <Text style={styles.headerText1}>
                                {this.state.count} items
                        </Text>
                    </View>
                </View>
                <Content>
                    <View style={{ marginTop: "5%" }}>
                        {this.state.Data.length == 0 ?
                            <View style={{ alignItems: "center", justifyContent: "center", marginTop: hp('40') }}>
                                <Text
                                    style={{
                                        color: 'red',
                                        fontFamily: 'Ubuntu-Regular',
                                        fontSize: 15,
                                        alignItems: "center",
                                        justifyContent: "center",
                                        textAlign: "center",
                                    }}>
                                    No List Found
                                </Text>
                            </View>
                            :
                            <View>
                                {this.state.Data.map((item) => {
                                    return (
                                        <Card style={styles.card}>
                                            <View style={styles.row}>
                                                <Image source={{ uri: item.image }} style={styles.image} />
                                                <View style={styles.textview}>
                                                    <Text style={styles.text}>
                                                        {item.name}
                                                    </Text>
                                                    <View style={styles.row}>
                                                        <Text style={styles.text1}>
                                                            {item.discount_price}
                                                        </Text>
                                                        <Text style={styles.text2}>
                                                            {item.product_price}
                                                        </Text>
                                                    </View>
                                                    <Text style={styles.vendor}>
                                                        Vendor:  {item.vendor}
                                                    </Text>
                                                </View>
                                                <TouchableWithoutFeedback onPress={() => Linking.openURL(item.url)}>
                                                    <View style={styles.buttonContainer}>
                                                        <Text style={styles.buttonText}>BUY</Text>
                                                    </View>
                                                </TouchableWithoutFeedback>
                                            </View>
                                        </Card>
                                    )
                                })}
                            </View>
                        }
                    </View>
                    <View style={{ marginBottom: "3%" }}></View>
                </Content>
            </Container>
        )
    }
}
const styles = StyleSheet.create({
    header: {
        backgroundColor: "#fff",
        borderBottomWidth: 0,
        flexDirection: "row",
        marginTop: "2%",
        marginLeft: "3%",
    },
    headerText: {
        color: "#000",
        fontSize: 18,
        marginLeft: "17%",
        fontFamily: 'Ubuntu-Bold',
    },
    headerText1: {
        color: "#000",
        fontSize: 12,
        fontFamily: 'Ubuntu-Regular',
        marginLeft: "17%",
    },
    card: {
        marginTop: "9%",
        marginLeft: "4%",
        marginRight: "4%",
        borderRadius: 10,
        height: 125,
        marginBottom: "7%"
    },
    card1: {
        marginTop: "7%",
        marginLeft: "4%",
        marginRight: "4%",
        borderRadius: 10,
        height: 125,
        marginBottom: "7%"
    },
    row: {
        flexDirection: "row"
    },
    textview: {
        marginLeft: "40%",
        marginTop: "4%"
    },
    text: {
        color: "#585858",
        fontSize: 16,
        fontFamily: 'Ubuntu-Regular',
    },
    vendor: {
        fontSize: 12,
        fontFamily: 'Ubuntu-Regular',
    },
    text1: {
        color: '#81007F',
        fontSize: 19,
        fontFamily: 'Ubuntu-Regular',
    },
    text2: {
        color: '#B1B1B1',
        fontSize: 15,
        fontFamily: 'Ubuntu-Regular',
        marginLeft: "4%",
        textDecorationLine: 'line-through',
        margin: "1%",
    },
    text3: {
        color: '#4A8E53',
        fontSize: 15,
        fontFamily: 'Ubuntu-Regular',
    },
    image: {
        width: "34%",
        height: 110,
        borderRadius: 10,
        position: "absolute",
        bottom: 0,
        left: 15,
    },
    buttonContainer: {
        width: wp('18'),
        height: hp('4'),
        backgroundColor: '#81007F',
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        position: "absolute",
        bottom: 0,
        right: 15,
        top: 109,
    },
    buttonText: {
        fontFamily: 'ubuntu-Bold',
        fontSize: 15,
        color: "#fff",
        fontWeight: "bold"
    },
})
