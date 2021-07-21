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
    calcNextPrice: ({ cache }) =>  Math.pow((cache?.level || 1) * 200, 1.4),
    onTick: ({ cache }) => (cache?.level || 1) * 3,
    multiplicator: ({ cachedItems }) => {
        const roboter = cachedItems.find(e => e.id === CookieRoboter.id)
        if (roboter) return 2
        return 1
    }
}

export default item