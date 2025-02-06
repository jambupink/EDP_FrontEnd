import { Avatar, Box, Button, Card, CardContent, CardHeader, Divider, Grid, Typography, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import React, { useEffect, useState } from 'react';
import http from '../../../http';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';

function Roles() {
    const [roleList, setRoleList] = useState([]);
    const [open, setOpen] = useState(false);
    const [newRole, setNewRole] = useState({ role: '', description: '' });

    useEffect(() => {
        http.get('/userrole').then((res) => {
            setRoleList(res.data);
        });
    }, []);

    const handleAddRole = () => {
        http.post('/userrole', newRole)
            .then(() => {
                setOpen(false);
                setNewRole({ role: '', description: '' });
                http.get('/userrole').then((res) => setRoleList(res.data)); 
                toast.success("role added successfully")
            })
            .catch((err) => console.error("Error adding role:", err));
    };

    function deleteRole(id){
        if (!window.confirm("Are you sure you want to delete this role?")) return;

        http.delete(`/userrole/${id}`)
        .then(() => {
            setRoleList(roleList.filter(role => role.id !== id));
            toast.success(`Role ${id} deleted successfully`);
        })
        .catch((err) => {
            console.error("Error deleting role:", err);
        });
    }

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                    Admin - Role Management
                </Typography>
                <Button variant="contained" color="primary" onClick={() => setOpen(true)}>
                    Add Role
                </Button>
            </Box>

            <Grid container spacing={3}>
                {roleList.map((role) => (
                    <Grid item xs={12} sm={6} md={4} key={role.id}>
                        <Card elevation={3} sx={{ borderRadius: 3, overflow: 'hidden', bgcolor: '#f5f5f5' }}>
                            <CardHeader
                                avatar={
                                    <Avatar sx={{ bgcolor: 'secondary.main', color: 'white' }}>
                                        {role.role.charAt(0).toUpperCase()}
                                    </Avatar>
                                }
                                title={<Typography variant="h6">{role.role}</Typography>}
                                subheader={`ID: ${role.id}`}
                            />
                            <Divider />
                            <CardContent>
                                <Typography variant="body1">
                                    <strong>Description:</strong> {role.description}
                                </Typography>
                            </CardContent>
                            <Divider />
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 2 }}>
                                <Link to={`/adminroles/edit/${role.id}`}>
                                    <Button variant="contained" color="primary">
                                        Edit
                                    </Button>
                                </Link>
                                <Button variant="outlined" color="error" onClick={() => deleteRole(role.id)}>
                                    Delete
                                </Button>
                            </Box>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Add Role Dialog */}
            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>Add New Role</DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth margin="dense"
                        label="Role Name"
                        value={newRole.role}
                        onChange={(e) => setNewRole({ ...newRole, role: e.target.value })}
                    />
                    <TextField
                        fullWidth margin="dense"
                        label="Description"
                        value={newRole.description}
                        onChange={(e) => setNewRole({ ...newRole, description: e.target.value })}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={handleAddRole} variant="contained" color="primary">
                        Add Role
                    </Button>
                </DialogActions>
            </Dialog>
            <ToastContainer/>
        </Box>
    )
}

export default Roles