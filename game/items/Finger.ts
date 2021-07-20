import { Item } from '../types'

const item: Item = {
    name: 'Finger',
    description: 'For every manual click you get +1',
    id: 'cd9342b1-1239-4514-aca7-a7d0100c4e58',
    maxLvl: 200,
    unlocked: () => true,
    calcNextPrice: ({ cache }) => (cache?.level || 1) * 2 * ((cache?.level || 1) < 50 ? 80 : 2200) ^ 2,
    onTick: () => 0
}

export default item