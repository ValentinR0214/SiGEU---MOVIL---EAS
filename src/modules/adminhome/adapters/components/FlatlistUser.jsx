import { StyleSheet, Text, View } from 'react-native'
import React, {useState, useEffect} from 'react'
import { Icon } from '@rneui/base'
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function FlatlistUser(props) {
    const {rol, name, status} = props
    const [colors, setColors] = useState([]);
    useEffect(() => {
        const fetchColors = async () => {
          const colors = await getColorsFromStorage();
          if (colors) {
            // Hacer algo con los colores obtenidos, como actualizar el estado
            
            setColors(colors);
          }
        };
      
        fetchColors();
      }, []);
      console.log("colors", colors);
      const getColorsFromStorage = async () => {
        try {
          const colorsData = await AsyncStorage.getItem('colors');
          if (colorsData !== null) {
            return JSON.parse(colorsData);
          }
        } catch (error) {
          console.error('Error al obtener colores de AsyncStorage:', error);
        }
      };

  return (
    <View style={{
      justifyContent: 'space-between' ,
    flexDirection: 'row',
    padding: 18,
    marginBottom: 12,
    backgroundColor: status ? colors.length > 0 ? colors[0].color1:'#119DA4' : '#7A7A7A',

    // shadow ios
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,

    // shadow android
    elevation:3,
    borderRadius: 8,}}>
        <Icon name="account" type='material-community' size={24} color="#fff" />
        <Text style={styles.title}>{rol}</Text>
        <Text style={styles.title}>{name}</Text>
        <Icon name="account-cog" type='material-community' size={24} color="#fff" />
    </View>
  )
}


const styles = StyleSheet.create({
    
    title: {
      fontSize: 14,
      fontWeight: 'bold',
      color: '#fff',
    },
    row: {
        justifyContent: 'space-between' ,
      flexDirection: 'row',
      padding: 18,
      marginBottom: 12,
  
      // shadow ios
      shadowColor: 'black',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
  
      // shadow android
      elevation:3,
      borderRadius: 8,
    },
    image: {
      width: 124,
      height: 124,
      borderRadius: 12,
    },
  })