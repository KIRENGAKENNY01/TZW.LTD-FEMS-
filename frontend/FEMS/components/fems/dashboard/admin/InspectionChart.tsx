'use client';

import { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { getInspectionReport } from '@/lib/api/reports';
import { sampleInspectionChartData } from '@/data/sample/femsData';

type Range = '7d' | '30d' | '6m' | '12m';

const RANGES: { label: string; value: Range }[] = [
  { label: '7 days', value: '7d' },
  { label: '30 days', value: '30d' },
  { label: '6 months', value: '6m' },
  { label: '12 months', value: '12m' },
];

export function InspectionChart() {
  const [range, setRange] = useState<Range>('12m');
  const [chartData, setChartData] = useState(sampleInspectionChartData);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getInspectionReport()
      .then((report) => {
        if (report.monthly && report.monthly.length > 0) {
          setChartData(report.monthly);
        }
      })
      .catch(() => {
        // Fall back to sample data
        setChartData(sampleInspectionChartData);
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredData = (() => {
    if (range === '7d') return chartData.slice(-1);
    if (range === '30d') return chartData.slice(-1);
    if (range === '6m') return chartData.slice(-6);
    return chartData;
  })();

  return (
    <div className="flex flex-col gap-4">
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex gap-1.5 flex-1">
          {RANGES.map((r) => (
            <button
              key={r.value}
              id={`inspection-chart-range-${r.value}`}
              onClick={() => setRange(r.value)}
              className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                range === r.value
                  ? 'bg-primary-500 text-white'
                  : 'bg-secondary-100 dark:bg-secondary-800 text-secondary-500 dark:text-secondary-400 hover:bg-secondary-200 dark:hover:bg-secondary-700'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
        <button
          id="export-pdf-btn"
          className="ml-auto flex items-center gap-1.5 rounded-md border border-secondary-200 dark:border-secondary-700 bg-white dark:bg-secondary-800 px-3 py-1.5 text-xs font-medium text-secondary-600 dark:text-secondary-400 hover:bg-secondary-50 dark:hover:bg-secondary-700 transition-colors"
        >
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Export PDF
        </button>
      </div>

      {/* Chart */}
      {loading ? (
        <div className="h-64 w-full animate-pulse rounded-lg bg-secondary-100 dark:bg-secondary-700" />
      ) : (
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={filteredData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 11, fill: '#94A3B8' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: '#94A3B8' }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1E293B',
                border: '1px solid #334155',
                borderRadius: '8px',
                fontSize: '12px',
                color: '#F1F5F9',
              }}
            />
            <Legend
              wrapperStyle={{ fontSize: '12px', paddingTop: '12px' }}
            />
            <Line
              type="monotone"
              dataKey="completed"
              name="Completed"
              stroke="#EF4444"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="scheduled"
              name="Scheduled"
              stroke="#CBD5E1"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

export default InspectionChart;
