import { StyleSheet } from "react-native";



export const LoginStyles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
        backgroundColor: '#119DA4'
      },
      image: {
        width: 120,
        height: 120,
        resizeMode: "contain"
      },
      text: {
        fontSize: 24,
        color: "white",
        textAlign: "center"
      },
      login: {
        padding: 16,
        marginTop: 16,
        width: 350,
        alignItems: "center",
        justifyContent: "center",
      },
      label: {
        color: "white"
      },
      input: {
        color: "white"
      },
      btnContainer: {
        width: '80%',
      },
      btnStyle: {
        backgroundColor: '#039A00',
        shadowColor: "black",
        borderRadius: 5,
      }
})