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

    data = Object.entries(data).map(([bin, count]) => {
        return { bin, count };
    })

    return data.length > 0
        ?
        <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="bin" fontFamily="Roboto" fontSize={12} />
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