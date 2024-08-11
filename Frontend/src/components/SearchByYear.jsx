import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const ExamResult = () => {
  const { year } = useParams();
  const [resultData, setResultData] = useState({ id: '', scores: {} });
  const [inputValue, setInputValue] = useState('');
  const [id, setId] = useState('');
  const [errorMessage, setErrorMessage] = useState('');  // State to hold the error message
  const [success, setSuccess] = useState(false);  // State to hold the success status

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      setId(inputValue);  // Update the ID when Enter is pressed
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

          setSuccess(response.data.success);  // Set the success status
          setErrorMessage('');  // Clear any previous error message
        } catch (error) {
          if (error.response && error.response.status === 404) {
            setErrorMessage("Không tìm thấy số báo danh");  // Set error message
            setResultData({ id: '', scores: {} });  // Clear result data
            setSuccess(false);  // Set success to false
          } else {
            console.error("Error fetching the data", error);
            setErrorMessage("Đã xảy ra lỗi khi tìm kiếm");  // Set a generic error message
            setSuccess(false);  // Set success to false
          }
        }
      }
    };

    fetchData();
  }, [id, year]);  // Trigger the fetch whenever id or year changes

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
          onKeyDown={handleKeyDown}  // Listen for Enter key press
        />
      </div>
      {errorMessage && <div className="error-message">{errorMessage}</div>}  {/* Display error message if any */}
      {success && (
        <div className="result-container">  {/* Conditionally render the result container */}
          <div className="exam-info">
            <h2>Số báo danh</h2>
            <p className="exam-number">{resultData.id}</p>
            <h3>Sở GD&ĐT Thành Phố Hồ Chí Minh</h3>
          </div>
          <div className="scores-table">
            <table>
              <thead>
                <tr>
                  <th>Môn</th>
                  <th>Điểm</th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(resultData.scores).map((subject) => (
                  <tr key={subject}>
                    <td>{subject}</td>
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
