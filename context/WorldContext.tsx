import * as React from 'react';
import { GameDataRegistry } from '../game/registry';
import { WorldDataID, WorldData } from '../game/types';
import WorldRegister from '../game/worlds/index'
import { retrieve, store } from '../util/storage';

const DEFAULT_WORLD: WorldDataID = '46afa2df-38e0-4c10-a483-9a5de43554de'
const DEFAULT_TERM: ExtendedWorldData = { 
    id: DEFAULT_WORLD,
    items: [], 
    setWid: () => Promise.resolve(), 
    name: '', 
    multiplicator: 1 
}

export interface ExtendedWorldData extends WorldData {
    setWid: (wid: WorldDataID) => Promise<void>
}

const WorldDataContext = React.createContext<ExtendedWorldData>(DEFAULT_TERM)

export function useWorldData() {
    return React.useContext(WorldDataContext)
}

export function WorldProvider(props: any) {

    const [worldData, setWorldData] = React.useState<WorldData>(DEFAULT_TERM)

    React.useEffect(() => {
        updateStates()
    }, [])

    async function updateStates() {
        const fetched = await retrieve<WorldDataID>(GameDataRegistry.reachedWorld, DEFAULT_WORLD)
        const worldData = WorldRegister[fetched]
        setWorldData(worldData)
    }

    async function setWid(wid: WorldDataID) {
        await store(GameDataRegistry.reachedWorld, wid)
        updateStates()
    }

    return (
        <WorldDataContext.Provider value={{ ...worldData, setWid }}>
            {props.children}
        </WorldDataContext.Provider>
    )
}