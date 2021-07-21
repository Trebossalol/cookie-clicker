import * as React from 'react';

type DispatchUpdateStatus = React.Dispatch<React.SetStateAction<boolean>>

const UpdatePending = React.createContext<boolean>(false)
const SetUpdatePending = React.createContext<DispatchUpdateStatus>(() => false)

export function useUpdatePending(): boolean {
    return React.useContext(UpdatePending)
}

export function useSetUpdatePending(): DispatchUpdateStatus {
    return React.useContext(SetUpdatePending)
}

export function UpdatePendingProvider(props: any) {

    const [pending, setPending] = React.useState(false)

    return (
        <UpdatePending.Provider value={pending}>
            <SetUpdatePending.Provider value={setPending}>
                {props.children}
            </SetUpdatePending.Provider>
        </UpdatePending.Provider>
    )
}