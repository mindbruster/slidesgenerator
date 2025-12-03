"use client";

import { cn } from "@/lib/utils/cn";
import type { Slide, ChartDataPoint, ChartConfig, ChartType } from "@/lib/types";
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
} from "recharts";

// Chart color palette matching neobrutalism design
const CHART_COLORS = [
  "#ff90e8", // accent-pink
  "#0f0f0f", // primary dark
  "#6b7280", // gray
  "#fbbf24", // amber
  "#34d399", // emerald
  "#60a5fa", // blue
  "#f87171", // red
  "#a78bfa", // purple
];

interface SlidePreviewProps {
  slide: Slide;
  onEditTitle?: (value: string) => void;
  onEditSubtitle?: (value: string) => void;
  onEditBody?: (value: string) => void;
  onEditBullet?: (index: number, value: string) => void;
  onEditQuote?: (value: string) => void;
  onEditAttribution?: (value: string) => void;
  onEditChartData?: (data: ChartDataPoint[]) => void;
  isEditable?: boolean;
}

// Helper function to render chart based on type
function renderChart(
  chartType: ChartType | null | undefined,
  chartData: ChartDataPoint[] | null | undefined,
  chartConfig: ChartConfig | null | undefined
) {
  if (!chartData || chartData.length === 0) return null;

  const data = chartData.map((point, index) => ({
    ...point,
    fill: point.color || CHART_COLORS[index % CHART_COLORS.length],
  }));

  const showLegend = chartConfig?.show_legend ?? true;
  const showValues = chartConfig?.show_values ?? true;

  switch (chartType) {
    case "bar":
      return (
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
          <XAxis dataKey="label" tick={{ fill: "#0f0f0f" }} />
          <YAxis tick={{ fill: "#0f0f0f" }} label={chartConfig?.y_axis_label ? { value: chartConfig.y_axis_label, angle: -90, position: "insideLeft" } : undefined} />
          <Tooltip contentStyle={{ backgroundColor: "#f4f4f0", border: "2px solid #0f0f0f", borderRadius: "8px" }} />
          {showLegend && <Legend />}
          <Bar dataKey="value" label={showValues ? { position: "top", fill: "#0f0f0f" } : false}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} stroke="#0f0f0f" strokeWidth={2} />
            ))}
          </Bar>
        </BarChart>
      );

    case "horizontal_bar":
      return (
        <BarChart data={data} layout="vertical" margin={{ top: 20, right: 30, left: 60, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
          <XAxis type="number" tick={{ fill: "#0f0f0f" }} />
          <YAxis dataKey="label" type="category" tick={{ fill: "#0f0f0f" }} width={80} />
          <Tooltip contentStyle={{ backgroundColor: "#f4f4f0", border: "2px solid #0f0f0f", borderRadius: "8px" }} />
          {showLegend && <Legend />}
          <Bar dataKey="value" label={showValues ? { position: "right", fill: "#0f0f0f" } : false}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} stroke="#0f0f0f" strokeWidth={2} />
            ))}
          </Bar>
        </BarChart>
      );

    case "line":
      return (
        <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
          <XAxis dataKey="label" tick={{ fill: "#0f0f0f" }} />
          <YAxis tick={{ fill: "#0f0f0f" }} />
          <Tooltip contentStyle={{ backgroundColor: "#f4f4f0", border: "2px solid #0f0f0f", borderRadius: "8px" }} />
          {showLegend && <Legend />}
          <Line
            type="monotone"
            dataKey="value"
            stroke="#ff90e8"
            strokeWidth={3}
            dot={{ fill: "#ff90e8", stroke: "#0f0f0f", strokeWidth: 2, r: 6 }}
            activeDot={{ r: 8, stroke: "#0f0f0f", strokeWidth: 2 }}
          />
        </LineChart>
      );

    case "area":
      return (
        <AreaChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
          <XAxis dataKey="label" tick={{ fill: "#0f0f0f" }} />
          <YAxis tick={{ fill: "#0f0f0f" }} />
          <Tooltip contentStyle={{ backgroundColor: "#f4f4f0", border: "2px solid #0f0f0f", borderRadius: "8px" }} />
          {showLegend && <Legend />}
          <Area
            type="monotone"
            dataKey="value"
            stroke="#ff90e8"
            strokeWidth={2}
            fill="#ff90e8"
            fillOpacity={0.3}
          />
        </AreaChart>
      );

    case "pie":
    case "donut":
      return (
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={chartType === "donut" ? "40%" : 0}
            outerRadius="70%"
            dataKey="value"
            nameKey="label"
            label={showValues ? ({ name, value }) => `${name}: ${value}` : false}
            labelLine={showValues}
            stroke="#0f0f0f"
            strokeWidth={2}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Pie>
          <Tooltip contentStyle={{ backgroundColor: "#f4f4f0", border: "2px solid #0f0f0f", borderRadius: "8px" }} />
          {showLegend && <Legend />}
        </PieChart>
      );

    default:
      return null;
  }
}

export function SlidePreview({
  slide,
  onEditTitle,
  onEditSubtitle,
  onEditBody,
  onEditBullet,
  onEditQuote,
  onEditAttribution,
  onEditChartData,
  isEditable = true,
}: SlidePreviewProps) {
  const layoutClasses = {
    left: "items-start text-left",
    center: "items-center text-center",
    right: "items-end text-right",
    split: "items-start text-left",
  };

  const EditableText = ({
    value,
    onChange,
    className,
    as: Component = "p",
    placeholder = "Click to edit...",
  }: {
    value: string | null | undefined;
    onChange?: (value: string) => void;
    className?: string;
    as?: "h1" | "h2" | "p" | "span" | "blockquote";
    placeholder?: string;
  }) => {
    if (!isEditable || !onChange) {
      return <Component className={className}>{value || placeholder}</Component>;
    }

    return (
      <Component
        contentEditable
        suppressContentEditableWarning
        onBlur={(e) => onChange(e.currentTarget.textContent || "")}
        className={cn(
          className,
          "outline-none",
          "focus:bg-accent-pink-light focus:ring-2 focus:ring-accent-pink focus:ring-offset-2",
          "rounded px-1 -mx-1",
          "cursor-text"
        )}
      >
        {value || placeholder}
      </Component>
    );
  };

  return (
    <div className="w-full aspect-video bg-bg-cream rounded-2xl border-2 border-border-dark shadow-[4px_4px_0px_0px_#0f0f0f] overflow-hidden">
      <div
        className={cn(
          "h-full p-12 md:p-16 lg:p-20 flex flex-col justify-center",
          layoutClasses[slide.layout]
        )}
      >
        {/* Title Slide */}
        {slide.type === "title" && (
          <div className={cn("max-w-4xl", layoutClasses[slide.layout])}>
            <EditableText
              as="h1"
              value={slide.title}
              onChange={onEditTitle}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-text-primary leading-tight"
              placeholder="Presentation Title"
            />
            {(slide.subtitle || isEditable) && (
              <EditableText
                as="p"
                value={slide.subtitle}
                onChange={onEditSubtitle}
                className="mt-4 text-xl md:text-2xl text-text-secondary"
                placeholder="Subtitle"
              />
            )}
          </div>
        )}

        {/* Content Slide */}
        {slide.type === "content" && (
          <div className={cn("max-w-4xl w-full", layoutClasses[slide.layout])}>
            {(slide.title || isEditable) && (
              <EditableText
                as="h2"
                value={slide.title}
                onChange={onEditTitle}
                className="text-3xl md:text-4xl font-bold text-text-primary mb-6"
                placeholder="Slide Title"
              />
            )}
            {(slide.body || isEditable) && (
              <EditableText
                as="p"
                value={slide.body}
                onChange={onEditBody}
                className="text-lg md:text-xl text-text-primary leading-relaxed"
                placeholder="Add content here..."
              />
            )}
          </div>
        )}

        {/* Bullets Slide */}
        {slide.type === "bullets" && (
          <div className="max-w-4xl w-full">
            {(slide.title || isEditable) && (
              <EditableText
                as="h2"
                value={slide.title}
                onChange={onEditTitle}
                className="text-3xl md:text-4xl font-bold text-text-primary mb-8"
                placeholder="Slide Title"
              />
            )}
            <ul className="space-y-4">
              {slide.bullets?.map((bullet, i) => (
                <li key={i} className="flex items-start gap-4">
                  <span className="w-3 h-3 mt-2 bg-accent-pink rounded-full flex-shrink-0" />
                  <EditableText
                    as="span"
                    value={bullet}
                    onChange={onEditBullet ? (v) => onEditBullet(i, v) : undefined}
                    className="text-lg md:text-xl text-text-primary"
                    placeholder="Bullet point"
                  />
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Quote Slide */}
        {slide.type === "quote" && (
          <div className={cn("max-w-3xl", layoutClasses[slide.layout])}>
            <div className="relative">
              <span className="absolute -left-8 -top-4 text-6xl text-accent-pink opacity-50">
                &ldquo;
              </span>
              <EditableText
                as="blockquote"
                value={slide.quote}
                onChange={onEditQuote}
                className="text-2xl md:text-3xl lg:text-4xl text-text-primary italic leading-relaxed"
                placeholder="Enter quote..."
              />
            </div>
            {(slide.attribution || isEditable) && (
              <EditableText
                as="p"
                value={slide.attribution ? `— ${slide.attribution}` : undefined}
                onChange={onEditAttribution}
                className="mt-6 text-lg text-text-secondary"
                placeholder="— Attribution"
              />
            )}
          </div>
        )}

        {/* Section Slide */}
        {slide.type === "section" && (
          <div className="text-center">
            <div className="w-16 h-1 bg-accent-pink mx-auto mb-8" />
            <EditableText
              as="h2"
              value={slide.title}
              onChange={onEditTitle}
              className="text-4xl md:text-5xl font-bold text-text-primary"
              placeholder="Section Title"
            />
          </div>
        )}

        {/* Chart Slide */}
        {slide.type === "chart" && (
          <div className="max-w-4xl w-full">
            <EditableText
              as="h2"
              value={slide.title}
              onChange={onEditTitle}
              className="text-3xl md:text-4xl font-bold text-text-primary mb-6 text-center"
              placeholder="Chart Title"
            />
            <div className="h-[250px] md:h-[320px] lg:h-[380px]">
              <ResponsiveContainer width="100%" height="100%">
                {renderChart(slide.chart_type, slide.chart_data, slide.chart_config)}
              </ResponsiveContainer>
            </div>
            {/* Editable data table for chart editing */}
            {isEditable && slide.chart_data && onEditChartData && (
              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-sm border-2 border-border-dark rounded-lg overflow-hidden">
                  <thead className="bg-accent-pink-light">
                    <tr>
                      <th className="px-3 py-2 text-left font-semibold">Label</th>
                      <th className="px-3 py-2 text-left font-semibold">Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {slide.chart_data.map((point, index) => (
                      <tr key={index} className="border-t border-border-dark">
                        <td className="px-3 py-2">
                          <input
                            type="text"
                            value={point.label}
                            onChange={(e) => {
                              const newData = [...slide.chart_data!];
                              newData[index] = { ...newData[index], label: e.target.value };
                              onEditChartData(newData);
                            }}
                            className="w-full bg-transparent outline-none focus:bg-accent-pink-light rounded px-1"
                          />
                        </td>
                        <td className="px-3 py-2">
                          <input
                            type="number"
                            value={point.value}
                            onChange={(e) => {
                              const newData = [...slide.chart_data!];
                              newData[index] = { ...newData[index], value: parseFloat(e.target.value) || 0 };
                              onEditChartData(newData);
                            }}
                            className="w-full bg-transparent outline-none focus:bg-accent-pink-light rounded px-1"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
