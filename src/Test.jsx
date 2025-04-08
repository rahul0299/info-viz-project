import {useStore} from "./store/use-store.jsx";
import {useState} from "react";
import VolumeTrendChart from "./components/VolumeTrendChart.jsx";
import OrderSolverDelayChart from "./components/OrderSolverDelayChart.jsx";
import SolverParticipationChart from "./components/SolverParticipationChart.jsx";
import TokenPairTreeMap from "./components/TokenPairTreeMap.jsx";
import SurplusTrendChart from "./components/SurplusTrendChart.jsx";
import SolverBubbleChart from "./components/SolverBubbleChart.jsx";
import PartialFilledDonutChart from "./components/PartialFilledDonutChart.jsx";

const Test = () => {
    const {
        volumeTrendData,
        orderSolverDelayData,
        solverParticipationData,
        tokenPairTreeMapData,
        surplusLineData,
        solverBubbleData,
        partialFilledData,
    } = useStore();

    const [view, setView] = useState("24h");

    return <div>
        <VolumeTrendChart data={volumeTrendData[view]} view={view} />
        <button onClick={() => setView("24h")}>24h</button>
        <button onClick={() => setView("7d")}>7d</button>
        <OrderSolverDelayChart data={orderSolverDelayData} />
        <SolverParticipationChart data={solverParticipationData} />
        <TokenPairTreeMap data={tokenPairTreeMapData} />

        <h2>Solver Address (Page 2)</h2>
        <SurplusTrendChart data={surplusLineData} />
        <SolverBubbleChart data={solverBubbleData} width={600} height={600} />
        <PartialFilledDonutChart data={partialFilledData} />
    </div>;
}

export default Test;