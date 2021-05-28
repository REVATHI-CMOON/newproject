import React from 'react';
import { StyleSheet, View, Image, Text, StatusBar, TouchableNativeFeedback, TouchableWithoutFeedback, Linking, Platform, Dimensions } from 'react-native';
import {
    Container,
    Content,
    Header,
    Left,
    Right,
    Card,
    Toast,
    Icon
} from 'native-base';
import Timeline from 'react-native-timeline-flatlist';
import Dash from 'react-native-dash';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import AsyncStorage from '@react-native-community/async-storage';
import qs from 'qs';
import { MaterialIndicator } from 'react-native-indicators';
import Share from 'react-native-share';
const baseUrl = "http://demoworks.in/php/mypropertree/api/common/";
const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;
import { SliderBox } from 'react-native-image-slider-box';
import FastImage from 'react-native-fast-image';
export default class VillaDetails extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            property_image: "",
            data: {},
            facilities: [],
            property_gallery: [],
            extrarooms: [],
            variants: [],
            user_id: "",
            is_favourite: "",
            register_type_id: "",
            distance_from_road: "",
            floors_allowed: "",
            builtup_area: "",
            property_id: "",
            convenience: [],
            eco_friendly: [],
            entertainment: [],
            extrarooms1: [],
            variants1: []
        }
    }
    componentDidMount() {
        AsyncStorage.getItem('user_id').then((user_id) => {
            this.PropertyView(user_id);
            this.setState({
                user_id: user_id,
            });
        });
    }
    // componentDidUpdate() {
    //     this.setState({
    //         is_favourite: "yes",
    //     });
    // }
    goToVillas = () => {
        this.props.navigation.navigate(this.props.route.params.backscreen)
    }
    PropertyView = (user_id) => {
        fetch(baseUrl + 'view_property', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'content-type': 'application/x-www-form-urlencoded',
            },
            body: qs.stringify({
                property_id: this.props.route.params.property_id,
                user_id: user_id
            })
        }).then((response) => response.json())
            .then((json) => {
                if (json.status == 'valid') {
                    let tempArr = [];
                    var property_gallery = json.data.property_gallery;
                    property_gallery.map((item, index) => {
                        tempArr.push(item.image);
                    });
                    this.setState({
                        register_type_id: json.data.register_type_id,
                        user_id: this.state.user_id,
                        property_image: json.data.property_image,
                        data: json.data,
                        facilities: json.data.facilities,
                        property_gallery: tempArr,
                        loading: false,
                        is_favourite: json.data.is_favourite,
                        extrarooms: json.data.extrarooms,
                        variants: json.data.variants,
                        highLights: json.data.highlights,
                        layout_approvedby: json.data.layout_approvedby,
                        distance_from_road: json.data.distance_from_road,
                        builtup_area: json.data.builtup_area,
                        floors_allowed: json.data.floors_allowed,
                        property_id: json.data.property_id,
                        convenience: json.data.convenience,
                        eco_friendly: json.data.eco_friendly,
                        entertainment: json.data.entertainment,
                        extrarooms1: json.data.extrarooms1,
                        variants1: json.data.variants1
                    });
                } else {
                    this.setState({ loading: false });
                }
            })
            .catch((error) => {
                this.setState({ loading: false });
            });
    }
    shareProperty = (property_title, link) => {
        if (this.state.user_id) {
            const url = link.toString();
            const title = property_title;
            const message = '';
            const icon = 'data:<data_type>/<file_extension>;base64,<base64_data>';
            const options = Platform.select({
                ios: {
                    activityItemSources: [
                        { // For sharing url with custom title.
                            placeholderItem: { type: 'url', content: url },
                            item: {
                                default: { type: 'url', content: url },
                            },
                            subject: {
                                default: title,
                            },
                            linkMetadata: { originalUrl: url, url, title },
                        },
                        { // For sharing text.
                            placeholderItem: { type: 'text', content: message },
                            item: {
                                default: { type: 'text', content: message },
                                message: null, // Specify no text to share via Messages app.
                            },
                            linkMetadata: { // For showing app icon on share preview.
                                title: message
                            },
                        },
                        { // For using custom icon instead of default text icon at share preview when sharing with message.
                            placeholderItem: {
                                type: 'url',
                                content: icon
                            },
                            item: {
                                default: {
                                    type: 'text',
                                    content: `${message} ${url}`
                                },
                            },
                            linkMetadata: {
                                title: message,
                                icon: icon
                            }
                        },
                    ],
                },
                default: {
                    title: title,
                    message: `${title} ${url}`,
                },
            });
            Share.open(options)
                .then((res) => { console.log(res) })
                .catch((err) => { console.log(err); });
        }
        else {
            Toast.show({
                text: "Please login!",
                duration: 2500,
                type: 'danger',
                textStyle: { fontFamily: 'Roboto-Regular', color: "#ffffff", textAlign: 'center' },
            })
        }
    }
    openWattsapp = (whatsapp) => {
        if (this.state.user_id) {
            let url = 'whatsapp://send?text=hii&phone=91' + whatsapp;
            Linking.openURL(url).then((data) => {
                console.log('WhatsApp Opened');
            }).catch(() => {
                Toast.show({
                    text: "Make sure Whatsapp installed on your device",
                    duration: 2500,
                    type: 'danger',
                    textStyle: { fontFamily: 'Roboto-Regular', color: "#ffffff", textAlign: 'center' },
                })
            });
        }
        else {
            Toast.show({
                text: "Please login!",
                duration: 2500,
                type: 'danger',
                textStyle: { fontFamily: 'Roboto-Regular', color: "#ffffff", textAlign: 'center' },
            })
        }
    }
    contactOwner = (mobile) => {
        if (this.state.user_id) {
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
        else {
            Toast.show({
                text: "Please login!",
                duration: 2500,
                type: 'danger',
                textStyle: { fontFamily: 'Roboto-Regular', color: "#ffffff", textAlign: 'center' },
            })
        }
    }
    addToFavourites = (id) => {
        if (this.state.user_id) {
            if (this.state.is_favourite == "no") {
                this.setState({ loading: true });
                fetch(baseUrl + 'manage_favourites', {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'content-type': 'application/x-www-form-urlencoded',
                    },
                    body: qs.stringify({
                        user_id: this.state.user_id,
                        property_id: id,
                        action: "add"
                    })
                }).then((response) => response.json())
                    .then((json) => {
                        this.setState({ loading: false, is_favourite: "yes" });
                        if (json.status == "valid") {
                            Toast.show({
                                text: json.message,
                                duration: 2500,
                                type: 'success',
                                textStyle: { fontFamily: 'Ubuntu-Regular', color: "#ffffff", textAlign: 'center' },
                            })
                        } else if (json.status == "invalid") {
                            this.setState({ loading: false });
                            Toast.show({
                                text: json.message,
                                duration: 2500,
                                type: 'danger',
                                textStyle: { fontFamily: 'Ubuntu-Regular', color: "#ffffff", textAlign: 'center' },
                            })
                        }
                    })
                    .catch((error) => {
                        this.setState({ loading: false });
                        console.error(error);
                    });
            }

            else if (this.state.is_favourite == "yes") {
                this.setState({ loading: true });
                fetch(baseUrl + 'manage_favourites', {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'content-type': 'application/x-www-form-urlencoded',
                    },
                    body: qs.stringify({
                        user_id: this.state.user_id,
                        property_id: id,
                        action: "remove"
                    })
                }).then((response) => response.json())
                    .then((json) => {
                        this.setState({ loading: false, is_favourite: "no" });
                        if (json.status == "valid") {
                            Toast.show({
                                text: json.message,
                                duration: 2500,
                                type: 'danger',
                                textStyle: { fontFamily: 'Ubuntu-Regular', color: "#ffffff", textAlign: 'center' },
                            })
                        } else if (json.status == "invalid") {
                            this.setState({ loading: false });
                            Toast.show({
                                text: json.message,
                                duration: 2500,
                                type: 'danger',
                                textStyle: { fontFamily: 'Ubuntu-Regular', color: "#ffffff", textAlign: 'center' },
                            })
                        }
                    })
                    .catch((error) => {
                        this.setState({ loading: false });
                        console.error(error);
                    });
            }
        }
        else {
            Toast.show({
                text: "Please login!",
                duration: 2500,
                type: 'danger',
                textStyle: { fontFamily: 'Roboto-Regular', color: "#ffffff", textAlign: 'center' },
            })
        }
    }
    goToFavouriteUpdate = () => {
        this.setState({ is_favourite: "yes" });
    }
    goToAbout = () => {
        if (this.state.user_id) {
            this.props.navigation.navigate('AboutBuilders', { property_id: this.state.property_id })
        }
        else {
            Toast.show({
                text: "Please login!",
                duration: 2500,
                type: 'danger',
                textStyle: { fontFamily: 'Roboto-Regular', color: "#ffffff", textAlign: 'center' },
            })
        }

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
                <View style={styles.header}>
                    <TouchableWithoutFeedback onPress={this.goToVillas}>
                        <Image source={require('../assets/back_icon.png')} style={styles.leftimage} resizeMode="contain" />
                    </TouchableWithoutFeedback>
                    <View style={{height:hp('35')}}>
                        <View style={{ marginTop: hp('0.2') }}>
                            <SliderBox
                                ImageComponent={FastImage}
                                images={this.state.property_gallery}
                                ImageComponentStyle={{ width: '98%', height: 250 }}
                                dotColor="#81007F"
                                resizeMode={'stretch'}
                                autoplay
                                circleLoop
                                imageLoadingColor="#81007F"
                                onCurrentImagePressed={() => { this.props.navigation.navigate('PropertyImages', { property_id: this.state.property_id }) }}
                            />
                        </View>
                        <Image source={require('../assets/watermark.png')} style={styles.water} />
                    </View>
                </View>
                <View style={styles.View}>
                    <View style={styles.like}>
                        <TouchableWithoutFeedback onPress={() => this.addToFavourites(this.state.data.property_id)}>
                            {/* <Image source={require('../assets/wishlist_green_icon.png')} resizeMode="contain" /> */}
                            <View style={styles.wishlist1}>
                                <Icon active name='heart' type="FontAwesome" style={{ fontSize: 20, color: this.state.is_favourite == "no" ? '#fff' : '#44A53F' }} />
                            </View>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback onPress={() => this.shareProperty(this.state.data.property_title, this.state.data.property_link)}>
                            {/* <Image source={require('../assets/share_icon.png')} resizeMode="contain" /> */}
                            <View style={styles.wishlist}>
                                <Icon active name='share-alt' type="FontAwesome" style={{ fontSize: 20, color: '#fff' }} />
                            </View>
                        </TouchableWithoutFeedback>
                    </View>

                    <View style={{ padding: 15 }}>
                        {
                            this.state.data.property_subtype !== "128" &&
                            <Text style={styles.title}> {this.state.data.price}</Text>
                        }
                        {/* <Text style={styles.title}>₹ {this.state.data.price}</Text> */}
                        <View>
                            <Text style={styles.maintext456}>{this.state.data.property_title}</Text>
                        </View>
                        {this.state.register_type_id == 4 &&
                            <View style={{ flexDirection: "row" }}>
                                <Text style={styles.subtext}>{this.state.data.address}</Text>
                                <TouchableWithoutFeedback onPress={() => { this.goToAbout() }}>
                                    <View style={styles.buttonContainer123}>
                                        <Text style={styles.subtext123}>About Builder</Text>
                                    </View>
                                </TouchableWithoutFeedback>
                            </View>}
                        {this.state.register_type_id == 9 &&
                            <View style={{ flexDirection: "row" }}>
                                <Text style={styles.subtext}>{this.state.data.address}</Text>
                                <View>
                                    <TouchableWithoutFeedback onPress={() => { this.goToAbout() }}>
                                        <View style={styles.buttonContainer123}>
                                            <Text style={styles.subtext123}>About Developer</Text>
                                        </View>
                                    </TouchableWithoutFeedback>
                                </View>
                            </View>}
                        {this.state.register_type_id == 3 &&
                            <View style={{ flexDirection: "row" }}>
                                <Text style={styles.subtext1234}>{this.state.data.address}</Text>
                                <View>
                                    <TouchableWithoutFeedback onPress={() => { this.goToAbout() }}>
                                        <View style={styles.buttonContainer123}>
                                            <Text style={styles.subtext1235}>About Constuction Company</Text>
                                        </View>
                                    </TouchableWithoutFeedback>
                                </View>
                            </View>}
                        {(this.state.register_type_id == 1 || this.state.register_type_id == 2) &&
                            <View>
                                <Text style={styles.subtext}>{this.state.data.address}</Text>
                            </View>}
                    </View>
                    {this.state.register_type_id == 4 &&
                        <Content>
                            <View style={styles.row}>
                                <Dash style={styles.dash} dashColor="#C7C7C7" dashGap={3} />
                                <View>
                                    <View style={styles.row}>
                                        <Image source={require('../assets/rent_type.png')} resizeMode="contain" style={styles.images} />
                                        <View style={{ width: wp('80') }}>
                                            <Text style={styles.maintext1}>Property Details</Text>
                                            <Text style={styles.subtext1}>Project Status: {this.state.data.sale_status ? this.state.data.sale_status : "N/A"}</Text>
                                            {
                                                this.state.data.sale_status == "Under Construction" &&
                                                <Text style={styles.subtext1}>Possision Date : {this.state.data.pos_date ? this.state.data.pos_date : "N/A"}</Text>
                                            }
                                            <Text style={styles.subtext1}>Project Facing Towards : {this.state.data.facing}</Text>
                                            <Text style={styles.subtext1}>Furnished Status : {this.state.data.furniture_type}</Text>
                                            <Text style={styles.subtext1}>No of Units : {this.state.data.builtup_area}</Text>
                                            {
                                                this.state.data.property_subtype == 75 &&
                                                <Text style={styles.subtext1}>Total No of Floors: {this.state.data.floors}</Text>
                                            }
                                            <View style={{ width: wp('80') }}>
                                                <Text style={styles.maintext1}>Extra Rooms</Text>
                                                <View style={{ flexDirection: "row", flexWrap: "wrap", width: "80%", }}>
                                                    {
                                                        this.state.extrarooms.map((item, key) => {
                                                            return (

                                                                <View style={styles.buttonContainer11}>
                                                                    <Icon active name='circle' type="FontAwesome" style={{ fontSize: 5, color: '#81007F' }} />
                                                                    <Text style={styles.buttonText}>{item.name}</Text>
                                                                </View>
                                                            )
                                                        })
                                                    }
                                                </View>
                                            </View>
                                            {
                                                this.state.variants.length !== 0 &&
                                                <View>
                                                    <Text style={styles.maintext1}>Variants</Text>
                                                    <View style={{ flexDirection: "row", flexWrap: "wrap", width: "80%", marginTop: hp('1') }}>
                                                        {
                                                            this.state.variants.map((item, key) => {
                                                                return (
                                                                    <View style={{ marginLeft: hp('1.8') }}>
                                                                        <View style={{ width: wp('70'), flexDirection: "row", justifyContent: "space-between", marginTop: hp('1') }}>
                                                                            <Text style={{ fontSize: 13, fontFamily: "Ubuntu-Medium", }}>Facing towards</Text>
                                                                            <Text style={{ fontSize: 13, fontFamily: "Ubuntu-Medium", }}>Area</Text>
                                                                            <Text style={{ fontSize: 13, fontFamily: "Ubuntu-Medium", }}>Dimensions</Text>
                                                                        </View>
                                                                        <View style={{ width: wp('70'), flexDirection: "row", justifyContent: "space-between", marginTop: hp('1') }}>
                                                                            <Text style={{ marginLeft: wp('3') }}>{item.bedrooms}</Text>
                                                                            <Text style={{ marginLeft: wp('6') }}>{item.facing}</Text>
                                                                            <Text style={{ marginRight: wp('3') }}>{item.size}</Text>
                                                                        </View>
                                                                    </View>
                                                                )
                                                            })
                                                        }
                                                    </View>
                                                </View>
                                            }
                                            <View style={{ width: wp('80') }}>
                                                <Text style={styles.maintext1}>Description</Text>
                                                <Text style={styles.subtext1}>{this.state.data.description}</Text>
                                            </View>
                                        </View>
                                    </View>
                                    <View style={styles.row}>
                                        <Image source={require('../assets/rupee_icon.png')} resizeMode="contain" style={styles.images} />
                                        <View style={{ width: wp('80') }}>
                                            <Text style={styles.maintext1}>Sq.ft Price : Rs.{this.state.data.sqft_price}</Text>
                                            {/* <Text style={styles.subtext1}>Rs.{this.state.data.rent_per_month} per month</Text>
                                        <Text style={styles.subtext1}>Rs.{this.state.data.adv_amount} Advance Amount</Text>
                                        <Text style={styles.subtext1}>{this.state.data.security_deposite} Security Deposite</Text> */}
                                        </View>
                                    </View>
                                    <View style={styles.row}>
                                        <Image source={require('../assets/feature_icon.png')} resizeMode="contain" style={styles.images} />
                                        <View style={{ width: wp('80') }}>
                                            <Text style={styles.maintext1}>Features & Availability</Text>
                                            <View style={{ flexDirection: "row", flexWrap: "wrap", width: "80%", }}>
                                                {
                                                    this.state.facilities.map((item, key) => {
                                                        return (

                                                            <View style={styles.buttonContainer22}>
                                                                <Image source={{ uri: item.image }} resizeMode="contain" style={{ height: 20, width: 20 }} />
                                                                <Text style={styles.buttonText}>{item.name}</Text>

                                                            </View>
                                                        )
                                                    })
                                                }
                                            </View>
                                            {/* <View style={{ width: wp('78') }}>
                                            <Text style={styles.maintext1}>Near By Places</Text>
                                            <View style={{ flexDirection: "row", flexWrap: "wrap", width: "90%", }}>
                                                {
                                                    this.state.facilities.map((item, key) => {
                                                        return (
                                                            <View style={styles.buttonContainer22}>
                                                                <Image source={{ uri: item.image }} resizeMode="contain" style={{ height: 20, width: 20 }} />
                                                                <Text style={styles.buttonText}>{item.name}</Text>
                                                            </View>
                                                        )
                                                    })
                                                }
                                            </View>
                                        </View> */}
                                        </View>

                                    </View>
                                    {/* <View style={styles.row}>
                                        <Image source={require('../assets/gallery_icon.png')} resizeMode="contain" style={styles.images} />
                                        <View style={{ width: wp('80') }}>
                                            <Text style={styles.maintext1}>Gallery</Text>
                                            <View style={styles.gallery}>
                                                {
                                                    this.state.property_gallery.map((item, key) => {
                                                        return (
                                                            <View>
                                                                <Image source={{ uri: item.image }} style={styles.icon3} />
                                                            </View>
                                                        )
                                                    })
                                                }
                                            </View>
                                        </View>
                                    </View> */}
                                </View>
                            </View>
                            <View style={{ marginBottom: "13%" }}></View>
                        </Content>}
                    {this.state.register_type_id == 9 &&
                        <Content>
                            <View style={styles.row}>
                                <Dash style={styles.dash1} dashColor="#C7C7C7" dashGap={3} />
                                <View>
                                    <View style={{ flexDirection: "row" }}>
                                        <Text style={{ fontSize: 16, marginLeft: wp('5') }}>Layout is Approved By : </Text>
                                        <Text style={{ fontSize: 16, color: "#81007F", fontFamily: "Ubuntu-BoldItalic" }}>{this.state.layout_approvedby}</Text>
                                    </View>
                                    <View style={styles.row}>
                                        <Image source={require('../assets/rent_type.png')} resizeMode="contain" style={styles.images} />
                                        <View style={{ width: wp('80') }}>
                                            <Text style={styles.maintext1}>Property Details</Text>
                                            <Text style={styles.subtext1}>No of Units for Sale : {this.state.data.builtup_area}</Text>
                                            <Text style={styles.subtext1}>Width of the Road Facing the plot : {this.state.data.distance_from_road}</Text>
                                            <Text style={styles.subtext1}>Floors allowed for Construction : {this.state.data.floors_allowed}</Text>
                                            <View style={{ width: wp('80') }}>
                                                <Text style={styles.maintext1}>Description</Text>
                                                <Text style={styles.subtext1}>{this.state.data.description}</Text>
                                            </View>
                                        </View>
                                    </View>
                                    <View style={styles.row}>
                                        <Image source={require('../assets/rupee_icon.png')} resizeMode="contain" style={styles.images} />
                                        <View style={{ width: wp('80') }}>
                                            <Text style={styles.maintext1}>Sq.ft Price : Rs.{this.state.data.sqft_price}</Text>
                                        </View>
                                    </View>
                                    <View style={styles.row}>
                                        <Image source={require('../assets/feature_icon.png')} resizeMode="contain" style={styles.images} />
                                        <View style={{ width: wp('80') }}>
                                            <Text style={styles.maintext1}>Features & Availability</Text>
                                            <View style={{ flexDirection: "row", flexWrap: "wrap", width: "80%", }}>
                                                {
                                                    this.state.facilities.map((item, key) => {
                                                        return (

                                                            <View style={styles.buttonContainer22}>
                                                                <Image source={{ uri: item.image }} resizeMode="contain" style={{ height: 20, width: 20 }} />
                                                                <Text style={styles.buttonText}>{item.name}</Text>

                                                            </View>
                                                        )
                                                    })
                                                }
                                            </View>
                                            {
                                                this.state.variants.length !== 0 &&
                                                <View>
                                                    <Text style={styles.maintext1}>Variants</Text>
                                                    <View style={{ flexDirection: "row", flexWrap: "wrap", width: "80%", marginTop: hp('1') }}>
                                                        {
                                                            this.state.variants.map((item, key) => {
                                                                return (
                                                                    <View style={{ marginLeft: hp('1.8') }}>
                                                                        <View style={{ width: wp('70'), flexDirection: "row", justifyContent: "space-between", marginTop: hp('1') }}>
                                                                            <Text style={{ fontSize: 13, fontFamily: "Ubuntu-Medium", }}>Facing towards</Text>
                                                                            <Text style={{ fontSize: 13, fontFamily: "Ubuntu-Medium", }}>Area</Text>
                                                                            <Text style={{ fontSize: 13, fontFamily: "Ubuntu-Medium", }}>Dimensions</Text>
                                                                        </View>
                                                                        <View style={{ width: wp('70'), flexDirection: "row", justifyContent: "space-between", marginTop: hp('1') }}>
                                                                            <Text style={{ marginLeft: wp('3') }}>{item.bedrooms}</Text>
                                                                            <Text style={{ marginLeft: wp('6') }}>{item.facing}</Text>
                                                                            <Text style={{ marginRight: wp('3') }}>{item.size}</Text>
                                                                        </View>
                                                                    </View>
                                                                )
                                                            })
                                                        }
                                                    </View>
                                                </View>
                                            }
                                            {
                                                this.state.highLights.length !== 0 &&
                                                <View>
                                                    <Text style={styles.maintext1}>Project Highlights</Text>
                                                    <View style={{ width: "80%", marginTop: hp('1') }}>
                                                        {
                                                            this.state.highLights.map((item, key) => {
                                                                return (
                                                                    <View>
                                                                        <View style={{ marginTop: hp('1'), flexDirection: "row", width: wp('80'), }}>
                                                                            {/* <Icon active name='star-of-life' type="FontAwesome" style={{ fontSize: 8, color: '#81007F', marginTop: hp('1'), }} /> */}
                                                                            <Text style={{ fontSize: 18, color: '#81007F', fontFamily: "Ubuntu-Medium" }}>*</Text>
                                                                            <Text style={{ fontSize: 13, fontFamily: "Ubuntu-Medium", marginLeft: wp('2') }}>{item.value}</Text>
                                                                        </View>
                                                                    </View>
                                                                )
                                                            })
                                                        }
                                                    </View>
                                                </View>
                                            }
                                            <View>
                                                <Text style={styles.maintext1}>Near By Places</Text>
                                                <View style={{ width: "80%", marginTop: hp('1') }}>
                                                    <View>
                                                        <View style={{ marginTop: hp('1'), flexDirection: "row", width: wp('70'), justifyContent: "space-between" }}>
                                                            <Text style={{ fontSize: 14, fontFamily: "Ubuntu-Regular", width: wp('35') }}>+ Hospital: {this.state.data.hospital} KM</Text>
                                                            <Text style={{ fontSize: 14, fontFamily: "Ubuntu-Regular", width: wp('35') }}>+ Airport: {this.state.data.airport} KM</Text>
                                                        </View>
                                                        <View style={{ marginTop: hp('1'), flexDirection: "row", width: wp('70'), justifyContent: "space-between" }}>
                                                            <Text style={{ fontSize: 14, fontFamily: "Ubuntu-Regular", width: wp('35') }}>+ Park: {this.state.data.park} KM</Text>
                                                            <Text style={{ fontSize: 14, fontFamily: "Ubuntu-Regular", width: wp('35') }}>+ Bus stop: {this.state.data.bus_stop} KM</Text>
                                                        </View>
                                                        <View style={{ marginTop: hp('1'), flexDirection: "row", width: wp('70'), justifyContent: "space-between" }}>
                                                            <Text style={{ fontSize: 14, fontFamily: "Ubuntu-Regular", width: wp('35') }}>+ Railway Station: {this.state.data.railway_station} KM</Text>
                                                            <Text style={{ fontSize: 14, fontFamily: "Ubuntu-Regular", width: wp('35') }}>+ School: {this.state.data.school} KM</Text>
                                                        </View>
                                                    </View>
                                                </View>
                                            </View>
                                        </View>
                                    </View>

                                    {/* <View style={styles.row}>
                                        <Image source={require('../assets/gallery_icon.png')} resizeMode="contain" style={styles.images} />
                                        <View style={{ width: wp('78') }}>
                                            <Text style={styles.maintext1}>Gallery</Text>
                                            <View style={styles.gallery}>
                                                {
                                                    this.state.property_gallery.map((item, key) => {
                                                        return (
                                                            <View>
                                                                <Image source={{ uri: item.image }} style={styles.icon3} />
                                                            </View>
                                                        )
                                                    })
                                                }
                                            </View>
                                        </View>
                                    </View> */}
                                </View>
                            </View>
                            <View style={{ marginBottom: "13%" }}></View>
                        </Content>}
                    {(this.state.register_type_id == 1 || this.state.register_type_id == 2) &&
                        <Content>
                            <View style={styles.row}>
                                <Dash style={styles.dash} dashColor="#C7C7C7" dashGap={3} />
                                <View>
                                    {
                                        this.state.data.property_subtype == 117 &&

                                        <View>
                                            <View style={styles.row}>
                                                <Image source={require('../assets/rent_type.png')} resizeMode="contain" style={styles.images} />
                                                <View style={{ width: wp('80') }}>
                                                    <Text style={styles.maintext1}>Property Details</Text>
                                                    <Text style={styles.subtext1}>Area of Land : {this.state.data.builtup_area}  (acres/cents)</Text>
                                                    <Text style={styles.subtext1}>Water Facility : {this.state.data.water_facility}</Text>
                                                    <Text style={styles.subtext1}>Diatance from Road : {this.state.data.distance_from_road}</Text>
                                                    <View style={{ width: wp('80') }}>
                                                        <Text style={styles.maintext1}>Description</Text>
                                                        <Text style={styles.subtext1}>{this.state.data.description}</Text>
                                                    </View>
                                                </View>
                                            </View>
                                            {/* <View style={styles.row}>
                                                <Image source={require('../assets/gallery_icon.png')} resizeMode="contain" style={styles.images} />
                                                <View style={{ width: wp('80') }}>
                                                    <Text style={styles.maintext1}>Gallery</Text>
                                                    <View style={styles.gallery}>
                                                        {
                                                            this.state.property_gallery.map((item, key) => {
                                                                return (
                                                                    <View>
                                                                        <Image source={{ uri: item.image }} style={styles.icon3} />
                                                                    </View>
                                                                )
                                                            })
                                                        }
                                                    </View>
                                                </View>
                                            </View> */}
                                        </View>
                                    }
                                    {
                                        this.state.data.property_subtype == 120 &&
                                        <View>
                                            <View style={styles.row}>
                                                <Image source={require('../assets/rent_type.png')} resizeMode="contain" style={styles.images} />
                                                <View style={{ width: wp('80') }}>
                                                    <Text style={styles.maintext1}>Property Details</Text>
                                                    <Text style={styles.subtext1}>Shop  Type: {this.state.data.shop_type}</Text>
                                                    <Text style={styles.subtext1}>Total Area of Shop : {this.state.data.builtup_area} sq.ft</Text>
                                                    <Text style={styles.subtext1}>Size : {this.state.data.size}</Text>
                                                    <Text style={styles.subtext1}>Sale Type: {this.state.data.sale_type}</Text>
                                                    {this.state.data.sale_type == "Resale" &&
                                                        <Text style={styles.subtext1}>Property Age : {this.state.data.property_age}</Text>}
                                                    <View style={{ width: wp('80') }}>
                                                        <Text style={styles.maintext1}>Description</Text>
                                                        <Text style={styles.subtext1}>{this.state.data.description}</Text>
                                                    </View>
                                                </View>
                                            </View>
                                            <View style={styles.row}>
                                                <Image source={require('../assets/rupee_icon.png')} resizeMode="contain" style={styles.images} />
                                                <View style={{ width: wp('80') }}>
                                                    <Text style={styles.maintext1}>Sq.ft Price : Rs.{this.state.data.sqft_price} </Text>
                                                    {
                                                        this.state.data.property_type == "2" &&
                                                        <View>
                                                            <Text style={styles.subtext1}>Maintinance:{this.state.data.maintenance}</Text>
                                                            <Text style={styles.subtext1}>Security Deposite:{this.state.data.security_deposite}</Text>
                                                        </View>
                                                    }
                                                </View>
                                            </View>
                                            {/* <View style={styles.row}>
                                                <Image source={require('../assets/gallery_icon.png')} resizeMode="contain" style={styles.images} />
                                                <View style={{ width: wp('80') }}>
                                                    <Text style={styles.maintext1}>Gallery</Text>
                                                    <View style={styles.gallery}>
                                                        {
                                                            this.state.property_gallery.map((item, key) => {
                                                                return (
                                                                    <View>
                                                                        <Image source={{ uri: item.image }} style={styles.icon3} />
                                                                    </View>
                                                                )
                                                            })
                                                        }
                                                    </View>
                                                </View>
                                            </View> */}
                                        </View>
                                    }
                                    {
                                        this.state.data.property_subtype == 119 &&
                                        <View>
                                            <View style={styles.row}>
                                                <Image source={require('../assets/rent_type.png')} resizeMode="contain" style={styles.images} />
                                                <View style={{ width: wp('80') }}>
                                                    <Text style={styles.maintext1}>Property Details</Text>
                                                    <Text style={styles.subtext1}>Total Area : {this.state.data.builtup_area} sq.ft</Text>
                                                    <Text style={styles.subtext1}>Size : {this.state.data.size}</Text>
                                                    <Text style={styles.subtext1}>Sale Type: {this.state.data.sale_type}</Text>
                                                    {this.state.data.sale_type == "Resale" &&
                                                        <Text style={styles.subtext1}>Property Age : {this.state.data.property_age}</Text>}
                                                    <View style={{ width: wp('80') }}>
                                                        <Text style={styles.maintext1}>Description</Text>
                                                        <Text style={styles.subtext1}>{this.state.data.description}</Text>
                                                    </View>
                                                </View>
                                            </View>
                                            <View style={styles.row}>
                                                <Image source={require('../assets/rupee_icon.png')} resizeMode="contain" style={styles.images} />
                                                <View style={{ width: wp('80') }}>
                                                    <Text style={styles.maintext1}>Sq.ft Price : Rs.{this.state.data.sqft_price}</Text>
                                                    {
                                                        this.state.data.property_type == "2" &&
                                                        <View>
                                                            <Text style={styles.subtext1}>Maintinance:{this.state.data.maintenance}</Text>
                                                            <Text style={styles.subtext1}>Security Deposite:{this.state.data.security_deposite}</Text>
                                                        </View>
                                                    }
                                                </View>
                                            </View>
                                            <View style={styles.row}>
                                                <Image source={require('../assets/feature_icon.png')} resizeMode="contain" style={styles.images} />
                                                <View style={{ width: wp('80') }}>
                                                    <Text style={styles.maintext1}>Amenities</Text>
                                                    <View style={{ flexDirection: "row", flexWrap: "wrap", width: "80%", }}>
                                                        {
                                                            this.state.facilities.map((item, key) => {
                                                                return (

                                                                    <View style={styles.buttonContainer22}>
                                                                        <Image source={{ uri: item.image }} resizeMode="contain" style={{ height: 20, width: 20 }} />
                                                                        <Text style={styles.buttonText}>{item.name}</Text>

                                                                    </View>
                                                                )
                                                            })
                                                        }
                                                    </View>
                                                </View>

                                            </View>
                                            {/* <View style={styles.row}>
                                                <Image source={require('../assets/gallery_icon.png')} resizeMode="contain" style={styles.images} />
                                                <View style={{ width: wp('80') }}>
                                                    <Text style={styles.maintext1}>Gallery</Text>
                                                    <View style={styles.gallery}>
                                                        {
                                                            this.state.property_gallery.map((item, key) => {
                                                                return (
                                                                    <View>
                                                                        <Image source={{ uri: item.image }} style={styles.icon3} />
                                                                    </View>
                                                                )
                                                            })
                                                        }
                                                    </View>
                                                </View>
                                            </View> */}
                                        </View>
                                    }
                                    {
                                        this.state.data.property_subtype == 74 &&
                                        <View>
                                            <View style={styles.row}>
                                                <Image source={require('../assets/rent_type.png')} resizeMode="contain" style={styles.images} />
                                                <View style={{ width: wp('80') }}>
                                                    <Text style={styles.maintext1}>Property Details</Text>
                                                    <Text style={styles.subtext1}>Area of Land : {this.state.data.builtup_area}  (acres/cents)</Text>
                                                    <Text style={styles.subtext1}>Size : {this.state.data.size}</Text>
                                                    <View style={{ width: wp('80') }}>
                                                        <Text style={styles.maintext1}>Description</Text>
                                                        <Text style={styles.subtext1}>{this.state.data.description}</Text>
                                                    </View>
                                                    <View>
                                                        <Text style={styles.maintext1}>Near By Places</Text>
                                                        <View style={{ width: "80%", marginTop: hp('1') }}>
                                                            <View>
                                                                <View style={{ marginTop: hp('1'), flexDirection: "row", width: wp('70'), justifyContent: "space-between" }}>
                                                                    <Text style={{ fontSize: 14, fontFamily: "Ubuntu-Regular", width: wp('35') }}>+ Hospital: {this.state.data.hospital} KM</Text>
                                                                    <Text style={{ fontSize: 14, fontFamily: "Ubuntu-Regular", width: wp('35') }}>+ Grocery Store: {this.state.data.grocery_store} KM</Text>
                                                                </View>
                                                                <View style={{ marginTop: hp('1'), flexDirection: "row", width: wp('70'), justifyContent: "space-between" }}>
                                                                    <Text style={{ fontSize: 14, fontFamily: "Ubuntu-Regular", width: wp('35') }}>+ Park: {this.state.data.park} KM</Text>
                                                                    <Text style={{ fontSize: 14, fontFamily: "Ubuntu-Regular", width: wp('35') }}>+ Bus stop: {this.state.data.bus_stop} KM</Text>
                                                                </View>
                                                                <View style={{ marginTop: hp('1'), flexDirection: "row", width: wp('70'), justifyContent: "space-between" }}>
                                                                    <Text style={{ fontSize: 14, fontFamily: "Ubuntu-Regular", width: wp('35') }}>+ Pharmacy: {this.state.data.pharmacy} KM</Text>
                                                                    <Text style={{ fontSize: 14, fontFamily: "Ubuntu-Regular", width: wp('35') }}>+ School: {this.state.data.school} KM</Text>
                                                                </View>
                                                            </View>
                                                        </View>
                                                    </View>
                                                    <View style={styles.row}>
                                                        {/* <Image source={require('../assets/rupee_icon.png')} resizeMode="contain" style={styles.images} /> */}
                                                        <View style={{ width: wp('80'), }}>
                                                            <Text style={styles.maintext1}>Total area of property : {this.state.data.builtup_area} sq.ft</Text>
                                                        </View>
                                                    </View>
                                                </View>
                                            </View>


                                            <View style={styles.row}>
                                                <Image source={require('../assets/feature_icon.png')} resizeMode="contain" style={styles.images} />
                                                <View style={{ width: wp('80') }}>
                                                    <Text style={styles.maintext1}>Amenities</Text>
                                                    <View style={{ flexDirection: "row", flexWrap: "wrap", width: "80%", }}>
                                                        {
                                                            this.state.facilities.map((item, key) => {
                                                                return (

                                                                    <View style={styles.buttonContainer22}>
                                                                        <Image source={{ uri: item.image }} resizeMode="contain" style={{ height: 20, width: 20 }} />
                                                                        <Text style={styles.buttonText}>{item.name}</Text>

                                                                    </View>
                                                                )
                                                            })
                                                        }
                                                    </View>
                                                </View>

                                            </View>
                                            {/* <View style={styles.row}>
                                                <Image source={require('../assets/gallery_icon.png')} resizeMode="contain" style={styles.images} />
                                                <View style={{ width: wp('80') }}>
                                                    <Text style={styles.maintext1}>Gallery</Text>
                                                    <View style={styles.gallery}>
                                                        {
                                                            this.state.property_gallery.map((item, key) => {
                                                                return (
                                                                    <View>
                                                                        <Image source={{ uri: item.image }} style={styles.icon3} />
                                                                    </View>
                                                                )
                                                            })
                                                        }
                                                    </View>
                                                </View>
                                            </View> */}
                                        </View>

                                    }
                                    {
                                        (this.state.data.property_subtype == 76 || this.state.data.property_subtype == 75) &&
                                        <View>
                                            <View style={styles.row}>
                                                <Image source={require('../assets/rent_type.png')} resizeMode="contain" style={styles.images} />
                                                <View style={{ width: wp('80') }}>
                                                    <Text style={styles.maintext1}>Property Details</Text>
                                                    {
                                                        this.state.data.property_type == "2" &&
                                                        <Text style={styles.subtext1}>Tenent Type : {this.state.data.tenant_type}</Text>
                                                    }

                                                    <Text style={styles.subtext1}>Project Facing Towards : {this.state.data.facing}</Text>
                                                    <Text style={styles.subtext1}>No of BHKs : {this.state.data.bedrooms}</Text>
                                                    <Text style={styles.subtext1}>Furnished Status : {this.state.data.furniture_type}</Text>
                                                    {/* <Text style={styles.subtext1}>No of Units : {this.state.data.builtup_area}</Text> */}
                                                    <Text style={styles.subtext1}>Floors: {this.state.data.floors}</Text>
                                                    <Text style={styles.subtext1}>Sale Type: {this.state.data.sale_type}</Text>
                                                    {this.state.data.sale_type == "Resale" &&
                                                        <Text style={styles.subtext1}>Property Age : {this.state.data.property_age}</Text>}
                                                    <Text style={styles.subtext1}>Sale Status : {this.state.data.sale_status ? this.state.data.sale_status : "N/A"}</Text>
                                                    {
                                                        this.state.data.sale_status == "Under Construction" &&
                                                        <Text style={styles.subtext1}>Possision Date : {this.state.data.pos_date ? this.state.data.pos_date : "N/A"}</Text>
                                                    }
                                                    <Text style={styles.subtext1}>Property Locality : {this.state.data.property_locality}</Text>
                                                    <View style={{ width: wp('80') }}>
                                                        <Text style={styles.maintext1}>Description</Text>
                                                        <Text style={styles.subtext1}>{this.state.data.description}</Text>
                                                    </View>
                                                    <View>
                                                        <Text style={styles.maintext1}>Near By Places</Text>
                                                        <View style={{ width: "80%", marginTop: hp('1') }}>
                                                            <View>
                                                                <View style={{ marginTop: hp('1'), flexDirection: "row", width: wp('70'), justifyContent: "space-between" }}>
                                                                    <Text style={{ fontSize: 14, fontFamily: "Ubuntu-Regular", width: wp('35') }}>+ Hospital: {this.state.data.hospital} KM</Text>
                                                                    <Text style={{ fontSize: 14, fontFamily: "Ubuntu-Regular", width: wp('35') }}>+ Grocery Store: {this.state.data.grocery_store} KM</Text>
                                                                </View>
                                                                <View style={{ marginTop: hp('1'), flexDirection: "row", width: wp('70'), justifyContent: "space-between" }}>
                                                                    <Text style={{ fontSize: 14, fontFamily: "Ubuntu-Regular", width: wp('35') }}>+ Park: {this.state.data.park} KM</Text>
                                                                    <Text style={{ fontSize: 14, fontFamily: "Ubuntu-Regular", width: wp('35') }}>+ Bus stop: {this.state.data.bus_stop} KM</Text>
                                                                </View>
                                                                <View style={{ marginTop: hp('1'), flexDirection: "row", width: wp('70'), justifyContent: "space-between" }}>
                                                                    <Text style={{ fontSize: 14, fontFamily: "Ubuntu-Regular", width: wp('35') }}>+ Pharmacy: {this.state.data.pharmacy} KM</Text>
                                                                    <Text style={{ fontSize: 14, fontFamily: "Ubuntu-Regular", width: wp('35') }}>+ School: {this.state.data.school} KM</Text>
                                                                </View>
                                                            </View>
                                                        </View>
                                                    </View>
                                                    <View style={styles.row}>
                                                        {/* <Image source={require('../assets/rupee_icon.png')} resizeMode="contain" style={styles.images} /> */}
                                                        <View style={{ width: wp('80'), }}>
                                                            <Text style={styles.maintext1}>Total area of property : {this.state.data.builtup_area} sq.ft</Text>
                                                            {
                                                                this.state.data.property_type == "2" &&
                                                                <View>
                                                                    <Text style={styles.subtext1}>Maintinance:{this.state.data.maintenance}</Text>
                                                                    <Text style={styles.subtext1}>Security Deposite:{this.state.data.security_deposite}</Text>
                                                                </View>
                                                            }
                                                            {/* <Text style={styles.subtext1}>Maintinance:{this.state.data.maintenance}</Text>
                                            <Text style={styles.subtext1}>Security Deposite:{this.state.data.security_deposite}</Text> */}
                                                        </View>
                                                    </View>
                                                </View>
                                            </View>


                                            <View style={styles.row}>
                                                <Image source={require('../assets/feature_icon.png')} resizeMode="contain" style={styles.images} />
                                                <View style={{ width: wp('80') }}>
                                                    <Text style={styles.maintext1}>Features & Availability</Text>
                                                    <View style={{ flexDirection: "row", flexWrap: "wrap", width: "80%", }}>
                                                        {
                                                            this.state.facilities.map((item, key) => {
                                                                return (

                                                                    <View style={styles.buttonContainer22}>
                                                                        <Image source={{ uri: item.image }} resizeMode="contain" style={{ height: 20, width: 20 }} />
                                                                        <Text style={styles.buttonText}>{item.name}</Text>

                                                                    </View>
                                                                )
                                                            })
                                                        }
                                                    </View>
                                                </View>

                                            </View>
                                            {/* <View style={styles.row}>
                                                <Image source={require('../assets/gallery_icon.png')} resizeMode="contain" style={styles.images} />
                                                <View style={{ width: wp('80') }}>
                                                    <Text style={styles.maintext1}>Gallery</Text>
                                                    <View style={styles.gallery}>
                                                        {
                                                            this.state.property_gallery.map((item, key) => {
                                                                return (
                                                                    <View>
                                                                        <Image source={{ uri: item.image }} style={styles.icon3} />
                                                                    </View>
                                                                )
                                                            })
                                                        }
                                                    </View>
                                                </View>
                                            </View> */}
                                        </View>
                                    }

                                </View>
                            </View>
                            <View style={{ marginBottom: "13%" }}></View>
                        </Content>}
                    {this.state.register_type_id == 3 &&
                        <Content>
                            <View style={styles.row}>
                                <Dash style={styles.dash} dashColor="#C7C7C7" dashGap={3} />
                                <View>
                                    <View style={styles.row}>
                                        <Image source={require('../assets/rent_type.png')} resizeMode="contain" style={styles.images} />
                                        <View style={{ width: wp('80') }}>
                                            <Text style={styles.maintext1}>Property Details</Text>
                                            <Text style={styles.subtext1}>Rera Id : {this.state.data.rera_id}</Text>
                                            <Text style={styles.subtext1}>Total Area of Projects: {this.state.data.total_area_of_projects} sq.ft</Text>
                                            <Text style={styles.subtext1}>Project Status: {this.state.data.sale_status ? this.state.data.sale_status : "N/A"}</Text>
                                            {
                                                this.state.data.sale_status == "Under Construction" &&
                                                <Text style={styles.subtext1}>Possision Date : {this.state.data.pos_date ? this.state.data.pos_date : "N/A"}</Text>
                                            }
                                            {
                                                (this.state.data.property_subtype == 75 || this.state.data.property_subtype == 76 || this.state.data.gtype == "1" || this.state.data.gtype == "2") &&
                                                <View>
                                                    <Text style={styles.subtext1}>No of Units : {this.state.data.builtup_area}</Text>
                                                    <Text style={styles.subtext1}>Furnished Status : {this.state.data.furniture_type}</Text>
                                                    {
                                                        (this.state.data.property_subtype == 75 || this.state.data.gtype == "2") &&
                                                        <View>
                                                            <Text style={styles.subtext1}>No of towers : {this.state.data.no_of_towers}</Text>
                                                            <Text style={styles.subtext1}>No of floors for tower: {this.state.data.floors}</Text>
                                                        </View>
                                                    }
                                                </View>
                                            }
                                            {
                                                this.state.data.gtype == "3" &&
                                                <View>
                                                    <Text style={styles.subtext1}>No of Units : {this.state.data.builtup_area}</Text>
                                                </View>
                                            }
                                            {
                                                this.state.data.property_subtype == "128" &&
                                                <View>
                                                    <Text style={styles.loginText22}>
                                                        Villa  :
                                                    </Text>
                                                    <Text style={styles.maintext}>Starting Price : {this.state.data.price}</Text>
                                                    <Text style={styles.subtext1}>No of Units : {this.state.data.builtup_area}</Text>
                                                    <Text style={styles.subtext1}>Furnished Status : {this.state.data.furniture_type}</Text>
                                                </View>
                                            }

                                        </View>
                                    </View>
                                    {
                                        (this.state.data.property_subtype == 75 || this.state.data.property_subtype == 76 || this.state.data.property_subtype == "128" || this.state.data.property_subtype == "129" || this.state.data.gtype == "1" || this.state.data.gtype == "2") &&
                                        <View style={styles.row}>
                                            <Image source={require('../assets/rupee_icon.png')} resizeMode="contain" style={styles.images} />
                                            <View style={{ width: wp('80') }}>
                                                <Text style={styles.maintext1}>Sq.ft Price : Rs.{this.state.data.sqft_price}</Text>
                                            </View>
                                        </View>
                                    }
                                    {/* {
                                        this.state.data.gtype == "3" &&
                                        <View style={styles.row}>
                                            <Image source={require('../assets/rupee_icon.png')} resizeMode="contain" style={styles.images} />
                                            <View style={{ width: wp('80') }}>
                                                <Text style={styles.maintext1}>Sq.ft Price : Rs.{this.state.data.sqft_price}</Text>
                                            </View>
                                        </View>
                                    } */}
                                    <View style={styles.row}>
                                        <Image source={require('../assets/feature_icon.png')} resizeMode="contain" style={styles.images} />
                                        <View style={{ width: wp('80') }}>

                                            <View style={{ width: wp('80') }}>
                                                {
                                                    (this.state.data.property_subtype == 75 || this.state.data.property_subtype == 76 || this.state.data.property_subtype == "128" || this.state.data.gtype == "1" || this.state.data.gtype == "2") &&
                                                    <View>
                                                        {
                                                            this.state.extrarooms.length !== 0 &&
                                                            <View>
                                                                <Text style={styles.maintext1}>Extra Rooms</Text>
                                                                <View style={{ flexDirection: "row", flexWrap: "wrap", width: "80%", }}>
                                                                    {
                                                                        this.state.extrarooms.map((item, key) => {
                                                                            return (

                                                                                <View style={styles.buttonContainer11}>
                                                                                    <Icon active name='circle' type="FontAwesome" style={{ fontSize: 5, color: '#81007F' }} />
                                                                                    <Text style={styles.buttonText}>{item.name}</Text>
                                                                                </View>
                                                                            )
                                                                        })
                                                                    }
                                                                </View>
                                                            </View>
                                                        }

                                                        {
                                                            this.state.variants.length !== 0 &&
                                                            <View>
                                                                <Text style={styles.maintext1}>Variants</Text>
                                                                <View style={{ flexDirection: "row", flexWrap: "wrap", width: "80%", marginTop: hp('1') }}>
                                                                    {
                                                                        this.state.variants.map((item, key) => {
                                                                            return (
                                                                                <View style={{ marginLeft: hp('1.8') }}>
                                                                                    <View style={{ width: wp('70'), flexDirection: "row", justifyContent: "space-between", marginTop: hp('1') }}>
                                                                                        <Text style={{ fontSize: 13, fontFamily: "Ubuntu-Medium", }}>Bedrooms</Text>
                                                                                        <Text style={{ fontSize: 13, fontFamily: "Ubuntu-Medium", }}>Facing</Text>
                                                                                        <Text style={{ fontSize: 13, fontFamily: "Ubuntu-Medium", }}>Size</Text>
                                                                                    </View>
                                                                                    <View style={{ width: wp('70'), flexDirection: "row", justifyContent: "space-between", marginTop: hp('1') }}>
                                                                                        <Text style={{ marginLeft: wp('3') }}>{item.bedrooms}</Text>
                                                                                        <Text style={{ marginLeft: wp('6') }}>{item.facing}</Text>
                                                                                        <Text style={{ marginRight: wp('3') }}>{item.size}</Text>
                                                                                    </View>
                                                                                </View>
                                                                            )
                                                                        })
                                                                    }
                                                                </View>
                                                            </View>
                                                        }
                                                        {
                                                            this.state.data.gtype == "3" &&
                                                            <View>
                                                                {
                                                                    this.state.variants.length !== 0 &&
                                                                    <View>
                                                                        <Text style={styles.maintext1}>Variants</Text>
                                                                        <View style={{ flexDirection: "row", flexWrap: "wrap", width: "80%", marginTop: hp('1') }}>
                                                                            {
                                                                                this.state.variants.map((item, key) => {
                                                                                    return (
                                                                                        <View style={{ marginLeft: hp('1.8') }}>
                                                                                            <View style={{ width: wp('70'), flexDirection: "row", justifyContent: "space-between", marginTop: hp('1') }}>
                                                                                                <Text style={{ fontSize: 13, fontFamily: "Ubuntu-Medium", }}>Bedrooms</Text>
                                                                                                <Text style={{ fontSize: 13, fontFamily: "Ubuntu-Medium", }}>Facing</Text>
                                                                                                <Text style={{ fontSize: 13, fontFamily: "Ubuntu-Medium", }}>Size</Text>
                                                                                            </View>
                                                                                            <View style={{ width: wp('70'), flexDirection: "row", justifyContent: "space-between", marginTop: hp('1') }}>
                                                                                                <Text style={{ marginLeft: wp('3') }}>{item.bedrooms}</Text>
                                                                                                <Text style={{ marginLeft: wp('6') }}>{item.facing}</Text>
                                                                                                <Text style={{ marginRight: wp('3') }}>{item.size}</Text>
                                                                                            </View>
                                                                                        </View>
                                                                                    )
                                                                                })
                                                                            }
                                                                        </View>
                                                                    </View>
                                                                }
                                                            </View>
                                                        }
                                                    </View>
                                                }
                                                {
                                                    this.state.data.property_subtype == "128" &&
                                                    <View>
                                                        <Text style={styles.loginText22}>
                                                            Apartment  :
                                                    </Text>
                                                        <Text style={styles.maintext}>Starting Price : {this.state.data.price1}</Text>
                                                        <Text style={styles.subtext1}>No of Units : {this.state.data.builtup_area1}</Text>
                                                        <Text style={styles.subtext1}>No of towers : {this.state.data.no_of_towers}</Text>
                                                        <Text style={styles.subtext1}>No of floors for tower: {this.state.data.floors_allowed}</Text>
                                                        <Text style={styles.subtext1}>Furnished Status : {this.state.data.furniture_type}</Text>

                                                        <View style={{ width: wp('80') }}>
                                                            <Text style={styles.maintext1}>Sq.ft Price : Rs.{this.state.data.sqft_price1}</Text>
                                                        </View>

                                                        {
                                                            this.state.extrarooms1.length !== 0 &&
                                                            <View>
                                                                <Text style={styles.maintext1}>Extra Rooms</Text>
                                                                <View style={{ flexDirection: "row", flexWrap: "wrap", width: "80%", }}>
                                                                    {
                                                                        this.state.extrarooms1.map((item, key) => {
                                                                            return (

                                                                                <View style={styles.buttonContainer11}>
                                                                                    <Icon active name='circle' type="FontAwesome" style={{ fontSize: 5, color: '#81007F' }} />
                                                                                    <Text style={styles.buttonText}>{item.name}</Text>
                                                                                </View>
                                                                            )
                                                                        })
                                                                    }
                                                                </View>
                                                            </View>
                                                        }

                                                        {
                                                            this.state.variants1.length !== 0 &&
                                                            <View>
                                                                <Text style={styles.maintext1}>Variants</Text>
                                                                <View style={{ flexDirection: "row", flexWrap: "wrap", width: "80%", marginTop: hp('1') }}>
                                                                    {
                                                                        this.state.variants1.map((item, key) => {
                                                                            return (
                                                                                <View style={{ marginLeft: hp('1.8') }}>
                                                                                    <View style={{ width: wp('70'), flexDirection: "row", justifyContent: "space-between", marginTop: hp('1') }}>
                                                                                        <Text style={{ fontSize: 13, fontFamily: "Ubuntu-Medium", }}>Bedrooms</Text>
                                                                                        <Text style={{ fontSize: 13, fontFamily: "Ubuntu-Medium", }}>Facing</Text>
                                                                                        <Text style={{ fontSize: 13, fontFamily: "Ubuntu-Medium", }}>Size</Text>
                                                                                    </View>
                                                                                    <View style={{ width: wp('70'), flexDirection: "row", justifyContent: "space-between", marginTop: hp('1') }}>
                                                                                        <Text style={{ marginLeft: wp('3') }}>{item.bedrooms}</Text>
                                                                                        <Text style={{ marginLeft: wp('6') }}>{item.facing}</Text>
                                                                                        <Text style={{ marginRight: wp('3') }}>{item.size}</Text>
                                                                                    </View>
                                                                                </View>
                                                                            )
                                                                        })
                                                                    }
                                                                </View>
                                                            </View>
                                                        }
                                                    </View>
                                                }

                                                <View style={{ width: wp('80') }}>
                                                    <Text style={styles.maintext1}>Description</Text>
                                                    <Text style={styles.subtext1}>{this.state.data.description}</Text>
                                                </View>
                                                <View>
                                                    <Text style={styles.maintext1}>Near By Places</Text>
                                                    <View style={{ width: "80%", marginTop: hp('1') }}>
                                                        <View>
                                                            <View style={{ marginTop: hp('1'), width: wp('70'), }}>
                                                                <Text style={{ fontSize: 14, fontFamily: "Ubuntu-Regular", marginTop: "2%" }}>+ Hospital: {this.state.data.hospital} KM</Text>
                                                                <Text style={{ fontSize: 14, fontFamily: "Ubuntu-Regular", marginTop: "2%" }}>+ Airport: {this.state.data.airport} KM</Text>
                                                                <Text style={{ fontSize: 14, fontFamily: "Ubuntu-Regular", marginTop: "2%" }}>+ Railway Station: {this.state.data.railway_station} KM</Text>
                                                            </View>
                                                        </View>
                                                    </View>
                                                </View>
                                                <Text style={styles.maintext1}>Amenities</Text>
                                                <View style={{ flexDirection: "row", flexWrap: "wrap", width: "90%", }}>
                                                    {
                                                        this.state.facilities.map((item, key) => {
                                                            return (

                                                                <View style={styles.buttonContainer22}>
                                                                    <Image source={{ uri: item.image }} resizeMode="contain" style={{ height: 20, width: 20 }} />
                                                                    <Text style={styles.buttonText}>{item.name}</Text>

                                                                </View>
                                                            )
                                                        })
                                                    }
                                                </View>

                                                {
                                                    this.state.eco_friendly.length !== 0 &&
                                                    <View>
                                                        <Text style={styles.maintext1}>Eco Friendly</Text>
                                                        <View style={{ flexDirection: "row", flexWrap: "wrap", width: "80%", }}>
                                                            {
                                                                this.state.eco_friendly.map((item, key) => {
                                                                    return (
                                                                        <View style={styles.buttonContainer22}>
                                                                            <Text style={styles.buttonText}>{item.name}</Text>
                                                                        </View>
                                                                    )
                                                                })
                                                            }
                                                        </View>
                                                    </View>
                                                }
                                                {
                                                    this.state.entertainment.length !== 0 &&
                                                    <View>
                                                        <Text style={styles.maintext1}>Entertainment & Socialzing</Text>
                                                        <View style={{ flexDirection: "row", flexWrap: "wrap", width: "80%", }}>
                                                            {
                                                                this.state.entertainment.map((item, key) => {
                                                                    return (
                                                                        <View style={styles.buttonContainer22}>
                                                                            <Text style={styles.buttonText}>{item.name}</Text>
                                                                        </View>
                                                                    )
                                                                })
                                                            }
                                                        </View>
                                                    </View>
                                                }
                                                {
                                                    this.state.convenience.length !== 0 &&
                                                    <View>
                                                        <Text style={styles.maintext1}>Convenience & Security</Text>
                                                        <View style={{ flexDirection: "row", flexWrap: "wrap", width: "80%", }}>
                                                            {
                                                                this.state.convenience.map((item, key) => {
                                                                    return (
                                                                        <View style={styles.buttonContainer22}>
                                                                            <Text style={styles.buttonText}>{item.name}</Text>
                                                                        </View>
                                                                    )
                                                                })
                                                            }
                                                        </View>
                                                    </View>
                                                }
                                            </View>
                                        </View>
                                    </View>
                                    {/* <View style={styles.row}>
                                        <Image source={require('../assets/gallery_icon.png')} resizeMode="contain" style={styles.images} />
                                        <View style={{ width: wp('80') }}>
                                            <Text style={styles.maintext1}>Gallery</Text>
                                            <View style={styles.gallery}>
                                                {
                                                    this.state.property_gallery.map((item, key) => {
                                                        return (
                                                            <View>
                                                                <Image source={{ uri: item.image }} style={styles.icon3} />
                                                            </View>
                                                        )
                                                    })
                                                }
                                            </View>
                                        </View>
                                    </View> */}
                                </View>
                            </View>
                            <View style={{ marginBottom: "13%" }}></View>
                        </Content>}
                </View>

                <View style={styles.Button}>
                    <Text style={styles.submitText}>Contact Owner</Text>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <TouchableWithoutFeedback onPress={() => this.contactOwner(this.state.data.owner_mobile)}>
                            <View style={styles.wishlist11}>
                                <Icon active name='phone' type="FontAwesome" style={{ fontSize: 15, color: '#81007F' }} />
                            </View>
                            {/* <Image source={require('../assets/phone_icon.png')} style={styles.icon2} resizeMode="contain" /> */}
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback onPress={() => this.openWattsapp(this.state.data.owner_mobile)}>
                            <View style={styles.wishlist11}>
                                <Icon active name='whatsapp' type="FontAwesome" style={{ fontSize: 15, color: '#81007F' }} />
                            </View>
                            {/* <Image source={require('../assets/whatsapp_violet.png')} style={styles.icon} resizeMode="contain" /> */}
                        </TouchableWithoutFeedback>
                    </View>
                </View>
            </Container>

        )
    }
}
const styles = StyleSheet.create({
    header: {
        borderBottomWidth: 0,
    },
    image: {
        ...StyleSheet.absoluteFillObject,
        resizeMode: 'contain',
    },
    imageContainer: {
        height: 250,
        width: (deviceWidth * 88) / 100,
        alignItems: 'center',
        justifyContent: "center",
        marginBottom: Platform.select({ ios: 0, android: 1 }),
        // borderRadius: 20,
        // marginTop: "3%"
    },
    dash: {
        width: 1,
        flexDirection: 'column',
        left: 35,
        marginTop: "10%",
    },
    dash1: {
        width: 1,
        flexDirection: 'column',
        left: 35,
        marginTop: "20%",
    },
    wishlist: {
        width: 40,
        height: 40,
        backgroundColor: "#81007F",
        borderRadius: 40 / 2,
        top: 10,
        alignItems: "center",
        justifyContent: "center"
    },
    wishlist1: {
        width: 40,
        height: 40,
        backgroundColor: "#81007F",
        borderRadius: 40 / 2,
        top: 10,
        alignItems: "center",
        justifyContent: "center",
        marginRight: wp('1')
    },
    wishlist11: {
        width: 30,
        height: 30,
        backgroundColor: "#fff",
        borderRadius: 30 / 2,
        // top: 10,
        alignItems: "center",
        justifyContent: "center",
        marginRight: wp('2')
    },
    water: {
        resizeMode: "contain",
        zIndex: 99999,
        width: "40%",
        height: 100,
        position: "absolute",
        alignSelf: "center",
        opacity: 0.3,
        top: 50
    },
    leftimage: {
        position: 'absolute',
        top: "3%",
        left: "5%",
        zIndex: 200000
    },
    gallery: {
        flexDirection: "row",
        flexWrap: "wrap",
        width: "100%"
        // paddingLeft: "2%"
    },
    buttonText: {
        marginLeft: "6%"
    },
    buttonContainer22: {
        // width: wp('27'),
        height: hp('5'),
        backgroundColor: '#F5F5F5',
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 2,
        margin: 5,
        flexDirection: "row",
        padding: "2%"
    },
    buttonContainer123: {
        // width: wp('27'),
        height: hp('5'),
        backgroundColor: '#81007F',
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 2,
        margin: 5,
        flexDirection: "row",
        padding: "2%"
    },
    buttonContainer11: {
        // width: wp('27'),
        justifyContent: 'center',
        alignItems: 'center',
        margin: 5,
        flexDirection: "row",
        padding: "2%"
    },
    View: {
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        // height: "66%",
        // width: "100%",
        height: hp('100'),
        width: wp('100'),
        backgroundColor: "#fff",
        position: "absolute",
        top: "35%",
    },
    loginText22: {
        color: "#ff1a75",
        fontSize: 15,
        fontFamily: 'Ubuntu-Medium',
        marginTop: "8%",
        marginBottom: "4%",
    },
    submitText: {
        fontFamily: 'Ubuntu-Medium',
        fontSize: 18,
        color: '#fff',
        marginLeft: "4%"
    },
    title: {
        fontFamily: 'Ubuntu-Bold',
        fontSize: 23,
        color: '#000',
        marginLeft: "4%",
    },
    Button: {
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#81007F',
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        flexDirection: 'row',
        position: "absolute",
        width: "90%",
        alignSelf: "center",
        bottom: 0,
        padding: hp('1.5')
    },
    icon1: {
        marginRight: "2%",
    },
    icon: {
        width: 45,
        height: 25,
        marginRight: "2%",
    },
    icon2: {
        width: 50,
        height: 55
    },
    icon3: {
        height: hp('13'),
        width: wp('32'),
        borderRadius: 15,
        margin: wp('3')
    },
    icon4: {
        height: hp('13'),
        width: wp('32'),
        borderRadius: 15,
        marginLeft: "3%"
    },
    like: {
        flexDirection: "row",
        position: "absolute",
        //top: "-7%",
        bottom: "94%",
        // bottom: 7,
        right: "5%"
    },
    subtext: {
        fontSize: 13,
        fontFamily: 'Ubuntu-Light',
        color: '#A6A6A6',
        marginLeft: "4%",
        margin: 1,
        width: wp('55')
    },
    subtext1234: {
        fontSize: 13,
        fontFamily: 'Ubuntu-Light',
        color: '#A6A6A6',
        marginLeft: "4%",
        margin: 1,
        width: wp('38'),
    },
    subtext123: {
        fontSize: 13,
        fontFamily: 'Ubuntu-Medium',
        color: '#fff',
        marginLeft: "4%",
        margin: 1,
        // width: wp('35')
    },
    subtext1235: {
        fontSize: 10,
        fontFamily: 'Ubuntu-Medium',
        color: '#fff',
        marginLeft: "4%",
        margin: 1,
        // width: wp('35')
    },
    subtext1: {
        fontSize: 13,
        fontFamily: 'Ubuntu-Regular',
        marginLeft: "4%",
        color: "#717171",
        marginTop: "1%",
    },
    maintext: {
        fontSize: 18,
        marginLeft: "4%",
        fontFamily: 'Ubuntu-Medium',
        margin: 1
    },
    maintext456: {
        fontSize: 16,
        marginLeft: "4%",
        fontFamily: 'Ubuntu-Medium',
        margin: 1,
        width: wp('68'),
    },
    row: {
        flexDirection: "row"
    },
    images: {
        // marginLeft: "%",
    },
    maintext1: {
        fontSize: 17,
        fontFamily: 'Ubuntu-Medium',
        marginLeft: "3%",
        fontWeight: "bold",
        marginTop: "8%"
    },
})