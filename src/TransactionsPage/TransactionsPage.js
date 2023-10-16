import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, IconButton, TablePagination, Container, Box, Icon } from '@mui/material';
import { format } from 'date-fns';
import axios from 'axios';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import Papa from 'papaparse';
function TransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [sortedBy, setSortedBy] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc'); // Track the sorting direction
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [count,setCount] = useState(10)

  const handleSort = (column) => {
    let sortedTransactions = [...transactions];

    if (sortedBy === column) {
      sortedTransactions.reverse(); // Reverse the array if already sorted by the same column
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc'); // Toggle the sorting direction
    } else {
      sortedTransactions.sort((a, b) => {
        if (column === 'date') {
          setSortDirection('asc'); // Default to ascending when sorting by date
          return new Date(a.date) - new Date(b.date);
        } else if (column === 'amount') {
          setSortDirection('asc'); // Default to ascending when sorting by amount
          return a.amount - b.amount;
        }
        return 0; // Default case
      });
    }

    setSortedBy(column);
    setTransactions(sortedTransactions);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
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
  };

  useEffect(() => {
    const walletId = JSON.parse(localStorage.getItem('wallet'))?.id;
    const skip = page * rowsPerPage;
    const limit = rowsPerPage;
    axios
      .get(`/transactions?walletId=${walletId}&skip=${skip}&limit=${limit}`)
      .then((response) => {
        setTransactions(response.data.transactions);
        setCount(response.data.count)
      })
      .catch((error) => {
        console.error('Error fetching transactions:', error);
      });
  }, [page, rowsPerPage]);

  return (
    <Container sx={{ padding: "2rem" }}>
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <Button onClick={() => handleSort('date')}>
                    Date {sortedBy === 'date' && sortDirection === 'asc' ? <ArrowUpwardIcon sx={{fontSize:"18px"}}/> : <ArrowDownwardIcon sx={{fontSize:"18px"}}/>}
                  </Button>
                </TableCell>
                <TableCell>
                  <Button onClick={() => handleSort('amount')}>
                    Amount {sortedBy === 'amount' && sortDirection === 'asc' ? <ArrowUpwardIcon sx={{fontSize:"18px"}}/> : <ArrowDownwardIcon sx={{fontSize:"18px"}}/>}
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
        <Button variant='outlined' onClick={exportAsCSV}>Export as CSV</Button>
      </Box>
    </Container>
  );
}

export default TransactionsPage;
