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

        <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                    dataKey="timestamp"
                    tick={{ fontSize: 12 }}
                    tickFormatter={formatDate}
                />

                <YAxis
                    tickFormatter={formatNumber}
                    tick={{ fontSize: 14 }}
                />

                <Tooltip
                    formatter={value => formatNumber(value)}
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

        :

        <>No data available.</>
};

export default VolumeTrendChart;