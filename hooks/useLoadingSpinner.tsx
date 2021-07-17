import React from 'react'
import { View, StyleSheet } from 'react-native'
import Spinner from 'react-native-loading-spinner-overlay'

interface SpinnerProps {
    text?: string
}

interface props {
    defaultState?: boolean
}

export default (props?: props) => {

    const [abortController, setAbortController] = React.useState<AbortController>()
    const [loading, setLoading] = React.useState((props && props.defaultState) ?? false)

    React.useEffect(() => {
        
        setAbortController(new AbortController())
        
        return () => abortController?.abort()
    }, [])

    return {
        loading,
        setLoading: (state: boolean, delayMS: number = 20) => {
            setTimeout(() => {
                if (abortController?.signal.aborted !== true) setLoading(state)
            }, delayMS)
        },
        Spinner: (props: SpinnerProps) => !loading ? (null) : (
            <Spinner
                visible={loading}
                animation='fade'
                textContent={(props && props.text) ?? 'Bitte warten'}
                textStyle={styles.spinnerTextStyle}
                size='large'
            />
        )
    }
}

const styles = StyleSheet.create({
    spinnerTextStyle: {
        color: '#FFF',
    },
})