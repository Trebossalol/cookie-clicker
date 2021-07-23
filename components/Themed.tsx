/**
 * Learn more about Light and Dark modes:
 * https://docs.expo.io/guides/color-schemes/
 */

import * as React from 'react';
import { StyleProp, Text as DefaultText, View as DefaultView, ViewStyle } from 'react-native';

import Colors from '../constants/Colors';
import { useUISettings } from '../context/UiSettingsContext';
import useColorScheme from '../hooks/useColorScheme';

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
  const theme = useColorScheme();
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return Colors[theme][colorName];
  }
}

type ThemeProps = {
  lightColor?: string;
  darkColor?: string;
};

export type TextProps = ThemeProps & DefaultText['props'];
export type ViewProps = ThemeProps & DefaultView['props'];

export function Text(props: TextProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  return <DefaultText style={[{ color }, style]} {...otherProps} />;
}

export function View(props: ViewProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const uiSettings = useUISettings()
  const styleToApply: StyleProp<ViewStyle> = uiSettings.global.colorScheme === 'dark' ? ({
    backgroundColor: '#1f1f1f'
  }) : (undefined)

  return <DefaultView style={[styleToApply, style]} {...otherProps} />;
}
