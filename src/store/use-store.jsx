import {createContext, useContext} from "react";

export const initialState = {
    volumeTrendData: {
        "24h": [],
        "7d": []
    },
}

export const StoreContext = createContext(initialState);

export const useStore = () => useContext(StoreContext);