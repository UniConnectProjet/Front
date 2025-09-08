import React from 'react';
import PropTypes from 'prop-types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const AttendanceByClassChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        Aucune donnée disponible
      </div>
    );
  }

  const chartData = data.map(item => ({
    className: item.className,
    totalAbsences: item.totalAbsences,
    justifiedAbsences: item.justifiedAbsences,
    unjustifiedAbsences: item.unjustifiedAbsences,
    attendanceRate: item.attendanceRate
  }));

  // eslint-disable-next-line react/prop-types
  const CustomTooltip = ({ active, payload, label }) => {
    // eslint-disable-next-line react/prop-types
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900">{label}</p>
          {/* eslint-disable-next-line react/prop-types */}
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="className" 
            stroke="#6b7280"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis 
            stroke="#6b7280"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar 
            dataKey="totalAbsences" 
            fill="#ef4444" 
            name="Total absences"
            radius={[2, 2, 0, 0]}
          />
          <Bar 
            dataKey="justifiedAbsences" 
            fill="#10b981" 
            name="Justifiées"
            radius={[2, 2, 0, 0]}
          />
          <Bar 
            dataKey="unjustifiedAbsences" 
            fill="#f59e0b" 
            name="Non-justifiées"
            radius={[2, 2, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

AttendanceByClassChart.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({
    className: PropTypes.string,
    totalAbsences: PropTypes.number,
    justifiedAbsences: PropTypes.number,
    unjustifiedAbsences: PropTypes.number,
    attendanceRate: PropTypes.number
  }))
};

export default AttendanceByClassChart;
