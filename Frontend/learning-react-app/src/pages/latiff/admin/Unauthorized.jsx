import { Button, Container, Paper, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function Unauthorized() {
  const navigate = useNavigate();

  return (
    <Container component="main" maxWidth="sm">
      <Paper elevation={3} sx={{ p: 3, textAlign: "center" }}>
        <Typography variant="h5">Access Denied</Typography>
        <Typography>You do not have permission to access this page.</Typography>
        <Button variant="contained" sx={{ mt: 2 }} onClick={() => navigate("/")}>
          Go to Home
        </Button>
      </Paper>
    </Container>
  );
}

export default Unauthorized;
