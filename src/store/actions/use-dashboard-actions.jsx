import { useStore } from "../use-store";

export const useDashboardActions = () => {
    const { dispatch } = useStore();

    return {
        setTreeMapMetric: (metric) => dispatch({ type: "SET_MAIN_TREEMAP_METRIC", payload: metric }),
    };
};