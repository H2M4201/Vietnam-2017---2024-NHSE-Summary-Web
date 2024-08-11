import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
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
        const responseData = response.data.data[0]; // Assuming data is in the first object

        // Transform the data into the format expected by PieChart
        const transformedData = [
          { name: 'Science', value: responseData.science },
          { name: 'Social', value: responseData.social },
          { name: 'Independent', value: responseData.independent },
          { name: 'Both', value: responseData.both },
        ];

        setData(transformedData);
        console.log("Transformed data:", transformedData);
      } catch (error) {
        console.error("Error fetching the data", error);
      }
    };

    if (province_code) {
      fetchData();
    }
  }, [year, province_code]);

  return (
    <ResponsiveContainer width="100%" height={400}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius="40%"
          outerRadius="70%"
          labelLine={false}
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}

export default CustomDonutChart;
