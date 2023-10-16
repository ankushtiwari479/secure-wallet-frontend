import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, IconButton, TablePagination, Container, Box, Icon, Typography } from '@mui/material';
import { format } from 'date-fns';
import axios from 'axios';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import GridOnIcon from '@mui/icons-material/GridOn';
import Papa from 'papaparse';
import { toast } from 'react-toastify';

function TransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [sortDirectionDate, setSortDirectionDate] = useState(null); // Track sorting direction for date
  const [sortDirectionAmount, setSortDirectionAmount] = useState(null); // Track sorting direction for amount
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [count, setCount] = useState(10);

  const handleSort = (column) => {
    let newSortDirection;
    if (column === 'date') {
        newSortDirection = sortDirectionDate === 'asc' ? 'desc' : 'asc';
      setSortDirectionDate(newSortDirection);
    } else if (column === 'amount') {
        newSortDirection = sortDirectionAmount === 'asc' ? 'desc' : 'asc';
      setSortDirectionAmount(newSortDirection);    } else {
      newSortDirection = 'asc'; // Default case
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    fetchTransactionsAfterPagination(newPage, rowsPerPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset page when changing rowsPerPage
    fetchTransactionsAfterPagination(0, parseInt(event.target.value, 10));
  };

  const fetchTransactionsAfterPagination = (newPage, newRowsPerPage) => {
    const walletId = JSON.parse(localStorage.getItem('wallet'))?.id;
    const skip = newPage * newRowsPerPage;
    const limit = newRowsPerPage;
    axios
      .get(`/transactions?walletId=${walletId}&skip=${skip}&limit=${limit}`)
      .then((response) => {
        setTransactions(response.data.transactions);
        setCount(response.data.count);
      })
      .catch((error) => {
        console.error('Error fetching transactions:', error);
      });
  };

  const exportAsCSV = () => {
    const csvData = transactions.map((transaction) => ({
      Date: format(new Date(transaction.date), 'MM/dd/yyyy'),
      Amount: transaction.amount,
      Description: transaction.description,
    }));
    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = 'transactions.csv';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    toast.success("CSV downloaded successfully")
  };

  const fetchTransactions = (params) => {
    const walletId = JSON.parse(localStorage.getItem('wallet'))?.id;
    const skip = page * rowsPerPage;
    const limit = rowsPerPage;
    let obj = {
      walletId:walletId,skip:skip,limit:limit
    }
    if(params){
      obj={...obj,...params}
    }
    axios
      .get(`/transactions`,{params:obj})
      .then((response) => {
        setTransactions(response.data.transactions);
        setCount(response.data.count);
      })
      .catch((error) => {
        console.error('Error fetching transactions:', error);
      });
  }

  useEffect(()=>{
    fetchTransactions({
      dateSort:sortDirectionDate,
      amountSort:sortDirectionAmount
    })
  },[sortDirectionAmount,sortDirectionDate])

  useEffect(() => {
    fetchTransactions()
  }, [page, rowsPerPage]);


  return (
    <Container sx={{ padding: "1rem" }}>
      <Box sx={{margin:"2rem",textAlign:"center"}}>
      <Typography variant='h6' sx={{ fontWeight: "bold", color: '#1876d2' }} gutterBottom>
        LIST OF TRANSACTIONS 
      </Typography>
      </Box>
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <Button onClick={() => handleSort('date')}>
                    Date {sortDirectionDate === 'asc' ? <ArrowUpwardIcon sx={{ fontSize: "18px" }} /> : sortDirectionDate === 'desc' ? <ArrowDownwardIcon sx={{ fontSize: "18px" }} /> : ''}
                  </Button>
                </TableCell>
                <TableCell>
                  <Button onClick={() => handleSort('amount')}>
                    Amount {sortDirectionAmount === 'asc' ? <ArrowUpwardIcon sx={{ fontSize: "18px" }} /> : sortDirectionAmount === 'desc' ? <ArrowDownwardIcon sx={{ fontSize: "18px" }} /> : ''}
                  </Button>
                </TableCell>
                <TableCell>
                  <Button>
                    Description
                  </Button>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>{format(new Date(transaction.date), 'MM/dd/yyyy')}</TableCell>
                  <TableCell>{transaction.amount}</TableCell>
                  <TableCell>{transaction.description}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={count} // Total number of transactions
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      <Box sx={{ textAlign: "right" }} mt="2rem">
        <Button variant='outlined' onClick={exportAsCSV}>Export as CSV &nbsp;&nbsp; <GridOnIcon/></Button>
      </Box>
    </Container>
  );
}

export default TransactionsPage;
