import React from 'react';
import { StyleSheet, View, Image, Text, TouchableWithoutFeedback, TouchableNativeFeedback, TextInput, Dimensions, StatusBar } from 'react-native';
import {
    Container,
    Content,
    Header,
    Left,
    Right,
    Body,
} from 'native-base';
import Carousel, { ParallaxImage, Pagination } from 'react-native-snap-carousel';
const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

export default class ConstructionMaterials extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            images: [
                {
                    illustration: 'data:image/png;base64,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',
                },
                {
                    illustration: 'https://img1.exportersindia.com/product_images/bc-full/dir_162/4857822/3d-false-ceiling-interior-designing-1502943893-3222565.jpeg',
                },
                {
                    illustration: 'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcRergGQS_Mj3uYBgHqzGL16V31J-90B0suWbg&usqp=CAU',
                },
                {
                    illustration: 'https://i.imgur.com/MABUbpDl.jpg',
                },
            ],
        }
    }
    goToHome = () => {
        this.props.navigation.navigate('Home')
    }
    goToView = () => {
        this.props.navigation.navigate('ConstructionDetails')
    }
    _renderItem = ({ item }, parallaxProps) => {
        return (
            <View style={styles.parimage}>
                <ParallaxImage
                    source={{ uri: item.illustration }}
                    containerStyle={styles.imageContainer}
                    style={styles.cimage}
                    {...parallaxProps}
                />
            </View>
        );
    };
    render() {
        return (
            <Container>
                <StatusBar backgroundColor='#fff' barStyle="dark-content" />
                <View style={{ marginTop: "3%", marginLeft: "3%", }}>
                    <View style={{ flexDirection: "row", }}>
                        <TouchableWithoutFeedback onPress={this.goToHome}>
                            <Image source={require('../assets/back_icon.png')} resizeMode='contain' />
                        </TouchableWithoutFeedback>
                        <Text style={styles.headerText}>Construction Materials</Text>
                    </View>
                </View>
                <View style={{ borderBottomWidth: 0.5, marginTop: "3%", elevation: 1, borderBottomColor: "#F0F0F0" }}></View>
                <Content>
                    <View style={styles.Carousel}>
                        <Carousel
                            sliderWidth={deviceWidth}
                            sliderHeight={deviceHeight}
                            itemWidth={deviceWidth - 50}
                            data={this.state.images}
                            renderItem={this._renderItem}
                            hasParallaxImages={true}
                            onSnapToItem={index => this.setState({ activeSlide: index })}
                            loop={true}
                            autoplay={true}
                        />
                    </View>
                    <View>
                        <Text style={styles.title}>Top Listings</Text>
                    </View>
                    <TouchableWithoutFeedback onPress={this.goToView}>
                        <View style={styles.imageView}>
                            <View>
                                <Image source={require('../assets/house1.jpg')} resizeMode="cover" style={styles.image} />
                            </View>

                            <View>
                                <Text style={styles.Text}>
                                    Godrej Interio
                        </Text>
                                <View style={styles.row}>
                                    <Image source={require('../assets/location.png')} resizeMode="contain" style={styles.locationImage} />
                                    <Text style={styles.Text1}>
                                        43-5-205,2nd Floor,
                        </Text>
                                </View>
                                <Text style={styles.Text2}>
                                    Railway...
                        </Text>
                                <View style={styles.row}>
                                    <TouchableWithoutFeedback onPress={this.goToLogin}>
                                        <View style={styles.buttonContainer}>
                                            <Text style={styles.buttonText}>Contact</Text>
                                        </View>
                                    </TouchableWithoutFeedback>
                                </View>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                    <View style={styles.imageView}>
                        <View>
                            <Image source={require('../assets/house2.jpg')} resizeMode="cover" style={styles.image} />
                        </View>

                        <View>
                            <Text style={styles.Text}>
                                Godrej Interio
                        </Text>
                            <View style={styles.row}>
                                <Image source={require('../assets/location.png')} resizeMode="contain" style={styles.locationImage} />
                                <Text style={styles.Text1}>
                                    43-5-205,2nd Floor,
                        </Text>
                            </View>
                            <Text style={styles.Text2}>
                                Railway...
                        </Text>
                            <View style={styles.row}>
                                <TouchableWithoutFeedback onPress={this.goToLogin}>
                                    <View style={styles.buttonContainer}>
                                        <Text style={styles.buttonText}>Contact</Text>
                                    </View>
                                </TouchableWithoutFeedback>
                            </View>
                        </View>
                    </View>
                    <View style={styles.imageView}>
                        <View>
                            <Image source={require('../assets/house1.jpg')} resizeMode="cover" style={styles.image} />
                        </View>

                        <View>
                            <Text style={styles.Text}>
                                Godrej Interio
                        </Text>
                            <View style={styles.row}>
                                <Image source={require('../assets/location.png')} resizeMode="contain" style={styles.locationImage} />
                                <Text style={styles.Text1}>
                                    43-5-205,2nd Floor,
                        </Text>
                            </View>
                            <Text style={styles.Text2}>
                                Railway...
                        </Text>
                            <View style={styles.row}>
                                <TouchableWithoutFeedback onPress={this.goToLogin}>
                                    <View style={styles.buttonContainer}>
                                        <Text style={styles.buttonText}>Contact</Text>
                                    </View>
                                </TouchableWithoutFeedback>
                            </View>
                        </View>
                    </View>
                    <View style={styles.imageView}>
                        <View>
                            <Image source={require('../assets/house2.jpg')} resizeMode="cover" style={styles.image} />
                        </View>

                        <View>
                            <Text style={styles.Text}>
                                Godrej Interio
                        </Text>
                            <View style={styles.row}>
                                <Image source={require('../assets/location.png')} resizeMode="contain" style={styles.locationImage} />
                                <Text style={styles.Text1}>
                                    43-5-205,2nd Floor,
                        </Text>
                            </View>
                            <Text style={styles.Text2}>
                                Railway...
                        </Text>
                            <View style={styles.row}>
                                <TouchableWithoutFeedback onPress={this.goToLogin}>
                                    <View style={styles.buttonContainer}>
                                        <Text style={styles.buttonText}>Contact</Text>
                                    </View>
                                </TouchableWithoutFeedback>
                            </View>
                        </View>
                    </View>
                    <View style={styles.imageView}>
                        <View>
                            <Image source={require('../assets/house1.jpg')} resizeMode="cover" style={styles.image} />
                        </View>

                        <View>
                            <Text style={styles.Text}>
                                Godrej Interio
                        </Text>
                            <View style={styles.row}>
                                <Image source={require('../assets/location.png')} resizeMode="contain" style={styles.locationImage} />
                                <Text style={styles.Text1}>
                                    43-5-205,2nd Floor,
                        </Text>
                            </View>
                            <Text style={styles.Text2}>
                                Railway...
                        </Text>
                            <View style={styles.row}>
                                <TouchableWithoutFeedback onPress={this.goToLogin}>
                                    <View style={styles.buttonContainer}>
                                        <Text style={styles.buttonText}>Contact</Text>
                                    </View>
                                </TouchableWithoutFeedback>
                            </View>
                        </View>
                    </View>
                    <View style={{ marginBottom: "3%" }}></View>
                </Content>
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
        marginTop: "3%",
    },
    title: {
        color: "#171717",
        fontSize: 17,
        fontFamily: "Ubuntu-Medium",
        marginLeft: "7%",
        marginTop: "1%",
        marginBottom: "1%"
    },
    imageView: {
        flexDirection: "row",
        padding: 7
    },
    image: {
        height: 85,
        width: 120,
        borderRadius: 10,
        marginLeft: "12%"
    },
    buttonContainer: {
        width: wp('18'),
        height: hp('4'),
        backgroundColor: "#81007F",
        margin: '2%',
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonText: {
        fontFamily: "Ubuntu-Medium",
        fontSize: 12,
        color: "#fff"
    },
    Text: {
        marginBottom: "1%",
        fontFamily: "Ubuntu-Regular",
    },
    Text1: {
        color: "#000",
        fontSize: 12,
        marginTop: "1%",
        fontFamily: "Ubuntu-Regular",
    },
    Text2: {
        color: "#000",
        fontSize: 12,
        marginLeft: "8%",
        fontFamily: 'ubuntu',
    },
    locationImage: {
        marginTop: "3%",
        margin: "1%"
    },
    row: {
        flexDirection: "row"
    },
})