import { Item } from '../types'
import getRandNumber from '../../util/getRandNumber'

const item: Item = {
    name: 'Cookie Teleporter',
    description: 'This item will teleport random amounts of cookies into your account.',
    id: '9174968b-b68c-4098-861c-adc05b8e1a09',
    unlocked: ({ cookieData }) => cookieData.total > 3000000,
    calcNextPrice: ({ cache }) => {
        const lvl = (cache?.level || 1) + 2
        const raised = Math.pow(lvl, 2)
        return lvl * raised * 8500
    },
    onTick: ({ cache }) => {
        const randNum = getRandNumber(1, 100)
        let income = 0

        if (randNum >= 93) {
            income += ((cache?.level || 1) / 2) * getRandNumber(1200, 2000)
        } else if (randNum >= 65) {
            income += ((cache?.level || 1) / 2) * getRandNumber(600, 1000)
        } else if (randNum >= 50) {
            income += ((cache?.level || 1) / 2) * getRandNumber(200, 500)
        } else {
            income += ((cache?.level || 1) / 2) * 10
        }
        return income
    }
}

export default item