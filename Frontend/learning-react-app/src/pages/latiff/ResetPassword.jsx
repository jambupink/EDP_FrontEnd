import React from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { TextField, Button, Box, Typography } from '@mui/material';
import { useSearchParams, useNavigate } from 'react-router-dom';
import http from '../../http';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ResetPassword() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: { newPassword: '', confirmPassword: '' },
        enableReinitialize: true,
        validationSchema: yup.object({
            newPassword: yup.string().trim()
                .min(12, 'Password must be at least 12 characters')
                .max(50, 'Password must be at most 50 characters')
                .required('Password is required')
                .matches(/[A-Z]/, "Must include at least one uppercase letter")
                .matches(/[a-z]/, "Must include at least one lowercase letter")
                .matches(/[0-9]/, "Must include at least one number")
                .matches(/[@$!%*?&]/, "Must include at least one special character (@, $, !, %, *, ?, &)"),
            confirmPassword: yup.string().trim()
                .required('Confirm new password is required')
                .oneOf([yup.ref('newPassword')], 'Passwords must match'),
        }),
        onSubmit: (data) => {
            http.post('/user/reset-password', {
                token: token,
                newPassword: data.newPassword
            }).then(() => {
                toast.success('Password reset successfully');
                setTimeout(() => navigate('/login'), 2000);
            }).catch((err) => toast.error(err.response?.data || 'Error'));
        },
    });

    return (
        <Box sx={{ mt: 8, textAlign: 'center' }}>
            <Typography variant="h5">Reset Password</Typography>
            <Box component="form" onSubmit={formik.handleSubmit} sx={{ maxWidth: 500, mx: 'auto' }}>
                <TextField
                    fullWidth margin="dense" autoComplete="off" type="password"
                    label="New Password"
                    name="newPassword"
                    value={formik.values.newPassword}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.newPassword && Boolean(formik.errors.newPassword)}
                    helperText={formik.touched.newPassword && formik.errors.newPassword}
                />
                <TextField
                    fullWidth margin="dense" autoComplete="off" type="password"
                    label="Confirm New Password"
                    name="confirmPassword"
                    value={formik.values.confirmPassword}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
                    helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
                />
                <Button type="submit" variant="contained" sx={{ mt: 2 }}>
                    Reset Password
                </Button>
            </Box>
            <ToastContainer />
        </Box>
    );
}

export default ResetPassword