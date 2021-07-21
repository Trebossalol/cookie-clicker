import { Item } from '../types'

const item: Item = {
    name: 'soon',
    description: 'soon',
    id: 'soon',
    maxLvl: 200,
    unlocked: () => true,
    calcNextPrice: ({ cache }) => (cache?.level || 1) * 2 * ((cache?.level || 1) < 50 ? 80 : 2200) 
}

export default item