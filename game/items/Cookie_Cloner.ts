import { Item } from '../types'

const item: Item = {
    name: 'Cookie Cloner',
    description: 'This device clones cookies',
    id: '3704b462-25ae-4d1f-bbbb-754f54b86897',
    unlocked: () => true,
    calcNextPrice: ({ cache }) =>  Math.pow((cache?.level || 1) * 5000, 2),
    onTick: ({ cache }) => (cache?.level || 1) * 450
}

export default item