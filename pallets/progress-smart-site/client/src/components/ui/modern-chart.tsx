import React from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Modern Chart Color Scheme - single color fills instead of gradients
const CHART_COLORS = {
  primary: '#60A5FA', // Medium blue
  secondary: '#93C5FD', // Light blue
  accent: '#14B8A6', // Teal for AI tools
  success: '#10B981', // Green
  warning: '#FBBF24', // Yellow
  danger: '#F43F5E', // Red
  neutral: '#94A3B8' // Gray
};

interface ModernLineChartProps {
  data: any[];
  dataKeys: string[];
  height?: number | string;
  width?: number | string;
  xAxisKey?: string;
  hideLegend?: boolean;
  hideGrid?: boolean;
  hideTooltip?: boolean;
}

export const ModernLineChart: React.FC<ModernLineChartProps> = ({
  data,
  dataKeys,
  height = 300,
  width = '100%',
  xAxisKey = 'name',
  hideLegend = false,
  hideGrid = false,
  hideTooltip = false
}) => {
  return (
    <ResponsiveContainer width={width} height={height}>
      <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
        {!hideGrid && <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />}
        <XAxis dataKey={xAxisKey} stroke="#94A3B8" fontSize={12} />
        <YAxis stroke="#94A3B8" fontSize={12} />
        {!hideTooltip && <Tooltip />}
        {!hideLegend && <Legend />}
        {dataKeys.map((key, index) => (
          <Line
            key={key}
            type="monotone"
            dataKey={key}
            stroke={Object.values(CHART_COLORS)[index % Object.values(CHART_COLORS).length]}
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6, strokeWidth: 0 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
};

interface ModernBarChartProps {
  data: any[];
  dataKeys: string[];
  height?: number | string;
  width?: number | string;
  xAxisKey?: string;
  hideLegend?: boolean;
  hideGrid?: boolean;
  hideTooltip?: boolean;
  stacked?: boolean;
}

export const ModernBarChart: React.FC<ModernBarChartProps> = ({
  data,
  dataKeys,
  height = 300,
  width = '100%',
  xAxisKey = 'name',
  hideLegend = false,
  hideGrid = false,
  hideTooltip = false,
  stacked = false
}) => {
  return (
    <ResponsiveContainer width={width} height={height}>
      <BarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
        {!hideGrid && <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />}
        <XAxis dataKey={xAxisKey} stroke="#94A3B8" fontSize={12} />
        <YAxis stroke="#94A3B8" fontSize={12} />
        {!hideTooltip && <Tooltip />}
        {!hideLegend && <Legend />}
        {dataKeys.map((key, index) => (
          <Bar
            key={key}
            dataKey={key}
            fill={Object.values(CHART_COLORS)[index % Object.values(CHART_COLORS).length]}
            stackId={stacked ? "stack" : undefined}
            radius={[4, 4, 0, 0]}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
};

export { CHART_COLORS };