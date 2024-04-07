import { StyleSheet, Text, View, Pressable } from 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import React,{useState, useEffect, useContext} from 'react'
import { Icon } from '@rneui/base'
import UsersStack from './stackAdmin/UsersStack'
import SystemStack from './stackAdmin/SystemStack'
import { NavigationContainer } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import Login from '../../auth/adapters/screens/Login'
import { Header, getHeaderTitle } from '@react-navigation/elements';
import AuthContext from '../../../config/context/auth-context'
import { getColorsFromServer, getLogoFromServer } from '../../../config/colors/colorService'

const Tab = createBottomTabNavigator();

export default function NavigationAdmin() {
  const [colors, setColors] = useState([]);
  const [photoURL, setPhotoURL] = useState([null]);
  
  const { state, dispatch } = useContext(AuthContext);
  const [idUser, setIdUser] = useState(null);

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


  const getIdUSer = async () => {
    const datauser = JSON.parse(await AsyncStorage.getItem("user"));
    const idusuario = datauser.user.id;
    setIdUser(Number(idusuario));
  }

  useEffect(() => {
    getIdUSer();
    console.log("AAAG");
  }, [handleIconPress, idUser]);
  
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
          header: ({ options, route }) => (
            <Header {...options} title={getHeaderTitle(options, route.name)} />
        ),
          tabBarActiveTintColor: colors.length > 0 ? colors[0].color2 : '#0C7489',
          tabBarInactiveTintColor: 'gray',
        })}
      >
          <Tab.Screen
          name='UsersStack'
          component={UsersStack}
          options={{
            headerLeft: () => (
                <Icon name="account-circle" type='material-community' color={colors.length > 0 ? colors[0].color3 :'#13505B'} size={44} />
            ),
            headerRight: () => (
                <Pressable onPress={handleIconPress}>
                    <Icon name="logout" type='material-community' color={colors.length > 0 ? colors[0].color3 :'#13505B'} size={44} />
                </Pressable>
            ),
            headerTitle: 'SIGEU - Administrador', headerTintColor: colors.length > 0 ? colors[0].color3 :'#13505B'

        }}
        />
        <Tab.Screen
          name='SystemStack'
          component={SystemStack}
          
          options={{
            headerLeft: () => (
                <Icon name="account-circle" type='material-community' color={colors.length > 0 ? colors[0].color3 :'#13505B'} size={44} />
            ),
            headerRight: () => (
                <Pressable onPress={handleIconPress}>
                    <Icon name="logout" type='material-community' color={colors.length > 0 ? colors[0].color3 :'#13505B'} size={44} />
                </Pressable>
            ),
            headerTitle: 'SIGEU - Administrador', headerTintColor: colors.length > 0 ? colors[0].color3 :'#13505B'
          }}
        />
        
      </Tab.Navigator>
    </NavigationContainer>

  )
}

const getIconName = (routeName, focused) => {
  let iconName = '';
  let iconType = '';

  switch (routeName) {
    case 'index':
      iconName = focused ? 'home' : 'home-outline'
      iconType = 'material-community'
      break;
    case 'UsersStack':
      iconName = focused ? 'account-group' : 'account-group-outline'
      iconType = 'material-community'
      break;
    case 'SystemStack':
      iconName = focused ? 'cog' : 'cog-outline'
      iconType = 'material-community'
      break;
  }

  return { iconName, iconType };
}