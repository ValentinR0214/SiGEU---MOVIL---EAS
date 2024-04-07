import React,{useState} from 'react';
import { Modal, StyleSheet, Text, Pressable, View, TextInput } from 'react-native';

const EnviarRespuestasModal = ({visibleRes,toggleRes,sendAnsewrs,titleEnviar}) => {

    const handleOk = () =>{
        sendAnsewrs();
        toggleRes();
    }
    const handleCancel = () =>{
        toggleRes();
    }

    return (
        <Modal
          animationType="slide"
          transparent={true}
          visible={visibleRes}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
            <Text style={styles.title}>{titleEnviar}</Text>
              <View style={styles.options}>
                <Pressable
                  style={[styles.button, styles.buttonClose]}
                  onPress={()=>handleOk()} 
                >
                  <Text style={styles.textStyle}>Enviar</Text>
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
        </Modal>
      );
}

export default EnviarRespuestasModal

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
        marginTop: 10,
      },
      title:{
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
      }
})