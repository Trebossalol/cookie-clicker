import { Item } from '../types'
import CookieFactory from './Cookie_Factory'
import getRandNumber from '../../util/getRandNumber'

const item: Item = {
    name: 'Cookie Multiplier',
    description: 'This expensive offer produces huge amounts of cookies. It is defentially worth it! Has the chance to generate up to 3 times the normal income.',
    id: 'ffb8c17d-0521-4068-856c-16e163e745d7',
    maxLvl: 100,
    unlocked: ({ cookieData, cachedItems }) => {
        const cookieFactory = cachedItems.find(e => e.id === CookieFactory.id)
        return cookieData.total > 400000 && (cookieFactory?.level || 0) >= 3
    },
    calcNextPrice: ({ cache }) => ((cache?.level || 1) * 10000),
    onTick: ({ cache, cachedItems }) => {
        const cookieFactory = cachedItems.find(e => e.id === CookieFactory.id)
        return ((cache?.level || 1) * 200) 
    },
    multiplicator: () => {
        const randNum = getRandNumber(1, 100)
        if (randNum > 80) return getRandNumber(2, 3)
        if (randNum > 50) return getRandNumber(1, 2)
        else return 1
    }
}

export default item