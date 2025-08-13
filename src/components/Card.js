// src/components/Card.js
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors, spacing, borderRadius } from '../theme';

export default function Card({ children, style }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
    marginBottom: spacing.md,
    marginHorizontal: spacing.sm
  },
});
