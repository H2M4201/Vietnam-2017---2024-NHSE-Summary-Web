import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import '../style/searchByYear.css';
import province from './province.json'; // Import the province data

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

const ExamResult = () => {
  const { year } = useParams();
  const [resultData, setResultData] = useState({ id: '', scores: {} });
  const [inputValue, setInputValue] = useState('');
  const [id, setId] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [success, setSuccess] = useState(false);
  const [provinceName, setProvinceName] = useState(''); // State to hold province name

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      setId(inputValue);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        try {
          const response = await axios.get(`http://localhost:9902/searchStudent/${year}/${id}`);
          const data = response.data.data;

          // Filter out sbd and year, and set the rest as scores
          const scores = Object.keys(data).reduce((acc, key) => {
            if (key !== 'sbd' && key !== 'year') {
              acc[key] = data[key];
            }
            return acc;
          }, {});

          setResultData({
            id: data.sbd,  // Set the id attribute
            year: data.year,
            scores: scores
          });

          const provinceCode = data.sbd.substring(0, 2);  // Extract the first 2 characters
          setProvinceName(province[provinceCode]);  // Update the province name

          setSuccess(response.data.success);
          setErrorMessage('');
        } catch (error) {
          if (error.response && error.response.status === 404) {
            setErrorMessage("Không tìm thấy số báo danh");
            setResultData({ id: '', scores: {} });
            setSuccess(false);
          } else {
            console.error("Error fetching the data", error);
            setErrorMessage("Đã xảy ra lỗi khi tìm kiếm");
            setSuccess(false);
          }
        }
      }
    };

    fetchData();
  }, [id, year]);

  return (
    <>
      <h1 className="home-title">TRA CỨU ĐIỂM THI THPT QUỐC GIA {year}</h1>
      <div className="search-box">
        <input 
          type="text"
          placeholder="Nhập số báo danh" 
          className="search-input" 
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
        />
      </div>
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      {success && (
        <div className="result-container">
          <div className="left-box">
            <h3>{provinceName}</h3>  {/* Display the province name */}
            <h2>Số báo danh</h2>
            <p className="id-number">{resultData.id}</p>
          </div>
          <div className="right-table">
            <table>
              <thead>
                <tr>
                  <th className='subject'>Môn</th>
                  <th className='score'>Điểm</th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(resultData.scores).map((subject) => (
                  <tr key={subject}>
                    <td>{mapping_name[subject]}</td>  {/* Display the value from X */}
                    <td>{resultData.scores[subject]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
};

export default ExamResult;
