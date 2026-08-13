import React, { useState } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface ZakatChartProps {
  zakatPenghasilan: number;
  zakatMal: number;
  totalZakatEmasPerak: number;
  zakatPerniagaan: number;
  zakatFitrah: number;
  grandTotal: number;
}

const COLORS = {
  penghasilan: '#14b8a6', // Teal
  mal: '#3b82f6', // Blue
  emasPerak: '#f59e0b', // Amber/Gold
  perniagaan: '#a855f7', // Purple
  fitrah: '#10b981', // Emerald
};

const formatRupiah = (value: number) => {
  if (isNaN(value)) value = 0;
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Math.round(value));
};

export const ZakatChart: React.FC<ZakatChartProps> = ({
  zakatPenghasilan,
  zakatMal,
  totalZakatEmasPerak,
  zakatPerniagaan,
  zakatFitrah,
  grandTotal,
}) => {
  const [chartType, setChartType] = useState<'pie' | 'bar'>('pie');

  const rawData = [
    { name: 'Penghasilan', value: zakatPenghasilan, color: COLORS.penghasilan },
    { name: 'Mal', value: zakatMal, color: COLORS.mal },
    { name: 'Emas & Perak', value: totalZakatEmasPerak, color: COLORS.emasPerak },
    { name: 'Perniagaan', value: zakatPerniagaan, color: COLORS.perniagaan },
    { name: 'Fitrah', value: zakatFitrah, color: COLORS.fitrah },
  ];

  // Filter out zero values for pie chart clean rendering, or keep all if all are zero
  const activeData = rawData.filter((item) => item.value > 0);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      const val = data.value;
      const percentage = grandTotal > 0 ? ((val / grandTotal) * 100).toFixed(1) : '0';
      return (
        <div className="bg-slate-900/90 text-white p-3 rounded-lg shadow-xl text-xs border border-slate-700">
          <p className="font-semibold text-slate-200">{data.name}</p>
          <p className="text-amber-300 font-bold text-sm mt-0.5">{formatRupiah(val)}</p>
          <p className="text-slate-400 mt-0.5">Proporsi: {percentage}%</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-slate-900/60 p-5 rounded-xl border border-teal-500/30 mt-6 text-slate-100">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 border-b border-teal-700/50 pb-3">
        <div>
          <h3 className="text-lg font-bold text-teal-100">Diagram Proporsi Zakat</h3>
          <p className="text-xs text-teal-200/80">
            Visualisasi kontribusi setiap kategori terhadap total kewajiban zakat Anda.
          </p>
        </div>

        {/* Toggle Chart Type */}
        <div className="flex bg-slate-800/80 p-1 rounded-lg border border-slate-700 self-start sm:self-auto">
          <button
            onClick={() => setChartType('pie')}
            className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
              chartType === 'pie'
                ? 'bg-teal-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Pie Chart
          </button>
          <button
            onClick={() => setChartType('bar')}
            className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
              chartType === 'bar'
                ? 'bg-teal-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Diagram Batang
          </button>
        </div>
      </div>

      {grandTotal === 0 ? (
        <div className="py-12 text-center text-slate-400">
          <div className="w-12 h-12 mx-auto mb-2 opacity-40 border-2 border-dashed border-slate-400 rounded-full flex items-center justify-center">
            📊
          </div>
          <p className="text-sm font-medium">Belum ada zakat yang harus dibayarkan.</p>
          <p className="text-xs text-slate-500 mt-1">
            Isi nominal pada salah satu kalkulator di atas untuk melihat diagram proporsi.
          </p>
        </div>
      ) : (
        <div className="w-full h-64 sm:h-72">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'pie' ? (
              <PieChart>
                <Pie
                  data={activeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                  animationDuration={600}
                >
                  {activeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="#0f172a" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  formatter={(value) => <span className="text-xs text-slate-300 font-medium">{value}</span>}
                />
              </PieChart>
            ) : (
              <BarChart data={rawData} margin={{ top: 10, right: 10, left: 10, bottom: 25 }}>
                <XAxis
                  dataKey="name"
                  tick={{ fill: '#cbd5e1', fontSize: 11 }}
                  interval={0}
                  angle={-15}
                  textAnchor="end"
                />
                <YAxis
                  tick={{ fill: '#cbd5e1', fontSize: 10 }}
                  tickFormatter={(val) =>
                    val >= 1000000 ? `${(val / 1000000).toFixed(1)}M` : val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val
                  }
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" radius={[6, 6, 0, 0]} animationDuration={600}>
                  {rawData.map((entry, index) => (
                    <Cell key={`bar-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};
