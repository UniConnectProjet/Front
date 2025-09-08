import React from 'react';
import PropTypes from 'prop-types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const JustificationPieChart = ({ data }) => {
  if (!data) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        Aucune donnée disponible
      </div>
    );
  }

  const pieData = [
    {
      name: 'Justifiées',
      value: data.justifiedAbsences,
      color: '#10b981'
    },
    {
      name: 'Non-justifiées',
      value: data.unjustifiedAbsences,
      color: '#ef4444'
    }
  ];

  // eslint-disable-next-line react/prop-types
  const CustomTooltip = ({ active, payload }) => {
    // eslint-disable-next-line react/prop-types
    if (active && payload && payload.length) {
      // eslint-disable-next-line react/prop-types
      const data = payload[0];
      const total = pieData.reduce((sum, item) => sum + item.value, 0);
      // eslint-disable-next-line react/prop-types
      const percentage = total > 0 ? ((data.value / total) * 100).toFixed(1) : 0;
      
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          {/* eslint-disable-next-line react/prop-types */}
          <p className="font-semibold text-gray-900">{data.name}</p>
          {/* eslint-disable-next-line react/prop-types */}
          <p className="text-sm" style={{ color: data.color }}>
            {/* eslint-disable-next-line react/prop-types */}
            {data.value} absences ({percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    if (percent < 0.05) return null; // Ne pas afficher les labels pour les petits segments
    
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize={12}
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={pieData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {pieData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            verticalAlign="bottom" 
            height={36}
            formatter={(value, entry) => (
              <span style={{ color: entry.color }}>{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

JustificationPieChart.propTypes = {
  data: PropTypes.shape({
    justifiedAbsences: PropTypes.number,
    unjustifiedAbsences: PropTypes.number
  })
};

export default JustificationPieChart;
