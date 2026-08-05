"use client";

import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { EmptyState } from "@/components/shared/empty-state";
import type { BestSeller } from "../hooks/use-dashboard";

interface TooltipPayload {
  payload: BestSeller;
}

function ChartTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: TooltipPayload[];
}) {
  if (!active || !payload?.length) return null;
  const entry = payload[0].payload;

  return (
    <div className="rounded-md border border-roast-600 bg-roast-850 px-3 py-2 shadow-md">
      <p className="db-rail">{entry.code}</p>
      <p className="mt-1 text-sm text-chaff-50">{entry.name}</p>
      <p className="tnum mt-0.5 text-sm text-ember-400">
        {entry.quantity} sold today
      </p>
    </div>
  );
}

export function BestSellersChart({ data }: { data: BestSeller[] }) {
  if (data.length === 0) {
    return (
      <EmptyState
        title="No sales logged yet today"
        description="The chart fills in as tickets come off the board."
      />
    );
  }

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 4, right: 16, bottom: 4, left: 0 }}
          barCategoryGap="28%"
        >
          <XAxis type="number" hide />
          <YAxis
            type="category"
            dataKey="name"
            width={150}
            tickLine={false}
            axisLine={false}
            tick={{
              fill: "var(--db-chaff-300)",
              fontSize: 12,
              fontFamily: "var(--db-family-body)",
            }}
          />
          <Tooltip
            cursor={{ fill: "var(--db-roast-750)" }}
            content={<ChartTooltip />}
          />
          <Bar dataKey="quantity" radius={[0, 3, 3, 0]}>
            {data.map((entry, index) => (
              <Cell
                key={entry.code}
                fill={
                  index === 0 ? "var(--db-ember-500)" : "var(--db-ember-800)"
                }
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
