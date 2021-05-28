import React from 'react';
import { StyleSheet, View, Image, Text, TouchableWithoutFeedback, Picker, TextInput, StatusBar } from 'react-native';
import {
    Container,
    Content, Item, Input, Toast, Icon, Card,
} from 'native-base';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import qs from 'qs';
import OTPInputView from '@twotalltotems/react-native-otp-input';
const baseUrl = "http://demoworks.in/php/mypropertree/api/common/";
export default class Services extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user_name: '',
            mobile: '',
            loading: false,
            getStates: [],
            state_id: '',
            getCity: [],
            city: "",
            getLocations: [],
            location_id: "",
            services: [],
            status: false,
            otp: "",
            oId: "",
            ButtonText: "Verify",
            location: "fail",
            selectedServices: [],
            passSelectedService: "",
            Language: [],
            selectedNewsLanguages: [],
            pushSelectedNewsLanguage: "",
            NewsPaper: [],
            pushSelectedPapers: "",
            selectedPapers: [],
            selectedMagLanguages: [],
            pushSelectedMagLanguage: "",
            magCategory: [],
            selectedMagCategories: [],
            pushSelectedMagCategories: "",
            Magazines: [],
            selectedMagazineIds: [],
            pushSelectedMagazineIds: "",
            selectedMilkBrands: [],
            pushSelectedMilkBrands: "",
            Milk: [],
            Fibernet: [],
            selectedFibernet: [],
            pushSelectedFibernet: ""
        }
    }
    goToHome = () => {
        this.props.navigation.navigate('Home')
    }
    componentDidMount() {
        this.getStates();
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
    getLocation = (city_id) => {
        fetch(baseUrl + 'get_city_wise_locations', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'content-type': 'application/x-www-form-urlencoded',
            },
            body: qs.stringify({
                city_id: city_id
            })
        }).then((response) => response.json())
            .then((json) => {
                this.setState({
                    loading: false,
                    getLocations: json.data,
                });
            })
            .catch((error) => {
                this.setState({ loading: false, getLocations: [] });
                console.error(error);
            });
    }
    getOtp = () => {
        this.setState({ loading: true });
        fetch(baseUrl + 'get_service_request_otp', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'content-type': 'application/x-www-form-urlencoded',
            },
            body: qs.stringify({
                name: this.state.user_name,
                mobile: this.state.mobile
            })
        }).then((response) => response.json())
            .then((json) => {
                this.setState({ loading: false });
                if (json.status == "invalid") {
                    Toast.show({
                        text: json.message,
                        duration: 2000,
                        type: 'danger',
                        textStyle: { fontFamily: 'Ubuntu-Regular', color: "#ffffff", textAlign: 'center' },
                    })
                } else if (json.status == "valid") {
                    this.setState({ status: true, oId: json.data.id });
                    Toast.show({
                        text: json.message,
                        type: 'success',
                        duration: 2500,
                        textStyle: { fontFamily: 'Ubuntu-Regular', color: "#ffffff", textAlign: 'center' },
                    })
                }
            })
            .catch((error) => {
                this.setState({ loading: false });
                console.error(error);
            });
    }
    handleVerifyOtp = () => {
        this.setState({ loading: true });
        fetch(baseUrl + 'verify_otp', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'content-type': 'application/x-www-form-urlencoded',
            },
            body: qs.stringify({
                id: this.state.oId,
                otp: this.state.otp
            })
        }).then((response) => response.json())
            .then((json) => {
                this.setState({ loading: false });
                if (json.status == "invalid") {
                    Toast.show({
                        text: json.message,
                        duration: 2000,
                        type: 'danger',
                        textStyle: { fontFamily: 'Ubuntu-Regular', color: "#ffffff", textAlign: 'center' },
                    })
                } else if (json.status == "valid") {
                    this.setState({ ButtonText: "Verified", passId: json.data.id });
                    Toast.show({
                        text: json.message,
                        type: 'success',
                        duration: 2500,
                        textStyle: { fontFamily: 'Ubuntu-Regular', color: "#ffffff", textAlign: 'center' },
                    })
                }
            })
            .catch((error) => {
                this.setState({ loading: false });
                console.error(error);
            });
    }
    getServices = (location_id) => {
        this.setState({ loading: true });
        fetch(baseUrl + 'get_services_nearby_selected_location', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'content-type': 'application/x-www-form-urlencoded',
            },
            body: qs.stringify({
                location_id: location_id
            })
        }).then((response) => response.json())
            .then((json) => {
                this.setState({
                    loading: false,
                    services: json.data,
                });
            })
            .catch((error) => {
                this.setState({ loading: false, services: [] });
                console.error(error);
            });
    }
    PushServices = (id) => {
        this.setState({ loading: true });
        let tempArr = this.state.selectedServices;
        if (tempArr.includes(id)) {
            var index = tempArr.indexOf(id)
            if (index !== -1) {
                tempArr.splice(index, 1);
            }
        } else {
            tempArr.push(id)
        }
        var myServices = tempArr.toString();
        this.setState({ passSelectedService: myServices })
        if (id == "1" || id == "2") {
            this.getLanguage(id);
        }
        if (id == "3") {
            this.getMilkBrands(id);
        }
        if (id == "4") {
            this.getFibernet(id);
        }
    }
    getFibernet = (id) => {
        this.setState({ loading: true });
        fetch(baseUrl + 'get_fibernetbrands_service', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'content-type': 'application/x-www-form-urlencoded',
            },
            body: qs.stringify({
                service_id: id
            })
        }).then((response) => response.json())
            .then((json) => {
                this.setState({
                    loading: false,
                    Fibernet: json.data,
                });
            })
            .catch((error) => {
                this.setState({ loading: false, Fibernet: [] });
                console.error(error);
            });
    }
    getLanguage = (id) => {
        this.setState({ loading: true });
        fetch(baseUrl + 'get_languages', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'content-type': 'application/x-www-form-urlencoded',
            },
            body: qs.stringify({
                service_id: id
            })
        }).then((response) => response.json())
            .then((json) => {
                this.setState({
                    loading: false,
                    Language: json.data,
                });
            })
            .catch((error) => {
                this.setState({ loading: false, Language: [] });
                console.error(error);
            });
    }
    getMilkBrands = (id) => {
        this.setState({ loading: true });
        fetch(baseUrl + 'get_milkbrands_service', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'content-type': 'application/x-www-form-urlencoded',
            },
            body: qs.stringify({
                service_id: id
            })
        }).then((response) => response.json())
            .then((json) => {
                this.setState({
                    loading: false,
                    Milk: json.data,
                });
            })
            .catch((error) => {
                this.setState({ loading: false, Milk: [] });
                console.error(error);
            });
    }
    PushNewsLanguages = (id, ser_id) => {
        this.setState({ loading: true })
        let tempArr1 = this.state.selectedNewsLanguages;
        if (tempArr1.includes(id)) {
            var index = tempArr1.indexOf(id)
            if (index !== -1) {
                tempArr1.splice(index, 1);
            }
        } else {
            tempArr1.push(id)
        }
        var newsLan = tempArr1.toString();
        if (newsLan !== "") {
            this.setState({ pushSelectedNewsLanguage: newsLan }, () => { this.getNewsPaper(ser_id) })
        }
    }
    PushMagLanguages = (id, ser_id) => {
        this.setState({ loading: true });
        let tempArr1 = this.state.selectedMagLanguages;
        if (tempArr1.includes(id)) {
            var index = tempArr1.indexOf(id)
            if (index !== -1) {
                tempArr1.splice(index, 1);
            }
        } else {
            tempArr1.push(id)
        }
        var magLan = tempArr1.toString();
        if (magLan !== "") {
            this.setState({ pushSelectedMagLanguage: magLan }, () => { this.getMagCategories(ser_id) })
        }
    }
    getMagCategories = (ser_id) => {
        this.setState({ loading: true });
        fetch(baseUrl + 'get_magazine_categories_service', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'content-type': 'application/x-www-form-urlencoded',
            },
            body: qs.stringify({
                service_id: ser_id,
                language_ids: this.state.pushSelectedMagLanguage
            })
        }).then((response) => response.json())
            .then((json) => {
                this.setState({
                    loading: false,
                    magCategory: json.data
                });
            })
            .catch((error) => {
                this.setState({ loading: false, magCategory: [] });
                console.error(error);
            });
    }
    PushMagCategories = (id) => {
        this.setState({ loading: true });
        let tempArr1 = this.state.selectedMagCategories;
        if (tempArr1.includes(id)) {
            var index = tempArr1.indexOf(id)
            if (index !== -1) {
                tempArr1.splice(index, 1);
            }
        } else {
            tempArr1.push(id)
        }
        var magCat = tempArr1.toString();
        if (magCat !== "") {
            this.setState({ pushSelectedMagCategories: magCat }, () => { this.getMagazines(id) })
        }
    }
    getMagazines = (id) => {
        this.setState({ loading: true });
        fetch(baseUrl + 'get_magazines_service', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'content-type': 'application/x-www-form-urlencoded',
            },
            body: qs.stringify({
                magazine_category_ids: this.state.pushSelectedMagCategories
            })
        }).then((response) => response.json())
            .then((json) => {
                this.setState({
                    loading: false,
                    Magazines: json.data
                });
            })
            .catch((error) => {
                this.setState({ loading: false, Magazines: [] });
                console.error(error);
            });
    }
    getNewsPaper = (ser_id) => {
        this.setState({ loading: true });
        fetch(baseUrl + 'get_newspaper_service', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'content-type': 'application/x-www-form-urlencoded',
            },
            body: qs.stringify({
                service_id: ser_id,
                language_ids: this.state.pushSelectedNewsLanguage
            })
        }).then((response) => response.json())
            .then((json) => {
                this.setState({
                    loading: false,
                    NewsPaper: json.data
                });
            })
            .catch((error) => {
                this.setState({ loading: false, NewsPaper: [] });
                console.error(error);
            });
    }
    PushPapers = (id) => {
        let tempArr = this.state.selectedPapers;
        if (tempArr.includes(id)) {
            var index = tempArr.indexOf(id)
            if (index !== -1) {
                tempArr.splice(index, 1);
            }
        } else {
            tempArr.push(id)
        }
        var newsPaper = tempArr.toString();
        if (newsPaper !== "") {
            this.setState({ pushSelectedPapers: newsPaper })
        }
    }
    pushMagazineIds = (id) => {
        let tempArr = this.state.selectedMagazineIds;
        if (tempArr.includes(id)) {
            var index = tempArr.indexOf(id)
            if (index !== -1) {
                tempArr.splice(index, 1);
            }
        } else {
            tempArr.push(id)
        }
        var magId = tempArr.toString();
        if (magId !== "") {
            this.setState({ pushSelectedMagazineIds: magId })
        }
    }
    PushMilk = (id) => {
        let tempArr = this.state.selectedMilkBrands;
        if (tempArr.includes(id)) {
            var index = tempArr.indexOf(id)
            if (index !== -1) {
                tempArr.splice(index, 1);
            }
        } else {
            tempArr.push(id)
        }
        var milkId = tempArr.toString();
        if (milkId !== "") {
            this.setState({ pushSelectedMilkBrands: milkId })
        }
    }
    PushFibernet = (id) => {
        let tempArr = this.state.selectedFibernet;
        if (tempArr.includes(id)) {
            var index = tempArr.indexOf(id)
            if (index !== -1) {
                tempArr.splice(index, 1);
            }
        } else {
            tempArr.push(id)
        }
        var fiberId = tempArr.toString();
        if (fiberId !== "") {
            this.setState({ pushSelectedFibernet: fiberId })
        }
    }
    handleToSubmit = () => {
        this.setState({ loading: true });
        fetch(baseUrl + 'service_request_form', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'content-type': 'application/x-www-form-urlencoded',
            },
            body: qs.stringify({
                id: this.state.passId,
                state_id: this.state.state_id,
                city_id: this.state.city,
                location_id: this.state.location_id,
                service_types: this.state.passSelectedService,
                news_language_ids: this.state.pushSelectedNewsLanguage,
                mcategory_language_ids: this.state.pushSelectedMagLanguage,
                newspaper_ids: this.state.pushSelectedPapers,
                magazine_category_ids: this.state.pushSelectedMagCategories,
                magazine_ids: this.state.pushSelectedMagazineIds,
                milkbrand_ids: this.state.pushSelectedMilkBrands,
                fibernetbrand_ids: this.state.pushSelectedFibernet
            })
        }).then((response) => response.json())
            .then((json) => {
                this.setState({ loading: false });
                if (json.status == "invalid") {
                    Toast.show({
                        text: json.message,
                        duration: 5000,
                        type: 'danger',
                        textStyle: { fontFamily: 'Ubuntu-Regular', color: "#ffffff", textAlign: 'center' },
                    })
                } else if (json.status == "valid") {
                    Toast.show({
                        text: json.message,
                        type: 'success',
                        duration: 5000,
                        textStyle: { fontFamily: 'Ubuntu-Regular', color: "#ffffff", textAlign: 'center' },
                    })
                    this.setState({
                        service_types: "",
                        news_language_ids: "",
                        mcategory_language_ids: "",
                        newspaper_ids: "",
                        magazine_category_ids: "",
                        magazine_ids: "",
                        milkbrand_ids: "",
                        fibernetbrand_ids: ""
                    })
                }
            })
            .catch((error) => {
                this.setState({ loading: false });
                console.error(error);
            });
    }
    render() {
        return (
            <Container style={{ backgroundColor: '#fff' }}>
                <StatusBar backgroundColor='#fff' barStyle="dark-content" />
                <View style={{ marginTop: "3%", marginLeft: "3%", }}>
                    <View style={{ flexDirection: "row", }}>
                        <TouchableWithoutFeedback onPress={this.goToHome}>
                            <Image source={require('../assets/back_icon.png')} resizeMode='contain' />
                        </TouchableWithoutFeedback>
                        <Text style={styles.headerText}>Services</Text>
                    </View>
                </View>
                <View style={{ borderBottomWidth: 0.5, marginTop: "3%", elevation: 1, borderBottomColor: "#F0F0F0" }}></View>
                <Content style={{ padding: 5, marginTop: "1%" }}>

                    <Text style={styles.loginText2}>Name</Text>
                    <Item style={styles.item}>
                        <Input
                            style={styles.input}
                            value={this.state.user_name}
                            onChangeText={(username) => { this.setState({ user_name: username }) }}
                        />
                    </Item>
                    <Text style={styles.loginText2}>Mobile</Text>
                    <Item style={styles.item}>
                        <Input
                            style={styles.input}
                            value={this.state.mobile}
                            keyboardType="phone-pad"
                            maxLength={10}
                            onChangeText={(mobile) => { this.setState({ mobile: mobile }) }}
                        />
                        <TouchableWithoutFeedback onPress={() => { this.getOtp() }}>
                            <View style={styles.buttonContainer11}>
                                <Text style={styles.submitText1}>Get OTP</Text>
                            </View>
                        </TouchableWithoutFeedback>
                    </Item>
                    {this.state.status == true &&
                        <View>
                            <Text style={styles.loginText2}>Verify Otp</Text>
                            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                <OTPInputView
                                    style={{ width: wp('70'), height: 70, }}
                                    pinCount={4}
                                    autoFocusOnLoad
                                    secureTextEntry={true}
                                    codeInputFieldStyle={styles.inputFeilds}
                                    codeInputHighlightStyle={styles.inputFeildsFocus}
                                    placeholderTextColor="#81007F"
                                    onCodeFilled={(code => {
                                        this.setState({ otp: code })
                                    })}
                                />
                            </View>
                            {
                                this.state.ButtonText == "Verify" ?
                                    <TouchableWithoutFeedback onPress={() => { this.handleVerifyOtp() }}>
                                        <View style={{ marginTop: hp('2'), marginLeft: wp('5'), marginRight: wp('5'), }}>
                                            <View style={styles.buttonContainer1}>
                                                <Text style={styles.submitText1}>{this.state.ButtonText}</Text>
                                            </View>
                                        </View>
                                    </TouchableWithoutFeedback>
                                    :
                                    <TouchableWithoutFeedback>
                                        <View style={{ marginTop: hp('2'), marginLeft: wp('5'), marginRight: wp('5'), }}>
                                            <View style={styles.buttonContainer1}>
                                                <Text style={styles.submitText1}>{this.state.ButtonText}</Text>
                                            </View>
                                        </View>
                                    </TouchableWithoutFeedback>
                            }
                        </View>
                    }
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
                            onValueChange={(itemValue, itemIndex) => {
                                (this.setState({ city: itemValue },
                                    () => {
                                        this.getLocation(itemValue)
                                    }))
                            }}
                        >
                            <Picker.Item label="Select" value="" />

                            {
                                this.state.getCity.map((item) =>

                                    <Picker.Item label={item.name} value={item.id} />

                                )
                            }

                        </Picker>
                    </Item>
                    <Text style={styles.loginText2}>Location</Text>
                    <Item style={styles.item}>
                        <Picker
                            style={styles.pickerStyle}
                            selectedValue={this.state.location_id}
                            onValueChange={(itemValue, itemIndex) => {
                                (this.setState({ location_id: itemValue, location: "success" },
                                    () => {
                                        this.getServices(itemValue)
                                    }))
                            }}
                        >
                            <Picker.Item label="Select" value="" />

                            {
                                this.state.getLocations.map((item) =>

                                    <Picker.Item label={item.name} value={item.id} />
                                )
                            }
                        </Picker>
                    </Item>
                    {
                        this.state.location == "success" && this.state.services.length !== 0 &&
                        <View>
                            <Text style={styles.loginText3}>Services</Text>
                            {
                                this.state.services.map((item, index) => {
                                    return (
                                        <View>
                                            <TouchableWithoutFeedback onPress={() => { this.PushServices(item.id) }}>
                                                <View style={{ flexDirection: 'row', marginTop: "2%", marginBottom: "2%" }} key={item.id} >
                                                    <View style={{ marginLeft: '8%' }}>
                                                        <Icon active name={this.state.selectedServices.includes(item.id) ? 'dot-circle-o' : 'circle-o'} type="FontAwesome" style={{ fontSize: 22, color: '#81007F' }} />
                                                    </View>
                                                    <View style={{ marginLeft: '2%', top: 2 }}>
                                                        <Text style={styles.text}>{item.name}</Text>
                                                    </View>
                                                </View>
                                            </TouchableWithoutFeedback>
                                            <View>
                                                {this.state.selectedServices.includes(item.id) ?
                                                    <View>
                                                        <View>
                                                            {
                                                                item.id == "1" &&
                                                                <View style={styles.card}>
                                                                    {this.state.Language.length !== 0 ?
                                                                        <View>
                                                                            <Text style={styles.language}>preferred Language</Text>
                                                                        </View>
                                                                        :
                                                                        null
                                                                    }
                                                                    {this.state.Language.length !== 0 &&
                                                                        <View style={styles.flatView}>
                                                                            {this.state.Language.map((item1, index) =>
                                                                                <View style={{ marginTop: 2, paddingLeft: wp('2'), }}>
                                                                                    <View key={item1.id}>
                                                                                        <TouchableWithoutFeedback onPress={() => { this.PushNewsLanguages(item1.id, item.id) }}>
                                                                                            <View style={styles.imageView}>
                                                                                                <Icon active name={this.state.selectedNewsLanguages.includes(item1.id) ? 'dot-circle-o' : 'circle-o'} type="FontAwesome" style={{ fontSize: 22, color: '#00ff00', }} />
                                                                                                <Text style={styles.text1}>{item1.name}</Text>
                                                                                            </View>
                                                                                        </TouchableWithoutFeedback>
                                                                                    </View>

                                                                                </View>
                                                                            )}
                                                                        </View>
                                                                    }
                                                                    {this.state.NewsPaper.length !== 0 &&
                                                                        <View>
                                                                            {this.state.NewsPaper.map((item2, index) =>
                                                                                <View style={{ marginTop: 2, paddingLeft: wp('2'), }}>
                                                                                    {item2.list.length !== 0 ?
                                                                                        <View>
                                                                                            {this.state.selectedNewsLanguages.includes(item2.language_id) &&
                                                                                                <View>
                                                                                                    <Text style={styles.language1}>{item2.label_name}</Text>
                                                                                                    {item2.list.map((item3, index) =>
                                                                                                        <TouchableWithoutFeedback onPress={() => this.PushPapers(item3.id)}>
                                                                                                            <View>
                                                                                                                <View style={styles.imageView}>
                                                                                                                    <Icon active name={this.state.selectedPapers.includes(item3.id) ? 'dot-circle-o' : 'circle-o'} type="FontAwesome" style={{ fontSize: 22, color: '#ff0066', }} />
                                                                                                                    <Text style={styles.text2}>{item3.name}</Text>
                                                                                                                </View>
                                                                                                            </View>
                                                                                                        </TouchableWithoutFeedback>
                                                                                                    )}
                                                                                                </View>
                                                                                            }
                                                                                        </View>
                                                                                        :
                                                                                        Toast.show({
                                                                                            text: "No papers available in this language",
                                                                                            duration: 2000,
                                                                                            type: 'danger',
                                                                                            textStyle: { fontFamily: 'Ubuntu-Regular', color: "#ffffff", textAlign: 'center' },
                                                                                        })
                                                                                    }
                                                                                </View>
                                                                            )}
                                                                        </View>
                                                                    }
                                                                </View>
                                                            }
                                                        </View>
                                                        <View>
                                                            {
                                                                item.id == "2" &&
                                                                <View style={styles.card}>
                                                                    {this.state.Language.length !== 0 &&
                                                                        <View>
                                                                            <Text style={styles.language}>preferred Language</Text>
                                                                        </View>
                                                                    }
                                                                    {this.state.Language.length !== 0 &&
                                                                        <View style={styles.flatView}>
                                                                            {this.state.Language.map((item1, index) =>
                                                                                <View style={{ marginTop: 2, paddingLeft: wp('2'), }}>
                                                                                    <View key={item1.id}>
                                                                                        <TouchableWithoutFeedback onPress={() => { this.PushMagLanguages(item1.id, item.id) }}>
                                                                                            <View style={styles.imageView}>
                                                                                                <Icon active name={this.state.selectedMagLanguages.includes(item1.id) ? 'dot-circle-o' : 'circle-o'} type="FontAwesome" style={{ fontSize: 22, color: '#00ff00', }} />
                                                                                                <Text style={styles.text1}>{item1.name}</Text>
                                                                                            </View>
                                                                                        </TouchableWithoutFeedback>
                                                                                    </View>
                                                                                </View>
                                                                            )}
                                                                        </View>
                                                                    }
                                                                    {this.state.magCategory.length !== 0 &&
                                                                        <View>
                                                                            {this.state.magCategory.map((item2, index) =>
                                                                                <View style={{ marginTop: 2, paddingLeft: wp('2'), }}>
                                                                                    {item2.list.length !== 0 ?
                                                                                        <View>
                                                                                            {this.state.selectedMagLanguages.includes(item2.language_id) &&
                                                                                                <View>
                                                                                                    <Text style={styles.language1}>{item2.label_name}</Text>
                                                                                                    {item2.list.map((item3, index) =>
                                                                                                        <TouchableWithoutFeedback onPress={() => this.PushMagCategories(item3.id)}>
                                                                                                            <View>
                                                                                                                <View style={styles.imageView}>
                                                                                                                    <Icon active name={this.state.selectedMagCategories.includes(item3.id) ? 'dot-circle-o' : 'circle-o'} type="FontAwesome" style={{ fontSize: 22, color: '#ff0066', }} />
                                                                                                                    <Text style={styles.text2}>{item3.name}</Text>
                                                                                                                </View>
                                                                                                            </View>
                                                                                                        </TouchableWithoutFeedback>
                                                                                                    )}
                                                                                                </View>
                                                                                            }
                                                                                        </View>
                                                                                        :
                                                                                        Toast.show({
                                                                                            text: "No Categories available in this language",
                                                                                            duration: 2000,
                                                                                            type: 'danger',
                                                                                            textStyle: { fontFamily: 'Ubuntu-Regular', color: "#ffffff", textAlign: 'center' },
                                                                                        })
                                                                                    }
                                                                                </View>
                                                                            )}
                                                                        </View>
                                                                    }
                                                                    {this.state.Magazines.length !== 0 &&
                                                                        <View>
                                                                            {this.state.Magazines.map((item2, index) =>
                                                                                <View style={{ marginTop: 2, paddingLeft: wp('2'), }}>
                                                                                    {item2.list.length !== 0 ?
                                                                                        <View>
                                                                                            {(this.state.selectedMagCategories.includes(item2.mcat_id) && this.state.selectedMagLanguages.includes(item2.language_id)) &&
                                                                                                <View>
                                                                                                    <Text style={styles.language1}>{item2.label_name}</Text>
                                                                                                    {item2.list.map((item3, index) =>
                                                                                                        <TouchableWithoutFeedback onPress={() => this.pushMagazineIds(item3.id)}>
                                                                                                            <View>
                                                                                                                <View style={styles.imageView}>
                                                                                                                    <Icon active name={this.state.selectedMagazineIds.includes(item3.id) ? 'dot-circle-o' : 'circle-o'} type="FontAwesome" style={{ fontSize: 22, color: '#ff0066', }} />
                                                                                                                    <Text style={styles.text2}>{item3.name}</Text>
                                                                                                                </View>
                                                                                                            </View>
                                                                                                        </TouchableWithoutFeedback>
                                                                                                    )}
                                                                                                </View>
                                                                                            }
                                                                                        </View>
                                                                                        :
                                                                                        Toast.show({
                                                                                            text: "No Magazines available in this Categories",
                                                                                            duration: 2000,
                                                                                            type: 'danger',
                                                                                            textStyle: { fontFamily: 'Ubuntu-Regular', color: "#ffffff", textAlign: 'center' },
                                                                                        })
                                                                                    }
                                                                                </View>
                                                                            )}
                                                                        </View>
                                                                    }
                                                                </View>
                                                            }
                                                        </View>
                                                        <View>
                                                            {
                                                                item.id == "3" &&
                                                                <View style={styles.card}>
                                                                    {this.state.Milk.length !== 0 &&
                                                                        <View>
                                                                            <Text style={styles.language}>Brands</Text>
                                                                        </View>
                                                                    }
                                                                    {this.state.Milk.length !== 0 &&
                                                                        <View style={styles.flatView}>
                                                                            {this.state.Milk.map((item1, index) =>
                                                                                <View style={{ marginTop: 2, paddingLeft: wp('2'), }}>
                                                                                    <View key={item1.id}>
                                                                                        <TouchableWithoutFeedback onPress={() => { this.PushMilk(item1.id) }}>
                                                                                            <View style={styles.imageView}>
                                                                                                <Icon active name={this.state.selectedMilkBrands.includes(item1.id) ? 'dot-circle-o' : 'circle-o'} type="FontAwesome" style={{ fontSize: 22, color: '#00ff00', }} />
                                                                                                <Text style={styles.text1}>{item1.name}</Text>
                                                                                            </View>
                                                                                        </TouchableWithoutFeedback>
                                                                                    </View>
                                                                                </View>
                                                                            )}
                                                                        </View>
                                                                    }
                                                                </View>
                                                            }
                                                        </View>
                                                        <View>
                                                            {
                                                                item.id == "4" &&
                                                                <View style={styles.card}>
                                                                    {this.state.Fibernet.length !== 0 &&
                                                                        <View>
                                                                            <Text style={styles.language}>Brands</Text>
                                                                        </View>
                                                                    }
                                                                    {this.state.Fibernet.length !== 0 &&
                                                                        <View style={styles.flatView}>
                                                                            {this.state.Fibernet.map((item1, index) =>
                                                                                <View style={{ marginTop: 2, paddingLeft: wp('2'), }}>
                                                                                    <View key={item1.id}>
                                                                                        <TouchableWithoutFeedback onPress={() => { this.PushFibernet(item1.id) }}>
                                                                                            <View style={styles.imageView}>
                                                                                                <Icon active name={this.state.selectedFibernet.includes(item1.id) ? 'dot-circle-o' : 'circle-o'} type="FontAwesome" style={{ fontSize: 22, color: '#00ff00', }} />
                                                                                                <Text style={styles.text1}>{item1.name}</Text>
                                                                                            </View>
                                                                                        </TouchableWithoutFeedback>
                                                                                    </View>
                                                                                </View>
                                                                            )}
                                                                        </View>
                                                                    }
                                                                </View>
                                                            }
                                                        </View>
                                                    </View>
                                                    :
                                                    null
                                                }
                                            </View>
                                        </View>
                                    )
                                })
                            }
                        </View>
                    }

                    <View style={{ height: hp('6') }}></View>
                </Content>
                <TouchableWithoutFeedback onPress={() => { this.handleToSubmit() }}>
                    <View style={{ marginTop: hp('2'), marginLeft: wp('5'), marginRight: wp('5'), marginBottom: wp('5') }}>
                        <View style={styles.buttonContainer}>
                            <Text style={styles.submitText}>SUBMIT</Text>
                        </View>
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
    flatView: {
        width: wp('98'),
        // height: hp('50'),
        flexDirection: "row",
        flexWrap: "wrap",
        alignItems: "center",
        alignSelf: "center",
        // justifyContent: "space-between",
        margin: hp('0.5'),
    },
    text1: {
        fontSize: 14,
        fontFamily: "Ubuntu-Medium",
        width: "50%",
        marginLeft: wp('1'),
    },
    text2: {
        fontSize: 14,
        fontFamily: "Ubuntu-Medium",
        width: "95%",
        marginLeft: wp('1'),
    },
    imageView: {
        alignItems: "center",
        width: wp('30'),
        justifyContent: "center",
        flexDirection: "row",
        paddingTop: hp('1')
    },
    leftimage: {
        width: 25,
        height: 20,
    },
    headerText: {
        color: "#000",
        fontSize: 17,
        fontFamily: 'Ubuntu-Bold',
        marginLeft: "8%"
    },
    card: {
        borderRadius: 20,
        backgroundColor: "#f9f9f9",
        padding: "3%",
        paddingLeft: "8%"
    },
    inputFeilds: {
        width: 40,
        height: 40,
        borderWidth: 1,
        margin: "4%"
    },
    pickerStyle: {
        width: "100%",
        justifyContent: 'center',
        marginBottom: "4%",
        marginTop: "3%",
    },
    inputFeildsFocus: {
        borderColor: "#81007F",
        borderWidth: 1,
        margin: "4%",
        height: 40,
    },
    item: {
        borderBottomWidth: 0.8,
        borderBottomColor: '#000',
        marginLeft: "8%",
        marginRight: "8%",
    },
    textinput: {
        borderBottomWidth: 0.8,
        borderBottomColor: '#000',
        marginLeft: "8%",
        marginRight: "8%",
    },
    textinput: {
        borderWidth: 0.8,
        borderColor: '#000',
        marginLeft: "8%",
        marginRight: "8%",
        width: "84%",
        borderRadius: 8,
        height: hp('20'),
        marginTop: hp('2')
    },
    loginText2: {
        fontFamily: 'Ubuntu-Bold',
        fontSize: 13,
        marginLeft: '8%',
        marginTop: "3%"
    },
    loginText3: {
        fontFamily: 'Ubuntu-Bold',
        fontSize: 18,
        marginLeft: '8%',
        marginTop: "3%",
    },
    language: {
        fontFamily: 'Ubuntu-Bold',
        fontSize: 16,
    },
    language1: {
        fontFamily: 'Ubuntu-Bold',
        fontSize: 14,
        paddingTop: "2%"
    },
    input: {
        fontFamily: 'Ubuntu-Regular',
        fontSize: 14,
        marginTop: "1%"

    },
    submitText: {
        fontFamily: 'Ubuntu-Bold',
        fontSize: 17,
        color: '#fff',
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
    buttonContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#81007F',
        width: '90%',
        padding: '4%',
        borderRadius: 25,
        alignSelf: "center"
    },
    buttonContainer1: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#81007F',
        width: '40%',
        padding: '2%',
        borderRadius: 25,
        alignSelf: "center"
    },
    buttonContainer11: {
        alignItems: 'center',
        backgroundColor: '#81007F',
        padding: '3%',
        borderRadius: 25,
    },
    submitText1: {
        fontFamily: 'Ubuntu-Bold',
        fontSize: 12,
        color: '#fff',
    },
    text: {
        fontFamily: 'Ubuntu-Medium',
        fontSize: 14,
    },
})