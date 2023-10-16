import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './HomePage/HomePage';
import TransactionsPage from './TransactionsPage/TransactionsPage';
import Navbar from './NavBar/NavBar';
import { ToastContainer } from 'react-toastify';
import './index.css';
import './App.css';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <div>
      <Router>
      <Navbar />
        <div className="App">
          <Routes>
            <Route exact path='/' element={<HomePage />} />
            <Route exact path='/transactions' element={<TransactionsPage />} />
          </Routes>
        </div>
      </Router>
      <ToastContainer />
    </div>
  );
}

export default App;
