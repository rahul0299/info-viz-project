import {format, isAfter, parseISO, subDays, subHours} from "date-fns";



export const fetchData = async () => {
    console.log("Fetching data ...");
    return {
        volumeTrendData: await fetchVolumeTrendData(),
        orderSolverDelayData: await fetchOrderSolverDelayData(),
        solverParticipationData: await fetchSolverParticipationData(),
        tokenPairTreeMapData: await fetchTokenPairTreeMapData(),
        surplusLineData: await fetchSurplusLineData(),
        solverBubbleData: await fetchSolverBubbleData(),
        partialFilledData: await fetchPartialFilledData(),
    };
}

export const fetchVolumeTrendData = async () => {
    const [res24h, res7d] = await Promise.all([
        fetch("/out/volume_trend_24h.json").then(res => res.json()),
        fetch("/out/volume_trend_7d.json").then(res => res.json())
    ]);

    // Simulate 1 second delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    return {
        "24h": res24h,
        "7d": res7d
    };

}

export const fetchOrderSolverDelayData = async () => {
    return await fetch("/out/order_solver_time_diff.json").then(res => res.json());
}

export const fetchSolverParticipationData = async () => {
    return await fetch("/out/solver_participation.json").then(res => res.json());
}

export const fetchTokenPairTreeMapData = async () => {
    return await fetch("/out/treemap_token_pair_volume.json").then(res => res.json());
}

export const fetchSurplusLineData = async () => {
    return await fetch("/out/surplus_trend_5760fc_Wrapped Ether_USD Coin_7d.json").then(res => res.json());
}

export const fetchSolverBubbleData = async () => {
    return await fetch("/out/bubble_solver_volume_5760fc.json").then(res => res.json());
}

export const fetchPartialFilledData = async () => {
    return await fetch("/out/partially_fillable_5760fc.json").then(res => res.json());
}

