import React from 'react';
import { StyleSheet, ScrollView, View, Image, Text, StatusBar, TouchableNativeFeedback, FlatList, Dimensions } from 'react-native';
import {
    Container,
    Content,
    Header,
    Left,
    Right,
    Card

} from 'native-base';
import Timeline from 'react-native-timeline-flatlist';
import Dash from 'react-native-dash';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

export default class ConstructionDetails extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }
    goToInterior = () => {
        this.props.navigation.navigate('ConstructionMaterials')
    }
    render() {
        return (
            <Container>
                <StatusBar translucent={true} backgroundColor={'transparent'} />
                <View style={styles.header}>
                    <View>
                        <Image source={require('../assets/sofa3.jpg')} style={styles.image} />
                        <TouchableWithoutFeedback onPress={this.goToInterior}>
                            <Image source={require('../assets/back_white.png')} style={styles.leftimage} resizeMode="contain" />
                        </TouchableWithoutFeedback>
                    </View>
                </View>
                <View style={styles.View}>
                    <View style={styles.like}>
                        <Image source={require('../assets/wishlist_green_icon.png')} resizeMode="contain" />
                        <Image source={require('../assets/share_icon.png')} resizeMode="contain" />
                    </View>
                    <View style={{ padding: 15 }}>
                        <Text style={styles.title}>Godrej Interio</Text>
                    </View>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View style={styles.row}>
                            <Dash style={styles.dash} dashColor="#C7C7C7" dashGap={3} />
                            <View>
                                <View style={styles.row}>
                                    <Image source={require('../assets/description_icon.png')} resizeMode="contain" style={styles.images} />
                                    <View>
                                        <Text style={styles.subtext}>Lorem Ipsum is simply dummy text  </Text>
                                        <Text style={styles.subtext}>and typesetting industry. Lorem </Text>
                                        <Text style={styles.subtext}>Lorem Ipsum has been the industry</Text>
                                    </View>
                                </View>
                                <View style={styles.row}>
                                    <Image source={require('../assets/phone_icon.png')} resizeMode="contain" style={styles.images} />
                                    <View>
                                        <Text style={styles.maintext1}>+91 9865741230</Text>

                                    </View>
                                </View>
                                <View style={styles.row}>
                                    <Image source={require('../assets/circle_location_icon.png')} resizeMode="contain" style={styles.images} />
                                    <View>
                                        <Text style={styles.subtext}>55-8-48,Seethammadhara ,Near</Text>
                                        <Text style={styles.subtext}>Balaji afaunction hall,H B Colony </Text>
                                        <Text style={styles.subtext}>Vishakhapatnam-530017</Text>
                                    </View>
                                </View>
                                <View style={styles.row}>
                                    <Image source={require('../assets/link_icon.png')} resizeMode="contain" style={styles.images} />
                                    <View>
                                        <Text style={styles.maintext1}>www.godrej.com</Text>
                                    </View>
                                </View>
                                <View style={styles.row}>
                                    <Image source={require('../assets/gallery_icon.png')} resizeMode="contain" style={styles.images} />
                                    <View style={{ padding: "2%" }}>
                                        <Text style={styles.maintext1}>Gallery</Text>
                                        <View style={styles.gallery}>
                                            <Image source={require('../assets/house2.jpg')} style={styles.icon3} />
                                            <Image source={require('../assets/housee.jpg')} style={styles.icon4} />
                                        </View>
                                        <View style={styles.gallery}>
                                            <Image source={require('../assets/house1.jpg')} style={styles.icon3} />
                                            <Image source={require('../assets/house3.jpg')} style={styles.icon4} />
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </View>
                        <View style={{ marginBottom: "3%" }}></View>
                    </ScrollView>

                </View>
                <View style={styles.Button}>
                    <Text style={styles.submitText}>Send Enquiry</Text>
                    <Image source={require('../assets/enquiry_icon.png')} style={styles.icon1} resizeMode="contain" />
                </View>
            </Container>

        )
    }
}
const styles = StyleSheet.create({
    header: {
        borderBottomWidth: 0,
    },
    image: {
        width: "100%",
        height: 250,
    },
    dash: {
        width: 1,
        flexDirection: 'column',
        left: 50,
        marginTop: "15%",
    },
    images: {
        marginLeft: "3%",
    },
    maintext1: {
        fontSize: 17,
        fontFamily: "Ubuntu-Regular",
        marginLeft: "3%",
        marginTop: "10%"
    },
    leftimage: {
        position: 'absolute',
        top: "15%",
        left: "3%"
    },
    subtext: {
        fontSize: 15,
        fontFamily: "Ubuntu-Regular",
        color: '#7D7D7D',
        marginLeft: "4%",
        marginTop: "3%"
    },
    row: {
        flexDirection: "row"
    },
    View: {
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        height: hp('70'),
        width: wp('100'),
        backgroundColor: "#fff",
        position: "absolute",
        top: "30%",
    },
    submitText: {
        fontFamily: "Ubuntu-Medium",
        fontSize: 18,
        color: '#fff',
        marginLeft: "4%"
    },
    title: {
        fontFamily: "Ubuntu-Medium",
        fontSize: 18,
        color: '#000',
        marginLeft: "4%"
    },
    Button: {
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#81007F',
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        flexDirection: 'row',
        position: "absolute",
        width: "90%",
        alignSelf: "center",
        bottom: 0
    },
    icon1: {
        marginRight: "2%",
    },
    icon: {
        width: 65,
        height: 60
    },
    icon3: {
        height: hp('13'),
        width: wp('32'),
        borderRadius: 15,
    },
    icon4: {
        width: wp('32'),
        height: hp('13'),
        borderRadius: 15,
        marginLeft: "3%"
    },
    gallery: {
        flexDirection: "row",
        marginTop: "3%",
    },
    like: {
        flexDirection: "row",
        position: "absolute",
        //top: "-7%",
        bottom: "94%",
        // bottom: 7,
        right: "5%"
    },

})