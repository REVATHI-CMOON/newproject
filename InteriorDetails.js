import React from 'react';
import { StyleSheet, ScrollView, View, Image, Text, StatusBar, TouchableNativeFeedback, Modal, Linking } from 'react-native';
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
import Dash from 'react-native-dash';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { TouchableOpacity, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import ActionSheet from 'react-native-actionsheet';
import Share from 'react-native-share';
import { MaterialIndicator } from 'react-native-indicators';
import qs from 'qs';
const baseUrl = "http://demoworks.in/php/mypropertree/api/common/";
export default class InteriorDetails extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user_name: '',
            email: '',
            mobile: '',
            enquiry: '',
            message: '',
            isVisible: false,
            data: [],
            loading: true,
            listing_gallery: []
        }
    }
    componentDidMount() {
        this.getInteriorDetails();
    }
    goToInterior = () => {
        this.props.navigation.navigate('InteriorDesign')
    }
    showActionSheet = () => {

        this.props.navigation.navigate('Enquiry', { id: this.props.route.params.id })
    }
    modelClose = () => {
        this.setState({ isVisible: false })
    }
    shareProperty = (title, url) => {
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
    getInteriorDetails = () => {
        fetch(baseUrl + 'listing_view', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'content-type': 'application/x-www-form-urlencoded',
            },
            body: qs.stringify({
                list_id: this.props.route.params.id
            })
        }).then((response) => response.json())
            .then((json) => {
                if (json.status == 'valid') {
                    this.setState({
                        data: json.data,
                        loading: false,
                        listing_gallery: json.data.listing_gallery
                    });
                } else {
                    this.setState({ loading: false });
                }
            })
            .catch((error) => {
                this.setState({ loading: false });
            });
    }
    openWattsapp = (mobile) => {
        let url = 'whatsapp://send?text=hii&phone=91' + mobile;
        Linking.openURL(url).then((data) => {
            console.log('WhatsApp Opened');
        }).catch(() => {
            Toast.show({
                text: "Make sure Whatsapp installed on your device",
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
                <StatusBar translucent={true} backgroundColor={'transparent'} />
                <View style={styles.header}>
                    <View>
                        <Image source={{ uri: this.state.data.listing_image }} style={styles.image} />
                        <TouchableWithoutFeedback onPress={this.goToInterior}>
                            <Image source={require('../assets/back_white.png')} style={styles.leftimage} resizeMode="contain" />
                        </TouchableWithoutFeedback>
                    </View>
                </View>
                <View style={styles.View}>
                    <View style={styles.like}>
                        <TouchableWithoutFeedback onPress={() => this.openWattsapp(this.state.data.mobile)}>
                            <View style={styles.wishlist1}>
                                <Icon active name='whatsapp' type="FontAwesome" style={{ fontSize: 30, color: '#fff' }} />
                            </View>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback onPress={() => this.shareProperty(this.state.data.title, this.state.data.url)}>
                            <View style={styles.wishlist}>
                                <Icon active name='share-alt' type="FontAwesome" style={{ fontSize: 20, color: '#fff' }} />
                            </View>
                            {/* <Image source={require('../assets/share_icon.png')} resizeMode="contain" /> */}
                        </TouchableWithoutFeedback>
                    </View>
                    <View style={{ padding: 15 }}>
                        <View style={{ marginTop: "5%" }}>
                            <Text style={styles.title}>{this.state.data.title}</Text>
                        </View>
                    </View>
                    <Content>
                        <View style={styles.row}>
                            <Dash style={styles.dash} dashColor="#C7C7C7" dashGap={3} />
                            <View>
                                <View style={styles.row}>
                                    <Image source={require('../assets/description_icon.png')} resizeMode="contain" style={styles.images} />
                                    <View style={{ width: wp('80'), marginTop: "1%", margin: "1%" }}>
                                        <Text style={styles.subtext}>{this.state.data.description}</Text>
                                    </View>
                                </View>
                                <View style={styles.row}>
                                    <Image source={require('../assets/phone_icon.png')} resizeMode="contain" style={styles.images} />
                                    <View>
                                        <Text style={styles.maintext1}>{this.state.data.mobile}</Text>
                                    </View>
                                </View>
                                <View style={styles.row}>
                                    <Image source={require('../assets/circle_location_icon.png')} resizeMode="contain" style={styles.images} />
                                    <View style={{ width: wp('80'), }}>
                                        <Text style={styles.subtext}>{this.state.data.address}</Text>
                                    </View>
                                </View>
                                <View style={styles.row}>
                                    <Image source={require('../assets/link_icon.png')} resizeMode="contain" style={styles.images} />
                                    <TouchableWithoutFeedback onPress={() => Linking.openURL(this.state.data.url)}>
                                        <View>
                                            <Text style={styles.maintext2}>{this.state.data.url}</Text>
                                        </View>
                                    </TouchableWithoutFeedback>
                                </View>
                                <View style={{ width: wp('80'), flexDirection: "row" }}>
                                    <Image source={require('../assets/gallery_icon.png')} resizeMode="contain" style={styles.images} />
                                    <View>
                                        <Text style={styles.maintext1}>Gallery</Text>
                                        <View style={styles.gallery}>
                                            {
                                                this.state.listing_gallery.map((item, key) => {
                                                    return (
                                                        <View>
                                                            <Image source={{ uri: item.image }} style={styles.icon3} />
                                                        </View>
                                                    )
                                                })
                                            }
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </View>
                        <View style={{ marginBottom: "10%" }}></View>
                    </Content>
                </View>
                <View style={styles.Button}>
                    <TouchableWithoutFeedback onPress={() => { this.showActionSheet() }}>
                        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", width: "83%", }}>
                            <Text style={styles.submitText}>Send Enquiry</Text>
                            <Image source={require('../assets/enquiry_icon.png')} resizeMode="contain" />
                        </View>
                    </TouchableWithoutFeedback>
                </View>

            </Container>

        )
    }
}
const styles = StyleSheet.create({
    header: {
        borderBottomWidth: 0,
    },
    // wishlist: {
    //     width: 48,
    //     height: 48,
    //     backgroundColor: "#A0C278",
    //     borderRadius: 48 / 2,
    //     alignItems: "center",
    //     justifyContent: "center",
    // },
    wishlist1: {
        width: 40,
        height: 40,
        backgroundColor: "#81007F",
        borderRadius: 40 / 2,
        // top: 10,
        alignItems: "center",
        justifyContent: "center",
        marginRight: wp('1')
    },
    wishlist: {
        width: 40,
        height: 40,
        backgroundColor: "#81007F",
        borderRadius: 40 / 2,
        // top: 10,
        alignItems: "center",
        justifyContent: "center"
    },
    image: {
        width: "100%",
        height: 250,
    },
    loginText2: {
        fontFamily: 'Ubuntu-Regular',
        fontSize: 15,
        marginLeft: '8%',
        marginTop: "5%"
    },
    modelText: {
        color: "#fff",
        fontSize: 16,
        fontFamily: "Ubuntu-Medium",
        marginBottom: "3%",
        marginLeft: "4%"
    },
    item: {
        borderBottomWidth: 0.8,
        borderBottomColor: '#000',
        marginLeft: "8%",
        marginRight: "8%",
    },
    modalItemView: {
        backgroundColor: '#81007F',
        borderRadius: 4,
        // marginTop: "40%",
        borderRadius: 15,
        height: hp('100')

    },
    textinput: {
        borderBottomWidth: 0.8,
        borderBottomColor: '#000',
        marginLeft: "8%",
        marginRight: "8%",
    },
    input: {
        fontFamily: 'Ubuntu-Regular',
        fontSize: 13,
        marginTop: "2%",
        height: 6
    },
    dash: {
        width: 1,
        flexDirection: 'column',
        left: 40,
        marginTop: "15%",
    },
    // images: {
    //     marginLeft: "1%",
    // },

    maintext1: {
        fontSize: 17,
        fontFamily: "Ubuntu-Regular",
        marginLeft: "3%",
        marginTop: "10%"
    },
    maintext2: {
        fontSize: 17,
        fontFamily: "Ubuntu-Regular",
        marginLeft: "3%",
        marginTop: "10%",
        color: "blue",
        textDecorationLine: "underline"
    },
    leftimage: {
        position: 'absolute',
        top: "15%",
        left: "3%"
    },
    subtext: {
        fontSize: 15,
        fontFamily: "Ubuntu-Regular",
        color: '#7D7D7D',
    },
    subtext1: {
        fontSize: 15,
        fontFamily: "Ubuntu-Regular",
        color: '#7D7D7D',
        marginTop: "3%",
        width: "50%"
    },
    row: {
        flexDirection: "row"
    },
    View: {
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        height: hp('70'),
        width: wp('100'),
        backgroundColor: "#fff",
        position: "absolute",
        top: "30%",
    },
    submitText: {
        fontFamily: "Ubuntu-Medium",
        fontSize: 18,
        color: '#fff',
        marginLeft: "8%"
    },
    modalText: {
        fontFamily: "Ubuntu-Medium",
        fontSize: 20,
        color: '#fff',
        marginLeft: "2%",
        marginTop: "1%"
    },
    modelIcon: {
        color: "#fff",
        fontSize: 35
    },
    buttonContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#81007F',
        width: '50%',
        borderRadius: 25,
        padding: '4%',
    },
    title: {
        fontFamily: "Ubuntu-Medium",
        fontSize: 18,
        color: '#000',
        marginLeft: "4%"
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
        bottom: 0
    },
    icon1: {
        marginRight: "2%",
    },
    icon: {
        width: 65,
        height: 60
    },
    icon3: {
        height: hp('13'),
        width: wp('33'),
        borderRadius: 15,
        margin: wp('3')
    },
    icon4: {
        width: wp('32'),
        height: hp('13'),
        borderRadius: 15,
        marginLeft: "3%"
    },
    gallery: {
        flexDirection: "row",
        flexWrap: "wrap",
    },
    like: {
        flexDirection: "row",
        position: "absolute",
        //top: "-7%",
        bottom: "95%",
        // bottom: 7,
        right: "5%",
        alignItems: "center",
        justifyContent: "center"
    },

})