import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    ResponsiveContainer
} from "recharts";

const VolumeTrendChart = ({ data }) => {

    return data.length > 0
        ?

        <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timestamp" tick={{ fontSize: 12 }} />
                <YAxis />
                <Tooltip />
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