import React from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { TextField, Button, Box, Typography } from '@mui/material';
import http from '../../http';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

function ForgotPassword() {
    const navigate = useNavigate();
    const formik = useFormik({
        initialValues: { email: '' },
        validationSchema: yup.object({
            email: yup.string().email('Invalid email').required('Required'),
        }),
        onSubmit: (values) => {
            http.post('/user/forgot-password', values)
                .then(() => {
                    toast.success('Password reset email sent if account exists');
                    setTimeout(() => navigate('/login'), 2000);
                })
                .catch((err) => toast.error(err.response?.data || 'Error'));
        },
    });

    return (
        <Box sx={{ mt: 8, textAlign: 'center' }}>
            <Typography variant="h5">Forgot Password</Typography>
            <Box component="form" onSubmit={formik.handleSubmit} sx={{ maxWidth: 500, mx: 'auto' }}>
                <TextField
                    fullWidth margin="dense"
                    label="Email"
                    name="email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    error={formik.touched.email && Boolean(formik.errors.email)}
                    helperText={formik.touched.email && formik.errors.email}
                />
                <Button type="submit" variant="contained" sx={{ mt: 2 }}>
                    Send Reset Link
                </Button>
            </Box>
            <ToastContainer />
        </Box>
    );
}

export default ForgotPassword