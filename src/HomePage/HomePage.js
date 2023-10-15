import React, { useState,useEffect } from 'react';
import { TextField, Button, Switch, Container, Box, Typography } from '@mui/material';
import axios from 'axios'
import { fetchWallet } from '../apis';
import CreateTransaction from '../CreateTransaction/CreateTransaction'

function HomePage() {
  const [username, setUsername] = useState('');
  const [initialBalance, setInitialBalance] = useState(0);
  const [isCredit, setIsCredit] = useState(true);
  const [wallet,setWallet] = useState(null)

  useEffect(()=>{
    let data = localStorage.getItem('wallet');
    if(data){
      let walletDetails = JSON.parse(data);
      fetchWallet(walletDetails.id,0,0).then(res=>{
        setWallet(res.data)
      }).catch(err=>{console.log(err)})
    }
  },[])


  const handleCreateWallet = () => {
    const data = {
      balance: initialBalance,
      name: username,
    };
  
    axios.post('/setup', data)
      .then((response) => {
        // Handle a successful response here
        localStorage.setItem('wallet',JSON.stringify(response.data))
        setWallet(response.data)
        console.log('Wallet created:', response.data);
      })
      .catch((error) => {
        // Handle any errors here
        console.error('Error creating wallet:', error);
      });
  };

  if(wallet){
    return <CreateTransaction wallet={wallet}/>
  }

  return (
    <Container maxWidth="sm" className={"borderContainer"}>
      <Box mb={"2rem"} mt={"2rem"}>
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
  );
}

export default HomePage;
