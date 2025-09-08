import React from 'react';
import PropTypes from 'prop-types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const AttendanceStatsChart = ({ data }) => {
  if (!data || !data.data) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        Aucune donnée disponible
      </div>
    );
  }

  const chartData = data.data.map(item => ({
    period: item.period,
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
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="period" 
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
          <Line 
            type="monotone" 
            dataKey="totalAbsences" 
            stroke="#ef4444" 
            strokeWidth={2}
            name="Total absences"
            dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
          />
          <Line 
            type="monotone" 
            dataKey="justifiedAbsences" 
            stroke="#10b981" 
            strokeWidth={2}
            name="Absences justifiées"
            dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
          />
          <Line 
            type="monotone" 
            dataKey="unjustifiedAbsences" 
            stroke="#f59e0b" 
            strokeWidth={2}
            name="Absences non-justifiées"
            dot={{ fill: '#f59e0b', strokeWidth: 2, r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

AttendanceStatsChart.propTypes = {
  data: PropTypes.shape({
    data: PropTypes.arrayOf(PropTypes.shape({
      period: PropTypes.string,
      totalAbsences: PropTypes.number,
      justifiedAbsences: PropTypes.number,
      unjustifiedAbsences: PropTypes.number,
      attendanceRate: PropTypes.number
    }))
  })
};

export default AttendanceStatsChart;
