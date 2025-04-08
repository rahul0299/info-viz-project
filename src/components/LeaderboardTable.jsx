import React, { useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TableSortLabel,
    Paper,
    Typography,
    Box,
} from "@mui/material";
import {formatNumber} from "../utils.jsx";

const headCells = [
    { id: "rank", label: "Ranking", allowSorting: false },
    { id: "solver", label: "Solver", allowSorting: false },
    { id: "total_orders", label: "Total Orders", allowSorting: true },
    { id: "total_auctions", label: "Total Auctions", allowSorting: true },
    { id: "total_volume", label: "Total Volume", allowSorting: true },
    { id: "avg_volume", label: "Avg Volume", allowSorting: true },
    { id: "avg_ranking", label: "Avg Ranking", allowSorting: true },
];

function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) return -1;
    if (b[orderBy] > a[orderBy]) return 1;
    return 0;
}

function getComparator(order, orderBy) {
    return order === "desc"
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

function compressAddress(address) {
    return address.slice(0, 4) + "...." + address.slice(-4);
}

const LeaderboardTable = ({ data }) => {
    const [order, setOrder] = useState("asc");
    const [orderBy, setOrderBy] = useState("timestamp");

    const handleRequestSort = (property) => {
        const isAsc = orderBy === property && order === "asc";
        setOrder(isAsc ? "desc" : "asc");
        setOrderBy(property);
    };


    const sortedData = [...data].sort(getComparator(order, orderBy));

    return (
        <Paper variant="outlined" sx={{ height: "100%", width: "100%", overflowY: "scroll" }}>
            <Table stickyHeader>
                <TableHead>
                    <TableRow>
                        {headCells.map((headCell) => (
                            <TableCell
                                key={headCell.id}
                                sortDirection={orderBy === headCell.id ? order : false}
                            >
                                {headCell.allowSorting ? (
                                    <TableSortLabel
                                        active={orderBy === headCell.id}
                                        direction={orderBy === headCell.id ? order : "asc"}
                                        onClick={() => handleRequestSort(headCell.id)}
                                    >
                                        {headCell.label}
                                    </TableSortLabel>
                                ) : (
                                    headCell.label
                                )}
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {sortedData.map((row, index) => (
                        <TableRow key={`leaderboard-${row.solver.address}`}>
                            <TableCell>
                                {index+1}
                            </TableCell>
                            <TableCell>
                                <Box display="flex" justifyContent="start" gap={1}>
                                    <Typography fontWeight="bold">{row.solver.name}</Typography>
                                    <Typography color="textSecondary">{`(${compressAddress(row.solver.address)})`}</Typography>
                                </Box>
                            </TableCell>
                            <TableCell>
                                {row.total_orders}
                            </TableCell>
                            <TableCell>
                                {row.total_auctions}
                            </TableCell>
                            <TableCell>
                                {formatNumber(row.total_volume)}
                            </TableCell>
                            <TableCell>
                                {formatNumber(row.avg_volume)}
                            </TableCell>
                            <TableCell>
                                {row.avg_ranking}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Paper>
    );
};

export default LeaderboardTable;
