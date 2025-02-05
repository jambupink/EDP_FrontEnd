import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Button, Container, TextField, Typography } from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import http from '../../../http';

function RolesEdit() {
    const { id } = useParams(); 
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    const [role, setRole] = useState({
        role: '',
        description: '',
    });

    useEffect(() => {
        http.get(`/userrole/${id}`)
            .then((res) => {
                setRole(res.data);
                setLoading(false);
            })
            .catch((err) => console.error("Error fetching role:", err));
    }, [id]);

    const formik = useFormik({
        initialValues: role,
        enableReinitialize: true, 
        validationSchema: yup.object({
            role: yup.string().min(3).max(50).required("Role name is required"),
            description: yup.string().min(5).max(200).required("Description is required"),
        }),
        onSubmit: (values) => {
            http.put(`/userrole/${id}`, values)
                .then(() => {
                    alert("Role updated successfully!");
                    navigate("/");
                })
                .catch((err) => console.error("Error updating role:", err));
        }
    });

    return (
        <Container maxWidth="sm">
            <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
                Edit Role
            </Typography>

            {!loading && (
                <Box component="form" onSubmit={formik.handleSubmit}>
                    <TextField
                        fullWidth margin="dense"
                        label="Role Name"
                        name="role"
                        value={formik.values.role}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.role && Boolean(formik.errors.role)}
                        helperText={formik.touched.role && formik.errors.role}
                    />

                    <TextField
                        fullWidth margin="dense"
                        label="Description"
                        name="description"
                        value={formik.values.description}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.description && Boolean(formik.errors.description)}
                        helperText={formik.touched.description && formik.errors.description}
                    />

                    <Box sx={{ mt: 2, display: "flex", justifyContent: "space-between" }}>
                        <Button variant="contained" color="primary" type="submit">
                            Update Role
                        </Button>
                        <Button variant="outlined" color="error" onClick={() => navigate("/")}>
                            Cancel
                        </Button>
                    </Box>
                </Box>
            )}
        </Container>
    );
}

export default RolesEdit;
