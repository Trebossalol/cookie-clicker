import { Item } from '../types'
import CookieStore from './Cookie_Store'
import CookieRoboter from './Cookie_Roboter'

const item: Item = {
    name: 'Cookie Factory',
    description: 'This factory produces cookies for you. Will produce twice as many cookies if you own a cookie roboter',
    id: 'dbbcd857-591d-4659-a95a-2da9ecc01bf0',
    unlocked: ({ cookieData, cachedItems, cache }) => {
        const cookieStore = cachedItems.find(e => e.id === CookieStore.id)
        return cookieData.total > 15000 && (cookieStore?.level || 0) >= (3 + (cache?.level|| 1))
    },
    calcNextPrice: ({ cache, cachedItems }) => {
        const cookieStore = cachedItems.find(e => e.id === CookieStore.id)
        return ((cache?.level || 1) + (cookieStore?.level || 2)) * ((cache?.level || 1) < 5 ? 1000 : 15000)
    },
    onTick: ({ cache }) =>Math.pow((cache?.level || 1) * 110, 1.3),
    multiplicator: ({ cachedItems }) => {
        const roboter = cachedItems.find(e => e.id === CookieRoboter.id)
        if (roboter) return 2
        return 1
    }
}

export default item