import * as React from 'react';
import { CachedItemList, CpsData, ItemDynamicProps } from './types'
import getStorable from '../util/getStorable';
import { useSetUpdatePending, useUpdatePending } from '../context/UpdateContext';
import { useWorldData } from '../context/WorldContext';
import IncomeManager from './items/Income_Manager'
import { retrieve, store } from '../util/storage';
import { GameDataRegistry } from './registry';
import { useLevelDetails } from '../context/LevelContext';
import { ToastAndroid } from 'react-native';
import useGameEvent, { UseGameEventElement, UseGameEventRv } from '../hooks/useGameEvent';


const GameContext = React.createContext<GameData>({
    addCookies: () => {},
    removeCookies: () => true,
    cacheData: () => Promise.resolve(),
    cachedItems: [], 
    cookies: 0,
    events: [],
    sync: () => Promise.resolve(),
    totalCookies: 0
})

export function useGameData() {
    return React.useContext(GameContext)
}

export interface GameData {
    cookies: number
    totalCookies: number
    cachedItems: CachedItemList
    addCookies: (amount: number, multiplicators?: number[]) => void
    removeCookies: (amount: number) => boolean
    cacheData: () => Promise<void>
    events: UseGameEventRv[]
    sync: () => Promise<void>
}

interface GameProviderProps {
    children: any
}

const callbackEventName = 'ADD_COOKIES_ON_LEVEL_UP'

const eventsToLoad = [
        useGameEvent({ 
            eventTitle: '+ 50% Cookies & XP', 
            price: 15000, 
            onSuccess: () => [1.5],
            eventDuration: 23000,
            percentageChances: 0.25
        }),
        useGameEvent({ 
            eventTitle: '+ 150% Cookies & XP', 
            price: 20000, 
            onSuccess: () => [2.5],
            eventDuration: 15000,
            percentageChances: 0.1
        }),
        useGameEvent({ 
            eventTitle: '+ 300% Cookies & XP', 
            price: 25000, 
            onSuccess: () => [3],
            eventDuration: 12000,
            percentageChances: 0.05
        })
]

export function GameProvider(props: GameProviderProps) {

    const setUpdatePending = useSetUpdatePending()
    const updatePending = useUpdatePending()
    const worldData = useWorldData()
    const levelDetails = useLevelDetails()


    const [events, setEvents] = React.useState<UseGameEventRv[]>([])
    const [cachedItems, setCachedItems] = React.useState<CachedItemList>([])

    const [cpsData, setCpsData] = React.useState<CpsData>({ cps: 0 })
    const [cookies, setCookies] = React.useState(0)
    const [totalCookies, setTotalCookies] = React.useState<number>(0)

    React.useEffect(() => {
        setEvents(eventsToLoad)
        loadGameData()
        levelDetails.bindCallback(callbackEventName, 'LEVEL_UP', ({ level }) => {
            const amount = Math.round(Math.pow(level + 1, 2) * (level >= 10 ? 65 : 7))
            addCookies(amount)
            ToastAndroid.show(`Du hast ${amount} Cookies erhalten!`, ToastAndroid.SHORT)
        })
        return () => {
            levelDetails.unbindCallback(callbackEventName)
        }
    }, [])

    React.useEffect(() => {
        if (!cachedItems || cachedItems.length === 0) return
   
        console.log('› Interval attached')
        let interval = setInterval(onTick, 1000)

        return () => {
            console.log('› Interval detached')
            clearInterval(interval)
        }
    }, [cachedItems])

    React.useEffect(() => {
        if (updatePending === true ) { 
            console.info('Clicker update is pending > updating')
            loadGameData()
            setUpdatePending(false)
        }
    }, [updatePending])

    React.useEffect(() => {
        cacheData()
    }, [cookies])

    /**
     * @description This function adds the cookies to the state and updates the totalCookies property
     * @dependencies *WorldData.multiplicator*, event multiplicators, income_manager lvl
     */
    const addCookies = React.useCallback((amount: number, multiplicators: number[] = []) => {
        // World data multiplicator
        multiplicators.push(worldData.multiplicator)

        // Event multiplicators
        events.forEach(Ev => Ev.multiplicators && multiplicators.push(...Ev.multiplicators))

        // Income manager multiplicator
        const incomeManagerLevel = cachedItems.find(e => e.id === IncomeManager.id)?.level
        if (incomeManagerLevel != undefined) multiplicators.push(1 + (incomeManagerLevel * (IncomeManager.co_efficient?.value || 0.0025)))

        // Calculate the final amount
        const earnedCookies = multiplicators
            .reduce((pv, cv) => pv * cv, amount)
            
        const earnedXp = multiplicators
            .reduce((pv, cv) => pv * cv, 1)

        addToTotalCookie(earnedCookies)
        setCookies(e => e + earnedCookies)

        levelDetails.addXp(earnedXp)
    }, [worldData, cachedItems, events])

    /**
     * @description This function removes the cookies from the counter, returns false if not enough cookies
     */
    const removeCookies = React.useCallback((amount: number): boolean => {
        if (cookies - amount < 0) return false
        setCookies(e => e - amount)
        return true
    }, [worldData, cachedItems, cookies])

    /**
     * @description This function renders on each game-render-iteration
     */
    const onTick = React.useCallback(() => {
        cachedItems.forEach((cache) => {
            const item = worldData.items.find(e => e.id === cache.id)
            if (!item) return console.log(`› Skipping ${cache.id}`)

            const props: ItemDynamicProps = { 
                cache, 
                cachedItems: cachedItems, 
                cookieData: { 
                    current: cookies, 
                    total: totalCookies 
                },
                worldData,
                levelDetails
            }
            const onTick = item?.onTick
            const earned = onTick == null ? 0 : onTick(props)
            
            const getMultiplicator = item.multiplicator
            const multiplicator = getMultiplicator == null ? []: [getMultiplicator(props)]

            addCookies(earned, multiplicator)
        })
    }, [cachedItems, worldData.items])

    /**
     * @description Adds the amount to the totalCookies store
     */
    const addToTotalCookie = async (amount: number) => {
        let currentTotal = await retrieve<number>(GameDataRegistry.totalCookies(worldData.id), 0)
        currentTotal += amount
        await store(GameDataRegistry.totalCookies(worldData.id), currentTotal)
    }

    /**
     * @description This function loads the cookies, cachedItems and the totalCookies into the states
     */
    const loadGameData = async () => {
        const { cookies, cachedItems, totalCookies } = await getStorable(worldData.id)
        setCookies(cookies)
        setCachedItems(cachedItems)
        setTotalCookies(totalCookies)
    }

    /**
     * @description This function caches the cookie state 
     */
    const cacheData = async () => {
        await store(GameDataRegistry.cookies(worldData.id), cookies)
    }

    const gameData = React.useCallback(() => {
        return {
            cookies,
            totalCookies,
            cachedItems,
            addCookies,
            removeCookies,
            cacheData,
            sync: loadGameData,
            events
        }
    }, [cookies, totalCookies, cachedItems, addCookies, removeCookies, cacheData, loadGameData, events])

    return (
        <GameContext.Provider value={gameData()}>
            {props.children}
        </GameContext.Provider>
    )
}