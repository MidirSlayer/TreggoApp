import React, { useState}from "react";
import { View,StyleSheet, Dimensions} from 'react-native'
import Card from "./Card";
import Button from "./Button";
import Texto from "./Text";
import { colors, spacing, fonts } from "../theme";

 const screenWidth = Dimensions.get('window').width

export default function OffertCard ({oferta}) {
   
    const [expandido, setExpandido] = useState(false);
    const max = 100;

    const mostrarDescripcion = expandido ? oferta.descripcion :
    oferta.descripcion.length > max 
    ? oferta.descripcion.substring(0, max) + '...' 
    : oferta.descripcion;

    return(
        <Card>
            <View style={styles.container}>

            <View style={styles.tituloArea}>
                <Texto type="muted" style={{}}>{mostrarDescripcion}{oferta.descripcion.length > max && (
                <Texto type="muted" style={styles.link} 
                    onPress={() => setExpandido(!expandido)}>{expandido ? 'Ver menos' : 'Ver mas'}</Texto>
                )}</Texto> 
    
            </View>
                
            </View>

            <View style={ styles.btnRow}>
                <Button title='ver Perfil'/>
                <Texto type="subtitle" style={styles.precio} >{`Precio: \n $ ${oferta.precio}`}</Texto>
            
            </View>
        </Card>
    )

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: spacing.lg,
        width: screenWidth -spacing.lg*3
        
    },
    tituloArea: {
        flex: 1,
        flexDirection:'row',
        
    },
    row: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'stretch',
        marginBottom: spacing.md
    },
    
    link: {
        color: colors.primary,
        marginTop: 70,        
    },
    btnRow: {
        flexDirection: 'row-reverse',
        marginRight: 5
         
    },
    precio: {
         marginRight: 'auto'
    }


})