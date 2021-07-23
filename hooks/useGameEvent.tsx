import React from 'react'
import { View, StyleSheet, View as NativeView, TouchableHighlight, Button, ToastAndroid } from 'react-native'
import Spinner from 'react-native-loading-spinner-overlay'
import { MonoText } from '../components/StyledText'
import { useWorldData } from '../context/WorldContext'
import { useGameData } from '../game/game'
import { GameDataRegistry } from '../game/registry'
import { store } from '../util/storage'

interface EventProps {
    
}

interface UseGameEventProps {
    eventTitle: string
    color?: string
    durationMs: number
    price: number
    onSuccess: () => number[]
}

export default (props: UseGameEventProps) => {

    const game = useGameData()
    const worldData = useWorldData()

    const [multiplicators, setMultiplicators] = React.useState<number[] | null>(null)
    const [disabled, setDisabled] = React.useState<boolean>(true)

    const onPress = React.useCallback(async() => {
        if (game.cookies < props.price) {
            ToastAndroid.show(`You need ${Math.round(props.price - game.cookies)} more cookies.`, ToastAndroid.SHORT)
            return
        }
        /**
         * TODO: REMOVE COOKIES !
         */
        const multiplicators = props.onSuccess()
        setMultiplicators(multiplicators)
        ToastAndroid.show(`Success!`, ToastAndroid.SHORT)
    }, [game, game.cookies])

    React.useEffect(() => {
        if (multiplicators == null) return
        setDisabled(true)
        setTimeout(() => {
            setMultiplicators(null)
            setDisabled(false)
        }, props.durationMs)
    }, [multiplicators])

    const Event = React.useCallback((eventProps: EventProps) => {

        return (
            <NativeView>
                <TouchableHighlight>
                    <Button disabled={disabled} color={props?.color} title={props?.eventTitle} onPress={onPress}/>
                </TouchableHighlight>
            </NativeView>
        )
    }, [])

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