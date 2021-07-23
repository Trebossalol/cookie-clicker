import { Item } from '../types'
import getRandNumber from '../../util/getRandNumber'

const item: Item = {
    name: 'Cookie Teleporter',
    description: 'This item will teleport random amounts of cookies into your account.',
    id: '9174968b-b68c-4098-861c-adc05b8e1a09',
    requirements: [
        'You must have a total amount of cookies above 3 Million',
        'You must be level 25'
    ],
    unlocked: ({ cookieData, levelDetails }) => cookieData.total > 3000000 && levelDetails.level >= 25,
    calcNextPrice: ({ cache }) => {
        const lvl = (cache?.level || 1) + 2
        const raised = Math.pow(lvl, 2)
        return lvl * raised * 10
    },
    onTick: ({ cache }) => {
        const randNum = getRandNumber(1, 100)
        let income = 0

        if (randNum >= 93) {
            income += ((cache?.level || 1) / 2) * getRandNumber(100, 600)
        } else if (randNum >= 65) {
            income += ((cache?.level || 1) / 2) * getRandNumber(70, 100)
        } else if (randNum >= 50) {
            income += ((cache?.level || 1) / 2) * getRandNumber(50, 80)
        } else {
            income += ((cache?.level || 1) / 2) * 10
        }
        return income
    }
}

export default item