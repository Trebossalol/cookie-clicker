import * as React from 'react';
import { GameDataRegistry } from '../game/registry';
import { retrieve, store } from '../util/storage';

interface Settings {
    clicker: {
        show_decimal: boolean
    }
}

const DEFAULT: ExtendedSettings = {
    clicker: {
        show_decimal: true
    },
    edit: () => Promise.resolve()
}

interface ExtendedSettings extends Settings {
    edit: (callback: (settings: Settings) => Settings) => void
}

const UiSettingsContext = React.createContext<ExtendedSettings>(DEFAULT)

export function useUISettings(): ExtendedSettings {
    return React.useContext(UiSettingsContext)
}

export function UiSettingsProvider(props: any) {

    const [settings, setSettings] = React.useState<Settings>(DEFAULT)

    React.useEffect(() => {
        updateStates()
    }, [])

    const cacheUiSettingsData = React.useCallback(async() => {
        await store<Settings>(GameDataRegistry.levelDetails, settings)
    }, [settings])

    async function updateStates(): Promise<void> {
        const fetched = await retrieve<Settings>(GameDataRegistry.uiSettings, DEFAULT)
        setSettings(fetched)
    }

    const edit = React.useCallback(async(callback: (settings: Settings) => Settings) => {
        const current = await retrieve<Settings>(GameDataRegistry.uiSettings, DEFAULT)
        const toSet = callback(current)
        await store(GameDataRegistry.uiSettings, toSet)
        await cacheUiSettingsData()
        await updateStates()
    }, [settings])

    const settingsData = React.useCallback(() => ({
        ...settings,
        edit
    }), [settings, edit])

    return (
        <UiSettingsContext.Provider value={settingsData()}>
            {props.children}
        </UiSettingsContext.Provider>
    )
}