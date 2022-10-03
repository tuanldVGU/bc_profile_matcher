// import logo from './logo.svg';
import './App.css';
import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Movies from './pages/movies';
import Home from './pages/home';
import Maps from './pages/maps';
import VeridaLogin from './pages/veridaLogin';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/">
          <Route index element={<Home />} />
          <Route path="movies" element={<Movies />} />
          <Route path="maps" element={<Maps />} />
          <Route path="loginVerida" element={<VeridaLogin />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
 
}

export default App;
