import React from 'react';
import { StyleSheet, RefreshControl, Linking, View, Image, Text, TouchableWithoutFeedback, TouchableOpacity, TouchableNativeFeedback, ScrollView, Dimensions, StatusBar, FlatList, PermissionsAndroid, Platform, BackHandler, Alert } from 'react-native';
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
import SideBar from './Sidebar';
import CustomBottomMenu from './CustomBottomMenu';
import { MaterialIndicator } from 'react-native-indicators';
import qs from 'qs';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Carousel, { ParallaxImage, Pagination } from 'react-native-snap-carousel';
import Geolocation from 'react-native-geolocation-service';
import AsyncStorage from '@react-native-community/async-storage';
const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;
const baseUrl = "http://demoworks.in/php/mypropertree/api/common/";
const imgHeight1 = deviceHeight / 1 > 110 ? deviceHeight / 9 : 110;
import Maintinance from './Maintinace'
export default class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            sliders: [],
            services: [],
            loading: true,
            label_name: "",
            refreshing: false,
            staticSliders: [],
            staticBuilders: [],
            staticProjects: [],
            staticCities: [],
            maintinance: {},
            top_cities_title: "",
            recent_properties_title: "",
            top_builders_title: "",
            top_projects_title: "",
            user_id: ""
        }
    }
    componentDidMount() {
        this.getSliders();
        this.getStaticData();
        this.getCurrentLocation();
        AsyncStorage.getItem('label_name').then((label_name) => {
            this.setState({
                label_name: label_name,
            });
        });
        AsyncStorage.getItem('user_id').then((user_id) => {
            this.setState({
                user_id: user_id,
            });
        });
    }
    _unsubscribeSiFocus = this.props.navigation.addListener('focus', e => {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    });

    _unsubscribeSiBlur = this.props.navigation.addListener('blur', e => {
        BackHandler.removeEventListener(
            'hardwareBackPress',
            this.handleBackButton,
        );
    });

    componentWillUnmount() {
        this._unsubscribeSiFocus();
        this._unsubscribeSiBlur();
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
    }
    handleBackButton = () => {
        Alert.alert(
            'Exit App',
            'Exiting the application?',
            [{
                text: 'Cancel',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
            },
            {
                text: 'OK',
                onPress: () => BackHandler.exitApp(),
            },
            ], {
            cancelable: false,
        },
        );
        return true;
    };
    Maintinance = (json) => {
        this.props.navigation.navigate('Maintinace')
    }
    closeDrawer = () => {
        this._drawer._root.close();
    };
    openDrawer = () => {
        this._drawer._root.open();
    };
    goToLoans = () => {
        this.props.navigation.navigate('Loans');
    }
    goToInterior = () => {
        this.props.navigation.navigate('InteriorDesign');
    }
    goToSelectLocaton = () => {
        this.props.navigation.navigate('SelectLocation', { pageName: "Home" });
    }
    goToNotifications = () => {
        this.props.navigation.navigate('Notifications');
    }
    goToPackers = () => {
        this.props.navigation.navigate('Packers');
    }
    goToServices = () => {
        this.props.navigation.navigate('Services');
    }
    goToConstructionMaterials = () => {
        this.props.navigation.navigate('ConstructionMaterials');
    }
    goToVillaDetails = (property_id) => {
        this.props.navigation.navigate('VillaDetails', { property_id: property_id, backscreen: 'Home' });
    }
    _renderItem = ({ item }, parallaxProps) => {
        return (
            <View style={styles.parimage}>
                <ParallaxImage
                    source={{ uri: item }}
                    containerStyle={styles.imageContainer}
                    style={styles.image}
                    {...parallaxProps}
                />
            </View>
        );
    };
    _renderItem1 = ({ item }, parallaxProps) => {
        return (
            <TouchableNativeFeedback onPress={() =>
                this.props.navigation.navigate('VillaDetails', { property_id: item.property_id, backscreen: 'Home' })}>
                <Card style={styles.imagecontainerr}>
                    {
                        item.property_image == "" ?
                            <Image source={require('../assets/noimage.jpg')} style={styles.imagee} />
                            :
                            <Image source={{ uri: item.property_image }} style={styles.imagee} />
                    }
                    <Image source={require('../assets/watermark.png')} style={styles.water} />

                    <View style={styles.like}>
                        <TouchableWithoutFeedback onPress={() => this.contactOwner(item.mobile)}>
                            <View style={styles.wishlist}>
                                <Icon active name='phone' type="FontAwesome" style={{ fontSize: 23, color: '#fff' }} />
                            </View>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback onPress={() => this.openWattsapp(item.mobile)}>
                            <View style={styles.wishlist}>
                                <Icon active name='whatsapp' type="FontAwesome" style={{ fontSize: 30, color: '#fff' }} />
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                    <View style={styles.textView}>
                        <View style={{ width: "60%" }}>
                            <Text numberOfLines={1} ellipsizeMode={'tail'} style={styles.maintext}>{item.property_title}</Text>
                            <View style={{ marginTop: "2%" }}>
                                <Text style={{ fontSize: 12, color: "#334d4d" }}>Property ID : {item.unique_property_id}</Text>
                            </View>
                            <View style={{ marginTop: "2%" }}>
                                <Text numberOfLines={2} ellipsizeMode={'tail'} style={styles.subtext}>{item.property_address}</Text>
                            </View>
                        </View>
                        <View style={styles.priceView}>
                            <Text style={styles.pricetext}>{item.price}</Text>
                        </View>
                    </View>
                </Card>
            </TouchableNativeFeedback>

        );
    };
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
    getCurrentLocation = async () => {
        this.setState({ loading: true });
        if (Platform.OS === 'ios') {
            const granted = Geolocation.requestAuthorization('always');

            this.setState({ loading: false });

        } else if (Platform.OS === 'android') {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, {
                    'title': 'Location Access Required',
                    'message': 'This App needs to Access your location'
                }
                )
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                } else {
                    alert("Permission Denied");
                }
                this.setState({ loading: false });
            } catch (err) {
                alert("err", err);
                console.warn(err)
                this.setState({ loading: false });
            }
        }
    }
    _onRefresh() {
        this.setState({ refreshing: true });
        this.getSliders();
        this.getStaticData();
        this.setState({ refreshing: false });
    }
    getSliders = () => {
        this.setState({ loading: true });
        fetch(baseUrl + 'sliders_services', {
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
                    var sliders = json.sliders;
                    var services = json.services;
                    this.setState({
                        sliders: sliders,
                        services: services,
                        loading: false,
                    });
                } else if (json.status == 'invalid') {
                    this.setState({ loading: false });
                    this.Maintinance(json);
                }
            })
            .catch((error) => {
                this.setState({ loading: false });
            });
    }
    getStaticData = () => {
        this.setState({ loading: true });
        fetch(baseUrl + 'get_home_data', {
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
                        staticSliders: json.data.recent_properties,
                        recent_properties_title: json.data.recent_properties_title,
                        staticCities: json.data.top_cities,
                        top_cities_title: json.data.top_cities_title,
                        staticBuilders: json.data.top_builders,
                        top_builders_title: json.data.top_builders_title,
                        staticProjects: json.data.top_projects,
                        top_projects_title: json.data.top_projects_title,
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
    goToView = (id) => {
        if (id == 1 || id == 2) {
            this.props.navigation.navigate('Realestate', { property_type: id })
        }
        else if (id == 8) {
            this.props.navigation.navigate('Furniture', { type: "furniture" })
        }
        else if (id == 10) {
            this.props.navigation.navigate('Furniture', { type: "appliances" })
        }
        else if (id == 6) {
            this.props.navigation.navigate('Loans')
        }
        else if (id == 3) {
            this.props.navigation.navigate('InteriorDesign', { type: "interior" })
        }
        else if (id == 4) {
            this.props.navigation.navigate('InteriorDesign', { type: "packers" })
        }
        else if (id == 5) {
            this.props.navigation.navigate('InteriorDesign', { type: "construction" })
        }
        else if (id == 7) {
            this.props.navigation.navigate('Services')
        }
        else {
            this.setState({ loading: false });
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
            <Drawer
                ref={(ref) => {
                    this._drawer = ref;
                }}
                content={<SideBar navigation={this.props.navigation} closeDrawer={this.closeDrawer} />}>
                <Container>
                    <StatusBar backgroundColor='#fff' barStyle="dark-content" />
                    <View style={{ marginTop: "3%", marginLeft: "3%", marginBottom: "3%" }}>
                        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                            <TouchableWithoutFeedback onPress={this.openDrawer}>
                                <View style={styles.center}>
                                    <Image
                                        source={require('../assets/menu_icon.png')}
                                        style={styles.leftimage}
                                    />
                                    <Text style={styles.mainheader}>mypropertree</Text>
                                </View>
                            </TouchableWithoutFeedback>
                            <View>
                                <TouchableWithoutFeedback onPress={this.goToNotifications}>
                                    <Image source={require('../assets/notification_icon.png')} style={styles.rightimage} resizeMode="contain" />
                                </TouchableWithoutFeedback>
                            </View>
                        </View>
                    </View>
                    <ScrollView style={{ scrollY: 0 }}
                        showsVerticalScrollIndicator={false}
                        refreshControl={
                            <RefreshControl
                                onRefresh={this._onRefresh.bind(this)}
                                refreshing={this.state.refreshing}
                            />}>
                        <TouchableWithoutFeedback onPress={this.goToSelectLocaton}>
                            <Card style={styles.item}>
                                <View style={styles.wishlist1}>
                                    <Icon active name='map-marker' type="FontAwesome" style={{ fontSize: 15, color: '#81007F', }} />
                                </View>
                                {/* <Image source={require('../assets/location_search.png')} resizeMode="contain" style={styles.menuImage} /> */}
                                <Text style={styles.locationtext}>{this.state.label_name ? this.state.label_name : "Select City"}</Text>
                            </Card>
                        </TouchableWithoutFeedback>
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
                        <Text style={styles.services1}>Our Services</Text>
                        <View style={styles.flatView}>
                            {this.state.services.map((item, key) =>
                                <View style={{ marginTop: 1, }}>
                                    <View key={item.id}>
                                        <TouchableWithoutFeedback onPress={() => { this.goToView(item.id) }}>
                                            <View style={styles.imageView}>
                                                <Image source={{ uri: item.image }} resizeMode='cover' style={styles.servicesImage} />
                                                <Text style={styles.text1}>{item.name}</Text>
                                            </View>
                                        </TouchableWithoutFeedback>
                                    </View>
                                </View>
                            )}
                        </View>
                        <Text style={styles.services}>{this.state.recent_properties_title}</Text>
                        <View style={styles.Carousel1}>
                            <Carousel
                                sliderWidth={deviceWidth}
                                sliderHeight={250}
                                itemWidth={deviceWidth - 50}
                                data={this.state.staticSliders}
                                renderItem={this._renderItem1}
                                hasParallaxImages={true}
                                onSnapToItem={index => this.setState({ activeSlide: index })}
                                loop={true}
                                autoplay={true}
                            />
                        </View>
                        <View>
                            <Text style={styles.Title}>
                                {this.state.top_cities_title}
                            </Text>
                            <ScrollView
                                horizontal={true}
                                showsHorizontalScrollIndicator={false}
                                style={{ marginLeft: "5%" }}>
                                {this.state.staticCities.map((item1, index) => (
                                    <TouchableWithoutFeedback onPress={() => Linking.openURL(item1.url)}>
                                        <View style={styles.margin14}>
                                            <Image
                                                source={{ uri: item1.image }}
                                                key={index}
                                                style={styles.contestImg1}
                                            />
                                        </View>
                                    </TouchableWithoutFeedback>
                                ))}
                            </ScrollView>
                        </View>
                        <View>
                            <Text style={styles.Title}>
                                {this.state.top_builders_title}
                            </Text>
                            <ScrollView
                                horizontal={true}
                                showsHorizontalScrollIndicator={false}
                                style={{ marginLeft: "5%" }}>
                                {this.state.staticBuilders.map((item1, index) => (
                                    <TouchableWithoutFeedback onPress={() => Linking.openURL(item1.url)}>
                                        <View style={styles.margin14}>
                                            <Image
                                                source={{ uri: item1.image }}
                                                key={index}
                                                style={styles.contestImg1}
                                            />
                                        </View>
                                    </TouchableWithoutFeedback>
                                ))}
                            </ScrollView>
                        </View>
                        <View>
                            <Text style={styles.Title}>
                                {this.state.top_projects_title}
                            </Text>
                            <ScrollView
                                horizontal={true}
                                showsHorizontalScrollIndicator={false}
                                style={{ marginLeft: "5%" }}>
                                {this.state.staticProjects.map((item1, index) => (
                                    <TouchableWithoutFeedback onPress={() => Linking.openURL(item1.url)}>
                                        <View style={styles.margin14}>
                                            <Image
                                                source={{ uri: item1.image }}
                                                key={index}
                                                style={styles.contestImg1}
                                            />
                                        </View>
                                    </TouchableWithoutFeedback>
                                ))}
                            </ScrollView>
                        </View>
                        <View style={{ marginBottom: "3%" }}></View>
                    </ScrollView>
                    <CustomBottomMenu navigation={this.props.navigation} />
                </Container>
            </Drawer>
        )
    }
}

const styles = StyleSheet.create({
    header: {
        backgroundColor: "#fff",
        borderBottomWidth: 0
    },
    mainheader: {
        color: "#81007F",
        fontSize: 17,
        fontFamily: 'Ubuntu-Bold',
        marginLeft: "8%"
    },
    like: {
        flexDirection: "row",
        position: "absolute",
        right: "1%",
        bottom: 80,
    },
    textView: {
        marginLeft: "5%",
        marginBottom: "3%",
        marginTop: "2%",
        flexDirection: "row",
        justifyContent: "space-between",
    },
    subtext: {
        fontSize: 12,
        fontFamily: 'Ubuntu-Medium',
        color: '#A6A6A6',
        height: 40
    },
    pricetext: {
        fontSize: 20,
        fontFamily: 'Ubuntu-Bold',
        fontWeight: "bold"
    },
    maintext: {
        fontSize: 16,
        fontFamily: 'Ubuntu-Regular'
    },
    priceView: {
        justifyContent: "center",
        width: wp('35'),
        alignItems: "center"
    },
    wishlist1: {
        width: 28,
        height: 28,
        backgroundColor: "#fff",
        borderRadius: 28 / 2,
        alignItems: "center",
        justifyContent: "center",
        marginLeft: "2%",
        elevation: 3,
        borderWidth: 0.2,
        borderColor: "#fff",
    },
    wishlist: {
        width: 45,
        height: 45,
        backgroundColor: "#81007F",
        borderRadius: 45 / 2,
        alignItems: "center",
        justifyContent: "center",
        marginRight: "2%",
        top: 7
    },
    water: {
        resizeMode: "contain",
        zIndex: 99999,
        width: "40%",
        height: 100,
        position: "absolute",
        alignSelf: "center",
        opacity: 0.3,
        top: 25
    },
    view: {
        flexDirection: "row",
        justifyContent: 'space-evenly',
        marginLeft: "5%"
    },
    flatView: {
        width: wp('98'),
        // height: hp('50'),
        flexDirection: "row",
        flexWrap: "wrap",
        alignItems: "center",
        alignSelf: "center",
        justifyContent: "space-between",
        marginBottom: hp('0.5')
    },
    text1: {
        fontSize: 10,
        fontFamily: "Ubuntu-Medium",
        alignSelf: "center",
        //alignItems: "center",
        // justifyContent: "center",
        width: "60%",
        textAlign: "center"

    },
    imagee: {
        width: "100%",
        height: 165,
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
    },
    contestImg1: {
        borderRadius: 6,
        width: deviceWidth / 2,
        maxWidth: 130,
        resizeMode: 'cover',
        height: imgHeight1,
    },
    Title: {
        fontSize: 16,
        marginLeft: "5%",
        margin: "2%",
        fontFamily: 'Ubuntu-Bold',
        marginTop: "4%"
    },
    margin14: {
        marginRight: 12,
        elevation: 3,
        borderRadius: 8,
        marginBottom: "1%",
        marginTop: "1%",
        backgroundColor: '#fff'
    },
    text2: {
        marginLeft: "30%",
        fontSize: 12,
        fontFamily: "Ubuntu-Medium"
    },
    text3: {
        marginLeft: "25%",
        fontSize: 12,
        fontFamily: "Ubuntu-Medium"
    },
    center: {
        flexDirection: "row",
        marginLeft: "3%"
    },
    text4: {
        marginLeft: "22%",
        fontSize: 12,
        fontFamily: "Ubuntu-Medium"
    },
    locationIcon: {
        color: "#81007F",
    },
    servicetext: {
        marginLeft: "10%",
        fontSize: 12,
    },
    servicesImage: {
        width: 105,
        height: 90,
    },
    imageView: {
        marginTop: hp('0.2'),
        alignItems: "center",
        width: 108,
        justifyContent: "center",
    },
    menuImage: {
        width: 40,
        height: 40,
        marginTop: '1%'
    },
    services: {
        fontFamily: 'Ubuntu-Bold',
        fontSize: 16,
        color: '#000000',
        alignSelf: 'center',
    },
    services1: {
        fontFamily: 'Ubuntu-Bold',
        fontSize: 16,
        color: '#000000',
        alignSelf: 'center',
        marginTop: 2
    },
    leftimage: {
        width: 18,
        height: 18,
    },
    rightimage: {
        marginRight: "3%"
    },
    item: {
        marginLeft: "4%",
        marginRight: "4%",
        borderRadius: 8,
        flexDirection: "row",
        alignItems: "center",
        padding: 1,
        marginTop: "2%",
        height: hp('5.5'),
    },
    imagecontainerr: {
        borderRadius: 8,
        // elevation: 3,
        height: 250,
        width: "100%",
    },
    imageContainer1: {
        height: (deviceHeight * 25) / 100,
        width: (deviceWidth * 88) / 100,
        alignItems: 'center',
        justifyContent: "center",
        marginBottom: Platform.select({ ios: 0, android: 1 }),
        // borderRadius: 20,
    },
    image: {
        ...StyleSheet.absoluteFillObject,
        resizeMode: 'contain',
    },
    imageContainer: {
        height: (deviceHeight * 25) / 100,
        width: (deviceWidth * 88) / 100,
        alignItems: 'center',
        justifyContent: "center",
        marginBottom: Platform.select({ ios: 0, android: 1 }),
    },
    image1: {
        height: (deviceHeight * 20) / 100,
        width: (deviceWidth * 88) / 100,
        resizeMode: 'contain',
    },
    Carousel: {
        marginTop: "2%",
        height: (deviceHeight * 25) / 100,
        width: (deviceWidth)
    },
    Carousel1: {
        marginTop: "2%",
        height: 250,
        width: (deviceWidth),
        marginBottom: "2%"
    },
    locationtext: {
        textAlign: "center",
        marginLeft: "5%",
        fontSize: 14,
    }
})