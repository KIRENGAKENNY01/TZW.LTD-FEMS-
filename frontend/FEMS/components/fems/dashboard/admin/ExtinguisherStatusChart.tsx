'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { InventoryReport } from '@/lib/api/reports';

const STATUS_COLORS: Record<string, string> = {
  ACTIVE: '#EF4444',
  UNDER_MAINTENANCE: '#EAB308',
  EXPIRED: '#DC2626',
  INACTIVE: '#94A3B8',
};

interface ExtinguisherStatusChartProps {
  inventory: InventoryReport | null;
  isLoading?: boolean;
}

export function ExtinguisherStatusChart({
  inventory,
  isLoading,
}: ExtinguisherStatusChartProps) {
  const data = inventory
    ? [
        { name: 'Active', value: inventory.byStatus?.ACTIVE ?? 0, key: 'ACTIVE' },
        { name: 'Maintenance', value: inventory.byStatus?.UNDER_MAINTENANCE ?? 0, key: 'UNDER_MAINTENANCE' },
        { name: 'Expired', value: inventory.byStatus?.EXPIRED ?? 0, key: 'EXPIRED' },
        { name: 'Inactive', value: inventory.byStatus?.INACTIVE ?? 0, key: 'INACTIVE' },
      ]
    : [];

  if (isLoading) {
    return (
      <div className="h-64 w-full animate-pulse rounded-lg bg-secondary-100 dark:bg-secondary-700" />
    );
  }

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart
        layout="vertical"
        data={data}
        margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" horizontal={false} />
        <XAxis
          type="number"
          tick={{ fontSize: 11, fill: '#94A3B8' }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          type="category"
          dataKey="name"
          tick={{ fontSize: 11, fill: '#94A3B8' }}
          axisLine={false}
          tickLine={false}
          width={80}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: '#1E293B',
            border: '1px solid #334155',
            borderRadius: '8px',
            fontSize: '12px',
            color: '#F1F5F9',
          }}
          cursor={{ fill: 'rgba(148,163,184,0.08)' }}
        />
        <Bar dataKey="value" name="Count" radius={[0, 4, 4, 0]}>
          {data.map((entry) => (
            <Cell key={entry.key} fill={STATUS_COLORS[entry.key] ?? '#94A3B8'} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export default ExtinguisherStatusChart;
