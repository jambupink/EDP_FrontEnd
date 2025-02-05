import { Avatar, Box, Button, Card, CardContent, CardHeader, Divider, Grid, Grid2, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import http from '../../../http';
import { Link } from 'react-router-dom';

function Users() {
    const [userList, setUserList] = useState([]);

    useEffect(() => {
        http.get('/user').then((res) => {
            setUserList(res.data)
        })
    }, [])

    function deleteUser(id){
        if (!window.confirm("Are you sure you want to delete this user?")) return;

         http.delete(`/user/${id}`)
            .then(() => {
                setUserList(userList.filter(user => user.id !== id));
                console.log(`User ${id} deleted successfully`);
            })
            .catch((err) => {
                console.error("Error deleting user:", err);
            });
    }

    

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>
                Admin - User Management
            </Typography>

            <Grid container spacing={3}>
                {userList.map((user) => (
                    <Grid item xs={12} sm={6} md={4} key={user.id}>
                        <Card elevation={3} sx={{ borderRadius: 3, overflow: 'hidden', bgcolor: '#f5f5f5' }}>
                            <CardHeader
                                avatar={
                                    <Avatar sx={{ bgcolor: 'primary.main', color: 'white' }}>
                                        {user.name.charAt(0).toUpperCase()}
                                    </Avatar>
                                }
                                title={<Typography variant="h6">{user.name}</Typography>}
                                subheader={`ID: ${user.id}`}
                            />
                            <Divider />
                            <CardContent>
                                <Typography variant="body1">
                                    <strong>Email:</strong> {user.email}
                                </Typography>
                                <Typography variant="body1">
                                    <strong>Gender:</strong> {user.gender.charAt(0).toUpperCase() + user.gender.slice(1)}
                                </Typography>
                                <Typography variant="body1">
                                    <strong>Points:</strong> {user.points}
                                </Typography>
                                <Typography variant="body1">
                                    <strong>Role ID:</strong> {user.userRoleId} {user.userRoleId === 2 ? "(Admin)" : "(User)"}
                                </Typography>
                                <Typography variant="body1">
                                    <strong>Email Verified:</strong> {user.isEmailConfirmed ? "✅ Yes" : "❌ No"}
                                </Typography>
                            </CardContent>
                            <Divider />
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 2 }}>
                                <Link to={`/adminusers/edit/${user.id}`}>
                                <Button variant="contained" color="primary">
                                    Edit
                                </Button>
                                </Link>
                                
                                <Button variant="outlined" color="error" onClick={() => deleteUser(user.id)}>
                                    Delete
                                </Button>
                            </Box>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>

    )
}

export default Users