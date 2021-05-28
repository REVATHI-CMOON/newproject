import React from 'react';
import { StyleSheet, Platform, PermissionsAndroid, View, Image, Text, TouchableWithoutFeedback, TouchableNativeFeedback, Picker, StatusBar, FlatList } from 'react-native';
import {
    Container,
    Content,
    ListItem,
    Icon,
    Toast,
    Card
} from 'native-base';
import qs from 'qs';
const baseUrl = "http://demoworks.in/php/mypropertree/api/common/";
import Geolocation from 'react-native-geolocation-service';
import AsyncStorage from '@react-native-community/async-storage';
import { MaterialIndicator } from 'react-native-indicators';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

export default class SelectLocation extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            type: '',
            latitude: '',
            longitude: '',
            isSelected: false,
            data: [],
            loading: true,
            selectedcityid: ""
        }
    }
    componentDidMount() {
        this.getLocations();
    }
    componentDidUpdate(prevProps) {
        AsyncStorage.getItem('selectedcityid').then((selectedcityid) => {
            if (JSON.stringify(prevProps.route.params.selectedcityid) != JSON.stringify(selectedcityid)) {
                this.setState({
                    selectedcityid: selectedcityid,
                })
            }
        })
    }
    goToHome = () => {
        this.props.navigation.navigate('Home')
    }
    goToChairs = () => {
        this.props.navigation.navigate('Chairs')
    }
    goToSearch = () => {
        this.props.navigation.navigate('Search', { pageName: this.props.route.params.pageName })
    }
    getCurrentLocation = async () => {
        this.setState({ loading: true });
        if (Platform.OS === 'ios') {
            const granted = Geolocation.requestAuthorization('always');
            this.callLocation();
        } else if (Platform.OS === 'android') {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, {
                    'title': 'Location Access Required',
                    'message': 'This App needs to Access your location'
                }
                )
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    this.callLocation();
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
    callLocation = () => {
        Geolocation.getCurrentPosition(
            (position) => {
                const currentLongitude = JSON.stringify(position.coords.longitude);
                const currentLatitude = JSON.stringify(position.coords.latitude);
                AsyncStorage.setItem('lat', currentLatitude);
                AsyncStorage.setItem('long', currentLongitude);
                AsyncStorage.setItem('selectedcityid', '');
                this.setState({ loading: false });
                Toast.show({
                    text: "Current location selected",
                    type: 'success',
                    duration: 2500,
                    textStyle: { fontFamily: 'Ubuntu-Regular', color: "#ffffff", textAlign: 'center' },
                })
                AsyncStorage.setItem('label_name', "Current Location");
                this.props.navigation.navigate('MainNavigator')
            },

            (error) => {
                // See error code charts below.
                console.log(error.code, error.message);
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
    }
    getLocations = () => {
        AsyncStorage.getItem('selectedcitysids').then((selectedcitysids) => {
            this.setState({ loading: true });
            fetch(baseUrl + 'city_related_locations', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'content-type': 'application/x-www-form-urlencoded',
                },
                body: qs.stringify({
                    city_id: selectedcitysids ? selectedcitysids : null
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
        });
    }
    // getLocations = () => {
    //     AsyncStorage.getItem('lat').then((lat) => {
    //         AsyncStorage.getItem('long').then((long) => {
    //             this.setState({ loading: true });
    //             fetch(baseUrl + 'popular_cities', {
    //                 method: 'POST',
    //                 headers: {
    //                     Accept: 'application/json',
    //                     'content-type': 'application/x-www-form-urlencoded',
    //                 },
    //                 body: qs.stringify({
    //                     // latitude: 18.106659,
    //                     // longitude: 83.395554
    //                     latitude: lat ? lat : null,
    //                     longitude: long ? long : null
    //                 })
    //             }).then((response) => response.json())
    //                 .then((json) => {
    //                     if (json.status == 'valid') {
    //                         this.setState({
    //                             data: json.data,
    //                             loading: false,
    //                         });
    //                     } else {
    //                         this.setState({ loading: false });
    //                     }
    //                 })
    //                 .catch((error) => {
    //                     this.setState({ loading: false });
    //                 });
    //         });
    //     });
    // }
    setLocation = (currentLatitude, currentLongitude, name, id) => {
        this.setState({ selectedcityid: id })
        try {
            AsyncStorage.setItem('selectedcityid', id.toString());
            AsyncStorage.setItem('label_name', name.toString());
            AsyncStorage.setItem('lat', currentLatitude.toString());
            AsyncStorage.setItem('long', currentLongitude.toString());
            this.props.navigation.navigate('MainNavigator')
        } catch (e) {
            console.log(e)
        }
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
                <View style={{ marginTop: "3%", marginLeft: "3%", }}>
                    <View style={{ flexDirection: "row", }}>
                        <TouchableWithoutFeedback onPress={this.goToHome}>
                            <Image source={require('../assets/back_icon.png')} resizeMode='contain' />
                        </TouchableWithoutFeedback>
                        <Text style={styles.headerText}>Select Location</Text>
                    </View>
                </View>
                <View style={{ borderBottomWidth: 0.5, marginTop: "3%", elevation: 1, borderBottomColor: "#F0F0F0" }}></View>
                <Content>
                    <Text style={styles.Title}>
                        Looking to Rent in
                    </Text>
                    <TouchableWithoutFeedback onPress={this.goToSearch}>
                        <Card style={styles.item}>
                            <View style={styles.wishlist1}>
                                <Icon active name='map-marker' type="FontAwesome" style={{ fontSize: 15, color: '#81007F', }} />
                            </View>
                            {/* <Image source={require('../assets/location_search.png')} style={styles.menuImage} /> */}
                            <Text style={styles.locationtext}>Search for your Location.</Text>
                        </Card>
                    </TouchableWithoutFeedback>
                    <View style={styles.row}>
                        <Text style={styles.Title1}>
                            Use my current location
                        </Text>
                        <TouchableWithoutFeedback onPress={this.getCurrentLocation}>
                            {/* <Icon active name='location' type="FontAwesome" style={styles.image} /> */}
                            <Image source={require('../assets/current_location.png')} style={styles.image} />
                            {/* <Image source={require('../assets/current_location.png')} style={styles.image} /> */}
                        </TouchableWithoutFeedback>
                    </View>
                    <View style={styles.popular}>
                        <Text style={styles.popularTitle}>
                            Popular Area
                        </Text>
                        <FlatList
                            style={styles.loclist}
                            data={this.state.data}
                            renderItem={({ item, index }) =>
                            (
                                <TouchableWithoutFeedback onPress={() => this.setState({ isSelected: !this.state.isSelected }, this.setLocation(item.latitude, item.longitude, item.name, item.id))}>
                                    <ListItem key={item.id} style={{ justifyContent: "space-between" }}>
                                        <Text style={styles.notificationText}>{item.name}</Text>
                                        <Icon active name={(this.state.isSelected == item.id || this.state.selectedcityid == item.id) ? 'dot-circle-o' : 'circle-o'} type="FontAwesome" style={{ fontSize: 22, color: '#81007F' }} onPress={() => this.setState({ isSelected: !this.state.isSelected }, this.setLocation(item.latitude, item.longitude, item.name, item.id))} />
                                    </ListItem>
                                </TouchableWithoutFeedback>
                            )}
                            ListEmptyComponent={this.ListEmptyView}
                            keyExtractor={index => index}
                        />
                    </View>
                </Content>
            </Container>
        )
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
    Title: {
        marginTop: "2%",
        marginLeft: "6%",
        fontFamily: 'Ubuntu-Regular',
        fontSize: 15,
        color: '#5C5C5C',
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
    item: {
        marginLeft: "4%",
        marginRight: "4%",
        // elevation: 3,
        // borderWidth: 0.2,
        // borderColor: "#fff",
        borderRadius: 8,
        flexDirection: "row",
        alignItems: "center",
        padding: 1,
        marginTop: "2%",
        height: hp('6')
    },
    locationtext: {
        textAlign: "center",
        marginLeft: "5%",
        fontSize: 17,
        fontFamily: 'Ubuntu-Regular',
    },
    menuImage: {
        width: 50,
        height: 50,
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between"
    },
    locicon: { fontSize: 25, color: '#E1E1E1', },
    locicon1: { fontSize: 25, color: '#81007F', },
    image: {
        marginTop: "2%",
        marginRight: "7%",
        marginBottom: "4%",
        color: "#81007F",
        fontSize: 15
    },
    Title1: {
        marginTop: "2%",
        marginLeft: "6%",
        fontFamily: 'Ubuntu-Medium',
        fontSize: 16,
        color: '#81007F',
    },
    popular: {
        backgroundColor: '#81007F',
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
    },
    popularTitle: {
        marginTop: "3%",
        marginLeft: "6%",
        fontFamily: 'Ubuntu-Bold',
        fontSize: 18,
        color: '#fff',
        marginBottom: "2%"
    },
    loclist: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
    },
    locationareaText: {
        borderBottomWidth: 0.5,
        marginTop: "4%",
    },
    notificationText: {
        fontFamily: 'Ubuntu-Light',
        fontSize: 13,
        color: '#000',
    },
})