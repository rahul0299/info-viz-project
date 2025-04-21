import DonutChart from "./DonutChart.jsx";

export const PartialFilledDonutChart = ({ data }) => {
    return data.binCounts ? (
        <>
            <h3 style={{ margin: "5px" }}>Buy/Sell Composition</h3>
            <div style={{ flexGrow: 1, display: "flex", justifyContent: "center", alignItems: "center"}}>
                <DonutChart binCounts={data.binCounts} size={300} />

            </div>
        </>
    ) :
        <div>No data available.</div>
}

export default PartialFilledDonutChart;