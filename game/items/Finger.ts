import { Item } from '../StoreItems'

const item: Item = {
    name: 'Finger',
    description: 'For every manual click you get +1',
    id: 'cd9342b1-1239-4514-aca7-a7d0100c4e58',
    unlocked: () => true,
    calcNextPrice: ({ cache }) => (cache?.level || 1) * 80 ^ 2,
    onTick: () => 0
}

export default item