import { Item } from '../StoreItems'
import CookieStore from './Cookie_Store'

const item: Item = {
    name: 'Cookie Factory',
    description: 'test',
    id: 'dbbcd857-591d-4659-a95a-2da9ecc01bf0',
    unlocked: ({ cookieData, cachedItems }) => {
        const cookieStore = cachedItems.find(e => e.id === CookieStore.id)
        return cookieData.total > 520 && (cookieStore?.level || 0) > 2
    },
    calcNextPrice: ({ cache }) => (cache?.level || 1) * 60
}

export default item