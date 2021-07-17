import React from "react";
import { Ionicons } from '@expo/vector-icons';

export default function TabBarIcon(props: { name: React.ComponentProps<typeof Ionicons>['name']; color: string; size?: number; [key: string]: any}) {
    return <Ionicons style={{ marginBottom: -3 }} {...props} size={props.size || 28}/>;
}