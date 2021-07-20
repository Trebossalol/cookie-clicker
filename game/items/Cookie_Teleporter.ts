import { Item } from '../types'
import getRandNumber from '../../util/getRandNumber'

const item: Item = {
    name: 'Cookie Teleporter',
    description: 'This will teleport cookies to your account, the amount is random',
    id: '9174968b-b68c-4098-861c-adc05b8e1a09',
    unlocked: ({ cookieData }) => cookieData.total > 3000000,
    calcNextPrice: ({ cache }) => {
        const lvl = (cache?.level || 1) + 2
        const raised = Math.pow(lvl, 2)
        return lvl * raised * 8500
    },
    onTick: ({ cache }) => {
        const randNum = getRandNumber(1, 100)
        let income = ((cache?.level || 1) / 2) * 10

        if (randNum > 90) {
            income += ((cache?.level || 1) / 2) * getRandNumber(1800, 2200)
        } else if (randNum > 65) {
            income += ((cache?.level || 1) / 2) * getRandNumber(800, 200)
        } else if (randNum > 30) {
            income += ((cache?.level || 1) / 2) * getRandNumber(500, 50)
        } else {
            income += ((cache?.level || 1) / 2) * 30
        }
        return income
    }
}

export default item