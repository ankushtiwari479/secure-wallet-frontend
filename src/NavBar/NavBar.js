import React from 'react';
import { AppBar, Toolbar, Typography, CssBaseline } from '@mui/material';
import Logo from './logo.jpeg'; // Import your logo image

const Navbar = () => {
  return (
    <div>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <img src={Logo} alt="Secure Wallet Logo" style={{ height: '40px', marginRight: '16px' }} />
          <Typography variant="h6">
            {"Secure Wallet"}
          </Typography>
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default Navbar;
