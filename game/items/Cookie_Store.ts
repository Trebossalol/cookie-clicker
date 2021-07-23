import { Item } from '../types'
import Finger from './Finger'

const item: Item = {
    name: 'Cookie Store',
    description: 'This will generate decent amounts of cookies per tick',
    id: '2b4856e3-5366-4bd7-9595-6bfae0fa6375',
    requirements: [
        'You must be level 10',
        'You must have a total amount of cookies above 1k',
        'Your Finger level must be 2 times greater then your cookie store level'
    ],
    unlocked: ({ cookieData, cachedItems, cache, levelDetails }) => {
        const finger = cachedItems.find(e => e.id === Finger.id)
        return cookieData.total > 1000 && (finger?.level || 0) > (cache?.level || 1) * 2 && levelDetails.level >= 10
    },
    calcNextPrice: ({ cache }) => Math.pow((cache?.level || 1) * 63, 1.3),
    onTick: ({ cache }) => (cache?.level || 1) / 2 * 2
}

export default item