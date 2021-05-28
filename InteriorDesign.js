import React from 'react';
import { StyleSheet, View, Image, Text, TouchableWithoutFeedback, TouchableNativeFeedback, FlatList, Dimensions, StatusBar, Linking, Platform, } from 'react-native';
import {
    Container,
    Content,
    Header,
    Left,
    Right,
    Body,
    Toast,
    Icon
} from 'native-base';
import Carousel, { ParallaxImage, Pagination } from 'react-native-snap-carousel';
const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { MaterialIndicator } from 'react-native-indicators';
import qs from 'qs';
import NoData from './NoData'
const baseUrl = "http://demoworks.in/php/mypropertree/api/common/";
import AsyncStorage from '@react-native-community/async-storage';
export default class InteriorDesign extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            loading: true,
            type_name: "",
            sliders: []
        }
    }
    componentDidMount() {
        AsyncStorage.getItem('selectedcitysids').then((selectedcitysids) => {
            this.getInteriorData(selectedcitysids)
        })
    }
    goToHome = () => {
        this.props.navigation.navigate('Home')
    }
    goToView = (id) => {
        this.props.navigation.navigate('InteriorDetails', { id: id })
    }
    _renderItem = ({ item }, parallaxProps) => {
        return (
            <View style={styles.parimage}>
                <ParallaxImage
                    source={{ uri: item.image }}
                    containerStyle={styles.imageContainer}
                    style={styles.cimage}
                    {...parallaxProps}
                />
            </View>
        );
    };
    ListEmptyView = () => {
        return (
            <View style={{ alignItems: "center", justifyContent: "center" }}>
                <Text
                    style={{
                        color: 'red',
                        fontFamily: 'Ubuntu-Regular',
                        fontSize: 15,
                        alignItems: "center",
                        justifyContent: "center",
                        textAlign: "center",
                        marginTop: hp('25')
                    }}>
                    No Data Found
                </Text>
            </View>
        );
    }
    getInteriorData = (selectedcitysids) => {
        fetch(baseUrl + 'get_listings', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'content-type': 'application/x-www-form-urlencoded',
            },
            body: qs.stringify({
                type: this.props.route.params.type,
                city_id: selectedcitysids
            })
        }).then((response) => response.json())
            .then((json) => {
                console.log(this.props.route.params.type, selectedcitysids, json.slider_ads)
                if (json.status == 'valid') {
                    this.setState({
                        data: json.data,
                        loading: false,
                        type_name: json.type_name,
                        sliders: json.slider_ads
                    });
                } else {
                    this.setState({ loading: false });
                }
            })
            .catch((error) => {
                this.setState({ loading: false });
            });
    }
    contactOwner = (mobile) => {
        let number = '';
        if (Platform.OS === 'ios') {
            number = `telprompt:${mobile}`;
        }
        else {
            number = `tel:${mobile}`;
        }
        Linking.canOpenURL(number)
            .then((supported) => {
                if (!supported) {
                    Toast.show({
                        text: "No app is available to handle this request",
                        duration: 2500,
                        type: 'danger',
                        textStyle: { fontFamily: 'Ubuntu-Regular', color: "#ffffff", textAlign: 'center' },
                    })
                } else {
                    Linking.openURL(number)
                }
            })
            .catch((err) => {
                console.log(err)
                Toast.show({
                    text: "Unknown error occured",
                    duration: 2500,
                    type: 'danger',
                    textStyle: { fontFamily: 'Ubuntu-Regular', color: "#ffffff", textAlign: 'center' },
                })
            });

    }
    render() {
        if (this.state.loading) {
            return (
                <View style={{ flex: 1 }}>
                    <MaterialIndicator color="#81007F" size={30} />
                </View>
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
                        <Text style={styles.headerText}>{this.state.type_name}</Text>
                    </View>
                </View>
                <View style={{ borderBottomWidth: 0.5, marginTop: "3%", elevation: 1, borderBottomColor: "#F0F0F0" }}></View>
                <Content>
                    <View style={styles.Carousel}>
                        <Carousel
                            sliderWidth={deviceWidth}
                            sliderHeight={deviceHeight}
                            itemWidth={deviceWidth - 50}
                            data={this.state.sliders}
                            renderItem={this._renderItem}
                            hasParallaxImages={true}
                            onSnapToItem={index => this.setState({ activeSlide: index })}
                            loop={true}
                            autoplay={true}
                        />
                    </View>
                    <View style={{ marginTop: "2%" }}>
                        <Text style={styles.title}>{this.state.type_name} Listings</Text>
                    </View>
                    <FlatList
                        data={this.state.data}
                        renderItem={({ item }) =>
                        (
                            <TouchableWithoutFeedback onPress={() => { this.goToView(item.id) }}>
                                <View style={styles.imageView}>
                                    <View>
                                        <Image source={{ uri: item.listing_image }} resizeMode='cover' style={styles.image} />
                                    </View>
                                    <View>
                                        <Text style={styles.Text}>
                                            {item.title}
                                        </Text>
                                        <View style={styles.row}>
                                            <Image source={require('../assets/location.png')} resizeMode="contain" style={styles.locationImage} />
                                            <Text style={styles.Text1}>
                                                {item.address}
                                            </Text>
                                        </View>

                                        <View style={styles.row}>
                                            <TouchableWithoutFeedback onPress={() => this.contactOwner(item.mobile)}>
                                                <View style={styles.buttonContainer}>
                                                    <Text style={styles.buttonText}>Contact</Text>
                                                </View>
                                            </TouchableWithoutFeedback>
                                        </View>
                                    </View>
                                </View>
                            </TouchableWithoutFeedback>

                        )}
                        ListEmptyComponent={this.ListEmptyView}
                    />
                </Content>
                <View style={{ marginBottom: "3%" }}></View>
            </Container>
        )
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
    imageContainer: {
        height: (deviceHeight * 25) / 100,
        width: (deviceWidth * 90) / 100,
        alignItems: 'center',
        justifyContent: "center",
        marginBottom: Platform.select({ ios: 0, android: 1 }),
        // borderRadius: 20,
    },
    cimage: {
        ...StyleSheet.absoluteFillObject,
        resizeMode: 'contain',
    },
    Carousel: {
        marginTop: "2%",
        height: (deviceHeight * 25) / 100,
        width: (deviceWidth)

    },
    title: {
        color: "#171717",
        fontSize: 17,
        fontFamily: "Ubuntu-Medium",
        marginLeft: "7%",
        marginTop: "1%",
        marginBottom: "1%"
    },
    imageView: {
        flexDirection: "row",
        padding: 7
    },
    image: {
        height: 85,
        width: 120,
        borderRadius: 10,
        marginLeft: "12%"
    },
    buttonContainer: {
        width: wp('18'),
        height: hp('4'),
        backgroundColor: "#81007F",
        margin: '2%',
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonText: {
        fontFamily: "Ubuntu-Medium",
        fontSize: 12,
        color: "#fff"
    },
    Text: {
        marginBottom: "1%",
        fontFamily: "Ubuntu-Regular",
    },
    Text1: {
        color: "#000",
        fontSize: 12,
        marginTop: "1%",
        fontFamily: "Ubuntu-Regular",
        width: "70%",
    },
    Text2: {
        color: "#000",
        fontSize: 12,
        marginLeft: "8%",
        fontFamily: 'ubuntu',
    },
    locationImage: {
        marginTop: "3%",
        margin: "1%"
    },
    row: {
        flexDirection: "row"
    },
})