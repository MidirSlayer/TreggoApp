// src/components/Input.js
import React from 'react';
import { TextInput, StyleSheet } from 'react-native';
import { colors, spacing, borderRadius, fonts } from '../theme';

export default function Input({ style, ...props }) {
  return <TextInput style={[styles.input, style]} placeholderTextColor={colors.subtext} {...props} />;
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.sm,
    fontSize: fonts.body.fontSize,
    color: colors.text,
    marginBottom: spacing.md,
    marginLeft: 5,
  },
});
