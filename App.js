import React, { useEffect, useState,useReducer } from 'react';
import { StyleSheet} from 'react-native';
import NavigationAdmin from './src/modules/navigation/navigationAdmin/NavigationAdmin';
import NavigationEstudiante from './src/modules/navigation/navigationEstudiante/NavigationEstudiante';
import Login from './src/modules/auth/adapters/screens/Login';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AuthContext from './src/config/context/auth-context';
import { AuthManager } from './src/config/context/auth-manager';

const initialState = {
  signed: false,
  role: null,
};

const init = async () => {
  const role = await AsyncStorage.getItem('role');
  if (role) {
    return { signed: true, role };
  }
  return initialState;
};

export default function App() {
  
  const [state, dispatch] = useReducer(AuthManager, initialState, init);

  useEffect(() => {
    init().then((initialState) => dispatch({ type: 'INIT', ...initialState }));
  }, []);


  /*const [student, setStudent] = useState(false);
  const [admin, setAdmin] = useState(false);
  const [login, setLogin] = useState(true);
  const [reload, setReload] = useState(false);



  const getRole = async () => {
    //const role =  await AsyncStorage.removeItem('role');
    const role =  await AsyncStorage.getItem('role');
    console.log("Recibiendo rol desde app", role);
    if (role === 'ADMIN_ROLE') {
      setAdmin(true);
      setStudent(false);
      setLogin(false);
    } else if (role === 'ESTUDIANTE_ROLE') {
      setStudent(true);
      setAdmin(false);
      setLogin(false);
    } else {  
      setAdmin(false);
      setStudent(false);
      setLogin(true);
    }
  }


  useEffect(() => {
    getRole();
    setReload(false);
  }, [reload]);
*/

return (
  <AuthContext.Provider value={{ state, dispatch }}>
    {state.signed ? (
  state.role === 'ADMIN_ROLE' ? (
    <NavigationAdmin />
  ) : state.role === 'ESTUDIANTE_ROLE' ? (
    <NavigationEstudiante />
  ) : <Login /> // Agrega un valor de retorno para el caso en que el rol no sea ni 'ADMIN_ROLE' ni 'ESTUDIANTE_ROLE'
) : (
  <Login />
)}
  </AuthContext.Provider>
);

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
