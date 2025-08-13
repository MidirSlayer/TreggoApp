import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity, Alert} from "react-native";
import Texto from "../components/Text";
import Tag from "../components/Tag";
import Input from "../components/Input";
import Button from "../components/Button";
import Avatar from "../components/Avatar";
import { spacing, colors, borderRadius } from "../theme";
import { Ionicons } from '@expo/vector-icons' 
import { getSession } from "../services/session";
import { enviarOferta } from "../services/HacerOferta";
import Toast from "react-native-toast-message";
import { useHeaderHeight } from "@react-navigation/elements";


export default function DetalleTrabajoScreen ({route, navigation}) {
    const headerHeight = useHeaderHeight();
    const { trabajo } = route.params;
    const [favorito, setFavorito] = useState(false);
    const [precio, setPrecio] = useState('');
    const [tiempoEstimado, setTiempoEstimado] = useState('');
    const [descripcion, setDescripcion] = useState('');

    function marcarFav () {
      setFavorito(!favorito);
    }

    function reportar () {
      Alert.alert(
        'Reportar trabajo',
        '¿Esta seguro de que desea reportar este trabajo',
        [
          {text: 'Cancelar', style: 'cancel'},
          {text: 'Reportar', onPress: () => Alert.alert('Gracias', 'Reporte Enviado')}
        ]
      );
    }

    async function manejarContacto(trabajo) {
      const session = await getSession();

      if (!descripcion || !precio || !tiempoEstimado){
        Toast.show({
          type: 'info',
          text1: 'Campos deben estar llenos'
        })
        return;
      }
      
      const ofert = enviarOferta({
        trabajo_id: trabajo.id,
        proveedor_id: trabajo.user_id,
        precio: parseFloat(precio),
        tiempo_estimado: tiempoEstimado || null,
        descripcion: descripcion || null
      })
      

     if (ofert) {
      Toast.show({
        type: 'success',
        text1: 'Se ha enviado su oferta'
      })
      navigation.goBack();
     }
      
    }

    return (
      <View style={{flex: 1, paddingTop: headerHeight}}>
        <View style={styles.container}>
          <View style={styles.header}>
              <Avatar uri={trabajo.avatar_url ||
            'https://ui-avatars.com/api/?name=User&background=ccc&color=fff&size=128'}
            /> 
            <View style={{flex: 1}}>
              <Texto type="title" style={{marginHorizontal: spacing.sm}}>{trabajo.titulo}</Texto>

            </View>

            <TouchableOpacity onPress={marcarFav}>
              <Ionicons
                name={favorito ? 'heart' : 'heart-outline'}
                size={24}
                color={favorito ? colors.primary : colors.subtext}
              /> 
            </TouchableOpacity>
          </View>

          <Tag label={trabajo.tipo} />

          <Texto type="body" style={styles.descripcion}>
              {trabajo.descripcion || 'Sin descripcion'}
          </Texto>
          <TouchableOpacity onPress={() => console.log('reporte')} style={styles.reportar}>
            <Ionicons name='flag-outline' size={18} color={colors.danger} style={{marginHorizontal: 3}}/>
            <Texto type='muted' style={{marginLeft : 6, color: colors.danger}}>
              Reportar trabajo
            </Texto>
          </TouchableOpacity>
        </View>

        <View style={{padding: spacing.lg, backgroundColor: colors.card, borderRadius: borderRadius.md, 
          borderTopRightRadius: borderRadius.md, marginHorizontal: spacing.md}}>
          <Texto type="subtitle">Descripcion</Texto>
          <Input
            value={descripcion}
            onChangeText={setDescripcion}
            placeholder="Descripcion de tu oferta"
          />
          <Texto type="subtitle">Precio</Texto>
          <Input
            value={precio}
            onChangeText={setPrecio}
            placeholder="precio de tus servicios en dolares"
          />
          <Texto type="subtitle">Tiempo estimado</Texto>
          <Input
            value={tiempoEstimado}
            onChangeText={setTiempoEstimado}
            placeholder="Tiempo que tardaras en completar el trabajo"
          />
          <Button title='Hacer oferta' onPress={() => manejarContacto(trabajo)} />
        </View>
      </View>
    )
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.lg,
    marginVertical: spacing.lg,
    backgroundColor: '#fff',
    borderRadius: 15,
    marginHorizontal: spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: spacing.md,
    backgroundColor: colors.border,
  },
  descripcion: {
    marginVertical: spacing.md,
    lineHeight: 20,
  },
    reportar: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
});