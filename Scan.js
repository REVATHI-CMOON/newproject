import React from 'react';
import { StyleSheet, Linking, View, Image, Text, TouchableWithoutFeedback, Alert, TouchableNativeFeedback, TouchableOpacity, Dimensions, StatusBar } from 'react-native';
import {
    Container,
    Content,
    Header,
    Left,
    Right,
    Card

} from 'native-base';
import { ProgressButton } from 'react-native-progress-button';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { QRScannerView } from 'react-native-qrcode-scanner-view';
export default class Scan extends React.Component {
    constructor(props) {
        super(props);
    }
    onSuccess = e => {
        console.log(e, 'error')
    };
    ifScanned = e => {
        this.props.navigation.navigate("Home", { data: e.data })
        // Linking.openURL(e.data).catch(err =>
        //     Alert.alert('Invalid QrCode', e.data)
        // );
    };
    goToHome = () => {
        this.props.navigation.navigate('Home')
    }

    renderTitleBar = () => <View><View style={styles.header}>
        <TouchableWithoutFeedback onPress={this.goToHome}>
            <View>
                <Image source={require('../assets/back_white.png')} style={styles.leftimage} resizeMode="contain" />
            </View>
        </TouchableWithoutFeedback>
    </View>

        <View style={styles.content}>
            <Text style={styles.headerText}>
                Scan QR Code
    </Text>
            <Text style={styles.headerText1}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
    </Text>
        </View></View>

    renderMenu = () => <TouchableWithoutFeedback onPress={this.handleLogin}>
        <View style={styles.button}>
            <View style={styles.buttonContainer}>
                <Text style={styles.submitText}>Scanning....</Text>
            </View>
        </View>
    </TouchableWithoutFeedback>
    renderImage = () => {
        <Image source={require('../assets/download.png')} style={styles.leftimage} resizeMode="contain" />
    }
    barcodeReceived = (e) => {
        Linking.openURL(e.data).catch(err =>
            Alert.alert('Invalid QrCode', e.data)
        );
    };
    render() {
        return (
            <Container>
                <StatusBar backgroundColor="#81007F" />
                <View style={{ flex: 1 }}>
                    <QRScannerView
                        onScanResult={this.barcodeReceived}
                        renderHeaderView={this.renderTitleBar}
                        renderFooterView={this.renderMenu}
                        scanBarAnimateReverse={true}
                        hintText={false}
                        cornerStyle={{ borderColor: '#000' }}
                        scanBarStyle={{ backgroundColor: '#81007F' }}
                        maskColor='#fff'
                    />
                </View>
                {/* 
                <View style={styles.header}>
                    <TouchableNativeFeedback onPress={this.goToHome}>
                        <View>
                            <Image source={require('../assets/back_white.png')} style={styles.leftimage} resizeMode="contain" />
                        </View>
                    </TouchableNativeFeedback>
                </View>

                <View style={styles.content}>
                    <Text style={styles.headerText}>
                        Scan QR Code
                    </Text>
                    <Text style={styles.headerText1}>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                    </Text>
                </View>

                <View style={{ height: hp('55'), marginTop: hp('1') }}>
                    <QRCodeScanner
                        containerStyle={{ height: hp('55') }}
                        onRead={this.ifScanned}
                        reactivate={true}
                        permissionDialogMessage="Need Permissions to access Camera"
                        reactivateTimeout={10}
                        showMarker={true}
                        markerStyle={{ borderColor: "#fff", borderRadius: 10 }}
                    />
                </View>
                <TouchableWithoutFeedback onPress={this.handleLogin}>
                    <View style={styles.button}>
                        <View style={styles.buttonContainer}>
                            <Text style={styles.submitText}>Scanning....</Text>
                        </View>
                    </View>
                </TouchableWithoutFeedback> */}

            </Container>
        )
    }
}
const styles = StyleSheet.create({
    header: {
        backgroundColor: "#81007F",
        borderBottomWidth: 0,

    },
    headerText: {
        color: "#fff",
        fontSize: 25,
        textAlign: "center",
        marginTop: "1%",
        fontFamily: 'Ubuntu-Bold'
    },
    buttonText: {
        fontSize: 21,
        color: 'rgb(0,122,255)'
    },
    buttonTouchable: {
        padding: 16
    },
    headerText1: {
        color: "#fff",
        fontSize: 15,
        fontFamily: 'Ubuntu-Medium',
        textAlign: "center",
        marginLeft: "8%",
        marginRight: "8%",
        marginTop: "3%",
        lineHeight: 25,
        marginBottom: "1%"

    },
    content: {
        backgroundColor: "#81007F",
        borderBottomLeftRadius: 40,
        borderBottomRightRadius: 40,
    },
    leftimage: {
        marginTop: "3%",
        marginLeft: "5%",
    },
    image: {
        alignItems: "center",
        justifyContent: "center",
        width: 350,
        height: 250,
        marginTop: "15%",
        marginLeft: "5%",
        marginBottom: "5%"
    },
    buttonContainer: {
        backgroundColor: "#81007F",
        width: '68%',
        padding: '5%',
        borderRadius: 40
    },
    submitText: {
        fontFamily: 'Ubuntu-Medium',
        fontSize: 16,
        color: '#fff',

    },
    button: {
        marginBottom: hp('2'), alignItems: "center", justifyContent: "center", marginTop: hp('1')
    }
})