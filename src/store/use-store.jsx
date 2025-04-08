import {createContext, useContext} from "react";

export const initialState = {
    interval: "4hr",
    range_days: 7,
    solverList: [],
    selectedSolver: "solver-global",
    dashboard: {
        stats: [],
        volumeTrend: [],
        orderSolverTimeDiff: {},
        solverParticipation: [],
        tokenPairTreeMap: {
            metric: "volume",
            data: [],
        }
    },
    solverDashboard: {
        stats: [],
        tokenPairList: [],
        surplusTrend: {
            tokenPair: null,
            data: []
        },
        tokenPairBubble: {
            metric: "volume",
            data: [],
        },
        orderDistribution: {},
        swapHistory: {
            tokenPair: "All",
            data: [],
        }
    },
    leaderboard: {
        data: []
    }
}

export const StoreContext = createContext(initialState);

export const useStore = () => useContext(StoreContext);