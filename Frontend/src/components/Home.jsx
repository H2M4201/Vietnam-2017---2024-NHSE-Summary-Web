import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../style/home.css';
import TotalChart from "./TotalChart";
import StackedAreaChart from "./StackedBarChart";
import HistogramChart from "./HistogramChart";
import LineChartComponent from "./LineChart";  // Import the LineChartComponent
import province from './province.json';

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

const chart_mapping = {
  'total': "Tổng số bài thi",
  'average': "Điểm trung bình",
  'mode': "Điểm nhiều thí sinh đạt được nhất",
  'underAverage': "Số bài thi dưới trung bình",
  'good': "Số bài thi từ 9 điểm trở lên",
  'unqualified': "Số bài thi điểm liệt"
};


function Home() {
  const options = Object.keys(province).sort().map(function(key){
    return province[key];
  });

  const [selectedValue, setSelectedValue] = useState(province['0']);
  const [provinceCode, setProvinceCode] = useState('0');
  const [isOpen, setIsOpen] = useState(false);
  const [histogramData, setHistogramData] = useState(null);

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

  useEffect(() => {
    const fetchHistogramData = async () => {
      try {
        const response = await axios.get(`http://localhost:9901/get_key_stat/${provinceCode}`);
        setHistogramData(response.data.data);
        console.log("Fetched histogram data:", response.data.data);
      } catch (error) {
        console.error("Error fetching histogram data", error);
      }
    };

    if (provinceCode) {
      fetchHistogramData();
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
            <StackedAreaChart province_code={provinceCode}/>
          </div>
        </div>

        {histogramData && Object.keys(histogramData).map((subject, idx) => (
          <div key={idx} className="subject-section">
            <h2 className="context-title">MÔN {mapping_name[subject]}</h2>
            <div className="grid-container">
            {["total", "average", "mode"].map((key, i) => (
              <div className="chart-grid-item" key={i}>
                <HistogramChart
                  data={Object.keys(histogramData[subject][key]).map(year => ({
                    name: year,
                    value: histogramData[subject][key][year],
                  }))}
                  title={`${chart_mapping[key]}`}
                />
              </div>
            ))}
          {["underAverage", "unqualified", "good"].map((key, i) => (
            <div className="chart-grid-item" key={i}>
              <LineChartComponent
                data={Object.keys(histogramData[subject][key]).map(year => ({
                  name: year,
                  value: histogramData[subject][key][year],
                }))}
                title={`${chart_mapping[key]}`}
                yAxisLabel="Số lượng"
                straightLine={true}  // Pass a prop to make the line straight
          />
        </div>
      ))}
    </div>
  </div>
))}
      </div>
    </>
  );
}

export default Home;
