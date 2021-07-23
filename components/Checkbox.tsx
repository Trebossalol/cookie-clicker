import React from 'react';
import { Button } from 'react-native'
import {TouchableNativeFeedback} from 'react-native-gesture-handler'

interface CheckboxProps {
    defaultValue: boolean
    title: (checked: boolean) => string
    onChange: (checked: boolean) => void
    color?: (checked: boolean) => string
    style?: object
}

export default (props: CheckboxProps) => {

    const [checked, setChecked] = React.useState<boolean>(props.defaultValue)

    React.useEffect(() => {
        props.onChange(props.defaultValue)
    }, [])

    React.useEffect(() => {
        props.onChange(checked)
    }, [checked])

    return (
        <TouchableNativeFeedback style={props.style}>
            <Button color={props?.color ? props.color(checked) : (!checked ? '#8cff66' : '#f54242')} title={props.title(checked)} onPress={() => setChecked(!checked)}/>
        </TouchableNativeFeedback>
    )
}