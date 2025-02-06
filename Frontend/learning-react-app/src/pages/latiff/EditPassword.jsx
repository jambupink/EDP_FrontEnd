import { Box, Typography, TextField, Button, Grid2 as Grid } from '@mui/material';
import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import * as yup from 'yup';
import http from '../../http';
import { ToastContainer, toast } from 'react-toastify';

function EditPassword() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [user, setUser] = useState({
        password: ""
    })
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        http.get(`user/${id}`).then((res) => {
            setUser(res.data);
            setLoading(false);
        });
    }, [id]);

    const formik = useFormik({
        initialValues: user,
        enableReinitialize: true,
        validationSchema: yup.object({
            password: yup.string().trim()
                .min(8, 'Password must be at least 8 characters')
                .max(50, 'Password must be at most 50 characters')
                .required('Password is required')
                .matches(/^(?=.*[a-zA-Z])(?=.*[0-9]).{8,}$/,
                    "Password at least 1 letter and 1 number"),
            confirmPassword: yup.string().trim()
                .required('Confirm password is required')
                .oneOf([yup.ref('newPassword')], 'Passwords must match'),
            newPassword: yup.string().trim()
                .min(8, 'Password must be at least 8 characters')
                .max(50, 'Password must be at most 50 characters')
                .required('Password is required')
                .matches(/^(?=.*[a-zA-Z])(?=.*[0-9]).{8,}$/,
                    "Password at least 1 letter and 1 number"),
        }),
        onSubmit: (data) => {
            data.password = data.password;
            data.newPassword = data.newPassword;

            http.put(`/user/password/${id}`, data)
                .then((res) => {
                    console.log(res.data);
                    toast.success("Password change successfully")
                    // navigate(0);
                });

        }
    });
    return (
        <Box>
            <Typography>Change Password</Typography>
            {
                !loading && (
                    <Box component="form" onSubmit={formik.handleSubmit}>
                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12, md: 6, lg: 8 }}>
                                <TextField
                                    fullWidth margin="dense" autoComplete='off' type='password'
                                    label="password"
                                    name="password"
                                    value={formik.values.password}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.password && Boolean(formik.errors.password)}
                                    helperText={formik.touched.password && Boolean(formik.errors.password)}
                                />
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
                                    label="Confirm Password"
                                    name="confirmPassword"
                                    value={formik.values.confirmPassword}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
                                    helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
                                />
                               
                            </Grid>
                        </Grid>
                        <Box sx={{ mt: 2 }}>
                            <Button variant="contained" type="submit">
                                Update
                            </Button>
                        </Box>
                    </Box>
                )
            }
            <ToastContainer/>
        </Box>
    )
}

export default EditPassword