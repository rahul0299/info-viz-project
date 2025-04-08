import {useStore} from "../store/use-store.jsx";
import {Box, Button, ButtonGroup, FormControl, InputLabel, MenuItem, Select, Typography} from "@mui/material";
import {useGlobalActions} from "../store/actions/use-global-actions.jsx";
import MainDashboard from "./main-dashboard/MainDashboard.jsx";
import "./layout.css"
import SolverSelect from "../components/solver-select/SolverSelect.jsx";
import SolverDashboard from "./solver-dashboard/SolverDashboard.jsx";


const timeRanges = [
    [1, "24h"],
    [7, "7d"]
];

const intervals = [
    "1hr",
    "2hr",
    "4hr"
]

const Layout = () => {
    const {state} = useStore();

    console.log(state);

    const actions = useGlobalActions();

    return <div>
        <div className="header">
            <Typography variant="h4" component="h1">Page Title</Typography>

            <SolverSelect />

            <div>
                <ButtonGroup sx={{marginRight: "40px"}}>
                    {
                        timeRanges.map(([key, value]) => (
                            <Button
                                key={`range-${key}`}
                                onClick={() => actions.setTimeRange(key)}
                                variant={state.range_days === key ? "contained" : "outlined"}
                            >
                                {value}
                            </Button>
                        ))
                    }
                </ButtonGroup>


                <ButtonGroup>
                    {
                        intervals.map(i => (
                            <Button
                                key={`interval-${i}`}
                                onClick={() => actions.setInterval(i)}
                                variant={state.interval === i ? "contained" : "outlined"}
                            >
                                {i}
                            </Button>
                        ))
                    }
                </ButtonGroup>
            </div>
        </div>

        {
            state.selectedSolver === "solver-global" ? <MainDashboard/> : <SolverDashboard />
        }

    </div>
}

export default Layout;