import { createContext, useContext, useReducer, useEffect } from "react";

export const StateContext = createContext()

const loadState = () => {
    try {
        const serializedState = localStorage.getItem('appState')
        console.log("serializedState",serializedState)
        if (serializedState === null) {return undefined}
        return JSON.parse(serializedState);
    } catch (err) {
        return undefined;
    }
}

console.log(loadState())

const saveState = (state) => {
    try {
        const serializedState = JSON.stringify(state);
        localStorage.setItem('appState', serializedState);
    } catch (err) {
        console.log(err)
    }
};

export const StateProvider = ({ initialState, reducer, children }) => {
    const [state, dispatch] = useReducer(reducer, loadState() || initialState)
    console.log("state",state)

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
