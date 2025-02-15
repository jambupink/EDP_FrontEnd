import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Card, CardContent, Grid, TextField, CircularProgress, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import http from '../http';

function Checkout() {
    const location = useLocation();
    const navigate = useNavigate();
    const { cartItems, userId } = location.state || {};

    const [orderConfirmed, setOrderConfirmed] = useState(false);
    const [orderId, setOrderId] = useState(null); // Store the generated orderId
    const [paymentError, setPaymentError] = useState('');
    const [deliveryError, setDeliveryError] = useState('');

    const [deliveryDate, setDeliveryDate] = useState(null);

    const [paymentDetails, setPaymentDetails] = useState({
        paymentMethod: '',
        cvc: '',
        amount: cartItems.reduce((total, item) => total + item.price, 0) + 5,
        customerName: '',
    });

    const [loading, setLoading] = useState(false);

    const allowedTimes = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00'];

    const isWeekend = (date) => {
        const day = new Date(date).getDay(); // 0 for Sunday, 6 for Saturday
        return day === 0 || day === 6; // Return true if it's a weekend (Saturday or Sunday)
    };

    const handleDeliveryDateChange = (e) => {
        const selectedDate = e.target.value;
        const [selectedDatePart, selectedTimePart] = selectedDate.split('T');

        // Extract time from the selected date (e.g., 14:00, 14:30, etc.)
        const selectedTime = selectedTimePart ? selectedTimePart.slice(0, 5) : '';

        if (isWeekend(selectedDate)) {
            setDeliveryError('Delivery is not available on weekends. Please select a weekday.');
        } else if (!allowedTimes.includes(selectedTime)) {
            setDeliveryError('Please select a valid delivery time between 09:00 and 17:00, with 30-minute intervals.');
        } else {
            setDeliveryDate(selectedDate);
            setDeliveryError('');
        }
    };
    // Handle order confirmation (including orderId)
    const handleOrderAndPaymentSubmit = async () => {
        setPaymentError('');
        
        if (!deliveryDate || deliveryError) {
            setDeliveryError('Please select a valid delivery date and time.');
            return;
        }

        // Validate payment details
        if (!paymentDetails.paymentMethod || !paymentDetails.cardNo || !paymentDetails.cvc || !paymentDetails.customerName) {
            setPaymentError('Please fill in all payment details.');
            return;
        }

        // Validate card number (basic check for 16-digit numbers)
        const cardNumberRegex = /^\d{16}$/;
        if (!cardNumberRegex.test(paymentDetails.cardNo)) {
            setPaymentError('Invalid card number. It should be a 16-digit number.');
            return;
        }

        // Validate CVC (3-digit for most cards, 4-digit for AMEX)
        const cvcRegex = /^\d{3,4}$/;
        if (!cvcRegex.test(paymentDetails.cvc)) {
            setPaymentError('Invalid CVC. It should be a 3 or 4-digit number.');
            return;
        }

        // Validate customer name (only alphabets and spaces allowed)
        const nameRegex = /^[A-Za-z\s]+$/;
        if (!nameRegex.test(paymentDetails.customerName)) {
            setPaymentError('Invalid name. Please enter a valid name without special characters or numbers.');
            return;
        }

        // Validate if any item's quantity exceeds stock
        const outOfStockItems = cartItems.filter(item => item.quantity > item.stock);
        if (outOfStockItems.length > 0) {
            setPaymentError(`The following items exceed available stock: ${outOfStockItems.map(item => `${item.productName} (Stock: ${item.stock}, Ordered: ${item.quantity})`).join(', ')}`);
            return;
        }

        setLoading(true);

        const orderData = {
            userId,
            items: cartItems,
            total: paymentDetails.amount,
            deliveryDate,
        };

        try {
            const orderResponse = await http.post('/orders', orderData);
            const generatedOrderId = orderResponse.data.orderId;

            const paymentData = {
                orderId: generatedOrderId,
                userId,
                paymentMethod: paymentDetails.paymentMethod,
                cvc: paymentDetails.cvc,
                cardNo: paymentDetails.cardNo,
                amount: paymentDetails.amount,
                customerName: paymentDetails.customerName,
                paymentDate: new Date().toISOString(),
                status: 'Pending',
            };

            await http.post('/payment', paymentData);
            navigate('/order-success');
        } catch (err) {
            setError('There was an issue with your order or payment. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };



    // // Handle payment submission using the correct orderId
    // const handlePaymentSubmit = () => {
    //     if (!orderId) {
    //         setError('Order ID is missing. Please confirm the order first.');
    //         return;
    //     }

    //     const paymentData = {
    //         orderId, // Ensure the same orderId is used here for payment
    //         userId,
    //         paymentMethod: paymentDetails.paymentMethod,
    //         cvc: paymentDetails.cvc,
    //         cardNo: paymentDetails.cardNo,
    //         amount: paymentDetails.amount,
    //         customerName: paymentDetails.customerName,
    //         paymentDate: new Date().toISOString(), // Payment date (can be formatted as required)
    //         status: 'Pending', // or any other status based on payment result
    //     };

    //     // Send payment data to the backend
    //     http.post('/payment', paymentData)
    //         .then(() => {
    //             navigate('/order-success'); // Redirect to order success page
    //         })
    //         .catch((err) => {
    //             setError('There was an issue with your payment. Please try again.');
    //             console.error(err);
    //         });
    // };

    useEffect(() => {
        if (!cartItems || cartItems.length === 0) {
            navigate('/cart'); // Redirect to cart if no items are present
        }
    }, [cartItems, navigate]);

    return (
        <Box display="flex" justifyContent="center" gap={4} p={4}>

            <Box flex={2}>
                {cartItems.map((item, index) => (
                    <Card key={index} sx={{ mb: 2, p: 2, display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                        {/* Image on the left */}
                        <Box sx={{ flexShrink: 0, marginRight: 2 }}>
                            <img
                                src={`${import.meta.env.VITE_FILE_BASE_URL}${item.imageFile}`}
                                alt={item.productName}
                                style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 4 }}
                            />
                        </Box>

                        {/* Item information on the right */}
                        <Box>
                            <Typography variant="h6">{item.productName}</Typography>
                            <Typography color="text.secondary">Size: {item.size}</Typography>
                            <Typography color="text.secondary">Quantity: {item.quantity}</Typography>
                            <Typography color="text.secondary">Quantity: {item.stock}</Typography>
                            <Typography>${item.price.toFixed(2)}</Typography>
                        </Box>
                    </Card>
                ))}
            </Box>

            <Box flex={1} display="flex" flexDirection="column" gap={3}>

                <Card>
                    <CardContent>
                        <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>Order Summary</Typography>
                        <Typography>Subtotal: ${cartItems.reduce((acc, item) => acc + item.price, 0).toFixed(2)}</Typography>
                        <Typography>Delivery Fee: $5.00</Typography>
                        <Typography variant="h6">Total: ${paymentDetails.amount.toFixed(2)}</Typography>
                        <TextField
                            label="Select Delivery Date and Time"
                            type="datetime-local"
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                            onChange={handleDeliveryDateChange}
                            sx={{ mt: 2 }}
                            error={!!deliveryError}
                            helperText={deliveryError}
                        />
                    </CardContent>
                </Card>

                <Card>
                    <CardContent>
                        <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>Payment Details</Typography>
                        <InputLabel>Payment Method</InputLabel>
                        <Select
                            value={paymentDetails.paymentMethod}
                            onChange={(e) => setPaymentDetails({ ...paymentDetails, paymentMethod: e.target.value })}
                            label="Payment Method"
                            fullWidth
                            sx={{ mb: 2 }}
                        >
                            <MenuItem value="Credit Card">Credit Card</MenuItem>
                            <MenuItem value="Debit Card">Debit Card</MenuItem>
                        </Select>
                        <TextField fullWidth label="Card Number" name="cardNo" onChange={(e) => setPaymentDetails({ ...paymentDetails, cardNo: e.target.value })} sx={{ mb: 2 }} />
                        <TextField fullWidth label="CVC" name="cvc" onChange={(e) => setPaymentDetails({ ...paymentDetails, cvc: e.target.value })} sx={{ mb: 2 }} />
                        <TextField fullWidth label="Name on Card" name="customerName" onChange={(e) => setPaymentDetails({ ...paymentDetails, customerName: e.target.value })} sx={{ mb: 2 }} />
                        {paymentError && <Typography color="error">{paymentError}</Typography>}
                    </CardContent>
                </Card>


                <Button variant="contained" color="primary" fullWidth onClick={handleOrderAndPaymentSubmit} disabled={loading}>
                    {loading ? <CircularProgress size={24} color="inherit" /> : "Confirm & Pay"}
                </Button>





            </Box>


            {orderConfirmed && <Typography sx={{ mt: 2 }}>Order confirmed! Now entering payment...</Typography>}
        </Box>
    );
}

export default Checkout;
