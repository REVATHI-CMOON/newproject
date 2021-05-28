import React from 'react';
import { StyleSheet, View, Image, Text, TouchableWithoutFeedback, Picker, TouchableNativeFeedback, TextInput, Dimensions, StatusBar, Platform } from 'react-native';
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
    Card, Item, Input, Toast, CheckBox,
    Footer
} from 'native-base';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Dash from 'react-native-dash';
import { ScrollView } from "react-native-gesture-handler";
import qs from 'qs';
import Modal from 'react-native-modal';
const baseUrl = "http://demoworks.in/php/mypropertree/api/common/";
const baseUrl1 = "http://demoworks.in/php/mypropertree/api/dashboard/";

import AsyncStorage from '@react-native-community/async-storage';

export default class Step3 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            bedroom: '',
            builtup: '',
            selectbathroom: '',
            selectbalcony: '',
            property: '',
            facing: '',
            carparking: '',
            bikeparking: '',
            loading: false,
            Balconies: [],
            Bedrooms: [],
            Bathrooms: [],
            Facilites: [],
            Propertyin: [],
            Facing: [],
            Floors: [],
            ShopTypes: [],
            WaterFacility: [],
            facilities: '',
            user_id: '',
            selectedFacilites: [],
            TenentType: [],
            ProjectStatus: [
                {
                    "id": "1",
                    "option_value": "Under Construction"
                },
                {
                    "id": "2",
                    "option_value": "Ready to move"
                }
            ],
            projectstatus: "",
            tenent: "",
            property_post_status: "",
            register_type_id: "",
            floors: "",
            price: "",
            water_facility: "",
            roadDistance: "",
            pos: "",
            sqftprice: "",
            shoptype: "",
            size: "",
            reraid: "",
            airport: "",
            railwaystation: "",
            hospital: "",
            total_area_of_projects: "",
            floors_allowed: "",
            isShow: false,
            isVisible: false,
            Months: [
                {
                    "id": "1",
                    "option_value": "Jan"
                },
                {
                    "id": "2",
                    "option_value": "Feb"
                },
                {
                    "id": "3",
                    "option_value": "Mar"
                },
                {
                    "id": "4",
                    "option_value": "Apr"
                },
                {
                    "id": "5",
                    "option_value": "May"
                },
                {
                    "id": "6",
                    "option_value": "Jun"
                },
                {
                    "id": "7",
                    "option_value": "Jul"
                },
                {
                    "id": "8",
                    "option_value": "Aug"
                },
                {
                    "id": "9",
                    "option_value": "Sep"
                },
                {
                    "id": "10",
                    "option_value": "Oct"
                },
                {
                    "id": "11",
                    "option_value": "Nov"
                },
                {
                    "id": "12",
                    "option_value": "Dec"
                },
            ],
            Years: [],
            year: "",
            month: "",
        }
    }
    componentDidMount() {
        AsyncStorage.getItem('register_type_id').then((register_type_id) => {
            this.setState({ register_type_id: register_type_id })
        })
        AsyncStorage.getItem('user_id').then((user_id) => {
            this.getDetails(this.props.route.params.property_id, user_id),
                this.setState({ user_id: user_id });
        })
        this.getDropdownList();
        this.generateArrayOfYears();
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
                user_id: user_id,
            })
        }).then((response) => response.json())
            .then((json) => {
                this.setState({ loading: false });
                if (json.status == "invalid") {

                } else if (json.status == "valid") {
                    this.setState({
                        property_post_status: json.data.property_post_status,
                        builtup: json.data.builtup_area,
                        floors: json.data.floors,
                        bedroom: json.data.bedrooms,
                        facing: json.data.facing,
                        builtup: json.data.builtup_area,
                        price: json.data.price,
                        water_facility: json.data.water_facility,
                        roadDistance: json.data.distance_from_road,
                        size: json.data.size,
                        sqftprice: json.data.sqft_price,
                        shoptype: json.data.shop_type,
                        projectstatus: json.data.sale_status,
                        pos: json.data.pos_date,
                        total_area_of_projects: json.data.total_area_of_projects,
                        reraid: json.data.rera_id,
                        airport: json.data.airport,
                        railwaystation: json.data.railway_station,
                        hospital: json.data.hospital,
                        floors_allowed: json.data.floors_allowed
                    })
                }
            })
            .catch((error) => {
                this.setState({ loading: false });
                console.error(error);
            });
    }
    goToStep2 = () => {
        this.props.navigation.navigate('Step2', { property_id: this.props.route.params.property_id, type: this.props.route.params.type, sub_type: this.props.route.params.sub_type })
    }
    goToStep4 = () => {
        // if (this.props.route.params.sub_type == 117) {
        //     this.props.navigation.navigate('Step6', { property_id: 152, type: 2, sub_type: 76 })
        // }
        // else {
        //     this.props.navigation.navigate('Step4', { property_id: 152, type: 2, sub_type: 76 })
        // }
        this.setState({ loading: true });
        fetch(baseUrl1 + 'property_post_step3', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'content-type': 'application/x-www-form-urlencoded',
            },
            body: qs.stringify({
                user_id: this.state.user_id,
                property_id: this.props.route.params.property_id,
                floors: this.state.floors,
                bedrooms: this.state.bedroom,
                facing: this.state.facing,
                builtup_area: this.state.builtup,
                price: this.state.price,
                water_facility: this.state.water_facility,
                distance_from_road: this.state.roadDistance,
                size: this.state.size,
                sqft_price: this.state.sqftprice,
                shop_type: this.state.shoptype,
                sale_status: this.state.projectstatus,
                pos_date: this.state.pos,
                total_area_of_projects: this.state.total_area_of_projects,
                rera_id: this.state.reraid,
                airport: this.state.airport,
                railway_station: this.state.railwaystation,
                hospital: this.state.hospital,
                floors_allowed: this.state.floors_allowed
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
                    this.state.property_post_status == 1 ?
                        this.props.navigation.navigate('ManageProperties')
                        :
                        this.props.route.params.sub_type == 117 ?
                            this.props.navigation.navigate('Step6', { property_id: json.property_id, type: json.type, sub_type: json.sub_type })
                            :
                            this.props.navigation.navigate('Step4', { property_id: json.property_id, type: json.type, sub_type: json.sub_type })
                }
            })
            .catch((error) => {
                this.setState({ loading: false });
                console.error(error);
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
                        Balconies: json.data.balconies,
                        Bathrooms: json.data.bathrooms,
                        Bedrooms: json.data.bedrooms,
                        Facilites: json.data.facilites,
                        Facing: json.data.facing,
                        Propertyin: json.data.property_in,
                        TenentType: json.data.tenant_types,
                        Floors: json.data.floors,
                        WaterFacility: json.data.water_facility,
                        ShopTypes: json.data.shop_type,
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
    generateArrayOfYears = () => {
        var max = new Date().getFullYear()

        var years = []

        for (var i = max; i <= 2050; i++) {
            var obj = {
                id: i.toString()
            }
            years.push(obj)
        }
        this.setState({ Years: years })
    }
    modelClose = () => {
        this.setState({ isVisible: false })
    }
    validate_field = () => {
        if (this.state.month == "") {
            alert("Please Select Month")
            return false
        }
        else if (this.state.year == "") {
            alert("Please Select Year")
            return false
        }
        else return true
    }
    modelSubmit = () => {
        if (this.validate_field()) {
            var monthYear = this.state.month + '/' + this.state.year
            this.setState({ pos: monthYear, isVisible: false, })
        }
    }
    renderData = () => {
        if (this.state.register_type_id == 1 || this.state.register_type_id == 2) {
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
                            {
                                this.props.route.params.sub_type == 117 ?
                                    <Text style={styles.loginText2}>Area of Land</Text>
                                    :
                                    <Text style={styles.loginText2}>Total Area of Property</Text>

                            }
                            <Item style={styles.item}>
                                <Input
                                    placeholder='Enter Total Area of property'
                                    style={styles.input}
                                    value={this.state.builtup}
                                    onChangeText={(builtup) => { this.setState({ builtup: builtup }) }}
                                />
                                <Text style={styles.input}>sq.ft</Text>
                            </Item>
                            {
                                (this.props.route.params.sub_type == 75 || this.props.route.params.sub_type == 76) &&
                                <View>
                                    <Text style={styles.loginText2}>No of BHKs</Text>
                                    <Item style={styles.item}>
                                        <Picker
                                            style={styles.pickerStyle}
                                            selectedValue={this.state.bedroom}
                                            onValueChange={(itemValue, itemIndex) => {
                                                this.setState(
                                                    { bedroom: itemValue }
                                                )
                                            }
                                            }>
                                            <Picker.Item label="Select" value="" />
                                            {
                                                this.state.Bedrooms.map((item, key) =>
                                                    <Picker.Item label={item.option_value} value={item.id} key={key} />
                                                )
                                            }
                                        </Picker>
                                    </Item>
                                    <Text style={styles.loginText2}>Property facing towards</Text>
                                    <Item style={styles.item}>
                                        <Picker
                                            style={styles.pickerStyle}
                                            selectedValue={this.state.facing}
                                            onValueChange={(itemValue, itemIndex) => this.setState({ facing: itemValue })}>
                                            <Picker.Item label="Select" value="" />
                                            {
                                                this.state.Facing.map((item, key) =>
                                                    <Picker.Item label={item.option_value} value={item.id} key={key} />
                                                )
                                            }
                                        </Picker>
                                    </Item>
                                    <Text style={styles.loginText2}>Building floor</Text>
                                    <Item style={styles.item}>
                                        <Picker
                                            style={styles.pickerStyle}
                                            selectedValue={this.state.floors}
                                            onValueChange={(itemValue, itemIndex) => this.setState({ floors: itemValue })}>
                                            <Picker.Item label="Select" value="" />
                                            {
                                                this.state.Floors.map((item, key) =>
                                                    <Picker.Item label={item.option_value} value={item.id} key={key} />
                                                )
                                            }
                                        </Picker>
                                    </Item>
                                </View>
                            }
                            {
                                this.props.route.params.sub_type == 117 &&
                                <View>
                                    <Text style={styles.loginText2}>Price</Text>
                                    <Item style={styles.item}>
                                        <Input
                                            placeholder='Enter Price'
                                            style={styles.input}
                                            value={this.state.price}
                                            keyboardType='number-pad'
                                            onChangeText={(price) => { this.setState({ price: price }) }}
                                        />
                                    </Item>
                                    <Text style={styles.loginText2}>Water Facility</Text>
                                    <Item style={styles.item}>
                                        <Picker
                                            style={styles.pickerStyle}
                                            selectedValue={this.state.water_facility}
                                            onValueChange={(itemValue, itemIndex) => this.setState({ water_facility: itemValue })}>
                                            <Picker.Item label="Select" value="" />
                                            {
                                                this.state.WaterFacility.map((item, key) =>
                                                    <Picker.Item label={item.option_value} value={item.id} key={key} />
                                                )
                                            }
                                        </Picker>
                                    </Item>
                                    <Text style={styles.loginText2}>Distance from road</Text>
                                    <Item style={styles.item}>
                                        <Input
                                            placeholder='Enter Distance from Road'
                                            style={styles.input}
                                            value={this.state.roadDistance}
                                            onChangeText={(roadDistance) => { this.setState({ roadDistance: roadDistance }) }}
                                        />
                                    </Item>
                                </View>
                            }
                            {
                                (this.props.route.params.sub_type == 74 || this.props.route.params.sub_type == 119 || this.props.route.params.sub_type == 120) &&
                                <View>
                                    {
                                        this.props.route.params.sub_type == 120 &&
                                        <View>
                                            <Text style={styles.loginText2}>Shop Type</Text>
                                            <Item style={styles.item}>
                                                <Picker
                                                    style={styles.pickerStyle}
                                                    selectedValue={this.state.shoptype}
                                                    onValueChange={(itemValue, itemIndex) => this.setState({ shoptype: itemValue })}>
                                                    <Picker.Item label="Select" value="" />
                                                    {
                                                        this.state.ShopTypes.map((item, key) =>
                                                            <Picker.Item label={item.option_value} value={item.id} key={key} />
                                                        )
                                                    }
                                                </Picker>
                                            </Item>
                                        </View>
                                    }
                                    <Text style={styles.loginText2}>Price</Text>
                                    <Item style={styles.item}>
                                        <Input
                                            placeholder='Enter Price'
                                            style={styles.input}
                                            value={this.state.price}
                                            keyboardType='number-pad'
                                            onChangeText={(price) => { this.setState({ price: price }) }}
                                        />
                                    </Item>
                                    <Text style={styles.loginText2}>Sq.ft Price</Text>
                                    <Item style={styles.item}>
                                        <Input
                                            placeholder='Enter Sq.ft Price'
                                            style={styles.input}
                                            value={this.state.sqftprice}
                                            keyboardType='number-pad'
                                            onChangeText={(sqftprice) => { this.setState({ sqftprice: sqftprice }) }}
                                        />
                                    </Item>
                                    <Text style={styles.loginText2}>Size</Text>
                                    <Item style={styles.item}>
                                        <Input
                                            placeholder='Enter Size'
                                            style={styles.input}
                                            value={this.state.size}
                                            keyboardType='number-pad'
                                            onChangeText={(size) => { this.setState({ size: size }) }}
                                        />
                                    </Item>

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
                    <View>
                        <Modal isVisible={this.state.isVisible}>
                            <View style={styles.modal}>
                                <View style={{ backgroundColor: "#81007F", padding: hp('2'), borderTopLeftRadius: 20, borderTopRightRadius: 20 }}>
                                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                                        <Text style={{ textAlign: "center", fontSize: 15, color: "#fff", fontFamily: 'Poppins-SemiBold', marginLeft: wp('8') }}>Select Month & Year</Text>
                                        <Icon onPress={this.modelClose} type="FontAwesome" name="times-circle" style={{ color: '#fff', fontSize: 18, }} />
                                    </View>
                                </View>
                                <View style={{ alignItems: "center", justifyContent: "center", marginTop: hp('2') }}>
                                    <View style={styles.picker11}>
                                        <Picker
                                            mode="dropdown"
                                            selectedValue={this.state.month}
                                            onValueChange={(itemValue, itemIndex) => { (this.setState({ month: itemValue })) }}
                                        >
                                            <Picker.Item label="Select Month" value="" />
                                            {
                                                this.state.Months.map((item, key) =>
                                                    <Picker.Item label={item.option_value} value={item.id} key={key} />
                                                )
                                            }
                                        </Picker>
                                    </View>
                                    <View style={styles.picker11}>
                                        <Picker
                                            mode="dropdown"
                                            selectedValue={this.state.year}
                                            onValueChange={(itemValue, itemIndex) => { (this.setState({ year: itemValue })) }}
                                        >
                                            <Picker.Item label="Select Year" value="" />
                                            {
                                                this.state.Years.map((item, key) =>
                                                    <Picker.Item label={item.id} value={item.id} key={key} />
                                                )
                                            }
                                        </Picker>
                                    </View>
                                </View>
                                <TouchableWithoutFeedback onPress={this.modelSubmit}>
                                    <View style={{ marginTop: hp('2'), marginBottom: wp('5') }}>
                                        <View style={styles.buttonContainer123}>
                                            <Text style={styles.submitText123}>Submit</Text>
                                        </View>
                                    </View>
                                </TouchableWithoutFeedback>
                            </View>
                        </Modal>
                    </View>
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
                            <Text style={styles.loginText2}>Project Status</Text>
                            <Item style={styles.item}>
                                <Picker
                                    style={styles.pickerStyle}
                                    selectedValue={this.state.projectstatus}
                                    onValueChange={(itemValue, itemIndex) => this.setState({ projectstatus: itemValue })}>
                                    <Picker.Item label="Select" value="" />
                                    {
                                        this.state.ProjectStatus.map((item, key) =>
                                            <Picker.Item label={item.option_value} value={item.id} key={key} />
                                        )
                                    }
                                </Picker>
                            </Item>
                            {
                                this.state.projectstatus == 1 &&
                                <View>
                                    <Text style={styles.loginText2}>Possession date</Text>
                                    <Item style={styles.item1}>
                                        {/* <Input
                                            placeholder='Enter Possession date'
                                            style={styles.input}
                                            value={this.state.pos}
                                            onChangeText={(pos) => { this.setState({ pos: pos }) }}
                                        /> */}
                                        <TouchableWithoutFeedback onPress={() => this.setState({ isVisible: true })}>
                                            <Text style={{ fontSize: 15 }}>{this.state.pos ? this.state.pos : "Select date"}</Text>
                                        </TouchableWithoutFeedback>
                                    </Item>
                                </View>
                            }
                            <Text style={styles.loginText2}>No of Units</Text>
                            <Item style={styles.item}>
                                <Input
                                    placeholder='Enter No of Units'
                                    style={styles.input}
                                    value={this.state.builtup}
                                    onChangeText={(builtup) => { this.setState({ builtup: builtup }) }}
                                />
                            </Item>
                            <Text style={styles.loginText2}>Select Facing</Text>
                            <Item style={styles.item}>
                                <Picker
                                    style={styles.pickerStyle}
                                    selectedValue={this.state.facing}
                                    onValueChange={(itemValue, itemIndex) => this.setState({ facing: itemValue })}>
                                    <Picker.Item label="Select" value="" />
                                    {
                                        this.state.Facing.map((item, key) =>
                                            <Picker.Item label={item.option_value} value={item.id} key={key} />
                                        )
                                    }
                                </Picker>
                            </Item>
                            <Text style={styles.loginText2}>Sq.ft Price</Text>
                            <Item style={styles.item}>
                                <Input
                                    placeholder='Enter Sq.ft Price'
                                    style={styles.input}
                                    value={this.state.sqftprice}
                                    keyboardType='number-pad'
                                    onChangeText={(sqftprice) => { this.setState({ sqftprice: sqftprice }) }}
                                />
                            </Item>
                        </View>
                    </View>
                </View>
            )
        }
        else if (this.state.register_type_id == 3) {
            return (
                <View>
                    <View>
                        <Modal isVisible={this.state.isVisible}>
                            <View style={styles.modal}>
                                <View style={{ backgroundColor: "#81007F", padding: hp('2'), borderTopLeftRadius: 20, borderTopRightRadius: 20 }}>
                                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                                        <Text style={{ textAlign: "center", fontSize: 15, color: "#fff", fontFamily: 'Poppins-SemiBold', marginLeft: wp('8') }}>Select Month & Year</Text>
                                        <Icon onPress={this.modelClose} type="FontAwesome" name="times-circle" style={{ color: '#fff', fontSize: 18, }} />
                                    </View>
                                </View>
                                <View style={{ alignItems: "center", justifyContent: "center", marginTop: hp('2') }}>
                                    <View style={styles.picker11}>
                                        <Picker
                                            mode="dropdown"
                                            selectedValue={this.state.month}
                                            onValueChange={(itemValue, itemIndex) => { (this.setState({ month: itemValue })) }}
                                        >
                                            <Picker.Item label="Select Month" value="" />
                                            {
                                                this.state.Months.map((item, key) =>
                                                    <Picker.Item label={item.option_value} value={item.id} key={key} />
                                                )
                                            }
                                        </Picker>
                                    </View>
                                    <View style={styles.picker11}>
                                        <Picker
                                            mode="dropdown"
                                            selectedValue={this.state.year}
                                            onValueChange={(itemValue, itemIndex) => { (this.setState({ year: itemValue })) }}
                                        >
                                            <Picker.Item label="Select Year" value="" />
                                            {
                                                this.state.Years.map((item, key) =>
                                                    <Picker.Item label={item.id} value={item.id} key={key} />
                                                )
                                            }
                                        </Picker>
                                    </View>
                                </View>
                                <TouchableWithoutFeedback onPress={this.modelSubmit}>
                                    <View style={{ marginTop: hp('2'), marginBottom: wp('5') }}>
                                        <View style={styles.buttonContainer123}>
                                            <Text style={styles.submitText123}>Submit</Text>
                                        </View>
                                    </View>
                                </TouchableWithoutFeedback>
                            </View>
                        </Modal>
                    </View>
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
                            <Text style={styles.loginText2}>Total Area of projects</Text>
                            <Item style={styles.item}>
                                <Input
                                    placeholder='Enter here'
                                    style={styles.input}
                                    value={this.state.total_area_of_projects}
                                    onChangeText={(total_area_of_projects) => { this.setState({ total_area_of_projects: total_area_of_projects }) }}
                                />
                            </Item>
                            <Text style={styles.loginText2}>Project Status</Text>
                            <Item style={styles.item}>
                                <Picker
                                    style={styles.pickerStyle}
                                    selectedValue={this.state.projectstatus}
                                    onValueChange={(itemValue, itemIndex) => this.setState({ projectstatus: itemValue })}>
                                    <Picker.Item label="Select" value="" />
                                    {
                                        this.state.ProjectStatus.map((item, key) =>
                                            <Picker.Item label={item.option_value} value={item.id} key={key} />
                                        )
                                    }
                                </Picker>
                            </Item>
                            {
                                this.state.projectstatus == 1 &&
                                <View>
                                    <Text style={styles.loginText2}>Possession date</Text>
                                    <Item style={styles.item1}>
                                        <TouchableWithoutFeedback onPress={() => this.setState({ isVisible: true })}>
                                            <Text style={{ fontSize: 15 }}>{this.state.pos ? this.state.pos : "Select date"}</Text>
                                        </TouchableWithoutFeedback>
                                        {/* <Input
                                            placeholder='Enter Possession date'
                                            style={styles.input}
                                            value={this.state.pos}
                                            onChangeText={(pos) => { this.setState({ pos: pos }) }}
                                        /> */}
                                    </Item>
                                </View>
                            }
                            <Text style={styles.loginText2}>Rera id</Text>
                            <Item style={styles.item}>
                                <Input
                                    placeholder='Enter Rera id'
                                    style={styles.input}
                                    value={this.state.reraid}
                                    onChangeText={(reraid) => { this.setState({ reraid: reraid }) }}
                                />
                            </Item>
                            <View>
                                <Text style={styles.loginText22}>
                                    Location Advantages :
                                    </Text>
                            </View>
                            <Text style={styles.loginText2}>Airport</Text>
                            <Item style={styles.item}>
                                <Input
                                    placeholder='Enter Distance'
                                    style={styles.input}
                                    value={this.state.airport}
                                    onChangeText={(airport) => { this.setState({ airport: airport }) }}
                                />
                                <Text>km</Text>
                            </Item>
                            <Text style={styles.loginText2}>Railway Station</Text>
                            <Item style={styles.item}>
                                <Input
                                    placeholder='Enter Distance'
                                    style={styles.input}
                                    value={this.state.railwaystation}
                                    onChangeText={(railwaystation) => { this.setState({ railwaystation: railwaystation }) }}
                                />
                                <Text>km</Text>
                            </Item>
                            <Text style={styles.loginText2}>Hospital</Text>
                            <Item style={styles.item}>
                                <Input
                                    placeholder='Enter Distance'
                                    style={styles.input}
                                    value={this.state.hospital}
                                    onChangeText={(hospital) => { this.setState({ hospital: hospital }) }}
                                />
                                <Text>km</Text>
                            </Item>
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
                            <Text style={styles.loginText2}>No of Units</Text>
                            <Item style={styles.item}>
                                <Input
                                    placeholder='Enter No Of Units'
                                    style={styles.input}
                                    value={this.state.builtup}
                                    onChangeText={(builtup) => { this.setState({ builtup: builtup }) }}
                                />
                            </Item>
                            <Text style={styles.loginText2}>Sq.ft Price</Text>
                            <Item style={styles.item}>
                                <Input
                                    placeholder='Enter Sq.ft Price'
                                    style={styles.input}
                                    value={this.state.sqftprice}
                                    keyboardType='number-pad'
                                    onChangeText={(sqftprice) => { this.setState({ sqftprice: sqftprice }) }}
                                />
                            </Item>
                            <Text style={styles.loginText2}>Width of Road Facing the Plot</Text>
                            <Item style={styles.item}>
                                <Input
                                    placeholder='Enter Here'
                                    style={styles.input}
                                    value={this.state.roadDistance}
                                    onChangeText={(roadDistance) => { this.setState({ roadDistance: roadDistance }) }}
                                />
                            </Item>

                            <Text style={styles.loginText2}>Floors Allowed For Construction</Text>
                            <Item style={styles.item}>
                                <Input
                                    placeholder='Enter Here'
                                    style={styles.input}
                                    value={this.state.floors_allowed}
                                    onChangeText={(floors_allowed) => { this.setState({ floors_allowed: floors_allowed }) }}
                                />
                            </Item>
                        </View>
                    </View>
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
                            <TouchableWithoutFeedback onPress={this.goToStep2}>
                                <Image source={require('../assets/back_icon.png')} resizeMode='contain' />
                            </TouchableWithoutFeedback>
                            <Text style={styles.headerText}>{this.state.register_type_id == "9" ? "Step2" : "Step3"}</Text>
                        </View>
                        <View style={{ borderBottomWidth: 0.5, marginTop: "3%", elevation: 1, borderBottomColor: "#F0F0F0" }}></View>
                    </View>
                }

                <Content style={{ margin: 2 }}>
                    {this.renderData()}
                </Content>
                {this.state.property_post_status == 1 ?
                    <TouchableWithoutFeedback onPress={this.goToStep4}>
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
                        <TouchableWithoutFeedback onPress={this.goToStep2}>
                            <View style={{ flexDirection: "row", marginLeft: "3%", alignItems: "center" }}>
                                <Icon name="angle-left" type="FontAwesome" style={styles.locicon} />
                                <Text style={styles.submitText1}>Back</Text>
                            </View>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback onPress={this.goToStep4}>
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
    buttonText: {
        alignItems: "center"
    },
    locicon: {
        fontSize: 25,
        color: '#E5E5E5',
    },
    dash: {
        width: 1,
        flexDirection: 'column',
        left: 25,
        marginTop: "15%",
    },
    image: {
        right: 10
    },
    row: {
        flexDirection: "row",
    },
    space: {
        flexDirection: "row",
        width: wp('15'),
    },
    row1: {
        flexDirection: "row",
        justifyContent: "space-between"
    },
    view: {
        marginTop: "5%",
        margin: 2,
        right: 20
    },
    TitleText: {
        color: "#81007F",
        fontSize: 17,
        fontFamily: 'Ubuntu-Medium',
        marginTop: hp('4')
    },
    loginText2: {
        color: "#474747",
        fontSize: 16,
        fontFamily: 'Ubuntu-Medium',
        marginTop: "10%"
    },
    loginText22: {
        color: "#ff1a75",
        fontSize: 15,
        fontFamily: 'Ubuntu-Medium',
        marginTop: "8%",
        marginBottom: "4%"
    },
    loginText3: {
        color: "#474747",
        fontSize: 16,
        fontFamily: 'Ubuntu-Medium',
        marginTop: "2%",
        marginRight: "40%"
    },
    submitText1: {
        fontSize: 17,
        color: '#fff',
        marginLeft: "15%",
        fontFamily: 'Ubuntu-Medium',
    },
    submitText2: {
        fontSize: 16,
        color: '#81007F',
        marginRight: "8%",
        fontFamily: 'Ubuntu-Medium',
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
        // width: "80%",
    },
    item1: {
        borderBottomWidth: 0.8,
        borderBottomColor: '#000',
        marginTop: "4%"
    },
    input: {
        //fontFamily: 'Ubuntu-Regular',
        fontSize: 16,
        marginTop: "1%",
    },
    buttonContainer1: {
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#F3F3F3',
        width: '70%',
        borderRadius: 25,
        flexDirection: "row"
    },
    submitText: {
        fontFamily: 'Roboto-Bold',
        fontSize: 15,
        color: '#000000',
        marginLeft: "5%"
    },
    pickerStyle: {
        width: "100%",
        color: '#344953',
        justifyContent: 'center',
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
    buttonContainer4: {
        width: wp('18'),
        height: hp('4.5'),
        backgroundColor: '#F5F5F5',
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        margin: 5
    },
    buttonContainer123: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#81007F',
        width: wp('50'),
        padding: '3%',
        borderRadius: 15,
        alignSelf: "center"
    },
    submitText123: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 14,
        color: '#fff'
    },
    modal: {
        backgroundColor: "#fff",
        borderRadius: 20,
    },
    picker11: {
        borderWidth: 1.8,
        borderColor: "#717171",
        borderRadius: 28,
        width: wp('78'),
        margin: hp('1'),
        fontSize: 12,
        fontFamily: 'Poppins-SemiBold',
        color: '#717171',
        paddingLeft: wp('2.5')
    },
})