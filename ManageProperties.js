import React from 'react';
import { StyleSheet, View, Image, Text, TouchableWithoutFeedback, FlatList, Linking, Alert, TouchableNativeFeedback, TextInput, Dimensions, StatusBar } from 'react-native';
import {
    Container,
    Content,
    Toast,
    Left,
    Right,
    Icon,
    Button
} from 'native-base';
const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;
const imgHeight = deviceHeight / 7 > 110 ? deviceHeight / 9 : 110;
const imgHeight1 = deviceHeight / 1 > 110 ? deviceHeight / 9 : 110;
import AsyncStorage from '@react-native-community/async-storage';
import qs from 'qs';
import { MaterialIndicator } from 'react-native-indicators';
const baseUrl = "http://demoworks.in/php/mypropertree/api/dashboard/";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Modal from 'react-native-modal';
export default class Villas extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            showModal: false,
            data: [],
            count: "",
            label_name: "",
            subtype_name: "",
            user_id: "",
            admin_approved_status: '',
            created_date: "",
            property_type: "",
            property_id: "",
            sub_type: "",
            register_type_id: ""
        }
        this.offset = 1;
    }
    componentDidMount() {
        AsyncStorage.getItem('user_id').then((user_id) => {
            this.setState({ user_id: user_id })
            this.getProperties(user_id);
            this.focusListener = this.props.navigation.addListener('focus', () => {
                this.getProperties(user_id);
            });
        })
        AsyncStorage.getItem('register_type_id').then((register_type_id) => {
            this.setState({ register_type_id: register_type_id })
        })
    }
    goToPostStep2 = () => {
        this.setState({ showModal: false, property_id: '' })
        this.props.navigation.navigate('Step2', { property_id: this.state.property_id, manage: 'manage', type: this.state.property_type, sub_type: this.state.sub_type })
    }
    goToPostStep3 = () => {
        this.setState({ showModal: false, property_id: '' })
        this.props.navigation.navigate('Step3', { property_id: this.state.property_id, manage: 'manage', type: this.state.property_type, sub_type: this.state.sub_type })
    }
    goToPostStep4 = () => {
        this.setState({ showModal: false, property_id: '' })
        this.props.navigation.navigate('Step4', { property_id: this.state.property_id, manage: 'manage', type: this.state.property_type, sub_type: this.state.sub_type })
    }
    goToPostStep5 = () => {
        this.setState({ showModal: false, property_id: '' })
        this.props.navigation.navigate('Step5', { property_id: this.state.property_id, manage: 'manage', type: this.state.property_type, sub_type: this.state.sub_type })
    }
    goToPostStep6 = () => {
        this.setState({ showModal: false, property_id: '' })
        this.props.navigation.navigate('Step6', { property_id: this.state.property_id, manage: 'manage', type: this.state.property_type, sub_type: this.state.sub_type })
    }
    goToPostStep7 = () => {
        this.setState({ showModal: false, property_id: '' })
        this.props.navigation.navigate('Step7', { property_id: this.state.property_id, manage: 'manage', type: this.state.property_type, sub_type: this.state.sub_type })
    }
    getProperties = (user_id) => {
        this.setState({ loading: true });
        fetch(baseUrl + 'manage_properties', {
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
    ListEmptyView = () => {
        return (

            <View style={{ alignItems: "center", justifyContent: "center", alignSelf: "center" }}>
                {/* <Image source={require('../assets/emptyCart.png')} style={styles.emptyimage} resizeMode="contain" /> */}
                <Image source={require('../assets/cry.png')} style={styles.emptyimage} resizeMode="contain" />
            </View>
        );
    }
    goToHome = () => {
        this.props.navigation.navigate('Home')
    }
    changeStatus = (property_id) => {
        fetch(baseUrl + 'change_property_status/', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'content-type': 'application/x-www-form-urlencoded',
            },
            body: qs.stringify({
                property_id: property_id,
                user_id: this.state.user_id
            })
        }).then((response) => response.json())
            .then((json) => {
                this.setState({ loading: false });
                if (json.status == "invalid") {
                    Toast.show({
                        text: json.message,
                        duration: 2000,
                        type: 'danger',
                        textStyle: { fontFamily: 'Ubuntu-Bold', color: "#ffffff", textAlign: 'center' },
                    })
                } else if (json.status == "valid") {
                    Toast.show({
                        text: json.message,
                        type: 'success',
                        duration: 2500,
                        textStyle: { fontFamily: 'Ubuntu-Bold', color: "#ffffff", textAlign: 'center' },
                    })
                    let tempArr = this.state.data;
                    tempArr.map((item, index) => {
                        if (item.property_id == property_id) {
                            item.property_status = json.property_status
                        }
                    })
                    this.setState({ data: tempArr, loading: false });
                }
            })
            .catch((error) => {
                this.setState({ loading: false });
                console.error(error);
            });
    }
    // openModal = (id, status, created_at, type) => {

    //     Alert.alert('Please contact "+91 9867564120" to update your Property Details.')

    // }
    openModal = (property_id, admin_approved_status, created_date, property_type, sub_type) => {
        this.setState({ property_id: property_id, showModal: true, admin_approved_status: admin_approved_status, created_date: created_date, property_type: property_type, sub_type: sub_type });
    }
    closeModel = () => {
        this.setState({ showModal: false, property_id: '' });
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
                <Modal
                    isVisible={this.state.showModal}
                >
                    <View style={{ flex: 1, justifyContent: 'center' }}>
                        <View style={styles.modalView}>
                            <View style={{ marginLeft: wp('65') }}>
                                <TouchableWithoutFeedback onPress={this.closeModel}>
                                    <View>
                                        <Image source={require('../assets/close_icon.png')} style={{ width: 55, height: 45, }} resizeMode="contain" />
                                    </View>
                                </TouchableWithoutFeedback>
                            </View>
                            <View>
                                <View style={styles.modalDetailsHeader}>
                                    <Text style={styles.modalHeader}>Manage</Text>
                                    <Text style={styles.modalHeadersub}>{this.state.admin_approved_status}</Text>
                                    <Text style={styles.modalPostdate}>Post created on {this.state.created_date}</Text>
                                </View>
                                <View style={styles.divider}></View>
                                <View>
                                    <View style={styles.modalDetailsHeader}>
                                        <TouchableWithoutFeedback onPress={this.goToPostStep2}>
                                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                <Text style={styles.optionsText}>Basic Information</Text>
                                                <View style={{ position: 'absolute', right: 10 }}>
                                                    <Icon name="angle-right" type="FontAwesome" />
                                                </View>
                                            </View>
                                        </TouchableWithoutFeedback>
                                    </View>
                                    <View style={styles.divider}></View>
                                    <View style={styles.modalDetailsHeader}>
                                        <TouchableWithoutFeedback onPress={this.goToPostStep3}>
                                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                <Text style={styles.optionsText}>Property Details</Text>
                                                <View style={{ position: 'absolute', right: 10 }}>
                                                    <Icon name="angle-right" type="FontAwesome" />
                                                </View>
                                            </View>
                                        </TouchableWithoutFeedback>
                                    </View>
                                    <View style={styles.divider}></View>
                                    {this.state.sub_type != 117 &&
                                        <View>
                                            <View style={styles.modalDetailsHeader} >
                                                <TouchableWithoutFeedback onPress={this.goToPostStep4}>
                                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                        <Text style={styles.optionsText}>Property Details (Step4)</Text>
                                                        <View style={{ position: 'absolute', right: 10 }}>
                                                            <Icon name="angle-right" type="FontAwesome" />
                                                        </View>
                                                    </View>
                                                </TouchableWithoutFeedback>
                                            </View>
                                            <View style={styles.divider}></View>
                                        </View>
                                    }

                                    <View style={styles.modalDetailsHeader}>
                                        <TouchableWithoutFeedback onPress={this.goToPostStep6}>
                                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                <Text style={styles.optionsText}>Gallery</Text>
                                                <View style={{ position: 'absolute', right: 10 }}>
                                                    <Icon name="angle-right" type="FontAwesome" />
                                                </View>
                                            </View>
                                        </TouchableWithoutFeedback>
                                    </View>
                                    <View style={styles.divider}></View>
                                    <View style={styles.modalDetailsHeader}>
                                        <TouchableWithoutFeedback onPress={this.goToPostStep5}>
                                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                <Text style={styles.optionsText}>About Property</Text>
                                                <View style={{ position: 'absolute', right: 10 }}>
                                                    <Icon name="angle-right" type="FontAwesome" />
                                                </View>
                                            </View>
                                        </TouchableWithoutFeedback>
                                    </View>
                                    <View style={styles.divider}></View>
                                    {/* <View style={styles.modalDetailsHeader}>
                                        <TouchableWithoutFeedback onPress={this.goToPostStep7}>
                                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                <Text style={styles.optionsText}>About Property</Text>
                                                <View style={{ position: 'absolute', right: 10 }}>
                                                    <Icon name="angle-right" type="FontAwesome" />
                                                </View>
                                            </View>
                                        </TouchableWithoutFeedback>
                                    </View>
                                    <View style={styles.divider}></View> */}
                                </View>
                            </View>
                        </View>
                    </View>
                </Modal>
                <StatusBar backgroundColor='#fff' barStyle="dark-content" />
                <View style={{ marginTop: "3%", marginLeft: "3%", }}>
                    <TouchableWithoutFeedback onPress={this.goToHome}>
                        <View style={{ flexDirection: "row", }}>
                            <Image source={require('../assets/back_icon.png')} resizeMode='contain' />
                            <Text style={styles.headerText}>Manage Properties</Text>
                        </View>
                    </TouchableWithoutFeedback>
                    <View style={{ borderBottomWidth: 0.5, marginTop: "3%", elevation: 1, borderBottomColor: "#F0F0F0" }}></View>
                </View>
                <Content>
                    <FlatList
                        data={this.state.data}
                        renderItem={({ item }) =>
                        (
                            <View>
                                {
                                    (item.property_status == 0 || item.property_status == 1) ?
                                        <View style={styles.imagecontainer}>
                                            <Image source={{ uri: item.property_image }} style={styles.image} />
                                            <Image source={require('../assets/watermark.png')} style={styles.water} />
                                            {item.admin_approved_status == "approved" ?

                                                <View style={styles.pacman}>
                                                    <Text style={styles.maintext1}>Verified</Text>
                                                    <Icon active name='check-circle' type="FontAwesome" style={{ fontSize: 18, color: "#fff", }} />
                                                </View>
                                                : null}
                                            <View style={{ margin: '1%', width: wp('40'), position: 'absolute', top: "35%", left: "63%" }}>
                                                <TouchableWithoutFeedback onPress={() => this.openModal(item.property_id, item.admin_approved_status, item.created_date, item.property_type, item.sub_type)}>
                                                    <View style={styles.editContainer}>
                                                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                                            <Text style={styles.editText}>EDIT LISTING</Text>
                                                            <Icon active name='angle-down' type="FontAwesome" style={{ fontSize: 18, margin: 2 }} />
                                                        </View>
                                                    </View>
                                                </TouchableWithoutFeedback>
                                            </View>
                                            <View style={styles.textView}>
                                                <View style={{ width: "60%" }}>
                                                    <Text style={styles.maintext}>{item.property_title}</Text>
                                                    <View style={{ marginTop: "4%" }}>
                                                        <Text style={styles.subtext}>{item.property_address}</Text>
                                                    </View>
                                                </View>
                                                <View style={styles.priceView}>
                                                    <Text style={styles.pricetext}>{item.price}</Text>
                                                </View>

                                            </View>
                                            {
                                                (item.property_status == 0 || item.property_status == 1) ?
                                                    <Button bordered style={styles.buttonContainer} onPress={() => this.changeStatus(item.property_id)}>
                                                        <Text style={styles.buttonText}>{item.property_status == 0 ? 'In Active' : 'Active'}</Text>
                                                    </Button>
                                                    :
                                                    null
                                            }
                                        </View>
                                        :
                                        null
                                }
                                {
                                    item.property_status == 2 ?
                                        <View>
                                            <View style={styles.imagecontainer1}>
                                                <Image source={{ uri: item.property_image }} style={styles.image} />
                                                <Image source={require('../assets/watermark.png')} style={styles.water} />
                                                {item.admin_approved_status == "approved" ?
                                                    <View style={styles.pacman}>
                                                        <Text style={styles.maintext1}>Verified</Text>
                                                        <Icon active name='check-circle' type="FontAwesome" style={{ fontSize: 18, color: "#fff", }} />
                                                    </View>
                                                    : null}
                                                <View style={{ margin: '1%', width: wp('40'), position: 'absolute', top: "35%", left: "63%" }}>
                                                    <View style={styles.editContainer}>
                                                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                                            <Text style={styles.editText}>EDIT LISTING</Text>
                                                            <Icon active name='angle-down' type="FontAwesome" style={{ fontSize: 18, margin: 2 }} />
                                                        </View>
                                                    </View>
                                                </View>
                                                <View style={styles.textView}>
                                                    <View style={{ width: "60%" }}>
                                                        <Text style={styles.maintext}>{item.property_title}</Text>
                                                        <View style={{ marginTop: "4%" }}>
                                                            <Text style={styles.subtext}>{item.property_address}</Text>
                                                        </View>
                                                    </View>
                                                    <View style={styles.priceView}>
                                                        <Text style={styles.pricetext}>{item.price}</Text>
                                                    </View>
                                                </View>
                                                <Button bordered style={styles.buttonContainer1}>
                                                    <Text style={styles.buttonText1}>Expired</Text>
                                                </Button>
                                            </View>
                                            <Image source={require('../assets/no-stopping.png')} style={{ width: wp('30'), height: hp('35'), position: "absolute", alignSelf: "center", top: 15 }} resizeMode="contain" />
                                        </View>
                                        :
                                        null
                                }
                            </View>
                        )}
                        ListEmptyComponent={this.ListEmptyView}
                    />

                    <View style={{ marginBottom: "3%" }}></View>
                </Content>
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
    modalView: {
        margin: '5%',
        padding: '3%',
        backgroundColor: "white",
        borderRadius: 12,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
    },
    modalDetailsHeader: {
        marginLeft: wp('3')
    },
    modalHeadersub: {
        fontFamily: 'Ubuntu-Bold',
        fontSize: 12,
        color: '#000'
    },
    water: {
        resizeMode: "contain",
        zIndex: 99999,
        width: "40%",
        height: 100,
        position: "absolute",
        alignSelf: "center",
        opacity: 0.3,
        top: 25
    },
    modalHeader: {
        fontFamily: 'Ubuntu-Bold',
        fontSize: 14,
        color: '#81007F'
    },
    divider: {
        borderBottomWidth: 1,
        borderColor: '#cfcfcf',
        marginTop: '4%'
    },
    optionsText: {
        fontFamily: 'Ubuntu-Regular',
        fontSize: 13,
        color: '#6c6c6c',
        margin: '2%'
    },
    editText: {
        fontFamily: 'Ubuntu-Bold',
        fontSize: 12,
        color: '#81007F'
    },
    modalPostdate: {
        fontFamily: 'Ubuntu-Bold',
        fontSize: 10,
        color: '#a4a4a4'
    },
    editContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#cbecff',
        marginTop: hp('2'),
        width: wp('31'),
        padding: '2%',
        borderRadius: 4
    },
    buttonContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        width: '30%',
        padding: '2%',
        borderRadius: 5,
        //alignSelf: "center",
        margin: "2%",
        borderWidth: 1,
        borderColor: '#81007F'
    },
    buttonText: {
        fontFamily: 'Ubuntu-Bold',
        fontSize: 15,
        color: '#81007F',
        fontWeight: "bold"
    },
    buttonContainer1: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        width: '30%',
        padding: '2%',
        borderRadius: 5,
        //alignSelf: "center",
        margin: "2%",
        borderWidth: 1,
        borderColor: 'red'
    },
    buttonText1: {
        fontFamily: 'Ubuntu-Bold',
        fontSize: 15,
        color: 'red',
        fontWeight: "bold"
    },
    text1: {
        fontFamily: 'Ubuntu-Bold',
        fontSize: 18,
        color: '#11be27',
        marginLeft: "5%",
        marginBottom: "2%"
    },
    headerText1: {
        color: "#A6A6A6",
        fontSize: 13,
        fontFamily: 'Ubuntu-Medium'
    },
    emptyimage: {
        marginTop: hp('15'),
        height: hp('40'),
        width: wp('40')
    },
    pacman: {
        width: 130,
        height: 0,
        borderTopColor: "#81007F",
        borderLeftColor: "#81007F",
        borderRightColor: 'transparent',
        borderBottomColor: "#81007F",
        borderWidth: 12,
        //justifyContent: 'center',
        position: 'absolute',
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-around",

    },
    center: {
        // justifyContent: 'center',
        // alignItems: 'center',
        flexDirection: "row",
        marginLeft: "3%"
    },
    menuImage: {
        width: 40,
        height: 40,
        marginTop: '1%'
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
        padding: 5,
        marginTop: "2%"
    },
    locationtext: {
        textAlign: "center",
        marginLeft: "5%",
        fontSize: 17,
        fontFamily: 'Ubuntu-Regular'
    },
    image: {
        width: "100%",
        height: 165,
        marginBottom: "2%",
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
    },
    imagecontainer: {
        borderRadius: 8,
        marginTop: "4%",
        elevation: 3,
        marginLeft: "4%",
        marginRight: "4%",
        backgroundColor: "#fff",
        marginBottom: 1,
    },
    imagecontainer1: {
        borderRadius: 8,
        marginTop: "4%",
        elevation: 3,
        marginLeft: "4%",
        marginRight: "4%",
        backgroundColor: "#fff",
        marginBottom: 1,
        opacity: 0.4,
    },
    like: {
        flexDirection: "row",
        position: "absolute",
        right: "1%",
        bottom: 75,
    },
    textView: {
        marginLeft: "5%",
        marginTop: "1%",
        flexDirection: "row",
        justifyContent: "space-between",
        width: wp('85')
    },
    priceView: {
        justifyContent: "center",
        marginRight: "6%",

    },
    subtext: {
        fontSize: 12,
        fontFamily: 'Ubuntu-Medium',
        color: '#A6A6A6',
        height: 40
    },
    maintext: {
        fontSize: 16,
        fontFamily: 'Ubuntu-Regular'
    },
    maintextView: {
        position: "absolute",
        backgroundColor: "#81007F",
        right: 0,
        flexDirection: "row",
        padding: "1%",
        marginLeft: "3%",
        // marginRight: "3%",
        alignItems: "center",
        justifyContent: "space-around"
    },
    maintext1: {
        fontSize: 15,
        fontFamily: 'Ubuntu-Regular',
        color: "#fff",
        textAlign: "center",
        margin: "10%"

    },
    pricetext: {
        fontSize: 20,
        fontFamily: 'Ubuntu-Bold',
    }
})