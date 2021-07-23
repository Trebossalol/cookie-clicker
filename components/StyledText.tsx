import * as React from 'react';
import { useUISettings } from '../context/UiSettingsContext';
import { Text, TextProps } from './Themed';

export function MonoText(props: TextProps) {
  const uiSettings = useUISettings();
  return <Text {...props} style={[props.style, { fontFamily: 'space-mono', color: uiSettings.global.colorScheme === 'dark' ? '#d4d4d4' : '#333333' }]} />;
}
