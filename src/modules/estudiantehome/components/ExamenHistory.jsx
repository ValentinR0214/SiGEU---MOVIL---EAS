import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { CheckBox } from '@rneui/base';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AxiosClient from '../../../config/http-gateway/http-cleint';

const ExamenHistory = (props) => {
    const [examenData, setExamenData] = useState(null);
    const [limitePreguntas, setLimitePreguntas] = useState(0);
    const [preguntas, setPreguntas] = useState([]);
    const [idUser, setIdUser] = useState(0);
    const [idExamen, setIdExamen] = useState(0);
    const [respuestaCorrecta, setRespuestaCorrecta] = useState([]);
    const [respuestasLimite, setRespuestasLimite] = useState([]);

    const getIdUSer = async () => {
        const datauser = JSON.parse(await AsyncStorage.getItem("user"));
        setIdUser(Number(datauser.user.id));
    };

    useEffect(() => {
        getIdUSer();
        const itemmap = props.route.params;
        setExamenData(itemmap);
        console.log("itemmap", itemmap);
        setLimitePreguntas(itemmap.examen.numeroPreguntas);
        setIdExamen(itemmap.examen.id);
        setPreguntas(itemmap.examen.preguntas);
    }, []);

    useEffect(() => {
        if (idExamen && idUser) {
            getRespuestasCorrectas();
        }
    }, [idExamen, idUser]);

    const getRespuestasCorrectas = async () => {
        try {
            const repsonse = await AxiosClient({
                url: "/usuariorespuesta/CorrectaRes/" + idUser + "/" + idExamen,
                method: 'GET',
            })
            setRespuestaCorrecta(repsonse.data);
        } catch (error) {
            console.error(error);
        }
    }


    const getBorderColor = (indexPregunta) => {
        const esCorrecta = respuestaCorrecta[indexPregunta];
        return esCorrecta ? "green" : "red";
    };

    const getRespuestasLimite = async () => {
        try {
            const response = await AxiosClient({
                url: `/usuariorespuesta/respuestas/${examenData.usuario.id}`,
                method: 'GET',
            })
            console.log("datoDeExamen",response.data);
            setRespuestasLimite(response.data);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        if (examenData && examenData.usuario && examenData.usuario.id) {
            getRespuestasLimite();
        }
    }, [examenData]);

    return (
        <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.row}>
                    <Text style={styles.title}>Examen: {examenData?.examen.title}</Text>
                    <Text style={styles.description}>{examenData?.examen.description}</Text>
                </View>
                {preguntas.map((pregunta, indexPregunta) => {
                    const respuestasPregunta = respuestasLimite.filter(respuesta => respuesta.pregunta.id === pregunta.id);

                    if (respuestasPregunta.length > 0 ) {
                        return (
                            <View key={indexPregunta} style={[styles.questions, { borderColor: getBorderColor(indexPregunta), borderWidth: 1 }]}>
                                <Text style={styles.questionTitle}>{pregunta.name}</Text>
                                {pregunta.tipo ? (
                                    respuestasPregunta.map((respuesta, indexRespuesta) => (
                                        <View key={indexRespuesta} style={styles.radioRes}>
                                            <CheckBox
                                                checkedIcon="dot-circle-o"
                                                uncheckedIcon="circle-o"
                                                checked={respuesta.correcta}
                                                checkedColor={respuestaCorrecta[indexPregunta] ? "green" : "red"}
                                                containerStyle={{ backgroundColor: "#f2f2f2" }}
                                            />
                                            <Text style={styles.answerText}>{respuesta.respuesta && respuesta.respuesta.nombre ? respuesta.respuesta.nombre : respuesta.description}</Text>
                                        </View>
                                    ))
                                ) : (
                                    <Text style={styles.answerText}>{pregunta.respuestas[0].nombre}</Text>
                                )}
                            </View>
                        );
                    } else {
                        return null;
                    }
                })}
            </ScrollView>
        </View>
    );
};

export default ExamenHistory;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#FFFFFF',
    },
    row: {
        flexDirection: 'column',
        marginBottom: 20,
    },
    title: {
        marginLeft: 10,
        fontSize: 18,
        fontWeight: 'bold',
    },
    description: {
        marginLeft: 10,
        fontSize: 16,
    },
    questions: {
        marginTop: 20,
        backgroundColor: '#f2f2f2',
        borderRadius: 16,
        padding: 10,
    },
    questionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    answerText: {
        fontSize: 16,
        marginLeft: 8,
    },
    radioRes: {
        flexDirection: 'row',
        alignItems: 'center',
    },
});
