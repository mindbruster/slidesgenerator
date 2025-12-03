'use client';

import type { ChartDataPoint, ChartConfig, ChartType, ThemeColors } from '@/lib/types';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface ChartRendererProps {
  chartType: ChartType | null | undefined;
  chartData: ChartDataPoint[] | null | undefined;
  chartConfig: ChartConfig | null | undefined;
  colors: ThemeColors;
}

// Generate chart colors based on theme accent
function getChartColors(accent: string): string[] {
  return [
    accent, // theme accent
    '#0f0f0f', // primary dark
    '#6b7280', // gray
    '#fbbf24', // amber
    '#34d399', // emerald
    '#60a5fa', // blue
    '#f87171', // red
    '#a78bfa', // purple
  ];
}

/**
 * Shared chart renderer component for all themes.
 * Supports: bar, horizontal_bar, line, area, pie, donut
 */
export function ChartRenderer({ chartType, chartData, chartConfig, colors }: ChartRendererProps) {
  if (!chartData || chartData.length === 0) return null;

  const chartColors = getChartColors(colors.accent);
  const data = chartData.map((point, index) => ({
    ...point,
    fill: point.color || chartColors[index % chartColors.length],
  }));

  const showLegend = chartConfig?.show_legend ?? true;
  const showValues = chartConfig?.show_values ?? true;
  const tooltipStyle = {
    backgroundColor: colors.background,
    border: `2px solid ${colors.border_dark}`,
    borderRadius: '8px',
  };

  const renderContent = () => {
    switch (chartType) {
      case 'bar':
        return (
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={colors.border} />
            <XAxis dataKey="label" tick={{ fill: colors.text_primary }} />
            <YAxis
              tick={{ fill: colors.text_primary }}
              label={
                chartConfig?.y_axis_label
                  ? { value: chartConfig.y_axis_label, angle: -90, position: 'insideLeft' }
                  : undefined
              }
            />
            <Tooltip contentStyle={tooltipStyle} />
            {showLegend && <Legend />}
            <Bar
              dataKey="value"
              label={showValues ? { position: 'top', fill: colors.text_primary } : false}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} stroke={colors.border} strokeWidth={2} />
              ))}
            </Bar>
          </BarChart>
        );

      case 'horizontal_bar':
        return (
          <BarChart data={data} layout="vertical" margin={{ top: 20, right: 30, left: 60, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={colors.border} />
            <XAxis type="number" tick={{ fill: colors.text_primary }} />
            <YAxis dataKey="label" type="category" tick={{ fill: colors.text_primary }} width={80} />
            <Tooltip contentStyle={tooltipStyle} />
            {showLegend && <Legend />}
            <Bar
              dataKey="value"
              label={showValues ? { position: 'right', fill: colors.text_primary } : false}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} stroke={colors.border} strokeWidth={2} />
              ))}
            </Bar>
          </BarChart>
        );

      case 'line':
        return (
          <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={colors.border} />
            <XAxis dataKey="label" tick={{ fill: colors.text_primary }} />
            <YAxis tick={{ fill: colors.text_primary }} />
            <Tooltip contentStyle={tooltipStyle} />
            {showLegend && <Legend />}
            <Line
              type="monotone"
              dataKey="value"
              stroke={colors.accent}
              strokeWidth={3}
              dot={{ fill: colors.accent, stroke: colors.border, strokeWidth: 2, r: 6 }}
              activeDot={{ r: 8, stroke: colors.border, strokeWidth: 2 }}
            />
          </LineChart>
        );

      case 'area':
        return (
          <AreaChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={colors.border} />
            <XAxis dataKey="label" tick={{ fill: colors.text_primary }} />
            <YAxis tick={{ fill: colors.text_primary }} />
            <Tooltip contentStyle={tooltipStyle} />
            {showLegend && <Legend />}
            <Area
              type="monotone"
              dataKey="value"
              stroke={colors.accent}
              strokeWidth={2}
              fill={colors.accent}
              fillOpacity={0.3}
            />
          </AreaChart>
        );

      case 'pie':
      case 'donut':
        return (
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={chartType === 'donut' ? '40%' : 0}
              outerRadius="70%"
              dataKey="value"
              nameKey="label"
              label={showValues ? ({ name, value }) => `${name}: ${value}` : false}
              labelLine={showValues}
              stroke={colors.border}
              strokeWidth={2}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip contentStyle={tooltipStyle} />
            {showLegend && <Legend />}
          </PieChart>
        );

      default:
        return null;
    }
  };

  const chart = renderContent();
  if (!chart) return null;

  return (
    <ResponsiveContainer width="100%" height="100%">
      {chart}
    </ResponsiveContainer>
  );
}
