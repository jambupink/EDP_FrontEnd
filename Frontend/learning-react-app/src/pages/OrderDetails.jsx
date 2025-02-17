import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, Grid, Card, CardContent, Button, CircularProgress, Divider } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import http from '../http';

function OrderDetails() {
    const { orderId } = useParams(); // Get the orderId from the URL
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    const location = useLocation();
    const navigate = useNavigate();

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
        <Box display="flex" justifyContent="center" gap={4} p={4} flexDirection="column">
            {/* Order Details Title and Divider */}
            <Box width="100%" sx={{ mb: 2 }}>
                <Typography variant="h5" sx={{ my: 2 }}>
                    Order #{order.orderId} Details
                </Typography>

                {/* Divider below the title */}
                <Divider sx={{ mb: 2 }} />
            </Box>

            {/* Main Content - Flexbox for horizontal layout */}
            <Box display="flex" justifyContent="space-between" width="100%" gap={4}>
                {/* Items Section */}
                <Box flex={2}>
                    <Typography variant="h6" >
                        Items:
                    </Typography>
                    {Array.isArray(order.orderItems) && order.orderItems.length > 0 ? (
                        order.orderItems.map((item, index) => (
                            <Card key={index} sx={{ mb: 2, p: 2, display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                {/* Item Image */}
                                <Box sx={{ flexShrink: 0, marginRight: 2 }}>
                                    <img
                                        src={`${import.meta.env.VITE_FILE_BASE_URL}${item.imageFile}`}
                                        alt={item.productName}
                                        style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 4 }}
                                    />
                                </Box>

                                {/* Item Information */}
                                <Box>
                                    <Typography variant="h6">{item.productName}</Typography>
                                    <Typography color="text.secondary">Size: {item.size}</Typography>
                                    <Typography color="text.secondary">Quantity: {item.quantity}</Typography>
                                    <Typography>${item.price.toFixed(2)}</Typography>
                                </Box>
                            </Card>
                        ))
                    ) : (
                        <Typography>No items in this order.</Typography>
                    )}
                </Box>

                {/* Order Summary Section */}
                <Box flex={1} display="flex" flexDirection="column" gap={3}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6">Order Summary</Typography>
                            <Typography>Total: ${order.totalPrice}</Typography>
                            <Typography>Status: {order.orderStatus}</Typography>
                            <Typography>Order Date: {new Date(order.orderDate).toLocaleDateString()}</Typography>
                            <Typography>Delivery Date: {new Date(order.deliveryDate).toLocaleDateString()}</Typography>
                        </CardContent>
                    </Card>
                </Box>
            </Box>
        </Box>
    );
}

export default OrderDetails;
