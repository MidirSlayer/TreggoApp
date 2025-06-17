
import React from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Texto from './Text';
import Tag from './Tag';
import Card from './Card';
import Button from './Button';
import { spacing, borderRadius, colors } from '../theme';

export default function ProfileJobCard({ trabajo, onPress }) {
  const fecha = new Date(trabajo.fecha).toLocaleDateString();

  return (
    <Card>
      <View style={styles.header}>
        <Image
          source={{
            uri:
              trabajo.avatar_url ||
              'https://ui-avatars.com/api/?name=User&background=ccc&color=fff&size=128',
          }}
          style={styles.avatar}
        />
        <View style={styles.tituloArea}>
          <Texto type="title">{trabajo.titulo}</Texto>
          <Texto type="muted">{fecha}</Texto>
        </View>
      </View>

      <View style={styles.row}>
        <Tag label={trabajo.tipo} />
        <Texto type="muted">
          Distancia: {trabajo.distancia?.toFixed(2)} km
        </Texto>
      </View>

      <Button
        title="Eliminar"
        style={styles.boton}
        onPress={() => onPress?.(trabajo)}
      />
    </Card>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.border,
    marginRight: spacing.md,
  },
  tituloArea: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  boton: {
    alignSelf: 'flex-end',
    marginTop: spacing.sm,
  },
});
