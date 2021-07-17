import * as React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Item, ItemList, CachedItem, CachedItemList } from './StoreItems'
import getStorable from '../util/getStorable';
import { Alert, ToastAndroid } from 'react-native';

export const store = async <T>(key: string, value: T | any): Promise<T> => {
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

export const retrieve = async <T>(key: string, ifNullValue: any = null): Promise<T> => {
    return new Promise(async (resolve, reject) => {
        try {
            const value = await AsyncStorage.getItem(key)
            if (!value) {
                store(key, ifNullValue)
                return
            }
            const parsed = JSON.parse(value);
            resolve(parsed)
        } catch (error) {
            reject(error)
        }
    })
};

export const GameDataRegistry = {
    cookies: 'GAME_COOKIES_AMOUNT',
    cachedItems: 'GAME_CACHED_ITEMS',
    totalCookies: 'GAME_COOKIES_TOTAL',

}

export interface useGameDataOptions {
    cacheInterval?: number
}

export const defaultUseGameDataOptions: useGameDataOptions = {
    cacheInterval: 2300
}

export interface useGameDataHookReturnValue {
    cookies: number
    totalCookies: number
    cachedItems: CachedItemList
    setCookies: React.Dispatch<React.SetStateAction<number>>
    cacheData: () => Promise<void>
    sync: () => Promise<void>
    addToTotalCookie: (amount: number) => Promise<void>
    cleanAccount: () => Promise<void>
}

export function useGameData(optionsToPass?: useGameDataOptions): useGameDataHookReturnValue {

    const [options, setOptions] = React.useState<useGameDataOptions>(defaultUseGameDataOptions)
    const [cachedItems, setCachedItems] = React.useState<CachedItemList>([])

    const [cookies, setCookies] = React.useState(0)
    const [totalCookies, setTotalCookies] = React.useState<number>(0)

    const cacheInterval = React.useRef<any>()
  
    React.useEffect(() => {
        const options = { ...defaultUseGameDataOptions, ...optionsToPass }
        setOptions(options)
        
        //cacheInterval.current = setInterval(cacheData, options.cacheInterval)

        loadGameData()

        return () => {
            //clearInterval(cacheInterval.current)
        }

    }, [])

    React.useEffect(() => {
        cacheData()
    }, [cookies])

    const addToTotalCookie = async (amount: number) => {
        let currentTotal = await retrieve<number>(GameDataRegistry.totalCookies, 0)
        currentTotal += amount
        await store(GameDataRegistry.totalCookies, currentTotal)
        loadGameData()
    }

    const loadGameData = async () => {
        const { cookies, cachedItems, totalCookies } = await getStorable()
        setCookies(cookies)
        setCachedItems(cachedItems)
        setTotalCookies(totalCookies)
    }

    const cacheData = async () => {
        await store(GameDataRegistry.cookies, cookies)
    }

    return {
        cacheData,
        cookies,
        totalCookies,
        setCookies,
        cachedItems,
        sync: loadGameData,
        addToTotalCookie,
        cleanAccount
    };
}

export interface useGameItemDataReturnValue {
    itemData?: Item
    userData?: CachedItem
}

export function useGameItemData(id: string): useGameItemDataReturnValue {

    const [itemData, setItemData] = React.useState<Item>()
    const [userData, setUserData] = React.useState<CachedItem>()

    React.useEffect(() => {
        GetItemData()
    }, [id])

    const GetItemData = async(): Promise<void> => {
        const item = ItemList.find(e => e.id === id)
        setItemData(item)
    }

    return {
        itemData,
        userData
    }

}

async function cleanAccount() {
    Alert.alert('Bist du sicher dass du alle Daten löschen willst ?','', [
        { text: 'Abbrechen', style: 'cancel' },
        { text: 'Ja', onPress: async () => {
            const entries = Object.entries(GameDataRegistry)

            for (let i = 0; i < entries.length; i++) {
                const [_, key] = entries[i]
                await AsyncStorage.removeItem(key)        
            }

            ToastAndroid.show('Erfolg', ToastAndroid.SHORT)

        }}
    ])
}