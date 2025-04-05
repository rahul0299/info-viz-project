import {
    ResponsiveContainer,
    LineChart,
    Line,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip
} from "recharts";

const SurplusTrendChart = ({ data }) => {
    return data.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="createdTimestamp" tick={{ fontSize: 12 }} />
                <YAxis />
                <Tooltip />
                <Line
                    type="monotone"
                    dataKey="surplus"
                    stroke="#82ca9d"
                    strokeWidth={2}
                    dot={false}
                    isAnimationActive={true}
                />
            </LineChart>
        </ResponsiveContainer>
    ) : (
        <>No data available.</>
    );
};

export default SurplusTrendChart;
