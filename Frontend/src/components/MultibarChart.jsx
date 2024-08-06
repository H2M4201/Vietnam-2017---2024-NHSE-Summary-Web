// MultiBarChart.js
import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';

const data = [
  {
    name: '1.0', A: 400, B: 200, C: 400,
  },
  {
    name: '2.0', A: 300, B: 300, C: 400,
  },
  {
    name: '3.0', A: 200, B: 400, C: 400,
  },
  {
    name: '4.0', A: 300, B: 300, C: 400,
  },
  {
    name: '5.0', A: 400, B: 200, C: 400,
  },
];

const MultiBarChart = () => (
  <ResponsiveContainer width="100%" height={400}>
    <BarChart
      data={data}
      margin={{
        top: 10, right: 30, left: 0, bottom: 0,
      }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar dataKey="A" fill="#8884d8" />
      <Bar dataKey="B" fill="#82ca9d" />
      <Bar dataKey="C" fill="#ffc658" />
    </BarChart>
  </ResponsiveContainer>
);

export default MultiBarChart;
