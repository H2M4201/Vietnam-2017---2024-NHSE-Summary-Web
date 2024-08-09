import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../style/home.css';
import TotalChart from "./TotalChart";
import MultiBarChart from "./MultiBarChart";
import HistogramChart from "./HistogramChart";
import province from './province.json';

function Home() {
  const options = Object.keys(province).sort().map(function(key){
    return province[key];
  });

  // Set the default provinceCode to '0' when the component is first loaded
  const [selectedValue, setSelectedValue] = useState(province['0']);
  const [provinceCode, setProvinceCode] = useState('0');
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
    const currentValue = selectedValue;  // Capture the current value
    const provinceCodeKey = Object.keys(province).find(key => province[key] === currentValue);
    setProvinceCode(provinceCodeKey);
    setIsOpen(false);
    console.log("Selected Value:", currentValue, "Province Code:", provinceCodeKey);
  };


  useEffect(() => {
    if (provinceCode !== null) {
      const fetchData = async () => {
        try {
          const response = await axios.get(`http://localhost:9900/get_category/${provinceCode}`);
          setCategoryData(response.data.data);
          console.log("Fetched Category Data:", response.data.data);
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
            <TotalChart province_code={provinceCode}/>
          </div>
          <div className="chart-container">
            <MultiBarChart />
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
