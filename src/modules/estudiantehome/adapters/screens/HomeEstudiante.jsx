import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import AxiosClient from '../../../../config/http-gateway/http-cleint';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Icon, Button, Input } from '@rneui/base';
import CodeExamModal from '../../components/CodeExamModal';
import Loading from '../../../../kernel/components/Loading';

export default function HomeEstudiante(props) {

  const {navigation} = props;
  const [idUser, setIdUser] = useState(0);
  const [examenesHechos, setExamenesHechos] = useState([])
  const [search, setSearch] = useState("")
  const [visibleCode, setVisibleCode] = useState(false)
  const [cargandoExamen, setCargandoExamen] = useState(false);

  
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

  useEffect(() => {
    if (idUser) {
      getEameneshechos();
    }
  }, [idUser]);


  const getEameneshechos = async () => {
    setCargandoExamen(true);
    try {
      const response = await AxiosClient({
        url: "/usuarioexamen/examen/" + idUser,
        method: 'GET',
      })
      console.log("response", response.data);
      setExamenesHechos(response.data);
      setCargandoExamen(false);
    } catch (error) {
      setCargandoExamen(false);
      console.error(error);
    }
  }

  const filteredExamenes = examenesHechos.filter((item) => item.examen.title.toLowerCase().includes(search.toLowerCase()));

  const toggleModal = () => {
    setVisibleCode(!visibleCode);
  }
  
  return (
    <View style={styles.contaienr}>
      <View style={styles.search}>
        <Text style={styles.title}>Historial de examenes</Text>
      </View>
      <Input
        placeholder='Buscar examen'
        rightIcon={<Icon name="search" />}
        inputStyle={styles.input}
        labelStyle={styles.label}
        onChangeText={(text) => setSearch(text)}
        value={search}
      />
      {filteredExamenes
        .map((itemmap, index) => (
          <TouchableOpacity key={index} onPress={()=> navigation.navigate("ExamenHistory",itemmap)}>
            <View style={[styles.row, { backgroundColor: colors.length > 0 ? colors[0].color1 : '#119DA4' }]}>
              <View style={styles.col}>
                <Icon name="book" size={28} color="white" />
                <Text style={styles.titlemap}>{itemmap.examen.title}</Text>
                <Text style={styles.calf}>{itemmap.calificacion}/10</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      <View style={styles.buttonSearch}>
        <Icon name="add" size={64} style={styles.searchIcon} color="#FFFF" onPress={()=>setVisibleCode(true)} />
        {console.log("home",visibleCode)}
      </View>
      <CodeExamModal visibleCode={visibleCode}  toggleModal={toggleModal} />
      <Loading title={"Cargando historial..."} visible={cargandoExamen}/>
    </View>
  )
}

const styles = StyleSheet.create({
  contaienr: {
    flex: 1,
    backgroundColor: "#f2f2f2",
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  input: {
    paddingHorizontal: 16,
    marginVertical: 8,
  },
  row: {
    padding: 18,
    marginTop: 16,
    marginLeft: 10,
    marginRight: 10,
    borderBottomColor: '#f2f2f2',
    backgroundColor: "#119DA4",
    borderRadius: 20,

  },
  titlemap: {
    fontSize: 17,
    color: 'white',
  },
  col: {
    flexDirection: 'row',
    marginLeft: 16,
    justifyContent: "space-between",

  },
  calf: {
    fontSize: 18,
    color: 'white'

  },
  search: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  searchIcon: {
    backgroundColor: '#039A00',
    borderRadius: 30,
  },
  buttonSearch: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
})