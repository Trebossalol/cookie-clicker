import CookieStore from './items/Cookie_Store'
import CookieFactory from './items/Cookie_Factory'
import Finger from './items/Finger'

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
    unlocked: ({ cache, cachedItems, cookieData }: ItemDynamicProps) => boolean
    calcNextPrice: ({ cache, cachedItems, cookieData }: ItemDynamicProps) => number
}
export type ItemList = Item[]

export const ItemList: ItemList = [
    Finger,
    CookieStore,
    CookieFactory,
]

export interface CachedItem {
    level: number
    id: string
}
export type CachedItemList = CachedItem[]