import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';

const LineChartComponent = ({ data, yAxisLabel, lineColor = "#8884d8", title, straightLine = false }) => (
  <div className="chart-container">
    <h3 
      className="chart-title" 
      style={{
        marginTop: '10px',   // Adjust top margin as needed
        marginBottom: '10px', // Adjust bottom margin as needed
        paddingBottom: '0px', // Optional: Add padding at the bottom
        textAlign: 'center', // Center the title
      }}
    >
      {title}
    </h3>
    <ResponsiveContainer width="100%" height={400}>
      <LineChart
        data={data}
        margin={{
          top: 20, right: 30, left: 20, bottom: 5,
        }}
      >
        <XAxis dataKey="name" />
        <YAxis label={{ value: yAxisLabel, angle: -90, position: "insideLeft" }} />
        <Tooltip />
        <Legend />
        <Line 
          type={straightLine ? "linear" : "monotone"} 
          dataKey="value" 
          stroke={lineColor} 
          strokeWidth={4}  // Make the line thicker
          dot={{ r: 5 }}   // Increase the size of the dots
        />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

export default LineChartComponent;
