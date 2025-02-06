import { Box, Button, Container, FormControl, FormHelperText, InputLabel, MenuItem, Select, Switch, TextField, Typography } from '@mui/material'
import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import * as yup from 'yup';
import http from '../../../http'
import { ToastContainer, toast } from 'react-toastify';

function UsersEdit() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    const [user, setUser] = useState({
        name: '',
        email: '',
        password: '',
        gender: '',
        mobileNumber: '',
        address: '',
        isEmailConfirmed: false,
        points: 0,
        userRoleId: 1
    });

    useEffect(() => {
        http.get(`/user/${id}`)
            .then((res) => {
                setUser(res.data);
                setLoading(false);
            })
            .catch((err) => console.error("Error fetching user:", err));
    }, [id]);

    // Initialize Formik
    const formik = useFormik({
        initialValues: user,
        enableReinitialize: true,
        validationSchema: yup.object({
            name: yup.string().min(3).max(50).required("Name is required"),
            email: yup.string().email("Invalid email").max(50).required("Email is required"),
            password: yup.string().min(8, "At least 8 characters").nullable(),
            gender: yup.string().nullable(),
            mobileNumber: yup.string().min(3).max(20).nullable(),
            address: yup.string().min(3).max(200).nullable(),
            points: yup.number().min(0, "Points must be positive").required(),
            userRoleId: yup.number().required("User role is required")
        }),
        onSubmit: (data) => {
            data.name = data.name.trim();
            data.email = data.email.trim();
            data.gender = toTrimOrNotToTrim(data.gender);
            data.mobileNumber = toTrimOrNotToTrim(data.mobileNumber);
            data.address = toTrimOrNotToTrim(data.address);
            console.log(data)
            http.put(`/user/${id}`, data)
                .then(() => {
                    toast.success("User Edited successfully");
                    // setTimeout(() => {
                    //     navigate(0);
                    // }, 2000);
                })
                .catch((err) => console.error("Error updating user:", err));
        }

    });

    function toTrimOrNotToTrim(value, fallback = undefined) {
        return value && value.trim() !== "" ? value.trim() : fallback;
    }

    return (
        <Container maxWidth="md">
            <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>Edit User</Typography>

            {!loading && (
                <Box component="form" onSubmit={formik.handleSubmit}>
                    <TextField
                        fullWidth margin="dense"
                        label="Name"
                        name="name"
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.name && Boolean(formik.errors.name)}
                        helperText={formik.touched.name && formik.errors.name}
                    />

                    <TextField
                        fullWidth margin="dense"
                        label="Email"
                        name="email"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.email && Boolean(formik.errors.email)}
                        helperText={formik.touched.email && formik.errors.email}
                    />

                    <TextField
                        fullWidth margin="dense"
                        label="Password"
                        type="password"
                        name="password"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.password && Boolean(formik.errors.password)}
                        helperText="Leave blank to keep current password"
                    />

                    <FormControl fullWidth margin="dense">
                        <InputLabel>Gender</InputLabel>
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

                    <TextField
                        fullWidth margin="dense"
                        label="Mobile Number"
                        name="mobileNumber"
                        value={formik.values.mobileNumber}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.mobileNumber && Boolean(formik.errors.mobileNumber)}
                        helperText={formik.touched.mobileNumber && formik.errors.mobileNumber}
                    />

                    <TextField
                        fullWidth margin="dense"
                        label="Address"
                        name="address"
                        value={formik.values.address}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.address && Boolean(formik.errors.address)}
                        helperText={formik.touched.address && formik.errors.address}
                    />

                    <FormControl fullWidth margin="dense">
                        <InputLabel>User Role</InputLabel>
                        <Select label="userRoleId"
                            name="userRoleId"
                            value={formik.values.userRoleId}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        >
                            <MenuItem value={1}>User</MenuItem>
                            <MenuItem value={2}>Admin</MenuItem>
                        </Select>
                        <FormHelperText>{formik.touched.userRoleId && formik.errors.userRoleId}</FormHelperText>
                    </FormControl>

                    <FormControl fullWidth margin="dense">
                        <Typography>Email Confirmed</Typography>
                        <Switch
                            name="isEmailConfirmed"
                            checked={formik.values.isEmailConfirmed}
                            onChange={formik.handleChange}
                        />
                    </FormControl>

                    <TextField
                        fullWidth margin="dense"
                        label="Points"
                        type="number"
                        name="points"
                        value={formik.values.points}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.points && Boolean(formik.errors.points)}
                        helperText={formik.touched.points && formik.errors.points}
                    />

                    <Box sx={{ mt: 2, display: "flex", justifyContent: "space-between" }}>
                        <Button variant="contained" color="primary" type="submit">
                            Update User
                        </Button>
                        <Button variant="outlined" color="error" onClick={() => navigate("/")}>
                            Cancel
                        </Button>
                    </Box>
                </Box>
            )}
            <ToastContainer />
        </Container>
    )
}

export default UsersEdit