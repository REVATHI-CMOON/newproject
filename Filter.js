import React, { Component } from "react";
import { Container, Header, Button, Content, ActionSheet, Item, Input, Toast } from "native-base";
import Icon from 'react-native-vector-icons/Ionicons';
import { StyleSheet, View, Image, Text, TouchableWithoutFeedback, TouchableNativeFeedback, TextInput, Dimensions, StatusBar, } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { ScrollView } from "react-native-gesture-handler";
// import MultiSlider from '@ptomasroos/react-native-multi-slider';
import AsyncStorage from '@react-native-community/async-storage';
import qs from 'qs';
const baseUrl = "http://demoworks.in/php/mypropertree/api/common/";
import { MaterialIndicator } from 'react-native-indicators';
import { Slider } from 'react-native';
export default class Filter extends Component {
    constructor(props) {
        super(props);
        this.state = {
            bedroom: '',
            facing: '',
            loading: true,
            Bedrooms: [],
            Facing: [],
            user_id: '',
            TenentType: [],
            tenent: "",
            furnished: '',
            Furnished: [],
            sub_type: '',
            subTypes: [],
            selectedBedrooms: [],
            selectedTenent: [],
            selectedBuilding: [],
            selectedFurnished: [],
            selectedFacing: [],
            value: 40,
            selectedBuildingType: '',
            selectedType: '',
            to_amount: "",
            from_amount: "",
            Type: [
                { id: '1', option_value: 'Buy' },
                { id: '2', option_value: 'Rent' },
            ]
        }
    }
    componentDidMount() {
        this.getDropdownList();
        this.getSubCategories();
        AsyncStorage.getItem('user_id').then((user_id) => {
            this.setState({
                user_id: user_id,
            });
        });
        if (this.props.route.params.filterObj != undefined) {
            var stringTenent = this.props.route.params.filterObj.selectedTenent
            if (stringTenent) {
                var tenentArr = stringTenent.split(",");
            } else {
                var tenentArr = [];
            }
            var stringBedrooms = this.props.route.params.filterObj.selectedBedrooms
            if (stringBedrooms) {
                var bedroomArr = stringBedrooms.split(",");
            } else {
                var bedroomArr = [];
            }
            var stringFurnished = this.props.route.params.filterObj.selectedFurnished
            if (stringFurnished) {
                var furnishedArr = stringFurnished.split(",");
            } else {
                var furnishedArr = [];
            }
            var stringFacing = this.props.route.params.filterObj.selectedFacing
            if (stringFacing) {
                var facingArr = stringFacing.split(",");
            } else {
                var facingArr = [];
            }
            this.setState({
                selectedTenent: tenentArr,
                selectedBedrooms: bedroomArr,
                selectedBuildingType: this.props.route.params.filterObj.selectedBuildingType ? this.props.route.params.filterObj.selectedBuildingType : "",
                selectedType: this.props.route.params.filterObj.selectedType ? this.props.route.params.filterObj.selectedType : "",
                selectedFurnished: furnishedArr,
                selectedFacing: facingArr,
                from_amount: this.props.route.params.filterObj.from_amount,
                to_amount: this.props.route.params.filterObj.to_amount
            })
        } else {
            // var ufilterObj = {};
        }

    }

    goToVillas = () => {
        this.props.navigation.navigate(this.props.route.params.backscreen, {
            filterObj: "",
            selectedBuildingType: this.state.selectedBuildingType ? this.state.selectedBuildingType : "76",
            selectedType: this.state.selectedType ? this.state.selectedType : "1",
            backscreen: "Filter"
        })
    }
    getSubCategories = (id) => {
        this.setState({ loading: true });
        fetch(baseUrl + 'allsubtypes_list', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'content-type': 'application/x-www-form-urlencoded',
            },
            body: qs.stringify({
            })
        }).then((response) => response.json())
            .then((json) => {
                this.setState({ loading: false });
                if (json.status == "invalid") {
                    Toast.show({
                        text: json.message,
                        duration: 2500,
                        type: 'danger',
                        textStyle: { fontFamily: 'Ubuntu-Regular', color: "#ffffff", textAlign: 'center' },
                    })
                    this.setState(
                        {
                            subTypes: []
                        }
                    )
                } else if (json.status == "valid") {
                    this.setState(
                        {
                            subTypes: json.data
                        }
                    )
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
                        Bedrooms: json.data.bedrooms,
                        Facing: json.data.facing,
                        TenentType: json.data.tenant_types,
                        loading: false,
                        Furnished: json.data.furniture_type
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
        let tempArr = this.state.selectedBedrooms;
        if (tempArr.includes(id)) {
            var index = tempArr.indexOf(id)
            if (index !== -1) {
                tempArr.splice(index, 1);
            }
        } else {
            tempArr.push(id)
        }
        this.setState({ selectedBedrooms: tempArr })
    }
    PushTanentType = (id) => {
        let tempArr = this.state.selectedTenent;
        if (tempArr.includes(id)) {
            var index = tempArr.indexOf(id)
            if (index !== -1) {
                tempArr.splice(index, 1);
            }
        } else {
            tempArr.push(id)
        }
        this.setState({ selectedTenent: tempArr })
    }

    PushFurnished = (id) => {
        let tempArr = this.state.selectedFurnished;
        if (tempArr.includes(id)) {
            var index = tempArr.indexOf(id)
            if (index !== -1) {
                tempArr.splice(index, 1);
            }
        } else {
            tempArr.push(id)
        }
        this.setState({ selectedFurnished: tempArr })
    }

    PushFacing = (id) => {
        let tempArr = this.state.selectedFacing;
        if (tempArr.includes(id)) {
            var index = tempArr.indexOf(id)
            if (index !== -1) {
                tempArr.splice(index, 1);
            }
        } else {
            tempArr.push(id)
        }
        this.setState({ selectedFacing: tempArr })
    }

    applyFilter = () => {
        let filterObj = {
            selectedTenent: this.state.selectedTenent.join(','),
            selectedBedrooms: this.state.selectedBedrooms.join(','),
            selectedBuildingType: this.state.selectedBuildingType,
            selectedType: this.state.selectedType,
            selectedFurnished: this.state.selectedFurnished.join(','),
            selectedFacing: this.state.selectedFacing.join(','),
            from_amount: this.state.from_amount,
            to_amount: this.state.to_amount
        }
        this.props.navigation.navigate('Villas', {
            filterObj: filterObj,
            selectedBuildingType: this.state.selectedBuildingType ? this.state.selectedBuildingType : "76",
            selectedType: this.state.selectedType ? this.state.selectedType : "1",
            backscreen: "Filter"
        })
    }

    searchPriceFilter = () => {
        if (this.state.to_amount && this.state.from_amount) {
            let filterObj = {
                selectedTenent: this.state.selectedTenent.join(','),
                selectedBedrooms: this.state.selectedBedrooms.join(','),
                selectedBuildingType: this.state.selectedBuildingType,
                selectedType: this.state.selectedType,
                selectedFurnished: this.state.selectedFurnished.join(','),
                selectedFacing: this.state.selectedFacing.join(','),
                from_amount: this.state.from_amount,
                to_amount: this.state.to_amount
            }
            this.props.navigation.navigate('Villas', {
                filterObj: filterObj,
                selectedBuildingType: this.state.selectedBuildingType ? this.state.selectedBuildingType : "76",
                selectedType: this.state.selectedType ? this.state.selectedType : "1",
                backscreen: "Filter"
            })
        } else {
            Toast.show({
                text: "Please enter from amount and to amount",
                duration: 2000,
                type: 'danger',
                textStyle: { fontFamily: 'Ubuntu-Regular', color: "#ffffff", textAlign: 'center' },
            })
        }
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
            <Container>
                <View>
                    <TouchableWithoutFeedback onPress={this.goToVillas}>
                        <Image source={require('../assets/close_icon.png')} style={{ alignSelf: "flex-end", height: 50, width: 60, marginRight: "3%", marginTop: "3%" }} />
                    </TouchableWithoutFeedback>
                </View>

                <View style={styles.popular}>
                    <Text style={styles.popularTitle}>
                        Filter
                        </Text>
                    <TouchableWithoutFeedback onPress={this.goToRegister}>
                        <View style={styles.buttonContainer}>
                            <Text style={styles.buttonTextclear}>Clear</Text>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
                <Content>
                    <View style={styles.loclist}>
                        {/* <View>
                            <View>
                                <Text style={styles.text}>Tenant Type</Text>
                            </View>

                            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={{ marginLeft: "3%", marginTop: "2%" }}>
                                {
                                    this.state.TenentType.map((item, key) => {
                                        return (
                                            <TouchableWithoutFeedback onPress={() => this.PushTanentType(item.id)}>
                                                <View style={this.state.selectedTenent.includes(item.id) ? styles.buttonContainer2 : styles.buttonContainer1}>
                                                    <Text style={styles.buttonText}>{item.option_value}</Text>
                                                </View>
                                            </TouchableWithoutFeedback>
                                        )
                                    })
                                }
                            </ScrollView>

                        </View> */}
                        <View>
                            <View>
                                <Text style={styles.text}>Looking For</Text>
                            </View>
                            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={{ marginLeft: "3%", marginTop: "2%" }}>
                                {
                                    this.state.Type.map((item, key) => {
                                        return (
                                            <TouchableWithoutFeedback onPress={() => this.setState({ selectedType: item.id })}>
                                                <View style={this.state.selectedType == item.id ? styles.buttonContainer2 : styles.buttonContainer1}>
                                                    <Text style={styles.buttonText}>{item.option_value}</Text>
                                                </View>
                                            </TouchableWithoutFeedback>
                                        )
                                    })
                                }
                            </ScrollView>
                        </View>
                        <View>
                            <View>
                                <Text style={styles.text}>Bedrooms</Text>
                            </View>
                            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={{ marginLeft: "3%", marginTop: "2%" }}>
                                {
                                    this.state.Bedrooms.map((item, key) => {
                                        return (
                                            <TouchableWithoutFeedback onPress={() => this.PushFacilites(item.id)}>
                                                <View style={this.state.selectedBedrooms.includes(item.id) ? styles.buttonContainer2 : styles.buttonContainer1}>
                                                    <Text style={styles.buttonText}>{item.option_value}</Text>
                                                </View>
                                            </TouchableWithoutFeedback>
                                        )
                                    })
                                }
                            </ScrollView>
                        </View>
                        <View>
                            <View>
                                <Text style={styles.text}>Building Type</Text>
                            </View>
                            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={{ marginLeft: "3%", marginTop: "2%" }}>
                                {
                                    this.state.subTypes.map((item, key) => {
                                        return (
                                            <TouchableWithoutFeedback onPress={() => this.setState({ selectedBuildingType: item.id })}>
                                                <View style={this.state.selectedBuildingType == item.id ? styles.buttonContainer2 : styles.buttonContainer1}>
                                                    <Text style={styles.buttonText}>{item.option_value}</Text>
                                                </View>
                                            </TouchableWithoutFeedback>
                                        )
                                    })
                                }
                            </ScrollView>
                        </View>
                        <View>
                            <View>
                                <Text style={styles.text}>Furnishing</Text>
                            </View>
                            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={{ marginLeft: "3%", marginTop: "2%" }}>
                                {
                                    this.state.Furnished.map((item, key) => {
                                        return (
                                            <TouchableWithoutFeedback onPress={() => this.PushFurnished(item.id)}>
                                                <View style={this.state.selectedFurnished.includes(item.id) ? styles.buttonContainer2 : styles.buttonContainer1}>
                                                    <Text style={styles.buttonText}>{item.option_value}</Text>
                                                </View>
                                            </TouchableWithoutFeedback>
                                        )
                                    })
                                }
                            </ScrollView>
                        </View>
                        <View>
                            <View>
                                <Text style={styles.text}>Facing</Text>
                            </View>
                            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={{ marginLeft: "3%", marginTop: "2%" }}>
                                {
                                    this.state.Facing.map((item, key) => {
                                        return (
                                            <TouchableWithoutFeedback onPress={() => this.PushFacing(item.id)}>
                                                <View style={this.state.selectedFacing.includes(item.id) ? styles.buttonContainer2 : styles.buttonContainer1}>
                                                    <Text style={styles.buttonText}>{item.option_value}</Text>
                                                </View>
                                            </TouchableWithoutFeedback>
                                        )
                                    })
                                }
                            </ScrollView>
                        </View>
                        <View style={{ flexDirection: 'row', marginLeft: "2%" }}>
                            <View style={{ width: wp('37'), marginBottom: hp('1') }}>
                                <View style={styles.labelContainer}>
                                    <Text style={styles.text1}>Pricing</Text>
                                </View>
                                <Item regular style={styles.item}>
                                    <Input
                                        placeholder='From'
                                        style={styles.input}
                                        value={this.state.from_amount}
                                        onChangeText={(from_amount) => this.setState({ from_amount: from_amount })}
                                    />
                                </Item>
                            </View>
                            <View style={{ width: wp('37'), marginBottom: hp('1') }}>
                                <View style={styles.labelContainer}>
                                    <Text style={styles.label}></Text>
                                </View>
                                <Item regular style={styles.item}>
                                    <Input
                                        placeholder='To'
                                        style={styles.input}
                                        value={this.state.to_amount}
                                        onChangeText={(to_amount) => this.setState({ to_amount: to_amount })}
                                    />
                                </Item>
                            </View>
                            <TouchableWithoutFeedback onPress={this.searchPriceFilter}>
                                <View style={{ justifyContent: 'center', alignItems: 'center', marginBottom: hp('1') }}>
                                    <View style={styles.labelContainer}>
                                        <Text style={styles.label}></Text>
                                    </View>
                                    <View style={styles.buttonContainer}>
                                        <Text style={styles.buttonText}>GO</Text>
                                    </View>
                                </View>
                            </TouchableWithoutFeedback>
                        </View>
                        {/* <View style={{ alignItems: "center", }}>
                            <Slider
                                style={{ width: 400, height: 40 }}
                                minimumValue={0}
                                maximumValue={100}
                                minimumTrackTintColor="#ccc"
                                maximumTrackTintColor="red"
                                onValueChange={this.onSliderChange}
                            />
                        </View> */}
                        {/* <View>
                            <Text style={styles.text1}>Location</Text>
                            <TouchableWithoutFeedback onPress={this.goToSelectLocaton}>
                                <View style={styles.item}>
                                    <Image source={require('../assets/location_search.png')} resizeMode="contain" style={styles.menuImage} />
                                    <Text style={styles.locationtext}>Search Location</Text>
                                </View>
                            </TouchableWithoutFeedback>
                        </View> */}
                    </View>
                </Content>
                <TouchableWithoutFeedback onPress={this.applyFilter}>
                    <View style={styles.Button}>
                        <Text style={styles.submitText}>Apply</Text>
                    </View>
                </TouchableWithoutFeedback>
            </Container>
        );
    }
}
const styles = StyleSheet.create({
    popular: {
        backgroundColor: '#81007F',
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        // position: "absolute",
        width: "100%",
        top: "5%",
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: "1%"
    },
    label: {
        fontFamily: 'Ubuntu-Bold',
        fontSize: 14,
        color: '#000'
    },
    labelContainer: {
        margin: '4%'
    },
    input: {
        fontFamily: 'Ubuntu-Regular',
        fontSize: 13,
        backgroundColor: '#f2f2f2',
        paddingLeft: '5%',
        borderRadius: 8,
    },
    item: {
        borderRadius: 8,
        backgroundColor: '#f2f2f2',
        height: hp('6'),
        borderLeftWidth: 0,
        borderRightWidth: 0,
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

        // padding: "5%"
    },
    buttonContainer22: {
        width: wp('34'),
        height: hp('4.5'),
        backgroundColor: 'red',
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        margin: 5
    },
    slider: { color: "red" },
    menuImage: {
        width: 40,
        height: 40,
        marginTop: '1%'
    },
    locationtext: {
        textAlign: "center",
        marginLeft: "5%",
        fontSize: 13,
        fontFamily: 'Ubuntu-Regular',
    },
    item: {
        marginLeft: "4%",
        marginRight: "4%",
        elevation: 3,
        borderWidth: 0.2,
        borderColor: "#fff",
        borderRadius: 10,
        flexDirection: "row",
        alignItems: "center",
        padding: 4,
        marginBottom: "4%",
    },
    popularTitle: {
        marginTop: "3%",
        fontFamily: 'Ubuntu-Medium',
        fontSize: 18,
        color: '#fff',
        marginBottom: "10%",
        marginLeft: "7%"
    },
    loclist: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        width: "100%",
    },
    buttonContainer: {
        backgroundColor: '#81007F',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '10%',
        borderRadius: 8,
        height: hp('6.5'),
        width: wp('15')
    },
    buttonText: {
        fontFamily: 'Ubuntu-Regular',
        fontSize: 13,
        color: '#ffffff'
    },
    buttonContainer1: {
        width: wp('32'),
        height: hp('5'),
        backgroundColor: '#ffff',
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        margin: 5,
        flexDirection: "row",
        borderColor: "#81007F",
        borderWidth: 0.7
    },
    buttonContainer2: {
        width: wp('32'),
        height: hp('5'),
        backgroundColor: '#d1e0e0',
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        margin: 5,
        flexDirection: "row",
        borderColor: "#ccc",
        borderWidth: 0.7
    },
    buttonContainer3: {
        width: wp('18'),
        height: hp('4.5'),
        backgroundColor: '#ffff',
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        margin: 5
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
    buttonText: {
        fontFamily: 'Ubuntu-Regular',
        fontSize: 14,
        textAlign: "center",
    },
    text: {
        marginLeft: "4%",
        margin: "2%",
        fontSize: 16,
        color: "#464646",
        fontFamily: 'Ubuntu-Medium',
    },
    text1: {
        marginLeft: "4%",
        fontFamily: 'Ubuntu-Medium',
        fontSize: 16,
        color: "#464646",
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
    submitText: {
        fontFamily: 'Ubuntu-Bold',
        fontSize: 17,
        color: '#fff'
    },
})