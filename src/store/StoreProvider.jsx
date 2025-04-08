import {useEffect, useReducer} from "react";
import {fetchData} from "../utils.jsx";
import {initialState, StoreContext} from "./use-store.jsx";
import {reducer} from "./reducer.jsx";

export const StoreProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    const refreshData = async () => {
        const res = await fetchData(state);

        dispatch({
            type: "SET_STATE",
            payload: res,
        });
    }

    useEffect(() => {
        refreshData().then(() => {console.log("Refreshed Data")});

        const refreshInterval = setInterval(refreshData, 5 * 60 * 1000);

        return () => clearInterval(refreshInterval);
    }, [
        state.range_days,
        state.interval,
        state.selectedSolver,
        state.dashboard?.tokenPairTreeMap.metric,
        state.solverDashboard?.surplusTrend.tokenPair,
        state.solverDashboard?.swapHistory.tokenPair,
    ])


    return <StoreContext.Provider value={{state, dispatch}}>
        {children}
    </StoreContext.Provider>;
}