import React from 'react';
import { StyleSheet, View, Image, Text, TouchableWithoutFeedback, TouchableNativeFeedback, Picker, StatusBar, Platform } from 'react-native';
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
    Footer
} from 'native-base';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
const baseUrl = "http://demoworks.in/php/mypropertree/api/gallery/";
const baseUrl1 = "http://demoworks.in/php/mypropertree/api/dashboard/";
import { MaterialIndicator } from 'react-native-indicators';
import qs from 'qs';
import ImagePicker from 'react-native-image-crop-picker';
import AsyncStorage from '@react-native-community/async-storage';

export default class Step6 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            message: '',
            loading: false,
            images: [],
            submitStatus: '',
            user_type: '',
            user_id: '',
            imagename: '',
            property_post_status: "",
        }
    }
    goToStep5 = () => {
        this.props.navigation.navigate('Step4', { property_id: this.props.route.params.property_id, type: this.props.route.params.type, sub_type: this.props.route.params.sub_type })
    }

    goToStep7 = () => {
        if (this.state.images.length > 0) {
            Toast.show({
                text: "Gallary is updated Successfully !",
                duration: 3000,
                type: 'success',
                textStyle: { fontFamily: 'Ubuntu-Regular', color: "#ffffff", textAlign: 'center' },
            })
            this.state.property_post_status == 1 ?
                this.props.navigation.navigate('ManageProperties')
                :
                this.props.navigation.navigate('Step5', { property_id: this.props.route.params.property_id, type: this.props.route.params.type, sub_type: this.props.route.params.sub_type })
        }

        else {
            Toast.show({
                text: "Please Upload At least one Property Image",
                duration: 3000,
                type: 'danger',
                textStyle: { fontFamily: 'Ubuntu-Regular', color: "#ffffff", textAlign: 'center' },
            })
        }
    }
    componentDidMount() {
        AsyncStorage.getItem('user_id').then((user_id) => {
            this.getDetails(this.props.route.params.property_id, user_id),
                this.setState({ user_id: user_id });
        })
        this.propertyImages()
    }
    getDetails = (id, user_id) => {
        this.setState({ loading: true });
        fetch(baseUrl1 + 'edit_property/', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'content-type': 'application/x-www-form-urlencoded',
            },
            body: qs.stringify({
                property_id: id,
                user_id: user_id
            })
        }).then((response) => response.json())
            .then((json) => {
                this.setState({ loading: false });
                if (json.status == "invalid") {

                } else if (json.status == "valid") {
                    this.setState({
                        property_post_status: json.data.property_post_status,
                    })
                }
            })
            .catch((error) => {
                this.setState({ loading: false });
                console.error(error);
            });
    }
    selectImage = () => {
        ImagePicker.openPicker({
            width: 1940,
            height: 1300,
            cropping: true,
            compressImageQuality: 0.4,
            // freeStyleCropEnabled: true,
        }).then((images) => {
            this.setState({ loading: true });
            let uploadData = new FormData();
            uploadData.append('image', { type: images.mime, uri: images.path, name: images.path.split("/").pop() });
            uploadData.append('folder', 'properties');
            fetch(baseUrl + 'upload_photos', {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'multipart/form-data'
                },
                method: 'POST',
                body: uploadData,
            }).then((response) => response.json())
                .then((resp) => {
                    if (resp.status == "valid") {
                        fetch(baseUrl + 'insert_photo', {
                            method: 'POST',
                            headers: {
                                "Accept": 'application/json',
                                'content-type': 'application/x-www-form-urlencoded',
                            },
                            body: qs.stringify({
                                image: resp.file_name,
                                property_id: this.props.route.params.property_id,
                                user_id: this.state.user_id
                            })
                        }).then((response) => response.json())
                            .then((json) => {
                                this.setState({ loading: false });
                                if (json.status == "invalid") {
                                    Toast.show({
                                        text: json.message,
                                        duration: 2500,
                                        type: 'danger',
                                        textStyle: { fontFamily: 'Roboto-Regular', color: "#ffffff", textAlign: 'center' },
                                    })
                                } else if (json.status == "valid") {
                                    Toast.show({
                                        text: json.message,
                                        type: 'success',
                                        duration: 2500,
                                        textStyle: { fontFamily: 'Roboto-Regular', color: "#ffffff", textAlign: 'center' },
                                    })
                                    this.propertyImages()
                                }
                            })
                            .catch((error) => {
                                this.setState({ loading: false });
                                console.error(error);
                            });
                    } else {
                        Toast.show({
                            text: "There might be problem with server.Please try later",
                            duration: 2500,
                            type: 'danger',
                            textStyle: { fontFamily: 'Roboto-Regular', color: "#ffffff", textAlign: 'center' },
                        })
                    }
                });
        });
    }
    propertyImages = () => {
        this.setState({ loading: true })
        fetch(baseUrl + 'property_gallery/', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'content-type': 'application/x-www-form-urlencoded',
            },
            body: qs.stringify({
                property_id: this.props.route.params.property_id,
            })
        }).then((response) => response.json())
            .then((json) => {
                if (json.status == "invalid") {
                    this.setState({ loading: false, images: [] })
                } else if (json.status == "valid") {
                    this.setState({ loading: false, images: json.property_gallery });
                }
            })
            .catch((error) => {
                this.setState({ loading: false });
                console.error(error);
            });
    }
    setAsMainImage = (id) => {
        this.setState({ loading: true })
        fetch(baseUrl + 'set_priority_photo/', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'content-type': 'application/x-www-form-urlencoded',
            },
            body: qs.stringify({
                gallery_id: id
            })
        }).then((response) => response.json())
            .then((json) => {
                this.setState({ loading: false })
                if (json.status == "invalid") {
                    Toast.show({
                        text: json.message,
                        type: 'success',
                        duration: 2500,
                        textStyle: { fontFamily: 'Roboto-Regular', color: "#ffffff", textAlign: 'center' },
                    })
                    this.propertyImages()
                } else if (json.status == "valid") {
                    Toast.show({
                        text: json.message,
                        type: 'success',
                        duration: 2500,
                        textStyle: { fontFamily: 'Roboto-Regular', color: "#ffffff", textAlign: 'center' },
                    })
                    this.propertyImages()
                }
            })
            .catch((error) => {
                this.setState({ loading: false });
                console.error(error);
            });
    }
    deleteImage = (id) => {
        this.setState({ loading: true })
        fetch(baseUrl + 'remove_photo_from_gallery/', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'content-type': 'application/x-www-form-urlencoded',
            },
            body: qs.stringify({
                gallery_id: id,
            })
        }).then((response) => response.json())
            .then((json) => {
                if (json.status == "invalid") {
                    Toast.show({
                        text: json.message,
                        type: 'success',
                        duration: 2500,
                        textStyle: { fontFamily: 'Roboto-Regular', color: "#ffffff", textAlign: 'center' },
                    })
                } else if (json.status == "valid") {
                    Toast.show({
                        text: json.message,
                        type: 'success',
                        duration: 2500,
                        textStyle: { fontFamily: 'Roboto-Regular', color: "#ffffff", textAlign: 'center' },
                    })
                    this.propertyImages()
                }
            })
            .catch((error) => {
                this.setState({ loading: false });
                console.error(error);
            });
    }
    render() {
        return (
            <Container>
                <StatusBar backgroundColor='#fff' barStyle="dark-content" />
                {this.state.property_post_status == 1 ?
                    <View>
                    </View>
                    :
                    <View style={{ marginTop: "3%", marginLeft: "3%", }}>
                        <View style={{ flexDirection: "row", }}>
                            <TouchableWithoutFeedback onPress={this.goToStep5}>
                                <Image source={require('../assets/back_icon.png')} resizeMode='contain' />
                            </TouchableWithoutFeedback>
                            <Text style={styles.headerText}>Gallary</Text>
                        </View>
                    </View>
                }
                <View style={{ borderBottomWidth: 0.5, marginTop: "3%", elevation: 1, borderBottomColor: "#F0F0F0" }}></View>
                <Content>
                    <View style={styles.headerContainer}>
                        <Text style={styles.heading}>Gallery</Text>
                    </View>
                    <View style={styles.firstContainer}>
                        <Text style={styles.gallerySub}>Show tenants how your space looks like</Text>
                        <TouchableWithoutFeedback onPress={this.selectImage}>
                            <View style={{ flexDirection: 'row', marginTop: 8, borderRadius: 8, padding: Platform.OS == 'android' ? '8%' : '0%', backgroundColor: '#81007F', width: wp('92'), height: hp('6'), justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={styles.uploadText}>UPLOAD PHOTOS</Text>
                                <Image source={require('../assets/upload.png')} style={{ width: 18, height: 18, marginLeft: 20 }} />
                            </View>
                        </TouchableWithoutFeedback>
                        <Text style={{ alignSelf: "flex-end", paddingRight: wp('3'), marginTop: hp('1'), marginBottom: hp('1'), fontSize: 10, color: "#D34855", fontFamily: 'Poppins-SemiBold', }}>Note : image size should be (height:1300,width:1940) </Text>
                        <View>
                            {this.state.images.map((item, index) => {
                                return (
                                    <View style={{ margin: 5 }}>
                                        <Image source={{ uri: item.image_path }} style={{ width: wp('90'), height: 200, borderRadius: 1 }} />
                                        <View style={{ flexDirection: 'row', marginTop: hp('1') }} key={index}>
                                            {
                                                item.priority == 1 ?
                                                    <View style={{ flexDirection: 'row' }}>
                                                        <View>
                                                            <View style={{ borderRadius: 5, backgroundColor: '#81007F', width: wp('33'), height: hp('5.3'), justifyContent: 'center', alignItems: 'center' }}>
                                                                <Text style={{ fontFamily: 'Roboto-Regular', fontSize: 10, color: '#ffffff' }}>SELECTED</Text>
                                                            </View>
                                                        </View>
                                                        <View>
                                                            <Icon name="trash" type="FontAwesome" style={{ fontSize: 22, color: '#81007F', marginLeft: 15, marginTop: 5 }} onPress={() => this.deleteImage(item.id)} />
                                                        </View>
                                                    </View> :
                                                    <View style={{ flexDirection: 'row' }}>
                                                        <View>
                                                            <TouchableWithoutFeedback onPress={() => this.setAsMainImage(item.id)}>
                                                                <View style={{ borderRadius: 5, backgroundColor: '#dff3fe', width: wp('33'), height: hp('5.3'), justifyContent: 'center', alignItems: 'center' }}>
                                                                    <Text style={{ fontFamily: 'Roboto-Regular', fontSize: 10, color: '#81007F' }}>SET AS MAIN PHOTO</Text>
                                                                </View>
                                                            </TouchableWithoutFeedback>
                                                        </View>
                                                        <View>
                                                            <Icon name="trash" type="FontAwesome" style={{ fontSize: 22, color: '#81007F', marginLeft: 15, marginTop: 5 }} onPress={() => this.deleteImage(item.id)} />
                                                        </View>
                                                    </View>
                                            }
                                        </View>
                                    </View>
                                )
                            })}
                        </View>
                    </View>
                </Content>
                {this.state.property_post_status == 1 ?
                    <TouchableWithoutFeedback onPress={this.goToStep7}>
                        <View>
                            {
                                Platform.OS == "android" && <Footer style={{ backgroundColor: '#81007F', justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={{ fontFamily: 'Ubuntu-Regular', fontSize: 16, color: '#ffffff' }}>UPDATE</Text>
                                </Footer>
                            }
                            {
                                Platform.OS == "ios" && <View style={{ backgroundColor: '#81007F', justifyContent: 'center', alignItems: 'center', padding: '5%' }}>
                                    <Text style={{ fontFamily: 'Ubuntu-Regular', fontSize: 16, color: '#ffffff' }}>UPDATE</Text>
                                </View>
                            }
                        </View>

                    </TouchableWithoutFeedback>
                    :
                    <View style={styles.Button}>
                        <TouchableWithoutFeedback onPress={this.goToStep5}>
                            <View style={{ flexDirection: "row", marginLeft: "3%", alignItems: "center" }}>
                                <Icon name="angle-left" type="FontAwesome" style={styles.locicon} />
                                <Text style={styles.submitText1}>Back</Text>
                            </View>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback onPress={this.goToStep7}>
                            <View style={styles.buttonContainer}>
                                <Text style={styles.submitText2}>Next</Text>
                                <Icon name="angle-right" type="FontAwesome" style={{ color: "#81007F" }} />
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                }
            </Container>
        )
    }
}
const styles = StyleSheet.create({
    header: {
        backgroundColor: "#fff",
        borderBottomWidth: 0,
        alignItems: "center",
        justifyContent: 'center'
    },
    headerText: {
        color: "#000",
        fontSize: 17,
        fontFamily: 'Ubuntu-Bold',
        marginLeft: "8%"

    },
    Button: {
        alignItems: "center",
        backgroundColor: '#81007F',
        // height: "8%",
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        flexDirection: "row",
        justifyContent: "space-between"
    },

    locicon: {
        fontSize: 25,
        color: '#E5E5E5',
    },
    TitleText: {
        color: "#81007F",
        fontSize: 18,
        fontFamily: 'Ubuntu-Bold',
        marginLeft: "2%",
        marginTop: "8%"
    },
    submitText1: {
        fontSize: 17,
        color: '#fff',
        marginLeft: "15%"
    },
    submitText2: {
        fontSize: 16,
        color: '#81007F',
        marginRight: "8%"
    },
    buttonContainer: {
        width: wp('18'),
        height: hp('4'),
        backgroundColor: '#ffff',
        margin: '3%',
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: "row",
    },
    heading: {
        fontFamily: 'Ubuntu-Bold',
        fontSize: 17,
        color: '#81007F'
    },
    gallerySub: {
        fontFamily: 'Ubuntu-Regular',
        fontSize: 14,
        color: '#9f9f9f'
    },
    uploadText: {
        fontFamily: 'Ubuntu-Regular',
        fontSize: 15,
        color: '#ffffff'
    },
    heading1: {
        fontFamily: "Ubuntu-Medium",
        fontSize: 17,
    },
    ctext: {
        fontFamily: 'Ubuntu-Regular',
        fontSize: 14,
        paddingLeft: wp('5')

    },
    ftext: {
        fontFamily: 'Ubuntu-Regular',
        fontSize: 14,
    },
    locationText: {
        fontFamily: "Ubuntu-Medium",
        fontSize: 17,
        color: '#81007F'
    },
    boxHeder: {
        fontFamily: 'Ubuntu-Regular',
        fontSize: 15,
        color: '#81007F',
        paddingTop: hp('1')
    },
    firstContainer: {
        margin: '3%',
        padding: '1%'
    },
    subtext: {
        fontFamily: 'Ubuntu-Regular',
        fontSize: 14,
        color: '#717880'
    },
    footerText: {
        fontFamily: 'Ubuntu-Regular',
        fontSize: 16,
        color: '#ffffff'
    },
    box: {
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#81007F',
        margin: '2%',
        padding: '5%',
        width: wp('40'),
        borderRadius: 8
    },
    secondContainer: {
        backgroundColor: '#e4f7fe',
        margin: '4%',
        padding: '1%'
    },
    text: {
        fontFamily: "Ubuntu-Medium",
        fontSize: 15,
    },
    label: {
        fontFamily: 'Ubuntu-Regular',
        fontSize: 16,
        color: '#000'
    },
    labelContainer: {
        marginLeft: '1%'
    },
    input: {
        fontFamily: 'Ubuntu-Regular',
        fontSize: 15,
        backgroundColor: '#f2f2f2',
        paddingLeft: '5%'
    },
    item: {
        borderRadius: 8,
        backgroundColor: '#f2f2f2',
    },
    location: {
        backgroundColor: '#e4f7fe',
    },
    headerContainer: {
        backgroundColor: '#f3f3f3',
        padding: '3%'
    },
    fwdText: {
        fontFamily: 'Ubuntu-Regular',
        fontSize: 15,
        color: '#ffffff',
        margin: '2%'
    },
    backText: {
        fontFamily: 'Ubuntu-Regular',
        fontSize: 15,
        color: '#81007F',
        margin: '2%'
    },

})