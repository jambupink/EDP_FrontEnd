import './App.css';
import { useState, useEffect } from 'react';
import { Container, AppBar, Toolbar, Typography, Box, Button } from '@mui/material';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import MyTheme from './themes/MyTheme';
import Tutorials from './pages/Tutorials';
import AddTutorial from './pages/AddTutorial';
import EditTutorial from './pages/EditTutorial';
import MyForm from './pages/MyForm';
import http from './http';
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
                    Learning
                  </Typography>
                </Link>
                <Link to="/tutorials" ><Typography>Tutorials</Typography></Link>
                <Link to="/form" ><Typography>Form</Typography></Link>
                <Box sx={{ flexGrow: 1 }}></Box>
                {user && (
                  <>
                    <Link to={`/account/${user.id}`}><Typography>{user.name}</Typography></Link>
                  </>
                )
                }
                {user && user.userRoleId == 2 && (
                  <Link to={`/admin/${user.id}`}><Typography>Admin Page</Typography></Link>
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
              <Route path={"/"} element={<Tutorials />} />
              <Route path={"/tutorials"} element={<Tutorials />} />
              <Route path={"/addtutorial"} element={<AddTutorial />} />
              <Route path={"/edittutorial/:id"} element={<EditTutorial />} />
              <Route path={"/form"} element={<MyForm />} />
              {/* latiff */}
              <Route path={"/register"} element={<Register />} />
              <Route path={"/login"} element={<Login />} />
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
            </Routes>
          </Container>
        </ThemeProvider>
      </Router>
    </UserContext.Provider>
  );
}

export default App;
