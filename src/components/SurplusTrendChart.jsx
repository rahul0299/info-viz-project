import {
    ResponsiveContainer,
    LineChart,
    Line,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip, Treemap
} from "recharts";
import {formatDate} from "../utils.jsx";
import {useSolverActions} from "../store/actions/use-solver-actions.jsx";
import {useStore} from "../store/use-store.jsx";
import SolverDashboardTokenPairSelect from "./solver-dashboard-token-pair-select/SolverDashboardTokenPairSelect.jsx";

const SurplusTrendChart = ({ data, tokenPairs, selectedTokenPair }) => {

    const { setSurplusTokenPair } = useSolverActions()
    const { state: { solverDashboard: { surplusTrend } }} = useStore();

    console.log(surplusTrend)

    data = data.map(d => ({ ...d, timestamp: new Date(d.timestamp) }))

    return <div style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "start",
        gap: "10px",
        height: "100%",
        width: "100%"
    }}>
        <div style={{ display: "flex", flexDirection:"row", justifyContent: "center", alignItems: "baseline", width: "100%"}}>
            <SolverDashboardTokenPairSelect tokenPairs={tokenPairs} action={setSurplusTokenPair} selectedPair={selectedTokenPair} />
        </div>

        <div style={{ display: "flex", flexGrow: 1, justifyContent: "center", alignItems: "center" }}>
            {
                data.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="timestamp" tick={{ fontSize: 12 }} tickFormatter={formatDate}/>
                            <YAxis domain={['auto', 'auto']}
                            />

                            <Tooltip
                                formatter={value => value}
                                labelFormatter={label => formatDate(label)} />
                            <Line
                                type="monotone"
                                dataKey="surplusInUSD"
                                stroke="#82ca9d"
                                strokeWidth={2}
                                dot={false}
                                isAnimationActive={true}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                ) :
                    <>No data available.</>
            }
        </div>
    </div>
};

export default SurplusTrendChart;
