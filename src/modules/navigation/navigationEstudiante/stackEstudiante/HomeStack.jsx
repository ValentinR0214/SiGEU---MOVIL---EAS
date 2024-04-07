import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Icon } from '@rneui/base';
import { createStackNavigator } from '@react-navigation/stack'
import { Header, getHeaderTitle } from '@react-navigation/elements';
import HomeEstudiante from "../../../estudiantehome/adapters/screens/HomeEstudiante";
import AsyncStorage from '@react-native-async-storage/async-storage';
import ExamenHistory from '../../../estudiantehome/components/ExamenHistory';
import HacerExamen from '../../../estudiantehome/components/HacerExamen';

const Stack = createStackNavigator();

const HomeStack = () => {

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index"
        component={HomeEstudiante}
      />
      <Stack.Screen name="ExamenHistory"
        component={ExamenHistory}
      />
      <Stack.Screen name="Examen"
        component={HacerExamen}
      />
    </Stack.Navigator>
  )
}

export default HomeStack