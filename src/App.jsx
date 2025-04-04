import './App.css'
import {StoreProvider} from "./store/StoreProvider.jsx";
import VolumeTrendChart from "./components/VolumeTrendChart.jsx";
import {useStore} from "./store/use-store.jsx";
import {useState} from "react";

function App() {
  const { volumeTrendData } = useStore();
  const [view, setView] = useState("24h");

  return <div>
    <VolumeTrendChart data={volumeTrendData[view]} view={view} />
    <button onClick={() => setView("24h")}>24h</button>
    <button onClick={() => setView("7d")}>7d</button>
  </div>;
}

export default App
