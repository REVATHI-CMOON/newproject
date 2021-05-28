import React, { Component } from 'react';
import { StyleSheet, TouchableNativeFeedback, Image, Text, View, StatusBar, FlatList, TouchableWithoutFeedback } from 'react-native';
import { Container, Header, Content, List, ListItem, Icon, Body, Right } from 'native-base';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
const baseUrl = "http://demoworks.in/php/mypropertree/api/dashboard/";
import qs from 'qs';
import AsyncStorage from '@react-native-community/async-storage';
import NoData from './NoData';
export default class Notifications extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            user_id: '',
            loading: true,
        }
    }
    goToHome = () => {
        this.props.navigation.navigate('Home');
    }
    componentDidMount() {

        AsyncStorage.getItem('user_id').then((user_id) => {
            this.getNotificatins(user_id);
            this.setState({
                user_id: user_id,
            });
        });
    }
    getNotificatins = (user_id) => {
        this.setState({ loading: true });
        fetch(baseUrl + 'notifications', {
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
    }
    render() {
        return (
            <Container style={styles.mainContainer}>
                <StatusBar backgroundColor='#fff' barStyle="dark-content" />
                <View style={{ marginTop: "3%", marginLeft: "3%", }}>
                    <View style={{ flexDirection: "row", }}>
                        <TouchableWithoutFeedback onPress={this.goToHome}>
                            <Image source={require('../assets/back_icon.png')} resizeMode='contain' />
                        </TouchableWithoutFeedback>
                        <Text style={styles.headerText}>Notifications</Text>
                    </View>
                </View>
                <View style={{ borderBottomWidth: 0.5, marginTop: "3%", elevation: 1, borderBottomColor: "#F0F0F0" }}></View>
                <Content>
                    <List>
                        <FlatList
                            data={this.state.data}
                            renderItem={({ item }) => (
                                <ListItem key={item.id}>
                                    <Body>
                                        <View style={{ flexDirection: 'row' }}>
                                            <Icon name="dot-circle-o" type="FontAwesome" style={{ color: '#000000', fontSize: 8, marginRight: wp('4'), marginTop: hp('1') }} />
                                            <View style={{ width: wp('88') }}>
                                                <Text style={styles.notificationText}>{item.description}</Text>
                                            </View>
                                        </View>
                                        <Text style={styles.date}>{item.created_date}</Text>
                                    </Body>
                                </ListItem>
                            )}
                            keyExtractor={item => item.id}
                            contentContainerStyle={{ paddingBottom: hp('5'), backgroundColor: '#ffffff' }}
                            ListEmptyComponent={<View style={{ marginTop: hp('45') }}>
                                <NoData />
                            </View>}
                        />
                    </List>
                </Content>
            </Container>
        );
    }
}
const styles = StyleSheet.create({
    mainContainer: {
        backgroundColor: '#ffff'
    },
    leftimage: {
        width: 20,
        height: 20
    },
    header: {
        backgroundColor: '#ffff'
    },
    headerText: {
        fontFamily: 'ubuntu',
        fontSize: 14,
        paddingLeft: wp('2')
    },
    notificationText: {
        fontFamily: 'ubuntu',
        fontSize: 13,
    },
    date: {
        fontFamily: 'ubuntu',
        fontSize: 10,
        marginLeft: wp('6'),
    }
})