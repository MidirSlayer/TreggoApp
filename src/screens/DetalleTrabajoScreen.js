import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import Texto from "../components/Text";
import Tag from "../components/Tag";
import Button from "../components/Button";
import Avatar from "../components/Avatar";
import { spacing, colors, borderRadius } from "../theme";

export default function DetalleTrabajoScreen ({route, navigation}) {
    const { trabajo } = route.params;

    const fecha = new Date(trabajo.fecha).toLocaleDateString();

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
            </View>

            <Tag label={trabajo.tipo} />

            <Texto type="body" style={styles.descripcion}>
                {trabajo.descripcion || 'Sin descripcion'}
            </Texto>

            <Texto type="muted" >
                Distancia estimada: {trabajo.distancia?.toFixed(2)} KM
            </Texto>

            <Button
                title="contactar"
                style={{marginTop: spacing.lg}}
                onPress={() => alert('Funcionalidad pendiente')}
            />
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
});