// src/theme/toastTheme.js
import React from 'react';
import { View, StyleSheet } from 'react-native';
import Texto from '../components/Text'; // tu componente personalizado
import { colors, spacing, borderRadius } from '../theme';

export const toastTheme = {
  success: (internalState) => (
    <View style={[styles.toast, styles.success]}>
      <Texto type="subtitle" style={styles.text}>{internalState.text1}</Texto>
      {internalState.text2 ? (
        <Texto type="body" style={styles.text}>{internalState.text2}</Texto>
      ) : null}
    </View>
  ),
  error: (internalState) => (
    <View style={[styles.toast, styles.error]}>
      <Texto type="subtitle" style={styles.text}>{internalState.text1}</Texto>
      {internalState.text2 ? (
        <Texto type="body" style={styles.text}>{internalState.text2}</Texto>
      ) : null}
    </View>
  ),
  info: (internalState) => (
    <View style={[styles.toast, styles.info]}>
      <Texto type="subtitle" style={styles.text}>{internalState.text1}</Texto>
      {internalState.text2 ? (
        <Texto type="body" style={styles.text}>{internalState.text2}</Texto>
      ) : null}
    </View>
  ),
};

const styles = StyleSheet.create({
  toast: {
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  text: {
    color: colors.text,
  },
  success: {
    backgroundColor: '#d1f5d3',
  },
  error: {
    backgroundColor: '#fddede',
  },
  info: {
    backgroundColor: '#dbefff',
  },
});
