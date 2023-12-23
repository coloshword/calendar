import React from 'react';
import './App.css';
import { Home } from './components/Home'
import { BrowserRouter as Router, Routes, Route, Link} from "react-router-dom"
import { Login } from './components/Login';
import { Register } from './components/Register';
import { Calendar } from './components/Calendar';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/register" element={<Register/>}/>
        <Route path="/calendar" element={<Calendar/>}/>
      </Routes>
    </Router>
  );
}

export default App;
