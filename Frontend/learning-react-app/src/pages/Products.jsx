// import React, { useEffect, useState, useContext } from 'react';
// import { Link } from 'react-router-dom';
// import { Box, Typography, Grid, Card, CardContent, Input, IconButton, Button } from '@mui/material';
// import { AccountCircle, AccessTime, Search, Clear, Edit } from '@mui/icons-material';
// import http from '../http';
// import dayjs from 'dayjs';
// import UserContext from '../contexts/UserContext';
// import global from '../global';

// function Products() {
//     const [productList, setProductList] = useState([]);
//     const [search, setSearch] = useState('');
//     const { user } = useContext(UserContext);

//     useEffect(() => {
//         getProducts();
//     }, []);

//     const onSearchChange = (e) => setSearch(e.target.value);

//     const getProducts = async () => {
//         try {
//             const res = await http.get('/product');
//             setProductList(res.data);
//         } catch (error) {
//             console.error('Failed to fetch products:', error);
//         }
//     };

//     const searchProducts = async () => {
//         try {
//             const res = await http.get(`/product?search=${search}`);
//             setProductList(res.data);
//         } catch (error) {
//             console.error('Failed to search products:', error);
//         }
//     };

//     const onSearchKeyDown = (e) => {
//         if (e.key === "Enter") {
//             searchProducts();
//         }
//     };

//     const onClickClear = () => {
//         setSearch('');
//         getProducts();
//     };

//     return (
//         <Box>
//             <Typography variant="h5" sx={{ my: 2 }}>
//                 Products
//             </Typography>
//             <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
//                 <Input
//                     value={search}
//                     placeholder="Search"
//                     onChange={onSearchChange}
//                     onKeyDown={onSearchKeyDown}
//                 />
//                 <IconButton color="primary" onClick={searchProducts}>
//                     <Search />
//                 </IconButton>
//                 <IconButton color="primary" onClick={onClickClear}>
//                     <Clear />
//                 </IconButton>
//                 <Box sx={{ flexGrow: 1 }} />
//                 {user && (
//                     <Link to="/addproduct">
//                         <Button variant='contained'>
//                             Add Product
//                         </Button>
//                     </Link>
//                 )}
//             </Box>
//             <Grid container spacing={2}>
//                 {productList.map((product) => (
//                     <Grid item xs={12} md={6} lg={4} key={product.id}>
//                         <Card>
//                             {product.imageFile && (
//                                 <Box className="aspect-ratio-container">
//                                     <img alt="product" src={`${import.meta.env.VITE_FILE_BASE_URL}${product.imageFile}`} />
//                                 </Box>
//                             )}
//                             <CardContent>
//                                 <Box sx={{ display: 'flex', mb: 1 }}>
//                                     <Typography variant="h6" sx={{ flexGrow: 1 }}>
//                                         {product.productName}
//                                     </Typography>
//                                     {user && user.id === product.userId && (
//                                         <Link to={`/editproduct/${product.id}`}>
//                                             <IconButton color="primary" sx={{ padding: '4px' }}>
//                                                 <Edit />
//                                             </IconButton>
//                                         </Link>
//                                     )}
//                                 </Box>
//                                 <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }} color="text.secondary">
//                                     <AccountCircle sx={{ mr: 1 }} />
//                                     <Typography>{product.user?.name}</Typography>
//                                 </Box>
//                                 <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }} color="text.secondary">
//                                     <AccessTime sx={{ mr: 1 }} />
//                                     <Typography>
//                                         {dayjs(product.createdAt).format(global.datetimeFormat)}
//                                     </Typography>
//                                 </Box>
//                                 <Typography sx={{ whiteSpace: 'pre-wrap' }}>
//                                     {product.description}
//                                 </Typography>
//                             </CardContent>
//                         </Card>
//                     </Grid>
//                 ))}
//             </Grid>
//         </Box>
//     );
// }

// export default Products;


import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography, Grid, Card, CardContent, Input, IconButton, Button } from '@mui/material';
import { AccountCircle, AccessTime, Search, Clear, Edit } from '@mui/icons-material';
import http from '../http';
import dayjs from 'dayjs';
import UserContext from '../contexts/UserContext';
import global from '../global';

function Products() {
    const [productList, setProductList] = useState([]);
    const [search, setSearch] = useState('');
    const { user } = useContext(UserContext);

    useEffect(() => {
        fetchProducts();
    }, []);

    const onSearchChange = (e) => setSearch(e.target.value);

    // Fetch all products
    const fetchProducts = async () => {
        try {
            const res = await http.get('/product/my-products');
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
                <Box sx={{ flexGrow: 1 }} />
                {user && (
                    <Link to="/addproduct">
                        <Button variant="contained">
                            Add Product
                        </Button>
                    </Link>
                )}
            </Box>
            <Grid container spacing={2}>
                {productList.map((product) => (
                    <Grid item xs={12} md={6} lg={4} key={product.id}>
                        <Card>
                            {product.imageFile && (
                                <Box className="aspect-ratio-container">
                                    <img
                                        alt="product"
                                        src={`${import.meta.env.VITE_FILE_BASE_URL}${product.imageFile}`}
                                        style={{ maxWidth: '45%', height: 'auto' }}
                                    />
                                </Box>
                            )}
                            <CardContent>
                                <Box sx={{ display: 'flex', mb: 1 }}>
                                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                                        {product.productName}
                                    </Typography>
                                    {user && user.id === product.userId && (
                                        <Link to={`/editproduct/${product.id}`}>
                                            <IconButton color="primary" sx={{ padding: '4px' }}>
                                                <Edit />
                                            </IconButton>
                                        </Link>
                                    )}
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }} color="text.secondary">
                                    <AccountCircle sx={{ mr: 1 }} />
                                    <Typography>{product.user?.name || 'Unknown User'}</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }} color="text.secondary">
                                    <AccessTime sx={{ mr: 1 }} />
                                    <Typography>
                                        {dayjs(product.createdAt).format(global.datetimeFormat)}
                                    </Typography>
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

export default Products;