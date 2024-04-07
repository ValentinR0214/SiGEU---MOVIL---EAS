import { View, Text, Pressable } from 'react-native'
import React,{useEffect, useState, useContext}from 'react'
import { Icon } from '@rneui/base'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import HomeStack from './stackEstudiante/HomeStack';
import { NavigationContainer } from '@react-navigation/native';
import { Header, getHeaderTitle } from '@react-navigation/elements';
import AuthContext from '../../../config/context/auth-context';
import UpdateSelct from '../../adminhome/adapters/components/UpdateSelct';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { update } from 'lodash';
import AxiosClient from '../../../config/http-gateway/http-cleint';
import { getColorsFromServer,getLogoFromServer } from '../../../config/colors/colorService';


const Tab = createBottomTabNavigator();
const NavigationEstudiante = () => {
  const [colors, setColors] = useState([]);
  const [photoURL, setPhotoURL] = useState([null]);
  useEffect(() => {
    const fetchColors = async () => {
      const colorsData = await getColorsFromServer();
      const logoData = await getLogoFromServer();
      if (colorsData) {
        setColors(colorsData);
        saveColorsToStorage(colorsData);
      }
      if (logoData) {
        setPhotoURL(logoData);
        saveLogoToStorage(logoData);
      }
    };

    fetchColors();
  }, []);
  console.log("colors", colors);
  console.log("photoURL", photoURL);

  const saveColorsToStorage = async (colors) => {
    try {
      await AsyncStorage.setItem('colors', JSON.stringify(colors));
      console.log('Colores guardados en AsyncStorage.');
    } catch (error) {
      console.error('Error al guardar colores en AsyncStorage:', error);
    }
  };
  const saveLogoToStorage = async (logo) => {
    try {
      await AsyncStorage.setItem('logo', JSON.stringify(logo));
      console.log('Logo guardado en AsyncStorage.');
    } catch (error) {
      console.error('Error al guardar logo en AsyncStorage:', error);
    }
  }


  const [namePerson, setNamePerson] = useState("");

  const getPersonName = async () => {
    const dataUser = JSON.parse(await AsyncStorage.getItem("user"));
    const namePerson = dataUser.user.person.name;
    setNamePerson(namePerson);
  }
  useEffect(() => {
    getPersonName();
  });

  const { state, dispatch } = useContext(AuthContext);
  const [idUser, setIdUser] = useState(null);
  const [dataUser, setDataUser] = useState({});

  const getIdUSer = async () => {
    const datauser = JSON.parse(await AsyncStorage.getItem("user"));
    const idusuario = datauser.user.id;
    setIdUser(Number(idusuario));
  }

useEffect(() => {
  const fetchData = async () => {
    await getIdUSer(); // Llama a getIdUser para obtener el id de usuario
    try {
      console.log(`/usuario/${idUser}`);
      const response = await AxiosClient({
        url: `/usuario/${idUser}`,
        method: 'GET',
      });
      setDataUser(response.data);
      console.log("Data user:", dataUser);
    } catch (error) {
      console.log("Error:", error);
    }
    console.log("Data user fetch:", dataUser); // Mover el console.log aquí
  };
  fetchData();
}, [idUser]);
const datatoSend = {data:dataUser}
console.log("Data to send:", datatoSend);

useEffect(() => {
}, [idUser]);

useEffect(() => {
}, [dataUser]);
  
  const handleIconPress = async () => {
    console.log("bye");
    try {
      setIdUser(null);
      dispatch({ type: 'SIGNOUT' });
    } catch (error) {
        console.error('Error al limpiar AsyncStorage:', error);
    }
};

  return (
    <NavigationContainer>
    <Tab.Navigator
    screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          const { iconName, iconType } = getIconName(route.name, focused);
          // Retornar un Icon de React Native Elements
          return <Icon name={iconName} type={iconType} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.length > 0 ? colors[0].color2 :'#0C7489',
        tabBarInactiveTintColor: 'gray',
        header: ({ options, route }) => (
          <Header {...options} title={getHeaderTitle(options, route.name)} />
        ),
      })}
    >
      <Tab.Screen name="HomeEstudianteStack"
       component={HomeStack} 
      options={{ tabBarShowLabel: false,
        headerLeft: () => (
          <Icon name="account-circle" type='material-community' color={colors.length > 0 ? colors[0].color3 :'#13505B'} size={44} />
        ),
        headerRight: () => (
            <Pressable onPress={handleIconPress}>
                <Icon name="logout" type='material-community' color={colors.length > 0 ? colors[0].color3 :'#13505B'} size={44} />
            </Pressable>
        ),
        headerTitle: "SIGEU - Estudiante " + namePerson, headerTintColor:colors.length > 0 ? colors[0].color3 : '#13505B' }} />
        
      <Tab.Screen name="UpdateSelfUser"
       component={UpdateSelct} 
       initialParams={dataUser}
      options={{ tabBarShowLabel: false,
        headerLeft: () => (
          <Icon name="account-circle" type='material-community' color={colors.length > 0 ? colors[0].color3 :'#13505B'} size={44} />
        ),
        headerRight: () => (
            <Pressable onPress={handleIconPress}>
                <Icon name="logout" type='material-community' color={colors.length > 0 ? colors[0].color3 :'#13505B'} size={44} />
            </Pressable>
        ),
        headerTitle: "SIGEU - Estudiante " + namePerson, headerTintColor: colors.length > 0 ? colors[0].color3 :'#13505B' }} />
    </Tab.Navigator>
    </NavigationContainer>

  )
}

export default NavigationEstudiante

const getIconName=(routeName, focused)=>{
    let iconName = '';
    let iconType='';
  
    switch (routeName) {
      case 'HomeEstudianteStack':
        iconName = focused ? 'home' : 'home-outline'
        iconType = 'material-community'
        break;
      case 'UpdateSelfUser':
        iconName = focused ? 'account-edit' : 'account-edit-outline'
        iconType = 'material-community'
        break;
    }
  
    return {iconName, iconType};
  }