import { Item } from '../StoreItems'
import CookieStore from './Cookie_Store'

const item: Item = {
    name: 'Cookie Factory',
    description: 'This will produce mass amounts of cookies (Amount rises quadratic)',
    id: 'dbbcd857-591d-4659-a95a-2da9ecc01bf0',
    unlocked: ({ cookieData, cachedItems, cache }) => {
        const cookieStore = cachedItems.find(e => e.id === CookieStore.id)
        return cookieData.total > 15000 && (cookieStore?.level || 0) >= (3 + (cache?.level|| 1))
    },
    calcNextPrice: ({ cache, cachedItems }) => {
        const cookieStore = cachedItems.find(e => e.id === CookieStore.id)
        return ((cache?.level || 1) + (cookieStore?.level || 2)) * 1000
    },
    onTick: ({ cache }) => (cache?.level || 1) * 80 ^2
}

export default item