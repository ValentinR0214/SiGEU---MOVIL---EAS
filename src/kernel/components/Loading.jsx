
import { StyleSheet, Text, View,ActivityIndicator } from 'react-native'
import React from 'react'
import { Overlay } from '@rneui/base'

export default function Loading({ visible,title }) {
  return (
    <Overlay 
    isVisible={visible}
    windowsBackgroundColor='rgb(0,0,0,0.5)'
    overlayBackgroundColor='transparent'
    overlayStyle={styles.overlay}
    >
        <View style={styles.container}>
            <ActivityIndicator size='large' color='green'/>
            <Text style={styles.title}>{title}</Text>
        </View>
    </Overlay>
  )
}

const styles = StyleSheet.create({
    overlay:{
        height:150,
        width:250,
        backgroundColor:'#ffff',
        borderColor: 'green',
        borderWidth:2,
        borderRadius:10,
        justifyContent: 'center',
        alignContent:'center'

    },
    container:{
        flex:1,
        justifyContent:'center',
        alignContent:'center'
    },
    title:{
        color:'tomato',
        textTransform:'uppercase',
        marginTop:16,
        textAlign:'center'

    },
})