import { ExtendedLevelDetails } from "../context/LevelContext"

export interface CookieData {
    current: number
    total: number
}

export type WorldDataID = '46afa2df-38e0-4c10-a483-9a5de43554de' | 'f971f3c2-5a44-4cca-8b8d-513b2a6302a9' | '5e0fceda-0750-44f8-94ea-a7e83d52fec4'

export interface WorldData {
    name: string
    id: WorldDataID
    items: ItemList
    multiplicator: number
}

export interface LevelDetails {
    level: number
    xp: number
}

export interface ItemDynamicProps { 
    cache: CachedItem | undefined, 
    cachedItems: CachedItemList, 
    cookieData: CookieData, 
    worldData: WorldData 
    levelDetails: ExtendedLevelDetails
}

export interface ItemDynamicPropsOnPurchase extends ItemDynamicProps {
    extended: {
        itemPrice: number
        type: 'buy' | 'upgrade'
    }
}

export type DynamicItemName = (level: number) => string

export interface Item {
    name: string | DynamicItemName
    description: string
    id: string
    maxLvl?: number
    requirements?: string[]
    co_efficient?: {
        value: number
    }
    unlocked: (data: ItemDynamicProps) => boolean
    calcNextPrice: (data: ItemDynamicProps) => number
    onTick?: (data: ItemDynamicProps) => number
    multiplicator?: (data: ItemDynamicProps) => number
    onPurchase?: (data: ItemDynamicPropsOnPurchase) => void
}

export type ItemList = Item[]

export interface CachedItem {
    level: number
    id: string
}

export type CachedItemList = CachedItem[]

export interface CpsData {
    cps: number
}