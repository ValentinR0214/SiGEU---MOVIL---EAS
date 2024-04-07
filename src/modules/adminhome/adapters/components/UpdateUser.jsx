import { StyleSheet, Text, View, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { Input, Button, Image, Icon } from '@rneui/base';
import { Picker } from '@react-native-picker/picker';
import { useFormik, FormikProvider } from 'formik';
import * as yup from 'yup';
import AxiosClient from '../../../../config/http-gateway/http-cleint';

export default function UpdateUser(props) {
    console.log("props", props.route.params.data);
    const { params } = props.route;
    console.log("params", params);
    console.log("params.data", params.data);
    const  data  = params.data;
    console.log("data", data);
    const { navigation } = props;
    const [showMessage, setShowMessage] = useState({ email: '', password: '', confirm: '', role: '', name: '', surname: '', curp: '', matricula: '', lastname: '' });

    const [selectedValue, setSelectedValue] = useState("Selecciona Rol");

    const formik = useFormik({
        initialValues: {
            id:params.data.id,
            email: params.data.email,
            password: params.data.password,
            role: [{id:params.data.role.id}],
            status: true,
            name: params.data.person.name,
            surname: params.data.person.surname,
            lastname: params.data.person.lastname,
            curp: params.data.person.curp,
            matricula: params.data.person.matricula,
        },
        validationSchema: yup.object().shape({
            email: yup.string().required('El correo es requerido').email('El correo no es valido'),
            role: yup.string().required("Campo obligatorio").test("Selecciona un rol", "Debes escoger un rol", function (value) { return !!value }),
            name: yup.string().required("Campo obligatorio").max(50, "Solo se permiten hasta 50 caractéres").min(3, "Mínimo 3 caractéres"),
            surname: yup.string().required("Campo obligatorio").max(50, "Solo se permiten hasta 50 caractéres").min(3, "Mínimo 3 caractéres"),
            lastname: yup.string().required("Campo obligatorio").max(50, "Solo se permiten hasta 50 caractéres").min(3, "Mínimo 3 caractéres"),
            curp: yup.string().required("Campo obligatorio").max(18, "Solo se permiten hasta 18 caractéres").min(18, "Mínimo 18 caractéres"),
            matricula: yup.string().required("Campo obligatorio").max(50, "Solo se permiten hasta 50 caractéres").min(3, "Mínimo 3 caractéres"),
        }),
        onSubmit: async (values, { setSubmitting }) => {
            console.log("values", values);
                try {
                    const payload = {
                        ...values,
                        status: true,
                        role: {
                            id: values.role,
                        },
                        password: params.data.password,
                        person: {
                            id:values.id,
                            name: values.name,
                            surname: values.surname,
                            lastname: values.lastname,
                            curp: values.curp,
                            matricula: values.matricula,
                        }
                    }
                    console.log("payload", payload);
                    const response = await AxiosClient({
                        method: 'PUT',
                        url: '/usuario/'+ params.data.id,
                        data: payload
                    });
                    console.log("response", response);
                    if (response.status === 'OK') {
                        navigation.navigate('UsersLists');
                    }
                    return response;
                } catch (error) {
                    console.log(error);
                } finally {
                }
        }
    })

    const changeStatus = async () => {
            try {
                const response = await AxiosClient({
                    method: 'PATCH',
                    url: '/usuario/changeStatus/' + params.data.id
                });
                console.log("Respuesta del servidor:", response);
                if (response.status === 'OK') {
                    alert("Estado cambiado");
                }
                return response;
            } catch (error) {
            } finally {
            }
    }

  return (
    <FormikProvider value={formik}>
        <View style={styles.container}>
            <ScrollView >
                <Input
                    placeholder='ejemplo@gmail.com'
                    label='Correo electrónico: *'
                    onChangeText={formik.handleChange('email')}
                    value={formik.values.email}
                    labelStyle={styles.label}
                    containerStyle={styles.input}
                    errorMessage={formik.errors.email}
                    rightIcon={<Icon
                        type='material-community'
                        name='email-outline'
                        color='#13505B' />}
                    name='email'
                    id='email'
                />

                <Picker
                    selectedValue={formik.values.role}
                    onValueChange={formik.handleChange('role')}
                    style={{ height: 50, width: 200 }}
                >
                    <Picker.Item label="Selecciona un rol" value="" />
                    <Picker.Item label="Administrador" value="1" />
                    <Picker.Item label="Docente" value="2" />
                    <Picker.Item label="Estudiante" value="3" />
                </Picker>

                <Input
                    placeholder='Víctor'
                    label='Nombre: *'
                    onChangeText={formik.handleChange('name')}
                    value={formik.values.name}
                    labelStyle={styles.label}
                    containerStyle={styles.input}
                    errorMessage={formik.errors.name}
                />

                <Input
                    placeholder='Barrera'
                    label='Apellido Materno: *'
                    onChangeText={formik.handleChange('surname')}
                    value={formik.values.surname}
                    labelStyle={styles.label}
                    containerStyle={styles.input}
                    errorMessage={formik.errors.surname}
                />

                <Input
                    placeholder='Ocampo'
                    label='Apellido Paterno: *'
                    onChangeText={formik.handleChange('lastname')}
                    value={formik.values.lastname}
                    labelStyle={styles.label}
                    containerStyle={styles.input}
                    errorMessage={formik.errors.lastname}
                />
                <Input
                    placeholder='MNBO030625HMGRBBA7'
                    label='CURP: *'
                    onChangeText={formik.handleChange('curp')}
                    value={formik.values.curp}
                    labelStyle={styles.label}
                    containerStyle={styles.input}
                    errorMessage={formik.errors.curp}
                />

                <Input
                    placeholder='20223abxyz'
                    label='Matricula: *'
                    onChangeText={formik.handleChange('matricula')}
                    value={formik.values.matricula}
                    labelStyle={styles.label}
                    containerStyle={styles.input}
                    errorMessage={formik.errors.matricula}
                />

                <View style={{ alignItems: 'center', justifyContent: 'center', }}>
                    <Button
                        title='Actualizar Usuario'
                        containerStyle={styles.btnContainer}
                        buttonStyle={styles.btnStyle}
                        titleStyle={{ color: '#fff', marginBottom: 8 }}
                        onPress={formik.handleSubmit}
                    />
                     <Button
                        title='Cambiar estado'
                        containerStyle={styles.btnContainer}
                        buttonStyle={styles.btnStyle}
                        titleStyle={{ color: '#fff', marginBottom: 8}}
                        onPress={changeStatus}
                    />
                </View>
            </ScrollView>

        </View>
    </FormikProvider>
  )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
        padding: 16,

    },
    logo: {
        width: 120,
        height: 120,
    },
    input: {
        paddingHorizontal: 16,
        marginVertical: 8
    },
    label: {
        color: 'black',
    },
    btnStyle: {
        backgroundColor: '#039A00',
        color: 'white',

    },
    btnContainer: {
        width: '80%',

    }
})