import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function PlaceholderScreen ({route}) {
    return(
        <View style={styles.container}>
            <Text style={styles.text}>Pantalla:{route.name}</Text>
            <Text style={styles.note}>(en desarrollo)</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    text: {
        fontSize: 22, fontWeight: 'bold'
    },
    note: {
        fontSize: 16, color: '#888', marginTop: 10
    }
})