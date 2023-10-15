import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './HomePage/HomePage';
import TransactionsPage from './TransactionsPage/TransactionsPage';
import Navbar from './NavBar/NavBar';
import './index.css'
import './App.css'

function App() {
  return (
    <div>
      <Navbar/>
      <Router> 
        <div className="App">
        <Routes> 
                <Route exact path='/' element={< HomePage />}></Route> 
                <Route exact path='/transactions' element={< TransactionsPage />}></Route> 
        </Routes> 
        </div>
    </Router> 
    </div>    
)}

export default App;
