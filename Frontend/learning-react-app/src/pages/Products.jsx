import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography, Grid, Card, CardContent, Input, IconButton, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { AccountCircle, AccessTime, Search, Clear, Edit } from '@mui/icons-material';
import http from '../http';
import dayjs from 'dayjs';
import UserContext from '../contexts/UserContext';
import global from '../global';

function Products() {
    const [productList, setProductList] = useState([]);
    const [search, setSearch] = useState('');
    const { user } = useContext(UserContext);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedGender, setSelectedGender] = useState('');

    useEffect(() => {
        fetchProducts();
    }, []);

    useEffect(() => {
        // Show all products initially
        setFilteredProducts(productList);
        const backInStock = productList.find(p => p.wasOutOfStock && p.stock > 0);
        if (backInStock) {
            alert(`"${backInStock.productName}" is back in stock!`);
        }
    }, [productList]);

    const onSearchChange = (e) => setSearch(e.target.value);

    // Fetch all products
    const fetchProducts = async () => {
        try {
            const res = await http.get('/product/public-products');
            setProductList(res.data);
        } catch (error) {
            console.error('Failed to fetch products:', error);
        }
    };

    // Fetch products based on search query
    const searchProducts = async () => {
        try {
            const res = await http.get(`/product?search=${search}`);
            setProductList(res.data);
        } catch (error) {
            console.error('Failed to search products:', error);
        }
    };

    const onSearchKeyDown = (e) => {
        if (e.key === "Enter") {
            searchProducts();
        }
    };

    const onClickClear = () => {
        setSearch('');
        fetchProducts();
    };

    const applyFilters = () => {
        let filtered = productList;

        if (selectedCategory) {
            filtered = filtered.filter(product => product.categoryName === selectedCategory);
        }

        if (selectedGender) {
            filtered = filtered.filter(product => product.categoryGender === selectedGender);
        }

        setFilteredProducts(filtered);
    };

    const clearFilters = () => {
        setSelectedCategory('');
        setSelectedGender('');
        setFilteredProducts(productList);
    };

    return (
        <Box>
            <Typography variant="h5" sx={{ my: 2 }}>
                Products
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Input
                    value={search}
                    placeholder="Search"
                    onChange={onSearchChange}
                    onKeyDown={onSearchKeyDown}
                />
                <IconButton color="primary" onClick={searchProducts}>
                    <Search />
                </IconButton>
                <IconButton color="primary" onClick={onClickClear}>
                    <Clear />
                </IconButton>
                {/* <Box sx={{ flexGrow: 1 }} />
                {user && (
                    <Link to="/addproduct">
                        <Button variant="contained">
                            Add Product
                        </Button>
                    </Link>
                )} */}
            </Box>

            {/* Filters */}
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                {/* Category Filter */}
                <FormControl sx={{ minWidth: 150 }}>
                    <InputLabel>Category</InputLabel>
                    <Select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                        <MenuItem value="">All</MenuItem>
                        <MenuItem value="Tops">Tops</MenuItem>
                        <MenuItem value="Bottoms">Bottoms</MenuItem>
                        <MenuItem value="Hats & Accessories">Hats & Accessories</MenuItem>
                    </Select>
                </FormControl>

                {/* Gender Filter */}
                <FormControl sx={{ minWidth: 150 }}>
                    <InputLabel>Gender</InputLabel>
                    <Select
                        value={selectedGender}
                        onChange={(e) => setSelectedGender(e.target.value)}
                    >
                        <MenuItem value="">All</MenuItem>
                        <MenuItem value="Men's">Men's</MenuItem>
                        <MenuItem value="Women's">Women's</MenuItem>
                        <MenuItem value="Both">Both</MenuItem>
                    </Select>
                </FormControl>

                {/* Apply & Clear Filters */}
                <Button variant="contained" onClick={applyFilters}>
                    Apply Filter
                </Button>
                <Button variant="outlined" color="secondary" onClick={clearFilters}>
                    Clear Filter
                </Button>
            </Box>

            {/* Product Grid */}
            <Grid container spacing={2}>
                {filteredProducts.map((product) => (
                    <Grid item xs={12} md={6} lg={4} key={product.id}>
                        <Link to={`/productdetail/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                            <Card sx={{ height: "500px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                                {product.imageFile && (
                                    <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                                        <img
                                            alt={product.productName}
                                            src={`${import.meta.env.VITE_FILE_BASE_URL}${product.imageFile}`}
                                            style={{ width: "85%", height: "300px", objectFit: "cover" }}
                                        />
                                    </Box>
                                )}
                                <CardContent sx={{ flexGrow: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                                    <Typography variant="h6" sx={{ textAlign: "center" }}>
                                        {product.productName}
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            display: "-webkit-box",
                                            WebkitLineClamp: 3, // Show 3 lines max
                                            WebkitBoxOrient: "vertical"
                                        }}
                                    >
                                        {product.description}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Link>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}

export default Products;