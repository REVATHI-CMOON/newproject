import React from 'react';
import { StyleSheet, View, Image, Text, TouchableWithoutFeedback, TouchableNativeFeedback, TextInput, Dimensions, StatusBar, PermissionsAndroid, Platform } from 'react-native';
import { Container, Content, Footer, Item, Input, Left, Right, List, ListItem, Picker, Body, Toast, Switch, Icon } from 'native-base';
import Modal from 'react-native-modal';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Dash from 'react-native-dash';
import AsyncStorage from '@react-native-community/async-storage';
import Geolocation from 'react-native-geolocation-service';
import qs from 'qs';
import { MaterialIndicator } from 'react-native-indicators';
const baseUrl = "http://demoworks.in/php/mypropertree/api/dashboard/";
const baseUrl2 = "http://demoworks.in/php/mypropertree/api/common/";
export default class Step2 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            title: '',
            latitude: '',
            longitude: '',
            getStates: [],
            state_id: '',
            getCity: [],
            getLocations: [],
            city: '',
            location: '',
            address: '',
            zipcode: '',
            loading: false,
            user_id: '',
            showModal: false,
            getPincodes: [],
            property_post_status: "",
            cityname: "",
            register_type_id: "",
            cname: "",
            cmobile: "",
            citylatitude: "",
            citylongitude: "",
            locationlatitude: "",
            locationlongitude: ""
        }
    }
    componentDidMount() {
        AsyncStorage.getItem('register_type_id').then((register_type_id) => {
            this.setState({ register_type_id: register_type_id })
        })
        AsyncStorage.getItem('user_id').then((user_id) => {
            this.getDetails(this.props.route.params.property_id, user_id),
                this.setState({ user_id: user_id });
        }
        )
        this.getStates();
    }
    componentDidUpdate(prevProps) {
        if (JSON.stringify(prevProps.route.params.longitude) != JSON.stringify(this.props.route.params.longitude)) {
            this.setState({
                longitude: this.props.route.params.longitude,
                latitude: this.props.route.params.latitude
            })
        }
    }
    getDetails = (id, user_id) => {
        this.setState({ loading: true });
        fetch(baseUrl + 'edit_property/', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'content-type': 'application/x-www-form-urlencoded',
            },
            body: qs.stringify({
                property_id: id,
                user_id: user_id
            })
        }).then((response) => response.json())
            .then((json) => {
                this.setState({ loading: false });
                if (json.status == "invalid") {

                } else if (json.status == "valid") {
                    this.setState({
                        property_post_status: json.data.property_post_status,
                        title: this.props.route.params.title ? this.props.route.params.title : json.data.title,
                        state_id: this.props.route.params.state_id ? this.props.route.params.state_id : json.data.state_id,
                        city: this.props.route.params.city_id ? this.props.route.params.city_id : json.data.city_id,
                        location: this.props.route.params.location_id ? this.props.route.params.location_id : json.data.location_id,
                        address: this.props.route.params.address ? this.props.route.params.address : json.data.address,
                        zipcode: this.props.route.params.zipcode ? this.props.route.params.zipcode : json.data.zipcode,
                        latitude: this.props.route.params.latitude ? this.props.route.params.latitude : json.data.latitude,
                        longitude: this.props.route.params.longitude ? this.props.route.params.longitude : json.data.longitude,
                        cityname: json.data.city_name,
                        cname: this.props.route.params.owner_name ? this.props.route.params.owner_name : json.data.owner_name,
                        cmobile: this.props.route.params.mobile ? this.props.route.params.mobile : json.data.mobile
                    })
                    this.getStates();
                    this.getCitys(this.props.route.params.state_id ? this.props.route.params.state_id : json.data.state_id)
                    this.getLocation(this.props.route.params.city_id ? this.props.route.params.city_id : json.data.city_id)
                    var latitude = this.props.route.params.lat;
                    if (latitude != undefined) {
                        this.setState({ latitude: latitude })
                    }
                    var longitude = this.props.route.params.long;
                    if (longitude != undefined) {
                        this.setState({ longitude: longitude })
                    }
                }
            })
            .catch((error) => {
                this.setState({ loading: false });
                console.error(error);
            });
    }
    getStates = () => {
        this.setState({
            loading: true,
        })
        fetch(baseUrl2 + 'get_states', {
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
                        getStates: json.data,
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
    getCitys = (state_id) => {
        fetch(baseUrl2 + 'get_state_wise_cities', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'content-type': 'application/x-www-form-urlencoded',
            },
            body: qs.stringify({
                state_id: state_id
            })
        }).then((response) => response.json())
            .then((json) => {
                if (json.status == 'valid') {
                    this.setState({
                        getCity: json.data,
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
    // getCitys = (state_id) => {
    //     fetch(baseUrl2 + 'get_state_wise_cities_new', {
    //         method: 'POST',
    //         headers: {
    //             Accept: 'application/json',
    //             'content-type': 'application/x-www-form-urlencoded',
    //         },
    //         body: qs.stringify({
    //             state_id: state_id
    //         })
    //     }).then((response) => response.json())
    //         .then((json) => {
    //             if (json.status == 'valid') {
    //                 this.setState({
    //                     getCity: json.data,
    //                     loading: false,
    //                 });
    //             } else {
    //                 this.setState({ loading: false });
    //             }
    //         })
    //         .catch((error) => {
    //             this.setState({ loading: false });
    //         });
    // }
    getLocation = (city_id) => {
        fetch(baseUrl2 + 'get_city_wise_locations_new', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'content-type': 'application/x-www-form-urlencoded',
            },
            body: qs.stringify({
                city_id: city_id
            })
        }).then((response) => response.json())
            .then((json) => {
                if (json.status == 'valid') {
                    this.setState({
                        loading: false,
                        getLocations: json.data,
                        getPincodes: json.pincodes
                    });
                } else if (json.status == 'invalid') {
                    Toast.show({
                        text: "No Locations available",
                        duration: 2000,
                        type: 'danger',
                        textStyle: { fontFamily: 'Ubuntu-Regular', color: "#ffffff", textAlign: 'center' },
                    })
                    this.setState({
                        loading: false,
                        getLocations: []
                    });
                }
            })
            .catch((error) => {
                this.setState({ loading: false, getLocations: [] });
                console.error(error);
            });
    }
    // getLocation = (city_id) => {
    //     fetch(baseUrl2 + 'get_city_wise_locations', {
    //         method: 'POST',
    //         headers: {
    //             Accept: 'application/json',
    //             'content-type': 'application/x-www-form-urlencoded',
    //         },
    //         body: qs.stringify({
    //             city_id: city_id
    //         })
    //     }).then((response) => response.json())
    //         .then((json) => {
    //             if (json.status == 'valid') {
    //                 this.setState({
    //                     loading: false,
    //                     getLocations: json.data,
    //                     getPincodes: json.pincodes
    //                 });
    //             } else if (json.status == 'invalid') {
    //                 Toast.show({
    //                     text: "No Locations available",
    //                     duration: 2000,
    //                     type: 'danger',
    //                     textStyle: { fontFamily: 'Ubuntu-Regular', color: "#ffffff", textAlign: 'center' },
    //                 })
    //                 this.setState({
    //                     loading: false,
    //                     getLocations: []
    //                 });
    //             }
    //         })
    //         .catch((error) => {
    //             this.setState({ loading: false, getLocations: [] });
    //             console.error(error);
    //         });
    // }
    getCurrentLocation = async () => {

        this.setState({ loading: true, showModal: false });
        if (Platform.OS === 'ios') {
            const granted = Geolocation.requestAuthorization('always');
            this.callLocation();
            this.setState({ loading: false });
        } else if (Platform.OS === 'android') {
            var that = this;
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, {
                    'title': 'Location Access Required',
                    'message': 'This App needs to Access your location'
                }
                )
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    that.callLocation();
                } else {
                    Toast.show({
                        text: "Permission denied",
                        duration: 2000,
                        type: 'danger',
                        textStyle: { fontFamily: 'Ubuntu-Regular', color: "#ffffff", textAlign: 'center' },
                    })
                }
            } catch (err) {
                Toast.show({
                    text: err,
                    duration: 2000,
                    type: 'danger',
                    textStyle: { fontFamily: 'Ubuntu-Regular', color: "#ffffff", textAlign: 'center' },
                })
                this.setState({ loading: false });
            }
        }
    }
    callLocation = () => {
        Geolocation.getCurrentPosition(
            (position) => {
                const currentLongitude = JSON.stringify(position.coords.longitude);
                const currentLatitude = JSON.stringify(position.coords.latitude);
                this.setState({ latitude: currentLatitude, longitude: currentLongitude, showModal: false, loading: false })
                Toast.show({
                    text: "Your Current location selected",
                    duration: 2000,
                    type: 'success',
                    textStyle: { fontFamily: 'Ubuntu-Regular', color: "#ffffff", textAlign: 'center' },
                })
            },
            (error) => {
                Toast.show({
                    text: error.message,
                    duration: 2000,
                    type: 'danger',
                    textStyle: { fontFamily: 'Ubuntu-Regular', color: "#ffffff", textAlign: 'center' },
                })
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
    }
    goToStep3 = () => {
        // if (this.state.city !== null) {
        //     var Data = this.state.city.split(',');
        //     var cityId = Data[0];
        //     this.setState({ city: cityId })
        // }
        if (this.state.location !== null) {
            var Data = this.state.location.split(',');
            var locationId = Data[0];
            this.setState({ location: locationId })
        }
        this.setState({ loading: true });
        fetch(baseUrl + 'property_post_step2', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'content-type': 'application/x-www-form-urlencoded',
            },
            body: qs.stringify({
                user_id: this.state.user_id,
                property_id: this.props.route.params.property_id,
                title: this.state.title,
                state_id: this.state.state_id,
                city_id: this.state.city,
                location_id: locationId,
                address: this.state.address,
                latitude: this.state.latitude,
                longitude: this.state.longitude,
                payment_id: this.props.route.params.payment_id ? this.props.route.params.payment_id : "",
                owner_name: this.state.cname,
                mobile: this.state.cmobile
            })
        }).then((response) => response.json())
            .then((json) => {
                this.setState({ loading: false });
                if (json.status == "invalid") {
                    Toast.show({
                        text: json.message,
                        duration: 2500,
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
                    this.state.property_post_status == 1 ?
                        this.props.navigation.navigate('ManageProperties')
                        :
                        this.props.navigation.navigate('Step3', { property_id: json.property_id, type: json.type, sub_type: json.sub_type })
                }
            })
            .catch((error) => {
                this.setState({ loading: false });
                console.error(error);
            });
    }
    goToUpDate = () => {
        if (this.state.register_type_id == 9) {
            // if (this.state.city !== null) {
            //     var Data = this.state.city.split(',');
            //     var cityId = Data[0];
            //     this.setState({ city: cityId })
            // }
            if (this.state.location !== null) {
                var Data = this.state.location.split(',');
                var locationId = Data[0];
                this.setState({ location: locationId })
            }
            // var latitude = this.props.route.params.lat;
            // if (latitude != undefined) {
            //     this.setState({ latitude: latitude })
            // }
            // var longitude = this.props.route.params.long;
            // if (longitude != undefined) {
            //     this.setState({ longitude: longitude })
            // }
            this.setState({ loading: true });
            fetch(baseUrl + 'update_developer_step2', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'content-type': 'application/x-www-form-urlencoded',
                },
                body: qs.stringify({
                    user_id: this.state.user_id,
                    property_id: this.props.route.params.property_id,
                    action: "manage",
                    title: this.state.title,
                    state_id: this.state.state_id,
                    city_id: this.state.city,
                    location_id: locationId,
                    address: this.state.address,
                    latitude: this.state.latitude,
                    longitude: this.state.longitude,
                    owner_name: this.state.cname,
                    mobile: this.state.cmobile
                })
            }).then((response) => response.json())
                .then((json) => {
                    this.setState({ loading: false });
                    if (json.status == "invalid") {
                        Toast.show({
                            text: json.message,
                            duration: 2500,
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
                        this.props.navigation.navigate('ManageProperties')
                    }
                })
                .catch((error) => {
                    this.setState({ loading: false });
                    console.error(error);
                });
        }
        else {
            this.goToStep3();
        }
    }
    openMapWithMarker = () => {
        this.setState({ showModal: false })
        this.props.navigation.navigate('MapWithMarker', { citylatitude: this.state.locationlatitude, citylongitude: this.state.locationlongitude })
    }
    goToProperty = () => {
        if (this.state.register_type_id == "9") {
            this.props.navigation.navigate('Home')
        }
        else {
            this.props.navigation.navigate('Property', { property_id: this.props.route.params.property_id, type: this.props.route.params.type, sub_type: this.props.route.params.sub_type })
        }
    }
    validate_field = () => {
        if (this.state.state_id == "" || this.state.state_id == null) {
            Toast.show({
                text: "Please Select State",
                duration: 2000,
                type: 'danger',
                textStyle: { fontFamily: 'Poppins-Regular', color: "#ffffff", textAlign: 'center' },
            })
            return false
        }
        else if (this.state.city == "" || this.state.city == null) {
            Toast.show({
                text: "Please Select City",
                duration: 2000,
                type: 'danger',
                textStyle: { fontFamily: 'Poppins-Regular', color: "#ffffff", textAlign: 'center' },
            })
            return false
        }
        else if (this.state.location == "" || this.state.location == null) {
            Toast.show({
                text: "Please Select Location",
                duration: 2000,
                type: 'danger',
                textStyle: { fontFamily: 'Poppins-Regular', color: "#ffffff", textAlign: 'center' },
            })
            return false
        }
        else return true
    }
    openModal = () => {
        if (this.validate_field()) {
            this.setState({ showModal: true })
        }
    }
    closeModel = () => {
        this.setState({ showModal: false })
    }
    render() {
        if (this.state.loading) {
            return (
                <View style={{ flex: 1 }}>
                    <MaterialIndicator color='#81007F' size={30} />
                </View>
            )
        }
        return (
            <Container>
                <StatusBar backgroundColor='#fff' barStyle="dark-content" />
                {this.state.property_post_status == 1 ?
                    <View>
                    </View>
                    :
                    <View style={{ marginTop: "3%", marginLeft: "3%", }}>
                        <View style={{ flexDirection: "row", }}>
                            <TouchableWithoutFeedback onPress={this.goToProperty}>
                                <Image source={require('../assets/back_icon.png')} resizeMode='contain' />
                            </TouchableWithoutFeedback>
                            <Text style={styles.headerText}>{this.state.register_type_id == "9" ? "Step1" : "Step2"}</Text>
                        </View>
                        <View style={{ borderBottomWidth: 0.5, marginTop: "3%", elevation: 1, borderBottomColor: "#F0F0F0" }}></View>
                    </View>
                }
                <Content>
                    <Modal
                        isVisible={this.state.showModal}
                    >
                        <View style={{ flex: 1, justifyContent: 'center' }}>
                            <View style={styles.modalView}>
                                <View style={{ position: 'absolute', right: 7, top: 7 }}>
                                    <TouchableWithoutFeedback onPress={this.closeModel}>
                                        <Image source={require('../assets/close_icon.png')} style={{ width: 60, height: 60, }} />
                                    </TouchableWithoutFeedback>
                                </View>
                                <View style={{ padding: '5%' }}>
                                    <Text style={styles.modalheader}>Location Map</Text>
                                    <Text style={styles.submodalText}>Select one of the options below</Text>
                                </View>
                                <List>
                                    <TouchableWithoutFeedback onPress={this.getCurrentLocation}>
                                        <ListItem>
                                            <Body style={{ flexDirection: 'row' }}>
                                                <View style={styles.wishlist1}>
                                                    <Icon active name='map-marker' type="FontAwesome" style={{ fontSize: 15, color: '#81007F', }} />
                                                </View>
                                                {/* <Image source={require('../assets/location_search.png')} style={{ width: 40, height: 40, marginTop: hp('0.7') }} /> */}
                                                <View style={{ marginLeft: '3%' }}>
                                                    <Text style={styles.header}>100% Correct</Text>
                                                    <Text style={styles.subLIstHeader}>I just located my building</Text>
                                                    <Text style={styles.subLIstHeader}>address on map,which i</Text>
                                                    <Text style={styles.subLIstHeader}> believe is correct</Text>
                                                </View>
                                            </Body>
                                            <Right>
                                                <Icon name="angle-right" type="FontAwesome" />
                                            </Right>
                                        </ListItem>
                                    </TouchableWithoutFeedback>
                                    <TouchableWithoutFeedback onPress={this.openMapWithMarker}>
                                        <ListItem>
                                            <Body style={{ flexDirection: 'row' }}>
                                                <View style={styles.wishlist1}>
                                                    <Icon active name='map-marker' type="FontAwesome" style={{ fontSize: 15, color: '#81007F', }} />
                                                </View>
                                                {/* <Image source={require('../assets/location_search.png')} style={{ width: 40, height: 40, marginTop: hp('0.7') }} /> */}
                                                <View style={{ marginLeft: '3%' }}>
                                                    <Text style={styles.header}>Go to my property address</Text>
                                                    <Text style={styles.subLIstHeader}>If you think it is not correct</Text>
                                                    <Text style={styles.subLIstHeader}>property location go back and</Text>
                                                    <Text style={styles.subLIstHeader}>enter the correct one</Text>
                                                </View>
                                            </Body>
                                            <Right>
                                                <Icon name="angle-right" type="FontAwesome" />
                                            </Right>
                                        </ListItem>
                                    </TouchableWithoutFeedback>
                                </List>
                            </View>
                        </View>
                    </Modal>
                    <View style={styles.row}>
                        <View style={styles.row}>
                            <Dash style={styles.dash} dashColor="#C7C7C7" dashGap={3} />
                            <Image source={require('../assets/rent_type.png')} style={styles.image} resizeMode="contain" />
                        </View>

                        <View style={styles.view}>
                            <Text style={styles.TitleText}>
                                Basic Information
                           </Text>
                            {/* <Text style={styles.loginText2}>House / Flat No</Text>
                            <Item style={styles.item}>
                                <Input
                                    style={styles.input}
                                    value={this.state.houseno}
                                    onChangeText={(houseno) => { this.setState({ houseno: houseno }) }}
                                />
                            </Item> */}
                            {
                                (this.state.register_type_id == 1 || this.state.register_type_id == 2) &&
                                <Text style={styles.loginText2}>Title of the Post</Text>
                            }
                            {
                                this.state.register_type_id == 4 &&
                                <Text style={styles.loginText2}>Project Title</Text>
                            }
                            {
                                this.state.register_type_id == 3 &&
                                <Text style={styles.loginText2}>Project Name</Text>
                            }
                            {
                                this.state.register_type_id == 9 &&
                                <Text style={styles.loginText2}>Venture Name</Text>
                            }
                            <Item style={styles.item}>
                                <Input
                                    style={styles.input}
                                    value={this.state.title}
                                    onChangeText={(title) => { this.setState({ title: title }) }}
                                />
                            </Item>
                            <Text style={styles.loginText2}>State</Text>
                            <Item style={styles.item}>
                                <Picker
                                    style={styles.pickerStyle}
                                    selectedValue={this.state.state_id}
                                    onValueChange={(itemValue, itemIndex) => {
                                        this.setState(
                                            { state_id: itemValue },
                                            () => {
                                                this.getCitys(itemValue)
                                            }
                                        )
                                    }
                                    }>
                                    <Picker.Item label="Select" value="" />
                                    {
                                        this.state.getStates.map((item, key) =>
                                            <Picker.Item label={item.name} value={item.id} key={key} />
                                        )
                                    }
                                </Picker>
                            </Item>
                            <Text style={styles.loginText2}>City</Text>
                            <Item style={styles.item}>
                                <Picker
                                    style={styles.pickerStyle}
                                    selectedValue={this.state.city}
                                    onValueChange={(itemValue, itemIndex) => {
                                        (this.setState({ city: itemValue }
                                            ,
                                            () => {
                                                this.getLocation(itemValue)
                                            }))
                                    }}
                                // onValueChange={(itemValue, itemIndex) => {
                                //     var Data = itemValue.split(',');
                                //     var cityId = Data[0];
                                //     this.setState(
                                //         { city: itemValue, citylatitude: Data[1], citylongitude: Data[2] },
                                //         () => {
                                //             this.getLocation(cityId)
                                //         }
                                //     )
                                // }}
                                >
                                    {this.state.property_post_status == 1 ? <Picker.Item label={this.state.cityname} value={this.state.state_id} />
                                        :
                                        <Picker.Item label="Select" value="" />}
                                    {
                                        this.state.getCity.map((item) =>
                                            <Picker.Item label={item.name} value={item.id} />
                                        )
                                    }

                                </Picker>
                            </Item>
                            <Text style={styles.loginText2}>Location</Text>
                            <Item style={styles.item}>
                                <Picker
                                    style={styles.pickerStyle}
                                    selectedValue={this.state.location}
                                    // onValueChange={(itemValue, itemIndex) => { (this.setState({ location: itemValue })) }}
                                    onValueChange={(itemValue, itemIndex) => {
                                        var Data = itemValue.split(',');
                                        var locationId = Data[0];
                                        this.setState(
                                            { location: itemValue, locationlatitude: Data[1], locationlongitude: Data[2] }
                                        )
                                    }}
                                >
                                    <Picker.Item label="Select" value="" />

                                    {
                                        this.state.getLocations.map((item) =>

                                            <Picker.Item label={item.name} value={item.id} />

                                        )
                                    }

                                </Picker>
                            </Item>
                            <Text style={styles.loginText2}>Address</Text>
                            <Item style={styles.item}>
                                <Input
                                    style={styles.input}
                                    value={this.state.address}
                                    onChangeText={(address) => { this.setState({ address: address }) }}
                                />
                            </Item>
                            {/* <Text style={styles.loginText2}>Zip Code</Text>
                            <Item style={styles.item}>
                                <Picker
                                    style={styles.pickerStyle}
                                    selectedValue={this.state.zipcode}
                                    onValueChange={(itemValue, itemIndex) => { (this.setState({ zipcode: itemValue })) }}
                                >
                                    <Picker.Item label="Select" value="" />

                                    {
                                        this.state.getPincodes.map((item) =>

                                            <Picker.Item label={item.pincode} value={item.id} />

                                        )
                                    }

                                </Picker>
                            </Item> */}
                            <Text style={styles.loginText2}>Update Your Map Location</Text>
                            <TouchableWithoutFeedback onPress={this.openModal}>
                                <View style={{ marginTop: hp('2'), marginLeft: wp('5'), marginRight: wp('5'), marginBottom: wp('5') }}>
                                    <View style={styles.buttonContainer1}>
                                        <Text style={styles.submitText}>UPDATE MAP</Text>
                                        <View style={styles.wishlist}>
                                            <Icon active name='map-marker' type="FontAwesome" style={{ fontSize: 15, color: '#81007F', }} />
                                        </View>
                                        {/* <Image source={require('../assets/location_search.png')} resizeMode="contain" /> */}
                                    </View>
                                </View>
                            </TouchableWithoutFeedback>
                            {
                                this.state.register_type_id == 3 || this.state.register_type_id == 4 || this.state.register_type_id == 9 ?
                                    <View style={styles.view}>
                                        <Text style={styles.TitleText}>
                                            Contact Information
                                        </Text>
                                        <Text style={styles.loginText2}>Name</Text>
                                        <Item style={styles.item}>
                                            <Input
                                                style={styles.input}
                                                value={this.state.cname}
                                                onChangeText={(cname) => { this.setState({ cname: cname }) }}
                                            />
                                        </Item>
                                        <Text style={styles.loginText2}>Mobile</Text>
                                        <Item style={styles.item}>
                                            <Input
                                                style={styles.input}
                                                value={this.state.cmobile}
                                                maxLength={10}
                                                keyboardType="number-pad"
                                                onChangeText={(cmobile) => { this.setState({ cmobile: cmobile }) }}
                                            />
                                        </Item>
                                    </View>
                                    :
                                    <View></View>
                            }
                        </View>
                    </View>
                    <View style={{ marginBottom: "3%" }}></View>
                </Content>
                {this.state.property_post_status == 1 ?
                    <TouchableWithoutFeedback onPress={this.goToUpDate}>
                        <View>
                            {
                                Platform.OS == "android" && <Footer style={{ backgroundColor: '#81007F', justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={{ fontFamily: 'Ubuntu-Regular', fontSize: 16, color: '#ffffff' }}>UPDATE</Text>
                                </Footer>
                            }
                            {
                                Platform.OS == "ios" && <View style={{ backgroundColor: '#81007F', justifyContent: 'center', alignItems: 'center', padding: '5%' }}>
                                    <Text style={{ fontFamily: 'Ubuntu-Regular', fontSize: 16, color: '#ffffff' }}>UPDATE</Text>
                                </View>
                            }
                        </View>

                    </TouchableWithoutFeedback>
                    :
                    <View style={styles.Button}>
                        <TouchableWithoutFeedback onPress={this.goToProperty}>
                            <View style={{ flexDirection: "row", marginLeft: "3%", alignItems: "center" }}>
                                <Icon name="angle-left" type="FontAwesome" style={styles.locicon} />
                                <Text style={styles.submitText1}>Back</Text>
                            </View>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback onPress={this.goToStep3}>
                            <View style={styles.buttonContainer}>
                                <Text style={styles.submitText2}>Next</Text>
                                <Icon name="angle-right" type="FontAwesome" style={{ color: "#81007F" }} />
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                }
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
    wishlist: {
        width: 25,
        height: 25,
        backgroundColor: "#fff",
        borderRadius: 25 / 2,
        alignItems: "center",
        justifyContent: "center",
        // marginLeft: "2%",
        elevation: 3,
        borderWidth: 0.2,
        borderColor: "#fff",
    },
    headerText: {
        color: "#000",
        fontSize: 17,
        fontFamily: 'Ubuntu-Bold',
        marginLeft: "8%"

    },
    subLIstHeader: {
        fontFamily: 'Ubuntu-Bold',
        fontSize: 15,
        color: '#a2a2a2'
    },
    modalView: {
        margin: '5%',
        padding: '3%',
        backgroundColor: "white",
        borderRadius: 12,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
    },
    modalheader: {
        fontFamily: 'Ubuntu-Bold',
        fontSize: 17,
        color: "#81007F",
    },
    submodalText: {
        fontFamily: 'Ubuntu-Regular',
        fontSize: 15,
        color: '#a0a0a0'
    },
    header: {
        fontFamily: 'Ubuntu-Bold',
        color: "#81007F",
        fontSize: 17
    },
    dash: {
        width: 1,
        flexDirection: 'column',
        left: 35,
        marginTop: "15%",
    },
    locicon: {
        fontSize: 25,
        color: '#E5E5E5',
    },
    row: {
        flexDirection: "row"
    },
    view: {
        marginTop: "5%"
    },
    TitleText: {
        color: "#81007F",
        fontSize: 17,
        fontFamily: 'Ubuntu-Medium',
    },
    loginText2: {
        color: "#474747",
        fontSize: 16,
        fontFamily: 'Ubuntu-Regular',
        marginTop: "4%",
        marginLeft: "2%"
    },
    submitText1: {
        fontSize: 17,
        color: '#fff',
        marginLeft: "15%",
        fontFamily: 'Ubuntu-Medium',
    },
    submitText2: {
        fontSize: 16,
        color: '#81007F',
        marginRight: "8%",
        fontFamily: 'Ubuntu-Medium',

    },
    Button: {
        alignItems: "center",
        backgroundColor: '#81007F',
        // height: "8%",
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        flexDirection: "row",
        justifyContent: "space-between"
    },
    buttonContainer: {
        width: wp('18'),
        height: hp('4'),
        backgroundColor: '#ffff',
        margin: '3%',
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: "row",
    },
    item: {
        borderBottomWidth: 0.8,
        borderBottomColor: '#000',
        //height: '7%',
        width: "70%"
    },
    input: {
        fontFamily: 'ubuntu-Regular',
        fontSize: 18,
        marginTop: "1%"

    },
    buttonContainer1: {
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#F3F3F3',
        width: '70%',
        padding: '2%',
        borderRadius: 25,
        flexDirection: "row"
    },
    submitText: {
        fontFamily: 'Ubuntu-Regular',
        fontSize: 15,
        color: '#000000',
        marginLeft: "5%"
    },
})