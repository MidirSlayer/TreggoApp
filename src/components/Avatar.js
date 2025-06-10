// src/components/Avatar.js
import React from 'react';
import { Image, View, StyleSheet } from 'react-native';
import { colors, borderRadius } from '../theme';

export default function Avatar({ uri, size = 80 }) {
  const defaultUri = 'https://ui-avatars.com/api/?name=User&background=ccc&color=fff&size=128';

  return (
    <View style={[styles.container, { width: size, height: size, borderRadius: size / 2 }]}>
      <Image
        source={{ uri: uri || defaultUri }}
        style={{ width: size, height: size, borderRadius: size / 2 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    backgroundColor: colors.border,
  },
});
