"use client";

import {
    Area,
    AreaChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
} from "recharts";

import {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    ChartData,
    ChartPeriod,
    getPaymentChartData,
} from "@/services/angsuran.service";

type Props = {
  period: ChartPeriod;
};

export default function PaymentChart({ period }: Props) {
  const [chartData, setChartData] = useState<ChartData>({
    labels: [],
    values: [],
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChart = async () => {
      setLoading(true);

      const data = await getPaymentChartData(period);

      setChartData(data);
      setLoading(false);
    };

    fetchChart();
  }, [period]);

  const data = useMemo(() => {
    return chartData.labels.map((label, index) => ({
      label,
      value: chartData.values[index] || 0,
    }));
  }, [chartData]);

  if (loading) {
    return (
      <div className="h-72 flex items-center justify-center text-slate-400">
        Loading chart...
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="h-72 flex items-center justify-center text-slate-400">
        Belum ada data pembayaran
      </div>
    );
  }

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient
              id="paymentGradient"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop
                offset="5%"
                stopColor="#2563eb"
                stopOpacity={0.3}
              />
              <stop
                offset="95%"
                stopColor="#2563eb"
                stopOpacity={0}
              />
            </linearGradient>
          </defs>

          <XAxis
            dataKey="label"
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 12 }}
          />

          <Tooltip
   formatter={(value) => [
  `Rp ${Number(value).toLocaleString("id-ID")}`,
  "Pembayaran",
]}
          />

          <Area
            type="monotone"
            dataKey="value"
            stroke="#2563eb"
            strokeWidth={3}
            fill="url(#paymentGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}