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
        <>
            <h3>Order Solver Time Difference (secs)</h3>

            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{left: 10, bottom: 10}}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="bin" fontFamily="Roboto" fontSize={12} label={{ value: "Time Intervals (sec)", position: "insideBottom", offset: -5 }} />
                    <YAxis scale={scale} domain={["auto", "auto"]} label={{ value: "Count", angle: -90, position: "insideLeft", offset: 0 }} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#82ca9d"  isAnimationActive={true}/>
                </BarChart>
            </ResponsiveContainer>
        </>
        :
        <>No data available.</>
    ;
};

export default OrderSolverDelayChart;