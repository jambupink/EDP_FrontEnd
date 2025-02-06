// OrderSuccess.js
import React from 'react';
import { Box, Typography } from '@mui/material';

function OrderSuccess() {
    return (
        <Box>
            <Typography variant="h5" sx={{ my: 2 }}>
                Your Order was Successfully Placed!
            </Typography>
            <Typography sx={{ my: 2 }}>
                Thank you for shopping with us! We will process your order shortly.
            </Typography>
        </Box>
    );
}

export default OrderSuccess;
