import React from 'react';
import { StyleSheet, View, Image, Text, TouchableWithoutFeedback, TouchableNativeFeedback, TextInput, Dimensions, StatusBar } from 'react-native';
import {
    Container,
    Content,
} from 'native-base';
import { MaterialIndicator } from 'react-native-indicators';

export default class Step1 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
        }
    }
    componentDidMount() {
        setTimeout(() => { this.setState({ loading: false }) }, 1000)
    }
    goToHome = () => {
        this.props.navigation.navigate('Home')
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
                    <TouchableWithoutFeedback onPress={this.goToHome}>
                        <Image source={require('../assets/back_icon.png')} resizeMode='contain' style={{ marginTop: "5%", marginLeft: "3%" }} />
                    </TouchableWithoutFeedback>
                </View>
                <Content>

                </Content>
                <TouchableWithoutFeedback onPress={this.showalert}>
                    <View style={styles.Button}>
                        <Image source={require('../assets/congrats.png')} style={styles.image} resizeMode="contain" />
                        <View>
                            <Text style={styles.submitText4}>Congratulations</Text>
                            <Text style={styles.text}>Your Property Posted Successfully</Text>
                        </View>
                        <View style={styles.textview}>
                            <View style={{ flexDirection: "row" }}>
                                <Text style={styles.text2}>Note: </Text>
                                <Text style={styles.text1}>Your Property is Approved within</Text>
                            </View>
                            <Text style={styles.text1}>24 hours</Text>
                        </View>
                        <View>
                            <Text style={styles.text}>For more information pleace contact</Text>
                            <Text style={styles.submitText4}>{this.props.route.params.mobile}</Text>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Container>
        )
    }
}
const styles = StyleSheet.create({
    submitText4: {
        fontFamily: 'Ubuntu-Bold',
        fontSize: 23,
        color: '#fff',
        fontWeight: "bold",
        textAlign: "center"
    },
    Button: {
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: '#81007F',
        height: "45%",
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25
    },
    image: {
        position: "absolute",
        bottom: "80%",
    },
    text: {
        color: "#fff",
        fontFamily: 'Ubuntu-Medium',
    },
    text2: {
        fontFamily: 'Ubuntu-Medium',
    },
    textview: {
        marginTop: 5,
        marginBottom: 5,
        padding: 5,
        alignItems: 'center',
        justifyContent: "center",
        backgroundColor: "#F0F0F0",
        height: "20%",
        width: "70%",
        borderRadius: 15
    }
})