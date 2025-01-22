import React from 'react';
import { Box, Typography } from '@mui/material';

function DonationSubmission() {
    return (
        <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Typography variant="h4" gutterBottom>
                Thank You!
            </Typography>
            <Typography variant="body1">
                Thank you for your donation request, we will get back to you soon! Remember to look out for our email regarding your date, time, and location for your drop-off.
            </Typography>
        </Box>
    );
}

export default DonationSubmission;
