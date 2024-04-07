import { useNavigation } from "@react-navigation/native";

export const handleLogin = async (email, password) => {
    const navigation = useNavigation();
    const sigin = {
        email: email,
        password: password
    }
     try {
       fetch('http://192.168.1.73:8080/api/auth/signin', {
         method: 'POST',
         headers: {
           'Content-Type': 'application/json'
         },
         body: JSON.stringify(sigin)
       })
         .then(response => response.json())
         .then(data => {
              console.log('Success:', data);
              return data;
         })
     } catch (error) {
       console.log('Error: ', error);
       throw error;
     } 
};