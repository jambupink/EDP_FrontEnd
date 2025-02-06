import React, { useState, useEffect, useContext } from 'react';
import {
    Box,
    Typography,
    Grid,
    Button,
    Card,
    CardContent,
    Divider,
    CardActions,
} from '@mui/material';
import http from '../http';
import UserContext from '../contexts/UserContext';
import { Link } from 'react-router-dom';

function Orders() {
    const [orders, setOrders] = useState([]);
    const { user } = useContext(UserContext);

    const fetchOrders = () => {
        if (user && user.id) {
            http.get(`/orders/${user.id}`)
                .then((res) => {
                    setOrders(res.data);
                })
                .catch((err) => {
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
        <Box sx={{ padding: 3 }}>
            <Typography variant="h4" gutterBottom>
                Your Orders
            </Typography>

            <Divider sx={{ mb: 3 }} />

            {orders.length === 0 ? (
                <Typography variant="h6" color="text.secondary">
                    You have no orders yet.
                </Typography>
            ) : (
                <Grid container spacing={3}>
                    {orders.map((order) => (
                        <Grid item xs={12} sm={6} md={4} key={order.orderId}>
                            <Card elevation={3} sx={{ borderRadius: 2 }}>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        Order #{order.orderId}
                                    </Typography>
                                    <Typography variant="body1" color="text.secondary">
                                        Placed on: {new Date(order.orderDate).toLocaleDateString()}
                                    </Typography>
                                    <Typography variant="body1" color="text.secondary">
                                        Total: <strong>${order.totalPrice.toFixed(2)}</strong>
                                    </Typography>
                                    <Typography variant="body1" color={order.orderStatus === 'Delivered' ? 'green' : 'orange'}>
                                        Status: {order.orderStatus || 'Pending'}
                                    </Typography>
                                </CardContent>
                                <Divider />
                                <CardActions sx={{ justifyContent: 'flex-end', padding: 2 }}>
                                    <Link to={`/orders/detail/${order.orderId}`} style={{ textDecoration: 'none' }}>
                                        <Button variant="contained" color="primary">
                                            View Details
                                        </Button>
                                    </Link>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Box>
    );
}

export default Orders;
