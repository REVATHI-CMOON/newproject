import React from 'react';
import { StyleSheet, View, Image, Text, TouchableWithoutFeedback, TouchableNativeFeedback, TextInput, Dimensions, StatusBar } from 'react-native';
import {
    Container,
    Content,
    Header,
    Left,
    Right,
    Body,
    Drawer,
    Icon,
    Textarea,
    Card, Item, Input, Toast,
} from 'native-base';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import CustomBottomMenu from './CustomBottomMenu';
import HTML from 'react-native-render-html';
import qs from 'qs';
const baseUrl = "http://demoworks.in/php/mypropertree/api/common/";

export default class AboutUs extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            description: ''
        }
    }
    componentDidMount() {
        this.getData();
    }
    goToHome = () => {
        this.props.navigation.navigate('Home')
    }
    getData = () => {
        this.setState({ loading: true });
        fetch(baseUrl + 'cms/1', {
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
                        description: json.data.description,
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
    render() {
        return (
            <Container style={{ backgroundColor: '#fff' }}>
                <StatusBar backgroundColor='#fff' barStyle="dark-content" />
                <View style={{ marginTop: "3%", marginLeft: "3%", }}>
                    <View style={{ flexDirection: "row", }}>
                        <TouchableWithoutFeedback onPress={this.goToHome}>
                            <Image source={require('../assets/back_icon.png')} resizeMode='contain' />
                        </TouchableWithoutFeedback>
                        <Text style={styles.headerText}>About Us</Text>
                    </View>
                </View>
                <View style={{ borderBottomWidth: 0.5, marginTop: "3%", elevation: 1, borderBottomColor: "#F0F0F0" }}></View>
                <Content contentContainerStyle={{ margin: '4%' }}>
                    <HTML html={this.state.description} baseFontStyle={styles.loginText2} />
                </Content>
                <CustomBottomMenu navigation={this.props.navigation} />
            </Container>
        )
    }
}
const styles = StyleSheet.create({
    header: {
        backgroundColor: "#fff",
        borderBottomWidth: 0
    },
    headerText: {
        color: "#000",
        fontSize: 17,
        fontFamily: 'Ubuntu-Bold',
        marginLeft: "8%"

    },
    loginText2: {
        fontFamily: 'Ubuntu-Regular',
        fontSize: 15,
        color: "#797979",
        textAlign: 'center',
        lineHeight: 25
    },
    leftimage: {
        marginLeft: "7%"
    }
})