import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography, Grid, Card, CardContent, IconButton, Button, FormControl, InputLabel, Select, MenuItem, Badge, Menu } from '@mui/material';
import { AccountCircle, AccessTime, Edit, Notifications } from '@mui/icons-material';
import http from '../http';
import dayjs from 'dayjs';
import UserContext from '../contexts/UserContext';
import global from '../global';

function AdminProducts() {
    const [productList, setProductList] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedGender, setSelectedGender] = useState('');
    const { user } = useContext(UserContext);
    const [lowStockProducts, setLowStockProducts] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [anchorEl, setAnchorEl] = useState(null);

    useEffect(() => {
        fetchProducts();
    }, []);

    useEffect(() => {
        if (!Array.isArray(productList)) return;

        const newLowStock = productList
            .filter(p => p.variants && p.variants.some(v => v.stock < 5) && !p.isArchived)
            .map(p => ({
                id: p.id,
                productName: p.productName,
                message: `${p.productName} - Low stock (${Math.min(...p.variants.map(v => v.stock))} left)`,
            }));

        setLowStockProducts(prevLowStock => {
            const merged = [...prevLowStock];
            newLowStock.forEach(newItem => {
                if (!prevLowStock.some(existing => existing.id === newItem.id)) {
                    merged.push(newItem);
                }
            });

            // Show number only for new notifications
            setUnreadCount(newLowStock.length > prevLowStock.length ? newLowStock.length - prevLowStock.length : unreadCount);
            return merged;
        });
    }, [productList]);

    const fetchProducts = async () => {
        try {
            const res = await http.get('/product/admin'); // Fetch all products
            setProductList(res.data);
        } catch (error) {
            console.error('Failed to fetch products:', error);
        }
    };

    const applyFilters = () => {
        let filtered = productList;

        if (selectedCategory) {
            filtered = filtered.filter(product => product.categoryName === selectedCategory);
        }

        if (selectedGender) {
            filtered = filtered.filter(product => product.categoryGender === selectedGender);
        }

        setProductList(filtered);
    };

    const clearFilters = () => {
        setSelectedCategory('');
        setSelectedGender('');
        fetchProducts(); // Reset to all products
    };

    const handleNotificationClick = (event) => {
        setAnchorEl(event.currentTarget);
        setUnreadCount(0); // Reset unread count when clicking
    };

    const handleNotificationClose = () => {
        setAnchorEl(null);
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', my: 2 }}>
                <Typography variant="h5">Admin - Manage Products</Typography>

                {/* Notifications & Add Product Button */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <IconButton color="primary" onClick={handleNotificationClick}>
                        <Badge badgeContent={unreadCount > 0 ? unreadCount : null} color="error">
                            <Notifications />
                        </Badge>
                    </IconButton>
                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleNotificationClose}
                    >
                        {lowStockProducts.length === 0 ? (
                            <MenuItem>No low stock alerts</MenuItem>
                        ) : (
                            lowStockProducts.map(product => (
                                <MenuItem key={product.id}>{product.message}</MenuItem>
                            ))
                        )}
                    </Menu>

                    <Link to="/addproduct">
                        <Button variant="contained" color="primary">Add Product</Button>
                    </Link>
                </Box>
            </Box>

            {/* Filters */}
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <FormControl sx={{ minWidth: 150 }}>
                    <InputLabel>Category</InputLabel>
                    <Select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                        <MenuItem value="">All</MenuItem>
                        <MenuItem value="Tops">Tops</MenuItem>
                        <MenuItem value="Bottoms">Bottoms</MenuItem>
                    </Select>
                </FormControl>

                <FormControl sx={{ minWidth: 150 }}>
                    <InputLabel>Gender</InputLabel>
                    <Select value={selectedGender} onChange={(e) => setSelectedGender(e.target.value)}>
                        <MenuItem value="">All</MenuItem>
                        <MenuItem value="Men's">Men's</MenuItem>
                        <MenuItem value="Women's">Women's</MenuItem>
                        <MenuItem value="Both">Both</MenuItem>
                    </Select>
                </FormControl>

                <Button variant="contained" onClick={applyFilters}>Apply Filter</Button>
                <Button variant="outlined" color="secondary" onClick={clearFilters}>Clear Filter</Button>
            </Box>

            {/* In Stock Products */}
            <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>In Stock Products</Typography>
            <Grid container spacing={2}>
                {productList.filter(product => !product.isArchived).map((product) => (
                    <Grid item xs={12} md={6} lg={4} key={product.id}>
                        <Card>
                            {product.imageFile && (
                                <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                                    <img
                                        alt={product.productName}
                                        src={`${import.meta.env.VITE_FILE_BASE_URL}${product.imageFile}`}
                                        style={{ width: "50%", height: "200px", objectFit: "cover" }}
                                    />
                                </Box>
                            )}
                            <CardContent>
                                <Box sx={{ display: 'flex', mb: 1 }}>
                                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                                        {product.productName}
                                    </Typography>
                                    <Link to={`/editproduct/${product.id}`}>
                                        <IconButton color="primary">
                                            <Edit />
                                        </IconButton>
                                    </Link>
                                </Box>
                                <Typography sx={{ whiteSpace: 'pre-wrap' }}>
                                    {product.description}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Out of Stock Products */}
<Typography variant="h6" sx={{ mt: 4, mb: 2 }}>Out of Stock Products</Typography>
<Grid container spacing={2}>
    {productList.filter(product => product.isArchived).map((product) => (
        <Grid item xs={12} md={6} lg={4} key={product.id}>
            <Card>
                {product.imageFile && (
                    <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                        <img
                            alt={product.productName}
                            src={`${import.meta.env.VITE_FILE_BASE_URL}${product.imageFile}`}
                            style={{ width: "50%", height: "200px", objectFit: "cover" }}
                        />
                    </Box>
                )}
                <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Typography variant="h6" sx={{ flexGrow: 1, color: "gray" }}>
                            {product.productName} (Archived)
                        </Typography>
                        <Link to={`/editproduct/${product.id}`}>
                            <IconButton color="primary">
                                <Edit />
                            </IconButton>
                        </Link>
                    </Box>
                    <Typography sx={{ whiteSpace: 'pre-wrap' }}>
                        {product.description}
                    </Typography>
                </CardContent>
            </Card>
        </Grid>
    ))}
</Grid>

        </Box>
    );
}

export default AdminProducts;