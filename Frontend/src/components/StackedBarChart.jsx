import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const StackedAreaChart = ({ province_code }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:9900/get_category/${province_code}`);
        setData(response.data.data);
        console.log("MultiBar Chart Data (Percentage): ", normalizedData);
      } catch (error) {
        console.error("Error fetching the multi-bar chart data", error);
      }
    };

    if (province_code !== null) {
      fetchData();
    }
  }, [province_code]);

  return (
    <div className="chart-container">
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={data}
          margin={{
            top: 20, right: 30, left: 20, bottom: 5,
          }}
        >

          <XAxis dataKey="year" />
          <YAxis tickFormatter={(value) => `${value}`} /> {/* Display Y-axis values as percentages */}
          <Tooltip formatter={(value) => `${value}`} /> {/* Format tooltip values as percentages */}
          <Legend />
          <Bar dataKey="science" stackId="1" fill="#ff1a1a" name="KHTN"/>
          <Bar dataKey="social" stackId="1" fill="#4d4dff" name="KHXH"/>
          <Bar dataKey="both" stackId="1" fill="#c2c2a3" name = "KHTN+KHXH"/>
          <Bar dataKey="independent" stackId="1" fill="#33cc33" name="Thí sinh tự do"/>
        </BarChart>
      </ResponsiveContainer>
      <h3 className="chart-title">Phân bổ thí sinh theo tổ hợp</h3>
    </div>
  );
};

export default StackedAreaChart;
