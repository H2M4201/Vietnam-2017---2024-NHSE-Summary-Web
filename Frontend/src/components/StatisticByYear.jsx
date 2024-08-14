import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import '../style/statByYear.css';
import CustomDonutChart from "./PieChart";
import province from './province.json';
import HistogramChart from './HistogramChart'; // Import the HistogramChart component

const mapping_name = {
  "toan": "Toán",
  "van": "Văn",
  "ngoaiNgu": "Ngoại ngữ",
  "vatLy": "Vật Lý",
  "hoaHoc": "Hóa Học",
  "sinhHoc": "Sinh học",
  "diemTBTuNhien": "Khoa học Tự nhiên",
  "lichSu": "Lịch sử",
  "diaLy": "Địa lý",
  "gdcd": "Giáo dục Công dân",
  "diemTBXaHoi": "Khoa học Xã hội"
};

const StatisticByYear = () => {
  const { year } = useParams();
  const options = Object.keys(province).sort().map(function(key){
    return province[key];
  });

  const [selectedValue, setSelectedValue] = useState(province['0']);
  const [provinceCode, setProvinceCode] = useState('0');
  const [isOpen, setIsOpen] = useState(false);
  const [summaryData, setSummaryData] = useState({
    expected: 0,
    actual: 0,
    participationRate: 0,
  });
  const [histogramData, setHistogramData] = useState({}); // State to store histogram data

  const handleInputChange = (event) => {
    setSelectedValue(event.target.value);
    setIsOpen(true);
  };

  const handleInputFocus = () => {
    setIsOpen(true);
  };

  const handleSearchClick = () => {
    const currentValue = selectedValue;
    const provinceCodeKey = Object.keys(province).find(key => province[key] === currentValue);
    setProvinceCode(provinceCodeKey);
    setIsOpen(false);
  };

  // Fetch summary data
  useEffect(() => {
    const fetchSummaryData = async () => {
      try {
        const response = await axios.get(`http://localhost:9900/get_participants_by_year/${year}/${provinceCode}`);
        const data = response.data.data;
        
        setSummaryData({
          expected: data.expected,
          actual: data.actual,
          participationRate: data.percentage
        });
      } catch (error) {
        console.error("Error fetching the data", error);
      }
    };
  
    fetchSummaryData();
  }, [year, provinceCode]);

// Fetch histogram data
useEffect(() => {
  const fetchHistogramData = async () => {
    try {
      const response = await axios.get(`http://localhost:9901/get_score_distribution/${year}/${provinceCode}`);
      const data = response.data.data;

      // Exclude 'year', 'province_code', and 'success' and transform the remaining data
      const excludedKeys = ['year', 'province_code', 'success', "total"];
      const transformedData = {};

      Object.keys(data).forEach(subject => {
        if (!excludedKeys.includes(subject)) {
          transformedData[subject] = Object.entries(data[subject])
            .map(([score, count]) => ({
              name: parseFloat(score),  // Convert score to float
              value: count,
            }))
            .sort((a, b) => a.name - b.name);  // Sort by score (numeric order)
        }
      });

      setHistogramData(transformedData);
      console.log("Transformed Histogram Data: ", transformedData);

    } catch (error) {
      console.error("Error fetching the data", error);
    }
  };

  fetchHistogramData();
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
      <Charts histogramData={histogramData} />
    </div>
  );
};

const Summary = ({ summaryData, provinceCode }) => (
  <div className="summary-container">
    <div className="summary-cards-column">
      <SummaryCard title="TỔNG SỐ THÍ SINH ĐĂNG KÝ" value={summaryData.expected} />
      <SummaryCard title="TỔNG SỐ BÀI THI GHI NHẬN" value={summaryData.actual} />
      <SummaryCard title="TỶ LỆ THAM DỰ" value={`${summaryData.participationRate}%`} />
    </div>
    <div className="donut-chart-column">
      <CustomDonutChart province_code={provinceCode} />
    </div>
  </div>
);

const SummaryCard = ({ title, value }) => (
  <div className="summary-card">
    <h3>{title}</h3>
    <p>{value}</p>
  </div>
);

const Charts = ({ histogramData }) => (
  <div className="charts-grid">
    {Object.keys(histogramData).map(subject => (
      <Chart key={subject} title={`Phổ điểm môn ${mapping_name[subject]}`} data={histogramData[subject]} />
    ))}
  </div>
);

const Chart = ({ title, data }) => (
  <div className="chart">
    <h3 className="chart-title">{title}</h3>
    <HistogramChart data={data} />
  </div>
);

const SummaryTable = ({}) => (
  <div className="summary-table">
  <h3>Summary for {mapping_name[subject]}</h3>
  <table>
    <thead>
      <tr>
        <th>Year</th>
        <th>Value</th>
      </tr>
    </thead>
    <tbody>
      {data.map((row, index) => (
        <tr key={index}>
          <td>{row.name}</td>
          <td>{row.value}</td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
);


export default StatisticByYear;
