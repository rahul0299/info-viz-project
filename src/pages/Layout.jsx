import {useStore} from "../store/use-store.jsx";
import {Button, ButtonGroup, Typography} from "@mui/material";
import {useGlobalActions} from "../store/actions/use-global-actions.jsx";
import MainDashboard from "./main-dashboard/MainDashboard.jsx";
import "./layout.css"
import SolverSelect from "../components/solver-select/SolverSelect.jsx";
import SolverDashboard from "./solver-dashboard/SolverDashboard.jsx";
import LeaderboardPage from "./leaderboard/LeaderboardPage.jsx";


const timeRanges = [
    [1, "24h"],
    [7, "7d"]
];

const intervals = [
    "1hr",
    "2hr",
    "4hr"
]

const getPage = (page) => {
    if (page === "solver-global") {
        return <MainDashboard />;
    } else if (page === "solver-leaderboard") {
        return <LeaderboardPage />
    }
    return <SolverDashboard />
}

const getTitle = (page) => {
    if (page === "solver-global") {
        return "Dashboard";
    } else if (page === "solver-leaderboard") {
        return "Leaderboard";
    }
    return "Solver Dashboard";
}

const Layout = () => {
    const {state} = useStore();

    const actions = useGlobalActions();

    return <div>
        <div className="header">
            <Typography variant="h4" component="h1">{getTitle(state.selectedSolver)}</Typography>

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
            getPage(state.selectedSolver)
        }

    </div>
}

export default Layout;