import React, { useState,useEffect } from 'react';
import { TextField, Button, Switch, Container, Box, Typography } from '@mui/material';
import {useNavigate} from 'react-router-dom'
import axios from 'axios'
import { fetchWallet } from '../apis';

function CreateTransaction({wallet}) {
  const [value, setValue] = useState(0);
  const [isCredit, setIsCredit] = useState(true);
  const navigate = useNavigate()

  const handleCreateWallet = () => {
    const data = {
      amount: isCredit?0-value:value,
      description: ''
    };
    
    axios.post('/transact/'+wallet._id, data)
      .then((response) => {
        // Handle a successful response here
        console.log('transaction completed', response.data);
      })
      .catch((error) => {
        // Handle any errors here
        console.error('Error creating wallet:', error);
      });
  };

  const viewTransaction = () => {
  navigate('/transactions')
  }

  return (
    <>
    <Container maxWidth="sm" className={"borderContainer"}>
      <Box mb={"2rem"} mt={"2rem"}>
      </Box>
      <Box mb={"2rem"}>
      <TextField
        fullWidth
        label="Initial Balance"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      </Box>
      <Box sx={{textAlign:"right"}}>
        Credit / Debit
      <Switch
        checked={isCredit}
        onChange={() => setIsCredit(!isCredit)}
        color="primary"
      />
      </Box>
      <Box sx={{textAlign:"right"}} mt={"2rem"}>
      <Button onClick={handleCreateWallet} variant="contained" color="primary">
         Submit
      </Button>
      </Box>
    </Container>
    <Container maxWidth="sm" sx={{textAlign:"right" , padding:"2rem"}}>
    <Button variant='outlined' onClick={viewTransaction}>
      View Transactions
    </Button>
  </Container>
  </>
  );
}

export default CreateTransaction;
