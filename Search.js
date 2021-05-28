import React, { Component } from 'react';
import { StyleSheet, TouchableWithoutFeedback, Image, Text, View, FlatList } from 'react-native';
import { Container, Header, Content, Input, Item, Icon, Body, Right, List, ListItem, Left } from 'native-base';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import qs from 'qs';
const baseUrl = "http://demoworks.in/php/mypropertree/api/common/";
import AsyncStorage from '@react-native-community/async-storage';

export default class Search extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            showAlert: false,
            msg: '',
            text: ''
        }
        this.arrayholder = [];
    }
    componentDidMount() {
        this.getSearch();
    }
    goToHome = () => {
        this.props.navigation.navigate('Home');
    }
    getSearch = () => {
        fetch(baseUrl + 'get_allcities', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'content-type': 'application/x-www-form-urlencoded',
            },
            body: qs.stringify({

            })
        }).then((response) => response.json())
            .then((json) => {
                if (json.status == "valid") {
                    this.setState({ data: json.data, loading: false }, () => {
                        this.arrayholder = json.data;
                    });
                } else {
                    this.setState({ data: [], loading: false });
                }
            })
            .catch((error) => {
                this.setState({ showAlert: true, msg: 'Unknown error occured.Try later', loading: false });
            });
    }
    SearchFilterFunction = (text) => {
        const newData = this.arrayholder.filter(function (item) {
            const itemData = item.label_name ? item.label_name.toUpperCase() : ''.toUpperCase();
            const textData = text.toUpperCase();
            return itemData.indexOf(textData) > -1;
        });
        this.setState({
            data: newData,
            text: text,
        });
    }
    selectLocation = (lat, long, label_name, id) => {
        AsyncStorage.setItem('selectedcityid', id.toString());
        AsyncStorage.setItem('selectedcitysids', id.toString());
        AsyncStorage.setItem('label_name', label_name.toString());
        AsyncStorage.setItem('lat', lat.toString());
        AsyncStorage.setItem('long', long.toString());
        this.props.navigation.navigate('MainNavigator')
        // this.props.navigation.navigate(this.props.route.params.pageName.toString())
    }
    render() {
        return (
            <Container>
                <View style={{ flex: 1 }}>
                    <View>
                        <Item style={{ marginLeft: '3%' }}>
                            <Icon active name='search' type="FontAwesome" style={styles.locicon1} />
                            <Input
                                placeholder='Enter City here....'
                                style={styles.input}
                                onChangeText={((text) => { this.SearchFilterFunction(text) })}
                            />
                        </Item>
                    </View>
                    <FlatList
                        data={this.state.data}
                        renderItem={({ item }) => (
                            <TouchableWithoutFeedback onPress={() => this.selectLocation(item.latitude, item.longitude, item.label_name, item.id)}>
                                <ListItem>
                                    <View style={{ width: wp('65') }}>
                                        <Text style={styles.text}>{item.label_name}</Text>
                                    </View>
                                </ListItem>
                            </TouchableWithoutFeedback>
                        )}
                        contentContainerStyle={{ paddingBottom: hp('2'), backgroundColor: '#ffffff' }}
                    />
                </View>
            </Container>
        );
    }
}
const styles = StyleSheet.create({
    header: {
        backgroundColor: '#070707'
    },
    leftimage: {
        width: 20,
        height: 20
    },
    headerText: {
        fontFamily: 'Poppins-Regular',
        fontSize: 14,
        color: '#ffffff',
        paddingLeft: wp('2')
    },
    input: {
        fontFamily: 'Poppins-Regular',
        fontSize: 14,
        marginTop: '1%'
    },
    image: {
        width: 70,
        height: 70
    },
    row: {
        flexDirection: 'row'
    },
    locicon1: { fontSize: 20, color: '#81007F', },
})