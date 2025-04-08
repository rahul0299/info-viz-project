import { useStore } from "../use-store";

export const useSolverActions = () => {
    const { dispatch } = useStore();

    return {
        setSurplusTokenPair: (tokenPair) => dispatch({ type: "SET_SURPLUS_TOKEN_PAIR", payload: tokenPair }),
        setSwapHistoryTokenPair: (tokenPair) => dispatch({ type: "SET_SWAP_HISTORY_PAIR", payload: tokenPair }),
        setTokenPairBubbleMetric: (metric) => dispatch({ type: "SET_TOKEN_PAIR_BUBBLE_METRIC", payload: metric }),
    };
};