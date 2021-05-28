import React from 'react';
import { StyleSheet, View, Image, ActivityIndicator, Text, TouchableWithoutFeedback, TouchableOpacity, FlatList, Linking, Platform, TouchableNativeFeedback, TextInput, Dimensions, StatusBar } from 'react-native';
import {
    Container,
    Content,
    Toast,
    Left,
    Right,
    Card,
    Icon
} from 'native-base';
const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;
const imgHeight = deviceHeight / 7 > 110 ? deviceHeight / 9 : 110;
const imgHeight1 = deviceHeight / 1 > 110 ? deviceHeight / 9 : 110;
import AsyncStorage from '@react-native-community/async-storage';
import qs from 'qs';
import { MaterialIndicator } from 'react-native-indicators';
const baseUrl = "http://demoworks.in/php/mypropertree/api/common/";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

export default class Villas extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            data: [],
            count: "",
            label_name: "",
            subtype_name: "",
            fetching_from_server: false,
            dataCount: 0,
            lat: "",
            long: "",
            user_id: "",
            propertyName: ""
        }
        this.offset = 1;
    }
    componentDidMount() {
        // this.focusListener = this.props.navigation.addListener('focus', () => {
        //     this.getProperties()
        // });
        this.offset = 1;
        AsyncStorage.getItem('lat').then((lat) => {
            AsyncStorage.getItem('long').then((long) => {
                this.getProperties(lat, long)
                this.setState({
                    lat: lat,
                    long: long,
                })
            });
        });
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
    componentDidUpdate(prevProps) {
        if (JSON.stringify(prevProps.route.params.filterObj) != JSON.stringify(this.props.route.params.filterObj)) {
            AsyncStorage.getItem('lat').then((lat) => {
                AsyncStorage.getItem('long').then((long) => {
                    this.getProperties(lat, long)
                    this.setState({
                        lat: lat,
                        long: long,
                    })
                });
            });
            this.offset = 1;
        }
    }
    getProperties = (lat, long) => {
        this.setState({ loading: true, data: [], dataCount: 0 });
        if (this.props.route.params.filterObj != undefined) {
            var ufilterObj = this.props.route.params.filterObj
        } else {
            var ufilterObj = {};
        }
        fetch(baseUrl + 'get_nearby_properties_list', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'content-type': 'application/x-www-form-urlencoded',
            },
            body: qs.stringify({
                property_type: this.props.route.params.selectedType ? this.props.route.params.selectedType : this.props.route.params.property_type,
                latitude: lat,
                longitude: long,
                property_subtype: this.props.route.params.selectedBuildingType ? this.props.route.params.selectedBuildingType : this.props.route.params.property_subtype,
                offset: this.offset,
                filters: ufilterObj
            })
        }).then((response) => response.json())
            .then((json) => {
                if (json.status == 'valid') {
                    var count = json.count;
                    this.offset = this.offset;
                    this.setState({
                        data: json.data,
                        count: count,
                        subtype_name: json.subtype_name,
                        loading: false,
                        dataCount: json.count,
                        propertyName: json.property_type_name
                    })
                } else {
                    this.setState({ data: [], dataCount: 0, loading: false });
                }
            })
            .catch((error) => {
                this.setState({ loading: false });
            });
    }
    loadMoreData = (lat, long) => {

        if (this.props.route.params.filterObj != undefined) {
            var ufilterObj = this.props.route.params.filterObj
        } else {
            var ufilterObj = {};
        }
        this.setState({ fetching_from_server: true }, () => {
            fetch(baseUrl + 'get_nearby_properties_list', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'content-type': 'application/x-www-form-urlencoded',
                },
                body: qs.stringify({
                    property_type: this.props.route.params.property_type ? this.props.route.params.property_type : 1,
                    latitude: this.state.lat,
                    longitude: this.state.long,
                    property_subtype: this.props.route.params.selectedBuildingType ? this.props.route.params.selectedBuildingType : this.props.route.params.property_subtype,
                    offset: this.offset + 1,
                    filters: ufilterObj
                })
            }).then((response) => response.json())
                .then((json) => {
                    if (json.status == "valid") {
                        this.offset = this.offset + 1;
                        this.setState({
                            data: [...this.state.data, ...json.data],
                            fetching_from_server: false,
                            dataCount: json.count,
                        });
                    } else if (json.status == "invalid") {
                        this.setState({ loading: false, data: [], dataCount: 0 });
                    }
                })
                .catch((error) => {
                    this.setState({ loading: false, isFetching: false });
                });
        });
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
    goToRealestate = () => {
        this.props.navigation.navigate('Realestate', { property_type: this.props.route.params.selectedType ? this.props.route.params.selectedType : this.props.route.params.property_type })
    }
    goToSelectLocaton = (lat, long) => {
        this.props.navigation.navigate('SelectLocation', {
            property_type: this.props.route.params.property_type,
            latitude: lat,
            longitude: long,
            property_subtype: this.props.route.params.property_subtype,
            pageName: "Villas"
        });
    }
    goToFilter = () => {
        this.props.navigation.navigate('Filter',
            {
                property_type: this.props.route.params.property_type,
                filterObj: this.props.route.params.filterObj,
                backscreen: "Villas"
            });
    }
    goToVillaDetails = (property_id) => {
        this.props.navigation.navigate('VillaDetails', { property_id: property_id, backscreen: 'Villas' });
    }
    goToNotifications = () => {
        this.props.navigation.navigate('Notifications');
    }
    ListEmptyView = () => {
        return (

            <View style={{ alignItems: "center", justifyContent: "center", alignSelf: "center" }}>
                {/* <Image source={require('../assets/emptyCart.png')} style={styles.emptyimage} resizeMode="contain" /> */}
                <Image source={require('../assets/cry.png')} style={styles.emptyimage} resizeMode="contain" />
            </View>
        );
    }
    renderLoadButton = () => {
        if (this.state.data.length === this.state.dataCount) {
            return null
        } else {
            return (
                <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={this.loadMoreData}
                    style={styles.loadMoreBtn}>
                    <Text style={styles.btnText}>Load More</Text>
                    {this.state.fetching_from_server ? (
                        <ActivityIndicator color="white" style={{ marginLeft: 8 }} />
                    ) : null}
                </TouchableOpacity>
            )
        }
    }
    renderFooter() {
        return (
            <View style={styles.footer}>
                {this.renderLoadButton()}
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
                <StatusBar backgroundColor='#fff' barStyle="dark-content" />
                <View style={{ marginTop: "3%", marginBottom: "2%" }}>
                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                        <TouchableWithoutFeedback onPress={this.goToRealestate}>
                            <View style={styles.center}>
                                <Image source={require('../assets/back_icon.png')} style={styles.leftimage} resizeMode="contain" />
                                <View style={{ marginLeft: "7%" }}>
                                    <Text style={styles.headerText}>
                                        {this.state.subtype_name}
                                    </Text>
                                    <Text style={styles.headerText1}>
                                        {this.state.count} Properties
                                    </Text>
                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                        <View>
                            <TouchableWithoutFeedback>
                                <View style={{ flexDirection: "row", marginRight: "5%" }}>
                                    <TouchableWithoutFeedback onPress={this.goToFilter}>
                                        <View style={styles.leftimage1}>
                                            <Image source={require('../assets/filter_icon.png')} style={{ marginRight: 15 }} resizeMode="contain" />
                                        </View>
                                    </TouchableWithoutFeedback>
                                    <TouchableWithoutFeedback onPress={this.goToNotifications}>
                                        <View style={styles.leftimage1}>
                                            <Image source={require('../assets/notification_icon.png')} style={styles.leftimage} resizeMode="contain" />
                                        </View>
                                    </TouchableWithoutFeedback>
                                </View>
                            </TouchableWithoutFeedback>
                        </View>
                    </View>
                </View>
                <Content>
                    <View>
                        <TouchableWithoutFeedback onPress={this.goToSelectLocaton}>
                            <Card style={styles.item}>
                                <View style={styles.wishlist1}>
                                    <Icon active name='map-marker' type="FontAwesome" style={{ fontSize: 15, color: '#81007F', }} />
                                </View>
                                <Text style={styles.locationtext}>{this.state.label_name ? this.state.label_name : "Select Location"}</Text>
                            </Card>
                        </TouchableWithoutFeedback>
                    </View>
                    <FlatList
                        data={this.state.data}
                        renderItem={({ item }) =>
                        (
                            <View>
                                <TouchableWithoutFeedback onPress={() => { this.goToVillaDetails(item.property_id) }}>
                                    <View style={styles.imagecontainer}>
                                        {
                                            item.property_image == "" ?
                                                <Image source={require('../assets/noimage.jpg')} style={styles.image} />
                                                :
                                                <Image source={{ uri: item.property_image }} style={styles.image} />
                                        }
                                        <Image source={require('../assets/watermark.png')} style={styles.water} />
                                        {item.admin_approved_status == "approved" ?
                                            <View style={{ position: "absolute", marginTop: hp('1'), left: 0, position: "absolute", }}>
                                                <TouchableWithoutFeedback>
                                                    <Image source={require('../assets/verify.png')} resizeMode="contain" style={{ height: 40, backgroundColor: "transparent" }} />
                                                </TouchableWithoutFeedback>
                                            </View>
                                            : null}

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
                                    </View>
                                    {/* <Image source={{ uri: item.property_image }} style={styles.image} />
                                                            <View style={{ position: 'absolute', top: 210 }}>
                            <View style={styles.priceContainer}>
                                <View style={{ flexDirection: 'row' }}>
                                    <View style={{ width: wp('49') }}>
                                    <Text style={{ fontSize: 20, backgroundColor: "#fff" }}>PRT385931</Text>
                                    </View>
                                    </View>
                                    </View>
                                    </View> */}
                                </TouchableWithoutFeedback>
                            </View>
                        )}
                        ListEmptyComponent={this.ListEmptyView}
                        ListFooterComponent={this.renderFooter.bind(this)}
                    />

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
        alignItems: "center",
        justifyContent: 'center'
    },
    headerText: {
        color: "#000",
        fontSize: 15,
        fontFamily: 'Ubuntu-Bold'
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
    wishlist1: {
        width: 25,
        height: 25,
        backgroundColor: "#fff",
        borderRadius: 25 / 2,
        alignItems: "center",
        justifyContent: "center",
        marginLeft: "2%",
        elevation: 3,
        borderWidth: 0.2,
        borderColor: "#fff",
    },
    headerText1: {
        color: "#A6A6A6",
        fontSize: 13,
        fontFamily: 'Ubuntu-Medium'
    },
    emptyimage: {
        marginTop: hp('15'),
        height: hp('40'),
        width: wp('40')
    },
    pacman: {
        width: 130,
        height: 0,
        borderTopColor: "#81007F",
        borderLeftColor: "#81007F",
        borderRightColor: 'transparent',
        borderBottomColor: "#81007F",
        borderWidth: 12,
        //justifyContent: 'center',
        position: 'absolute',
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-around",

    },
    center: {
        // justifyContent: 'center',
        // alignItems: 'center',
        flexDirection: "row",
        marginLeft: "3%"
    },
    menuImage: {
        width: 40,
        height: 40,
        marginTop: '1%'
    },
    item: {
        marginLeft: "4%",
        marginRight: "4%",
        // elevation: 3,
        // borderWidth: 0.2,
        // borderColor: "#fff",
        borderRadius: 10,
        flexDirection: "row",
        alignItems: "center",
        padding: 9,
        marginTop: "2%"
    },
    loadMoreBtn: {
        margin: 5,
        backgroundColor: '#81007F',
        borderRadius: 4,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: wp('33'),
        height: 35
    },
    btnText: {
        color: 'white',
        fontSize: 12,
        textAlign: 'center',
        fontFamily: 'Poppins-Regular',
    },
    locationtext: {
        textAlign: "center",
        marginLeft: "5%",
        fontSize: 17,
        fontFamily: 'Ubuntu-Regular'
    },
    image: {
        width: "100%",
        height: 165,
        marginBottom: "2%",
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
    },
    imagecontainer: {
        borderRadius: 8,
        marginTop: "4%",
        elevation: 3,
        marginLeft: "6%",
        marginRight: "6%",
        backgroundColor: "#fff",
        marginBottom: 1
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
    priceView: {
        justifyContent: "center",
        width: wp('35'),
        alignItems: "center"
    },
    footer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    subtext: {
        fontSize: 12,
        fontFamily: 'Ubuntu-Medium',
        color: '#A6A6A6',
        height: 40
    },
    maintext: {
        fontSize: 16,
        fontFamily: 'Ubuntu-Regular'
    },
    maintextView: {
        position: "absolute",
        backgroundColor: "#81007F",
        right: 0,
        flexDirection: "row",
        padding: "1%",
        marginLeft: "3%",
        // marginRight: "3%",
        alignItems: "center",
        justifyContent: "space-around"
    },
    maintext1: {
        fontSize: 15,
        fontFamily: 'Ubuntu-Regular',
        color: "#fff",
        textAlign: "center",
        margin: "10%"

    },
    pricetext: {
        fontSize: 20,
        fontFamily: 'Ubuntu-Bold',
        fontWeight: "bold"
    }
})