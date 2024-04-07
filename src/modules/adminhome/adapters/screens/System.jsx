import { StyleSheet, Text, View, Image } from 'react-native'
import React, { useState, useEffect } from 'react'
import { Input, Icon, Avatar, Button } from '@rneui/base'
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import { useFormik, FormikProvider } from 'formik';
import AxiosClient from '../../../../config/http-gateway/http-cleint';
import ColorModal from '../components/ColorModal';
import { useNavigation } from '@react-navigation/native';


export default function System() {
    const [loading, setLoading] = useState(false);
    const [photoURL, setPhotoURL] = useState([]);
    const [newPhotoBase64, setNewPhotoBase64] = useState(null);
    const [visible, setVisible] = useState(false);

    const changeAvatar = async () => {
        const resultPermission = await MediaLibrary.requestPermissionsAsync();
        if (resultPermission.status !== 'denied') {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                allowsEditing: true,
                aspect: [2, 2],
                quality: 0.2,
                base64: true
            });

            console.log(result);

            if (!result.canceled) {
                setVisible(true);
                try {
                    // Guardar la imagen como base64 en el estado local
                    setNewPhotoBase64('data:image/jpeg;base64,' + result.assets[0].base64);
                    console.log("newPhotoBase64", newPhotoBase64);
                    formik.handleSubmit();
                    alert('Foto de perfil actualizada');
                } catch (error) {
                    alert('Error al subir la foto de perfil');
                } finally {
                    setVisible(false);
                }
            }
        } else {
            alert('Es necesario aceptar los permisos de la galería');
        }
    }
    const getLogo = async () => {
        try {
            setLoading(true);
            const response = await AxiosClient({
                url: "/publico/logo/",
                method: "GET",
            });
            if (response.status === 'OK') {
                setPhotoURL(response.data);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    const formik = useFormik({
        initialValues: {
            id: 1,
            logo: "", // Inicializar el campo del logo en el formulario
        },
        onSubmit: async (values, { setSubmitting }) => {
            console.log("nueva foto", newPhotoBase64);
            const payload = {
                id: values.id,
                logo: newPhotoBase64, // Utilizar la URL de la imagen seleccionada
            };
            console.log("Este es el payload", payload);
            try {
                const response = await AxiosClient({
                    method: 'PUT',
                    url: '/publico/logo/',
                    data: payload,
                });
                getLogo();
                return response;
            } catch (error) {
            } finally {
                setSubmitting(false);
            }
        },
    });
    const [colors, setColors] = useState([{ color1: '#000000', color2: '#000000', color3: '#000000' }]);
    const [reload, setReload] = useState(false);

    useEffect(() => {
        getLogo();
        getColors();
    }, [reload]);
    console.log("colors", colors);

    const getColors = async () => {
        try {
            setLoading(true);
            const response = await AxiosClient({
                url: "/publico/sistema/",
                method: "GET",
            });
            if (response.status === 'OK') {
                console.log(response);
                setColors(response.data);
                setReload(true)
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    const [selectedColor, setSelectedColor] = useState('#000000');
    const [logo, setLogo] = useState('');
    const [openModal, setOpenModal] = useState(false);
    const [visibleCode, setVisibleCode] = useState(false)
    const navigation = useNavigation();

    const changecolor = (color, dataColor, id) => {
        console.log("color", color);
        setSelectedColor(color); // Actualizar el color seleccionado
        setVisibleCode(true); // Abrir el modal
        console.log(visibleCode);
        navigation.navigate('ColorModal', { color: color, dataColor: dataColor, id: id });
    }

    const toggleModal = () => {
        setVisibleCode(!visibleCode);
    };

    return (
        <View style={styles.container}>
            {photoURL.length > 0 ? (
                <Avatar
                    source={{ uri: photoURL[0].logo }}
                    resizeMode='contain'
                    size={230}
                    rounded
                >
                    <Avatar.Accessory size={24} onPress={changeAvatar} />
                </Avatar>
            ) : (
                <Avatar
                    source={{ uri: "https://cdn-icons-png.flaticon.com/512/987/987815.png"}}
                    resizeMode='contain'
                    size={230}
                    rounded
                >
                    <Avatar.Accessory size={24} onPress={changeAvatar} />
                </Avatar>
            )}
            <View style={styles.row}>
                <Button title="Color A" buttonStyle={{ backgroundColor: colors[0].color1 }} onPress={() => changecolor(colors[0].color1, colors, 1)} />
                <Button title="Color B" buttonStyle={{ backgroundColor: colors[0].color2 }} onPress={() => changecolor(colors[0].color2, colors, 2)} />
                <Button title="Color C" buttonStyle={{ backgroundColor: colors[0].color3 }} onPress={() => changecolor(colors[0].color3, colors, 3)} />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'start',
        alignItems: 'center',
        padding: 32,
        backgroundColor: '#fff'
    },
    title: {
        fontWeight: "bold",
        fontSize: 24,
        textAlign: 'center',
        color: '#13505B'
    },
    row: {
        flex: 1,
        justifyContent: 'space-around',
        flexDirection: 'row',
        padding: 18,
        marginBottom: 12,
    }
})