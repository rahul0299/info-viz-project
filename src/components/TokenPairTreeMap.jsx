import {
    Treemap,
    ResponsiveContainer,
    Tooltip
} from "recharts";
import DonutChart from "./DonutChart.jsx";

const TokenPairTreemap = ({ data }) => {
    return data.length > 0
        ?
        <ResponsiveContainer width="100%" height={400}>
            <Treemap
                data={data}
                dataKey="value"
                nameKey="tokenPair"
                stroke="#fff"
                fill="#8884d8"
                aspectRatio={4 / 3}
                isAnimationActive={false}
                content={<CustomTreemapContent />}
            >
                <Tooltip content={<CustomTooltip />} />
            </Treemap>
        </ResponsiveContainer>
        :
        <>No data available.</>

    ;
};

const CustomTooltip = ({ active, payload }) => {
    console.log(payload);
    console.log(active);
    if (!active || !payload?.length) return null;
    const { tokenPair, value } = payload[0].payload;
    return (
        <div style={{ background: "white", border: "1px solid #ccc", padding: "20px", fontFamily: "monospace" }}>
            <strong>{tokenPair}</strong><br />
            {value.toLocaleString()} {value > 10000 ? "USD" : "orders"}
            <div style={{ marginTop: "10px" }}>
                <DonutChart binCounts={payload[0].payload.binCounts} />
            </div>
        </div>
    );
};

const CustomTreemapContent = (props) => {
    const {
        x, y, width, height, index, tokenPair,
        colors = ["#8884d8", "#83a6ed", "#8dd1e1", "#82ca9d"]
    } = props;


    const name = tokenPair || ""
    const color = colors[index % colors.length];
    const padding = 4;
    const textFontSize = 10;

    return (
        <g>
            <rect x={x} y={y} width={width} height={height} fill={color} stroke="#fff" />
            {
                width > name.length * (textFontSize * 0.6) + padding &&
                height > textFontSize + padding && (
                    <text
                        x={x + padding}
                        y={y + textFontSize + padding}
                        fontSize={textFontSize}
                        fontFamily="Roboto, sans-serif"
                        fontWeight="lighter"
                        fill="#fff"
                        letterSpacing={1}
                    >
                        {name}
                    </text>
                )
            }
        </g>
    );
};


export default TokenPairTreemap;
