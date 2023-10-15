import React, { useState, useEffect } from 'react';
import EnhancedTable from './EnhancedTable'; // Import the EnhancedTable component
import axios from 'axios';

function TransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('date');
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    const walletId = JSON.parse(localStorage.getItem('wallet'))?.id;
    const skip = 0;
    const limit = 10;

    // Fetch transactions using Axios
    axios
      .get(`/transactions?walletId=${walletId}&skip=${skip}&limit=${limit}`)
      .then((response) => {
        setTransactions(response.data);
      })
      .catch((error) => {
        console.error('Error fetching transactions:', error);
      });
  }, []);

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = transactions.map((transaction) => transaction.id);
      setSelected(newSelected);
    } else {
      setSelected([]);
    }
  };

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  return (
    <EnhancedTable
      rows={transactions}
      order={order}
      orderBy={orderBy}
      onRequestSort={handleRequestSort}
      onSelectAllClick={handleSelectAllClick}
      selected={selected}
      onClick={handleClick}
    />
  );
}

export default TransactionsPage;
