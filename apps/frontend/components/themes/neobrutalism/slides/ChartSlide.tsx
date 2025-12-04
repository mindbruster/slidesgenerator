'use client';

import { cn } from '@/lib/utils/cn';
import { EditableText, SlideContainer, ChartRenderer } from '../../base';
import type { SlideComponentProps } from '../../base/types';
import { getTailwindFontSize, getVerticalPositionClasses } from '../utils';

export function ChartSlide({
  slide,
  theme,
  isEditable = true,
  onEditTitle,
  onEditChartData,
}: SlideComponentProps) {
  const { colors, typography, layout } = theme;

  return (
    <SlideContainer theme={theme} imageUrl={slide.image_url}>
      <div
        className={cn(
          'h-full flex flex-col',
          getVerticalPositionClasses(layout.vertical_position)
        )}
      >
        <div className="max-w-4xl w-full mx-auto">
          <EditableText
            as="h2"
            value={slide.title}
            onChange={onEditTitle}
            isEditable={isEditable}
            className={cn(getTailwindFontSize(typography.heading_size), 'mb-6 text-center')}
            style={{
              color: colors.text_primary,
              fontFamily: typography.heading_font,
              fontWeight: typography.heading_weight,
            }}
            placeholder="Chart Title"
            focusRingColor={colors.accent}
          />
          <div className="h-[250px] md:h-[320px] lg:h-[380px]">
            <ChartRenderer
              chartType={slide.chart_type}
              chartData={slide.chart_data}
              chartConfig={slide.chart_config}
              colors={colors}
            />
          </div>
          {/* Editable data table for chart editing */}
          {isEditable && slide.chart_data && onEditChartData && (
            <div className="mt-4 overflow-x-auto">
              <table
                className="w-full text-sm overflow-hidden"
                style={{
                  border: `2px solid ${colors.border_dark}`,
                  borderRadius: theme.style.border_radius,
                }}
              >
                <thead style={{ backgroundColor: colors.accent_light }}>
                  <tr>
                    <th
                      className="px-3 py-2 text-left font-semibold"
                      style={{ color: colors.text_primary }}
                    >
                      Label
                    </th>
                    <th
                      className="px-3 py-2 text-left font-semibold"
                      style={{ color: colors.text_primary }}
                    >
                      Value
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {slide.chart_data.map((point, index) => (
                    <tr
                      key={index}
                      style={{ borderTop: `1px solid ${colors.border_dark}` }}
                    >
                      <td className="px-3 py-2">
                        <input
                          type="text"
                          value={point.label}
                          onChange={(e) => {
                            const newData = [...slide.chart_data!];
                            newData[index] = { ...newData[index], label: e.target.value };
                            onEditChartData(newData);
                          }}
                          className="w-full bg-transparent outline-none rounded px-1"
                          style={{
                            color: colors.text_primary,
                          }}
                        />
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="number"
                          value={point.value}
                          onChange={(e) => {
                            const newData = [...slide.chart_data!];
                            newData[index] = {
                              ...newData[index],
                              value: parseFloat(e.target.value) || 0,
                            };
                            onEditChartData(newData);
                          }}
                          className="w-full bg-transparent outline-none rounded px-1"
                          style={{
                            color: colors.text_primary,
                          }}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </SlideContainer>
  );
}
