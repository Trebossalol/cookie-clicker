import CookieStore from '../items/Cookie_Store'
import CookieFactory from '../items/Cookie_Factory'
import Finger from '../items/Finger'
import CookieMultiplier from '../items/Cookie_Multiplier'
import CookieTeleporter from '../items/Cookie_Teleporter'
import CookieRoboter from '../items/Cookie_Roboter'
import IncomeManager from '../items/Income_Manager';

import { WorldData } from '../types'

const W1: WorldData = {
    name: 'Stadt',
    id: '46afa2df-38e0-4c10-a483-9a5de43554de',
    multiplicator: 1,
    items: [
        Finger,
        IncomeManager,
        CookieStore,
        CookieFactory,
        CookieMultiplier,
        CookieTeleporter,
        CookieRoboter
    ]
}

export default W1