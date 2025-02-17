import React, { useState, useEffect, useContext } from "react";
import {
    Box,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    CircularProgress,
    IconButton,
    Collapse
} from "@mui/material";
import http from "../http";
import { ExpandMore, ExpandLess } from "@mui/icons-material";
import UserContext from "../contexts/UserContext";

function AllOrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedOrderId, setExpandedOrderId] = useState(null);
    const { user } = useContext(UserContext);

    useEffect(() => {
        if (user && user.userRoleId === 2) { // Ensure only admins can fetch
            http.get("/orders/all")
                .then((res) => {
                    setOrders(res.data);
                })
                .catch((err) => {
                    console.error("Error fetching orders:", err);
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    }, [user]);

    if (!user || user.userRoleId !== 2) {
        return <Typography variant="h6" color="error">Access Denied</Typography>;
    }

    return (
        <Box sx={{ padding: 3 }}>
            <Typography variant="h4" gutterBottom>
                All Orders (Admin)
            </Typography>

            {loading ? (
                <CircularProgress />
            ) : (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Order ID</TableCell>
                                <TableCell>User ID</TableCell>
                                <TableCell>Date</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Total Items</TableCell>
                                <TableCell align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {orders.length > 0 ? (
                                orders.map((order) => (
                                    <React.Fragment key={order.orderId}>
                                        {/* Order Row */}
                                        <TableRow>
                                            <TableCell>{order.orderId}</TableCell>
                                            <TableCell>{order.userId}</TableCell>
                                            <TableCell>{new Date(order.orderDate).toLocaleString()}</TableCell>
                                            <TableCell>{order.orderStatus}</TableCell>
                                            <TableCell>{order.orderItems.length}</TableCell>
                                            <TableCell align="right">
                                                <IconButton
                                                    onClick={() =>
                                                        setExpandedOrderId(
                                                            expandedOrderId === order.orderId ? null : order.orderId
                                                        )
                                                    }
                                                >
                                                    {expandedOrderId === order.orderId ? <ExpandLess /> : <ExpandMore />}
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>

                                        {/* Expandable Row for Order Items */}
                                        <TableRow>
                                            <TableCell colSpan={6} sx={{ padding: 0 }}>
                                                <Collapse in={expandedOrderId === order.orderId} timeout="auto" unmountOnExit>
                                                    <Box sx={{ margin: 2 }}>
                                                        <Typography variant="h6">Order Items</Typography>
                                                        <Table size="small">
                                                            <TableHead>
                                                                <TableRow>
                                                                    <TableCell>Item Name</TableCell>
                                                                    <TableCell>Quantity</TableCell>
                                                                    <TableCell>Price</TableCell>
                                                                </TableRow>
                                                            </TableHead>
                                                            <TableBody>
                                                                {order.orderItems.map((item, index) => (
                                                                    <TableRow key={index}>
                                                                        <TableCell>{item.productName}</TableCell>
                                                                        <TableCell>{item.quantity}</TableCell>
                                                                        <TableCell>${item.price.toFixed(2)}</TableCell>
                                                                    </TableRow>
                                                                ))}
                                                            </TableBody>
                                                        </Table>
                                                    </Box>
                                                </Collapse>
                                            </TableCell>
                                        </TableRow>
                                    </React.Fragment>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={6} align="center">No orders found</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Box>
    );
}

export default AllOrdersPage;
