import React, { Component } from 'react';
import { View, Image, TouchableWithoutFeedback, StyleSheet } from 'react-native';
import { Footer, FooterTab, Button, Text } from 'native-base';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Asyncstorage from '@react-native-community/async-storage';
export default class CustomBottomMenu extends Component {
    constructor(props) {
        super(props);
    }
    goToScan = () => {
        this.props.navigation.navigate('Scan')
    }
    // goToSearch = () => {
    //     this.props.navigation.navigate('Search')
    // }
    goToSearch = () => {
        this.props.navigation.navigate('Filter', { property_type: 1, selectedBuildingType: "", backscreen: "Home" })
    }
    goToWishlist = () => {
        this.props.navigation.navigate('Wishlist')
    }
    goToProfile = () => {
        this.props.navigation.navigate('Profile')
    }
    render() {
        return (
            <Footer style={styles.footer}>
                <FooterTab style={styles.FooterTab}>
                    {/* <TouchableWithoutFeedback onPress={this.goToScan}>
                        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                            <Image source={require('../assets/scan_icon.png')} resizeMode="contain" style={styles.menuImage} />
                            <Text style={styles.menu}>Scan</Text>
                        </View>
                    </TouchableWithoutFeedback> */}
                    <TouchableWithoutFeedback onPress={this.goToSearch}>
                        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                            <Image source={require('../assets/search_icon.png')} resizeMode="contain" style={styles.menuImage} />
                            <Text style={styles.menu}>Search</Text>
                        </View>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback onPress={this.goToWishlist}>
                        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                            <Image source={require('../assets/wishlist_icon.png')} resizeMode="contain" style={styles.menuImage} />
                            <Text style={styles.menu}>My Wishlist</Text>
                        </View>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback onPress={this.goToProfile}>
                        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                            <Image source={require('../assets/profile_icon.png')} resizeMode="contain" style={styles.menuImage} />
                            <Text style={styles.menu}>Profile</Text>
                        </View>
                    </TouchableWithoutFeedback>
                </FooterTab>
            </Footer>
        );
    }
}
const styles = StyleSheet.create({
    footer: {
        backgroundColor: '#fff',
    },
    FooterTab: {
        backgroundColor: '#fff',
        // paddingLeft: wp('3'),
        // paddingRight: wp('3'),
        borderTopStartRadius: 20,
        borderTopEndRadius: 20,
        elevation: 5,
        marginLeft: "2%",
        marginRight: "2%",
        alignItems: "center",
        justifyContent: "space-around"
    },
    menuImage: {
        width: 20,
        height: 20,
        marginTop: '1%'
    },
    menu: {
        fontFamily: "Ubuntu-Regular",
        fontSize: 12,
        color: '#000',
        textAlign: 'center',
        paddingTop: '1%'
    }
})