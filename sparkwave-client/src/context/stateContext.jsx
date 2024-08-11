import { createContext, useContext, useReducer, useEffect } from "react";

export const StateContext = createContext()

const loadState = () => {
    try {
        const serializedState = localStorage.getItem('appState')
        if (serializedState === null) { return undefined }
        return JSON.parse(serializedState);
    } catch (err) {
        return undefined;
    }
}

const saveState = (state) => {
    try {
        const { userInfo, newUser, onBoarded } = state
        const stateToSave = {
            userInfo,
            newUser,
            onBoarded
        }

        const serializedState = JSON.stringify(stateToSave)
        localStorage.setItem('appState', serializedState)
    } catch (err) {
        console.log(err)
    }
}

export const StateProvider = ({ initialState, reducer, children }) => {
    const [state, dispatch] = useReducer(reducer, loadState() || initialState)

    useEffect(() => {
        saveState(state)
    }, [state])

    return (
        <StateContext.Provider value={{ state, dispatch }}>
            {children}
        </StateContext.Provider>
    )
}

export const useStateProvider = () => {
    const context = useContext(StateContext)
    if (!context) {
        throw new Error("useStateProvider must be used within a StateProvider")
    }
    return [context.state, context.dispatch]
}
