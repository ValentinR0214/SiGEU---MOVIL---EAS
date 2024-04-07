
import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Overlay } from '@rneui/base'
import { Icon } from '@rneui/base'

const SuccesfullAlert = ({visbleSucces,titleSuccess}) => {
    return (
        <Overlay 
        isVisible={visbleSucces}
        windowsBackgroundColor='rgb(0,0,0,0.5)'
        overlayBackgroundColor='transparent'
        overlayStyle={styles.overlay}
        >
            <View style={styles.container}>
                <Icon name='check' size={50} color='green'/>
                <Text style={styles.title}>{titleSuccess}</Text>
            </View>
        </Overlay>
      );
}

export default SuccesfullAlert

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
        color:'gray',
        textTransform:'uppercase',
        marginTop:16,
        textAlign:'center'

    },
})