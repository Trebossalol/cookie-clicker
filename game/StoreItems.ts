import CookieStore from './items/Cookie_Store'
import CookieFactory from './items/Cookie_Factory'
import Finger from './items/Finger'
import CookieMultiplier from './items/Cookie_Multiplier'

export interface CookieData {
  current: number
  total: number
}

type ItemDynamicProps = { cache: CachedItem | undefined, cachedItems: CachedItemList, cookieData: CookieData }
type DynamicItemName = (level: number) => string
export interface Item {
    name: string | DynamicItemName
    description: string
    id: string
    unlocked: (data: ItemDynamicProps) => boolean
    calcNextPrice: (data: ItemDynamicProps) => number
    onTick: (data: ItemDynamicProps) => number
}
export type ItemList = Item[]

export const ItemList: ItemList = [
    Finger,
    CookieStore,
    CookieFactory,
    CookieMultiplier
]

export interface CachedItem {
    level: number
    id: string
}
export type CachedItemList = CachedItem[]