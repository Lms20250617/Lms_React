// components/ScoreChart.tsx
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type { ILecDetailResponse } from '../../../../model/User/IStatistics';

interface ChartProps {
  data: ILecDetailResponse[];
}

export const ScoreChart = ({ data }: ChartProps) => {
  return (
    <div className="h-96 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis
            dataKey="lecName"
            tickFormatter={(value) =>
              value.length > 6 ? value.slice(0, 6) + '…' : value
            }
          />
          <YAxis tickFormatter={(value) => `${value}점`} />

          <Tooltip
            content={({ active, payload }) => {
              if (!active || !payload || payload.length === 0) return null;

              const info = payload[0].payload;

              return (
                <div className="rounded-md border border-gray-200 bg-white p-3 text-sm shadow-md">
                  <div className="mb-2 font-semibold text-indigo-600">
                    {info.lectureRound}회차 - {info.lecName} ({info.tutorName})
                  </div>
                  {payload.map((entry, index) => (
                    <div key={index}>
                      {entry.name}: {entry.value}점
                    </div>
                  ))}
                </div>
              );
            }}
          />

          <Legend />
          <Bar dataKey="maxScore" fill="#82ca9d" name="최고 점수" />
          <Bar dataKey="minScore" fill="#ff8080" name="최저 점수" />
          <Bar dataKey="avgScore" fill="#8884d8" name="평균 점수" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
