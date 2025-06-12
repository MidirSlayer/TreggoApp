import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { colors, spacing, borderRadius } from "../theme";

export default function Filtros ({ tipos, activo , onSelect }) {
    return (
        <View style={styles.container}>
            {tipos.map((tipo) => {
                const esActivo = tipo === activo;
                return(
                    <TouchableOpacity
                    key={tipo}
                    style={[styles.filtro, esActivo && styles.activo]}
                    onPress={() => onSelect(tipo)}
                >
                <Text style={[styles.texto, esActivo && styles.textoActivo]}>
                    {tipo}
                </Text> 
                </TouchableOpacity>
                )
            })}
        </View>
    )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  filtro: {
    backgroundColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: borderRadius.sm,
    marginRight: spacing.sm,
  },
  activo: {
    backgroundColor: colors.primary,
  },
  texto: {
    color: colors.text,
    fontSize: 14,
  },
  textoActivo: {
    color: '#fff',
    fontWeight: '600',
  },
});