import {
    ResponsiveContainer,
    LineChart,
    Line,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
} from "recharts";
import {formatDate, formatNumber} from "../utils.jsx";
import {useSolverActions} from "../store/actions/use-solver-actions.jsx";
import SolverDashboardTokenPairSelect from "./solver-dashboard-token-pair-select/SolverDashboardTokenPairSelect.jsx";

const SurplusTrendChart = ({ data, tokenPairs, selectedTokenPair }) => {

    const { setSurplusTokenPair } = useSolverActions()

    data = data.map(d => ({ ...d, timestamp: new Date(d.timestamp) }))

    return <div style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "start",
        gap: "10px",
        height: "100%",
        width: "100%"
    }}>
        <div style={{ display: "flex", flexDirection:"row", justifyContent: "start", gap: "50px", alignItems: "center", width: "100%"}}>
            <h3 style={{ margin: 0, flexGrow: 1 }}>Surplus Trend</h3>
            <SolverDashboardTokenPairSelect tokenPairs={tokenPairs} action={setSurplusTokenPair} selectedPair={selectedTokenPair} />
        </div>

        <div style={{ display: "flex", flexGrow: 1, justifyContent: "center", alignItems: "center" }}>
            {
                data.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="timestamp" tick={{ fontSize: 12 }} tickFormatter={formatDate} label={{ value: "Time", position: "insideBottom", offset: -5 }}/>
                            <YAxis domain={['auto', 'auto']} label={{ value: "Surplus (USD)", angle: -90, position: "insideLeft", offset: 10 }}
                            />

                            {/*<Tooltip*/}
                            {/*    formatter={value => formatNumber(value)}*/}
                            {/*    labelFormatter={label => formatDate(label)} />*/}

                            <Tooltip content={<CustomTooltip />} />
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



const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        console.log(payload[0])
        const { timestamp, surplusInUSD  } = payload[0].payload;
        const color = payload[0].color;

        return (
            <div style={{ background: "#fff", border: "1px solid #ccc", padding: 8, fontSize: 16 }}>
                <div>{formatDate(timestamp)}</div>
                <div style={{ color, fontWeight: 600 }}>Surplus (USD): ${formatNumber(surplusInUSD.toFixed(2))}</div>
            </div>
        );
    }
    return null;
};
