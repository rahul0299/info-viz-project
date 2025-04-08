import {useStore} from "../../store/use-store.jsx";
import {Box, FormControl, InputLabel, MenuItem, Select, Typography} from "@mui/material";
import "./solver-select.css";
import {useGlobalActions} from "../../store/actions/use-global-actions.jsx";

const SolverSelect = () => {
    const {state, dispatch} = useStore();
    const { setSelectedSolver } = useGlobalActions();

    return <FormControl fullWidth sx={{ maxWidth: 500 }}>
        <InputLabel id="solver-select-label">Solver</InputLabel>
        <Select
            size="small"
            variant="outlined"
            labelId="solver-select-label"
            id="solver-select"
            label="Solver"
            defaultValue="solver-global"
            onChange={(e) => setSelectedSolver(e.target.value)}
            MenuProps={{
                PaperProps: {
                    style: {
                        maxHeight: 300,  // Limit height in pixels
                    },
                },
            }}
            sx={{
                textOverflow: "ellipsis",
            }}
        >
            <MenuItem key="solver-global" value="solver-global">Global</MenuItem>
            {state.solverList.map(({ address, labelName }) => (
                <MenuItem key={`solver-${address}`} value={address}>
                        <Typography fontWeight="bold" className="solver-select-label">{labelName}</Typography>
                        <Typography variant="body2" color="text.secondary" className="solver-select-address">
                            {address}
                        </Typography>

                </MenuItem>
            ))}
        </Select>
    </FormControl>

}

export default SolverSelect;