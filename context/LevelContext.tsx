import * as React from 'react';
import { ToastAndroid } from 'react-native';
import { useGameData } from '../game/game';
import { GameDataRegistry } from '../game/registry';
import { WorldDataID, WorldData, LevelDetails } from '../game/types';
import WorldRegister from '../game/worlds/index'
import { retrieve, store } from '../util/storage';

const DEFAULT: ExtendedLevelDetails = {
    level: 0,
    xp: 0,
    xpRelation: 0,
    xpRequired: 0,
    addXp: () => Promise.resolve(),
    bindCallback: () => {},
    unbindCallback: () => {}
}

export type LevelContextEventName = 'LEVEL_UP' 
export type BindCallbackCb = ({ level }: { level: number }) => void
export type LevelContextBindCallbackFn = (uniqeId: string, event: LevelContextEventName, callback: BindCallbackCb) => void
export interface CallbackState {
    id: string
    event: LevelContextEventName
    callback: BindCallbackCb
}
export type CallbacksStateList = CallbackState[]

export interface ExtendedLevelDetails extends LevelDetails {
    xpRequired: number
    xpRelation: number
    addXp: (amount?: number) => Promise<void>
    bindCallback: LevelContextBindCallbackFn
    unbindCallback: (uniqeId: string) => void
}

const LevelContext = React.createContext<ExtendedLevelDetails>(DEFAULT)

export function useLevelDetails() {
    return React.useContext(LevelContext)
}

export type UpdateLevelDetailsCb = (levelDetails: LevelDetails) => LevelDetails

export function LevelProvider(props: any) {

    const [xp, setXp] = React.useState<number>(1)
    const [level, setLevel] = React.useState<number>(1)
    const [callbacks, setCallbacks] = React.useState<CallbacksStateList>([])

    const xpRequired = React.useMemo(() => Math.pow(level + 2, 3), [level])
    const xpRelation = React.useMemo(() => xp / xpRequired, [xp, xpRequired])
    const details = React.useMemo<ExtendedLevelDetails>(() => ({ level, xp, xpRequired, xpRelation, addXp, bindCallback, unbindCallback }), [xp, level, xpRequired, xpRelation])
    const levelDetails = React.useMemo<LevelDetails>(() => ({ xp, level }), [xp, level])

    React.useEffect(() => {
        updateStates()
    }, [])

    React.useEffect(() => {
        if (xp >= xpRequired) levelUp()
        cacheLevelData()
    }, [xp, level])

    const getCallbacks = React.useCallback(() => callbacks, [callbacks])

    const levelUp = async (amount: number = 1) => {
        const newLevel = level + amount
        setLevel(newLevel)
        setXp(1)
        ToastAndroid.show('Du bist im Level aufgestiegen!', ToastAndroid.SHORT)
        getCallbacks().filter(e => e.event === 'LEVEL_UP').forEach(e => e.callback({ level: newLevel }))
    }

    async function addXp(amount: number = 1): Promise<void> {
        setXp(e => e + amount)
    }

    async function cacheLevelData() {
        await store<LevelDetails>(GameDataRegistry.levelDetails, levelDetails)
    }

    async function updateStates(): Promise<void> {
        const fetched = await retrieve<LevelDetails>(GameDataRegistry.levelDetails, DEFAULT)
        setXp(fetched.xp)
        setLevel(fetched.level)
    }

    function bindCallback(uniqeId: string, event: LevelContextEventName, callback: BindCallbackCb) {
        setCallbacks(list => [...list, {
            callback, 
            event,
            id: uniqeId
        }])
    }

    function unbindCallback(uniqeId: string) {
        setCallbacks(list => list.filter(e => e.id !== uniqeId))
    }

    return (
        <LevelContext.Provider value={details}>
            {props.children}
        </LevelContext.Provider>
    )
}