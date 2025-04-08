import SolverDashboardTokenPairSelect from "../solver-dashboard-token-pair-select/SolverDashboardTokenPairSelect.jsx";
import {CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";
import {formatDate, formatNumber} from "../../utils.jsx";
import {Button, ButtonGroup} from "@mui/material";
import {useSolverActions} from "../../store/actions/use-solver-actions.jsx";
import SolverBubbleChart from "../SolverBubbleChart.jsx";

const SolverBubbleWrapper = ({ data, metric }) => {
    const { setTokenPairBubbleMetric } = useSolverActions();

    data = data.map((item) => {
        const tokenPair = `${item.tokenPair.sellToken.name}-${item.tokenPair.buyToken.name}`;
        return {...item, tokenPair};
    })

    return <div style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "start",
        gap: "10px",
        height: "100%",
        width: "100%"
    }}>
        <div style={{ display: "flex", flexDirection:"row", justifyContent: "center", alignItems: "baseline", width: "100%"}}>
            <div style={{ display: "flex", justifyContent: "end", width: "100%" }}>
                <ButtonGroup size="small">
                    <Button
                        variant={metric === "volume" ? "contained" : "outlined"}
                        sx={{ fontSize: "10px"}}
                        onClick={() => setTokenPairBubbleMetric("volume")}
                    >
                        Volume
                    </Button>
                    <Button
                        variant={metric === "count" ? "contained" : "outlined"}
                        sx={{ fontSize: "10px"}}
                        onClick={() => setTokenPairBubbleMetric("count")}
                    >
                        Count
                    </Button>
                </ButtonGroup>
            </div>
        </div>

        <div style={{ display: "flex", flexGrow: 1, justifyContent: "center", alignItems: "center" }}>
            {
                data.length > 0 ? (
                    <SolverBubbleChart data={data} width={400} height={400} />
                    ) :
                    <>No data available.</>
            }
        </div>
    </div>
}

export default SolverBubbleWrapper;