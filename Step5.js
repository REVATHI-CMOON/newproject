import React from 'react';
import { StyleSheet, View, Image, Text, StatusBar, TouchableWithoutFeedback, TouchableNativeFeedback, Picker, Platform } from 'react-native';
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
    Radio,
    Footer,
    Card, Item, Input, Toast,
} from 'native-base';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Dash from 'react-native-dash';
import { ScrollView } from "react-native-gesture-handler";
import qs from 'qs';
const baseUrl = "http://demoworks.in/php/mypropertree/api/common/";
const baseUrl1 = "http://demoworks.in/php/mypropertree/api/dashboard/";

import AsyncStorage from '@react-native-community/async-storage';
export default class Step5 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            rent: '',
            amount: '',
            deposite: '',
            noticeperiod: '',
            sms_email_alert: 1,
            tenant_enq_alert: 1,
            occupancy: 1,
            interested_for: 1,
            SecurityDeposite: [],
            NoticePeriod: [],
            user_id: '',
            loading: false,
            property_post_status: "",
            register_type_id: "",
            Facilites: [],
            selectedFacilites: [],
            Entertainment: [],
            selectedEntertainment: [],
            Convienience: [],
            selectedCovienience: [],
            Eco: [],
            selectedEco: [],
            furniture: [],
            property_locality: [],
            water_facility: [],
            furnished: "",
            locality: "",
            hospital: "",
            school: "",
            park: "",
            busstop: "",
            grocery: "",
            Pharmacy: "",
            message: "",
            other_info: "",
            layout_approvedby: "",
            price: ""
        }
    }
    componentDidMount() {
        AsyncStorage.getItem('user_id').then((user_id) => {
            this.getDetails(this.props.route.params.property_id, user_id),
                this.setState({ user_id: user_id });
            this.getAmenities(user_id);
        })
        AsyncStorage.getItem('register_type_id').then((register_type_id) => {
            this.setState({ register_type_id: register_type_id })
        })
        this.getDropdownList();
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
                    let facilityArr = [];
                    var facilities = json.data.facilities;
                    facilities.map((item, index) => {
                        facilityArr.push(item.id);
                    });
                    let entArr = [];
                    var entertainment = json.data.entertainment;
                    entertainment.map((item, index) => {
                        entArr.push(item.id);
                    });
                    let covienienceArr = [];
                    var covienience = json.data.convenience;
                    covienience.map((item, index) => {
                        covienienceArr.push(item.id);
                    });
                    let ecoArr = [];
                    var eco = json.data.eco_friendly;
                    eco.map((item, index) => {
                        ecoArr.push(item.id);
                    });
                    this.setState({
                        property_post_status: json.data.property_post_status,
                        furnished: json.data.furniture_type,
                        locality: json.data.property_locality,
                        hospital: json.data.hospital,
                        school: json.data.school,
                        busstop: json.data.bus_stop,
                        grocery: json.data.grocery_store,
                        Pharmacy: json.data.pharmacy,
                        park: json.data.park,
                        selectedFacilites: facilityArr,
                        message: json.data.description,
                        other_info: json.data.other_info,
                        selectedEntertainment: entArr,
                        selectedCovienience: covienienceArr,
                        selectedEco: ecoArr,
                        layout_approvedby: json.data.layout_approvedby,
                        price: json.data.price
                    })
                }
            })
            .catch((error) => {
                this.setState({ loading: false });
                console.error(error);
            });
    }
    updateProperty = () => {
        this.setState({ loading: true });
        fetch(baseUrl1 + 'property_post_step5', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'content-type': 'application/x-www-form-urlencoded',
            },
            body: qs.stringify({
                action: "manage",
                user_id: this.state.user_id,
                property_id: this.props.route.params.property_id,
                furniture_type: this.state.furnished,
                property_locality: this.state.locality,
                hospital: this.state.hospital,
                school: this.state.school,
                bus_stop: this.state.busstop,
                grocery_store: this.state.grocery,
                pharmacy: this.state.Pharmacy,
                park: this.state.park,
                facilities: this.state.selectedFacilites.join(','),
                description: this.state.message,
                other_info: this.state.other_info,
                entertainment: this.state.selectedEntertainment.join(','),
                convenience: this.state.selectedCovienience.join(','),
                eco_friendly: this.state.selectedEco.join(','),
                layout_approvedby: this.state.layout_approvedby,
                price: this.state.price,
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
                    this.props.navigation.navigate('ManageProperties')
                }
            })
            .catch((error) => {
                this.setState({ loading: false });
                console.error(error);
            });
    }
    goToStep6 = () => {
        this.setState({ loading: true });
        fetch(baseUrl1 + 'property_post_step5', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'content-type': 'application/x-www-form-urlencoded',
            },
            body: qs.stringify({
                user_id: this.state.user_id,
                property_id: this.props.route.params.property_id,
                furniture_type: this.state.furnished,
                property_locality: this.state.locality,
                hospital: this.state.hospital,
                school: this.state.school,
                bus_stop: this.state.busstop,
                grocery_store: this.state.grocery,
                pharmacy: this.state.Pharmacy,
                park: this.state.park,
                facilities: this.state.selectedFacilites.join(','),
                description: this.state.message,
                other_info: this.state.other_info,
                entertainment: this.state.selectedEntertainment.join(','),
                convenience: this.state.selectedCovienience.join(','),
                eco_friendly: this.state.selectedEco.join(','),
                layout_approvedby: this.state.layout_approvedby,
                price: this.state.price
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
                    this.props.navigation.navigate('Step1', { property_id: json.property_id, type: json.type, sub_type: json.sub_type, mobile: json.contact_no })
                }
            })
            .catch((error) => {
                this.setState({ loading: false });
                console.error(error);
            });
    }
    goToStep4 = () => {
        this.props.navigation.navigate('Step6', { property_id: this.props.route.params.property_id, type: this.props.route.params.type, sub_type: this.props.route.params.sub_type })
    }
    getAmenities = (user_id) => {
        this.setState({
            loading: true,
        })
        fetch(baseUrl1 + 'get_aminities', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'content-type': 'application/x-www-form-urlencoded',
            },
            body: qs.stringify({
                user_id: user_id,
                subtype_id: this.props.route.params.sub_type
            })
        }).then((response) => response.json())
            .then((json) => {
                if (json.status == 'valid') {
                    this.setState({
                        Facilites: json.data,
                    });
                } else {
                    this.setState({ loading: false });
                }
            })
            .catch((error) => {
                this.setState({ loading: false });
            });
    }
    getDropdownList = () => {
        this.setState({
            loading: true,
        })
        fetch(baseUrl + 'property_dropdowns_list', {
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
                        SecurityDeposite: json.data.security_deposit,
                        NoticePeriod: json.data.notice_period,
                        // Facilites: json.data.facilites,
                        Convienience: json.data.convenience_security,
                        Entertainment: json.data.entertainment_socializing,
                        Eco: json.data.eco_friendly,
                        furniture: json.data.furniture_type,
                        property_locality: json.data.property_locality,
                        water_facility: json.data.water_facility,
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
    handleSmsChange = (id) => {
        this.setState({ sms_email_alert: id })
    }
    handleTenentChange = (id) => {
        this.setState({ tenant_enq_alert: id })
    }
    handleIntrestChange = (id) => {
        this.setState({ interested_for: id })
    }
    handleOccupanyChange = (id) => {
        this.setState({ occupancy: id })
    }
    PushFacilites = (id) => {
        let tempArr = this.state.selectedFacilites;
        if (tempArr.includes(id)) {
            var index = tempArr.indexOf(id)
            if (index !== -1) {
                tempArr.splice(index, 1);
            }
        } else {
            tempArr.push(id)
        }
        this.setState({ selectedFacilites: tempArr })
    }
    PushEntertaimnent = (id) => {
        let tempArr = this.state.selectedEntertainment;
        if (tempArr.includes(id)) {
            var index = tempArr.indexOf(id)
            if (index !== -1) {
                tempArr.splice(index, 1);
            }
        } else {
            tempArr.push(id)
        }
        this.setState({ selectedEntertainment: tempArr })
    }
    PushConvienience = (id) => {
        let tempArr = this.state.selectedCovienience;
        if (tempArr.includes(id)) {
            var index = tempArr.indexOf(id)
            if (index !== -1) {
                tempArr.splice(index, 1);
            }
        } else {
            tempArr.push(id)
        }
        this.setState({ selectedCovienience: tempArr })
    }
    PushEco = (id) => {
        let tempArr = this.state.selectedEco;
        if (tempArr.includes(id)) {
            var index = tempArr.indexOf(id)
            if (index !== -1) {
                tempArr.splice(index, 1);
            }
        } else {
            tempArr.push(id)
        }
        this.setState({ selectedEco: tempArr })
    }
    renderData = () => {
        if (this.state.register_type_id == 1 || this.state.register_type_id == 2) {
            return (
                <View>
                    <View style={styles.row}>
                        <View style={styles.space}>
                            <Dash style={styles.dash} dashColor="#C7C7C7" dashGap={3} />
                            <Image source={require('../assets/contact_details.png')} style={styles.image} resizeMode="contain" />
                        </View>
                        <View style={{ width: wp('75') }}>
                            <View>
                                <Text style={styles.TitleText}>
                                    Property Details
                                </Text>
                            </View>
                            {
                                (this.props.route.params.sub_type == 75 || this.props.route.params.sub_type == 76) &&
                                <View>
                                    <Text style={styles.loginText2}>Furniture Type</Text>
                                    <Item style={styles.item}>
                                        <Picker
                                            style={styles.pickerStyle}
                                            selectedValue={this.state.furnished}
                                            onValueChange={(itemValue, itemIndex) => this.setState({ furnished: itemValue })}>
                                            <Picker.Item label="Select" value="" />
                                            {
                                                this.state.furniture.map((item, key) =>
                                                    <Picker.Item label={item.option_value} value={item.id} key={key} />
                                                )
                                            }
                                        </Picker>
                                    </Item>
                                    <Text style={styles.loginText2}>Property Locality</Text>
                                    <Item style={styles.item}>
                                        <Picker
                                            style={styles.pickerStyle}
                                            selectedValue={this.state.locality}
                                            onValueChange={(itemValue, itemIndex) => this.setState({ locality: itemValue })}>
                                            <Picker.Item label="Select" value="" />
                                            {
                                                this.state.property_locality.map((item, key) =>
                                                    <Picker.Item label={item.option_value} value={item.id} key={key} />
                                                )
                                            }
                                        </Picker>
                                    </Item>
                                    <View>
                                        <Text style={styles.loginText22}>
                                            Near By Places (Distance From) in KM :
                                    </Text>
                                    </View>
                                    <View style={styles.row1}>
                                        <Text style={styles.loginText5}>Hospital</Text>
                                        <Text style={styles.loginText31}>School</Text>
                                    </View>
                                    <View style={styles.row1}>
                                        <Item style={styles.item1}>
                                            <Input
                                                style={styles.input}
                                                value={this.state.hospital}
                                                onChangeText={(hospital) => { this.setState({ hospital: hospital }) }}
                                            />
                                        </Item>
                                        <Item style={styles.item1}>
                                            <Input
                                                style={styles.input}
                                                value={this.state.school}
                                                onChangeText={(school) => { this.setState({ school: school }) }}
                                            />
                                        </Item>
                                    </View>
                                    <View style={styles.row1}>
                                        <Text style={styles.loginText5}>Park</Text>
                                        <Text style={styles.loginText31}>Bus Stop</Text>
                                    </View>
                                    <View style={styles.row1}>
                                        <Item style={styles.item1}>
                                            <Input
                                                style={styles.input}
                                                value={this.state.park}
                                                onChangeText={(park) => { this.setState({ park: park }) }}
                                            />
                                        </Item>
                                        <Item style={styles.item1}>
                                            <Input
                                                style={styles.input}
                                                value={this.state.busstop}
                                                onChangeText={(busstop) => { this.setState({ busstop: busstop }) }}
                                            />
                                        </Item>
                                    </View>
                                    <View style={styles.row1}>
                                        <Text style={styles.loginText5}>Grocery Store</Text>
                                        <Text style={styles.loginText31}>Pharmacy</Text>
                                    </View>
                                    <View style={styles.row1}>
                                        <Item style={styles.item1}>
                                            <Input
                                                style={styles.input}
                                                value={this.state.grocery}
                                                onChangeText={(grocery) => { this.setState({ grocery: grocery }) }}
                                            />
                                        </Item>
                                        <Item style={styles.item1}>
                                            <Input
                                                style={styles.input}
                                                value={this.state.Pharmacy}
                                                onChangeText={(Pharmacy) => { this.setState({ Pharmacy: Pharmacy }) }}
                                            />
                                        </Item>
                                    </View>
                                    <Text style={styles.loginText2}>
                                        Description
                                 </Text>
                                    <Textarea rowSpan={3} style={styles.textinput} value={this.state.message}
                                        onChangeText={(message) => { this.setState({ message: message }) }}

                                    />
                                    <Text style={styles.loginText2}>Amenities</Text>
                                    <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                                        {
                                            this.state.Facilites.map((item, key) => {
                                                return (
                                                    <TouchableWithoutFeedback onPress={() => this.PushFacilites(item.id)}>
                                                        <View style={{ flexDirection: 'row', width: wp('35'), margin: '1.2%', }}>
                                                            <View>
                                                                <View style={this.state.selectedFacilites.includes(item.id) ? styles.buttonContainer22 : styles.buttonContainer11}>
                                                                    <Text style={styles.buttonText}>{item.option_value}</Text>
                                                                </View>
                                                            </View>
                                                        </View>
                                                    </TouchableWithoutFeedback>
                                                )
                                            })
                                        }
                                    </View>
                                </View>
                            }
                            {
                                (this.props.route.params.sub_type == 119 || this.props.route.params.sub_type == 74) &&
                                <View>
                                    <Text style={styles.loginText2}>
                                        Description
                                 </Text>
                                    <Textarea rowSpan={3} style={styles.textinput} value={this.state.message}
                                        onChangeText={(message) => { this.setState({ message: message }) }}

                                    />
                                    <Text style={styles.loginText2}>Amenities</Text>
                                    <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                                        {
                                            this.state.Facilites.map((item, key) => {
                                                return (
                                                    <TouchableWithoutFeedback onPress={() => this.PushFacilites(item.id)}>
                                                        <View style={{ flexDirection: 'row', width: wp('35'), margin: '1.2%', }}>
                                                            <View>
                                                                <View style={this.state.selectedFacilites.includes(item.id) ? styles.buttonContainer22 : styles.buttonContainer11}>
                                                                    <Text style={styles.buttonText}>{item.option_value}</Text>
                                                                </View>
                                                            </View>
                                                        </View>
                                                    </TouchableWithoutFeedback>
                                                )
                                            })
                                        }
                                    </View>
                                </View>
                            }
                            {
                                this.props.route.params.sub_type == 120 &&
                                <View>
                                    <Text style={styles.loginText2}>
                                        Description
                                 </Text>
                                    <Textarea rowSpan={3} style={styles.textinput} value={this.state.message}
                                        onChangeText={(message) => { this.setState({ message: message }) }}
                                    />
                                </View>
                            }
                            {
                                this.props.route.params.sub_type == 117 &&
                                <View>
                                    {/* <Text style={styles.loginText2}>Amenities</Text>
                                    <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                                        {
                                            this.state.Facilites.map((item, key) => {
                                                return (
                                                    <TouchableWithoutFeedback onPress={() => this.PushFacilites(item.id)}>
                                                        <View style={{ flexDirection: 'row', width: wp('35'), margin: '1.2%', }}>
                                                            <View>
                                                                <View style={this.state.selectedFacilites.includes(item.id) ? styles.buttonContainer22 : styles.buttonContainer11}>
                                                                    <Text style={styles.buttonText}>{item.option_value}</Text>
                                                                </View>
                                                            </View>
                                                        </View>
                                                    </TouchableWithoutFeedback>
                                                )
                                            })
                                        }
                                    </View> */}
                                    <Text style={styles.loginText2}>
                                        Description
                                 </Text>
                                    <Textarea rowSpan={3} style={styles.textinput} value={this.state.message}
                                        onChangeText={(message) => { this.setState({ message: message }) }}

                                    />
                                </View>
                            }
                        </View>

                    </View>
                </View>
            )
        }
        else if (this.state.register_type_id == 4) {
            return (
                <View>
                    <View style={styles.row}>
                        <View style={styles.space}>
                            <Dash style={styles.dash} dashColor="#C7C7C7" dashGap={3} />
                            <Image source={require('../assets/property_details.png')} style={styles.image} resizeMode="contain" />
                        </View>
                        <View style={{ width: wp('75') }}>
                            <View>
                                <Text style={styles.TitleText}>
                                    Property Details
                                </Text>
                            </View>
                            <Text style={styles.loginText2}>Single line about project</Text>
                            <Item style={styles.item}>
                                <Input
                                    placeholder='Enter here'
                                    style={styles.input}
                                    value={this.state.other_info}
                                    // keyboardType='number-pad'
                                    onChangeText={(other_info) => { this.setState({ other_info: other_info }) }}
                                />
                            </Item>
                            <Text style={styles.loginText2}>
                                Description
                                 </Text>
                            <Textarea rowSpan={3} style={styles.textinput} value={this.state.message}
                                onChangeText={(message) => { this.setState({ message: message }) }}

                            />
                            <Text style={styles.loginText2}>Amenities</Text>
                            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                                {
                                    this.state.Facilites.map((item, key) => {
                                        return (
                                            <TouchableWithoutFeedback onPress={() => this.PushFacilites(item.id)}>
                                                <View style={{ flexDirection: 'row', width: wp('35'), margin: '1.2%', }}>
                                                    <View>
                                                        <View style={this.state.selectedFacilites.includes(item.id) ? styles.buttonContainer22 : styles.buttonContainer11}>
                                                            <Text style={styles.buttonText}>{item.option_value}</Text>
                                                        </View>
                                                    </View>
                                                </View>

                                            </TouchableWithoutFeedback>
                                        )
                                    })
                                }
                            </View>
                        </View>
                    </View>
                </View>
            )
        }
        else if (this.state.register_type_id == 3) {
            return (
                <View>
                    <View style={styles.row}>
                        <View style={styles.space}>
                            <Dash style={styles.dash} dashColor="#C7C7C7" dashGap={3} />
                            <Image source={require('../assets/property_details.png')} style={styles.image} resizeMode="contain" />
                        </View>
                        <View style={{ width: wp('75') }}>
                            <View>
                                <Text style={styles.TitleText}>
                                    Property Details
                                </Text>
                            </View>
                            <Text style={styles.loginText2}>
                                Description
                                 </Text>
                            <Textarea rowSpan={3} style={styles.textinput} value={this.state.message}
                                onChangeText={(message) => { this.setState({ message: message }) }}

                            />
                            <Text style={styles.loginText2}>Amenities</Text>
                            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                                {
                                    this.state.Facilites.map((item, key) => {
                                        return (
                                            <TouchableWithoutFeedback onPress={() => this.PushFacilites(item.id)}>
                                                <View style={{ flexDirection: 'row', width: wp('35'), margin: '1.2%', }}>
                                                    <View>
                                                        <View style={this.state.selectedFacilites.includes(item.id) ? styles.buttonContainer22 : styles.buttonContainer11}>
                                                            <Text style={styles.buttonText}>{item.option_value}</Text>
                                                        </View>
                                                    </View>
                                                </View>

                                            </TouchableWithoutFeedback>
                                        )
                                    })
                                }
                            </View>
                            <Text style={styles.loginText2}>Entertainment And Socializing</Text>
                            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                                {
                                    this.state.Entertainment.map((item, key) => {
                                        return (
                                            <TouchableWithoutFeedback onPress={() => this.PushEntertaimnent(item.id)}>
                                                <View style={{ flexDirection: 'row', width: wp('35'), margin: '1.2%', }}>
                                                    <View>
                                                        <View style={this.state.selectedEntertainment.includes(item.id) ? styles.buttonContainer22 : styles.buttonContainer11}>
                                                            <Text style={styles.buttonText}>{item.option_value}</Text>
                                                        </View>
                                                    </View>
                                                </View>

                                            </TouchableWithoutFeedback>
                                        )
                                    })
                                }
                            </View>
                            <Text style={styles.loginText2}>Convienience And Security</Text>
                            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                                {
                                    this.state.Convienience.map((item, key) => {
                                        return (
                                            <TouchableWithoutFeedback onPress={() => this.PushConvienience(item.id)}>
                                                <View style={{ flexDirection: 'row', width: wp('35'), margin: '1.2%', }}>
                                                    <View>
                                                        <View style={this.state.selectedCovienience.includes(item.id) ? styles.buttonContainer22 : styles.buttonContainer11}>
                                                            <Text style={styles.buttonText}>{item.option_value}</Text>
                                                        </View>
                                                    </View>
                                                </View>

                                            </TouchableWithoutFeedback>
                                        )
                                    })
                                }
                            </View>
                            <Text style={styles.loginText2}>Eco Friendly</Text>
                            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                                {
                                    this.state.Eco.map((item, key) => {
                                        return (
                                            <TouchableWithoutFeedback onPress={() => this.PushEco(item.id)}>
                                                <View style={{ flexDirection: 'row', width: wp('35'), margin: '1.2%', }}>
                                                    <View>
                                                        <View style={this.state.selectedEco.includes(item.id) ? styles.buttonContainer22 : styles.buttonContainer11}>
                                                            <Text style={styles.buttonText}>{item.option_value}</Text>
                                                        </View>
                                                    </View>
                                                </View>

                                            </TouchableWithoutFeedback>
                                        )
                                    })
                                }
                            </View>
                        </View>
                    </View>
                </View>
            )
        }
        else if (this.state.register_type_id == 9) {
            return (
                <View>
                    <View style={styles.row}>
                        <View style={styles.space}>
                            <Dash style={styles.dash} dashColor="#C7C7C7" dashGap={3} />
                            <Image source={require('../assets/property_details.png')} style={styles.image} resizeMode="contain" />
                        </View>
                        <View style={{ width: wp('75') }}>
                            <View>
                                <Text style={styles.TitleText}>
                                    Property Details
                                </Text>
                            </View>
                            <Text style={styles.loginText2}>Layout is approved by</Text>
                            <Item style={styles.item}>
                                <Input
                                    placeholder='Enter Layout is approved by'
                                    style={styles.input}
                                    value={this.state.layout_approvedby}
                                    onChangeText={(layout_approvedby) => { this.setState({ layout_approvedby: layout_approvedby }) }}
                                />
                            </Item>
                            <Text style={styles.loginText2}>Starting price</Text>
                            <Item style={styles.item}>
                                <Input
                                    placeholder='Enter Starting price'
                                    style={styles.input}
                                    value={this.state.price}
                                    keyboardType='number-pad'
                                    onChangeText={(price) => { this.setState({ price: price }) }}
                                />
                            </Item>
                            <Text style={styles.loginText2}>Single line about project</Text>
                            <Item style={styles.item}>
                                <Input
                                    placeholder='Enter here'
                                    style={styles.input}
                                    value={this.state.other_info}
                                    onChangeText={(other_info) => { this.setState({ other_info: other_info }) }}
                                />
                            </Item>
                            <Text style={styles.loginText2}>
                                Description
                                 </Text>
                            <Textarea rowSpan={3} style={styles.textinput} value={this.state.message}
                                onChangeText={(message) => { this.setState({ message: message }) }}

                            />
                            <Text style={styles.loginText2}>Amenities</Text>
                            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                                {
                                    this.state.Facilites.map((item, key) => {
                                        return (
                                            <TouchableWithoutFeedback onPress={() => this.PushFacilites(item.id)}>
                                                <View style={{ flexDirection: 'row', width: wp('35'), margin: '1.2%', }}>
                                                    <View>
                                                        <View style={this.state.selectedFacilites.includes(item.id) ? styles.buttonContainer22 : styles.buttonContainer11}>
                                                            <Text style={styles.buttonText}>{item.option_value}</Text>
                                                        </View>
                                                    </View>
                                                </View>

                                            </TouchableWithoutFeedback>
                                        )
                                    })
                                }
                            </View>
                        </View>
                    </View>
                    <View style={{ marginTop: "5%" }}></View>
                </View>
            )
        }
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
                            <TouchableWithoutFeedback onPress={this.goToStep4}>
                                <Image source={require('../assets/back_icon.png')} resizeMode='contain' />
                            </TouchableWithoutFeedback>
                            <Text style={styles.headerText}>{this.state.register_type_id == "9" ? "Step4" : "Step5"}</Text>
                        </View>
                    </View>
                }
                <Content style={{ margin: 2 }}>
                    {this.renderData()}
                </Content>
                {this.state.property_post_status == 1 ?
                    <TouchableWithoutFeedback onPress={this.updateProperty}>
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
                        <TouchableWithoutFeedback onPress={this.goToStep4}>
                            <View style={{ flexDirection: "row", marginLeft: "3%", alignItems: "center" }}>
                                <Icon name="angle-left" type="FontAwesome" style={styles.locicon} />
                                <Text style={styles.submitText1}>Back</Text>
                            </View>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback onPress={this.goToStep6}>
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
    row1: {
        flexDirection: "row",
        justifyContent: "space-between"
    },
    loginText31: {
        color: "#474747",
        fontSize: 14,
        fontFamily: 'Ubuntu-Regular',
        marginTop: "5%",
        width: wp('30')
    },

    loginText5: {
        color: "#474747",
        fontSize: 14,
        fontFamily: 'Ubuntu-Regular',
        marginTop: "5%",

    },
    item1: {
        borderBottomWidth: 0.8,
        borderBottomColor: '#000',
        width: "40%",
    },
    loginText22: {
        color: "#ff1a75",
        fontSize: 15,
        fontFamily: 'Ubuntu-Medium',
        marginTop: "8%",
        marginBottom: "4%"
    },
    buttonContainer11: {
        width: wp('35'),
        height: hp('5'),
        backgroundColor: '#fff',
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        margin: 5,
        borderColor: "#81007F",
        borderWidth: 0.7
        // padding: "5%"
    },
    buttonContainer22: {
        width: wp('35'),
        height: hp('5'),
        backgroundColor: '#d1e0e0',
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        margin: 5,
        borderColor: "#ccc",
        borderWidth: 0.7
    },
    textinput: {
        borderBottomWidth: 0.8,
        borderBottomColor: '#000',
        marginLeft: "3%",
        // marginRight: "12%",
        width: "90%"
    },
    buttonText: {
        alignItems: "center"
    },
    pickerStyle: {
        width: "100%",
        color: '#344953',
    },
    radiotext: {
        marginLeft: "15%",
        fontSize: 13,
        marginTop: "2%"
    },
    locicon: {
        fontSize: 25,
        color: '#E5E5E5',
    },
    locicon1: {
        fontSize: 25,
        color: '#81007F',
    },
    content: {
        marginLeft: "8%",
        flexDirection: "row"
    },
    image: {
        flexDirection: "row",
        right: 10
    },
    dash: {
        width: 1,
        flexDirection: 'column',
        left: 25,
        marginTop: "15%",
    },
    row: {
        flexDirection: "row",
    },
    space: {
        flexDirection: "row",
        width: wp('15'),
    },
    TitleText: {
        color: "#81007F",
        fontSize: 18,
        fontFamily: "ubuntu-bold",
        marginTop: "5%"
    },
    loginText2: {
        color: "#474747",
        fontSize: 16,
        fontFamily: "ubuntu-bold",
        marginTop: "7%",
        marginLeft: "3%",
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
    Button: {
        alignItems: "center",
        backgroundColor: '#81007F',
        // height: "8%",
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        flexDirection: "row",
        justifyContent: "space-between"
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
    item: {
        borderBottomWidth: 0.8,
        borderBottomColor: '#000',
        width: "90%"
    },
    input: {
        fontFamily: 'ubuntu-Regular',
        fontSize: 14,
        marginTop: "1%"

    },

})