import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Card, CardContent, Grid, TextField, CircularProgress, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import http from '../http';

function Checkout() {
    const location = useLocation();
    const navigate = useNavigate();
    const { cartItems, userId } = location.state || {};
    
    const [orderConfirmed, setOrderConfirmed] = useState(false);
    const [orderId, setOrderId] = useState(null); // Store the generated orderId
    const [error, setError] = useState('');
    
    const [paymentDetails, setPaymentDetails] = useState({
        paymentMethod: '',
        cvc: '',
        amount: cartItems.reduce((total, item) => total + item.price, 0),
        customerName: '',
    });
    
    const [loading, setLoading] = useState(false);

    // Handle order confirmation (including orderId)
    const handleOrderSubmit = () => {
        const orderData = {
            userId,
            items: cartItems,
            total: paymentDetails.amount,
        };

        setLoading(true);

        // Send order data to the backend to create the order
        http.post('/orders', orderData)
            .then((response) => {
                // Assuming the backend returns the orderId after order creation
                setOrderId(response.data.orderId); // Store the generated orderId
                setOrderConfirmed(true);
                setLoading(false);
            })
            .catch((err) => {
                setError('There was an issue with your order. Please try again.');
                setLoading(false);
                console.error(err);
            });
    };

    // Handle payment submission using the correct orderId
    const handlePaymentSubmit = () => {
        if (!orderId) {
            setError('Order ID is missing. Please confirm the order first.');
            return;
        }

        const paymentData = {
            orderId, // Ensure the same orderId is used here for payment
            userId,
            paymentMethod: paymentDetails.paymentMethod,
            cvc: paymentDetails.cvc,
            cardNo: paymentDetails.cardNo,
            amount: paymentDetails.amount,
            customerName: paymentDetails.customerName,
            paymentDate: new Date().toISOString(), // Payment date (can be formatted as required)
            status: 'Pending', // or any other status based on payment result
        };

        // Send payment data to the backend
        http.post('/payment', paymentData)
            .then(() => {
                navigate('/order-success'); // Redirect to order success page
            })
            .catch((err) => {
                setError('There was an issue with your payment. Please try again.');
                console.error(err);
            });
    };

    useEffect(() => {
        if (!cartItems || cartItems.length === 0) {
            navigate('/cart'); // Redirect to cart if no items are present
        }
    }, [cartItems, navigate]);

    return (
        <Box>
            <Typography variant="h5" sx={{ my: 2 }}>
                Checkout
            </Typography>

            {error && <Typography color="error">{error}</Typography>}

            <Grid container spacing={2}>
                {cartItems.map((item) => (
                    <Grid item xs={12} md={6} lg={4} key={item.id}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6">{item.productName}</Typography>
                                <Typography color="text.secondary">Size: {item.size}</Typography>
                                <Typography color="text.secondary">Quantity: {item.quantity}</Typography>
                                <Typography color="text.secondary">Price: ${item.price}</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Box sx={{ mt: 3 }}>
                <Button variant="contained" color="primary" onClick={handleOrderSubmit} disabled={loading}>
                    {loading ? <CircularProgress size={24} color="inherit" /> : 'Confirm Order'}
                </Button>
            </Box>

            {orderConfirmed && (
                <Box sx={{ mt: 3 }}>
                    <Typography variant="h6">Payment Information</Typography>
                    
                    {/* Payment Method Dropdown */}
                    <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel>Payment Method</InputLabel>
                        <Select
                            value={paymentDetails.paymentMethod}
                            onChange={(e) => setPaymentDetails({ ...paymentDetails, paymentMethod: e.target.value })}
                            label="Payment Method"
                        >
                            <MenuItem value="Credit Card">Credit Card</MenuItem>
                            <MenuItem value="Debit Card">Debit Card</MenuItem>
                        </Select>
                    </FormControl>

                    <TextField
                        label="Customer Name"
                        variant="outlined"
                        fullWidth
                        value={paymentDetails.customerName}
                        onChange={(e) => setPaymentDetails({ ...paymentDetails, customerName: e.target.value })}
                        sx={{ mb: 2 }}
                    />
                    
                    <TextField
                        label="CVC"
                        variant="outlined"
                        fullWidth
                        value={paymentDetails.cvc}
                        onChange={(e) => setPaymentDetails({ ...paymentDetails, cvc: e.target.value })}
                        sx={{ mb: 2 }}
                    />

                    <TextField
                        label="Card number"
                        variant="outlined"
                        fullWidth
                        value={paymentDetails.cardNo}
                        onChange={(e) => setPaymentDetails({ ...paymentDetails, cardNo: e.target.value })}
                        sx={{ mb: 2 }}
                    />
                    
                    <Box sx={{ mt: 2 }}>
                        <Button variant="contained" color="primary" onClick={handlePaymentSubmit}>
                            Submit Payment
                        </Button>
                    </Box>
                </Box>
            )}

            {orderConfirmed && <Typography sx={{ mt: 2 }}>Order confirmed! Now entering payment...</Typography>}
        </Box>
    );
}

export default Checkout;
