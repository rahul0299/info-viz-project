import {Avatar, Box, FormControl, InputLabel, MenuItem, Select, Typography} from "@mui/material";
import TrendingFlatIcon from "@mui/icons-material/TrendingFlat";

const SolverDashboardTokenPairSelect = ({ action, tokenPairs, selectedPair, defaultOption = null}) => {

    return <FormControl sx={{ minWidth: 120 }} fullWidth size="small">
        <InputLabel id="buy-token-label">Token Pair</InputLabel>
        <Select
            variant="outlined"
            labelId={`surplus-token-select-label`}
            id={`surplus-token-select`}
            label="Token Pair"
            size="small"
            MenuProps={{
                PaperProps: {
                    style: {
                        maxHeight: 150,  // Limit height in pixels
                    },
                },
            }}
            value={selectedPair || ""}
            onChange={(e) => action(e.target.value)}
            renderValue={value => {
                if (defaultOption && value === defaultOption) {
                    return <Typography width="100%" textAlign="left">{defaultOption}</Typography>
                }

                return value && <Box display="flex" alignItems="center" justifyContent="start" gap="10px">
                    <Avatar src={value.sellToken.image_url} sx={{ width: 20, height: 20 }} />
                    <Typography fontWeight="bold">{value.sellToken.name}</Typography>

                    <TrendingFlatIcon />

                    <Avatar src={value.buyToken.image_url} sx={{ width: 20, height: 20 }} />
                    <Typography fontWeight="bold">{value.buyToken.name}</Typography>
                </Box>
            }}
        >
            {defaultOption && <MenuItem key={`surplus-token-default`} value={defaultOption}>{defaultOption}</MenuItem>}
            {
                tokenPairs.map(pair => (
                    <MenuItem key={`surplus-token-${pair.buyToken.address}-${pair.sellToken.address}`} value={pair}>
                        <Box display="flex" alignItems="center" gap="10px">
                            <Avatar src={pair.sellToken.image_url} sx={{ width: 20, height: 20 }} />
                            <Typography fontWeight="bold">{pair.sellToken.name}</Typography>

                            <TrendingFlatIcon />

                            <Avatar src={pair.buyToken.image_url} sx={{ width: 20, height: 20 }} />
                            <Typography fontWeight="bold">{pair.buyToken.name}</Typography>

                        </Box>
                    </MenuItem>
                ))
            }
        </Select>
    </FormControl>
}

export default SolverDashboardTokenPairSelect;