import { Box, Typography, TextField, Button, Grid2 as Grid, FormControl, InputLabel, Select, MenuItem, FormHelperText } from '@mui/material';
import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import * as yup from 'yup';
import http from '../../http';
import { ToastContainer, toast } from 'react-toastify';

function EditAccount() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [user, setUser] = useState({
        name: "",
        email: "",
        password: "",
        gender: "",
        mobileNumber: "",
        address: "",
    })
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        http.get(`user/${id}`).then((res) => {
            setUser(res.data);
            setLoading(false);
        });
    }, []);

    const formik = useFormik({
        initialValues: user,
        enableReinitialize: true,
        validationSchema: yup.object({
            name: yup.string().trim()
                .min(3, 'Name must be at least 3 characters')
                .max(50, 'Name must be at most 50 characters')
                .required('Name is required')
                .matches(/^[a-zA-Z '-,.]+$/,
                    "Name only allow letters, spaces and characters: ' - , ."),
            email: yup.string().trim()
                .email('Enter a valid email')
                .max(50, 'Email must be at most 50 characters')
                .required('Email is required'),
            password: yup.yup.string().trim()
                .min(12, 'Password must be at least 12 characters')
                .max(50, 'Password must be at most 50 characters')
                .nullable()
                .matches(/[A-Z]/, "Must include at least one uppercase letter")
                .matches(/[a-z]/, "Must include at least one lowercase letter")
                .matches(/[0-9]/, "Must include at least one number")
                .matches(/[@$!%*?&]/, "Must include at least one special character (@, $, !, %, *, ?, &)"),
            gender: yup.string().nullable(),
            mobileNumber: yup.string().trim()
                .matches(/^\d+$/, "Mobile number must contain only digits") 
                .min(8, "Mobile number must be at least 8 digits")
                .max(15, "Mobile number must be at most 15 digits") 
                .nullable(),
            address: yup.string().trim()
                .min(3, 'Address must be at least 3 characters')
                .max(200, 'Address must be at most 200 characters')
                .nullable(),
        }),
        onSubmit: (data) => {
            console.log(data);
            data.name = data.name.trim();
            data.email = data.email.trim();
            data.password = data.password;
            data.gender = toTrimOrNotToTrim(data.gender)
            data.mobileNumber = toTrimOrNotToTrim(data.mobileNumber);
            data.address = toTrimOrNotToTrim(data.address)

            http.put(`/user/${id}`, data)
                .then((res) => {
                    console.log(res.data);
                    toast.success("Account successfully edited")
                });

        }
    });
    function toTrimOrNotToTrim(value, fallback = undefined) {
        return value && value.trim() !== "" ? value.trim() : fallback;
    }

    return (
        <Box>
            <Typography>Edit Account Details</Typography>
            {
                !loading && (
                    <Box component="form" onSubmit={formik.handleSubmit}>
                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12, md: 6, lg: 8 }}>
                                <TextField
                                    fullWidth margin="dense" autoComplete='off'
                                    label="name"
                                    name="name"
                                    value={formik.values.name}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.name && Boolean(formik.errors.name)}
                                    helperText={formik.touched.name && Boolean(formik.errors.name)}
                                />
                                <TextField
                                    fullWidth margin="dense" autoComplete='off'
                                    label="email"
                                    name="email"
                                    value={formik.values.email}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.email && Boolean(formik.errors.email)}
                                    helperText={formik.touched.email && Boolean(formik.errors.email)}
                                />
                                <FormControl fullWidth margin="dense"
                                    error={formik.touched.gender && Boolean(formik.errors.gender)}>
                                    <InputLabel>gender</InputLabel>
                                    <Select label="gender"
                                        name="gender"
                                        value={formik.values.gender}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    >
                                        <MenuItem value={'male'}>Male</MenuItem>
                                        <MenuItem value={'female'}>Female</MenuItem>
                                        <MenuItem value={'unknown'}>Unknown</MenuItem>
                                        <MenuItem value={'others'}>Others</MenuItem>
                                    </Select>
                                    <FormHelperText>{formik.touched.gender && formik.errors.gender}</FormHelperText>
                                </FormControl>
                                {/* <TextField
                                fullWidth margin="dense" autoComplete='off'
                                label="gender"
                                name= "gender"
                                value={formik.values.gender}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.gender && Boolean(formik.errors.gender)}
                                helperText={formik.touched.gender && Boolean(formik.errors.gender)}
                            /> */}
                                <TextField
                                    fullWidth margin="dense" autoComplete='off'
                                    label="mobileNumber"
                                    name="mobileNumber"
                                    value={formik.values.mobileNumber}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.mobileNumber && Boolean(formik.errors.mobileNumber)}
                                    helperText={formik.touched.mobileNumber && Boolean(formik.errors.mobileNumber)}
                                />
                                <TextField
                                    fullWidth margin="dense" autoComplete='off'
                                    label="address"
                                    name="address"
                                    value={formik.values.address}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.address && Boolean(formik.errors.address)}
                                    helperText={formik.touched.address && Boolean(formik.errors.address)}
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
            <ToastContainer />
        </Box>
    )
}

export default EditAccount