// HistogramChart.js
import React from 'react';
import {
  BarChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';

const HistogramChart = ({ data, xAxisLabel, yAxisLabel, barColor = "#8884d8", lineColor = "#ff7300" }) => (
  <ResponsiveContainer width="100%" height={400}>
    <BarChart
      data={data}
      margin={{
        top: 20, right: 30, left: 20, bottom: 5,
      }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" label={{ value: xAxisLabel, position: "insideBottomRight", offset: 0 }} />
      <YAxis label={{ value: yAxisLabel, angle: -90, position: "insideLeft" }} />
      <Tooltip />
      <Legend />
      <Bar dataKey="value" fill={barColor} />
      <Line type="monotone" dataKey="value" stroke={lineColor} dot={false} />
    </BarChart>
  </ResponsiveContainer>
);

export default HistogramChart;
