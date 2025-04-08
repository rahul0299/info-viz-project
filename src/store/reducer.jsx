export const reducer = (state, action) => {
    switch (action.type) {

        case "SET_STATE":
            return { ...state, ...action.payload };

        case "SET_INTERVAL":
            return { ...state, interval: action.payload };

        case "SET_RANGE":
            return { ...state, range_days: action.payload };

        case "SET_SELECTED_SOLVER":
            return { ...state, selectedSolver: action.payload };

        case "SET_MAIN_TREEMAP_METRIC":
            return {
                ...state,
                dashboard: {
                    ...state.dashboard,
                    tokenPairTreeMap: {
                        ...state.dashboard.tokenPairTreeMap,
                        metric: action.payload,
                    },
                },
            };

        case "SET_SURPLUS_TOKEN_PAIR":
            return {
                ...state,
                solverDashboard: {
                    ...state.solverDashboard,
                    surplusTrend: {
                        ...state.solverDashboard.surplusTrend,
                        tokenPair: action.payload,
                    },
                },
            };

        case "SET_SWAP_HISTORY_PAIR":
            return {
                ...state,
                solverDashboard: {
                    ...state.solverDashboard,
                    swapHistory: {
                        ...state.solverDashboard.swapHistory,
                        tokenPair: action.payload,
                    },
                },
            };

        default:
            return state;
    }
}