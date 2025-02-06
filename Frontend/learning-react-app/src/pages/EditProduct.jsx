// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { Box, Typography, TextField, Button, Grid2 as Grid, FormControl, FormControlLabel, Checkbox, FormHelperText, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
// import http from '../http';
// import { useFormik } from 'formik';
// import * as yup from 'yup';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// function EditProduct() {
//     const { id } = useParams();
//     const navigate = useNavigate();
//     const [product, setProduct] = useState({
//         productName: "",
//         description: "",
//         isArchived: false
//     });
//     onst [imageFile, setImageFile] = useState(null);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         http.get(`/product/${id}`).then((res) => {
//             setProduct(res.data);
//             setImageFile(res.data.imageFile);
//             setLoading(false);
//         });
//     }, []);

//     const formik = useFormik({
//         initialValues: product,
//         enableReinitialize: true,
//         validationSchema: yup.object({
//             productName: yup.string().trim()
//                 .min(3, 'Product name must be at least 3 characters')
//                 .max(100, 'Product name must be at most 100 characters')
//                 .required('Product name is required'),
//             description: yup.string().trim()
//                 .min(3, 'Description must be at least 3 characters')
//                 .max(300, 'Description must be at most 300 characters')
//                 .required('Description is required'),
//             isArchived: yup.boolean()
//         }),
//         onSubmit: (data) => {
//             if (imageFile) {
//                 data.imageFile = imageFile;
//             }
//             data.productName = data.productName.trim();
//             data.description = data.description.trim();
//             http.put(`/product/${id}`, data)
//                 .then((res) => {
//                     console.log(res.data);
//                     navigate("/products");
//                 });
//         }
//     });

//     const onFileChange = (e) => {
//         let file = e.target.files[0];
//         if (file) {
//             if (file.size > 1024 * 1024) {
//                 toast.error('Maximum file size is 1MB');
//                 return;
//             }
//             let formData = new FormData();
//             formData.append('file', file);
//             http.post('/file/upload', formData, {
//                 headers: {
//                     'Content-Type': 'multipart/form-data'
//                 }
//             })
//                 .then((res) => {
//                     setImageFile(res.data.filename);
//                 })
//                 .catch(function (error) {
//                     console.log(error.response);
//                 });
//         }
//     };

//     const [open, setOpen] = useState(false);
//     const handleOpen = () => {
//         setOpen(true);
//     };
//     const handleClose = () => {
//         setOpen(false);
//     };
//     const deleteProduct = () => {
//         http.delete(`/product/${id}`)
//             .then((res) => {
//                 console.log(res.data);
//                 navigate("/products");
//             });
//     };

//     return (
//         <Box>
//             <Typography variant="h5" sx={{ my: 2 }}>
//                 Edit Product
//             </Typography>
//             {
//                 !loading && (
//                     <Box component="form" onSubmit={formik.handleSubmit}>
//                         <Grid container spacing={2}>
//                             <Grid size={{xs:12, md:6, lg:8}}>
//                                 <TextField
//                                     fullWidth margin="dense" autoComplete="off"
//                                     label="Product Name"
//                                     name="productName"
//                                     value={formik.values.productName}
//                                     onChange={formik.handleChange}
//                                     onBlur={formik.handleBlur}
//                                     error={formik.touched.productName && Boolean(formik.errors.productName)}
//                                     helperText={formik.touched.productName && formik.errors.productName}
//                                 />
//                                 <TextField
//                                     fullWidth margin="dense" autoComplete="off"
//                                     multiline minRows={2}
//                                     label="Description"
//                                     name="description"
//                                     value={formik.values.description}
//                                     onChange={formik.handleChange}
//                                     onBlur={formik.handleBlur}
//                                     error={formik.touched.description && Boolean(formik.errors.description)}
//                                     helperText={formik.touched.description && formik.errors.description}
//                                 />
//                                 </Grid>
//                                 <Grid size={{xs:12, md:6, lg:4}}>
//                                 <Box sx={{ textAlign: 'center', mt: 2 }} >
//                                     <Button variant="contained" component="label">
//                                         Upload Image
//                                         <input hidden accept="image/*" multiple type="file"
//                                             onChange={onFileChange} />
//                                     </Button>
//                                     {
//                                         imageFile && (
//                                             <Box className="aspect-ratio-container" sx={{ mt: 2 }}>
//                                                 <img alt="tutorial"
//                                                     src={`${import.meta.env.VITE_FILE_BASE_URL}${imageFile}`}>
//                                                 </img>
//                                             </Box>
//                                         )
//                                     }
//                                 </Box>
//                             </Grid>
//                         </Grid>
//                         <Box sx={{ mt: 2 }}>
//                             <Button variant="contained" type="submit">
//                                 Update
//                             </Button>
//                             <Button variant="contained" sx={{ ml: 2 }} color="error"
//                                 onClick={handleOpen}>
//                                 Delete
//                             </Button>
//                         </Box>
//                     </Box>
//                 )
//             }
//             <Dialog open={open} onClose={handleClose}>
//                 <DialogTitle>
//                     Delete Product
//                 </DialogTitle>
//                 <DialogContent>
//                     <DialogContentText>
//                         Are you sure you want to delete this product?
//                     </DialogContentText>
//                 </DialogContent>
//                 <DialogActions>
//                     <Button onClick={handleClose} color="inherit">
//                         Cancel
//                     </Button>
//                     <Button onClick={deleteProduct} color="error">
//                         Delete
//                     </Button>
//                 </DialogActions>
//             </Dialog>
//             <ToastContainer />
//         </Box>
//     );
// }

// export default EditProduct;


import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, TextField, Button, Grid, FormControl, FormControlLabel, Checkbox, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import http from '../http';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function EditProduct() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState({
        productName: "",
        description: "",
        isArchived: false
    });
    const [imageFile, setImageFile] = useState(null);
    const [loading, setLoading] = useState(true);

    // Fetch product data on load
    useEffect(() => {   
        http.get(`/product/product/${id}`)
            .then((res) => {
                setProduct(res.data);
                setImageFile(res.data.imageFile);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Failed to fetch product:", error);
                toast.error("Failed to fetch product.");
            });
    }, [id]);

    // Form validation and submission
    const formik = useFormik({
        initialValues: product,
        enableReinitialize: true,
        validationSchema: yup.object({
            productName: yup.string().trim()
                .min(3, 'Product name must be at least 3 characters')
                .max(100, 'Product name must be at most 100 characters')
                .required('Product name is required'),
            description: yup.string().trim()
                .min(3, 'Description must be at least 3 characters')
                .max(300, 'Description must be at most 300 characters')
                .required('Description is required'),
            isArchived: yup.boolean()
        }),
        onSubmit: (data) => {
            if (imageFile) {
                data.imageFile = imageFile;
            }
            if (data.productName) {
                data.productName = data.productName.trim();
            }
            if (data.description) {
                data.description = data.description.trim();
            }
            http.put(`/product/${id}`, data)
                .then((res) => {
                    toast.success("Product updated successfully!");
                    navigate("/products");
                })
                .catch((error) => {
                    console.error("Failed to update product:", error);
                    toast.error("Failed to update product.");
                });
        }
    });

    // Handle file upload
    const onFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 1024 * 1024) {
                toast.error('Maximum file size is 1MB');
                return;
            }
            const formData = new FormData();
            formData.append('file', file);
            http.post('/file/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
                .then((res) => {
                    setImageFile(res.data.filename);
                    toast.success("Image uploaded successfully!");
                })
                .catch((error) => {
                    console.error("Failed to upload image:", error);
                    toast.error("Image upload failed.");
                });
        }
    };

    // Handle delete dialog
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const deleteProduct = () => {
        http.delete(`/product/${id}`)
            .then(() => {
                toast.success("Product deleted successfully!");
                navigate("/products");
            })
            .catch((error) => {
                console.error("Failed to delete product:", error);
                toast.error("Failed to delete product.");
            });
    };

    return (
        <Box>
            <Typography variant="h5" sx={{ my: 2 }}>
                Edit Product
            </Typography>
            {
                !loading && (
                    <Box component="form" onSubmit={formik.handleSubmit}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    margin="dense"
                                    label="Product Name"
                                    name="productName"
                                    value={formik.values.productName}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.productName && Boolean(formik.errors.productName)}
                                    helperText={formik.touched.productName && formik.errors.productName}
                                />
                                <TextField
                                    fullWidth
                                    margin="dense"
                                    multiline
                                    minRows={2}
                                    label="Description"
                                    name="description"
                                    value={formik.values.description}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.description && Boolean(formik.errors.description)}
                                    helperText={formik.touched.description && formik.errors.description}
                                />
                                <FormControl margin="dense">
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                name="isArchived"
                                                checked={formik.values.isArchived}
                                                onChange={formik.handleChange}
                                            />
                                        }
                                        label="Archived"
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Box sx={{ textAlign: 'center', mt: 2 }}>
                                    <Button variant="contained" component="label">
                                        Upload Image
                                        <input hidden accept="image/*" type="file" onChange={onFileChange} />
                                    </Button>
                                    {imageFile && (
                                        <Box sx={{ mt: 2 }}>
                                            <img
                                                alt="Product"
                                                src={`${import.meta.env.VITE_FILE_BASE_URL}${imageFile}`}
                                                style={{ maxWidth: "100%", height: "auto" }}
                                            />
                                        </Box>
                                    )}
                                </Box>
                            </Grid>
                        </Grid>
                        <Box sx={{ mt: 2 }}>
                            <Button variant="contained" type="submit">
                                Update
                            </Button>
                            <Button variant="contained" color="error" sx={{ ml: 2 }} onClick={handleOpen}>
                                Delete
                            </Button>
                        </Box>
                    </Box>
                )
            }
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Delete Product</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this product?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="inherit">Cancel</Button>
                    <Button onClick={deleteProduct} color="error">Delete</Button>
                </DialogActions>
            </Dialog>
            <ToastContainer />
        </Box>
    );
}

export default EditProduct;