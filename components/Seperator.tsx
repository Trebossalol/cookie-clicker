import React from 'react';
import { View, StyleSheet } from 'react-native';

export default () => (
    <View style={styles.seperator}/>
)

const styles = StyleSheet.create({
    seperator: {
        borderColor: 'grey',
        borderWidth: 1,
        borderStyle: 'solid',
        marginVertical: 8,
        height: 1,
        width: '100%',
        borderRadius: 5
    },
})