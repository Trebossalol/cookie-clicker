import { Item } from '../StoreItems'
import CookieFactory from './Cookie_Factory'

const item: Item = {
    name: 'Cookie Multiplier',
    description: 'This expensive offer produces huge amounts of cookies. It is defentially worth it!!',
    id: 'ffb8c17d-0521-4068-856c-16e163e745d7',
    unlocked: ({ cookieData, cachedItems, cache }) => {
        const cookieFactory = cachedItems.find(e => e.id === CookieFactory.id)
        return cookieData.total > 110000 && (cookieFactory?.level || 0) >= (3 + (cache?.level || 3))
    },
    calcNextPrice: ({ cache, cookieData }) => ((cache?.level || 1) * 10000) + (cookieData.total * 0.05),
    onTick: () => 1
}

export default item