import React, { useState, useEffect, createContext } from 'react'
import { View, StatusBar } from 'react-native'
import AuthStack from './AuthStack'
import AppStack from './AppStack'
import { MaterialIndicator } from 'react-native-indicators';
import AsyncStorage from '@react-native-community/async-storage';
export default class MainNavigator extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: true,
            user_id: "",
        }
    }
    componentDidMount() {
        setTimeout(() => {
            <MaterialIndicator color="#81007F" size={30} />
        }, 5000);
        AsyncStorage.getItem('user_id').then((user_id) => {
            this.setState({
                user_id: user_id,
                loading: false,
            });
        });
    }
    render() {
        if (this.state.loading) {
            return (
                <View style={{ flex: 1 }}>
                    <StatusBar backgroundColor="#81007F" />
                    <MaterialIndicator color="#81007F" size={30} />
                </View>
            )
        }
        if (this.state.user_id) {
            return (
                <AppStack />
            )
        } else {
            return (
                <AuthStack />
            )
        }

        // if (this.state.user_type == 1 && this.state.user_type && this.state.user_id) {
        //     return (
        //         <AppStack />
        //     )
        // } else if (this.state.user_type == 2 && this.state.user_type && this.state.user_id) {
        //     return (
        //         <AuthStack />
        //     )
        // }
        // return (
        //     <AuthStack />
        // )
    }
}
