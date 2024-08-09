import React from 'react';
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const ExamResult = () => {
  const { year } = useParams();
  return (
    <div className="exam-result-container">
      <h1 className="home-title">TRA CỨU ĐIỂM THI THPT QUỐC GIA {year}</h1>
        <div className="search-box">
          <input 
            list="options" 
            type="text"
            placeholder="Chọn địa phương" 
            className="search-input" 
          />
      <div className="result-container">
        <div className="exam-info">
          <h2>Số báo danh</h2>
          <p className="exam-number">02005907</p>
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
              <tr>
                <td>Toán</td>
                <td>9</td>
              </tr>
              <tr>
                <td>Lí</td>
                <td>8</td>
              </tr>
              <tr>
                <td>Hóa</td>
                <td>5.25</td>
              </tr>
              <tr>
                <td>Sinh</td>
                <td>6.5</td>
              </tr>
              <tr>
                <td>Văn</td>
                <td>5.25</td>
              </tr>
              <tr>
                <td>Ngoại ngữ</td>
                <td>8.6</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
  );
};

export default ExamResult;
