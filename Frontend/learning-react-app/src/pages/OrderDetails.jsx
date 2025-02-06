import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, Grid, Card, CardContent } from '@mui/material';
import http from '../http';

function OrderDetails() {
    const { orderId } = useParams(); // Get the orderId from the URL
    const [order, setOrder] = useState(null);

    useEffect(() => {
        // Fetch the order details from the backend
        http.get(`/orders/detail/${orderId}`)
            .then((res) => {
                setOrder(res.data);
            })
            .catch((err) => {
                console.error("Error fetching order details:", err);
            });
    }, [orderId]);

    if (!order) {
        return <Typography>Loading order details...</Typography>;
    }

    return (
        <Box>
            <Typography variant="h5" sx={{ my: 2 }}>
                Order #{order.orderId} Details
            </Typography>

            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6">Order Summary</Typography>
                            <Typography>Total: ${order.totalPrice}</Typography>
                            <Typography>Status: {order.orderStatus}</Typography>
                            <Typography>Order Date: {new Date(order.orderDate).toLocaleDateString()}</Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12}>
                    <Typography variant="h6" sx={{ mt: 2 }}>
                        Items:
                    </Typography>
                    <Grid container spacing={2}>
                        {Array.isArray(order.orderItems) && order.orderItems.length > 0 ? (
                            order.orderItems.map((item, index) => (
                                <Grid item xs={12} md={6} key={index}>
                                    <Card>
                                        <CardContent>
                                            <Typography>{item.productName}</Typography>
                                            <Typography>Size: {item.size}</Typography>
                                            <Typography>Quantity: {item.quantity}</Typography>
                                            <Typography>Price: ${item.price}</Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))
                        ) : (
                            <Typography>No items in this order.</Typography>
                        )}
                    </Grid>
                </Grid>
            </Grid>
        </Box>
    );
}

export default OrderDetails;
