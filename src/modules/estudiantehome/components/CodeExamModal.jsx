import React,{useEffect, useState} from 'react';
import { Modal, StyleSheet, Text, Pressable, View, TextInput } from 'react-native';
import { useFormik } from 'formik';
import * as yup from 'yup';
import AxiosClient from '../../../config/http-gateway/http-cleint';
import ErrorAlert from '../../../kernel/components/ErrorAlert';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ExamenHechoAlert from '../../../kernel/components/ExamenHechoAlert';

const CodeExamModal = ({ visibleCode, toggleModal }) => {
  const navigation = useNavigation();
  const [visibleError, setVisibleError] = useState(false);

  const formik = useFormik({
    initialValues: {
      code: "" 
    },
    validationSchema: yup.object().shape({
      code: yup.string().required("Ingresa un código de examen").max(6, "Máximo 6 caracteres").min(6, "Mínimo 6 caracteres")
    }),
    onSubmit: async (values,{setSubmitting}) => {
      try {
        const response = await AxiosClient({
          url: '/examen/' + values.code,
          method:"POST",
        })
        console.log(response.data);
        await AsyncStorage.setItem("examenData",JSON.stringify(response.data));
        navigation.navigate('Examen');
        handleCancel();
      } catch (error) {
        console.error(error);
        setVisibleError(true);
        setTimeout(()=>{
          setVisibleError(false);
          handleCancel();
        },2000);
      }finally{
        setSubmitting(false);
      }
    }
  });



  const handleCancel=() =>{
    formik.resetForm();
    toggleModal();
  }

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visibleCode}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <TextInput
            style={styles.modalText}
            placeholder="Ingrese código de examen"
            onChangeText={formik.handleChange('code')} 
            onBlur={formik.handleBlur('code')}
            value={formik.values.code}
          />
          {formik.touched.code && formik.errors.code && <Text style={styles.errorText}>{formik.errors.code}</Text>}
          <View style={styles.options}>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={formik.handleSubmit} 
            >
              <Text style={styles.textStyle}>Acceder</Text>
            </Pressable>
            <Pressable
              style={[styles.button, styles.btnCancel]}
              onPress={() => handleCancel()}
            >
              <Text style={styles.textStyle}>Cancelar</Text>
            </Pressable>
          </View>
        </View>
      </View>
      <ErrorAlert
        titleError={"Examen no encontrado"}
        visibleError={visibleError}
        />
    </Modal>
  );
}

export default CodeExamModal

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 10,
    padding: 10,
    marginVertical: 5,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#039A00",
  },
  btnCancel:{
    backgroundColor: "#FF0000",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 18,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 18,
    borderColor: 'gray',
  },
  options:{
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  errorText: {
    color: 'red',
    // Estilos adicionales para el texto de error si es necesario
  },
});