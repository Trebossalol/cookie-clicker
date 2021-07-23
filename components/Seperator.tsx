import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useUISettings } from '../context/UiSettingsContext';


export default (props?: { style?: any }) => {
    const uiSettings = useUISettings();
    return (
        <View style={{...styles.seperator, borderColor: uiSettings.global.colorScheme === 'dark' ? '#d4d4d4' : 'grey', ...props?.style}}/>
    )
}

const styles = StyleSheet.create({
    seperator: {
        borderWidth: 1,
        borderStyle: 'solid',
        marginVertical: 8,
        height: 1,
        width: '100%',
        borderRadius: 5
    },
})