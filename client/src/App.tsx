import React, { useState } from 'react';
import logo from './logo.svg';
import Header from './Header';
import './App.css';
import Footer from './Footer';
import Login from './Login';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './Register';
import { AuthProvider } from './Authcontext';

function App() {
  return (
    <Router>
      <AuthProvider>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Login/>} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </main>
        <Footer />
      </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
