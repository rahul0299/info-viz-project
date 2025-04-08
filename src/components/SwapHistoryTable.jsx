import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Paper,
    Avatar,
    Typography,
    Link, Box,
} from "@mui/material";
import TrendingFlatIcon from "@mui/icons-material/TrendingFlat";

const headCells = {
    "timestamp": "Timestamp",
    "txnHash": "Txn Hash",
    "chain": "Chain",
    "protocol": "Protocol",
    "gas": "Gas Used",
    "txnFee": "Txn Fee",
    "swaps": "Swaps",
    "platform": "Platform",
}

const etherscanLogoUrl = "https://miro.medium.com/v2/resize:fit:120/1*t5zblcuBSHkojPuWAS13Xw.png";

const headers = [
   "txnHash",
   "chain",
   "protocol",
   "swaps",
   "platform",
   "gas",
   "txnFee",
   "timestamp"
]

const SwapHistoryTable = ({ data }) => {

    return (
        <Paper variant="outlined" sx={{ maxHeight: 300, overflowY: 'auto', border: "1px solid lightgray", width: "100%" }} >
            <Table>
                <TableHead>
                    <TableRow>
                        {headers.map((hdr) => (
                            <TableCell
                                key={hdr}
                            >
                                    {headCells[hdr]}
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.map((row, index) => (
                        <TableRow key={row.txnHash}>
                            <TableCell>
                                <Box display="flex" alignItems="center" justifyContent="start" gap={1}>
                                    <Avatar src={etherscanLogoUrl} sx={{ width: 24, height: 24 }}/>
                                    <Link href={row.txnLink} target="_blank" rel="noopener">
                                        {row.txnHash.slice(0, 4)}...{row.txnHash.slice(-4)}
                                    </Link>
                                </Box>
                            </TableCell>
                            <TableCell>
                                <Typography>{row.chain}</Typography>
                            </TableCell>
                            <TableCell>
                                <Link href={row.protocol.link} target="_blank" rel="noopener">
                                    <Avatar src={row.protocol.image_url} sx={{ width: 24, height: 24 }}/>
                                </Link>
                            </TableCell>
                            <TableCell>
                                {
                                    row.swaps.map(swap => (
                                        <Box display="flex" alignItems="center" justifyContent="start" gap={1} key={`${index}-${swap.sellToken.symbol}-${swap.buyToken.symbol}`}>
                                            <Avatar src={swap.sellToken.image_url} sx={{ width: 20, height: 20 }} />
                                            <Typography fontSize="small">{`${swap.sellToken.symbol.toUpperCase()} ($${swap.sellAmountInUsd})`}</Typography>

                                            <TrendingFlatIcon />

                                            <Avatar src={swap.buyToken.image_url} sx={{ width: 20, height: 20 }} />
                                            <Typography fontSize="small">{`${swap.buyToken.symbol.toUpperCase()} ($${swap.buyAmountInUsd})`}</Typography>
                                        </Box>
                                    ))
                                }
                            </TableCell>
                            <TableCell>
                                {
                                    row.liquidity_platform.map(platform => (
                                        <Typography fontSize="small" fontWeight="bold" key={`${index}-${platform}`}>{platform}</Typography>
                                    ))
                                }
                            </TableCell>
                            <TableCell>
                                {row.gas}
                            </TableCell>
                            <TableCell>
                                <Box display="flex" flexDirection="column" justifyContent="start">
                                    <Typography fontSize="small" fontWeight="bold">{row.txnFeeInETH} ETH</Typography>
                                    <Typography fontSize="small" fontWeight="bold">{`($${row.txnFeeInUSD})`}</Typography>
                                </Box>
                            </TableCell>
                            <TableCell>
                                {row.timestamp}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Paper>
    );
};

export default SwapHistoryTable;
