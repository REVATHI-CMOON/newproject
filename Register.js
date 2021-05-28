import React from 'react';
import { View, Image, StyleSheet, Text, KeyboardAvoidingView, Picker, StatusBar, Platform, PermissionsAndroid, } from 'react-native';
import { Card, Item, Input, Toast, Form, Icon, Textarea, } from 'native-base';
import { ScrollView, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import SubHeader from './SubHeader';
import { MaterialIndicator } from 'react-native-indicators';
import qs from 'qs';
const baseUrl = "http://demoworks.in/php/mypropertree/api/common/";
const baseUrl2 = "http://demoworks.in/php/mypropertree/api/auth/";
const baseUrl3 = "http://demoworks.in/php/mypropertree/api/gallery/";
import AsyncStorage from '@react-native-community/async-storage';
// import PickerCheckBox from 'react-native-picker-checkbox';
import ImagePicker from 'react-native-image-crop-picker';
export default class Register extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user_name: '',
            email: '',
            city: '',
            dob: '',
            mobile: '',
            password: '',
            conpassword: '',
            data: [],
            PickerValue: '',
            getStates: [],
            state_id: '',
            getCity: [],
            loading: false,
            showPassword: true,
            device_token: '',
            ofcAddress: "",
            nameOfCc: '',
            noOfProjects: '',
            yoE: '',
            website: '',
            propertyType: '',
            propertyTypes: [
                { id: '1', name: 'BUY' },
                { id: '2', name: 'RENT' },
                { id: '3', name: 'BOTH' },
            ],
            noOfLayouts: '',
            noOfCompletedProjects: '',
            phoneNumber: '',
            since: '',
            message: "",
            launchImage: "",
            logoImage: "",
            check: false
        }
    }
    componentDidMount() {
        AsyncStorage.getItem('device_token').then((device_token) => {
            this.setState({ device_token: device_token })
        })
        this.getRegisterTypes();
        this.getStates();
    }
    getRegisterTypes = () => {
        fetch(baseUrl + 'get_reigster_tpyes', {
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
    getStates = () => {
        fetch(baseUrl + 'get_states', {
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
        fetch(baseUrl + 'get_state_wise_cities', {
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
    showPassword = () => {
        var current = this.state.showPassword
        this.setState({ showPassword: !current })
    }
    handleLogin = () => {
        this.props.navigation.navigate('Login')
    }
    validate_field = () => {
        if (this.state.check == "" || this.state.check == false) {
            Toast.show({
                text: "Please accept terms and conditions",
                duration: 2000,
                type: 'danger',
                textStyle: { fontFamily: 'Poppins-Regular', color: "#ffffff", textAlign: 'center' },
            })
            return false
        }
        else return true
    }
    handleRegister = () => {
        if (this.validate_field()) {
            this.setState({ loading: true });
            fetch(baseUrl2 + 'register', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'content-type': 'application/x-www-form-urlencoded',
                },
                body: qs.stringify({
                    device_token: this.state.device_token,
                    register_type_id: this.state.PickerValue,
                    name: this.state.user_name,
                    email: this.state.email,
                    state_id: this.state.state_id,
                    city_id: this.state.city,
                    mobile: this.state.mobile,
                    password: this.state.password,
                    office_address: this.state.ofcAddress,
                    business_name: this.state.nameOfCc,
                    no_of_projects: this.state.noOfProjects,
                    years_of_exp: this.state.yoE,
                    website_url: this.state.website,
                    property_types: this.state.propertyType,
                    no_of_layouts: this.state.noOfLayouts,
                    completed_projects: this.state.noOfCompletedProjects,
                    phone_number: this.state.phoneNumber,
                    description: this.state.message,
                    bg_image: this.state.launchImage,
                    logo: this.state.logoImage
                })
            }).then((response) => response.json())
                .then((json) => {
                    this.setState({ loading: false });
                    if (json.status == "invalid") {
                        Toast.show({
                            text: json.message,
                            duration: 2000,
                            type: 'danger',
                            textStyle: { fontFamily: 'ubuntu-Regular', color: "#ffffff", textAlign: 'center' },
                        })
                    } else if (json.status == "valid") {
                        Toast.show({
                            text: json.message,
                            type: 'success',
                            duration: 2500,
                            textStyle: { fontFamily: 'ubuntu-Regular', color: "#ffffff", textAlign: 'center' },
                        })
                        this.props.navigation.navigate('Otp', { user_id: json.user_id, mobileNo: this.state.mobile })
                    }
                })
                .catch((error) => {
                    this.setState({ loading: false });
                    console.error(error);
                });

        }
    }
    uploadCoverImage = () => {
        ImagePicker.openPicker({
            width: 1200,
            height: 1500,
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
                    console.log(resp.file_name)
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
            width: 1200,
            height: 1500,
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
                    console.log(resp.file_name)
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
    handleRadioChange = () => {
        this.setState({ check: !this.state.check })
    }
    render() {
        if (this.state.loading) {
            return (
                <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
                    <MaterialIndicator color='#81007F' size={30} />
                </View>
            )
        }
        return (
            <View style={styles.mainContainer}>
                <StatusBar backgroundColor="#81007F" />
                {/* <SubHeader title="" showPlus={false} showBack={true} params={{}} backScreen="Login" navigation={this.props.navigation} /> */}
                <ScrollView>
                    <View style={styles.view}>
                        <View style={styles.header}>
                            <View>
                                <TouchableWithoutFeedback onPress={this.handleLogin}>
                                    <Image source={require('../assets/back_white.png')} style={styles.leftimage} resizeMode="contain" />
                                </TouchableWithoutFeedback>
                            </View>
                        </View>
                        <View>
                            <View style={styles.textContainer}>
                                <Text style={styles.loginText}>Sign Up</Text>
                                <Text style={styles.loginText1}>Welcome to all</Text>
                            </View>
                            <Text style={styles.loginText3}>Register as</Text>
                            <Item style={styles.item}>
                                <Picker
                                    style={styles.pickerStyle}
                                    selectedValue={this.state.PickerValue}
                                    onValueChange={(itemValue, itemIndex) => { (this.setState({ PickerValue: itemValue })) }}>
                                    <Picker.Item label="Select" value="" />
                                    {
                                        this.state.data.map((item) =>

                                            <Picker.Item label={item.name} value={item.id} />
                                        )
                                    }

                                </Picker>
                            </Item>
                            <Text style={styles.loginText2}>Name</Text>
                            <Item style={styles.item}>
                                <Input
                                    style={styles.input}
                                    value={this.state.user_name}
                                    onChangeText={(username) => { this.setState({ user_name: username }) }}
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
                                    <Picker.Item label="Select" value="" />

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
                            <Text style={styles.loginText2}>Mobile</Text>
                            <Item style={styles.item}>
                                <Input
                                    style={styles.input}
                                    value={this.state.mobile}
                                    keyboardType="number-pad"
                                    maxLength={10}
                                    onChangeText={(mobile) => { this.setState({ mobile: mobile }) }}
                                />
                            </Item>
                            <Text style={styles.loginText2}>Password</Text>
                            <Item style={styles.item}>
                                <Input
                                    style={styles.input}
                                    value={this.state.password}
                                    onChangeText={(password) => { this.setState({ password: password }) }}
                                    secureTextEntry={this.state.showPassword}
                                />
                                <Icon active name={this.state.showPassword ? 'eye-slash' : 'eye'} type="FontAwesome" style={{ fontSize: 17, color: '#ffff' }} onPress={this.showPassword} />
                            </Item>
                            {this.state.PickerValue == 2 ?
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
                            {this.state.PickerValue == 4 ?
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
                                    {/* <TouchableWithoutFeedback
                                        style={styles.item}
                                        onPress={this.uploadCoverImage}
                                    >
                                        <View style={{ flexDirection: "row" }}>
                                            <View>
                                                <Text style={styles.loginText2}>Cover Image</Text>
                                                <Item>
                                                    <Input
                                                        placeholderTextColor="#fff"
                                                        placeholder="Cover Image"
                                                        editable={false}
                                                    />
                                                </Item>
                                            </View>
                                        </View>
                                    </TouchableWithoutFeedback> */}
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
                                    {/* <TouchableWithoutFeedback
                                        style={styles.item}
                                        onPress={this.uploadLogoImage}
                                    >
                                        <View style={{ flexDirection: "row" }}>
                                            <View>
                                                <Text style={styles.loginText2}>Logo Image</Text>
                                                <Item>
                                                    <Input
                                                        placeholderTextColor="#fff"
                                                        placeholder="Logo Image"
                                                        editable={false}
                                                    />
                                                </Item>
                                            </View>
                                        </View>
                                    </TouchableWithoutFeedback> */}
                                    <Text style={styles.loginText2}>Description</Text>
                                    <Textarea rowSpan={3} style={styles.textinput} value={this.state.message}
                                        onChangeText={(message) => { this.setState({ message: message }) }}
                                    />
                                </View>
                                : null}
                            {this.state.PickerValue == 9 ?
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
                            {this.state.PickerValue == 3 ?
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
                                            onChangeText={(noOfProjects) => { this.setState({ noOfProjects: noOfProjects }) }}
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
                            {this.state.PickerValue == 8 ?
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
                            {this.state.PickerValue == 5 ?
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
                            {this.state.PickerValue == 7 ?
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
                            {this.state.PickerValue == 6 ?
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
                            <View style={{ flexDirection: "row", alignSelf: "center", marginTop: wp('3'), }}>
                                <Icon active name={this.state.check == false ? 'square' : 'check-square'} type="FontAwesome" style={{ fontSize: 22, color: '#fff' }} onPress={() => this.handleRadioChange()} />
                                <Text style={{ color: "#fff", fontSize: 14, marginLeft: wp('3'), fontFamily: "Ubuntu-Regular", top: 2 }}>I accept all terms and conditions</Text>
                            </View>
                            <TouchableWithoutFeedback onPress={this.handleRegister}>
                                <View style={{ marginLeft: wp('5'), marginRight: wp('5'), marginTop: wp('3'), marginBottom: wp('3') }}>
                                    <View style={styles.buttonContainer}>
                                        <Text style={styles.submitText}>REGISTER</Text>
                                    </View>
                                </View>
                            </TouchableWithoutFeedback>
                        </View>

                    </View>
                    <View style={{ justifyContent: 'center', alignItems: 'center', margin: "2%" }}>
                        <View style={styles.rgContainer}>
                            <Text style={styles.rgText1}>Already have an Account?</Text>
                            <TouchableWithoutFeedback onPress={this.handleLogin}>
                                <Text style={styles.rgText}>Click Here</Text>
                            </TouchableWithoutFeedback>
                        </View>
                    </View>
                </ScrollView>

            </View>
        )
    }
}
const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: "#ffff",
    },
    view: {
        backgroundColor: "#81007F",
        borderBottomLeftRadius: 40,
        borderBottomRightRadius: 40,

    },
    header: {
        borderBottomWidth: 0,
        backgroundColor: "#81007F",
        marginTop: "3%",
        marginLeft: "3%",
        marginBottom: "7%"
    },
    image: {
        width: '100%',
        position: 'absolute',
    },
    textContainer: {
        marginLeft: '8%',
    },
    input: {
        fontFamily: 'ubuntu-Regular',
        fontSize: 14,
        padding: 1,
        margin: 1,
        color: "#ffff",
    },
    pickerStyle: {
        width: "100%",
        justifyContent: 'center',
        marginBottom: "4%",
        marginTop: "3%",
        color: "#fff"
    },
    item: {
        borderBottomWidth: 0.8,
        borderBottomColor: '#ffffff',
        marginLeft: "8%",
        marginRight: "8%",
        color: "#fff"
        // height: '7%'

    },
    loginText: {
        fontFamily: 'Ubuntu-Bold',
        fontSize: 22,
        color: '#ffffff',
    },
    loginText1: {
        fontFamily: 'Ubuntu-Medium',
        fontSize: 15,
        color: '#ffffff',
    },
    loginText2: {
        fontFamily: 'Ubuntu-Medium',
        fontSize: 14,
        color: '#ffffff',
        marginLeft: '10%',
        marginTop: "3%",
    },
    loginText3: {
        fontFamily: 'Ubuntu-Medium',
        fontSize: 15,
        color: '#ffffff',
        marginLeft: '8%',
        marginTop: "4%",
        marginBottom: "3%"

    },
    buttonContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffff',
        width: '100%',
        padding: '4%',
        borderRadius: 25
    },
    submitText: {
        fontFamily: 'Ubuntu-Bold',
        fontSize: 17,
        color: '#000000'
    },
    submitText1: {
        fontFamily: 'Ubuntu-Regular',
        fontSize: 15,
        color: '#000000',
        marginLeft: "5%"
    },
    rgContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },
    rgText: {
        fontFamily: 'Ubuntu-Regular',
        fontSize: 15,
        color: '#81007F',
        paddingLeft: '1%'
    },
    rgText1: {
        fontFamily: 'Ubuntu-Regular',
        fontSize: 15,
        color: '#000000'
    },
    textinput: {
        borderBottomWidth: 0.8,
        borderBottomColor: '#ffffff',
        marginLeft: "8%",
        marginRight: "8%",
        color: "#fff"
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
})