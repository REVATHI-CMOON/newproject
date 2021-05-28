import React from 'react';
import { StyleSheet, View, Image, Text, TouchableWithoutFeedback, Picker, TouchableNativeFeedback, Platform, TextInput, Dimensions, StatusBar } from 'react-native';
import {
    Container,
    Content,
    Header,
    Left,
    Right,
    Body,
    Drawer,
    Icon,
    Footer,
    Textarea,
    Card, Item, Input, Toast,
} from 'native-base';
import Modal from 'react-native-modal';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Dash from 'react-native-dash';
import { ScrollView } from "react-native-gesture-handler";
import AsyncStorage from '@react-native-community/async-storage';
import qs from 'qs';
import YearPicker from '../componets/YearPicker';
const baseUrl = "http://demoworks.in/php/mypropertree/api/dashboard/";
const baseUrl1 = "http://demoworks.in/php/mypropertree/api/common/";
export default class Step4 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            owner: '',
            mobile: '',
            watsapp: '',
            email: '',
            loading: false,
            furnished: '',
            user_id: '',
            property_post_status: "",
            selectedid: 1,
            Furnished: [],
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
            SaleTypes: [
                {
                    "id": "1",
                    "option_value": "Resale"
                },
                {
                    "id": "2",
                    "option_value": "New sale"
                }
            ],
            projectstatus: "",
            saletype: "",
            selectedFurnished: [],
            register_type_id: "",
            TenentType: [],
            extra_rooms: [],
            Floors: [],
            tenent: "",
            isSelected: true,
            add: true,
            Delete: [],
            delete: false,
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
            addBhk: "",
            addFacing: "",
            addsqft: "",
            addVariants: [],
            pos: "",
            maintenance: "",
            securityDeposit: [],
            securityDeposite: "",
            availability: "",
            preference: "",
            hospital: "",
            airport: "",
            park: "",
            busstop: "",
            railwayStation: "",
            school: "",
            property_age: "",
            price: "",
            extraroom: "",
            floors: "",
            sqftprice: "",
            no_of_towers: "",
            floors_allowed: "",
            text1: "",
            text2: "",
            text3: "",
            builtup1: "",
            price1: '',
            sqftprice1: "",
            furnished1: "",
            extraroom1: "",
            builtup_area1: "",
            pharmacy: "",
            groceryStore: "",
            mf: [],
            hf: [],
            value: "",
            apartf: [],
            selectedExtraRooms: [],
            selectedExtraRooms1: [],
            rent_per_month: ""
        }
    }
    componentDidMount() {
        AsyncStorage.getItem('user_id').then((user_id) => {
            this.getDetails(this.props.route.params.property_id, user_id),
                this.setState({ user_id: user_id });
        })
        AsyncStorage.getItem('register_type_id').then((register_type_id) => {
            this.setState({ register_type_id: register_type_id })
        })
        this.getDropdownList();
        this.generateArrayOfYears();
    }
    getDropdownList = () => {
        this.setState({
            loading: true,
        })
        fetch(baseUrl1 + 'property_dropdowns_list', {
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
                        TenentType: json.data.tenant_types,
                        extra_rooms: json.data.extra_rooms,
                        Floors: json.data.floors,
                        loading: false,
                        Furnished: json.data.furniture_type,
                        securityDeposit: json.data.security_deposit
                    });
                } else {
                    this.setState({ loading: false });
                }
            })
            .catch((error) => {
                this.setState({ loading: false });
            });
    }
    getDetails = (id, user_id) => {
        this.setState({ loading: true });
        fetch(baseUrl + 'edit_property/', {
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
                    let extArr = [];
                    var extraroom = json.data.extrarooms;
                    extraroom.map((item, index) => {
                        extArr.push(item.id);
                    });
                    let ext1Arr = [];
                    var extraroom1 = json.data.extrarooms1;
                    extraroom1.map((item, index) => {
                        ext1Arr.push(item.id);
                    });
                    this.setState({
                        property_post_status: json.data.property_post_status,
                        price: json.data.price,
                        saletype: json.data.sale_type,
                        property_age: json.data.property_age,
                        projectstatus: json.data.sale_status,
                        pos: json.data.pos_date,
                        maintenance: json.data.maintenance,
                        securityDeposite: json.data.security_deposite,
                        availability: json.data.availability,
                        preference: json.data.tenant_type,
                        hospital: json.data.hospital,
                        school: json.data.school,
                        busstop: json.data.bus_stop,
                        groceryStore: json.data.grocery_store,
                        pharmacy: json.data.pharmacy,
                        park: json.data.park,
                        furnished: json.data.furniture_type,
                        selectedExtraRooms: extArr,
                        floors: json.data.floors,
                        mf: json.data.variants,
                        builtup: json.data.builtup_area,
                        sqftprice: json.data.sqft_price,
                        no_of_towers: json.data.no_of_towers,
                        floors_allowed: json.data.floors_allowed,
                        builtup1: json.data.builtup_area1,
                        sqftprice1: json.data.sqft_price1,
                        price1: json.data.price1,
                        furnished1: json.data.furniture_type1,
                        selectedExtraRooms1: ext1Arr,
                        apartf: json.data.variants1,
                        selectedid: json.data.gtype,
                        airport: json.data.airport,
                        railwayStation: json.data.railway_station,
                        hf: json.data.highlights,
                        rent_per_month: json.data.rent_per_month
                    })
                }
            })
            .catch((error) => {
                this.setState({ loading: false });
                console.error(error);
            });
    }
    passValue = (id) => {
        this.setState({ selectedid: id })
    }
    goToStep5 = () => {
        this.setState({ loading: true });
        fetch(baseUrl + 'property_post_step4', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'content-type': 'application/x-www-form-urlencoded',
            },
            body: qs.stringify({
                user_id: this.state.user_id,
                property_id: this.props.route.params.property_id,
                price: this.state.price,
                sale_type: this.state.saletype,
                property_age: this.state.property_age,
                sale_status: this.state.projectstatus,
                pos_date: this.state.pos,
                maintenance: this.state.maintenance,
                security_deposite: this.state.securityDeposite,
                availability: this.state.availability,
                tenant_type: this.state.preference,
                hospital: this.state.hospital,
                school: this.state.school,
                bus_stop: this.state.busstop,
                grocery_store: this.state.groceryStore,
                pharmacy: this.state.pharmacy,
                park: this.state.park,
                furniture_type: this.state.furnished,
                extrarooms: this.state.selectedExtraRooms.join(','),
                floors: this.state.floors,
                variants: this.state.mf,
                builtup_area: this.state.builtup,
                sqft_price: this.state.sqftprice,
                no_of_towers: this.state.no_of_towers,
                floors_allowed: this.state.floors_allowed,
                builtup_area1: this.state.builtup1,
                sqft_price1: this.state.sqftprice1,
                price1: this.state.price1,
                furniture_type1: this.state.furnished1,
                extrarooms1: this.state.selectedExtraRooms1.join(','),
                variants1: this.state.apartf,
                gtype: this.state.selectedid,
                airport: this.state.airport,
                railway_station: this.state.railwayStation,
                highlights: this.state.hf,
                rent_per_month: this.state.rent_per_month
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
                        this.props.navigation.navigate('Step6', { property_id: json.property_id, type: json.type, sub_type: json.sub_type })
                }
            })
            .catch((error) => {
                this.setState({ loading: false });
                console.error(error);
            });
    }
    goToStep3 = () => {
        this.props.navigation.navigate('Step3', { property_id: this.props.route.params.property_id, type: this.props.route.params.type, sub_type: this.props.route.params.sub_type })
    }
    Add = () => {
        let tempArr = this.state.mf
        var obj = {
            bedrooms: this.state.addBhk,
            facing: this.state.addFacing,
            size: this.state.addsqft
        }
        tempArr.push(obj);
        this.setState({ mf: tempArr })
    }
    AddApartments = () => {
        let tempArr = this.state.apartf
        var obj = {
            bedrooms: this.state.addBhk,
            facing: this.state.addFacing,
            size: this.state.addsqft
        }
        tempArr.push(obj);
        this.setState({ apartf: tempArr })
    }
    AddHighLights = () => {
        let tempArr = this.state.hf
        var obj = {
            value: this.state.value
        }
        tempArr.push(obj);
        this.setState({ hf: tempArr })
    }
    RemoveHighLights = (index, id) => {
        let tempArr = this.state.hf;
        var index = tempArr.indexOf(index)
        tempArr.splice(index);
        this.setState({ hf: tempArr })
    }
    RemoveApartments = (index, id) => {
        let tempArr = this.state.apartf;
        var index = tempArr.indexOf(index)
        tempArr.splice(index);
        this.setState({ apartf: tempArr })
    }
    Remove = (index, id) => {
        let tempArr = this.state.mf;
        var index = tempArr.indexOf(index)
        tempArr.splice(index);
        this.setState({ mf: tempArr })
    }
    handleHighLights = (value, index) => {
        let tempArr = this.state.hf;
        tempArr[index].value = value;
        this.setState({ hf: tempArr })
    }
    handleNoofBhk = (value, index) => {
        let tempArr = this.state.mf;
        tempArr[index].bedrooms = value;
        this.setState({ mf: tempArr })
    }
    handleNoofBhk1 = (value, index) => {
        let tempArr = this.state.apartf;
        tempArr[index].bedrooms = value;
        this.setState({ apartf: tempArr })
    }
    handleChangeFacing = (value, index) => {
        let tempArr = this.state.mf;
        tempArr[index].facing = value;
        this.setState({ mf: tempArr })
    }
    handleChangeFacing1 = (value, index) => {
        let tempArr = this.state.apartf;
        tempArr[index].facing = value;
        this.setState({ apartf: tempArr })
    }
    handleChangeSize = (value, index) => {
        let tempArr = this.state.mf;
        tempArr[index].size = value;
        this.setState({ mf: tempArr })
    }
    handleChangeSize1 = (value, index) => {
        let tempArr = this.state.apartf;
        tempArr[index].size = value;
        this.setState({ apartf: tempArr })
    }
    PushExtraRooms = (id) => {
        let tempArr = this.state.selectedExtraRooms;
        if (tempArr.includes(id)) {
            var index = tempArr.indexOf(id)
            if (index !== -1) {
                tempArr.splice(index, 1);
            }
        } else {
            tempArr.push(id)
        }
        this.setState({ selectedExtraRooms: tempArr })
    }
    PushExtraRooms1 = (id) => {
        let tempArr = this.state.selectedExtraRooms1;
        if (tempArr.includes(id)) {
            var index = tempArr.indexOf(id)
            if (index !== -1) {
                tempArr.splice(index, 1);
            }
        } else {
            tempArr.push(id)
        }
        this.setState({ selectedExtraRooms1: tempArr })
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

                                    {
                                        this.props.route.params.type == 1 &&
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
                                            <Text style={styles.loginText2}>Sale Type</Text>
                                            <Item style={styles.item}>
                                                <Picker
                                                    style={styles.pickerStyle}
                                                    selectedValue={this.state.saletype}
                                                    onValueChange={(itemValue, itemIndex) => this.setState({ saletype: itemValue })}>
                                                    <Picker.Item label="Select" value="" />
                                                    {
                                                        this.state.SaleTypes.map((item, key) =>
                                                            <Picker.Item label={item.option_value} value={item.id} key={key} />
                                                        )
                                                    }
                                                </Picker>
                                            </Item>
                                            {
                                                this.state.saletype == 1 &&
                                                <View>
                                                    <Text style={styles.loginText2}>Age of the property</Text>
                                                    <Item style={styles.item}>
                                                        <Input
                                                            placeholder='Enter Age of the property'
                                                            style={styles.input}
                                                            value={this.state.property_age}
                                                            onChangeText={(property_age) => { this.setState({ property_age: property_age }) }}
                                                        />
                                                    </Item>
                                                </View>
                                            }
                                            {
                                                this.state.saletype == 2 &&
                                                <View>
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
                                                            <Item style={styles.item}>
                                                                <TouchableWithoutFeedback onPress={() => this.setState({ isVisible: true })}>
                                                                    <Text style={{ fontSize: 15 }}>{this.state.pos ? this.state.pos : "Select date"}</Text>
                                                                </TouchableWithoutFeedback>
                                                                {/* <Input
                                                                    placeholder='Enter Possession date'
                                                                    style={styles.input}""
                                                                    value={this.state.pos}
                                                                    onChangeText={(pos) => { this.setState({ pos: pos }) }}
                                                                /> */}
                                                            </Item>
                                                        </View>
                                                    }

                                                </View>
                                            }

                                        </View>
                                    }
                                    {
                                        this.props.route.params.type == 2 &&
                                        <View>
                                            <Text style={styles.loginText2}>Rent</Text>
                                            <Item style={styles.item}>
                                                <Input
                                                    placeholder='Enter Rent'
                                                    style={styles.input}
                                                    value={this.state.price}
                                                    keyboardType='number-pad'
                                                    onChangeText={(price) => { this.setState({ price: price }) }}
                                                />
                                            </Item>
                                            <Text style={styles.loginText2}>Maintenance</Text>
                                            <Item style={styles.item}>
                                                <Input
                                                    placeholder='Enter maintenance'
                                                    style={styles.input}
                                                    value={this.state.maintenance}
                                                    keyboardType='number-pad'
                                                    onChangeText={(maintenance) => { this.setState({ maintenance: maintenance }) }}
                                                />
                                            </Item>
                                            <Text style={styles.loginText2}>Security Deposit</Text>
                                            <Item style={styles.item}>
                                                <Picker
                                                    style={styles.pickerStyle}
                                                    selectedValue={this.state.securityDeposite}
                                                    onValueChange={(itemValue, itemIndex) => this.setState({ securityDeposite: itemValue })}>
                                                    <Picker.Item label="Select" value="" />
                                                    {
                                                        this.state.securityDeposit.map((item, key) =>
                                                            <Picker.Item label={item.option_value} value={item.id} key={key} />
                                                        )
                                                    }
                                                </Picker>
                                            </Item>
                                            <Text style={styles.loginText2}>Availability</Text>
                                            <Item style={styles.item}>
                                                <Input
                                                    placeholder='Enter availability'
                                                    style={styles.input}
                                                    value={this.state.availability}
                                                    // keyboardType='number-pad'
                                                    onChangeText={(availability) => { this.setState({ availability: availability }) }}
                                                />
                                            </Item>
                                            <Text style={styles.loginText2}>Preference</Text>
                                            <Item style={styles.item}>
                                                <Picker
                                                    style={styles.pickerStyle}
                                                    selectedValue={this.state.preference}
                                                    onValueChange={(itemValue, itemIndex) => this.setState({ preference: itemValue })}>
                                                    <Picker.Item label="Select" value="" />
                                                    {
                                                        this.state.TenentType.map((item, key) =>
                                                            <Picker.Item label={item.option_value} value={item.id} key={key} />
                                                        )
                                                    }
                                                </Picker>
                                            </Item>
                                        </View>
                                    }
                                </View>
                            }
                            {
                                this.props.route.params.sub_type == 74 &&
                                <View>
                                    <View>
                                        <Text style={styles.loginText22}>
                                            Near By Places (Distance From) in KM :
                                    </Text>
                                    </View>
                                    <View style={styles.row1}>
                                        <Text style={styles.loginText5}>Hospital</Text>
                                        <Text style={styles.loginText31}>Grocery Store</Text>
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
                                                value={this.state.groceryStore}
                                                onChangeText={(groceryStore) => { this.setState({ groceryStore: groceryStore }) }}
                                            />
                                        </Item>
                                    </View>
                                    <View style={styles.row1}>
                                        <Text style={styles.loginText5}>Park</Text>
                                        <Text style={styles.loginText3}>Bus Stop</Text>
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
                                        <Text style={styles.loginText5}>Pharmacy</Text>
                                        <Text style={styles.loginText31}>School</Text>
                                    </View>
                                    <View style={styles.row1}>
                                        <Item style={styles.item1}>
                                            <Input
                                                style={styles.input}
                                                value={this.state.pharmacy}
                                                onChangeText={(pharmacy) => { this.setState({ pharmacy: pharmacy }) }}
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
                                </View>
                            }
                            {
                                (this.props.route.params.sub_type == 119 || this.props.route.params.sub_type == 120) &&
                                <View>
                                    <Text style={styles.loginText2}>Sale Type</Text>
                                    <Item style={styles.item}>
                                        <Picker
                                            style={styles.pickerStyle}
                                            selectedValue={this.state.saletype}
                                            onValueChange={(itemValue, itemIndex) => this.setState({ saletype: itemValue })}>
                                            <Picker.Item label="Select" value="" />
                                            {
                                                this.state.SaleTypes.map((item, key) =>
                                                    <Picker.Item label={item.option_value} value={item.id} key={key} />
                                                )
                                            }
                                        </Picker>
                                    </Item>

                                    {
                                        this.state.saletype == 1 &&
                                        <View>
                                            <Text style={styles.loginText2}>Age of the property</Text>
                                            <Item style={styles.item}>
                                                <Input
                                                    placeholder='Enter Age of the property'
                                                    style={styles.input}
                                                    value={this.state.property_age}
                                                    onChangeText={(property_age) => { this.setState({ property_age: property_age }) }}
                                                />
                                            </Item>
                                        </View>
                                    }
                                    {
                                        this.props.route.params.type == 2 &&
                                        <View>
                                            <Text style={styles.loginText2}>Monthly Rent</Text>
                                            <Item style={styles.item}>
                                                <Input
                                                    placeholder='Enter Rent'
                                                    style={styles.input}
                                                    value={this.state.rent_per_month}
                                                    keyboardType='number-pad'
                                                    onChangeText={(rent_per_month) => { this.setState({ rent_per_month: rent_per_month }) }}
                                                />
                                            </Item>
                                            <Text style={styles.loginText2}>Maintenance</Text>
                                            <Item style={styles.item}>
                                                <Input
                                                    placeholder='Enter maintenance'
                                                    style={styles.input}
                                                    value={this.state.maintenance}
                                                    keyboardType='number-pad'
                                                    onChangeText={(maintenance) => { this.setState({ maintenance: maintenance }) }}
                                                />
                                            </Item>
                                            <Text style={styles.loginText2}>Security Deposit</Text>
                                            <Item style={styles.item}>
                                                <Picker
                                                    style={styles.pickerStyle}
                                                    selectedValue={this.state.securityDeposite}
                                                    onValueChange={(itemValue, itemIndex) => this.setState({ securityDeposite: itemValue })}>
                                                    <Picker.Item label="Select" value="" />
                                                    {
                                                        this.state.securityDeposit.map((item, key) =>
                                                            <Picker.Item label={item.option_value} value={item.id} key={key} />
                                                        )
                                                    }
                                                </Picker>
                                            </Item>
                                        </View>
                                    }

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
                            <Text style={styles.loginText2}>Extra Rooms</Text>
                            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                                {
                                    this.state.extra_rooms.map((item, key) => {
                                        return (
                                            <TouchableWithoutFeedback onPress={() => this.PushExtraRooms(item.id)}>
                                                <View style={{ flexDirection: 'row', width: wp('35'), margin: '1.2%', }}>
                                                    <View>
                                                        <View style={this.state.selectedExtraRooms.includes(item.id) ? styles.buttonContainer22 : styles.buttonContainer11}>
                                                            <Text style={styles.buttonText}>{item.option_value}</Text>
                                                        </View>
                                                    </View>
                                                </View>
                                            </TouchableWithoutFeedback>
                                        )
                                    })
                                }
                            </View>
                            {
                                this.props.route.params.sub_type == 75 &&
                                <View>
                                    <Text style={styles.loginText2}>Floors</Text>
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

                            <Text style={styles.loginText2}>Furnished Status</Text>
                            <Item style={styles.item}>
                                <Picker
                                    style={styles.pickerStyle}
                                    selectedValue={this.state.furnished}
                                    onValueChange={(itemValue, itemIndex) => this.setState({ furnished: itemValue })}>
                                    <Picker.Item label="Select" value="" />
                                    {
                                        this.state.Furnished.map((item, key) =>
                                            <Picker.Item label={item.option_value} value={item.id} key={key} />
                                        )
                                    }
                                </Picker>
                            </Item>
                            <View style={{ flexDirection: "row", }}>
                                <Text style={styles.loginText2}>Add Property Details</Text>
                                <TouchableWithoutFeedback onPress={this.Add}>
                                    <View style={{ alignSelf: "flex-end", marginLeft: wp('5'), backgroundColor: "#81007F", width: wp('20'), padding: hp('1'), marginTop: hp('3'), borderRadius: 10, flexDirection: "row", justifyContent: "space-evenly" }}>
                                        <Icon name="plus-circle" type="FontAwesome" style={{ color: "#fff", fontSize: 18 }} />
                                        <Text style={{ color: "#fff", fontSize: 15, fontFamily: "Poppins-bold", alignSelf: "center" }} >ADD</Text>
                                    </View>
                                </TouchableWithoutFeedback>
                            </View>

                            <View style={{ marginTop: hp('2') }}>

                                {
                                    this.state.mf.map((item, index) => {
                                        return (
                                            <Card style={{ padding: hp('1'), borderRadius: 8 }}>
                                                <View style={{ alignSelf: "flex-end" }}>
                                                    <Icon onPress={() => { this.Remove(index) }} name="trash" type="FontAwesome" style={{ color: "red", fontSize: 25 }} />
                                                </View>
                                                <View style={{ flexDirection: "row" }}>
                                                    <View>
                                                        <Item style={styles.item3}>
                                                            <Input
                                                                keyboardType="phone-pad"
                                                                placeholder='No of Bhk'
                                                                style={styles.input}
                                                                value={item.bedrooms}
                                                                onChangeText={(value) => { this.handleNoofBhk(value, index) }}
                                                            />
                                                        </Item>
                                                    </View>
                                                    <View>
                                                        <Item style={styles.item3}>
                                                            <Input
                                                                placeholder='Facing'
                                                                style={styles.input}
                                                                value={item.facing}
                                                                onChangeText={(value) => { this.handleChangeFacing(value, index) }}
                                                            />
                                                        </Item>
                                                    </View>
                                                    <View>
                                                        <Item style={styles.item3}>
                                                            <Input
                                                                keyboardType="phone-pad"
                                                                placeholder='Sq ft'
                                                                style={styles.input}
                                                                value={item.size}
                                                                onChangeText={(value) => { this.handleChangeSize(value, index) }}
                                                            />
                                                        </Item>
                                                    </View>
                                                </View>
                                            </Card>
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
                            {
                                (this.props.route.params.sub_type == 75 || this.props.route.params.sub_type == 76) &&
                                <View>
                                    <Text style={styles.loginText2}>No of Units</Text>
                                    <Item style={styles.item}>
                                        <Input
                                            placeholder='Enter Here'
                                            style={styles.input}
                                            value={this.state.builtup}
                                            onChangeText={(builtup) => { this.setState({ builtup: builtup }) }}
                                        />
                                    </Item>
                                    <Text style={styles.loginText2}>Starting Price</Text>
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
                                    <Text style={styles.loginText2}>Furnished Status</Text>
                                    <Item style={styles.item}>
                                        <Picker
                                            style={styles.pickerStyle}
                                            selectedValue={this.state.furnished}
                                            onValueChange={(itemValue, itemIndex) => this.setState({ furnished: itemValue })}>
                                            <Picker.Item label="Select" value="" />
                                            {
                                                this.state.Furnished.map((item, key) =>
                                                    <Picker.Item label={item.option_value} value={item.id} key={key} />
                                                )
                                            }
                                        </Picker>
                                    </Item>
                                    <Text style={styles.loginText2}>Extra Rooms</Text>
                                    <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                                        {
                                            this.state.extra_rooms.map((item, key) => {
                                                return (
                                                    <TouchableWithoutFeedback onPress={() => this.PushExtraRooms(item.id)}>
                                                        <View style={{ flexDirection: 'row', width: wp('35'), margin: '1.2%', }}>
                                                            <View>
                                                                <View style={this.state.selectedExtraRooms.includes(item.id) ? styles.buttonContainer22 : styles.buttonContainer11}>
                                                                    <Text style={styles.buttonText}>{item.option_value}</Text>
                                                                </View>
                                                            </View>
                                                        </View>
                                                    </TouchableWithoutFeedback>
                                                )
                                            })
                                        }
                                    </View>

                                    {
                                        this.props.route.params.sub_type == 75 &&
                                        <View>
                                            <Text style={styles.loginText2}>No of towers</Text>
                                            <Item style={styles.item}>
                                                <Input
                                                    placeholder='Enter No of towers'
                                                    style={styles.input}
                                                    value={this.state.no_of_towers}
                                                    keyboardType='number-pad'
                                                    onChangeText={(no_of_towers) => { this.setState({ no_of_towers: no_of_towers }) }}
                                                />
                                            </Item>
                                            <Text style={styles.loginText2}>No of floors for tower</Text>
                                            <Item style={styles.item}>
                                                <Input
                                                    placeholder='Enter No of floors for tower'
                                                    style={styles.input}
                                                    value={this.state.floors_allowed}
                                                    keyboardType='number-pad'
                                                    onChangeText={(floors_allowed) => { this.setState({ floors_allowed: floors_allowed }) }}
                                                />
                                            </Item>
                                        </View>
                                    }
                                    <View style={{ flexDirection: "row", }}>
                                        <Text style={styles.loginText2}>Add Property Details</Text>
                                        <TouchableWithoutFeedback onPress={this.Add}>
                                            <View style={{ alignSelf: "flex-end", marginLeft: wp('5'), backgroundColor: "#81007F", width: wp('20'), padding: hp('1'), marginTop: hp('3'), borderRadius: 10, flexDirection: "row", justifyContent: "space-evenly" }}>
                                                <Icon name="plus-circle" type="FontAwesome" style={{ color: "#fff", fontSize: 18 }} />
                                                <Text style={{ color: "#fff", fontSize: 15, fontFamily: "Poppins-bold", alignSelf: "center" }} >ADD</Text>
                                            </View>
                                        </TouchableWithoutFeedback>
                                    </View>

                                    <View style={{ marginTop: hp('2') }}>

                                        {
                                            this.state.mf.map((item, index) => {
                                                return (
                                                    <Card style={{ padding: hp('1'), borderRadius: 8 }}>
                                                        <View style={{ alignSelf: "flex-end" }}>
                                                            <Icon onPress={() => { this.Remove(index) }} name="trash" type="FontAwesome" style={{ color: "red", fontSize: 25 }} />
                                                        </View>
                                                        <View style={{ flexDirection: "row" }}>
                                                            <View>
                                                                <Item style={styles.item3}>
                                                                    <Input
                                                                        placeholder='No of Bhk'
                                                                        keyboardType="phone-pad"
                                                                        style={styles.input}
                                                                        value={item.bedrooms}
                                                                        onChangeText={(value) => { this.handleNoofBhk(value, index) }}
                                                                    />
                                                                </Item>
                                                            </View>
                                                            <View>
                                                                <Item style={styles.item3}>
                                                                    <Input
                                                                        placeholder='Facing'
                                                                        style={styles.input}
                                                                        value={item.facing}
                                                                        onChangeText={(value) => { this.handleChangeFacing(value, index) }}
                                                                    />
                                                                </Item>
                                                            </View>
                                                            <View>
                                                                <Item style={styles.item3}>
                                                                    <Input
                                                                        placeholder='Sq ft'
                                                                        keyboardType="phone-pad"
                                                                        style={styles.input}
                                                                        value={item.size}
                                                                        onChangeText={(value) => { this.handleChangeSize(value, index) }}
                                                                    />
                                                                </Item>
                                                            </View>
                                                        </View>
                                                    </Card>
                                                )
                                            })
                                        }
                                    </View>
                                </View>
                            }
                            {
                                this.props.route.params.sub_type == 128 &&
                                <View>
                                    <View>
                                        <Text style={styles.loginText22}>
                                            Villa
                                    </Text>
                                        <Text style={styles.loginText2}>No of Units</Text>
                                        <Item style={styles.item}>
                                            <Input
                                                placeholder='Enter No of Units'
                                                style={styles.input}
                                                value={this.state.builtup}
                                                onChangeText={(builtup) => { this.setState({ builtup: builtup }) }}
                                            />
                                        </Item>
                                        <Text style={styles.loginText2}>Starting Price</Text>
                                        <Item style={styles.item}>
                                            <Input
                                                placeholder='Enter Starting Price'
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
                                        <Text style={styles.loginText2}>Furnished Status</Text>
                                        <Item style={styles.item}>
                                            <Picker
                                                style={styles.pickerStyle}
                                                selectedValue={this.state.furnished}
                                                onValueChange={(itemValue, itemIndex) => this.setState({ furnished: itemValue })}>
                                                <Picker.Item label="Select" value="" />
                                                {
                                                    this.state.Furnished.map((item, key) =>
                                                        <Picker.Item label={item.option_value} value={item.id} key={key} />
                                                    )
                                                }
                                            </Picker>
                                        </Item>
                                        <Text style={styles.loginText2}>Extra Rooms</Text>
                                        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                                            {
                                                this.state.extra_rooms.map((item, key) => {
                                                    return (
                                                        <TouchableWithoutFeedback onPress={() => this.PushExtraRooms(item.id)}>
                                                            <View style={{ flexDirection: 'row', width: wp('35'), margin: '1.2%', }}>
                                                                <View>
                                                                    <View style={this.state.selectedExtraRooms.includes(item.id) ? styles.buttonContainer22 : styles.buttonContainer11}>
                                                                        <Text style={styles.buttonText}>{item.option_value}</Text>
                                                                    </View>
                                                                </View>
                                                            </View>
                                                        </TouchableWithoutFeedback>
                                                    )
                                                })
                                            }
                                        </View>
                                        <View style={{ flexDirection: "row", }}>
                                            <Text style={styles.loginText2}>Add Property Details</Text>
                                            <TouchableWithoutFeedback onPress={this.Add}>
                                                <View style={{ alignSelf: "flex-end", marginLeft: wp('5'), backgroundColor: "#81007F", width: wp('20'), padding: hp('1'), marginTop: hp('3'), borderRadius: 10, flexDirection: "row", justifyContent: "space-evenly" }}>
                                                    <Icon name="plus-circle" type="FontAwesome" style={{ color: "#fff", fontSize: 18 }} />
                                                    <Text style={{ color: "#fff", fontSize: 15, fontFamily: "Poppins-bold", alignSelf: "center" }} >ADD</Text>
                                                </View>
                                            </TouchableWithoutFeedback>
                                        </View>

                                        <View style={{ marginTop: hp('2') }}>

                                            {
                                                this.state.mf.map((item, index) => {
                                                    return (
                                                        <Card style={{ padding: hp('1'), borderRadius: 8 }}>
                                                            <View style={{ alignSelf: "flex-end" }}>
                                                                <Icon onPress={() => { this.Remove(index) }} name="trash" type="FontAwesome" style={{ color: "red", fontSize: 25 }} />
                                                            </View>
                                                            <View style={{ flexDirection: "row" }}>
                                                                <View>
                                                                    <Item style={styles.item3}>
                                                                        <Input
                                                                            placeholder='No of Bhk'
                                                                            keyboardType="phone-pad"
                                                                            style={styles.input}
                                                                            value={item.bedrooms}
                                                                            onChangeText={(value) => { this.handleNoofBhk(value, index) }}
                                                                        />
                                                                    </Item>
                                                                </View>
                                                                <View>
                                                                    <Item style={styles.item3}>
                                                                        <Input
                                                                            placeholder='Facing'
                                                                            style={styles.input}
                                                                            value={item.facing}
                                                                            onChangeText={(value) => { this.handleChangeFacing(value, index) }}
                                                                        />
                                                                    </Item>
                                                                </View>
                                                                <View>
                                                                    <Item style={styles.item3}>
                                                                        <Input
                                                                            placeholder='Sq ft'
                                                                            keyboardType="phone-pad"
                                                                            style={styles.input}
                                                                            value={item.size}
                                                                            onChangeText={(value) => { this.handleChangeSize(value, index) }}
                                                                        />
                                                                    </Item>
                                                                </View>
                                                            </View>
                                                        </Card>
                                                    )
                                                })
                                            }
                                        </View>
                                    </View>
                                    <View>
                                        <Text style={styles.loginText22}>
                                            Apartment
                                    </Text>
                                        <Text style={styles.loginText2}>No of towers</Text>
                                        <Item style={styles.item}>
                                            <Input
                                                placeholder='Enter No of towers'
                                                style={styles.input}
                                                value={this.state.no_of_towers}
                                                keyboardType='number-pad'
                                                onChangeText={(no_of_towers) => { this.setState({ no_of_towers: no_of_towers }) }}
                                            />
                                        </Item>
                                        <Text style={styles.loginText2}>No of floors for tower</Text>
                                        <Item style={styles.item}>
                                            <Input
                                                placeholder='Enter No of floors for tower'
                                                style={styles.input}
                                                value={this.state.floors_allowed}
                                                keyboardType='number-pad'
                                                onChangeText={(floors_allowed) => { this.setState({ floors_allowed: floors_allowed }) }}
                                            />
                                        </Item>
                                        <Text style={styles.loginText2}>No Of Units</Text>
                                        <Item style={styles.item}>
                                            <Input
                                                placeholder='Enter No Of Units'
                                                style={styles.input}
                                                value={this.state.builtup1}
                                                onChangeText={(builtup1) => { this.setState({ builtup1: builtup1 }) }}
                                            />
                                        </Item>
                                        <Text style={styles.loginText2}>Starting Price</Text>
                                        <Item style={styles.item}>
                                            <Input
                                                placeholder='Enter Starting Price'
                                                style={styles.input}
                                                value={this.state.price1}
                                                keyboardType='number-pad'
                                                onChangeText={(price1) => { this.setState({ price1: price1 }) }}
                                            />
                                        </Item>
                                        <Text style={styles.loginText2}>Sq.ft Price</Text>
                                        <Item style={styles.item}>
                                            <Input
                                                placeholder='Enter Sq.ft Price'
                                                style={styles.input}
                                                value={this.state.sqftprice1}
                                                keyboardType='number-pad'
                                                onChangeText={(sqftprice1) => { this.setState({ sqftprice1: sqftprice1 }) }}
                                            />
                                        </Item>
                                        <Text style={styles.loginText2}>Furnished Status</Text>
                                        <Item style={styles.item}>
                                            <Picker
                                                style={styles.pickerStyle}
                                                selectedValue={this.state.furnished1}
                                                onValueChange={(itemValue, itemIndex) => this.setState({ furnished1: itemValue })}>
                                                <Picker.Item label="Select" value="" />
                                                {
                                                    this.state.Furnished.map((item, key) =>
                                                        <Picker.Item label={item.option_value} value={item.id} key={key} />
                                                    )
                                                }
                                            </Picker>
                                        </Item>
                                        <Text style={styles.loginText2}>Extra Rooms</Text>
                                        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                                            {
                                                this.state.extra_rooms.map((item, key) => {
                                                    return (
                                                        <TouchableWithoutFeedback onPress={() => this.PushExtraRooms1(item.id)}>
                                                            <View style={{ flexDirection: 'row', width: wp('35'), margin: '1.2%', }}>
                                                                <View>
                                                                    <View style={this.state.selectedExtraRooms1.includes(item.id) ? styles.buttonContainer22 : styles.buttonContainer11}>
                                                                        <Text style={styles.buttonText}>{item.option_value}</Text>
                                                                    </View>
                                                                </View>
                                                            </View>
                                                        </TouchableWithoutFeedback>
                                                    )
                                                })
                                            }
                                        </View>
                                        <View style={{ flexDirection: "row", }}>
                                            <Text style={styles.loginText2}>Add Property Details</Text>
                                            <TouchableWithoutFeedback onPress={this.AddApartments}>
                                                <View style={{ alignSelf: "flex-end", marginLeft: wp('5'), backgroundColor: "#81007F", width: wp('20'), padding: hp('1'), marginTop: hp('3'), borderRadius: 10, flexDirection: "row", justifyContent: "space-evenly" }}>
                                                    <Icon name="plus-circle" type="FontAwesome" style={{ color: "#fff", fontSize: 18 }} />
                                                    <Text style={{ color: "#fff", fontSize: 15, fontFamily: "Poppins-bold", alignSelf: "center" }} >ADD</Text>
                                                </View>
                                            </TouchableWithoutFeedback>
                                        </View>

                                        <View style={{ marginTop: hp('2') }}>

                                            {
                                                this.state.apartf.map((item, index) => {
                                                    return (
                                                        <Card style={{ padding: hp('1'), borderRadius: 8 }}>
                                                            <View style={{ alignSelf: "flex-end" }}>
                                                                <Icon onPress={() => { this.RemoveApartments(index) }} name="trash" type="FontAwesome" style={{ color: "red", fontSize: 25 }} />
                                                            </View>
                                                            <View style={{ flexDirection: "row" }}>
                                                                <View>
                                                                    <Item style={styles.item3}>
                                                                        <Input
                                                                            placeholder='No of Bhk'
                                                                            keyboardType="phone-pad"
                                                                            style={styles.input}
                                                                            value={item.bedrooms}
                                                                            onChangeText={(value) => { this.handleNoofBhk1(value, index) }}
                                                                        />
                                                                    </Item>
                                                                </View>
                                                                <View>
                                                                    <Item style={styles.item3}>
                                                                        <Input
                                                                            placeholder='Facing'
                                                                            style={styles.input}
                                                                            value={item.facing}
                                                                            onChangeText={(value) => { this.handleChangeFacing1(value, index) }}
                                                                        />
                                                                    </Item>
                                                                </View>
                                                                <View>
                                                                    <Item style={styles.item3}>
                                                                        <Input
                                                                            placeholder='Sq ft'
                                                                            keyboardType="phone-pad"
                                                                            style={styles.input}
                                                                            value={item.size}
                                                                            onChangeText={(value) => { this.handleChangeSize1(value, index) }}
                                                                        />
                                                                    </Item>
                                                                </View>
                                                            </View>
                                                        </Card>
                                                    )
                                                })
                                            }
                                        </View>
                                    </View>
                                </View>
                            }
                            {
                                this.props.route.params.sub_type == 129 &&
                                <View>
                                    <Text style={styles.loginText22}>
                                        Property Types Covered in this Projects:
                                    </Text>
                                    <View style={{ flexDirection: "row", justifyContent: "space-between", }}>
                                        <TouchableWithoutFeedback onPress={() => this.passValue(1)}>
                                            <View style={{ flexDirection: "row" }}>
                                                <Icon type="FontAwesome" name={this.state.selectedid == 1 ? "dot-circle-o" : "circle-o"} style={{ fontSize: 22, color: '#81007F', marginRight: wp('1'), }} />
                                                <Text style={styles.buttonText}>Villa</Text>
                                            </View>
                                        </TouchableWithoutFeedback>
                                        <TouchableWithoutFeedback onPress={() => this.passValue(2)}>
                                            <View style={{ flexDirection: "row" }}>
                                                <Icon type="FontAwesome" name={this.state.selectedid == 2 ? "dot-circle-o" : "circle-o"} style={{ fontSize: 22, color: '#81007F', marginRight: wp('1'), }} />
                                                <Text style={styles.buttonText}>Apartment</Text>
                                            </View>
                                        </TouchableWithoutFeedback>
                                        <TouchableWithoutFeedback onPress={() => this.passValue(3)}>
                                            <View style={{ flexDirection: "row" }}>
                                                <Icon type="FontAwesome" name={this.state.selectedid == 3 ? "dot-circle-o" : "circle-o"} style={{ fontSize: 22, color: '#81007F', marginRight: wp('1'), }} />
                                                <Text style={styles.buttonText}>Residential Plots</Text>
                                            </View>
                                        </TouchableWithoutFeedback>
                                    </View>
                                    <View>
                                        {
                                            this.state.selectedid == 1 &&
                                            <View>
                                                <Text style={styles.loginText2}>No of Units</Text>
                                                <Item style={styles.item}>
                                                    <Input
                                                        placeholder='Enter No of Units'
                                                        style={styles.input}
                                                        value={this.state.builtup}
                                                        onChangeText={(builtup) => { this.setState({ builtup: builtup }) }}
                                                    />
                                                </Item>
                                                <Text style={styles.loginText2}>Starting Price</Text>
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
                                                <Text style={styles.loginText2}>Furnished Status</Text>
                                                <Item style={styles.item}>
                                                    <Picker
                                                        style={styles.pickerStyle}
                                                        selectedValue={this.state.furnished}
                                                        onValueChange={(itemValue, itemIndex) => this.setState({ furnished: itemValue })}>
                                                        <Picker.Item label="Select" value="" />
                                                        {
                                                            this.state.Furnished.map((item, key) =>
                                                                <Picker.Item label={item.option_value} value={item.id} key={key} />
                                                            )
                                                        }
                                                    </Picker>
                                                </Item>
                                                <Text style={styles.loginText2}>Extra Rooms</Text>
                                                <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                                                    {
                                                        this.state.extra_rooms.map((item, key) => {
                                                            return (
                                                                <TouchableWithoutFeedback onPress={() => this.PushExtraRooms(item.id)}>
                                                                    <View style={{ flexDirection: 'row', width: wp('35'), margin: '1.2%', }}>
                                                                        <View>
                                                                            <View style={this.state.selectedExtraRooms.includes(item.id) ? styles.buttonContainer22 : styles.buttonContainer11}>
                                                                                <Text style={styles.buttonText}>{item.option_value}</Text>
                                                                            </View>
                                                                        </View>
                                                                    </View>
                                                                </TouchableWithoutFeedback>
                                                            )
                                                        })
                                                    }
                                                </View>
                                                <View style={{ flexDirection: "row", }}>
                                                    <Text style={styles.loginText2}>Add Property Details</Text>
                                                    <TouchableWithoutFeedback onPress={this.Add}>
                                                        <View style={{ alignSelf: "flex-end", marginLeft: wp('5'), backgroundColor: "#81007F", width: wp('20'), padding: hp('1'), marginTop: hp('3'), borderRadius: 10, flexDirection: "row", justifyContent: "space-evenly" }}>
                                                            <Icon name="plus-circle" type="FontAwesome" style={{ color: "#fff", fontSize: 18 }} />
                                                            <Text style={{ color: "#fff", fontSize: 15, fontFamily: "Poppins-bold", alignSelf: "center" }} >ADD</Text>
                                                        </View>
                                                    </TouchableWithoutFeedback>
                                                </View>

                                                <View style={{ marginTop: hp('2') }}>

                                                    {
                                                        this.state.mf.map((item, index) => {
                                                            return (
                                                                <Card style={{ padding: hp('1'), borderRadius: 8 }}>
                                                                    <View style={{ alignSelf: "flex-end" }}>
                                                                        <Icon onPress={() => { this.Remove(index) }} name="trash" type="FontAwesome" style={{ color: "red", fontSize: 25 }} />
                                                                    </View>
                                                                    <View style={{ flexDirection: "row" }}>
                                                                        <View>
                                                                            <Item style={styles.item3}>
                                                                                <Input
                                                                                    placeholder='No of Bhk'
                                                                                    keyboardType="phone-pad"
                                                                                    style={styles.input}
                                                                                    value={item.bedrooms}
                                                                                    onChangeText={(value) => { this.handleNoofBhk(value, index) }}
                                                                                />
                                                                            </Item>
                                                                        </View>
                                                                        <View>
                                                                            <Item style={styles.item3}>
                                                                                <Input
                                                                                    placeholder='Facing'
                                                                                    style={styles.input}
                                                                                    value={item.facing}
                                                                                    onChangeText={(value) => { this.handleChangeFacing(value, index) }}
                                                                                />
                                                                            </Item>
                                                                        </View>
                                                                        <View>
                                                                            <Item style={styles.item3}>
                                                                                <Input
                                                                                    placeholder='Sq ft'
                                                                                    keyboardType="phone-pad"
                                                                                    style={styles.input}
                                                                                    value={item.size}
                                                                                    onChangeText={(value) => { this.handleChangeSize(value, index) }}
                                                                                />
                                                                            </Item>
                                                                        </View>
                                                                    </View>
                                                                </Card>
                                                            )
                                                        })
                                                    }
                                                </View>
                                            </View>
                                        }
                                        {
                                            this.state.selectedid == 2 &&
                                            <View>
                                                <Text style={styles.loginText2}>No of towers</Text>
                                                <Item style={styles.item}>
                                                    <Input
                                                        placeholder='Enter No of towers'
                                                        style={styles.input}
                                                        value={this.state.no_of_towers}
                                                        keyboardType='number-pad'
                                                        onChangeText={(no_of_towers) => { this.setState({ no_of_towers: no_of_towers }) }}
                                                    />
                                                </Item>
                                                <Text style={styles.loginText2}>No of floors for tower</Text>
                                                <Item style={styles.item}>
                                                    <Input
                                                        placeholder='Enter No of floors for tower'
                                                        style={styles.input}
                                                        value={this.state.floors_allowed}
                                                        keyboardType='number-pad'
                                                        onChangeText={(floors_allowed) => { this.setState({ floors_allowed: floors_allowed }) }}
                                                    />
                                                </Item>
                                                <Text style={styles.loginText2}>No of Units</Text>
                                                <Item style={styles.item}>
                                                    <Input
                                                        placeholder='Enter No of Units'
                                                        style={styles.input}
                                                        value={this.state.builtup}
                                                        onChangeText={(builtup) => { this.setState({ builtup: builtup }) }}
                                                    />
                                                </Item>
                                                <Text style={styles.loginText2}>Starting Price</Text>
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
                                                <Text style={styles.loginText2}>Furnished Status</Text>
                                                <Item style={styles.item}>
                                                    <Picker
                                                        style={styles.pickerStyle}
                                                        selectedValue={this.state.furnished}
                                                        onValueChange={(itemValue, itemIndex) => this.setState({ furnished: itemValue })}>
                                                        <Picker.Item label="Select" value="" />
                                                        {
                                                            this.state.Furnished.map((item, key) =>
                                                                <Picker.Item label={item.option_value} value={item.id} key={key} />
                                                            )
                                                        }
                                                    </Picker>
                                                </Item>
                                                <Text style={styles.loginText2}>Extra Rooms</Text>
                                                <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                                                    {
                                                        this.state.extra_rooms.map((item, key) => {
                                                            return (
                                                                <TouchableWithoutFeedback onPress={() => this.PushExtraRooms(item.id)}>
                                                                    <View style={{ flexDirection: 'row', width: wp('35'), margin: '1.2%', }}>
                                                                        <View>
                                                                            <View style={this.state.selectedExtraRooms.includes(item.id) ? styles.buttonContainer22 : styles.buttonContainer11}>
                                                                                <Text style={styles.buttonText}>{item.option_value}</Text>
                                                                            </View>
                                                                        </View>
                                                                    </View>
                                                                </TouchableWithoutFeedback>
                                                            )
                                                        })
                                                    }
                                                </View>
                                                <View style={{ flexDirection: "row", }}>
                                                    <Text style={styles.loginText2}>Add Property Details</Text>
                                                    <TouchableWithoutFeedback onPress={this.Add}>
                                                        <View style={{ alignSelf: "flex-end", marginLeft: wp('5'), backgroundColor: "#81007F", width: wp('20'), padding: hp('1'), marginTop: hp('3'), borderRadius: 10, flexDirection: "row", justifyContent: "space-evenly" }}>
                                                            <Icon name="plus-circle" type="FontAwesome" style={{ color: "#fff", fontSize: 18 }} />
                                                            <Text style={{ color: "#fff", fontSize: 15, fontFamily: "Poppins-bold", alignSelf: "center" }} >ADD</Text>
                                                        </View>
                                                    </TouchableWithoutFeedback>
                                                </View>

                                                <View style={{ marginTop: hp('2') }}>

                                                    {
                                                        this.state.mf.map((item, index) => {
                                                            return (
                                                                <Card style={{ padding: hp('1'), borderRadius: 8 }}>
                                                                    <View style={{ alignSelf: "flex-end" }}>
                                                                        <Icon onPress={() => { this.Remove(index) }} name="trash" type="FontAwesome" style={{ color: "red", fontSize: 25 }} />
                                                                    </View>
                                                                    <View style={{ flexDirection: "row" }}>
                                                                        <View>
                                                                            <Item style={styles.item3}>
                                                                                <Input
                                                                                    placeholder='No of Bhk'
                                                                                    keyboardType="phone-pad"
                                                                                    style={styles.input}
                                                                                    value={item.bedrooms}
                                                                                    onChangeText={(value) => { this.handleNoofBhk(value, index) }}
                                                                                />
                                                                            </Item>
                                                                        </View>
                                                                        <View>
                                                                            <Item style={styles.item3}>
                                                                                <Input
                                                                                    placeholder='Facing'
                                                                                    style={styles.input}
                                                                                    value={item.facing}
                                                                                    onChangeText={(value) => { this.handleChangeFacing(value, index) }}
                                                                                />
                                                                            </Item>
                                                                        </View>
                                                                        <View>
                                                                            <Item style={styles.item3}>
                                                                                <Input
                                                                                    placeholder='Sq ft'
                                                                                    keyboardType="phone-pad"
                                                                                    style={styles.input}
                                                                                    value={item.size}
                                                                                    onChangeText={(value) => { this.handleChangeSize(value, index) }}
                                                                                />
                                                                            </Item>
                                                                        </View>
                                                                    </View>
                                                                </Card>
                                                            )
                                                        })
                                                    }
                                                </View>
                                            </View>
                                        }
                                        {
                                            this.state.selectedid == 3 &&
                                            <View>
                                                <Text style={styles.loginText2}>No Of Units</Text>
                                                <Item style={styles.item}>
                                                    <Input
                                                        placeholder='Enter No of Units'
                                                        style={styles.input}
                                                        value={this.state.builtup}
                                                        onChangeText={(builtup) => { this.setState({ builtup: builtup }) }}
                                                    />
                                                </Item>
                                                <Text style={styles.loginText2}>Starting Price</Text>
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
                                                <View style={{ flexDirection: "row", }}>
                                                    <Text style={styles.loginText2}>Add Property Details</Text>
                                                    <TouchableWithoutFeedback onPress={this.Add}>
                                                        <View style={{ alignSelf: "flex-end", marginLeft: wp('5'), backgroundColor: "#81007F", width: wp('20'), padding: hp('1'), marginTop: hp('3'), borderRadius: 10, flexDirection: "row", justifyContent: "space-evenly" }}>
                                                            <Icon name="plus-circle" type="FontAwesome" style={{ color: "#fff", fontSize: 18 }} />
                                                            <Text style={{ color: "#fff", fontSize: 15, fontFamily: "Poppins-bold", alignSelf: "center" }} >ADD</Text>
                                                        </View>
                                                    </TouchableWithoutFeedback>
                                                </View>

                                                <View style={{ marginTop: hp('2') }}>

                                                    {
                                                        this.state.mf.map((item, index) => {
                                                            return (
                                                                <Card style={{ padding: hp('1'), borderRadius: 8 }}>
                                                                    <View style={{ alignSelf: "flex-end" }}>
                                                                        <Icon onPress={() => { this.Remove(index) }} name="trash" type="FontAwesome" style={{ color: "red", fontSize: 25 }} />
                                                                    </View>
                                                                    <View style={{ flexDirection: "row" }}>
                                                                        <View>
                                                                            <Item style={styles.item3}>
                                                                                <Input
                                                                                    placeholder='No of Bhk'
                                                                                    keyboardType="phone-pad"
                                                                                    style={styles.input}
                                                                                    value={item.bedrooms}
                                                                                    onChangeText={(value) => { this.handleNoofBhk(value, index) }}
                                                                                />
                                                                            </Item>
                                                                        </View>
                                                                        <View>
                                                                            <Item style={styles.item3}>
                                                                                <Input
                                                                                    placeholder='Facing'
                                                                                    style={styles.input}
                                                                                    value={item.facing}
                                                                                    onChangeText={(value) => { this.handleChangeFacing(value, index) }}
                                                                                />
                                                                            </Item>
                                                                        </View>
                                                                        <View>
                                                                            <Item style={styles.item3}>
                                                                                <Input
                                                                                    placeholder='Sq ft'
                                                                                    keyboardType="phone-pad"
                                                                                    style={styles.input}
                                                                                    value={item.size}
                                                                                    onChangeText={(value) => { this.handleChangeSize(value, index) }}
                                                                                />
                                                                            </Item>
                                                                        </View>
                                                                    </View>
                                                                </Card>
                                                            )
                                                        })
                                                    }
                                                </View>
                                            </View>
                                        }
                                    </View>

                                </View>
                            }
                        </View>
                    </View>
                </View >
            )
        }
        else if (this.state.register_type_id == 9) {
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
                                    <View style={styles.picker}>
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
                                <TouchableWithoutFeedback onPress={this.PassValue}>
                                    <View style={{ marginTop: hp('2'), marginBottom: wp('5') }}>
                                        <View style={styles.buttonContainer}>
                                            <Text style={styles.submitText}>Submit</Text>
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
                        <View style={{ width: wp('75'), }}>
                            <View>
                                <Text style={styles.TitleText}>
                                    Property Details
                                </Text>
                            </View>
                            <Text style={styles.loginText22}>
                                Near By Places (Distance From) in KM :
                                    </Text>
                            <View style={styles.row1}>
                                <Text style={styles.loginText5}>Hospital</Text>
                                <Text style={styles.loginText31}>Airport</Text>
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
                                        value={this.state.airport}
                                        onChangeText={(airport) => { this.setState({ airport: airport }) }}
                                    />
                                </Item>
                            </View>
                            <View style={styles.row1}>
                                <Text style={styles.loginText5}>Park</Text>
                                <Text style={styles.loginText3}>Bus Stop</Text>
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
                                <Text style={styles.loginText5}>Railway Station</Text>
                                <Text style={styles.loginText31}>School</Text>
                            </View>
                            <View style={styles.row1}>
                                <Item style={styles.item1}>
                                    <Input
                                        style={styles.input}
                                        value={this.state.railwayStation}
                                        onChangeText={(railwayStation) => { this.setState({ railwayStation: railwayStation }) }}
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
                            <View style={{ flexDirection: "row" }}>
                                <Text style={styles.loginText22}>
                                    Highlights  :
                                </Text>
                                <TouchableWithoutFeedback onPress={this.AddHighLights}>
                                    <View style={{ alignSelf: "flex-end", marginLeft: wp('5'), backgroundColor: "#81007F", width: wp('20'), padding: hp('1'), marginTop: hp('3'), borderRadius: 10, flexDirection: "row", justifyContent: "space-evenly" }}>
                                        <Icon name="plus-circle" type="FontAwesome" style={{ color: "#fff", fontSize: 18 }} />
                                        <Text style={{ color: "#fff", fontSize: 15, fontFamily: "Poppins-bold", alignSelf: "center" }} >ADD</Text>
                                    </View>
                                </TouchableWithoutFeedback>
                            </View>

                            <View style={{ marginTop: hp('2') }}>

                                {
                                    this.state.hf.map((item, index) => {
                                        return (
                                            <View>
                                                <Item style={styles.item2}>
                                                    <Input
                                                        style={styles.input}
                                                        value={item.value}
                                                        onChangeText={(value) => { this.handleHighLights(value, index) }}
                                                    />
                                                    <Icon onPress={() => { this.RemoveHighLights(index) }} type="FontAwesome" name={"trash"} style={{ fontSize: 15, color: 'red', marginTop: wp('5'), }} />
                                                </Item>
                                            </View>

                                        )
                                    })
                                }
                            </View>
                            <View style={{ flexDirection: "row", }}>
                                <Text style={styles.loginText2}>Add Plot Details</Text>
                                <TouchableWithoutFeedback onPress={this.Add}>
                                    <View style={{ alignSelf: "flex-end", marginLeft: wp('5'), backgroundColor: "#81007F", width: wp('20'), padding: hp('1'), marginTop: hp('3'), borderRadius: 10, flexDirection: "row", justifyContent: "space-evenly" }}>
                                        <Icon name="plus-circle" type="FontAwesome" style={{ color: "#fff", fontSize: 18 }} />
                                        <Text style={{ color: "#fff", fontSize: 15, fontFamily: "Poppins-bold", alignSelf: "center" }} >ADD</Text>
                                    </View>
                                </TouchableWithoutFeedback>
                            </View>

                            <View style={{ marginTop: hp('2') }}>

                                {
                                    this.state.mf.map((item, index) => {
                                        return (
                                            <Card style={{ padding: hp('1'), borderRadius: 8 }}>
                                                <View style={{ alignSelf: "flex-end" }}>
                                                    <Icon onPress={() => { this.Remove(index) }} name="trash" type="FontAwesome" style={{ color: "red", fontSize: 25 }} />
                                                </View>
                                                <View style={{ flexDirection: "row" }}>
                                                    <View>
                                                        <Item style={styles.item3}>
                                                            <Input
                                                                placeholder='Facing towards'
                                                                style={styles.input}
                                                                value={item.bedrooms}
                                                                onChangeText={(value) => { this.handleNoofBhk(value, index) }}
                                                            />
                                                        </Item>
                                                    </View>
                                                    <View>
                                                        <Item style={styles.item3}>
                                                            <Input
                                                                placeholder='sq yards'
                                                                style={styles.input}
                                                                value={item.facing}
                                                                onChangeText={(value) => { this.handleChangeFacing(value, index) }}
                                                            />
                                                        </Item>
                                                    </View>
                                                    <View>
                                                        <Item style={styles.item3}>
                                                            <Input
                                                                placeholder='eg: 10x12'
                                                                keyboardType="phone-pad"
                                                                style={styles.input}
                                                                value={item.size}
                                                                onChangeText={(value) => { this.handleChangeSize(value, index) }}
                                                            />
                                                        </Item>
                                                    </View>
                                                </View>
                                            </Card>
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
                            <TouchableWithoutFeedback onPress={this.goToStep3}>
                                <Image source={require('../assets/back_icon.png')} resizeMode='contain' />
                            </TouchableWithoutFeedback>
                            <Text style={styles.headerText}>{this.state.register_type_id == "9" ? "Step3" : "Step4"}</Text>
                        </View>
                    </View>
                }
                <Content style={{ margin: 2 }}>
                    {this.renderData()}
                </Content>
                {this.state.property_post_status == 1 ?
                    <TouchableWithoutFeedback onPress={this.goToStep5}>
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
                        <TouchableWithoutFeedback onPress={this.goToStep3}>
                            <View style={{ flexDirection: "row", marginLeft: "3%", alignItems: "center" }}>
                                <Icon name="angle-left" type="FontAwesome" style={styles.locicon} />
                                <Text style={styles.submitText1}>Back</Text>
                            </View>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback onPress={this.goToStep5}>
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
    content: {
        marginLeft: "8%",
        flexDirection: "row"
    },
    row1: {
        flexDirection: "row",
        justifyContent: "space-between"
    },
    row2: {
        flexDirection: "row",
    },
    item1: {
        borderBottomWidth: 0.8,
        borderBottomColor: '#000',
        width: "40%",
    },
    item2: {
        borderBottomWidth: 0.8,
        borderBottomColor: '#000',
        width: "90%",
        flexDirection: "row"
    },
    locicon: {
        fontSize: 25,
        color: '#E5E5E5',
    },
    image: {
        right: 10
    },
    pickerStyle: {
        width: "100%",
        color: '#344953',
        justifyContent: 'center',
    },
    dash: {
        width: 1,
        flexDirection: 'column',
        left: 25,
        marginTop: "15%",
    },
    row: {
        flexDirection: "row"
    },
    space: {
        flexDirection: "row",
        width: wp('15'),
    },
    TitleText: {
        color: "#81007F",
        fontSize: 18,
        fontFamily: 'Ubuntu-Medium',
        marginTop: "7%"
    },
    buttonText: {
        fontFamily: 'Ubuntu-Regular',
        alignItems: "center",
        marginLeft: wp('1'),
        marginTop: hp('0.4')
    },
    loginText2: {
        color: "#474747",
        fontSize: 16,
        fontFamily: 'Ubuntu-Medium',
        marginTop: "10%"
    },
    cardtext: {
        color: "#474747",
        fontSize: 15,
        fontFamily: 'Ubuntu-Medium',
        width: wp('22'),
        margin: wp('2')
    },
    loginText3: {
        color: "#474747",
        fontSize: 14,
        fontFamily: 'Ubuntu-Regular',
        marginTop: "5%",
        marginRight: wp('15')
    },
    loginText31: {
        color: "#474747",
        fontSize: 14,
        fontFamily: 'Ubuntu-Regular',
        marginTop: "5%",
        marginRight: wp('18')
    },

    loginText5: {
        color: "#474747",
        fontSize: 14,
        fontFamily: 'Ubuntu-Regular',
        marginTop: "5%",
    },
    loginText22: {
        color: "#ff1a75",
        fontSize: 15,
        fontFamily: 'Ubuntu-Medium',
        marginTop: "8%",
        marginBottom: "4%",
    },
    submitText1: {
        fontSize: 17,
        color: '#fff',
        marginLeft: "15%",
        fontFamily: 'Ubuntu-Bold',
    },
    submitText2: {
        fontSize: 16,
        color: '#81007F',
        fontFamily: 'Ubuntu-Bold',
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

    input: {
        // fontFamily: 'ubuntu-Regular',
        fontSize: 14,
        marginTop: "1%"
    },
    input1: {
        // fontFamily: 'ubuntu-Regular',
        fontSize: 14,
        marginTop: "1%",
        width: "30%"
    },
    item: {
        borderBottomWidth: 0.8,
        borderBottomColor: '#000',
        // width: "80%",
        height: hp('5'),
    },
    item3: {
        borderBottomWidth: 0.8,
        borderBottomColor: '#000',
        width: wp('22'),
        margin: wp('2')
    },
    buttonContainer11: {
        width: wp('30'),
        height: hp('5'),
        backgroundColor: '#fff',
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        borderColor: "#81007F",
        borderWidth: 0.7
        // padding: "5%"
    },
    buttonContainer22: {
        width: wp('30'),
        height: hp('5'),
        backgroundColor: '#d1e0e0',
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        borderColor: "#ccc",
        borderWidth: 0.7
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
})