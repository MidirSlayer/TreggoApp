import React, {useState} from "react";
import { useFocusEffect, useRoute } from "@react-navigation/native";
import {View, StyleSheet, FlatList} from 'react-native'
import OffertCard from "../components/OffertCard";
import { verOfertas } from "../services/HacerOferta";
import Texto from "../components/Text";
import { useHeaderHeight } from "@react-navigation/elements";

export default function OffertScreen ({}) {
    const route = useRoute();
    const {trabajo_id} = route?.params;
    const [ofertas, setOfertas ] = useState([]);

    useFocusEffect(
        React.useCallback(() => {
            async function cargarOfertas() {
                const ofertas = await verOfertas(trabajo_id);
                console.log('Ofertas recibidas', ofertas)
                setOfertas(ofertas);

            }
            cargarOfertas();
        },[])
    )

    return(
        <View style={{flex: 1, paddingTop: useHeaderHeight()}}>
            <FlatList
                data={ofertas}
                keyExtractor={(item => item.id)}
                renderItem={({item}) => (
                    <OffertCard
                        oferta={item}
                    />
                )}
                ListEmptyComponent={<Texto type="subtitle" >Aun no hay ofertas</Texto>}
            />
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1, 
        padding: 20,
        alignItems: 'center'
    }
})