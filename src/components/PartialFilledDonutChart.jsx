import DonutChart from "./DonutChart.jsx";

export const PartialFilledDonutChart = ({ data }) => {
    return data.binCounts ? (
        <DonutChart binCounts={data.binCounts} size={300} />
    ) :
        <div>No data available.</div>
}

export default PartialFilledDonutChart;