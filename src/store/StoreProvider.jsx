import {useEffect, useState} from "react";
import {fetchData} from "../utils.jsx";
import {initialState, StoreContext} from "./use-store.jsx";

export const StoreProvider = ({ children }) => {
    const [state, setState] = useState(initialState);

    useEffect(() => {
        fetchData()

        const refreshInterval = setInterval(() => {
            fetchData();
        }, 5 * 60 * 1000);

        return () => clearInterval(refreshInterval);
    }, [])


    return <StoreContext.Provider value={state}>
        {children}
    </StoreContext.Provider>;
}