import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import '../style/home.css';
import TotalChart from "./TotalChart";
import MultiBarChart from "./MultibarChart";
import HistogramChart from "./HistogramChart";
import province from './province.json';
import config from "../config";

function Home() {
  const options = Object.keys(province).sort().map(function(key){
    return province[key];
  });

  const [selectedValue, setSelectedValue] = useState("");
  const [provinceCode, setProvinceCode] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [chartData, setChartData] = useState(null);
  const [CategoryData, setCategoryData] = useState(null);


  const handleInputChange = (event) => {
    setSelectedValue(event.target.value);
    setIsOpen(true);
  };

  const handleInputFocus = () => {
    setIsOpen(true);
  };

  const handleSearchClick = () => {
    const provinceCodeKey = Object.keys(province).find(key => province[key] === selectedValue);
    setProvinceCode(provinceCodeKey);
    setIsOpen(false);
    console.log(provinceCode, provinceCodeKey)
  };

  useEffect(() => {
    if (provinceCode !== null) {
      const fetchData = async () => {
        try {
          const response = await axios.get(`http://localhost:9900/get_participants/${provinceCode}`);
          setChartData(response.data);
        } catch (error) {
          console.error("Error fetching the data", error);
        }
      };

      fetchData();
    }
  }, [provinceCode]);


  useEffect(() => {
    if (provinceCode !== null) {
      const fetchData = async () => {
        try {
          const response = await axios.get(`http://localhost:9900/get_category/${provinceCode}`);
          setCategoryData(response.data);
        } catch (error) {
          console.error("Error fetching the data", error);
        }
      };

      fetchData();
    }
  }, [provinceCode]);


  return (
    <>
      <div className="home-body">
        <h1 className="home-title">TỔNG QUAN KỲ THI THPT QUỐC GIA GIAI ĐOẠN 2017 - 2024</h1>
        <div className="search-box">
          <input 
            list="options" 
            type="text"
            placeholder="Chọn địa phương" 
            className="search-input" 
            value={selectedValue} 
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            onClick={handleSearchClick} 
          />
          <datalist id="options">
            {options.map((option, index) => (
              <option key={index} value={option} />
            ))}
          </datalist> 
          <button className="search-button" onClick={handleSearchClick}>
            <img src="magnifier.png" alt="Search" className="search-icon" />
          </button>
          <div className="selected-value-box">{selectedValue}</div>
        </div>

        <h2 className="context-title">SỐ LƯỢNG HỌC SINH THAM DỰ</h2>
        <div className="charts-row">
          <div className="chart-container">
            <TotalChart data={chartData}/>
          </div>
          <div className="chart-container">
            <MultiBarChart  />
          </div>
        </div>
        <h2 className="context-title">MÔN TOÁN</h2>
        <div className="charts-row">
          <div className="chart-container">
            <HistogramChart/>
          </div>
          <div className="chart-container">
            <HistogramChart/>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
