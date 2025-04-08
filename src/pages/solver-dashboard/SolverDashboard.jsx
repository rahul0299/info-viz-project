import "./solver-dashboard.css";
import {useStore} from "../../store/use-store.jsx";
import {Typography} from "@mui/material";
import {formatNumber, formatTitle} from "../../utils.jsx";
import SurplusTrendChart from "../../components/SurplusTrendChart.jsx";
import PartialFilledDonutChart from "../../components/PartialFilledDonutChart.jsx";
import SwapHistoryWrapper from "../../components/SwapHistoryWrapper.jsx";
import SolverBubbleWrapper from "../../components/solver-select/SolverBubbleWrapper.jsx";

const SolverDashboard = () => {
    const { state } = useStore();

    return (
        <div className="solver-dashboard">
            <div className="solver-page-header">
                {
                    Object.entries(state.solverDashboard.stats)
                        .filter(entry => entry[1] !== null)
                        .map(([k, v]) => (
                            <div className="box metric-box" key={k}>
                                <Typography fontSize="small" color="textSecondary" textTransform="capitalize">{formatTitle(k)}</Typography>
                                <Typography variant="h5" color="textPrimary" textTransform="capitalize">{formatNumber(v)}</Typography>
                            </div>
                        ))
                }
            </div>

            <div className="solver-page-main">
                <div className="box surplus-chart">
                    <SurplusTrendChart
                        data={state.solverDashboard.surplusTrend.data}
                        tokenPairs={state.solverDashboard.tokenPairList}
                        selectedTokenPair={state.solverDashboard.surplusTrend.tokenPair}
                    />
                </div>
                <div className="box bubble-chart">
                    <SolverBubbleWrapper
                        data={state.solverDashboard.tokenPairBubble.data}
                        metric={state.solverDashboard.tokenPairBubble.metric} />
                </div>
                <div className="box order-composition">
                    <PartialFilledDonutChart data={state.solverDashboard.orderDistribution} />
                </div>

                <div className="box swap-history-table">
                    <SwapHistoryWrapper
                        data={state.solverDashboard.swapHistory.data}
                        tokenPairs={state.solverDashboard.tokenPairList}
                        selectedTokenPair={state.solverDashboard.swapHistory.tokenPair}
                    />
                </div>
            </div>
        </div>

    );
};

export default SolverDashboard;
