import React, { useMemo, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

import Home from "./components/Home";
import Navbar from "./components/Navbar";
import StatisticByYear from "./components/StatisticByYear";


function App() {

  return (
    <div style={{backgroundColor: "#f5f5f5", minHeight: "100vh"}}>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/StatisticByYear" element={<StatisticByYear/>} />
          {/* other routes */}
        </Routes>
      </Router>
    </div>
  );
}

export default App;
