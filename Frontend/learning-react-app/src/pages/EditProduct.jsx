import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, TextField, Button, Grid, FormControl, FormControlLabel, Checkbox, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, InputLabel, Select, MenuItem, List, ListItem, ListItemText, Card, CardContent, CardActions, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import DoneIcon from '@mui/icons-material/Done';
import http from '../http';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function EditProduct() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editingIndex, setEditingIndex] = useState(null);

    const categoryOptions = ["Tops", "Bottoms", "Hats & Accessories"];
    const genderOptions = ["Men's", "Women's", "Both"];

    // Variant states
    const [variant, setVariant] = useState({ color: "", size: "", price: "", stock: "" });
    const [variants, setVariants] = useState([]);

    // Fetch product data on load
    useEffect(() => {
        http.get(`/product/product/${id}`)
            .then((res) => {
                setProduct(res.data);
                setImageFile(res.data.imageFile);
                setVariants(res.data.variants || []);
                formik.setFieldValue("isArchived", res.data.isArchived);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Failed to fetch product:", error);
                toast.error("Failed to fetch product.");
            });
    }, [id]);

    // Form validation and submission
    const formik = useFormik({
        initialValues: product || {
            productName: "",
            description: "",
            categoryName: "",
            categoryGender: "",
            isArchived: false
        },
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
            categoryName: yup.string().required("Category is required"),
            categoryGender: yup.string().required("Gender is required"),
            isArchived: yup.boolean()
        }),
        onSubmit: (data) => {
            if (imageFile) {
                data.imageFile = imageFile;
            }
            data.productName = data.productName.trim();
            data.description = data.description.trim();
            data.variants = variants.map(v => ({
                color: v.color.trim(),
                size: v.size.trim(),
                price: Number(v.price).toFixed(2),
                stock: Number(v.stock)
            }));
            data.isArchived = formik.values.isArchived;
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

    // Handle adding or updating variants
    const addOrUpdateVariant = () => {
        if (!variant.color || !variant.size || !variant.price || !variant.stock) {
            toast.error("Please fill all variant fields before adding.");
            return;
        }

        const formattedVariant = {
            color: variant.color.trim(),
            size: variant.size.trim(),
            price: Number(variant.price).toFixed(2),
            stock: Number(variant.stock)
        };

        if (editingIndex !== null) {
            const updatedVariants = [...variants];
            updatedVariants[editingIndex] = formattedVariant;
            setVariants(updatedVariants);
            setEditingIndex(null);
        } else {
            setVariants([...variants, formattedVariant]);
        }

        setVariant({ color: "", size: "", price: "", stock: "" });
    };

    const editVariant = (index) => {
        setVariant(variants[index]);
        setEditingIndex(index);
    };

    const removeVariant = (index) => {
        setVariants(variants.filter((_, i) => i !== index));
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
                                <FormControl fullWidth margin="dense">
                                    <InputLabel>Category</InputLabel>
                                    <Select {...formik.getFieldProps("categoryName")}>
                                        {categoryOptions.map((category, index) => (
                                            <MenuItem key={index} value={category}>{category}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>

                                <FormControl fullWidth margin="dense">
                                    <InputLabel>Gender</InputLabel>
                                    <Select {...formik.getFieldProps("categoryGender")}>
                                        {genderOptions.map((gender, index) => (
                                            <MenuItem key={index} value={gender}>{gender}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>

                                <Typography variant="h6" sx={{ mt: 2 }}>Variants</Typography>
                                <Grid container spacing={1}>
                                    {["Color", "Size", "Price", "Stock"].map((field, index) => (
                                        <Grid item xs={3} key={index}>
                                            <TextField label={field} name={field.toLowerCase()} type={field === "Price" || field === "Stock" ? "number" : "text"} value={variant[field.toLowerCase()]} onChange={(e) => setVariant({ ...variant, [field.toLowerCase()]: e.target.value })} fullWidth />
                                        </Grid>
                                    ))}
                                </Grid>
                                <Button variant="contained" sx={{ mt: 1 }} onClick={addOrUpdateVariant}>
                                    {editingIndex !== null ? <DoneIcon /> : "Add Variant"}
                                </Button>

                                {variants.map((v, index) => (
                                    <Card key={index} sx={{ my: 1, p: 2, background: "#f5f5f5" }}>
                                        <CardContent>
                                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                                <Typography variant="subtitle1">
                                                    Color: {v.color}, Size: {v.size}, Price: ${v.price}, Stock: {v.stock}
                                                </Typography>
                                                <Box>
                                                    <IconButton onClick={() => editVariant(index)}>
                                                        <EditIcon />
                                                    </IconButton>
                                                    <IconButton color="error" onClick={() => removeVariant(index)}>
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </Box>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                ))}

                                <FormControl margin="dense">
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                name="isArchived"
                                                checked={formik.values.isArchived}
                                                onChange={(e) => {
                                                    formik.setFieldValue("isArchived", e.target.checked);
                                                }}
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