import React, { Component } from 'react';
import { StyleSheet, TouchableNativeFeedback, TouchableWithoutFeedback, Text, StatusBar, View, Image, Pressable } from 'react-native';
import { Container, Header, Content, List, ListItem, Icon, Left, Body, Toast } from 'native-base';
import AsyncStorage from '@react-native-community/async-storage';
import { MaterialIndicator } from 'react-native-indicators';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import qs from 'qs';
const baseUrl = "http://demoworks.in/php/mypropertree/api/dashboard/";
export default class Sidebar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            register_type: '',
            user_id: "",
            user_name: "",
            is_user_plan_expired: "",
            payment_id: "",
            register_type_id: ""
        }
    }
    componentDidMount() {
        AsyncStorage.getItem('register_type_name').then((register_type_name) => {
            this.setState({ register_type: register_type_name })
        })
        AsyncStorage.getItem('register_type_id').then((register_type_id) => {
            this.setState({ register_type_id: register_type_id })
        })
        AsyncStorage.getItem('user_id').then((user_id) => {
            this.getProfileDetails(user_id);
            this.setState({ user_id: user_id })
        })
        AsyncStorage.getItem('user_name').then((user_name) => {
            this.setState({ user_name: user_name });
        })
        this.focusListener = this.props.navigation.addListener('focus', () => {
            this.getProfileDetails(this.state.user_id);
        });
        setTimeout(() => { this.setState({ loading: false }) }, 600)
    }
    getProfileDetails = (user_id) => {
        if (user_id) {
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
                    this.setState({
                        loading: false,
                        is_user_plan_expired: json.data.is_user_plan_expired,
                        payment_id: json.data.payment_id
                    });
                })
                .catch((error) => {
                    this.setState({ loading: false });
                    console.error(error);
                });
        }
        else {
            this.setState({ loading: false });
        }
    }
    goToHome = () => {
        this.props.closeDrawer();
        this.props.navigation.navigate('Home');
    }
    goToProperty = () => {
        if (this.state.is_user_plan_expired == "0") {
            if (this.state.register_type_id == "9") {
                this.props.navigation.navigate('Step2', { payment_id: this.state.payment_id })
            }
            else {
                this.props.navigation.navigate('Property', { payment_id: this.state.payment_id })
            }
        }
        else if (this.state.is_user_plan_expired == "1") {
            Toast.show({
                text: "Please Purchase Package",
                duration: 2000,
                type: 'danger',
                textStyle: { fontFamily: 'Ubuntu-Regular', color: "#ffffff", textAlign: 'center' },
            })
            this.props.navigation.navigate('Packages')
        }
    }
    Help = () => {
        this.props.navigation.navigate('Help');
    }
    goToAboutUs = () => {
        this.props.navigation.navigate('AboutUs');
    }
    goToTerms = () => {
        this.props.navigation.navigate('TermsAndConditions');
    }
    goToLoans = () => {
        this.props.navigation.navigate('Loans');
    }
    goToBuilders = () => {
        this.props.navigation.navigate('AboutBuilders');
    }
    goToFurniture = () => {
        this.props.navigation.navigate('Furniture');
    }
    goToRegister = () => {
        this.props.navigation.navigate('Register');
    }
    goToLogin = () => {
        this.props.navigation.navigate('Login');
    }
    goToInterior = () => {
        this.props.navigation.navigate('InteriorDesign');
    }
    goToChangePassword = () => {
        this.props.navigation.navigate('ChangePassword');
    }
    goToRealestate = () => {
        this.props.closeDrawer();
        this.props.navigation.navigate('Realestate');
    }
    goToPackers = () => {
        this.props.navigation.navigate('Packers');
    }
    goToConstruction = () => {
        this.props.navigation.navigate('ConstructionMaterials');
    }
    goToServices = () => {
        this.props.navigation.navigate('Services');
    }
    goToMypackages = () => {
        this.props.navigation.navigate('Mypackages');
    }
    goToManageProperties = () => {
        this.props.navigation.navigate('ManageProperties');
    }
    goToProfile = () => {
        this.props.navigation.navigate('Profile');
    }
    logout = async () => {
        await AsyncStorage.setItem('user_id', '');
        await AsyncStorage.setItem('register_type', '');
        await AsyncStorage.setItem('user_name', '');
        await AsyncStorage.setItem('is_user_plan_expired', '');
        await AsyncStorage.setItem('payment_id', '');
        this.props.navigation.navigate('MainNavigator')
    }
    render() {
        if (this.state.loading) {
            return (
                <View>
                    {/* <StatusBar backgroundColor="#81007F" /> */}
                    <MaterialIndicator color="#81007F" size={30} />
                </View>
            )
        }
        return (
            <Container>
                <View style={styles.header} >
                    <View style={styles.leftContainer}>
                        <Image
                            source={require('../assets/user.png')}
                            style={{ height: 35, width: 28, }}
                        />
                    </View>
                    {this.state.user_id ?
                        <View style={{ marginTop: hp('3') }}>
                            <View style={styles.welcomeContainer}>
                                <Text style={styles.welcomeTextName}>{this.state.register_type}</Text>
                                <Text style={styles.welcomeText1}>{this.state.user_name} !</Text>
                            </View>

                            {/* <View style={{ flexDirection: 'row', marginLeft: "5%" }}>
                            <TouchableWithoutFeedback onPress={this.goToRegister}>
                                <View style={styles.buttonContainer}>
                                    <Text style={styles.buttonText}>Register</Text>
                                </View>
                            </TouchableWithoutFeedback>
                            <TouchableWithoutFeedback onPress={this.goToLogin}>
                                <View style={styles.buttonContainer}>
                                    <Text style={styles.buttonText}>Login</Text>
                                </View>
                            </TouchableWithoutFeedback>
                        </View> */}

                        </View>
                        :
                        <View style={{ marginTop: "5%" }}>
                            <View style={styles.welcomeContainer}>
                                <Text style={styles.welcomeText}>Welcome Guest!</Text>
                            </View>
                            <View style={{ flexDirection: 'row', marginLeft: "5%" }}>
                                <TouchableWithoutFeedback onPress={this.goToRegister}>
                                    <View style={styles.buttonContainer}>
                                        <Text style={styles.buttonText}>Register</Text>
                                    </View>
                                </TouchableWithoutFeedback>
                                <TouchableWithoutFeedback onPress={this.goToLogin}>
                                    <View style={styles.buttonContainer}>
                                        <Text style={styles.buttonText}>Login</Text>
                                    </View>
                                </TouchableWithoutFeedback>
                            </View>
                        </View>
                    }
                </View>

                <Content>
                    {(this.state.register_type_id == 1 || this.state.register_type_id == 2 || this.state.register_type_id == 3 || this.state.register_type_id == 4 || this.state.register_type_id == 9) && this.state.user_id ?
                        <List style={{ marginBottom: '5%' }}>
                            {/* <TouchableNativeFeedback onPress={this.goToHome}>
                                <ListItem>
                                    <Text style={styles.notificationText}>Home</Text>
                                </ListItem>
                            </TouchableNativeFeedback> */}
                            <TouchableNativeFeedback onPress={this.goToProfile}>
                                <ListItem>
                                    <Text style={styles.notificationText}>My Profile</Text>
                                </ListItem>
                            </TouchableNativeFeedback>
                            <TouchableNativeFeedback onPress={this.goToMypackages}>
                                <ListItem>
                                    <Text style={styles.notificationText}>My Packages</Text>
                                </ListItem>
                            </TouchableNativeFeedback>

                            <TouchableNativeFeedback onPress={this.goToProperty}>
                                <ListItem>
                                    <Text style={styles.notificationText}>Post Property</Text>
                                </ListItem>
                            </TouchableNativeFeedback>
                            <TouchableNativeFeedback onPress={this.goToManageProperties}>
                                <ListItem>
                                    <Text style={styles.notificationText}>Manage Properties</Text>
                                </ListItem>
                            </TouchableNativeFeedback>
                            <TouchableNativeFeedback onPress={this.Help}>
                                <ListItem>
                                    <Text style={styles.notificationText}>Help / Support</Text>
                                </ListItem>
                            </TouchableNativeFeedback>
                            <TouchableNativeFeedback onPress={this.goToTerms}>
                                <ListItem>
                                    <Text style={styles.notificationText}>Terms & Conditions</Text>
                                </ListItem>
                            </TouchableNativeFeedback>
                            <TouchableNativeFeedback onPress={this.goToChangePassword}>
                                <ListItem>
                                    <Text style={styles.notificationText}>Change Password</Text>
                                </ListItem>
                            </TouchableNativeFeedback>
                            <TouchableWithoutFeedback onPress={this.logout}>
                                <ListItem>
                                    <Text style={styles.notificationText}>Logout</Text>
                                </ListItem>
                            </TouchableWithoutFeedback>
                        </List>
                        :
                        this.state.user_id == undefined ?
                            <List style={{ marginBottom: '5%' }}>
                                {/* <TouchableNativeFeedback onPress={this.goToHome}>
                                    <ListItem>
                                        <Text style={styles.notificationText}>Home</Text>
                                    </ListItem>
                                </TouchableNativeFeedback> */}
                                <TouchableWithoutFeedback onPress={this.goToAboutUs}>
                                    <ListItem>
                                        <Text style={styles.notificationText}>About us</Text>
                                    </ListItem>
                                </TouchableWithoutFeedback>
                                <TouchableWithoutFeedback onPress={this.Help}>
                                    <ListItem>
                                        <Text style={styles.notificationText}>Help Support</Text>
                                    </ListItem>
                                </TouchableWithoutFeedback>
                                <TouchableWithoutFeedback onPress={this.goToTerms}>
                                    <ListItem>
                                        <Text style={styles.notificationText}>Terms and Conditions</Text>
                                    </ListItem>
                                </TouchableWithoutFeedback>
                            </List> :
                            null
                    }
                    {(this.state.register_type_id == 5 || this.state.register_type_id == 6 || this.state.register_type_id == 7) && this.state.user_id ?
                        <List style={{ marginBottom: '5%' }}>
                            <TouchableNativeFeedback onPress={this.goToProfile}>
                                <ListItem>
                                    <Text style={styles.notificationText}>My Profile</Text>
                                </ListItem>
                            </TouchableNativeFeedback>
                            <TouchableNativeFeedback onPress={this.goToMypackages}>
                                <ListItem>
                                    <Text style={styles.notificationText}>My Packages</Text>
                                </ListItem>
                            </TouchableNativeFeedback>
                            <TouchableNativeFeedback onPress={this.goToManageProperties}>
                                <ListItem>
                                    <Text style={styles.notificationText}>Manage Properties</Text>
                                </ListItem>
                            </TouchableNativeFeedback>
                            <TouchableNativeFeedback onPress={this.Help}>
                                <ListItem>
                                    <Text style={styles.notificationText}>Help / Support</Text>
                                </ListItem>
                            </TouchableNativeFeedback>
                            <TouchableNativeFeedback onPress={this.goToTerms}>
                                <ListItem>
                                    <Text style={styles.notificationText}>Terms & Conditions</Text>
                                </ListItem>
                            </TouchableNativeFeedback>
                            <TouchableNativeFeedback onPress={this.goToChangePassword}>
                                <ListItem>
                                    <Text style={styles.notificationText}>Change Password</Text>
                                </ListItem>
                            </TouchableNativeFeedback>
                            <TouchableWithoutFeedback onPress={this.logout}>
                                <ListItem>
                                    <Text style={styles.notificationText}>Logout</Text>
                                </ListItem>
                            </TouchableWithoutFeedback>
                        </List>
                        :
                        null
                    }
                </Content>
                <Pressable onPress={this.goToHome}>
                    <View style={styles.button}>
                        <Text style={styles.welcomeText2}>Back To Home</Text>
                    </View>
                </Pressable>
                {/* <TouchableNativeFeedback onPress={this.goToHome}>
                    <ListItem>
                        <Text style={styles.notificationText}>Home</Text>
                    </ListItem>
                </TouchableNativeFeedback> */}
            </Container>
        );
    }
}
const styles = StyleSheet.create({
    notificationText: {
        fontFamily: "Ubuntu-Regular",
        fontSize: 13,
        color: '#4D4D4D',
    },
    header: {
        backgroundColor: '#81007F',
        height: hp('13'),
        borderBottomLeftRadius: 25,
        borderBottomRightRadius: 25,
        flexDirection: "row"
    },
    leftContainer: {
        marginLeft: wp('5'),
        marginTop: hp('2'),
        height: 60,
        width: 60,
        borderRadius: 60 / 2,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center"
    },
    buttonContainer: {
        width: wp('18'),
        height: hp('4'),
        backgroundColor: '#ffff',
        margin: '1%',
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonText: {
        fontFamily: "Ubuntu-Medium",
        fontSize: 12,
    },
    welcomeText: {
        fontFamily: "Ubuntu-Bold",
        fontSize: 15,
        color: '#ffffff',
        textAlign: 'center',
    },
    welcomeText1: {
        fontFamily: "Ubuntu-Regular",
        fontSize: 13,
        color: '#ffffff',
        marginLeft: wp('4'),
        alignSelf: "flex-start"
    },
    welcomeTextName: {
        fontFamily: "Ubuntu-Bold",
        fontSize: 18,
        color: '#ffffff',
        marginLeft: wp('4'),
        marginBottom: wp('2'),
        alignSelf: "flex-start"
    },
    welcomeText2: {
        fontFamily: "Ubuntu-Bold",
        fontSize: 15,
        color: '#ffffff',
        textAlign: 'center',
    },
    welcomeContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: "3%",
        // flexDirection: "row"
    },
    button: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#81007F',
        // width: '55%',
        padding: '2%',
        borderRadius: 5,
        alignSelf: "flex-end",
        margin: "2%",
        marginBottom: "4%",
        flexDirection: "row",
        justifyContent: "space-between"
    },
})