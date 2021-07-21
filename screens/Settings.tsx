import * as React from 'react';
import { StyleSheet, Image, ScrollView, RefreshControl, View as ReactNativeView, Button, ToastAndroid, Alert } from 'react-native';
import { TouchableWithoutFeedback, TouchableHighlight } from 'react-native-gesture-handler';
import { MonoText } from '../components/StyledText';
import { useWorldData } from '../context/WorldContext';
import { GameDataRegistry } from '../game/registry';
import getBoxShadow from '../util/getBoxShadow';
import { remove, store } from '../util/storage';

type CallbackFn = () => void

export default (props: any) => {

    const worldData = useWorldData()

    async function reset() {
        const values = Object.values(GameDataRegistry)
        values.forEach(async(v) => {
            let key: string
            if (typeof v === 'string') key = v
            else key = v(worldData.id)
            console.log('removing ', key)
            await remove(key)                
        })
        ToastAndroid.show('Erfolg!', ToastAndroid.SHORT)
    }

    async function add100mio() {
        store(GameDataRegistry.cookies(worldData.id), 100000000)
        store(GameDataRegistry.totalCookies(worldData.id), 100000000)
        ToastAndroid.show('Erfolg!', ToastAndroid.SHORT)
    }

    function alert(question: string, cb: CallbackFn) {
        Alert.alert('Input', question, [
            { text: 'Ja', onPress: cb },
            { text: 'Abbrechen', style: 'cancel' }
        ])
    }

    return (
        <ScrollView>
            <TouchableHighlight>
                <Button title='Reset' color='red' onPress={() => alert('Bist du sicher, dass du deine Daten zurücksetzen willst ?', reset)}/>
            </TouchableHighlight>
            <TouchableHighlight>
                <Button title='Cheat' color='blue' onPress={() => alert('Willst du 100 Mio. Cookies haben?', add100mio)}/>
            </TouchableHighlight>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  }
});
