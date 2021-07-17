import { Item } from '../StoreItems'
import Finger from './Finger'

const item: Item = {
    name: 'Cookie Store',
    description: 'Upgrade your multiplicator',
    id: '2b4856e3-5366-4bd7-9595-6bfae0fa6375',
    unlocked: ({ cookieData, cachedItems, cache }) => {
        const finger = cachedItems.find(e => e.id === Finger.id)
        return cookieData.total > 1000 && (finger?.level || 0) > (cache?.level || 1) * 2
    },
    calcNextPrice: ({ cache }) => (cache?.level || 1) * 500
}

export default item