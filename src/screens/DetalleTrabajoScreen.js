import React, { useState } from "react";
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert} from "react-native";
import Texto from "../components/Text";
import Tag from "../components/Tag";
import Button from "../components/Button";
import Avatar from "../components/Avatar";
import { spacing, colors, borderRadius } from "../theme";
import { Ionicons } from '@expo/vector-icons' 
import { contactarProveedor } from "../services/contactarProveedor";
import { getSession } from "../services/session";

export default function DetalleTrabajoScreen ({route, navigation}) {
    const { trabajo } = route.params;
    const [favorito, setFavorito] = useState(false);
    const [proveedor, setProveedor] = useState(null);
    const [yaContactado, setYaContactado] = useState(false);
    
    

    const fecha = new Date(trabajo.fecha).toLocaleDateString();

   
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
      
      const resultado = await contactarProveedor({
        proveedoId: trabajo.user_id,
        clienteId: session.user.id,
        trabajoId: trabajo.id,
        comision: 0.25
      })

      if (resultado.ok) {
        if(resultado.proveedor){
          setProveedor(resultado.proveedor)
        }
        setYaContactado(true);
        Alert.alert('Exito', 'Puedes contactar al proveedor');
      } else if (resultado.mensaje === 'Ya has contactado a este proveedor.') {
        if (resultado.proveedor) {
          setProveedor(resultado.proveedor)
        }
      setYaContactado(true);
      } else {
        Alert.alert('No disponible', resultado.mensaje?.toString());
      }
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.header}>
                <Avatar uri={trabajo.avatar_url ||
              'https://ui-avatars.com/api/?name=User&background=ccc&color=fff&size=128'}
              /> 
              <View style={{flex: 1}}>
                <Texto type="title">{trabajo.titulo}</Texto>
                <Texto type="muted">{fecha}</Texto>
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

           {yaContactado || proveedor ? (
              <View style={styles.contactoBox}>
                <Texto type="subtitle">Información del proveedor:</Texto>
                <Texto>📛 {proveedor?.nombre ?? 'Nombre no disponible'}</Texto>
                <Texto>📍 {proveedor?.ciudad}</Texto>
                <Texto>{trabajo.distancia?.toFixed(2)}KM</Texto>
                <Texto>📞 {proveedor?.telefono}</Texto>
              </View>
            ):(<Button
                title="contactar"
                style={{marginTop: spacing.lg}}
                onPress={() => manejarContacto(trabajo)}
            />)}

            <TouchableOpacity onPress={reportar} style={styles.reportar}>
              <Ionicons name='flag-outline' size={18} color={colors.danger} />
              <Texto type='muted' style={{marginLeft : 6, colors: colors.danger}}>
                reportar trabajo
              </Texto>
            </TouchableOpacity>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.lg,
    marginTop: 20,
    backgroundColor: '#fff',
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
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.lg,
  },
});