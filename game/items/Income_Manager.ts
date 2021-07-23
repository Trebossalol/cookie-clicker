import { Item } from '../types'

const item: Item = {
    name: 'Income Manager',
    description: 'For each level you get + 0.25% income and xp.',
    id: '1568e7e2-7857-4c30-b301-b71e60577d57',
    maxLvl: 400,
    requirements: [
        'Your level raised by 1.8 must be bigger than your income manager level'
    ],
    co_efficient: {
        value: 0.0025
    },
    unlocked: ({ levelDetails, cache }) => Math.pow(levelDetails.level, 1.8) >= (cache?.level || 1),
    calcNextPrice: ({ cache }) => Math.pow((cache?.level || 1) * 25, 1.1)
}

export default item