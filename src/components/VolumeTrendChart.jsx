import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    ResponsiveContainer
} from "recharts";
import {formatNumber, formatDate} from "../utils.jsx";

const VolumeTrendChart = ({ data }) => {

    data = data.map(d => ({ ...d, timestamp: new Date(d.timestamp) }))

    return data.length > 0
        ?

        <>
            <h3>Volume Trend</h3>
            <ResponsiveContainer width="100%" height="100%" >
                <LineChart data={data} margin={{left: 20, bottom: 10}}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        dataKey="timestamp"
                        tick={{ fontSize: 12 }}
                        tickFormatter={formatDate}
                        label={{ value: "Time", position: "insideBottom", offset: -5 }}
                    />

                    <YAxis
                        tickFormatter={formatNumber}
                        tick={{ fontSize: 14 }}
                        label={{ value: "Volume (USD)", angle: -90, position: "insideLeft", offset: -10 }}
                    />

                    <Tooltip
                        formatter={value => `$${formatNumber(value)}`}
                        labelFormatter={label => formatDate(label)}
                    />
                    <Line
                        type="monotone"
                        dataKey="volume"
                        stroke="#8884d8"
                        strokeWidth={2}
                        dot={true}
                        isAnimationActive={true}
                    />
                </LineChart>
            </ResponsiveContainer>
        </>

        :

        <>No data available.</>
};

export default VolumeTrendChart;