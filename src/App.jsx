import './App.css'
import {StoreProvider} from "./store/StoreProvider.jsx";
import VolumeTrendChart from "./components/VolumeTrendChart.jsx";
import {useStore} from "./store/use-store.jsx";
import {useState} from "react";
import OrderSolverDelayChart from "./components/OrderSolverDelayChart.jsx";
import SolverParticipationChart from "./components/SolverParticipationChart.jsx";
import TokenPairTreeMap from "./components/TokenPairTreeMap.jsx";

function App() {
  const {
    volumeTrendData,
    orderSolverDelayData,
    solverParticipationData,
    tokenPairTreeMapData,
  } = useStore();

  const [view, setView] = useState("24h");


  return <div>
    <VolumeTrendChart data={volumeTrendData[view]} view={view} />
    <button onClick={() => setView("24h")}>24h</button>
    <button onClick={() => setView("7d")}>7d</button>
    <OrderSolverDelayChart data={orderSolverDelayData} />
    <SolverParticipationChart data={solverParticipationData} />
    <TokenPairTreeMap data={tokenPairTreeMapData} />
  </div>;
}

export default App
