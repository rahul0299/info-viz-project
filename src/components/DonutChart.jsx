import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
    Legend
} from "recharts";

const COLORS = [
    "#8884d8", "#8dd1e1", "#82ca9d", "#ffc658", "#ff8042", "#ffbb28",
    "#a4de6c", "#d0ed57", "#888888", "#a28bd4", "#d885a3", "#a0a0a0"
];

const DonutChart = ({ binCounts, size = 220, showLegend = true }) => {
    if (!binCounts) return null;

    const data = Object.entries(binCounts).map(([bin, count]) => ({
        name: bin,
        value: count
    })).filter(d => d.value > 0);

    return (
        <div style={{ display: "flex", alignItems: "center" }}>
            <div style={{ flex: "0 0 auto", width: size, height: size }}>
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            innerRadius={size * 0.35}
                            outerRadius={size * 0.5}
                            dataKey="value"
                            nameKey="name"
                            paddingAngle={2}
                            isAnimationActive={false}
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip formatter={(value, name) => [`${value} txs`, `Bin ${name}`]} />
                    </PieChart>
                </ResponsiveContainer>
            </div>

            {showLegend && (
                <div style={{ marginLeft: 24, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                    {data.map((entry, index) => (
                        <div key={entry.name} style={{ display: "flex", alignItems: "center", marginBottom: 4 }}>
                            <div style={{
                                width: 12,
                                height: 12,
                                borderRadius: "50%",
                                backgroundColor: COLORS[index % COLORS.length],
                                marginRight: 8
                            }} />
                            <span style={{ fontSize: 12, color: "#000" }}>{entry.name}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default DonutChart;
