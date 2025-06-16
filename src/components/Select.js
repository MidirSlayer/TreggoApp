import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { colors, spacing, borderRadius, fonts } from '../theme';

export default function Select({ selectedValue, onValueChange, options = [], placeholder = null, style }) {
  return (
    <View style={[styles.container, style]}>
      <Picker
        selectedValue={selectedValue}
        onValueChange={onValueChange}
        style={styles.picker}
        dropdownIconColor={colors.text}
      >
        {placeholder && (
          <Picker.Item
            label={placeholder}
            value=""
            enabled={false}
            color='#999'
          />
        )}

        {options.map((opt) => (
          <Picker.Item key={opt} label={opt} value={opt} />
        ))}
      </Picker>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.sm,
    marginBottom: spacing.md,
    marginLeft: 5,
  },
  picker: {
    color: colors.text,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: fonts.body.fontSize,
  },
});
