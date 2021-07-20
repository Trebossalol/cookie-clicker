import * as React from 'react';
import { GameDataRegistry, retrieve, store } from '../game/game';
import { WorldDataID, WorldData, LevelDetails } from '../game/types';
import WorldRegister from '../game/worlds/index'

const DEFAULT: ExtendedLevelDetails = {
    level: 0,
    xp: 0,
    xpRelation: 0,
    xpRequired: 0,
    addXp: () => Promise.resolve()
}

export interface ExtendedLevelDetails extends LevelDetails {
    xpRequired: number
    xpRelation: number
    addXp: (amount?: number) => Promise<void>
}

const LevelContext = React.createContext<ExtendedLevelDetails>(DEFAULT)

export function useLevelDetails() {
    return React.useContext(LevelContext)
}

export type UpdateLevelDetailsCb = (levelDetails: LevelDetails) => LevelDetails

export function LevelProvider(props: any) {

    const [xp, setXp] = React.useState<number>(0)
    const [level, setLevel] = React.useState<number>(0)

    const xpRequired = React.useMemo(() => level + 2 ^ 2, [level])
    const xpRelation = React.useMemo(() => xp / xpRequired, [level, xpRequired])
    const details = React.useMemo<ExtendedLevelDetails>(() => ({ level, xp, xpRequired, xpRelation, addXp }), [xp, level, xpRequired, xpRelation])

    React.useEffect(() => {
        updateStates()
    }, [])

    React.useEffect(() => {
        if (xp >= xpRequired) levelUp()
    }, [xp])

    async function levelUp(amount: number = 1) {
        setLevel(e => e + amount)
        setXp(0)
    }

    async function addXp(amount: number = 1): Promise<void> {
        setXp(xp + amount)
        cacheLevelData()
    }

    async function cacheLevelData() {
        await store<LevelDetails>(GameDataRegistry.levelDetails, details)
    }

    async function updateStates(): Promise<void> {
        const fetched = await retrieve<LevelDetails>(GameDataRegistry.levelDetails, DEFAULT)
        setXp(fetched.xp)
        setLevel(fetched.level)
    }

    return (
        <LevelContext.Provider value={details}>
            {props.children}
        </LevelContext.Provider>
    )
}