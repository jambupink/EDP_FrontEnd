import { Button, Container, Paper, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Users from './Users';
import Roles from './Roles';
import AllOrders from '../../AllOrders'
import http from '../../../http'

function AdminPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState("users");

  useEffect(() => {
    if (localStorage.getItem("accessToken")) {
      http.get('/user/auth').then((res) => {
        setUser(res.data.user);
        setLoading(false);
      }).catch(() => {
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, []);
  
  if (loading) {
    return <Typography>Loading...</Typography>
  }

  if (!user || user.userRoleId !== 2) {
    navigate('/unauthorized');
    return null;
  }

const renderContent = () => {
    switch (selectedTab) {
      case "users":
        return <Users />;
      case "roles":
        return <Roles />;
      case "all orders":
        return <AllOrders />;
      //  case "products":
      //    return <ProductsList />;
      default:
        return <Users />;
    }
  };
  
  return (
    <Container component="main" maxWidth="lg">
      {/* Top Bar with Tabs */}
      <Paper elevation={3} sx={{ p: 2, mb: 2, display: "flex", gap: 2 }}>
        <Button
          variant={selectedTab === "users" ? "contained" : "outlined"}
          onClick={() => setSelectedTab("users")}
        >
          User
        </Button>
        <Button
          variant={selectedTab === "roles" ? "contained" : "outlined"}
          onClick={() => setSelectedTab("roles")}
        >
          UserRole
        </Button>

        <Button
          variant={selectedTab === "all orders" ? "contained" : "outlined"}
          onClick={() => setSelectedTab("all orders")}
        >
          All Orders
        </Button>
        {/* <Button
          variant={selectedTab === "products" ? "contained" : "outlined"}
          onClick={() => setSelectedTab("products")}
        >
          Product
        </Button> */}
      </Paper>

      {/* Content Area */}
      <Paper elevation={3} sx={{ p: 2, minHeight: "400px" }}>
        {renderContent()}
      </Paper>
    </Container>
  );
}

export default AdminPage