import { Item } from '../types'
import CookieTeleporter from './Cookie_Teleporter'

let indicator = 1

const item: Item = {
    name: 'Cookie Roboter',
    description: 'This roboter will generate cookies for you, the longer you stay, the more it will generate',
    id: '0a9ed219-e19c-433f-9344-7dd385531ad4',
    unlocked: ({ cookieData, cachedItems, cache }) => {
        const teleporter = cachedItems.find(e => e.id === CookieTeleporter.id)
        return cookieData.total > 10000000 && (teleporter?.level || 0) >= ((cache?.level || 1) * 2)
    },
    calcNextPrice: ({ cache }) => {
        const lvl = (cache?.level || 1) + 2
        const raised = Math.pow(lvl, 3)
        return lvl * raised * 13000
    },
    onTick: ({ cache }) => {
        let amount = (cache?.level || 1) * 1200
        amount *= indicator / 2 
        indicator++
        return amount
    }
}

export default item