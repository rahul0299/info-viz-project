import VolumeTrendChart from "../../components/VolumeTrendChart.jsx";
import {useStore} from "../../store/use-store.jsx";
import SolverParticipationChart from "../../components/SolverParticipationChart.jsx";
import {formatNumber, formatTitle} from "../../utils.jsx";
import {Typography} from "@mui/material";
import "./main-dashboard.css";
import TokenPairTreemap from "../../components/TokenPairTreeMap.jsx";
import OrderSolverDelayChart from "../../components/OrderSolverDelayChart.jsx";


const MainDashboard = () => {
    const { state } = useStore();

    return <div className="dashboard">
        {
            Object.entries(state.dashboard.stats)
                .filter(entry => entry[1] !== null)
                .map(([k, v]) => (
                    <div className="box stats" key={k}>
                        <Typography fontSize="small" color="textSecondary" textTransform="capitalize">{formatTitle(k)}</Typography>
                        <Typography variant="h5" color="textPrimary" textTransform="capitalize">{formatNumber(v)}</Typography>
                    </div>
                ))
        }

        <div className="box dashboard-viz volume-trend"><VolumeTrendChart data={state.dashboard?.volumeTrend || []} /></div>
        <div className="box dashboard-viz solver-time"><OrderSolverDelayChart data={state.dashboard?.orderSolverTimeDiff.binCounts || []} /></div>
        <div className="box dashboard-viz participants"><SolverParticipationChart data={state.dashboard?.solverParticipation || []}/></div>
        <div className="box dashboard-viz treemap"><TokenPairTreemap data={[]} metric={state.dashboard?.tokenPairTreeMap.metric} /></div>
    </div>
}

export default MainDashboard;