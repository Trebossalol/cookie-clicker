export type WorldDataID = '46afa2df-38e0-4c10-a483-9a5de43554de' | 'f971f3c2-5a44-4cca-8b8d-513b2a6302a9'

export interface CookieData {
    current: number
    total: number
}

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

export type ItemDynamicProps = { cache: CachedItem | undefined, cachedItems: CachedItemList, cookieData: CookieData, worldData: WorldData }

export type DynamicItemName = (level: number) => string

export interface Item {
    name: string | DynamicItemName
    description: string
    id: string
    maxLvl?: number
    co_efficient?: {
        value: number
    }
    unlocked: (data: ItemDynamicProps) => boolean
    calcNextPrice: (data: ItemDynamicProps) => number
    onTick: (data: ItemDynamicProps) => number
    multiplicator?: (data: ItemDynamicProps) => number
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