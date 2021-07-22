import * as React from 'react';
import { StyleSheet, ScrollView, Button, ToastAndroid, Alert } from 'react-native';
import { TouchableHighlight } from 'react-native-gesture-handler';
import Checkbox from '../components/Checkbox';
import { useUISettings } from '../context/UiSettingsContext';
import { useWorldData } from '../context/WorldContext';
import { useGameData } from '../game/game';
import { GameDataRegistry } from '../game/registry';
import { remove, store } from '../util/storage';

type CallbackFn = () => void

export default (props: any) => {

    const worldData = useWorldData()
    const game = useGameData()
    const uiSettings = useUISettings()

    async function reset() {
        const values = Object.values(GameDataRegistry)
        values.forEach(async(v) => {
            let key: string
            if (typeof v === 'string') key = v
            else key = v(worldData.id)
            console.log('removing ', key)
            await remove(key)                
        })
        await game.sync()
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
                <Button title='RESET' color='red' onPress={() => alert('Are you sure you want to reset your userdata ?', reset)}/>
            </TouchableHighlight>
            <Checkbox
                defaultValue={uiSettings.clicker.show_decimal}
                onChange={(checked) => uiSettings.edit(e => ({ ...e, clicker: { ...e.clicker, show_decimal: checked } }))}
                title={checked => checked ? 'Dezimalstellen ausblenden' : 'Dezimalstellen anzeigen'}
            />
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
