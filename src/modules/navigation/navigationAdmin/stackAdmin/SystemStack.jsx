import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import System from '../../../adminhome/adapters/screens/System'
import { createStackNavigator } from '@react-navigation/stack'
import { Header, getHeaderTitle } from '@react-navigation/elements';
import { Icon } from '@rneui/base';
import ColorModal from '../../../adminhome/adapters/components/ColorModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Login from '../../../auth/adapters/screens/Login';

const Stack = createStackNavigator();


export default function SystemStack() {
  return (
    <Stack.Navigator
        screenOptions={{
            headerShown: false,
        }}
    >
        <Stack.Screen
            name="System"
            component={System}
            options={{headerLeft: () => (
                <Icon name="account-circle" type='material-community' color={'#13505B'} size={44}/>
            ),
                headerTitle:'SIGEU - Administrador', headerTintColor:'#13505B'
        }}
        />
        
        <Stack.Screen
            name="ColorModal"
            component={ColorModal}
            options={{headerLeft: () => (
                <Icon name="account-circle" type='material-community' color={'#13505B'} size={44}/>
            ),
                headerTitle:'SIGEU - Administrador', headerTintColor:'#13505B'
        }}
        />
    </Stack.Navigator>
  )
}

const styles = StyleSheet.create({})