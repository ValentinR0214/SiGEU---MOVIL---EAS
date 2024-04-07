import { StyleSheet, Text, View, Pressable } from 'react-native'
import React from 'react'
import UsersLists from '../../../adminhome/adapters/screens/UsersLists'
import { createStackNavigator } from '@react-navigation/stack'
import { Header, getHeaderTitle } from '@react-navigation/elements';
import { Icon } from '@rneui/base';
import CreateUser from '../../../adminhome/adapters/components/CreateUser';
import UpdateUser from '../../../adminhome/adapters/components/UpdateUser';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeModules } from 'react-native';

const Stack = createStackNavigator();

export default function UsersStack(props) {
    const {navigation} = props;

    return (

        <Stack.Navigator
            screenOptions={{
                headerShown: false,
            }}
        >
            <Stack.Screen
                name="UsersLists"
                component={UsersLists}
            />
            <Stack.Screen
                name='CreateUser'
                component={CreateUser}
            />
            <Stack.Screen
                name="UpdateUser"
                component={UpdateUser}
            />
        </Stack.Navigator>
    )
}

const styles = StyleSheet.create({})