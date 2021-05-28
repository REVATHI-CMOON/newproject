import React from 'react';
import { View, StyleSheet, Image, Text, ImageBackground, StatusBar, Dimensions } from 'react-native';
const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;
export default class Welcome extends React.Component {
    constructor(props) {
        super(props)
    }
    render() {
        return (
            <ImageBackground
                source={require('../assets/bg-splash.png')}
                style={{
                    backgroundColor: '#fff',
                    width: "100%",
                    height: "100%"
                }}
            >
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <Image source={require('../assets/logo.png')} style={styles.menuImage} resizeMode={'contain'} />
                </View>
            </ImageBackground>

        )
    }
}
const styles = StyleSheet.create({
    menuImage: {
        width: "50%",
        height: "20%",
    },
})