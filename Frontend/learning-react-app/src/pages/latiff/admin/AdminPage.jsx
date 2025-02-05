import { Button, Container, Paper, Typography } from '@mui/material';
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Users from './Users';
import Roles from './Roles';

function AdminPage() {
     const { id } = useParams();

     const [selectedTab, setSelectedTab] = useState("users"); // Default tab

    

     const renderContent = () => {
       switch (selectedTab) {
         case "users":
           return <Users/>;
         case "roles":
           return <Roles/>;
        //  case "products":
        //    return <ProductsList />;
        //  default:
        //    return <UsersList />;
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
          variant={selectedTab === "products" ? "contained" : "outlined"}
          onClick={() => setSelectedTab("products")}
        >
          Product
        </Button>
      </Paper>

      {/* Content Area */}
      <Paper elevation={3} sx={{ p: 2, minHeight: "400px" }}>
        {renderContent()}
      </Paper>
    </Container>
  )
}

export default AdminPage