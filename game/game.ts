import * as React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { CachedItemList, CpsData, ItemDynamicProps, WorldDataID } from './types'
import getStorable from '../util/getStorable';
import { Alert, ToastAndroid } from 'react-native';
import { useSetUpdatePending, useUpdatePending } from '../context/UpdateContext';
import { useWorldData } from '../context/WorldContext';
import IncomeManager from './items/Income_Manager'

export const store = async <T>(key: string, value: T): Promise<T> => {
    return new Promise(async (resolve, reject) => {
        try {
            await AsyncStorage.setItem(key, JSON.stringify(value));
            const now = await retrieve<T>(key)
            resolve(now)
        } catch (error) {
            reject(error)
        }
    })
};

export const remove = async (key: string,): Promise<void> => {
    return new Promise(async (resolve, reject) => {
        try {
            await AsyncStorage.removeItem(key)
            resolve()
        } catch (error) {
            reject(error)
        }
    })
};

export const retrieve = async <T>(key: string, ifNullValue: any = null): Promise<T> => {
    return new Promise(async (resolve, reject) => {
        try {
            const value = await AsyncStorage.getItem(key)
            if (!value) {
                store(key, ifNullValue)
                return ifNullValue
            }
            const parsed = JSON.parse(value);
            resolve(parsed)
        } catch (error) {
            reject(error)
        }
    })
};

export const GameDataRegistry = {
    cookies: (wid: WorldDataID) => `${wid}_GAME_COOKIES_AMOUNT`,
    cachedItems: (wid: WorldDataID) =>`${wid}_GAME_CACHED_ITEMS`,
    totalCookies: (wid: WorldDataID) => `${wid}_GAME_COOKIES_TOTAL`,
    globalMultiplicator: (wid: WorldDataID) => `${wid}_GAME_COOKIE_MULTIPLICATOR`,
    reachedWorld: `GAME_REACHED_WORLD`,
    levelDetails: `GAME_CACHED_LEVEL-DT`
}

export interface useGameDataHookReturnValue {
    cookies: number
    totalCookies: number
    cachedItems: CachedItemList
    addCookies: (amount: number, multiplicators?: number[]) => void
    cacheData: () => Promise<void>
    sync: () => Promise<void>
}

export function useGameData(): useGameDataHookReturnValue {

    const setUpdatePending = useSetUpdatePending()
    const updatePending = useUpdatePending()
    const worldData = useWorldData()

    const [cachedItems, setCachedItems] = React.useState<CachedItemList>([])

    const [cpsData, setCpsData] = React.useState<CpsData>({ cps: 0 })
    const [cookies, setCookies] = React.useState(0)
    const [totalCookies, setTotalCookies] = React.useState<number>(0)

    React.useEffect(() => {
        loadGameData()
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
     * @dependencies *WorldData.multiplicator*
     */
    const addCookies = React.useCallback((amount: number, multiplicators: number[] = []) => {
        // World data multiplicator
        multiplicators.push(worldData.multiplicator)

        // Income manager multiplicator
        const incomeManagerLevel = cachedItems.find(e => e.id === IncomeManager.id)?.level
        if (incomeManagerLevel != undefined) multiplicators.push(1 + ( incomeManagerLevel * (IncomeManager.co_efficient?.value || 0.0025)))

        // Calculate the final amount
        const earned = multiplicators
            .reduce((pv, cv) => pv * cv, amount)

        addToTotalCookie(earned)
        setCookies(e => e + earned)
    }, [worldData, cachedItems])

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
                worldData
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

    return {
        cacheData,
        cookies,
        totalCookies,
        cachedItems,
        sync: loadGameData,
        addCookies
    };
}