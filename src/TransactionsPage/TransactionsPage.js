import React from 'react';
import { useEffect, useState } from 'react';
import axios from 'axios'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper , Button } from '@mui/material';


function TransactionsPage() {
    // Fetch transactions and display them here
    const [transactions, setTransactions] = useState([]);
    useEffect(() => {
    // Define the walletId if you have it from local storage
    const walletId = 'your-wallet-id';

    // Define skip and limit as needed
    const skip = 0;
    const limit = 10;

    axios.get(`/transactions?walletId=${walletId}&skip=${skip}&limit=${limit}`)
        .then((response) => {
        // Handle a successful response here
        console.log('Transactions fetched:', response.data);
        setTransactions(response.data);
        })
        .catch((error) => {
        // Handle any errors here
        console.error('Error fetching transactions:', error);
        });
    }, []); // The empty dependency array ensures this effect runs once when the component mounts

    const handleSort = (column) => {
        // You can implement sorting logic here
        // Update the transactions data based on the selected column
        // Make sure to set the sorted data to a new state
      };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
        <TableRow>
            <TableCell>
              <Button onClick={() => handleSort('date')}>Date</Button>
            </TableCell>
            <TableCell>
              <Button onClick={() => handleSort('amount')}>Amount</Button>
            </TableCell>
            <TableCell>Description</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {/* Map through transactions and display them */}
        </TableBody>
      </Table>
      {/* Add pagination and export CSV functionality */}
    </TableContainer>
  );
}

export default TransactionsPage;
