'use client';

import { motion } from 'framer-motion';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  LabelList,
} from 'recharts';

export function ChannelPerformance() {
  const data = [
    { name: 'Organic Search', conversions: 480 },
    { name: 'Paid Social', conversions: 350 },
    { name: 'Direct', conversions: 290 },
    { name: 'Referral', conversions: 180 },
    { name: 'Email', conversions: 95 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
      className="glass-card p-6 flex flex-col h-96"
    >
      <div className="mb-6">
        <h3 className="font-semibold text-lg text-white">Top Channels by Conversion</h3>
        <p className="text-sm text-muted-foreground mt-1">Which channels drive the most signups</p>
      </div>

      <div className="flex-1 w-full min-h-0 relative -ml-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 0, right: 20, left: 20, bottom: 0 }}
            barSize={24}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              horizontal={false}
              stroke="rgba(255,255,255,0.05)"
            />
            <XAxis
              type="number"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#718096', fontSize: 12 }}
            />
            <YAxis
              type="category"
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#cbd5e1', fontSize: 13, fontWeight: 500 }}
              width={110}
            />
            <Tooltip
              cursor={{ fill: 'rgba(255,255,255,0.03)' }}
              contentStyle={{
                backgroundColor: 'var(--glass-bg)',
                borderColor: 'var(--glass-border)',
                borderRadius: '8px',
                color: '#fff',
                backdropFilter: 'blur(16px)',
              }}
              itemStyle={{ color: '#fff', fontWeight: 600 }}
            />
            <Bar
              dataKey="conversions"
              fill="var(--primary)"
              radius={[0, 4, 4, 0]}
              activeBar={{ fill: 'rgba(212,162,78,0.95)', fillOpacity: 1 }}
            >
              <LabelList
                dataKey="conversions"
                position="right"
                fill="#e2e8f0"
                fontSize={11}
                fontWeight={600}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
