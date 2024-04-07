import { StyleSheet, Text, View, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { Input, Button, Image, Icon } from '@rneui/base';
import { Picker } from '@react-native-picker/picker';
import { useFormik, FormikProvider } from 'formik';
import * as yup from 'yup';
import AxiosClient from '../../../../config/http-gateway/http-cleint';

export default function CreateUser(props) {
    const { navigation } = props;
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(true);
    const [confirm, setConfirm] = useState("");
    const [role, setRole] = useState("");
    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");
    const [curp, setCurp] = useState("");
    const [matricula, setMatricula] = useState("");
    const [lastname, setLastname] = useState("");
    const [loading, setLoading] = useState(false);
    const [visible, setVisibel] = useState(false);
    const [showMessage, setShowMessage] = useState({ email: '', password: '', confirm: '', role: '', name: '', surname: '', curp: '', matricula: '', lastname: '' });

    const [selectedValue, setSelectedValue] = useState("Selecciona Rol");

    const formik = useFormik({
        initialValues: {
            email: "",
            password: "",
            confirm: "",
            role: [],
            status: true,
            name: "",
            surname: "",
            lastname: "",
            curp: "",
            matricula: "",
        },
        validationSchema: yup.object().shape({
            email: yup.string().required('El correo es requerido').email('El correo no es valido'),
            password: yup.string().required("Campo obligatorio").max(50, "Solo se permiten hasta 50 caractéres").min(8, "Mínimo 8 caractéres"),
            confirm: yup.string().test("confirm password", "las contraseñaas no coinciden", function (value) { return this.parent.password === value; }),
            role: yup.string().required("Campo obligatorio").test("Selecciona un rol", "Debes escoger un rol", function (value) { return !!value }),
            name: yup.string().required("Campo obligatorio").max(50, "Solo se permiten hasta 50 caractéres").min(3, "Mínimo 3 caractéres"),
            surname: yup.string().required("Campo obligatorio").max(50, "Solo se permiten hasta 50 caractéres").min(3, "Mínimo 3 caractéres"),
            lastname: yup.string().required("Campo obligatorio").max(50, "Solo se permiten hasta 50 caractéres").min(3, "Mínimo 3 caractéres"),
            curp: yup.string().required("Campo obligatorio").max(18, "Solo se permiten hasta 18 caractéres").min(18, "Mínimo 18 caractéres"),
            matricula: yup.string().required("Campo obligatorio").max(50, "Solo se permiten hasta 50 caractéres").min(3, "Mínimo 3 caractéres"),
        }),
        onSubmit: async (values, { setSubmitting }) => {
                try {
                    const payload = {
                        ...values,
                        status: true,
                        role: {
                            id: values.role,
                        },
                        person: {
                            name: values.name,
                            surname: values.surname,
                            lastname: values.lastname,
                            curp: values.curp,
                            matricula: values.matricula,
                        }
                    }
                    console.log("payload", payload);
                    const response = await AxiosClient({
                        method: 'POST',
                        url: '/usuario/',
                        data: payload
                    });
                    if (response.status === 'OK') {
                        navigation.navigate('UsersLists');
                    }
                    return response;
                } catch (error) {
                    console.log(error);
                } finally {
                    navigation.navigate('UsersLists');
                }
        }
    })


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
                        placeholder='*********'
                        label='Contraseña: *'
                        onChangeText={formik.handleChange('password')}
                        value={formik.values.password}
                        labelStyle={styles.label}
                        containerStyle={styles.input}
                        secureTextEntry={showPassword}
                        rightIcon={
                            <Icon
                                type='material-community'
                                name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                                color='black'
                                onPress={() => setShowPassword(!showPassword)}
                            />
                        }
                        errorMessage={formik.errors.password}
                    />

                    <Input
                        placeholder='********'
                        label='Confirmar contraseña: *'
                        onChangeText={formik.handleChange('confirm')}
                        value={formik.values.confirm}
                        labelStyle={styles.label}
                        containerStyle={styles.input}
                        secureTextEntry={showPassword}
                        rightIcon={
                            <Icon
                                type='material-community'
                                name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                                color='black'
                                onPress={() => setShowPassword(!showPassword)}
                            />
                        }
                        errorMessage={formik.errors.confirm}
                    />

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
                            title='Crear Usuario'
                            containerStyle={styles.btnContainer}
                            buttonStyle={styles.btnStyle}
                            titleStyle={{ color: '#fff' }}
                            onPress={formik.handleSubmit}
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