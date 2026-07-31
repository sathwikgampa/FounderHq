'use client';

import { motion } from 'framer-motion';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  LabelList,
} from 'recharts';

const revenueData = [
  { name: 'Jan', revenue: 24000, expenses: 18000 },
  { name: 'Feb', revenue: 28000, expenses: 20000 },
  { name: 'Mar', revenue: 32000, expenses: 22000 },
  { name: 'Apr', revenue: 36000, expenses: 24000 },
  { name: 'May', revenue: 42500, expenses: 28400 },
];

const customerData = [
  { name: 'W1', users: 1020 },
  { name: 'W2', users: 1100 },
  { name: 'W3', users: 1180 },
  { name: 'W4', users: 1248 },
];

export function AnalyticsCharts() {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-12">
      {/* Revenue & Expenses (Line/Area Chart) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="glass-card p-6 xl:col-span-2 flex flex-col h-96"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
          <h3 className="font-semibold text-lg text-white">Financial Overview</h3>
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5 flex flex-row">
              <span className="w-2.5 h-2.5 rounded-full bg-primary inline-block shrink-0 shadow-[0_0_8px_var(--primary)]"></span>
              <span className="text-white font-medium whitespace-nowrap">Revenue</span>
            </div>
            <div className="flex items-center gap-1.5 flex flex-row">
              <span className="w-2.5 h-2.5 border-[2px] border-muted-foreground rounded-full inline-block shrink-0"></span>
              <span className="text-muted-foreground font-medium whitespace-nowrap">Expenses</span>
            </div>
          </div>
        </div>

        <div className="flex-1 w-full relative">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={revenueData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4a5568" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#2d3748" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="rgba(255,255,255,0.08)"
              />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#718096', fontSize: 13, fontWeight: 500 }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#718096', fontSize: 13, fontWeight: 500 }}
                tickFormatter={(value) => `$${value / 1000}k`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--glass-bg)',
                  borderColor: 'var(--glass-border)',
                  borderRadius: '8px',
                  color: '#fff',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
                  backdropFilter: 'blur(16px)',
                }}
                itemStyle={{ color: '#fff', fontWeight: 600 }}
                labelStyle={{ color: '#a0aec0', marginBottom: '8px', fontSize: '13px' }}
                cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1, strokeDasharray: '4 4' }}
              />
              <Area
                type="monotone"
                dataKey="expenses"
                stroke="#64748b"
                fillOpacity={1}
                fill="url(#colorExpenses)"
                strokeWidth={2}
                dot={{ r: 4, fill: '#1e293b', stroke: '#64748b', strokeWidth: 2 }}
                activeDot={{ r: 6, fill: '#64748b', stroke: '#fff', strokeWidth: 2 }}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="var(--primary)"
                fillOpacity={1}
                fill="url(#colorRevenue)"
                strokeWidth={3}
                dot={{ r: 4, fill: '#1e293b', stroke: 'var(--primary)', strokeWidth: 2 }}
                activeDot={{ r: 7, fill: 'var(--primary)', stroke: '#fff', strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Customer Growth (Bar Chart) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="glass-card p-6 flex flex-col h-96"
      >
        <div className="flex items-center justify-between mb-8">
          <h3 className="font-semibold text-lg text-white">Active Customers</h3>
          <span className="text-emerald-400 text-xs font-semibold bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md">
            +18%
          </span>
        </div>

        <div className="flex-1 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={customerData}
              margin={{ top: 20, right: 0, left: -20, bottom: 0 }}
              barSize={36}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="rgba(255,255,255,0.05)"
              />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#718096', fontSize: 13, fontWeight: 500 }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#718096', fontSize: 13, fontWeight: 500 }}
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
              <Bar dataKey="users" fill="var(--primary)" radius={[6, 6, 0, 0]}>
                <LabelList
                  dataKey="users"
                  position="top"
                  fill="#cbd5e1"
                  fontSize={11}
                  fontWeight={600}
                  formatter={(v: any) => Number(v).toLocaleString()}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  );
}
