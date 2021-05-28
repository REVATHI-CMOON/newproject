import React from 'react';
import { StyleSheet, View, Image, Text, TouchableWithoutFeedback, TouchableNativeFeedback, Linking, Platform, FlatList } from 'react-native';
import {
    Container,
    Content,
    Header,
    Left,
    Right,
    Body,
    Drawer,
    Icon,
    Card, Item, Input, Toast,
} from 'native-base';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import AsyncStorage from '@react-native-community/async-storage';
import qs from 'qs';
import { MaterialIndicator } from 'react-native-indicators';
import Share from 'react-native-share';
const baseUrl = "http://demoworks.in/php/mypropertree/api/common/";
export default class Wishlist extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            user_id: "",
            data: [],
            count: ""
        }
    }
    goToHome = () => {
        this.props.navigation.navigate('Home')
    }
    goToNotifications = () => {
        this.props.navigation.navigate('Notifications')
    }
    componentDidMount() {
        AsyncStorage.getItem('user_id').then((user_id) => {
            if (user_id == null) {
                Toast.show({
                    text: "Please login to property in your favourites list",
                    type: 'danger',
                    duration: 2500,
                    textStyle: { fontFamily: 'Roboto-Regular', color: "#ffffff", textAlign: 'center' },
                }, this.props.navigation.navigate('Home'))
            }
            this.setState({
                user_id: user_id,
            });
            this.getFavourites(user_id);
        });

    }
    getFavourites = (user_id) => {
        this.setState({ loading: true });
        fetch(baseUrl + 'manage_favourites', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'content-type': 'application/x-www-form-urlencoded',
            },
            body: qs.stringify({
                user_id: user_id
            })
        }).then((response) => response.json())
            .then((json) => {
                console.log(json.data)
                if (json.status == "valid") {
                    this.setState({ loading: false, data: json.data, count: json.total_count });
                } else if (json.status == "invalid") {
                    this.setState({ loading: false, data: [], });
                }
            })
            .catch((error) => {
                this.setState({ loading: false });
                console.error(error);
            });
    }
    removeFavourites = (id) => {
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
                if (json.status == "valid") {
                    Toast.show({
                        text: json.message,
                        type: 'success',
                        duration: 2500,
                        textStyle: { fontFamily: 'Roboto-Regular', color: "#ffffff", textAlign: 'center' },
                    })
                    this.getFavourites(this.state.user_id);
                } else if (json.status == "invalid") {
                    Toast.show({
                        text: json.message,
                        type: 'danger',
                        duration: 2500,
                        textStyle: { fontFamily: 'Roboto-Regular', color: "#ffffff", textAlign: 'center' },
                    })
                }
            })
            .catch((error) => {
                this.setState({ loading: false });
                console.error(error);
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
    shareProperty = (property_title, link) => {
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
    openWattsapp = (whatsapp) => {
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
    ListEmptyView = () => {
        return (

            <View style={{ alignItems: "center", justifyContent: "center" }}>
                <Icon active name='frown-o' type="FontAwesome" style={{
                    fontSize: 100, color: '#ccc', marginTop: hp('25')
                }} />
                <Text
                    style={{
                        color: 'red',
                        fontFamily: 'Ubuntu-Regular',
                        fontSize: 15,
                        alignItems: "center",
                        justifyContent: "center",
                        textAlign: "center",
                    }}>
                    No Favourite Properties List Found
                    </Text>
            </View>
        );
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
                <View style={styles.header}>
                    <TouchableWithoutFeedback onPress={this.goToHome}>
                        <View>
                            <Image source={require('../assets/back_icon.png')} style={styles.leftimage} resizeMode="contain" />
                        </View>
                    </TouchableWithoutFeedback>
                    <View>
                        <Text style={styles.headerText}>
                            Favourites
                        </Text>
                        <Text style={styles.headerSubText}>
                            {this.state.count} Properties
                        </Text>
                    </View>
                    <TouchableWithoutFeedback onPress={this.goToNotifications}>
                        <View>
                            <Image source={require('../assets/notification_icon.png')} style={styles.rightimage} resizeMode="contain" />
                        </View>
                    </TouchableWithoutFeedback>
                </View>
                <Content>
                    <FlatList
                        data={this.state.data}
                        renderItem={({ item }) =>
                        (
                            <View style={styles.imageView}>
                                <View>
                                    <Image source={{ uri: item.property_image }} resizeMode="cover" style={styles.image} />
                                </View>

                                <View>
                                    <Text style={styles.Text}>
                                        {item.property_title}
                                    </Text>
                                    <View style={styles.row}>
                                        <Image source={require('../assets/location.png')} resizeMode="contain" style={styles.locationImage} />
                                        <Text style={styles.Text1}>
                                            {item.property_address}
                                        </Text>
                                    </View>
                                    <View style={styles.row}>
                                        <TouchableWithoutFeedback onPress={() => this.contactOwner(item.owner_mobile)}>
                                            <View style={styles.buttonContainer}>
                                                <Text style={styles.buttonText}>Contact</Text>
                                            </View>
                                        </TouchableWithoutFeedback>
                                        <TouchableWithoutFeedback onPress={() => this.shareProperty(item.property_title, item.property_link)}>
                                            <Image source={require('../assets/share_violet.png')} resizeMode="contain" style={styles.buttonImage} />
                                        </TouchableWithoutFeedback>
                                        <TouchableWithoutFeedback onPress={() => this.openWattsapp(item.whatsapp)}>
                                            <Image source={require('../assets/whatsapp_violet.png')} resizeMode="contain" style={styles.buttonImage} />
                                            {/* <Image source={require('../assets/whatsapp_violet.png')} resizeMode="contain" style={styles.buttonImage} /> */}
                                        </TouchableWithoutFeedback>
                                        <TouchableWithoutFeedback onPress={() => this.removeFavourites(item.property_id)}>
                                            <Icon active name='trash' type="FontAwesome" style={{ fontSize: 22, color: '#81007F', marginTop: "3%", marginLeft: "2%" }} />
                                        </TouchableWithoutFeedback>
                                    </View>
                                </View>
                            </View>
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
        padding: 10,
        flexDirection: "row"
    },
    leftimage: {
        width: 30,
        height: 30,
        marginTop: "25%",
    },
    rightimage: {
        width: 20,
        height: 20,
        marginLeft: "68%",
        marginTop: "5%",
    },
    headerText: {
        color: "#000",
        fontSize: 15,
        marginLeft: "12%",
        fontFamily: 'Ubuntu-Regular',

    },
    headerSubText: {
        color: "#000",
        fontSize: 12,
        marginLeft: "12%",
        fontFamily: 'Ubuntu-Regular',
    },
    imageView: {
        flexDirection: "row",
        padding: 7,
        margin: 2,
    },
    image: {
        height: 90,
        width: 110,
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
        fontFamily: 'Ubuntu-Bold',
        fontSize: 12,
        color: "#fff"
    },
    Text1: {
        color: "#000",
        fontSize: 12,
        marginTop: "1%",
        fontFamily: 'Ubuntu-Regular',
        width: "62%",
    },
    Text2: {
        color: "#000",
        fontSize: 12,
        marginLeft: "8%",
        fontFamily: 'Ubuntu-Regular',
    },
    locationImage: {
        marginTop: "3%",
        margin: "1%"
    },
    row: {
        flexDirection: "row"
    },
    buttonImage: {
        margin: "2%",
        // height: 25,
        // width: 25
    },
    Text: {
        fontFamily: 'Ubuntu-Regular',
    },
})