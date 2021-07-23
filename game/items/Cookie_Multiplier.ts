import { Item } from '../types'
import CookieFactory from './Cookie_Factory'
import getRandNumber from '../../util/getRandNumber'

const item: Item = {
    name: 'Cookie Multiplier',
    description: 'This multiplicator multiplies your cookies that you would usually earn by this, you can earn up to 3x the normal income per tick. This offer is 30% cheaper if your cookie factory is leveled to level 25',
    id: 'ffb8c17d-0521-4068-856c-16e163e745d7',
    maxLvl: 100,
    requirements: [
        'You must have a total amount of cookies which was atleast 500k',
        'Your cookie factory level must be atleast 3',
        'You must be level 20'
    ],
    unlocked: ({ cookieData, cachedItems, levelDetails }) => {
        const cookieFactory = cachedItems.find(e => e.id === CookieFactory.id)
        return cookieData.total > 500000 && (cookieFactory?.level || 0) >= 3 && levelDetails.level >= 20
    },
    calcNextPrice: ({ cache, cachedItems }) => {
        const cookieFactory = cachedItems.find(e => e.id === CookieFactory.id)
        let price = Math.pow((cache?.level || 1) * 160, 1.6)
        if ((cookieFactory?.level || 1) >= 25) price *= .7
        return price
    },
    onTick: ({ cache }) => (cache?.level || 1) * 10,
    multiplicator: () => {
        const randNum = getRandNumber(1, 100)
        if (randNum > 80) return getRandNumber(2, 3)
        if (randNum > 50) return getRandNumber(1, 2)
        else return 1
    }
}

export default item