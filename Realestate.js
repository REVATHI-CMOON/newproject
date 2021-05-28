import React from 'react';
import { StyleSheet, View, Image, FlatList, Text, TouchableWithoutFeedback, TouchableNativeFeedback, TextInput, Dimensions, Linking, ScrollView } from 'react-native';
import { Container, Content, Footer, Item, Input, Left, Right, List, ListItem, Picker, Body, Toast, Switch, Icon, Drawer } from 'native-base';
import SideBar from './Sidebar';
import CustomBottomMenu from './CustomBottomMenu';
const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;
const imgHeight = deviceHeight / 7 > 110 ? deviceHeight / 9 : 110;
const imgHeight1 = deviceHeight / 1 > 110 ? deviceHeight / 9 : 110;
import AsyncStorage from '@react-native-community/async-storage';
import qs from 'qs';
import { MaterialIndicator } from 'react-native-indicators';
const baseUrl = "http://demoworks.in/php/mypropertree/api/common/";
import Carousel, { ParallaxImage, Pagination } from 'react-native-snap-carousel';
import Modal from 'react-native-modal';
import { SliderBox } from 'react-native-image-slider-box';
import FastImage from 'react-native-fast-image';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
export default class Realestate extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            data: [],
            builders: [],
            projects: [],
            ventures: [],
            slider_image: [],
            showModal: false,
            showModal1: false,
        }
    }
    componentDidMount() {
        AsyncStorage.getItem('lat').then((lat) => {
            AsyncStorage.getItem('long').then((long) => {
                AsyncStorage.getItem('selectedcitysids').then((selectedcitysids) => {
                    this.getSubtypes(lat, long, selectedcitysids)
                });
            });
        });
        setTimeout(() => { this.setState({ loading: false }) }, 2000)
    }
    closeDrawer = () => {
        this._drawer._root.close();
    };
    openDrawer = () => {
        this._drawer._root.open();
    };
    closeModel = () => {
        this.setState({ showModal: false })
    }
    closeModel1 = () => {
        this.setState({ showModal1: false })
    }
    goToNotifications = () => {
        this.props.navigation.navigate('Notifications');
    }
    goToLands = (id) => {
        this.setState({ showModal: false })
        this.props.navigation.navigate('Villas', { property_type: this.props.route.params.property_type, property_subtype: id, property_subtype_name: id ? "Residential Lands" : "Agriculture Lands", backscreen: 'Realestate' })
    }
    goToCommercials = (id) => {
        this.setState({ showModal1: false })
        this.props.navigation.navigate('Villas', { property_type: this.props.route.params.property_type, property_subtype: id, property_subtype_name: id ? "Indipendent Shops/Malls" : "Ware Houses", backscreen: 'Realestate' })
    }
    goToDetails = (id, name) => {
        if (id == 1000) {
            this.setState({ showModal: true })
        }
        else if (id == 2000) {
            this.setState({ showModal1: true })
        }
        else {
            this.props.navigation.navigate('Villas', { property_type: this.props.route.params.property_type, property_subtype: id, property_subtype_name: name, backscreen: 'Realestate' })
        }
    }
    closeDrawer = () => {
        this._drawer._root.close();
    };
    _renderItem = ({ item }, parallaxProps) => {
        return (
            <View style={styles.parimage}>
                <ParallaxImage
                    source={{ uri: item.image }}
                    containerStyle={styles.imageContainer}
                    style={styles.image}
                    {...parallaxProps}
                />
            </View>
        );
    };
    getSubtypes = (lat, long, selectedcitysids) => {
        this.setState({ loading: true });
        fetch(baseUrl + 'get_nearby_subtypes_list', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'content-type': 'application/x-www-form-urlencoded',
            },
            body: qs.stringify({
                property_type: this.props.route.params.property_type,
                latitude: lat,
                longitude: long,
                city_id: selectedcitysids
            })
        }).then((response) => response.json())
            .then((json) => {
                if (json.status == 'valid') {
                    let tempArr = [];
                    var property_gallery = json.slider_ads;
                    property_gallery.map((item, index) => {
                        tempArr.push(item.image);
                    });
                    this.setState({
                        data: json.data,
                        builders: json.builders,
                        projects: json.projects,
                        ventures: json.ventures,
                        loading: false,
                        slider_image: tempArr
                    })
                } else {
                    this.setState({ loading: false });
                }
            })
            .catch((error) => {
                this.setState({ loading: false });
            });
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
            <Drawer
                ref={(ref) => {
                    this._drawer = ref;
                }}
                content={<SideBar navigation={this.props.navigation} closeDrawer={this.closeDrawer} />}>
                <Container style={{ backgroundColor: '#fff' }}>
                    <View>
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
                                        <Text style={styles.modalheader}>Select Lands</Text>
                                        <Text style={styles.submodalText}>Select one of the options below</Text>
                                    </View>
                                    <List>
                                        <TouchableWithoutFeedback onPress={() => { this.goToLands(74) }}>
                                            <ListItem>
                                                <Body style={{ flexDirection: 'row' }}>
                                                    <View style={{ marginLeft: '3%' }}>
                                                        <Text style={styles.header}>Residential Lands</Text>
                                                    </View>
                                                </Body>
                                                <Right>
                                                    <Icon name="angle-right" type="FontAwesome" />
                                                </Right>
                                            </ListItem>
                                        </TouchableWithoutFeedback>
                                        <TouchableWithoutFeedback onPress={() => { this.goToLands(117) }}>
                                            <ListItem>
                                                <Body style={{ flexDirection: 'row' }}>
                                                    <View style={{ marginLeft: '3%' }}>
                                                        <Text style={styles.header}>Agriculture Lands</Text>
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
                    </View>
                    <View>
                        <Modal
                            isVisible={this.state.showModal1}
                        >
                            <View style={{ flex: 1, justifyContent: 'center' }}>
                                <View style={styles.modalView}>
                                    <View style={{ position: 'absolute', right: 7, top: 7 }}>
                                        <TouchableWithoutFeedback onPress={this.closeModel1}>
                                            <Image source={require('../assets/close_icon.png')} style={{ width: 60, height: 60, }} />
                                        </TouchableWithoutFeedback>
                                    </View>
                                    <View style={{ padding: '5%' }}>
                                        <Text style={styles.modalheader}>Select Commercials</Text>
                                        <Text style={styles.submodalText}>Select one of the options below</Text>
                                    </View>
                                    <List>
                                        <TouchableWithoutFeedback onPress={() => { this.goToCommercials(120) }}>
                                            <ListItem>
                                                <Body style={{ flexDirection: 'row' }}>
                                                    <View style={{ marginLeft: '3%' }}>
                                                        <Text style={styles.header}>Indipendent Shops/Malls</Text>
                                                    </View>
                                                </Body>
                                                <Right>
                                                    <Icon name="angle-right" type="FontAwesome" />
                                                </Right>
                                            </ListItem>
                                        </TouchableWithoutFeedback>
                                        <TouchableWithoutFeedback onPress={() => { this.goToCommercials(119) }}>
                                            <ListItem>
                                                <Body style={{ flexDirection: 'row' }}>
                                                    <View style={{ marginLeft: '3%' }}>
                                                        <Text style={styles.header}>Ware Houses</Text>
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
                    </View>
                    <View style={{ marginTop: "3%", marginLeft: "3%", marginBottom: "3%" }}>
                        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                            <TouchableWithoutFeedback onPress={this.openDrawer}>
                                <View style={styles.center}>
                                    <Image
                                        source={require('../assets/menu_icon.png')}
                                        style={styles.leftimage}
                                    />
                                    <Text style={styles.mainheader}>Real Estates</Text>
                                </View>
                            </TouchableWithoutFeedback>
                            <View>
                                <TouchableWithoutFeedback onPress={this.goToNotifications}>
                                    <Image source={require('../assets/notification_icon.png')} style={styles.rightimage} resizeMode="contain" />
                                </TouchableWithoutFeedback>
                            </View>
                        </View>
                    </View>
                    <ScrollView showsVerticalScrollIndicator={false} style={{ padding: 10 }}>
                        <View style={{ marginTop: hp('0.2') }}>
                            <SliderBox
                                ImageComponent={FastImage}
                                images={this.state.slider_image}
                                ImageComponentStyle={{ width: '98%', height: 230 }}
                                dotColor="#81007F"
                                resizeMode={'stretch'}
                                autoplay
                                circleLoop
                                imageLoadingColor="#81007F"
                            />
                        </View>
                        {this.state.data.length !== 0 ?
                            <View>
                                <Text style={styles.Title}>
                                    Property Types
                                </Text>
                                <ScrollView
                                    horizontal={true}
                                    showsHorizontalScrollIndicator={false}
                                    style={{ marginLeft: "5%" }}>
                                    {this.state.data.map((item1, index) => (
                                        <TouchableWithoutFeedback onPress={() => { this.goToDetails(item1.id, item1.name) }}>
                                            <View style={styles.margin14}>
                                                <Image
                                                    source={{ uri: item1.image }}
                                                    key={index}
                                                    style={styles.contestImg}
                                                />
                                                <Text numberOfLines={1} ellipsizeMode="tail" style={styles.imagetext}>{item1.name}</Text>
                                            </View>
                                        </TouchableWithoutFeedback>
                                    ))}
                                </ScrollView>
                            </View>
                            :
                            null
                        }
                        {
                            this.state.builders.length !== 0 &&
                            <View>
                                <Text style={styles.Title}>
                                    Top Builders
                                </Text>
                                <ScrollView
                                    horizontal={true}
                                    showsHorizontalScrollIndicator={false}
                                    style={{ marginLeft: "5%" }}>
                                    {this.state.builders.map((item1, index) => (
                                        <TouchableWithoutFeedback onPress={() => Linking.openURL(item1.url)}>
                                            <View style={styles.margin14}>
                                                <Image
                                                    source={{ uri: item1.image }}
                                                    key={index}
                                                    style={styles.contestImg1}
                                                />
                                            </View>
                                        </TouchableWithoutFeedback>
                                    ))}
                                </ScrollView>
                            </View>
                        }
                        {
                            this.state.projects.length !== 0 &&
                            <View>
                                <Text style={styles.Title}>
                                    Top Projects
                                </Text>

                                <ScrollView
                                    horizontal={true}
                                    showsHorizontalScrollIndicator={false}
                                    style={{ marginLeft: "5%" }}>
                                    {this.state.projects.map((item1, index) => (
                                        <TouchableWithoutFeedback onPress={() => Linking.openURL(item1.url)}>
                                            <View style={styles.margin14}>
                                                <Image
                                                    source={{ uri: item1.image }}
                                                    key={index}
                                                    style={styles.contestImg1}
                                                />
                                            </View>
                                        </TouchableWithoutFeedback>
                                    ))}
                                </ScrollView>
                            </View>
                        }
                        {
                            this.state.ventures.length !== 0 &&
                            <View>
                                <Text style={styles.Title}>
                                    Top Ventures
                                </Text>

                                <ScrollView
                                    horizontal={true}
                                    showsHorizontalScrollIndicator={false}
                                    style={{ marginLeft: "5%" }}>
                                    {this.state.ventures.map((item1, index) => (
                                        <TouchableWithoutFeedback onPress={() => Linking.openURL(item1.url)}>
                                            <View style={styles.margin14}>
                                                <Image
                                                    source={{ uri: item1.image }}
                                                    key={index}
                                                    style={styles.contestImg1}
                                                />
                                            </View>
                                        </TouchableWithoutFeedback>
                                    ))}
                                </ScrollView>
                            </View>
                        }
                        <View style={{ marginBottom: "5%" }}></View>
                    </ScrollView>
                    <CustomBottomMenu navigation={this.props.navigation} />
                </Container>
            </Drawer>
        )

    }
}
const styles = StyleSheet.create({
    header: {
        backgroundColor: "#fff",
        borderBottomWidth: 0
    },
    headertitle: {
        color: "#000",
        fontSize: 17,
        fontFamily: 'Ubuntu-Bold',
    },
    mainheader: {
        color: "#000",
        fontSize: 17,
        fontFamily: 'Ubuntu-Bold',
        marginLeft: "8%"
    },
    center1: {
        // justifyContent: 'center',
        // alignItems: 'center',
        flexDirection: "row",
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
    leftimage: {
        width: 18,
        height: 18,
        marginLeft: "8%"
    },
    rightimage: {
        width: 18,
        height: 18,
        marginRight: "3%"
    },
    center: {
        flexDirection: "row",
    },
    image: {
        ...StyleSheet.absoluteFillObject,
        resizeMode: 'contain',
    },
    Carousel: {
        marginTop: "2%",
        height: (deviceHeight * 25) / 100,
        width: (deviceWidth)

    },
    imageContainer: {
        height: (deviceHeight * 25) / 100,
        width: (deviceWidth * 88) / 100,
        alignItems: 'center',
        justifyContent: "center",
        marginBottom: Platform.select({ ios: 0, android: 1 }),
        // borderRadius: 20,
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
    Title: {
        fontSize: 16,
        marginLeft: "5%",
        margin: "2%",
        fontFamily: 'Ubuntu-Bold',
        marginTop: "4%"
    },
    margin14: {
        marginRight: 12,
        elevation: 3,
        borderRadius: 8,
        marginBottom: "1%",
        marginTop: "1%",
        backgroundColor: '#fff'
    },
    contestImg: {
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
        width: deviceWidth / 2,
        maxWidth: 130,
        resizeMode: 'cover',
        height: imgHeight,
        marginBottom: 5

    },
    contestImg1: {
        borderRadius: 6,
        width: deviceWidth / 2,
        maxWidth: 130,
        resizeMode: 'cover',
        height: imgHeight1,
    },
    imagetext: {
        fontSize: 13,
        fontFamily: 'Ubuntu-Light',
        textAlign: "center",
        marginBottom: 5,
        justifyContent: "center",
        maxWidth: 128
    }
})