// src/components/Texto.js
import React from 'react';
import { Text } from 'react-native';
import { fonts } from '../theme';

export default function Texto({ type = 'body', style, children, ...props }) {
  const fontStyle = fonts[type] || fonts.body;
  return (
    <Text style={[fontStyle, style]} {...props}>
      {children}
    </Text>
  );
}
