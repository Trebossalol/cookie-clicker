import { Item } from '../types'
import CookieStore from './Cookie_Store'
import CookieRoboter from './Cookie_Roboter'
import getRandNumber from '../../util/getRandNumber'

const item: Item = {
    name: 'Cookie Factory',
    description: 'This factory produces cookies for you. Will produce twice as many cookies if you own a cookie roboter. This factory also generates big amounts of experience on upgrade!',
    id: 'dbbcd857-591d-4659-a95a-2da9ecc01bf0',
    requirements: [
        'Your cookie store level must be atleast 3 least 3 level bigger than  your cookie factory level',
        'You must have a total amount of cookies which exceeds 100k',
        'You must be level 15'
    ],
    unlocked: ({ cookieData, cachedItems, cache, levelDetails }) => {
        const cookieStore = cachedItems.find(e => e.id === CookieStore.id)
        return cookieData.total >= 100000 && (cookieStore?.level || 0) >= (3 + (cache?.level|| 1)) && levelDetails.level >= 15
    },
    calcNextPrice: ({ cache }) =>  Math.pow((cache?.level || 1) * 150, 1.43),
    onTick: ({ cache }) => (cache?.level || 1) / 2 * 3,
    multiplicator: ({ cachedItems }) => {
        const roboter = cachedItems.find(e => e.id === CookieRoboter.id)
        if (roboter) return 2
        return 1
    },
    onPurchase: ({ levelDetails }) => {
        levelDetails.addXp(Math.round(getRandNumber(3, 9)))
    }   
}

export default item