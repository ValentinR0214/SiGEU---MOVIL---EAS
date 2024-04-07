import { StyleSheet, Text, View, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Button, CheckBox, Input } from '@rneui/base';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AxiosClient from '../../../config/http-gateway/http-cleint';
import SuccesfullAlert from '../../../kernel/components/SuccesfullAlert';
import ErrorAlert from "../../../kernel/components/ErrorAlert";
import EnviarRespuestasModal from './EnviarRespuestasModal';

const HacerExamen = (props) => {
    const { navigation } = props;
    const [preguntasMostradas, setPreguntasMostradas] = useState([]);
    const [succesfull, setSuccesfull] = useState(false);
    const [errorAlert, serErrorAlert] = useState(false);
    const [examenData, setExamenData] = useState([]);
    const [code, setCode] = useState("");
    const [preguntas, setPreguntas] = useState([]);
    const [idUser, setIdUser] = useState(0);
    const [selectRespuestas, setSelectRespuestas] = useState([]);
    const [enviarRespuestas, setEnviarRespuestas] = useState(false);
    const [numeroPreguntas, setNumeroPreguntas] = useState(null);

    
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

    const getIdUSer = async () => {
        const datauser = JSON.parse(await AsyncStorage.getItem("user"));
        const idusuario = datauser.user.id;
        setIdUser(Number(idusuario));
      }
      useEffect(() => {
        getIdUSer();
      }, []);

    const saveRespuestasInJson = (preguntaId, respuestaId, textoRespuesta = "", tipo = false) => {
        setSelectRespuestas((prev) => {
            const preguntaObj = preguntas.find(p => p.id === preguntaId);
            let respuestaObj = null;
            if (!tipo) {
              respuestaObj = preguntaObj.respuestas.find(r => r.id === respuestaId);
            }
            const respuestaNueva = {
              correcta: false,
              description: tipo ? textoRespuesta : '',
              respuesta: respuestaObj,
              usuario: { id: Number(idUser) },
              pregunta: preguntaObj,
            };
      
            // Reemplaza la redspuesta andterior para esta pregudnta si existe  so dagrega una nueva 😱
            const indiceExistente = prev.findIndex(r => r.pregunta.id === preguntaId);
            if (indiceExistente !== -1) {
              const respuestasActualizadas = [...prev];
              respuestasActualizadas[indiceExistente] = respuestaNueva;
              return respuestasActualizadas;
            } else {
              return [...prev, respuestaNueva];
            }
          });
    };
    

    const getExamenData = async () => {
        const examenData = JSON.parse(await AsyncStorage.getItem("examenData"));
        const examen = examenData;
        setExamenData(examen);
        setPreguntas(examen.preguntas);
        setCode(examen.code);
        setNumeroPreguntas(examen.numeroPreguntas);

        //sacar el id
        const datauser = JSON.parse(await AsyncStorage.getItem("user"));
        const idusuario = datauser.user.id;
        setIdUser(Number(idusuario));
    }
    useEffect(() => {
        getExamenData();
    }, []);

    const [mostrar, setMostrar] = useState(false);

    useEffect(() => { 
        const shuffleQuestions = (preguntas) => {
          return preguntas.sort(() => Math.random() - 0.5);
        };
    
        const preguntasAleatorias = shuffleQuestions(preguntas);
        const preguntasMostradas = preguntasAleatorias.slice(0, numeroPreguntas);
        setPreguntasMostradas(preguntasMostradas);
      }, [preguntas, numeroPreguntas]); // Ejecutar solo una vez al cargar el componente

    const handleSubmmit = async () => {
        if(selectRespuestas.length < preguntasMostradas.length){
            serErrorAlert(true);
            setTimeout(()=>{
                serErrorAlert(false);
            },2000)
        }else{
            toggleRes();
        }
    };

    const toggleRes = () => {
        setEnviarRespuestas(!enviarRespuestas);
    }

    const sendAnsewrs = async () => {
        try {
            const response = await AxiosClient({
                url: "/usuariorespuesta/",
                method: "POST",
                data: selectRespuestas,
            })
            console.log(response.data);
            navigation.navigate("index")
            setSuccesfull(true);
            setTimeout(()=>{
            setSuccesfull(false);
            },3000);

        } catch (error) {
            console.error(error);
        }

    }
    return (
        <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.row}>
                    <Text style={styles.title}>Examen: {examenData?.title}</Text>
                    <Text style={styles.description}>{examenData?.description}</Text>
                </View>
                {preguntasMostradas.map((pregunta, indexPregunta) => (
                    <View key={indexPregunta} style={styles.questions}>
                        <Text style={styles.questionTitle}>{pregunta.name}</Text>
                        {pregunta.tipo ? (
                            pregunta.respuestas.map((respuesta, indexRespuesta) => (
                                <View key={indexRespuesta} style={styles.radioRes}>
                                    <CheckBox
                                        title={respuesta.nombre}
                                        checkedIcon="dot-circle-o"
                                        uncheckedIcon="circle-o"
                                        key={indexRespuesta}
                                        checked={selectRespuestas.some(r => r.pregunta.id === pregunta.id && r.respuesta?.id === respuesta.id)}
                                        onPress={() => saveRespuestasInJson(pregunta.id, respuesta.id)}
                                    />
                                </View>
                            ))
                        ) : (
                            <Input
                                placeholder='Respuesta'
                                onChangeText={(text) => saveRespuestasInJson(pregunta.id, null, text, true)}
                                value={selectRespuestas.find(r => r.pregunta.id === pregunta.id)?.description || ''}
                            />
                        )}
                    </View>
                ))}
                <Button
                    title={"Enviar respuestas"}
                    onPress={() => handleSubmmit()}
                    buttonStyle={[styles.sendAnswers, { backgroundColor: colors.length > 0 ? colors[0].color1 : '#119DA4' }]}
                />
            </ScrollView>
            <SuccesfullAlert
            visbleSucces={succesfull}
            titleSuccess={"Tus respuestas se han enviado"} 
            />
            <ErrorAlert
            visibleError={errorAlert}
            titleError={"Debes responder todas las preguntas"}
            />
            <EnviarRespuestasModal
            visibleRes={enviarRespuestas}
            toggleRes={toggleRes}
            sendAnsewrs={sendAnsewrs}
            titleEnviar={"¿Estas seguro de enviar tus respuestas?"}
            />
        </View>
    );
}

export default HacerExamen

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
    sendAnswers: {
        marginTop: 20,
        backgroundColor: '#119DA4',
        borderRadius: 16,
        padding: 10,
    }
});

/**
 *         setSelectRespuestas(prev => {
            // encuentra el index d la pregunta que ahroa mismo esta seleccioanda s
            const existingIndex = prev.findIndex(r => r.pregunta.id === idPregunta);

            //checar si es respuesta abeira o cerrada
            if (!tipo) {
                const respuesta = {
                    correcta: false,
                    description: "",
                    respuesta: { id: idRespuesta },
                    usuario: { id: Number(idUser) },
                    pregunta: { id: idPregunta },

                };

                //aqui es un PUT si ya existe Se añade
                if (existingIndex >= 0) {
                    prev[existingIndex] = respuesta;
                    return [...prev];
                } else {
                    //aqui se añade si no existe
                    return [...prev, respuesta];
                }
            } else { // Si es respuesta abierta
                const respuesta = {
                    correcta: false,
                    description: textoRespuesta,
                    respuesta: null,
                    usuario: { id: Number(idUser) },
                    pregunta: { id: idPregunta },
                };
                //aqui es un PUT si ya existe Se añade
                if (existingIndex >= 0) {
                    prev[existingIndex] = respuesta;
                    return [...prev];
                } else {
                    return [...prev, respuesta];
                }
            }
        });
 * 
 */