import { createContext, useContext, useReducer, useEffect } from "react";

export const StateContext = createContext()

const loadState = () => {
    try {
        const serializedState = localStorage.getItem('appState');
        if (serializedState === null) return undefined;
        return JSON.parse(serializedState);
    } catch (err) {
        return undefined;
    }
}

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

    useEffect(() => {
        saveState(state)
    }, [state])

    return (
        <StateContext.Provider value={useReducer(reducer, initialState)}>
            {children}
        </StateContext.Provider>
    )

}

export const useStateProvider = () => useContext(StateContext)
