import { Item } from '../types'

const item: Item = {
    name: 'Income Manager',
    description: 'For each level you get + 0.25% income',
    id: '1568e7e2-7857-4c30-b301-b71e60577d57',
    maxLvl: 400,
    co_efficient: {
        value: 0.0025
    },
    unlocked: () => true,
    calcNextPrice: ({ cache }) => Math.pow((cache?.level || 1) * 25, 2),
    onTick: () => 0
}

export default item