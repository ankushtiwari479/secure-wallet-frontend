import React, { useState, useEffect, useCallback } from 'react';
import { TextField, Button, Switch, Container, Box, Typography, CircularProgress } from '@mui/material';
import axios from 'axios';
import { fetchWallet } from '../apis';
import CreateTransaction from '../CreateTransaction/CreateTransaction';
import { toast } from 'react-toastify';

function HomePage() {
  const [username, setUsername] = useState('');
  const [initialBalance, setInitialBalance] = useState(0);
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(false); // Track loading state

  const fetchWalletData = useCallback(() => {
    let data = localStorage.getItem('wallet');
    if (data) {
      let walletDetails = JSON.parse(data);
      setLoading(true); // Start loading
      fetchWallet(walletDetails._id, 0, 0)
        .then((res) => {
          setWallet(res.data);
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          setLoading(false); // Stop loading
        });
    }
  }, []);

  useEffect(() => {
    fetchWalletData();
  }, []);

  const handleCreateWallet = () => {
    if (!username) {
      return toast.warning("Wallet cannot be created with an empty Username");
    }
    if (initialBalance <= 0) {
      return toast.warning("Wallet cannot be created with a balance of 0 or less");
    }

    const data = {
      balance: initialBalance,
      name: username,
    };
    setLoading(true)
    axios
      .post('/setup', data)
      .then((response) => {
        localStorage.setItem('wallet', JSON.stringify(response.data));
        setWallet(response.data);
        toast.success("Wallet Created Successfully");
        console.log('Wallet created:', response.data);
      })
      .catch((error) => {
        toast.error(error?.response?.data?.error || "Error while creating wallet");
        console.error('Error creating wallet:', error);
      }).finally(()=>{
        setLoading(false)
      });
  };

  if (loading) {
    // Show a loader while data is being fetched
    return (
      <Container sx={{ textAlign: "center", paddingTop: "8rem" }}>
        <CircularProgress />
      </Container>
    );
  }

  if (wallet) {
    return <CreateTransaction wallet={wallet} fetchWalletData={fetchWalletData} />;
  }

  return (
    <Container sx={{ textAlign: "center", paddingTop: "3rem" }}>
      <Typography variant='h6' sx={{ fontWeight: "bold", textAlign: "center" }}>CREATE WALLET</Typography>
      <Container maxWidth="sm" className={"borderContainer"}>
        <Box mb={"1rem"} mt={"1rem"}>
          <TextField
            fullWidth
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </Box>
        <Box mb={"2rem"}>
          <TextField
            fullWidth
            label="Initial Balance"
            type='number'
            value={initialBalance}
            onChange={(e) => setInitialBalance(e.target.value)}
          />
        </Box>
        <Box sx={{ textAlign: "right" }}>
          <Button onClick={handleCreateWallet} variant="contained" color="primary">
            Create Wallet
          </Button>
        </Box>
      </Container>
    </Container>
  );
}

export default HomePage;
