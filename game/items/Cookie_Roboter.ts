import { Item } from '../types'
import CookieTeleporter from './Cookie_Teleporter'

let indicator = 1

const item: Item = {
    name: 'Cookie Roboter',
    description: 'This roboter will generate cookies for you, the longer you stay, the more it will generate',
    id: '0a9ed219-e19c-433f-9344-7dd385531ad4',
    requirements: [
        'Your cookie teleporter level must be 2 times greater than your cookie roboter level',
        'You must have had a total amount of cookies with exceeds 10 Mio.',
        'You msut be level 40'
    ],
    unlocked: ({ cookieData, cachedItems, cache, levelDetails }) => {
        const teleporter = cachedItems.find(e => e.id === CookieTeleporter.id)
        return cookieData.total > 10000000 && (teleporter?.level || 0) >= ((cache?.level || 1) * 2) && levelDetails.level >= 40
    },
    calcNextPrice: ({ cache }) => {
        const lvl = (cache?.level || 1) + 2
        const raised = Math.pow(lvl, 2)
        return lvl * raised * 50
    },
    onTick: ({ cache }) => {
        let amount = (cache?.level || 1) * 1200
        amount += (indicator / 3) * (amount / 4) * 0.1792
        indicator++
        return amount
    }
}

export default item