import './App.css';
import { useState, useEffect } from 'react';
import { Container, AppBar, Toolbar, Typography, Box, Button } from '@mui/material';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import MyTheme from './themes/MyTheme';
import Products from './pages/Products';
import AddProduct from './pages/AddProduct';
import EditProduct from './pages/EditProduct';
import ProductDetail from './pages/ProductDetail';
import AddReview from "./pages/AddReview";
import ReviewDetail from "./pages/ReviewDetail";
import EditReview from "./pages/EditReview";

import MyForm from './pages/MyForm';
import http from './http';


import CartPage from './pages/Cart';
import Orders from './pages/Orders';
import OrderDetails from './pages/OrderDetails';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import EditCart from './pages/EditCart';
import FeedbackForm from './pages/FeedbackForm';
import { Feed, Feedback } from '@mui/icons-material';
import MyFeedbacks from './pages/MyFeedbacks';
import EditFeedback from './pages/EditFeedback';
import AdminFeedbacks from './pages/AdminFeedbacks';

// ------------------------ Latiff -------------------------
import Register from './pages/latiff/Register'
import Login from './pages/latiff/Login';
import UserContext from './contexts/UserContext';

import EditAccount from './pages/latiff/EditAccount';
import EditPassword from './pages/latiff/EditPassword';
import ConfirmEmail from './pages/latiff/ConfirmEmail';
import AccountPage from './pages/latiff/AccountPage';
import AdminPage from './pages/latiff/admin/AdminPage';
import Users from './pages/latiff/admin/Users';
import UsersEdit from './pages/latiff/admin/UsersEdit';
import Roles from './pages/latiff/admin/Roles';
import RolesEdit from './pages/latiff/admin/RolesEdit';
import Unauthorized from './pages/latiff/admin/Unauthorized';


import Donations from './pages/Donations';
import DonationSubmission from './pages/DonationSubmission';
import Reviewrequest from './pages/Reviewrequest';
import ViewDonations from './pages/ViewDonations';





function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (localStorage.getItem("accessToken")) {
      http.get('/user/auth').then((res) => {
        setUser(res.data.user);
      });
    }
  }, []);

  const logout = () => {
    localStorage.clear();
    window.location = "/";
  };

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <Router>
        <ThemeProvider theme={MyTheme}>
          <AppBar position="static" className="AppBar">
            <Container>
              <Toolbar disableGutters={true}>
                <Link to="/">
                  <Typography variant="h6" component="div">
                    Youteez
                  </Typography>
                </Link>
                <Link to="/products" ><Typography>Shop</Typography></Link>
                <Link to="/form" ><Typography>Form</Typography></Link>

                <Link to="/donations" ><Typography>Donate</Typography></Link>
                <Link to="/viewdonations" ><Typography>View Donations</Typography></Link>

                <Box sx={{ flexGrow: 1 }}></Box>
                <Link to="/cart" ><Typography>Cart</Typography></Link>
                <Link to="/orders" ><Typography>Orders</Typography></Link>
                {user && (
                  <>

                    <Link to="/feedbackform"><Typography>Feedback Page</Typography></Link>
                    <Link to="/my-feedbacks"><Typography>My Feedbacks</Typography></Link>
                    <Link to={`/account/${user.id}`}><Typography>{user.name}</Typography></Link>

                  </>
                )
                }
                {user && user.userRoleId == 2 && (
                  <>
                    <Link to={`/admin/${user.id}`}><Typography>Admin Page</Typography></Link>
                    <Link to={`admin-feedbacks`}><Typography>AdminFeedback</Typography></Link>
                  </>
                )}
                {!user && (
                  <>
                    <Link to="/register" ><Typography>Register</Typography></Link>
                    <Link to="/login" ><Typography>Login</Typography></Link>
                  </>
                )}
              </Toolbar>
            </Container>
          </AppBar>

          <Container>
            <Routes>
              <Route path={"/"} element={<Products />} />
              <Route path={"/products"} element={<Products />} />
              <Route path={"/addproduct"} element={<AddProduct />} />
              <Route path={"/editproduct/:id"} element={<EditProduct />} />
              <Route path="/productdetail/:id" element={<ProductDetail />} />
              <Route path="/add-review/:id" element={<AddReview />} />
              <Route path="/product/:id/reviews" element={<ReviewDetail />} />
              <Route path="/edit-review/:reviewId" element={<EditReview />} />

              {/* latiff */}

              <Route path={"/register"} element={<Register />} />
              <Route path={"/login"} element={<Login />} />
              <Route path="/admin-feedbacks" element={<AdminFeedbacks />} />
              <Route path={"/form"} element={<MyForm />} />
              <Route path={"/feedbackform"} element={<FeedbackForm />} />
              <Route path="/my-feedbacks" element={<MyFeedbacks />} />
              <Route path="/edit-feedback/:id" element={<EditFeedback />} />
              <Route path={"/editaccount/:id"} element={<EditAccount />} />
              <Route path={"/editpassword/:id"} element={<EditPassword />} />
              <Route path={"/confirm-email"} element={<ConfirmEmail />} />
              <Route path={"/account/:id"} element={<AccountPage />} />
              <Route path={"/admin/:id"} element={<AdminPage />} />
              {/* <Route path={"/adminusers"} element={<Users />} /> */}
              <Route path={"/adminusers/edit/:id"} element={<UsersEdit />} />
              {/* <Route path={"/adminroles"} element={<Roles />} /> */}
              <Route path={"/adminroles/edit/:id"} element={<RolesEdit />} />
              <Route path={"/unauthorized"} element={<Unauthorized />} />


              <Route path={"/cart"} element={<CartPage />} />
              <Route path={"/orders"} element={<Orders />} />
              <Route path={"/orders/detail/:orderId"} element={<OrderDetails />} />
              <Route path={"/checkout"} element={<Checkout />} />
              <Route path={"/order-success"} element={<OrderSuccess />} />
              <Route path={"/editcart/:cartId"} element={<EditCart />} />
              <Route path={"/donations"} element={<Donations />} />
              <Route path="/donationsubmission" element={<DonationSubmission />} />
              <Route path="/reviewrequest" element={<Reviewrequest />} />
              <Route path="/viewdonations" element={<ViewDonations />} />


            </Routes>
          </Container>
        </ThemeProvider>
      </Router>
    </UserContext.Provider>
  );
}

export default App;
