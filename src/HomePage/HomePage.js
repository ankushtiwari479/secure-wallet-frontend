import React, { useState,useEffect, useCallback } from 'react';
import { TextField, Button, Switch, Container, Box, Typography } from '@mui/material';
import axios from 'axios'
import { fetchWallet } from '../apis';
import CreateTransaction from '../CreateTransaction/CreateTransaction'
import { toast } from 'react-toastify';

function HomePage() {
  const [username, setUsername] = useState('');
  const [initialBalance, setInitialBalance] = useState(0);
  const [isCredit, setIsCredit] = useState(true);
  const [wallet,setWallet] = useState(null)


  const fetWalletData = useCallback(() => {
    let data = localStorage.getItem('wallet');
    if(data){
      let walletDetails = JSON.parse(data);
      fetchWallet(walletDetails.id,0,0).then(res=>{
        setWallet(res.data)
      }).catch(err=>{console.log(err)})
    }
  },[])

  useEffect(()=>{
    fetWalletData()
  },[])


  const handleCreateWallet = () => {

    if(!username){
      return toast.warning("Wallet cannot be created with empty Username")
    }
    if(initialBalance<=0){
      return toast.warning("Wallet cannot be created with 0 or less then 0 balance")
    }

    const data = {
      balance: initialBalance,
      name: username,
    };
  
    axios.post('/setup', data)
      .then((response) => {
        // Handle a successful response here
        localStorage.setItem('wallet',JSON.stringify(response.data))
        setWallet(response.data)
        toast.success("Wallet Created Successfull")
        console.log('Wallet created:', response.data);
      })
      .catch((error) => {
        // Handle any errors here
        toast.error(error?.response?.data?.error || "Error while creating wallet")
        console.error('Error creating wallet:', error);
      });
  };

  if(wallet){
    return <CreateTransaction wallet={wallet} fetWalletData={fetWalletData}/>
  }

  return (
    <Container sx={{textAlign:"center",paddingTop:"3rem"}}>
    <Typography variant='h6' sx={{fontWeight:"bold",textAlign:"center"}}>CREATE WALLET</Typography>
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
      <Box sx={{textAlign:"right"}}>
      <Button onClick={handleCreateWallet} variant="contained" color="primary">
        Create Wallet
      </Button>
      </Box>
      {/* Add link to navigate to TransactionsPage */}
    </Container>
    </Container>
  );
}

export default HomePage;
