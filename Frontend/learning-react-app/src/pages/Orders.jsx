import React, { useState, useEffect, useContext } from 'react';
import { Box, Typography, Grid, Button, Card, CardContent } from '@mui/material';
import http from '../http';
import UserContext from '../contexts/UserContext';
import { Link } from 'react-router-dom';

function Orders() {
    const [orders, setOrders] = useState([]);
    const { user } = useContext(UserContext); // Get the current user from context

    const fetchOrders = () => {
        if (user && user.id) {
            // Make an API call to fetch all orders for the logged-in user
            http.get(`/orders/${user.id}`).then((res) => {
                setOrders(res.data);
            }).catch((err) => {
                console.error("Error fetching orders:", err);
            });
        }
    };

    useEffect(() => {
        if (user && user.id) {
            fetchOrders();
        }
    }, [user]);

    return (
        <Box>
            <Typography variant="h5" sx={{ my: 2 }}>
                Your Orders
            </Typography>

            {orders.length === 0 ? (
                <Typography>No orders found.</Typography>
            ) : (
                <Grid container spacing={2}>
                    {orders.map((order) => (
                        <Grid item xs={12} md={6} key={order.orderId}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6">Order #{order.orderId}</Typography>
                                    <Typography color="text.secondary">Total: ${order.totalPrice}</Typography>
                                    <Typography color="text.secondary">
                                        {order.status ? `Status: ${order.status}` : "Status: Pending"}
                                    </Typography>
                                    <Box sx={{ mt: 2 }}>
                                        <Link to={`/orders/detail/${order.orderId}`}>
                                            <Button variant="contained" color="primary">
                                                View Details
                                            </Button>
                                        </Link>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Box>
    );
}

export default Orders;
