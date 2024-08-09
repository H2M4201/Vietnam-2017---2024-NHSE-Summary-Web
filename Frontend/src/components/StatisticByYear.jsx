import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import '../style/statByYear.css';
import config from "../config";
import province from './province.json';


const StatisticByYear = () => {
  const { year } = useParams();
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

  return (
    <div className="home-body">
        <h1 className="home-title">THỐNG KÊ KỲ THI THPT QUỐC GIA {year}</h1>
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
      <Summary />
      <Charts />
    </div>
  );
};


const SearchBox = () => (
  <div className="search-container">
    <input type="text" className="search-box" placeholder="Chọn địa phương" />
    <button className="search-button">Cả nước</button>
  </div>
);

const Summary = () => (
  <div className="summary-container">
    <SummaryCard title="TỔNG SỐ THÍ SINH ĐĂNG KÝ" value="923802" />
    <SummaryCard title="TỔNG SỐ BÀI THI GHI NHẬN" value="920001" />
    <SummaryCard title="TỶ LỆ THAM DỰ" value="99.59%" />
    <PieChart />
  </div>
);

const SummaryCard = ({ title, value }) => (
  <div className="summary-card">
    <h2>{title}</h2>
    <p>{value}</p>
  </div>
);

const PieChart = () => (
  <div className="pie-chart">
    <h2>PHÂN LOẠI</h2>
    <img src="pie_chart.png" alt="Pie Chart" />
  </div>
);

const Charts = () => (
  <div className="charts-container">
    <Chart title="Phổ điểm môn Toán" />
    <Chart title="Phổ điểm môn Ngữ Văn" />
    <Chart title="Phổ điểm môn Ngoại Ngữ" />
  </div>
);

const Chart = ({ title }) => (
  <div className="chart">
    <h3>{title}</h3>
    <img src="bar_chart.png" alt={title} />
    <DataTable />
  </div>
);

const DataTable = () => (
  <table className="data-table">
    <thead>
      <tr>
        <th>Thông số</th>
        <th>Giá trị</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Tổng số bài thi</td>
        <td>915,645</td>
      </tr>
      <tr>
        <td>Điểm trung bình</td>
        <td>4.85</td>
      </tr>
      <tr>
        <td>Mức điểm có nhiều thí sinh đạt được nhất</td>
        <td>5.4</td>
      </tr>
      <tr>
        <td>Số bài thi bị điểm liệt</td>
        <td>1,537</td>
      </tr>
    </tbody>
  </table>
);

export default StatisticByYear;
