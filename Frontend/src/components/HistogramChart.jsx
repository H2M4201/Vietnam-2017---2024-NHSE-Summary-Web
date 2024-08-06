// HistogramChart.js
import React from 'react';
import {
  BarChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';

const data = [
  { name: '0', value: 1000 },
  { name: '1', value: 2000 },
  { name: '2', value: 5000 },
  { name: '3', value: 10000 },
  { name: '4', value: 20000 },
  { name: '5', value: 40000 },
  { name: '6', value: 30000 },
  { name: '7', value: 20000 },
  { name: '8', value: 10000 },
  { name: '9', value: 5000 },
  { name: '10', value: 1000 },
];

const HistogramChart = () => (
  <ResponsiveContainer width="100%" height={400}>
    <BarChart
      data={data}
      margin={{
        top: 20, right: 30, left: 20, bottom: 5,
      }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" label={{ value: "Điểm số", position: "insideBottomRight", offset: 0 }} />
      <YAxis label={{ value: "Số lượng thí sinh", angle: -90, position: "insideLeft" }} />
      <Tooltip />
      <Legend />
      <Bar dataKey="value" fill="#8884d8" />
      <Line type="monotone" dataKey="value" stroke="#ff7300" dot={false} />
    </BarChart>
  </ResponsiveContainer>
);

export default HistogramChart;
