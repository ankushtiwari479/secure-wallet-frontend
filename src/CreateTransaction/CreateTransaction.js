import React, { useEffect, useState, } from 'react';
import { TextField, Button, Switch, Container, Box, Typography, Card , CardContent,CardActions} from '@mui/material';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import {useNavigate} from 'react-router-dom'
import axios from '../axios'
import { toast } from 'react-toastify';

const Wallet = ({ name, balance, seeTransaction }) => {
  const [showBalance, setShowBalance] = useState(true);

  useEffect(() => {
    // When the component re-renders, lift up the balance for 2 seconds.
    setShowBalance(true);
    const timer = setTimeout(() => {
      setShowBalance(false);
    }, 2000);

    return () => {
      clearTimeout(timer);
    };
  }, [balance]);

  return (
    <Card variant="outlined" sx={{ borderRadius: '16px', boxShadow: 3, background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)' }}>
      <CardContent>
        <Box mb="1rem">
          <Typography sx={{ color: '#fff', fontWeight: 'bold' }} variant='h6'>YOUR WALLET</Typography>
        </Box>
        <Typography variant="subtitle2" sx={{ color: '#fff' }}>
          Wallet Name: {name}
        </Typography>
        <Box height={"30px"} sx={{display:"flex",alignItems:"center"}}>
          <Typography variant="subtitle2" sx={{ color: '#fff' }}>
            Wallet Balance: {showBalance ? <span style={{fontSize:"20px",fontWeight:"bold"}}>{balance}</span> : balance}
          </Typography>
        </Box>
        <Button variant="outlined" onClick={seeTransaction} sx={{ borderColor: '#fff', color: '#fff', borderRadius: '16px', marginTop: '1rem' }}>
          See Transactions
          <KeyboardDoubleArrowRightIcon />
        </Button>
      </CardContent>
    </Card>
  );
};

function CreateTransaction({wallet,fetWalletData}) {
  const [value, setValue] = useState(0);
  const [desc, setDesc] = useState('');
  const [isCredit, setIsCredit] = useState(true);
  const navigate = useNavigate()

  const handleCreateWallet = () => {

    if(value===0){
      return toast.warning("Value can't be zero")
    }

    if(!desc){
      return toast.warning("Please write description")
    }

    const data = {
      amount: isCredit ? value : 0 - value ,
      description: desc,
    };
  
    axios
      .post('/transact/' + wallet._id, data)
      .then((response) => {
        console.log('transaction completed', response.data);
        setValue(0)
        setDesc('')
        toast.success('Transaction completed successfully');
        fetWalletData();
      })
      .catch((error) => {
        console.error('Error creating wallet:', error);
        toast.error('Error creating wallet: ' + error.message);
      });
  };
  
  const viewTransaction = () => {
  navigate('/transactions')
  }

  return (
    <>
    <Container maxWidth="sm" sx={{marginTop:"2rem"}} >
      <Wallet name={wallet.name} balance={wallet.balance} seeTransaction={viewTransaction}/>
    </Container>
    <Container maxWidth="sm" className={"borderContainer"}>
      <Typography variant='subtitle' sx={{ fontWeight: "bold", color: '#1876d2' }} gutterBottom>
        CREATE A TRANSACTION
      </Typography>
      <Box mb={"2rem"} mt={"2rem"}>
      </Box>
      <Box mb={"2rem"}>
        <TextField
          fullWidth
          label="Set amount"
          type='number'
          value={value}
          onChange={(e) => setValue(e.target.value)}
          sx={{ backgroundColor: 'background.paper', color: 'text.primary' }}
        />
      </Box>
      <Box mb={"2rem"}>
        <TextField
          fullWidth
          label="Description"
          type='text'
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          sx={{ backgroundColor: 'background.paper', color: 'text.primary' }}
        />
      </Box>
      <Box sx={{ textAlign: "right", color: 'text.secondary' }}>
        <span style={isCredit?{color:"#1876d2",fontWeight:"bold"}:{}}>Credit</span> / <span style={!isCredit?{color:"#1876d2",fontWeight:"bold"}:{}}>Debit</span>
        <Switch
          checked={isCredit}
          onChange={() => setIsCredit(!isCredit)}
          color="primary"
          sx={{
            '&.Mui-checked': {
              boxShadow: '0 3px 5px rgba(0, 0, 0, 0.3)',
            },
            '&.Mui-checked + .MuiSwitch-track': {
              backgroundColor: 'rgba(33, 203, 243, 0.5)', // Change this color as needed
            },
          }}
        />
      </Box>
      <Box sx={{ textAlign: "right" }} mt={"2rem"}>
        <Button onClick={handleCreateWallet} variant="contained" color="primary">
          Submit
        </Button>
      </Box>
    </Container>
    <Container maxWidth="sm" sx={{ textAlign: "right", padding: "2rem", color: 'text.secondary' }}>
    </Container>
  </>
  );
}

export default CreateTransaction;
