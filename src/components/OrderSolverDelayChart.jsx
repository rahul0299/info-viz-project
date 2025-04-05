import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from "recharts";

const OrderSolverDelayChart = ({ data, scale = "linear" }) => {
    return data.length > 0
        ?
        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="bucket" />
                <YAxis scale={scale} domain={["auto", "auto"]} />
                <Tooltip />
                <Bar dataKey="count" fill="#82ca9d"  isAnimationActive={true}/>
            </BarChart>
        </ResponsiveContainer>
        :
        <>No data available.</>
    ;
};

export default OrderSolverDelayChart;