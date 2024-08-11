import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const CustomDonutChart = ({ province_code }) => {
  const { year } = useParams();  // Extract 'year' from URL parameters
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:9900/get_category_by_year/${year}/${province_code}`);
        setData(response.data.data);
        console.log("Fetched data:", response.data.data);
      } catch (error) {
        console.error("Error fetching the data", error);
      }
    };

    if (province_code) {
      fetchData();
    }
  }, [year, province_code]);

  return (
    <PieChart width={400} height={400}>
      <Pie
        data={Array.isArray(data) ? data : []}
        cx={200}
        cy={200}
        innerRadius={70}
        outerRadius={150}
        labelLine={false}
        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
        fill="#8884d8"
        dataKey="value"
      >
        {Array.isArray(data) && data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
      <Legend />
    </PieChart>
  );
}

export default CustomDonutChart;
