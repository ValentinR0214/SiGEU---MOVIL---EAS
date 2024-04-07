import React, { useEffect, useState } from 'react';
import { Modal, StyleSheet, Text, Pressable, View, TextInput, Button } from 'react-native';
import { useFormik } from 'formik';
import * as yup from 'yup';
import AxiosClient from '../../../../config/http-gateway/http-cleint';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TriangleColorPicker, toHsv } from 'react-native-color-picker';
import { Slider } from '@react-native-community/slider';

export default function ColorModal({ route, visibleCode, toggleModal }) {
    const [loading, setLoading] = useState(false);
    const { color } = route.params;
    const { dataColor } = route.params;
    const { id } = route.params;
    console.log("color", color);
    console.log("dataColor", dataColor);
    console.log("id", id);

    const navigation = useNavigation();
    const [visibleError, setVisibleError] = useState(false);
    const [selectedColor, setSelectedColor] = useState(toHsv(color)); // Inicializar el estado con el color recibido

    useEffect(() => {
        setSelectedColor(toHsv(color)); // Actualizar el estado cuando la propiedad color cambie
    }, [color]);

    const onColorChange = (color) => {
        setSelectedColor(color); // Actualizar el estado cuando el color cambie
    }
    const back = () => {
        navigation.goBack();
    }
    const hsvToHex = (h, s, v) => {
        const rgb = hsvToRgb(h, s, v);
        return '#' + ((1 << 24) + (rgb[0] << 16) + (rgb[1] << 8) + rgb[2]).toString(16).slice(1);
    }
    const hsvToRgb = (h, s, v) => {
        let r, g, b, i, f, p, q, t;
        i = Math.floor(h * 6);
        f = h * 6 - i;
        p = v * (1 - s);
        q = v * (1 - f * s);
        t = v * (1 - (1 - f) * s);
        switch (i % 6) {
            case 0: r = v, g = t, b = p; break;
            case 1: r = q, g = v, b = p; break;
            case 2: r = p, g = v, b = t; break;
            case 3: r = p, g = q, b = v; break;
            case 4: r = t, g = p, b = v; break;
            case 5: r = v, g = p, b = q; break;
        }
        return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
    
    }
    
    const [reload,setReload] = useState(false);
    const updateColors = async () => {
        
        try {
            setLoading(true);
            let selectedHexColor = hsvToHex(selectedColor.h, selectedColor.s, selectedColor.v); // Convertir a HEX
            console.log("coloooor", selectedHexColor);
            let payload;
            switch (id) {
                case 1:
                    payload = {
                        id: 1,
                        color1: selectedHexColor,
                        color2: dataColor[0].color2,
                        color3: dataColor[0].color3
                    }
                    break;
                case 2:
                    payload = {
                        id: 1,
                        color1: dataColor[0].color1,
                        color2: selectedHexColor,
                        color3: dataColor[0].color3
                    }
                    break;
                case 3:
                    payload = {
                        id: 1,
                        color1: dataColor[0].color1,
                        color2: dataColor[0].color2,
                        color3: selectedHexColor
                    }
                    break;
                default:
                    break;
            }

            console.log(payload);
            const response = await AxiosClient({
                method: 'PUT',
                url: '/publico/sistema/',
                data: payload
            });
            if (response.status === 'OK') {
                setReload(true)
                console.log(response);
                navigation.goBack();
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }
    console.log(selectedColor);

    return (
        <View style={{ flex: 1, padding: 45, backgroundColor: 'white' }}>
            <Text style={{ color: 'black', fontSize: 24 }}>Escoje el nuevo color</Text>
            <TriangleColorPicker
                oldColor={color}
                color={selectedColor}
                onColorChange={onColorChange}
                onColorSelected={color => alert(`Color selected: ${color}`)}
                onOldColorSelected={color => alert(`Old color selected: ${color}`)}
                style={{ flex: 1 }}
            />
            <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 8, padding: 6 }}>
                <View style={{ paddingHorizontal: 6 }}>
                    <Button title='Guardar' buttonStyle={styles.btnStyle} onPress={updateColors} />
                </View>
                <View style={{ paddingHorizontal: 6 }}>
                    <Button title='Cancelar' buttonStyle={styles.btnStyle} onPress={back} />
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
    },
    buttonOpen: {
        backgroundColor: '#F194FF',
    },
    buttonClose: {
        backgroundColor: '#2196F3',
    },
    btnStyle: {
        backgroundColor: '#039A00',
        color: 'white',

    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
    },
});
