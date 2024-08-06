import React, { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ComposedChart } from 'recharts';
import axios from 'axios';

const TotalChart = ({ province_code }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:9900/get_participants/${province_code}`);
        setData(response.data);
        console.log(data)
      } catch (error) {
        console.error("Error fetching the data", error);
      }
    };

    fetchData();
  }, [province_code]);

  return (
    <ComposedChart
      width={600}
      height={400}
      data={data}
      margin={{
        top: 20, right: 30, left: 20, bottom: 5,
      }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="year" />
      <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
      <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
      <Tooltip />
      <Legend />
      <Bar yAxisId="left" dataKey="sessions" fill="#8884d8" />
      <Line yAxisId="right" type="monotone" dataKey="pageViews" stroke="#82ca9d" />
    </ComposedChart>
  );
};

export default TotalChart;
