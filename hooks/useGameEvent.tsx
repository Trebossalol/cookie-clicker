import React from 'react'
import { View, StyleSheet, View as NativeView, TouchableHighlight, Button, ToastAndroid } from 'react-native'
import Spinner from 'react-native-loading-spinner-overlay'
import { MonoText } from '../components/StyledText'
import { useWorldData } from '../context/WorldContext'
import { useGameData } from '../game/game'
import { GameDataRegistry } from '../game/registry'
import getRandNumber from '../util/getRandNumber'
import { store } from '../util/storage'

interface EventProps {
    
}

interface UseGameEventProps {
    eventTitle: string
    color?: string
    eventDuration: number
    price: number
    onSuccess: () => number[]
    getIntervalMs?: () => number
    percentageChances?:  number
}

export type UseGameEventElement = (eventProps: EventProps) => JSX.Element | null

export interface UseGameEventRv {
    Event: UseGameEventElement
    multiplicators: number[] | null
}

export default (props: UseGameEventProps): UseGameEventRv => {

    const game = useGameData()
    const worldData = useWorldData()

    const [multiplicators, setMultiplicators] = React.useState<number[] | null>(null)
    const [disabled, setDisabled] = React.useState<boolean>(true)

    const onPress = async() => {
        if (disabled) return 
        if (game.removeCookies(props.price) === false) {
            ToastAndroid.show(`You need ${Math.round(props.price - game.cookies)} more cookies.`, ToastAndroid.SHORT)
            return
        }
        const multiplicators = props.onSuccess()
        setMultiplicators(multiplicators)
        ToastAndroid.show(`Event active`, ToastAndroid.LONG)
    }

    React.useEffect(() => {
        if (multiplicators === null || disabled === true) return
        setDisabled(true)
        setTimeout(() => {
            setMultiplicators(null)
            ToastAndroid.show('Event end', ToastAndroid.LONG)
        }, props.eventDuration)
    }, [multiplicators])

    React.useEffect(() => {
        let ms = props.getIntervalMs
        let interval = setInterval(() => {
            if (disabled === false) return
            console.log('interval running')
            const randNum = getRandNumber(1, 100)
            const chance = (props.percentageChances || 0.15) * 100
            console.log(randNum, chance)
            if (randNum <= chance && multiplicators !== null) {
                setDisabled(false)
                ToastAndroid.show('Bonus is unlocked', ToastAndroid.SHORT)
            }
        }, ms ? ms() : 14500)

        return () => clearInterval(interval)
    }, [])

    const Event = React.useCallback((eventProps: EventProps) => {
        return !disabled ? (
            <NativeView>
                <TouchableHighlight>
                    <Button disabled={disabled} color={props?.color} title={props?.eventTitle} onPress={onPress}/>
                </TouchableHighlight>
            </NativeView>
        ) : (null)
    }, [disabled, onPress])

    return {
        multiplicators,
        Event
    }
}

const styles = StyleSheet.create({
    spinnerTextStyle: {
        color: '#FFF',
    },
})