import React, { Component } from 'react';
import { View, Text, StyleSheet, PermissionsAndroid, Platform } from 'react-native';
import { Toast } from 'native-base'
import MapView from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
export default class MapWithMarker extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            region: {
                latitude: 0,
                longitude: 0,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
                isMapReady: false
            }
        }
    }
    componentDidMount() {
        this.getCurrentLocation()
    }
    getCurrentLocation = async () => {
        this.setState({ loading: true });
        if (Platform.OS == "android") {
            var that = this;
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, {
                    'title': 'Location Access Required',
                    'message': 'This App needs to Access your location'
                }
                )
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    //To Check, If Permission is granted
                    that.callLocation(that);
                } else {
                    alert("Permission Denied");
                }
                this.setState({ loading: false });
            } catch (err) {
                alert("err", err);
                console.warn(err)
                this.setState({ loading: false });
            }
        } else if (Platform.OS == "ios") {
            const granted = Geolocation.requestAuthorization('always');
            this.callLocation();
            this.setState({ loading: false });
        }

    }
    callLocation = (that) => {
        Geolocation.getCurrentPosition(
            (position) => {
                // const currentLongitude = position.coords.longitude;
                // const currentLatitude = position.coords.latitude;
                const currentLongitude = this.props.route.params.citylongitude;
                const currentLatitude = this.props.route.params.citylatitude;

                var obj = {
                    latitude: parseFloat(currentLatitude),
                    longitude: parseFloat(currentLongitude),
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }
                this.setState({ region: obj })
            },
            (error) => {
                // See error code charts below.
                console.log(error.code, error.message);
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
    }
    onMapPress = (e) => {
        const latitude = e.nativeEvent.coordinate.latitude;
        const longitude = e.nativeEvent.coordinate.longitude;
        var obj = {
            latitude: latitude,
            longitude: longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421
        }
        this.setState({
            region: obj
        }, () => { this.props.navigation.navigate('Step2', { latitude: latitude, longitude: longitude }) });
        Toast.show({
            text: "Location selected successfully",
            duration: 2000,
            type: 'success',
            textStyle: { fontFamily: 'Ubuntu-Regular', color: "#ffffff", textAlign: 'center' },
        })
    }
    onMapLayout = () => {
        this.setState({ isMapReady: true });
    }
    render() {
        return (
            <MapView
                onPress={e => this.onMapPress(e)}
                style={styles.map}
                region={this.state.region}
                onLayout={this.onMapLayout}
            >
                {
                    this.state.isMapReady ?
                        <MapView.Marker
                            title={"Your location"}
                            coordinate={{
                                latitude: this.state.region.latitude,
                                longitude: this.state.region.longitude
                            }} />
                        :
                        null
                }
            </MapView>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    map: {
        flex: 1,
    }
})

{/*   <MapView.Circle
                            center={{
                                latitude: this.state.region.latitude,
                                longitude: this.state.region.longitude
                            }}
                            radius={2000}
                            strokeWidth={2}
                            strokeColor="#3399ff"
                            fillColor="#80bfff"
                        />*/}