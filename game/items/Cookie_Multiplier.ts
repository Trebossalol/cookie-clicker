import { Item } from '../types'
import CookieFactory from './Cookie_Factory'
import getRandNumber from '../../util/getRandNumber'

const item: Item = {
    name: 'Cookie Multiplier',
    description: 'This multiplicator multiplies your cookies that you would usually earn by this, you can earn up to 3x the normal income per tick. This offer is 30% cheaper if your cookie factory is leveled to level 25',
    id: 'ffb8c17d-0521-4068-856c-16e163e745d7',
    maxLvl: 100,
    unlocked: ({ cookieData, cachedItems }) => {
        const cookieFactory = cachedItems.find(e => e.id === CookieFactory.id)
        return cookieData.total > 400000 && (cookieFactory?.level || 0) >= 3
    },
    calcNextPrice: ({ cache, cachedItems }) => {
        const cookieFactory = cachedItems.find(e => e.id === CookieFactory.id)
        let price = ((cache?.level || 1) * 10000)
        if ((cookieFactory?.level || 1) >= 25) price *= .7
        return price
    },
    onTick: ({ cache }) => Math.pow((cache?.level || 1) * 300, 1.35),
    multiplicator: () => {
        const randNum = getRandNumber(1, 100)
        if (randNum > 80) return getRandNumber(2, 3)
        if (randNum > 50) return getRandNumber(1, 2)
        else return 1
    }
}

export default item