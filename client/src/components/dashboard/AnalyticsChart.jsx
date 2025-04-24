import * as React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

/**
 * A chart component for displaying analytics data
 */
const AnalyticsChart = ({ height = 300, data }) => {
  // Use provided data or fallback to demo data
  const chartData = data || [
    { name: 'Apr 15', pages: 3, updates: 5 },
    { name: 'Apr 16', pages: 1, updates: 3 },
    { name: 'Apr 17', pages: 0, updates: 2 },
    { name: 'Apr 18', pages: 2, updates: 1 },
    { name: 'Apr 19', pages: 0, updates: 0 },
    { name: 'Apr 20', pages: 1, updates: 4 },
    { name: 'Apr 21', pages: 0, updates: 3 },
    { name: 'Apr 22', pages: 3, updates: 7 },
  ];

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart
        data={chartData}
        margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
      >
        <defs>
          <linearGradient id="colorPages" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#FF6B00" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#FF6B00" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorUpdates" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#0F2B5B" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#0F2B5B" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
        <XAxis 
          dataKey="name" 
          fontSize={12}
          tickLine={false}
          axisLine={{ stroke: '#eaeaea' }}
          tick={{ fill: '#666' }}
        />
        <YAxis 
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tick={{ fill: '#666' }}
        />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: 'white', 
            borderColor: '#eaeaea',
            borderRadius: 4,
            boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
            fontSize: 12
          }} 
        />
        <Area 
          type="monotone" 
          dataKey="pages" 
          stroke="#FF6B00" 
          fillOpacity={1} 
          fill="url(#colorPages)" 
          strokeWidth={2}
          name="New Pages"
        />
        <Area 
          type="monotone" 
          dataKey="updates" 
          stroke="#0F2B5B" 
          fillOpacity={1} 
          fill="url(#colorUpdates)" 
          strokeWidth={2} 
          name="Page Updates"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default AnalyticsChart;