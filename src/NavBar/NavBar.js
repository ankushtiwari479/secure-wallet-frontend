import React from 'react';
import { AppBar, Toolbar, Typography, CssBaseline } from '@mui/material';
import Logo from './logo.png'; // Import your logo image
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate()
  return (
    <div style={{position:"sticky",top:"0"}}>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <img onClick={()=>navigate('/')} src={Logo} alt="Secure Wallet Logo" style={{ height: '40px', marginRight: '16px',cursor:"pointer" }} />
          <Typography variant="h6">
            {"Secure Wallet"}
          </Typography>
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default Navbar;
