import React, { useContext, useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, IconButton, Drawer, List, ListItem, ListItemText } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AuthContext } from '../contexts/AuthContext';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [drawerOpen, setDrawerOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const toggleDrawer = (open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setDrawerOpen(open);
    };

    const drawerList = (
        <List sx={{ width: 250, bgcolor: '#FFF3E0' }}>
            {user ? (
                <>
                    {user.role === 'admin' && (
                        <ListItem
                            component={Link}
                            to="/admin/marathon/add"
                            onClick={toggleDrawer(false)}
                            sx={{
                                color: '#F57C00',
                                fontFamily: 'Poppins',
                                fontWeight: 600,
                                '&:hover': { color: '#E65100' },
                            }}
                        >
                            <ListItemText primary="Add Event" />
                        </ListItem>
                    )}
                    <ListItem
                        component={Link}
                        to="/update-password"
                        onClick={toggleDrawer(false)}
                        sx={{
                            color: '#F57C00',
                            fontFamily: 'Poppins',
                            fontWeight: 600,
                            '&:hover': { color: '#E65100' },
                        }}
                    >
                        <ListItemText primary="Update Password" />
                    </ListItem>
                    <ListItem
                        onClick={() => {
                            handleLogout();
                            toggleDrawer(false)();
                        }}
                        sx={{
                            color: '#F57C00',
                            fontFamily: 'Poppins',
                            fontWeight: 600,
                            '&:hover': { color: '#E65100' },
                        }}
                    >
                        <ListItemText primary="Logout" />
                    </ListItem>
                </>
            ) : (
                <>
                    <ListItem
                        component={Link}
                        to="/login"
                        onClick={toggleDrawer(false)}
                        sx={{
                            color: '#2E7D32',
                            fontFamily: 'Poppins',
                            fontWeight: 600,
                            '&:hover': { color: '#1B5E20' },
                        }}
                    >
                        <ListItemText primary="Login" />
                    </ListItem>
                    <ListItem
                        component={Link}
                        to="/signup"
                        onClick={toggleDrawer(false)}
                        sx={{
                            color: '#F57C00',
                            fontFamily: 'Poppins',
                            fontWeight: 600,
                            '&:hover': { color: '#E65100' },
                        }}
                    >
                        <ListItemText primary="Signup" />
                    </ListItem>
                </>
            )}
        </List>
    );

    return (
        <AppBar
            position="static"
            sx={{
                bgcolor: 'transparent',
                boxShadow: 'none',
                py: 2,
            }}
        >
            <Toolbar
                sx={{
                    maxWidth: 'lg',
                    width: '90%',
                    mx: 'auto',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    px: { xs: 1, sm: 2 },
                }}
            >
                {/* Left: Logo */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                    sx={{ flexShrink: 1 }}
                >
                    <Typography
                        variant="h6"
                        component={Link}
                        to="/"
                        sx={{
                            color: '#2E7D32',
                            textDecoration: 'none',
                            fontWeight: 700,
                            fontFamily: 'Poppins',
                            fontSize: { xs: '1.2rem', sm: '1.5rem' },
                            whiteSpace: 'nowrap',
                        }}
                    >
                        Runa<strong>ರಂಗ</strong>
                    </Typography>
                </motion.div>

                {/* Right: Nav Items */}
                <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center', gap: 3 }}>
                    {user ? (
                        <>
                            {user.role === 'admin' && (
                                <Button
                                    component={Link}
                                    to="/admin/marathon/add"
                                    sx={{
                                        color: '#F57C00',
                                        fontFamily: 'Poppins',
                                        fontWeight: 600,
                                        '&:hover': { color: '#E65100' },
                                    }}>
                                    Add Event
                                </Button>
                            )}
                            <Button
                                component={Link}
                                to="/update-password"
                                sx={{
                                    color: '#F57C00',
                                    fontFamily: 'Poppins',
                                    fontWeight: 600,
                                    '&:hover': { color: '#E65100' },
                                }}
                            >
                                Update Password
                            </Button>
                            <Button
                                onClick={handleLogout}
                                sx={{
                                    color: '#F57C00',
                                    fontFamily: 'Poppins',
                                    fontWeight: 600,
                                    '&:hover': { color: '#E65100' },
                                }}
                            >
                                Logout
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button
                                component={Link}
                                to="/login"
                                sx={{
                                    color: '#2E7D32',
                                    fontFamily: 'Poppins',
                                    fontWeight: 600,
                                    '&:hover': { color: '#1B5E20' },
                                }}
                            >
                                Login
                            </Button>
                            <Button
                                component={Link}
                                to="/signup"
                                sx={{
                                    bgcolor: '#F57C00',
                                    color: 'white',
                                    px: 3,
                                    borderRadius: 20,
                                    fontFamily: 'Poppins',
                                    fontWeight: 600,
                                    '&:hover': { bgcolor: '#E65100' },
                                }}
                            >
                                Signup
                            </Button>
                        </>
                    )}
                </Box>

                {/* Hamburger Icon for Small Devices */}
                <IconButton
                    edge="end"
                    color="inherit"
                    aria-label="menu"
                    onClick={toggleDrawer(true)}
                    sx={{ display: { xs: 'block', sm: 'none' }, color: '#F57C00' }}
                >
                    <MenuIcon />
                </IconButton>

                {/* Drawer for Small Devices */}
                <Drawer
                    anchor="right"
                    open={drawerOpen}
                    onClose={toggleDrawer(false)}
                >
                    {drawerList}
                </Drawer>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;