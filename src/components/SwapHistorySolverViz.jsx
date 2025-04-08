import SolverDashboardTokenPairSelect from "./solver-dashboard-token-pair-select/SolverDashboardTokenPairSelect.jsx";
import SwapHistoryTable from "./SwapHistoryTable.jsx";
import {useSolverActions} from "../store/actions/use-solver-actions.jsx";

const SwapHistorySolverViz = ({data, tokenPairs=[], selectedTokenPair}) => {
    const { setSwapHistoryTokenPair } = useSolverActions();

    return <div style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        gap: "10px"
    }}>
        <div style={{
            display: "flex",
            flexDirection:"row",
            justifyContent: "center",
            alignItems: "baseline",
            maxWidth: "500px",
            backgroundColor: "white"
        }}>
            <SolverDashboardTokenPairSelect tokenPairs={tokenPairs} action={setSwapHistoryTokenPair} selectedPair={selectedTokenPair} defaultOption="All" />
        </div>

        <div style={{ display: "flex", flexGrow: 1, justifyContent: "center", alignItems: "center" }}>
            {
                data.length > 0 ? (
                        <SwapHistoryTable data={data} />
                    ) :
                    <p>No data available.</p>
            }
        </div>
    </div>

}

export default SwapHistorySolverViz;