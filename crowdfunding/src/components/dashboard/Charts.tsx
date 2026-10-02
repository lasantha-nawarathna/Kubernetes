"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  type TooltipProps,
} from "recharts";
import { formatMoney, compactNumber } from "@/lib/data";

/* Single-series charts share the brand hue; text stays in neutral ink. */
const BRAND = "#059669";
const BRAND_SOFT = "#10b981";
const GRID = "#eef2f6";
const AXIS = { fontSize: 12, fill: "#64748b" };

type Point = Record<string, string | number>;

function ChartTooltip({ active, payload, label, money, unit }: TooltipProps<number, string> & { money?: boolean; unit?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-slate-100 bg-white px-3 py-2 text-xs shadow-lift">
      <p className="font-semibold text-slate-500">{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey as string} className="mt-0.5 flex items-center gap-1.5 font-bold text-slate-900">
          <span className="h-2 w-2 rounded-full" style={{ background: p.color }} />
          {money ? formatMoney(Number(p.value)) : `${Number(p.value).toLocaleString()}${unit ? ` ${unit}` : ""}`}
          <span className="font-medium text-slate-500">{p.name}</span>
        </p>
      ))}
    </div>
  );
}

export function FundingProgressChart({ data, goal, height = 280 }: { data: Point[]; goal: number; height?: number }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 16, right: 12, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="fundFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={BRAND_SOFT} stopOpacity={0.28} />
            <stop offset="100%" stopColor={BRAND_SOFT} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke={GRID} vertical={false} />
        <XAxis dataKey="day" tick={AXIS} tickLine={false} axisLine={false} interval="preserveStartEnd" minTickGap={24} />
        <YAxis tick={AXIS} tickLine={false} axisLine={false} width={56} tickFormatter={(v) => `€${compactNumber(v)}`} domain={[0, (max: number) => Math.max(max, goal) * 1.08]} />
        <Tooltip content={<ChartTooltip money />} cursor={{ stroke: "#cbd5e1", strokeDasharray: "4 4" }} />
        <ReferenceLine y={goal} stroke="#94a3b8" strokeDasharray="5 5" label={{ value: `Goal ${formatMoney(goal)}`, position: "insideTopLeft", fill: "#475569", fontSize: 12 }} />
        <Area type="monotone" dataKey="cumulative" name="raised to date" stroke={BRAND} strokeWidth={2} fill="url(#fundFill)" activeDot={{ r: 5, strokeWidth: 2, stroke: "#fff" }} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function DailyContributionsChart({ data, height = 260 }: { data: Point[]; height?: number }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }} barCategoryGap={2}>
        <CartesianGrid stroke={GRID} vertical={false} />
        <XAxis dataKey="day" tick={AXIS} tickLine={false} axisLine={false} interval="preserveStartEnd" minTickGap={24} />
        <YAxis tick={AXIS} tickLine={false} axisLine={false} width={52} tickFormatter={(v) => `€${compactNumber(v)}`} />
        <Tooltip content={<ChartTooltip money />} cursor={{ fill: "rgba(16,185,129,0.06)" }} />
        <Bar dataKey="amount" name="contributed" fill={BRAND_SOFT} radius={[4, 4, 0, 0]} maxBarSize={18} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function BackerGrowthChart({ data, height = 260 }: { data: Point[]; height?: number }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
        <CartesianGrid stroke={GRID} vertical={false} />
        <XAxis dataKey="day" tick={AXIS} tickLine={false} axisLine={false} interval="preserveStartEnd" minTickGap={24} />
        <YAxis tick={AXIS} tickLine={false} axisLine={false} width={44} tickFormatter={(v) => compactNumber(v)} />
        <Tooltip content={<ChartTooltip unit="backers" />} cursor={{ stroke: "#cbd5e1", strokeDasharray: "4 4" }} />
        <Line type="monotone" dataKey="cumulativeBackers" name="total" stroke={BRAND} strokeWidth={2} dot={false} activeDot={{ r: 5, strokeWidth: 2, stroke: "#fff" }} />
      </LineChart>
    </ResponsiveContainer>
  );
}

/** Horizontal ranked bars — used for traffic sources and reward tiers. */
export function RankedBars({ data, valueKey, nameKey, unit, height = 240, money }: { data: Point[]; valueKey: string; nameKey: string; unit?: string; height?: number; money?: boolean }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} layout="vertical" margin={{ top: 0, right: 48, left: 0, bottom: 0 }} barCategoryGap={8}>
        <XAxis type="number" hide />
        <YAxis type="category" dataKey={nameKey} tick={{ ...AXIS, fill: "#334155" }} tickLine={false} axisLine={false} width={160} />
        <Tooltip content={<ChartTooltip unit={unit} money={money} />} cursor={{ fill: "rgba(16,185,129,0.06)" }} />
        <Bar
          dataKey={valueKey}
          name={unit ?? ""}
          fill={BRAND_SOFT}
          radius={[0, 4, 4, 0]}
          maxBarSize={22}
          label={{ position: "right", fill: "#334155", fontSize: 12, fontWeight: 600, formatter: (v: number) => (unit === "%" ? `${v}%` : v.toLocaleString()) }}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function Sparkline({ data, dataKey, height = 48 }: { data: Point[]; dataKey: string; height?: number }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="sparkFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={BRAND_SOFT} stopOpacity={0.25} />
            <stop offset="100%" stopColor={BRAND_SOFT} stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area type="monotone" dataKey={dataKey} stroke={BRAND} strokeWidth={2} fill="url(#sparkFill)" dot={false} isAnimationActive={false} />
      </AreaChart>
    </ResponsiveContainer>
  );
}
