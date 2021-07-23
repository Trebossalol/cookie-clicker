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
        <ScrollView contentContainerStyle={styles.container}>

            <TouchableHighlight style={styles.item}>
                <Button title='RESET' color='#a10000' onPress={() => alert('Are you sure you want to reset your userdata ?', reset)}/>
            </TouchableHighlight>

            <TouchableHighlight style={styles.item}>
                <Checkbox
                    defaultValue={uiSettings.clicker.show_decimal}
                    onChange={(checked) => uiSettings.edit(e => ({ ...e, clicker: { ...e.clicker, show_decimal: checked } }))}
                    color={checked => checked ? '#1cff20' : '#ff1c1c'}
                    title={checked => checked ? 'Hide decimals' : 'Show decimals'}
                />
            </TouchableHighlight>

            <TouchableHighlight style={styles.item}>
                <Checkbox
                    defaultValue={uiSettings.global.colorScheme === 'light' ? false : true}
                    onChange={(checked) => uiSettings.edit(e => ({ ...e, global: { ...e.global, colorScheme: checked ? 'dark' : 'light' } }))}
                    title={checked => checked ? 'Disable darkmode' : 'Enable darkmode'}
                />
                </TouchableHighlight>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  item: {
    padding: 15,
    width: 320,
  }
});
