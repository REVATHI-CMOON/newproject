import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { MaterialIndicator } from 'react-native-indicators';
export default class NoData extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true
        }
    }
    componentDidMount() {
        setTimeout(() => { this.setState({ loading: false }) }, 2000)
    }
    render() {
        if (this.state.loading) {
            return (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <MaterialIndicator color="#81007F" size={30} />
                </View>
            )
        }
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{
                    fontFamily: 'Ubuntu-Regular',
                    color: 'red', fontSize: 16
                }}>No data found</Text>
            </View>
        )
    }
}