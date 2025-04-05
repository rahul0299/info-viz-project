import {createContext, useContext} from "react";

export const initialState = {
    volumeTrendData: {
        "24h": [],
        "7d": []
    },
    orderSolverDelayData: [],
    solverParticipationData: [],
    tokenPairTreeMapData: []
}

export const StoreContext = createContext(initialState);

export const useStore = () => useContext(StoreContext);