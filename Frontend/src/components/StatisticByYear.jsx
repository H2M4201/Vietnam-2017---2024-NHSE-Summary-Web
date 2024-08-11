import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import '../style/statByYear.css';
import CustomDonutChart from "./PieChart";
import province from './province.json';

const StatisticByYear = () => {
  const { year } = useParams();
  const options = Object.keys(province).sort().map(function(key){
    return province[key];
  });

  // Set the default provinceCode to '0' when the component is first loaded
  const [selectedValue, setSelectedValue] = useState(province['0']);
  const [provinceCode, setProvinceCode] = useState('0');
  const [isOpen, setIsOpen] = useState(false);
  const [summaryData, setSummaryData] = useState({
    expected: 0,
    actual: 0,
    participationRate: 0,
  });

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
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:9900/get_participants_by_year/${year}/${provinceCode}`);
        const data = response.data.data;
        console.log("response: ", data);
  
        setSummaryData({
          expected: data.expected,
          actual: data.actual,
          participationRate: data.percentage
        });
        console.log("fetch", summaryData);

      } catch (error) {
        console.error("Error fetching the data", error);
      }
    };
  
    fetchData();
  }, [year, provinceCode]);

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
      <Summary summaryData={summaryData} provinceCode={provinceCode} />
      <Charts />
    </div>
  );
};

const Summary = ({ summaryData, provinceCode }) => (
  <div className="summary-container">
    <SummaryCard title="TỔNG SỐ THÍ SINH ĐĂNG KÝ" value={summaryData.expected} />
    <SummaryCard title="TỔNG SỐ BÀI THI GHI NHẬN" value={summaryData.actual} />
    <SummaryCard title="TỶ LỆ THAM DỰ" value={`${summaryData.participationRate}%`} />
    <CustomDonutChart province_code={provinceCode} />
  </div>
);

const SummaryCard = ({ title, value }) => (
  <div className="summary-card">
    <h2>{title}</h2>
    <p>{value}</p>
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
