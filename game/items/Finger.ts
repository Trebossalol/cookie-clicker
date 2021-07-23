import { Item } from '../types'

const item: Item = {
    name: 'Finger',
    description: 'For every manual click you get +1',
    id: 'cd9342b1-1239-4514-aca7-a7d0100c4e58',
    maxLvl: 200,
    unlocked: () => true,
    calcNextPrice: ({ cache }) => Math.pow((cache?.level || 1) * 30, 1.2)
}

export default item