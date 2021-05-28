import React from 'react';
import { StyleSheet, View, Image, Dimensions, FlatList, Text, TouchableWithoutFeedback } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
const baseUrl = "http://demoworks.in/php/mypropertree/api/common/";
import qs from 'qs';
import { MaterialIndicator } from 'react-native-indicators';
import FastImage from 'react-native-fast-image';
import ImageZoom from 'react-native-image-pan-zoom';
export default class PropertyImages extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            sliders: []
        }
    }
    componentDidMount() {
        this.getSliders();
    }
    getSliders = () => {
        this.setState({ loading: true });
        fetch(baseUrl + 'property_gallery', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'content-type': 'application/x-www-form-urlencoded',
            },
            body: qs.stringify({
                property_id: this.props.route.params.property_id
            })
        }).then((response) => response.json())
            .then((json) => {
                if (json.status == 'valid') {
                    this.setState({
                        sliders: json.data.property_gallery,
                        loading: false,
                    });
                } else if (json.status == 'invalid') {
                    this.setState({ loading: false });
                }
            })
            .catch((error) => {
                this.setState({ loading: false });
            });
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
            <View style={{ flex: 1, }}>
                <TouchableWithoutFeedback onPress={() => { this.props.navigation.goBack() }}>
                    <Image source={require('../assets/back_icon.png')} style={styles.leftimage} resizeMode="contain" />
                </TouchableWithoutFeedback>
                {
                    this.state.sliders.map((item, key) => {
                        return (
                            <View style={styles.imagecontainer}>
                                <ImageZoom cropWidth={350}
                                    cropHeight={160}
                                    imageWidth={350}
                                    imageHeight={160}>
                                    <FastImage source={{ uri: item.image }} resizeMode="cover" style={styles.image} />
                                </ImageZoom>
                            </View>
                        )
                    })
                }
            </View>
        )

    }
}
const styles = StyleSheet.create({
    header: {
        borderBottomWidth: 0,
    },
    image: {
        width: 350,
        height: 160,
        borderRadius: 10,
    },
    leftimage: {
        left: 15,
        top: 10
    },
    imagecontainer: {
        alignItems: "center",
        justifyContent: "center",
        marginTop: hp('5')
    },
})