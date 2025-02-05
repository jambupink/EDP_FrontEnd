import { LockOutlined } from '@mui/icons-material'
import { Avatar, Box, Button, Container, Paper, Typography, Grid } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import http from '../../http';
import EditAccount from './EditAccount';
import EditPassword from './EditPassword';

function AccountPage() {
    const { id } = useParams();
    const [selectedContent, setSelectedContent] = useState('editAccount');

    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState({
        name: ""
    });

    useEffect(() => {
        http.get(`user/${id}`).then((res) => {
            setUser(res.data);
            setLoading(false);
        });
    }, [id]); // Added dependency array to prevent infinite requests

    const renderContent = () => {
        switch (selectedContent) {
            case 'editAccount':
                return <EditAccount />;
            case 'changePassword':
                return <EditPassword />;
            default:
                return <EditAccount />;
        }
    };

    return (
        <Container component="main" maxWidth="lg">
            <Box sx={{ display: 'flex', gap: 3, mt: 3 }}>
                {/* Sidebar - Fixed Width */}
                <Paper
                    elevation={3}
                    sx={{
                        width: '300px', // Fixed width for sidebar
                        minHeight: '400px', // Minimum height for better appearance
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        padding: 2,
                        position: 'sticky',
                        top: '20px', // Makes it stick to the top while scrolling
                    }}
                >
                    <Avatar>
                        <LockOutlined />
                    </Avatar>
                    <Typography variant="h6" sx={{ mt: 1 }}>
                        {user.name}
                    </Typography>

                    <Button
                        variant={selectedContent === 'editAccount' ? 'contained' : 'outlined'}
                        color="primary"
                        sx={{ mt: 2, width: '100%' }}
                        onClick={() => setSelectedContent('editAccount')}
                    >
                        My Details
                    </Button>
                    <Button
                        variant={selectedContent === 'changePassword' ? 'contained' : 'outlined'}
                        color="primary"
                        sx={{ mt: 2, width: '100%' }}
                        onClick={() => setSelectedContent('changePassword')}
                    >
                        Change Password
                    </Button>
                </Paper>

                {/* Right Content - Flexible */}
                <Paper
                    elevation={3}
                    sx={{
                        flexGrow: 1, // Allows the content to take remaining space
                        padding: 2,
                        minHeight: '400px'
                    }}
                >
                    {renderContent()}
                </Paper>
            </Box>
        </Container>
    );
}

export default AccountPage;
