import * as React from 'react';
import { useColorScheme } from 'react-native';

import { Text, TextProps } from './Themed';

export function MonoText(props: TextProps) {
  const colorScheme = useColorScheme();
  return <Text {...props} style={[props.style, { fontFamily: 'space-mono', color: colorScheme === 'dark' ? '#d4d4d4' : '#333333' }]} />;
}
