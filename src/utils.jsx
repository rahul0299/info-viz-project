const apiUrl = import.meta.env.VITE_API_URL;

export const formatNumber = value => {
    if (value === null || value === undefined || isNaN(value)) return "—";

    const absValue = Math.abs(value);

    if (absValue >= 1_000_000_000) {
        return (value / 1_000_000_000).toFixed(2) + "B";
    } else if (absValue >= 1_000_000) {
        return (value / 1_000_000).toFixed(2) + "M";
    } else if (absValue >= 1_000) {
        return (value / 1_000).toFixed(2) + "k";
    } else {
        return value.toString();
    }
}

export const formatTitle = title => {
    return title.replace("_", " ")
}

export const formatDate = date => {
    return date.toLocaleString("en-GB", {
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false
    });

}

export const getUniqueTokens = tokens => {
    const tokenNameSet = new Set();
    return tokens.filter(token => {
        const unique = !tokenNameSet.has(token.name);
        if (unique) {
            tokenNameSet.add(token.name);
        }
        return unique;
    })
}

export const fetchData = async (state) => {
    const { interval, range_days, selectedSolver } = state;

    // fetch global stats
    if (selectedSolver === "solver-global") {
        const treeMapMetric = state.dashboard.tokenPairTreeMap.metric;

        return {
            solverList: await fetchSolverList(),
            dashboard: {
                volumeTrend: await fetchVolumeTrend(interval, range_days),
                solverParticipation: await fetchSolverParticipation(range_days),
                stats: await fetchOverviewStats(range_days),
                tokenPairTreeMap: {
                    metric: treeMapMetric,
                    data: await fetchTokenPairTreeMap(treeMapMetric, range_days),
                },
                orderSolverTimeDiff: await fetchOrderSolverTimeDiff(range_days),
            }
        };
    } else if (selectedSolver === "solver-leaderboard") {
        return {
            solverList: await fetchSolverList(),
            leaderboard: {
                data: await fetchLeaderboard(range_days),
            }
        }

    } else {
        const surplusTokenPair = state.solverDashboard?.surplusTrend?.tokenPair ?? null;
        const swapHistoryTokenPair = state.solverDashboard?.swapHistory?.tokenPair ?? "All";

        return {
            solverList: await fetchSolverList(),
            solverDashboard: {
                stats: await fetchOverviewStats(range_days, selectedSolver),
                tokenPairList: await fetchTokenPairList(range_days, selectedSolver),
                surplusTrend: {
                    tokenPair: surplusTokenPair,
                    data: await fetchSurplusTrend(range_days, selectedSolver, surplusTokenPair),
                },
                orderDistribution: await fetchOrderDistribution(range_days, selectedSolver),
                swapHistory: {
                    tokenPair: swapHistoryTokenPair,
                    data: await fetchSwapHistory(range_days, selectedSolver, swapHistoryTokenPair),
                }
            }
        };
    }
}

const fetchSolverList = async () => {
    return await fetch(apiUrl + "/solvers", {}).then(res => res.json());
}

const fetchVolumeTrend = async (interval, range_days) => {
    return await fetch(`${apiUrl}/volumn_trend?interval=${interval}&range_days=${range_days}`, {}).then(res => res.json());
}

const fetchSolverParticipation = async (range_days) => {
    return await fetch(`${apiUrl}/solver-participation?range_days=${range_days}`, {}).then(res => res.json());
}

const fetchTokenPairTreeMap = async (metric, range_days) => {
    return []
}

const fetchOrderSolverTimeDiff = async (range_days) => {
    return await fetch(`${apiUrl}/order-solved-time-diff-bins?range_days=${range_days}`, {}).then(res => res.json());
}


const fetchOverviewStats = async (range_days, solver="") => {
    return await fetch(`${apiUrl}/overview_stats?range_days=${range_days}&solver=${solver}`, {}).then(res => res.json());
}

const fetchTokenPairList = async (range_days, solver) => {
    return await fetch(`${apiUrl}/token-pair-list?range_days=${range_days}&solver=${solver}`, {}).then(res => res.json());
}

const fetchSurplusTrend = async (range_days, solver, tokenPair) => {
    if (solver === "solver-global" || !tokenPair) {
        return []
    }

    const url = `${apiUrl}/surplus-trend?range_days=${range_days}&solver=${solver}&buyToken=${tokenPair.buyToken.address}&sellToken=${tokenPair.sellToken.address}`

    return await fetch(url).then(res => res.json());

}

const fetchOrderDistribution = async (range_days, solver) => {
    return await fetch(`${apiUrl}/order-distribution-by?range_days=${range_days}`, {}).then(res => res.json());
}

const fetchSwapHistory = async (range_days, solver, tokenPair) => {
    if (solver === "solver-global") {
        return []
    }

    if (tokenPair === "All") {
        return await fetch(`${apiUrl}/latest-txns?range_days=${range_days}&solverAddress=${solver}`).then(res => res.json())
    }

    const url = `${apiUrl}/latest-txns?range_days=${range_days}&solverAddress=${solver}&buyToken=${tokenPair.buyToken.address}&sellToken=${tokenPair.sellToken.address}`

    return await fetch(url).then(res => res.json());

}

const fetchLeaderboard = async (range_days) => {
    return await fetch(`${apiUrl}/leaderboard?range_days=${range_days}`).then(res => res.json());
}