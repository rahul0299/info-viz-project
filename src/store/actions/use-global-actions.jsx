import { useStore } from "../use-store";

export const useGlobalActions = () => {
    const { dispatch } = useStore();

    return {
        setTimeRange: (range_days) => dispatch({ type: "SET_RANGE", payload: range_days }),
        setInterval: (interval) => dispatch({ type: "SET_INTERVAL", payload: interval }),
        setSelectedSolver: (solver) => dispatch({ type: "SET_SELECTED_SOLVER", payload: solver }),
    };
};
