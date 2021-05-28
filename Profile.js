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
    Card, Item, Input, Toast,
    Picker,
    Textarea
} from 'native-base';
import qs from 'qs';
const baseUrl = "http://demoworks.in/php/mypropertree/api/dashboard/";
const baseUrl2 = "http://demoworks.in/php/mypropertree/api/common/";
import AsyncStorage from '@react-native-community/async-storage';
import { MaterialIndicator } from 'react-native-indicators';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import ImagePicker from 'react-native-image-crop-picker';
const baseUrl3 = "http://demoworks.in/php/mypropertree/api/gallery/";
export default class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            type: '',
            name: '',
            email: '',
            user_id: '',
            city: '',
            mobile: '',
            loading: true,
            getStates: [],
            state_id: '',
            getCity: [],
            ofcAddress: "",
            nameOfCc: '',
            noOfProjects: '',
            yoE: '',
            website: '',
            propertyType: '',
            propertyTypes: [
                { id: '1', name: 'BUY' },
                { id: '2', name: 'RENT' },
            ],
            noOfLayouts: '',
            noOfCompletedProjects: '',
            phoneNumber: '',
            register_type_id: "",
            is_user_plan_expired: "",
            logoImage: "",
            launchImage: "",
            message: "",
            logo_filename: "",
            bg_image_filename: ""
        }
    }
    goToHome = () => {
        this.props.navigation.navigate('Home')
    }
    componentDidMount() {
        setTimeout(() => {
            this.setState({ loading: false });
        }, 1000);
        AsyncStorage.getItem('user_id').then((user_id) => {
            if (user_id) {
                this.setState({ user_id: user_id });
                this.getStates();
                this.getProfileDetails(user_id);
            } else {
                Toast.show({
                    text: "Please login to access profile section",
                    duration: 2000,
                    type: 'danger',
                    textStyle: { fontFamily: 'Ubuntu-Regular', color: "#ffffff", textAlign: 'center' },
                })
                this.props.navigation.navigate('Home')
            }
        })
    }
    getStates = () => {
        this.setState({
            loading: true,
        })
        fetch(baseUrl2 + 'get_states', {
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
                        getStates: json.data,
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
    getCitys = (state_id) => {
        fetch(baseUrl2 + 'get_state_wise_cities', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'content-type': 'application/x-www-form-urlencoded',
            },
            body: qs.stringify({
                state_id: state_id
            })
        }).then((response) => response.json())
            .then((json) => {
                if (json.status == 'valid') {
                    this.setState({
                        getCity: json.data,
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
    getProfileDetails = (user_id) => {
        fetch(baseUrl + 'profile', {
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
                this.getCitys(json.data.state_id)
                this.setState({
                    loading: false,
                    name: json.data.name,
                    register_type: json.data.register_type,
                    email: json.data.email,
                    mobile: json.data.mobile,
                    state: json.data.state_id,
                    city: json.data.city_id,
                    register_type_id: json.data.register_type_id,
                    ofcAddress: json.data.office_address,
                    nameOfCc: json.data.business_name,
                    noOfProjects: json.data.no_of_projects,
                    yoE: json.data.years_of_exp,
                    website: json.data.website_url,
                    propertyType: json.data.property_types,
                    noOfLayouts: json.data.no_of_layouts,
                    phoneNumber: json.data.phoneNumber,
                    is_user_plan_expired: json.data.is_user_plan_expired,
                    message: json.data.description,
                    // launchImage: json.data.bg_image,
                    // logoImage: json.data.logo,
                    bg_image_filename: json.data.bg_image_filename,
                    logo_filename: json.data.logo_filename
                });
                AsyncStorage.setItem('register_type', json.data.register_type)
            })
            .catch((error) => {
                this.setState({ loading: false });
                console.error(error);
            });
    }
    handleUpdateProfile = () => {
        console.log({
            bg_image: this.state.launchImage,
            logo: this.state.logoImage
        })
        this.setState({ loading: true });
        fetch(baseUrl + 'update_profile', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'content-type': 'application/x-www-form-urlencoded',
            },
            body: qs.stringify({
                user_id: this.state.user_id,
                name: this.state.name,
                email: this.state.email,
                state_id: this.state.state_id,
                city_id: this.state.city,
                office_address: this.state.ofcAddress,
                business_name: this.state.nameOfCc,
                no_of_projects: this.state.noOfProjects,
                years_of_exp: this.state.yoE,
                website_url: this.state.website,
                property_types: this.state.propertyType,
                no_of_layouts: this.state.noOfLayouts,
                phone_number: this.state.phoneNumber,
                description: this.state.message,
                bg_image: this.state.launchImage,
                logo: this.state.logoImage
            })
        }).then((response) => response.json())
            .then((json) => {
                if (json.status == "invalid") {
                    Toast.show({
                        text: json.message,
                        duration: 2000,
                        type: 'danger',
                        textStyle: { fontFamily: 'ubuntu-Regular', color: "#ffffff", textAlign: 'center' },
                    })
                    this.setState({ loading: false });
                } else if (json.status == "valid") {
                    this.props.navigation.navigate('Home')
                    Toast.show({
                        text: json.message,
                        type: 'success',
                        duration: 2500,
                        textStyle: { fontFamily: 'ubuntu-Regular', color: "#ffffff", textAlign: 'center' },
                    })
                    // this.getProfileDetails(this.state.user_id)
                }
            })
            .catch((error) => {
                this.setState({ loading: false, cities: [] });
                console.error(error);
            });
    }
    uploadCoverImage = () => {
        ImagePicker.openPicker({
            width: 1500,
            height: 1200,
            cropping: true,
            compressImageQuality: 0.4,
            // freeStyleCropEnabled: true
        }).then((images) => {
            this.setState({ loading: true });
            let uploadData = new FormData();
            uploadData.append('image', { type: images.mime, uri: images.path, name: images.path.split("/").pop() });
            uploadData.append('folder', 'profile');
            fetch(baseUrl3 + 'upload_photos', {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'multipart/form-data'
                },
                method: 'POST',
                body: uploadData,
            }).then((response) => response.json())
                .then((resp) => {
                    this.setState({ loading: false, launchImage: resp.file_name })
                    if (resp.status == "invalid") {
                        Toast.show({
                            text: resp.message,
                            duration: 2500,
                            type: 'danger',
                            textStyle: { fontFamily: 'Roboto-Regular', color: "#ffffff", textAlign: 'center' },
                        })
                    } else if (resp.status == "valid") {
                        Toast.show({
                            text: resp.message,
                            type: 'success',
                            duration: 2500,
                            textStyle: { fontFamily: 'Roboto-Regular', color: "#ffffff", textAlign: 'center' },
                        })
                    }
                });
        });
    }
    uploadLogoImage = async () => {
        ImagePicker.openPicker({
            width: 1000,
            height: 1000,
            cropping: true,
            compressImageQuality: 0.4,
            freeStyleCropEnabled: true
        }).then((images) => {
            this.setState({ loading: true });
            let uploadData = new FormData();
            uploadData.append('image', { type: images.mime, uri: images.path, name: images.path.split("/").pop() });
            uploadData.append('folder', 'profile');
            fetch(baseUrl3 + 'upload_photos', {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'multipart/form-data'
                },
                method: 'POST',
                body: uploadData,
            }).then((response) => response.json())
                .then((resp) => {
                    this.setState({ loading: false, logoImage: resp.file_name })
                    if (resp.status == "invalid") {
                        Toast.show({
                            text: resp.message,
                            duration: 2500,
                            type: 'danger',
                            textStyle: { fontFamily: 'Roboto-Regular', color: "#ffffff", textAlign: 'center' },
                        })
                    } else if (resp.status == "valid") {
                        Toast.show({
                            text: resp.message,
                            type: 'success',
                            duration: 2500,
                            textStyle: { fontFamily: 'Roboto-Regular', color: "#ffffff", textAlign: 'center' },
                        })
                    }
                });
        });
    }
    render() {
        // if (this.state.loading) {
        //     return (
        //         <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
        //             <MaterialIndicator color='#9572B4' size={30} />
        //         </View>
        //     )
        // }
        return (
            <Container style={{ backgroundColor: '#fff' }}>
                <StatusBar backgroundColor='#fff' barStyle="dark-content" />
                <View style={{ marginTop: "3%", marginLeft: "3%", }}>
                    <View style={{ flexDirection: "row", }}>
                        <TouchableWithoutFeedback onPress={this.goToHome}>
                            <Image source={require('../assets/back_icon.png')} resizeMode='contain' />
                        </TouchableWithoutFeedback>
                        <Text style={styles.headerText}>Update Profile</Text>
                    </View>
                </View>
                <View style={{ borderBottomWidth: 0.5, marginTop: "3%", elevation: 1, borderBottomColor: "#F0F0F0" }}></View>
                <Content style={{ marginTop: "5%" }}>
                    <Text style={styles.loginText3}>Register as</Text>
                    <Item style={styles.item}>
                        <Input
                            disabled
                            style={styles.input}
                            value={this.state.register_type}
                            onChangeText={(register_type) => { this.setState({ register_type: register_type }) }}
                        />
                    </Item>
                    <Text style={styles.loginText2}>Name</Text>
                    <Item style={styles.item}>
                        <Input
                            style={styles.input}
                            value={this.state.name}
                            onChangeText={(name) => { this.setState({ name: name }) }}
                        />
                    </Item>
                    <Text style={styles.loginText2}>Email</Text>
                    <Item style={styles.item}>
                        <Input
                            style={styles.input}
                            value={this.state.email}
                            onChangeText={(email) => { this.setState({ email: email }) }}
                        />
                    </Item>
                    <Text style={styles.loginText2}>State</Text>
                    <Item style={styles.item}>
                        <Picker
                            style={styles.pickerStyle}
                            selectedValue={this.state.state_id}
                            onValueChange={(itemValue, itemIndex) => {
                                this.setState(
                                    { state_id: itemValue },
                                    () => {
                                        this.getCitys(itemValue)
                                    }
                                )
                            }
                            }>
                            {/* <Picker.Item label="Select" value="" /> */}
                            {
                                this.state.getStates.map((item, key) =>
                                    <Picker.Item label={item.name} value={item.id} key={key} />
                                )
                            }
                        </Picker>
                    </Item>
                    <Text style={styles.loginText2}>City</Text>
                    <Item style={styles.item}>
                        <Picker
                            style={styles.pickerStyle}
                            selectedValue={this.state.city}
                            onValueChange={(itemValue, itemIndex) => { (this.setState({ city: itemValue })) }}
                        >
                            <Picker.Item label="Select" value="" />
                            {
                                this.state.getCity.map((item) =>

                                    <Picker.Item label={item.name} value={item.id} />

                                )
                            }

                        </Picker>
                    </Item>
                    <Text style={styles.loginText2}>Phone Number</Text>
                    <Item style={styles.item}>
                        <Input
                            disabled
                            style={styles.input}
                            value={this.state.mobile}
                            onChangeText={(mobile) => { this.setState({ mobile: mobile }) }}
                        />
                    </Item>
                    {this.state.register_type_id == 2 ?
                        <View>
                            <Text style={styles.loginText2}>Office Address</Text>
                            <Item style={styles.item}>
                                <Input
                                    style={styles.input}
                                    value={this.state.ofcAddress}
                                    onChangeText={(ofcAddress) => { this.setState({ ofcAddress: ofcAddress }) }}
                                />
                            </Item>
                            <Text style={styles.loginText2}>Name of the Company</Text>
                            <Item style={styles.item}>
                                <Input
                                    style={styles.input}
                                    value={this.state.nameOfCc}
                                    onChangeText={(nameOfCc) => { this.setState({ nameOfCc: nameOfCc }) }}
                                />
                            </Item>
                            <Text style={styles.loginText2}>I Covered</Text>
                            <Item style={styles.item}>
                                <Picker
                                    style={styles.pickerStyle}
                                    selectedValue={this.state.propertyType}
                                    onValueChange={(itemValue, itemIndex) => { (this.setState({ propertyType: itemValue })) }}
                                >
                                    <Picker.Item label="Select" value="" />

                                    {
                                        this.state.propertyTypes.map((item) =>

                                            <Picker.Item label={item.name} value={item.id} />

                                        )
                                    }

                                </Picker>
                            </Item>
                            {/* <Text style={styles.loginText2}>Cities i Covered</Text>
                                    <Item style={styles.item}>
                                        <PickerCheckBox
                                            data={this.state.getCity}
                                            headerComponent={<Text style={{ fontSize: 25 }} >Cities</Text>}
                                            OnConfirm={(pItems) => this.handleConfirm(pItems)}
                                            ConfirmButtonTitle='OK'
                                            DescriptionField='name'
                                            KeyField='id'
                                            placeholder='select some items'
                                            // arrowColor='#FFD740'
                                            // arrowSize={10}
                                            placeholderSelectedItems='$count selected item(s)'
                                        />
                                    </Item> */}
                        </View>
                        : null}
                    {this.state.register_type_id == 3 ?
                        <View>
                            <Text style={styles.loginText2}>Office Address</Text>
                            <Item style={styles.item}>
                                <Input
                                    style={styles.input}
                                    value={this.state.ofcAddress}
                                    onChangeText={(ofcAddress) => { this.setState({ ofcAddress: ofcAddress }) }}
                                />
                            </Item>
                            <Text style={styles.loginText2}>Name of the Company</Text>
                            <Item style={styles.item}>
                                <Input
                                    style={styles.input}
                                    value={this.state.nameOfCc}
                                    onChangeText={(nameOfCc) => { this.setState({ nameOfCc: nameOfCc }) }}
                                />
                            </Item>
                            <Text style={styles.loginText2}>Years Of Experience</Text>
                            <Item style={styles.item}>
                                <Input
                                    style={styles.input}
                                    value={this.state.yoE}
                                    onChangeText={(yoE) => { this.setState({ yoE: yoE }) }}
                                />
                            </Item>
                            <Text style={styles.loginText2}>How many Projects i completed untill today</Text>
                            <Item style={styles.item}>
                                <Input
                                    style={styles.input}
                                    value={this.state.noOfProjects}
                                    onChangeText={(no_of_projects) => { this.setState({ noOfProjects: no_of_projects }) }}
                                />
                            </Item>
                            <Text style={styles.loginText2}>Website</Text>
                            <Item style={styles.item}>
                                <Input
                                    style={styles.input}
                                    value={this.state.website}
                                    onChangeText={(website) => { this.setState({ website: website }) }}
                                />
                            </Item>
                            <View>
                                <Text style={styles.loginText2}>Cover Image</Text>
                                <TouchableWithoutFeedback
                                    onPress={this.uploadCoverImage}
                                >
                                    <View style={{ marginLeft: wp('10'), marginTop: hp('2') }}>
                                        <View style={styles.buttonContainer1}>
                                            <Text style={styles.submitText1}>Select Image</Text>
                                            <Image source={require('../assets/upload.png')} resizeMode="contain" style={{ height: 35, marginRight: wp('5') }} />
                                        </View>
                                    </View>
                                </TouchableWithoutFeedback>
                            </View>
                            <View>
                                <Text style={styles.loginText2}>Logo Image</Text>
                                <TouchableWithoutFeedback
                                    onPress={this.uploadLogoImage}
                                >
                                    <View style={{ marginLeft: wp('10'), marginTop: hp('2') }}>
                                        <View style={styles.buttonContainer1}>
                                            <Text style={styles.submitText1}>Select Image</Text>
                                            <Image source={require('../assets/upload.png')} resizeMode="contain" style={{ height: 35, marginRight: wp('5') }} />
                                        </View>
                                    </View>
                                </TouchableWithoutFeedback>
                            </View>
                            <Text style={styles.loginText2}>Description</Text>
                            <Textarea rowSpan={3} style={styles.textinput} value={this.state.message}
                                onChangeText={(message) => { this.setState({ message: message }) }}
                            />
                        </View>
                        : null}
                    {this.state.register_type_id == 4 ?
                        <View>
                            <Text style={styles.loginText2}>Office Address</Text>
                            <Item style={styles.item}>
                                <Input
                                    style={styles.input}
                                    value={this.state.ofcAddress}
                                    onChangeText={(ofcAddress) => { this.setState({ ofcAddress: ofcAddress }) }}
                                />
                            </Item>
                            <Text style={styles.loginText2}>Name of the Company</Text>
                            <Item style={styles.item}>
                                <Input
                                    style={styles.input}
                                    value={this.state.nameOfCc}
                                    onChangeText={(nameOfCc) => { this.setState({ nameOfCc: nameOfCc }) }}
                                />
                            </Item>
                            <Text style={styles.loginText2}>No of Annual Projects</Text>
                            <Item style={styles.item}>
                                <Input
                                    style={styles.input}
                                    value={this.state.noOfProjects}
                                    onChangeText={(noOfProjects) => { this.setState({ noOfProjects: noOfProjects }) }}
                                />
                            </Item>
                            <Text style={styles.loginText2}>Years Of Experience</Text>
                            <Item style={styles.item}>
                                <Input
                                    style={styles.input}
                                    value={this.state.yoE}
                                    onChangeText={(yoE) => { this.setState({ yoE: yoE }) }}
                                />
                            </Item>
                            <Text style={styles.loginText2}>Website</Text>
                            <Item style={styles.item}>
                                <Input
                                    style={styles.input}
                                    value={this.state.website}
                                    onChangeText={(website) => { this.setState({ website: website }) }}
                                />
                            </Item>
                            <View>
                                <Text style={styles.loginText2}>Cover Image</Text>
                                <TouchableWithoutFeedback
                                    onPress={this.uploadCoverImage}
                                >
                                    <View style={{ marginLeft: wp('10'), marginTop: hp('2') }}>
                                        <View style={styles.buttonContainer1}>
                                            <Text style={styles.submitText1}>Select Image</Text>
                                            <Image source={require('../assets/upload.png')} resizeMode="contain" style={{ height: 35, marginRight: wp('5') }} />
                                        </View>
                                    </View>
                                </TouchableWithoutFeedback>
                            </View>
                            <View>
                                <Text style={styles.loginText2}>Logo Image</Text>
                                <TouchableWithoutFeedback
                                    onPress={this.uploadLogoImage}
                                >
                                    <View style={{ marginLeft: wp('10'), marginTop: hp('2') }}>
                                        <View style={styles.buttonContainer1}>
                                            <Text style={styles.submitText1}>Select Image</Text>
                                            <Image source={require('../assets/upload.png')} resizeMode="contain" style={{ height: 35, marginRight: wp('5') }} />
                                        </View>
                                    </View>
                                </TouchableWithoutFeedback>
                            </View>
                            <Text style={styles.loginText2}>Description</Text>
                            <Textarea rowSpan={3} style={styles.textinput} value={this.state.message}
                                onChangeText={(message) => { this.setState({ message: message }) }}
                            />
                        </View>
                        : null}
                    {this.state.register_type_id == 5 ?
                        <View>
                            <Text style={styles.loginText2}>Office Address</Text>
                            <Item style={styles.item}>
                                <Input
                                    style={styles.input}
                                    value={this.state.ofcAddress}
                                    onChangeText={(ofcAddress) => { this.setState({ ofcAddress: ofcAddress }) }}
                                />
                            </Item>
                            <Text style={styles.loginText2}>Name of the Company</Text>
                            <Item style={styles.item}>
                                <Input
                                    style={styles.input}
                                    value={this.state.nameOfCc}
                                    onChangeText={(nameOfCc) => { this.setState({ nameOfCc: nameOfCc }) }}
                                />
                            </Item>
                            <Text style={styles.loginText2}>Years Of Experience</Text>
                            <Item style={styles.item}>
                                <Input
                                    style={styles.input}
                                    value={this.state.yoE}
                                    onChangeText={(yoE) => { this.setState({ yoE: yoE }) }}
                                />
                            </Item>
                            <Text style={styles.loginText2}>Website</Text>
                            <Item style={styles.item}>
                                <Input
                                    style={styles.input}
                                    value={this.state.website}
                                    onChangeText={(website) => { this.setState({ website: website }) }}
                                />
                            </Item>
                        </View>
                        : null}
                    {this.state.register_type_id == 6 ?
                        <View>
                            <Text style={styles.loginText2}>Shop Name</Text>
                            <Item style={styles.item}>
                                <Input
                                    style={styles.input}
                                    value={this.state.nameOfCc}
                                    onChangeText={(nameOfCc) => { this.setState({ nameOfCc: nameOfCc }) }}
                                />
                            </Item>
                            <Text style={styles.loginText2}>Shop Address</Text>
                            <Item style={styles.item}>
                                <Input
                                    style={styles.input}
                                    value={this.state.ofcAddress}
                                    onChangeText={(ofcAddress) => { this.setState({ ofcAddress: ofcAddress }) }}
                                />
                            </Item>
                            <Text style={styles.loginText2}>Alternative Mobile Number</Text>
                            <Item style={styles.item}>
                                <Input
                                    style={styles.input}
                                    value={this.state.phoneNumber}
                                    onChangeText={(phoneNumber) => { this.setState({ phoneNumber: phoneNumber }) }}
                                />
                            </Item>
                        </View>
                        : null}
                    {this.state.register_type_id == 7 ?
                        <View>
                            <Text style={styles.loginText2}>Office Address</Text>
                            <Item style={styles.item}>
                                <Input
                                    style={styles.input}
                                    value={this.state.ofcAddress}
                                    onChangeText={(ofcAddress) => { this.setState({ ofcAddress: ofcAddress }) }}
                                />
                            </Item>
                            <Text style={styles.loginText2}>Name of the Company</Text>
                            <Item style={styles.item}>
                                <Input
                                    style={styles.input}
                                    value={this.state.nameOfCc}
                                    onChangeText={(nameOfCc) => { this.setState({ nameOfCc: nameOfCc }) }}
                                />
                            </Item>
                            <Text style={styles.loginText2}>Website</Text>
                            <Item style={styles.item}>
                                <Input
                                    style={styles.input}
                                    value={this.state.website}
                                    onChangeText={(website) => { this.setState({ website: website }) }}
                                />
                            </Item>
                        </View>
                        : null}
                    {this.state.register_type_id == 8 ?
                        <View>
                            <Text style={styles.loginText2}>Shop Name</Text>
                            <Item style={styles.item}>
                                <Input
                                    style={styles.input}
                                    value={this.state.nameOfCc}
                                    onChangeText={(nameOfCc) => { this.setState({ nameOfCc: nameOfCc }) }}
                                />
                            </Item>
                            <Text style={styles.loginText2}>Shop Address</Text>
                            <Item style={styles.item}>
                                <Input
                                    style={styles.input}
                                    value={this.state.ofcAddress}
                                    onChangeText={(ofcAddress) => { this.setState({ ofcAddress: ofcAddress }) }}
                                />
                            </Item>
                            <Text style={styles.loginText2}>Shop Phone Number</Text>
                            <Item style={styles.item}>
                                <Input
                                    style={styles.input}
                                    value={this.state.phoneNumber}
                                    onChangeText={(phoneNumber) => { this.setState({ phoneNumber: phoneNumber }) }}
                                />
                            </Item>
                            <Text style={styles.loginText2}>We are in marker Since</Text>
                            <Item style={styles.item}>
                                <Input
                                    style={styles.input}
                                    value={this.state.yoE}
                                    onChangeText={(yoE) => { this.setState({ yoE: yoE }) }}
                                />
                            </Item>
                            <Text style={styles.loginText2}>Website</Text>
                            <Item style={styles.item}>
                                <Input
                                    style={styles.input}
                                    value={this.state.website}
                                    onChangeText={(website) => { this.setState({ website: website }) }}
                                />
                            </Item>
                        </View>
                        : null}
                    {this.state.register_type_id == 9 ?
                        <View>
                            <Text style={styles.loginText2}>Office Address</Text>
                            <Item style={styles.item}>
                                <Input
                                    style={styles.input}
                                    value={this.state.ofcAddress}
                                    onChangeText={(ofcAddress) => { this.setState({ ofcAddress: ofcAddress }) }}
                                />
                            </Item>
                            <Text style={styles.loginText2}>Name of your Company</Text>
                            <Item style={styles.item}>
                                <Input
                                    style={styles.input}
                                    value={this.state.nameOfCc}
                                    onChangeText={(nameOfCc) => { this.setState({ nameOfCc: nameOfCc }) }}
                                />
                            </Item>
                            <Text style={styles.loginText2}>No of Annual Projects</Text>
                            <Item style={styles.item}>
                                <Input
                                    style={styles.input}
                                    value={this.state.noOfProjects}
                                    onChangeText={(noOfProjects) => { this.setState({ noOfProjects: noOfProjects }) }}
                                />
                            </Item>
                            <Text style={styles.loginText2}>How many Layouts you made</Text>
                            <Item style={styles.item}>
                                <Input
                                    style={styles.input}
                                    value={this.state.noOfLayouts}
                                    onChangeText={(noOfLayouts) => { this.setState({ noOfLayouts: noOfLayouts }) }}
                                />
                            </Item>
                            <Text style={styles.loginText2}>Years Of Experience</Text>
                            <Item style={styles.item}>
                                <Input
                                    style={styles.input}
                                    value={this.state.yoE}
                                    onChangeText={(yoE) => { this.setState({ yoE: yoE }) }}
                                />
                            </Item>
                            <Text style={styles.loginText2}>Website</Text>
                            <Item style={styles.item}>
                                <Input
                                    style={styles.input}
                                    value={this.state.website}
                                    onChangeText={(website) => { this.setState({ website: website }) }}
                                />
                            </Item>
                            <View>
                                <Text style={styles.loginText2}>Cover Image</Text>
                                <TouchableWithoutFeedback
                                    onPress={this.uploadCoverImage}
                                >
                                    <View style={{ marginLeft: wp('10'), marginTop: hp('2') }}>
                                        <View style={styles.buttonContainer1}>
                                            <Text style={styles.submitText1}>Select Image</Text>
                                            <Image source={require('../assets/upload.png')} resizeMode="contain" style={{ height: 35, marginRight: wp('5') }} />
                                        </View>
                                    </View>
                                </TouchableWithoutFeedback>
                            </View>
                            <View>
                                <Text style={styles.loginText2}>Logo Image</Text>
                                <TouchableWithoutFeedback
                                    onPress={this.uploadLogoImage}
                                >
                                    <View style={{ marginLeft: wp('10'), marginTop: hp('2') }}>
                                        <View style={styles.buttonContainer1}>
                                            <Text style={styles.submitText1}>Select Image</Text>
                                            <Image source={require('../assets/upload.png')} resizeMode="contain" style={{ height: 35, marginRight: wp('5') }} />
                                        </View>
                                    </View>
                                </TouchableWithoutFeedback>
                            </View>
                            <Text style={styles.loginText2}>Description</Text>
                            <Textarea rowSpan={3} style={styles.textinput} value={this.state.message}
                                onChangeText={(message) => { this.setState({ message: message }) }}
                            />
                        </View>
                        : null}
                    <View style={{ marginTop: hp('45') }}></View>
                </Content>
                <TouchableWithoutFeedback onPress={this.handleUpdateProfile}>
                    <View style={styles.Button}>
                        <Text style={styles.submitText}>Update</Text>
                    </View>
                </TouchableWithoutFeedback>
            </Container>
        )
    }
}
const styles = StyleSheet.create({
    header: {
        backgroundColor: "#fff",
        borderBottomWidth: 0
    },
    leftimage: {
        width: 25,
        height: 20,
    },
    textinput: {
        borderBottomWidth: 0.8,
        borderBottomColor: '#000',
        marginLeft: "8%",
        marginRight: "8%",
        color: "#000"
    },
    buttonContainer1: {
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#F3F3F3',
        width: '70%',
        //padding: '2%',
        borderRadius: 25,
        flexDirection: "row"
    },
    headerText: {
        color: "#000",
        fontSize: 17,
        fontFamily: 'Ubuntu-Bold',
        marginLeft: "8%"

    },
    item: {
        borderBottomWidth: 0.8,
        borderBottomColor: '#000',
        marginLeft: "8%",
        marginRight: "8%",
        height: '4%'
    },
    loginText2: {
        fontFamily: 'Ubuntu-Regular',
        fontSize: 13,
        marginLeft: '9%',
        marginTop: "5%",
        marginBottom: "2%"
    },
    submitText1: {
        fontFamily: 'Ubuntu-Regular',
        fontSize: 15,
        color: '#000000',
        marginLeft: "5%"
    },
    loginText3: {
        fontFamily: 'Ubuntu-Medium',
        fontSize: 15,
        marginLeft: '9%',
        marginTop: "1.5%"
    },
    input: {
        fontFamily: 'Ubuntu-Regular',
        fontSize: 16,
        marginTop: "4%",
        marginBottom: "4%",
    },
    submitText: {
        fontFamily: 'Ubuntu-Bold',
        fontSize: 17,
        color: '#fff'
    },
    Button: {
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: '#81007F',
        height: "7%",
        marginLeft: "5%",
        marginRight: "5%",
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25
    },

})