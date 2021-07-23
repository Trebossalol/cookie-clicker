import * as React from 'react';
import { ToastAndroid, TextStyle } from 'react-native';
import { GameDataRegistry } from '../game/registry';
import { retrieve, store } from '../util/storage';

export interface UiSettings {
    clicker: {
        show_decimal: boolean
    },
    global: {
        colorScheme: 'light' | 'dark',
        textStyle: TextStyle
    },
    api: {
        version: string
    }
}

const DEFAULT: ExtendedUiSettings = {
    clicker: {
        show_decimal: true
    },
    global: {
        colorScheme: 'light', 
        textStyle: {}
    },
    api: {
        version: '1.0'
    },
    edit: () => Promise.resolve()
}

export interface ExtendedUiSettings extends UiSettings {
    edit: (callback: (settings: UiSettings) => UiSettings) => void
}

const UiSettingsContext = React.createContext<ExtendedUiSettings>(DEFAULT)

export function useUISettings(): ExtendedUiSettings {
    return React.useContext(UiSettingsContext)
}

export function UiSettingsProvider(props: any) {

    const [settings, setSettings] = React.useState<UiSettings>(DEFAULT)

    React.useEffect(() => {
        updateStates()
    }, [])

    const cacheUiSettingsData = React.useCallback(async() => {
        await store<UiSettings>(GameDataRegistry.uiSettings, settings)
    }, [settings])

    async function updateStates(): Promise<void> {
        const fetched = await retrieve<UiSettings>(GameDataRegistry.uiSettings, DEFAULT)
        if (fetched?.api?.version !== DEFAULT.api.version) {
            ToastAndroid.show('Overwriting default settings because of changes', ToastAndroid.SHORT)
            await store(GameDataRegistry.uiSettings, DEFAULT)
            setSettings(DEFAULT)
            return
        } 
        setSettings(fetched)
    }

    const edit = React.useCallback(async(callback: (settings: UiSettings) => UiSettings) => {
        const current = await retrieve<UiSettings>(GameDataRegistry.uiSettings, DEFAULT)
        const toSet = callback(current)
        await store(GameDataRegistry.uiSettings, toSet)
        await updateStates()
    }, [settings])

    const settingsData = React.useCallback(() => ({
        ...settings,
        global: {
            ...settings.global,
            textStyle: settings.global.colorScheme === 'dark' ? getDarkTextStyle() : getLightTextStyle()
        },
        edit,
    }), [settings, edit])

    return (
        <UiSettingsContext.Provider value={settingsData()}>
            {props.children}
        </UiSettingsContext.Provider>
    )
}

const getDarkTextStyle = (): TextStyle => ({
    color: 'white'
})
const getLightTextStyle = (): TextStyle => ({
    color: 'black'
})

