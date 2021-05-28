import React from 'react';
import { StyleSheet, View, Image, Text, TouchableWithoutFeedback, TouchableNativeFeedback, FlatList, Dimensions, StatusBar } from 'react-native';
import {
    Container,
    Content,
    Header,
    Body,
    Right,

} from 'native-base';
import { MaterialIndicator } from 'react-native-indicators';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import qs from 'qs';
const baseUrl = "http://demoworks.in/php/mypropertree/api/Affiliate_marketing/";
import AsyncStorage from '@react-native-community/async-storage';
import Carousel, { ParallaxImage, Pagination } from 'react-native-snap-carousel';
const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;
import { SliderBox } from 'react-native-image-slider-box';
import FastImage from 'react-native-fast-image';
export default class Furniture extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            Data: [],
            loading: true,
            slider_image: [],
            type_name: ""
        }
    }
    componentDidMount() {
        setTimeout(() => {
            this.setState({ loading: false });
        }, 1000);
        AsyncStorage.getItem('selectedcitysids').then((selectedcitysids) => {
            this.getData(selectedcitysids)
        })
    }
    _renderItem = ({ item }, parallaxProps) => {
        return (
            <View style={styles.parimage}>
                <ParallaxImage
                    source={{ uri: item.image }}
                    containerStyle={styles.imageContainer}
                    style={styles.cimage}
                    {...parallaxProps}
                />
            </View>
        );
    };
    getData = (selectedcitysids) => {
        this.setState({ loading: true });
        fetch(baseUrl + 'categories', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'content-type': 'application/x-www-form-urlencoded',
            },
            body: qs.stringify({
                city_id: selectedcitysids,
                type: this.props.route.params.type
            })
        }).then((response) => response.json())
            .then((json) => {
                if (json.status == 'valid') {
                    let tempArr = [];
                    var property_gallery = json.slider_ads;
                    property_gallery.map((item, index) => {
                        tempArr.push(item.image);
                    });
                    var Data = json.data;
                    this.setState({
                        Data: Data,
                        slider_image: tempArr,
                        loading: false,
                        type_name: json.type_name
                    });
                } else {
                    this.setState({ loading: false });
                }
            })
            .catch((error) => {
                this.setState({ loading: false });
            });
    }
    goToHome = () => {
        this.props.navigation.navigate('Home')
    }
    goToChairs = (id) => {
        this.props.navigation.navigate('Chairs', { c_id: id })
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
            <Container style={{ backgroundColor: '#fff' }}>
                <StatusBar backgroundColor='#fff' barStyle="dark-content" />
                <View style={{ marginTop: "3%", marginLeft: "3%", }}>
                    <View style={{ flexDirection: "row", }}>
                        <TouchableWithoutFeedback onPress={this.goToHome}>
                            <Image source={require('../assets/back_icon.png')} resizeMode='contain' />
                        </TouchableWithoutFeedback>
                        <Text style={styles.headerText}> {this.state.type_name}</Text>
                    </View>
                </View>
                <View style={{ borderBottomWidth: 0.5, marginTop: "3%", elevation: 1, borderBottomColor: "#F0F0F0" }}></View>
                <Content style={{ padding: 10 }}>
                    <View style={{ marginTop: hp('0.2') }}>
                        <SliderBox
                            ImageComponent={FastImage}
                            images={this.state.slider_image}
                            ImageComponentStyle={{ width: '98%', height: 200 }}
                            dotColor="#81007F"
                            resizeMode={'stretch'}
                            autoplay
                            circleLoop
                            imageLoadingColor="#81007F"
                        />
                    </View>
                    <Text style={styles.Title}>
                        Popular Categories
                    </Text>
                    <View style={styles.flatView}>
                        {this.state.Data.map((item, key) =>
                            <View style={{ marginTop: 1, }}>
                                <TouchableWithoutFeedback onPress={() => this.goToChairs(item.id,)}>
                                    <View key={item.id}>
                                        <View>
                                            <Image source={{ uri: item.image }} resizeMode='cover' style={styles.servicesImage} />
                                            <Text style={styles.text1}>{item.name}</Text>
                                        </View>
                                    </View>
                                </TouchableWithoutFeedback>
                            </View>
                        )}
                    </View>
                    {/* <View>
                        <FlatList
                            data={this.state.Data}
                            numColumns={3}
                            style={{ margin: 5 }}
                            columnWrapperStyle={styles.flatlist}
                            renderItem={({ item }) =>
                                (
                                    <TouchableWithoutFeedback onPress={() => this.goToChairs(item.id,)}>
                                        <View key={item.id}>
                                            <View>
                                                <Image source={{ uri: item.image }} resizeMode='contain' style={styles.servicesImage} />
                                                <Text style={styles.text1}>{item.name}</Text>
                                            </View>
                                        </View>
                                    </TouchableWithoutFeedback>
                                )}
                            ListEmptyComponent={this.ListEmptyView}
                            keyExtractor={item => item.id}
                        />
                    </View> */}
                </Content>
                <View style={{ marginBottom: "3%" }}></View>
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
        marginLeft: "5%"

    },
    image: {
        width: "95%",
        height: 158,
        borderRadius: 10
    },
    imageContainer: {
        height: (deviceHeight * 25) / 100,
        width: (deviceWidth * 90) / 100,
        alignItems: 'center',
        justifyContent: "center",
        marginBottom: Platform.select({ ios: 0, android: 1 }),
        // borderRadius: 20,
    },
    cimage: {
        ...StyleSheet.absoluteFillObject,
        resizeMode: 'contain',
    },
    Carousel: {
        marginTop: "2%",
        height: (deviceHeight * 25) / 100,
        width: (deviceWidth)

    },
    flatlist: {
        flex: 1,
        justifyContent: "space-around",
        alignSelf: "center"
    },
    flatView: {
        // height: hp('50'),
        margin: wp('1'),
        justifyContent: "space-between",
        flexDirection: "row",
        flexWrap: "wrap",
        padding: wp('1')
        // paddingLeft: "2%"
    },
    text1: {
        fontSize: 10,
        fontFamily: "Ubuntu-Medium",
        alignSelf: "center",
        //alignItems: "center",
        // justifyContent: "center",
        textAlign: "center",
    },
    imagecontainer: {
        alignItems: "center",
        justifyContent: "center",
    },
    Title: {
        color: '#81007F',
        fontSize: 16,
        marginLeft: "5%",
        marginTop: "2%",
        fontFamily: 'Ubuntu-Bold',
    },
    view: {
        flexDirection: "row",
        justifyContent: 'space-evenly',
    },
    text2: {
        marginLeft: "20%",
        fontSize: 12,
    },
    servicesImage: {
        width: 105,
        height: 90,
        // margin: "3%",
        //resizeMode: 'contain',
        //marginLeft: "5%"
    },
    leftimage: {
        marginLeft: "7%"
    }

})