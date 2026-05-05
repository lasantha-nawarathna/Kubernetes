import { useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import { Cloud, RefreshCw, MapPin, Wind, Droplets, Thermometer } from "lucide-react";
import SriLankaWeatherMap from "@/components/SriLankaWeatherMap";
import { districts, type District } from "@/data/sriLankaDistricts";
import {
  fetchWeatherForPoints,
  describeWeather,
  tempColor,
  type CurrentWeather,
} from "@/lib/weather";

type Status = "idle" | "loading" | "ready" | "error";

export default function Weather() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<Record<string, CurrentWeather>>({});
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);
  const [selectedId, setSelectedId] = useState<string>("colombo");

  const load = async () => {
    setStatus("loading");
    setError(null);
    try {
      const points = districts.map((d) => ({ lat: d.lat, lng: d.lng }));
      const results = await fetchWeatherForPoints(points);
      const map: Record<string, CurrentWeather> = {};
      results.forEach((w, i) => {
        map[districts[i].id] = w;
      });
      setData(map);
      setUpdatedAt(new Date());
      setStatus("ready");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load weather");
      setStatus("error");
    }
  };

  useEffect(() => {
    load();
  }, []);

  const selectedDistrict: District =
    districts.find((d) => d.id === selectedId) ?? districts[0];
  const selectedWeather = data[selectedDistrict.id];

  const summary = useMemo(() => {
    const values = Object.values(data);
    if (values.length === 0) return null;
    const temps = values.map((v) => v.temperature);
    const min = Math.min(...temps);
    const max = Math.max(...temps);
    const avg = temps.reduce((a, b) => a + b, 0) / temps.length;
    return { min, max, avg };
  }, [data]);

  return (
    <div
      className="min-h-screen"
      style={{
        background:
          "linear-gradient(180deg, oklch(0.97 0.02 220), oklch(0.94 0.04 200))",
        fontFamily: "'Space Grotesk', sans-serif",
      }}
    >
      <header
        className="sticky top-0 z-30 border-b backdrop-blur"
        style={{
          background: "rgba(255,255,255,0.75)",
          borderColor: "rgba(15,23,42,0.08)",
        }}
      >
        <div className="max-w-6xl mx-auto px-5 h-14 flex items-center gap-3">
          <Cloud size={22} className="text-sky-600" />
          <h1 className="text-base font-semibold text-slate-900">
            Sri Lanka Weather
          </h1>
          <span className="text-xs text-slate-500 hidden sm:inline">
            Live conditions across all 25 districts
          </span>
          <div className="flex-1" />
          {updatedAt && (
            <span className="text-xs text-slate-500 hidden md:inline">
              Updated{" "}
              {updatedAt.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          )}
          <button
            type="button"
            onClick={load}
            disabled={status === "loading"}
            className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md border bg-white hover:bg-slate-50 disabled:opacity-60"
            style={{ borderColor: "rgba(15,23,42,0.1)" }}
          >
            <RefreshCw
              size={13}
              className={status === "loading" ? "animate-spin" : ""}
            />
            Refresh
          </button>
          <Link
            href="/"
            className="text-xs text-slate-500 hover:text-slate-800 underline-offset-4 hover:underline ml-1"
          >
            Home
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-5 py-6">
        {status === "error" && (
          <div className="mb-4 p-3 rounded-lg border border-red-200 bg-red-50 text-sm text-red-800">
            Couldn't load weather: {error}.{" "}
            <button
              type="button"
              onClick={load}
              className="underline font-medium"
            >
              Try again
            </button>
            .
          </div>
        )}

        {summary && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            <SummaryCard
              icon={<Thermometer size={16} />}
              label="Avg temperature"
              value={`${summary.avg.toFixed(1)}°C`}
              accent={tempColor(summary.avg)}
            />
            <SummaryCard
              icon={<Thermometer size={16} />}
              label="Coolest"
              value={`${summary.min.toFixed(1)}°C`}
              accent={tempColor(summary.min)}
            />
            <SummaryCard
              icon={<Thermometer size={16} />}
              label="Hottest"
              value={`${summary.max.toFixed(1)}°C`}
              accent={tempColor(summary.max)}
            />
            <SummaryCard
              icon={<MapPin size={16} />}
              label="Districts"
              value={`${Object.keys(data).length} / ${districts.length}`}
              accent="#0f172a"
            />
          </div>
        )}

        <div className="grid lg:grid-cols-[1fr_320px] gap-5 items-start">
          <div
            className="rounded-2xl border bg-white p-3 sm:p-4"
            style={{ borderColor: "rgba(15,23,42,0.08)" }}
          >
            <SriLankaWeatherMap
              weatherByDistrict={data}
              selectedId={selectedId}
              onSelect={(d) => setSelectedId(d.id)}
            />
            <Legend />
          </div>

          <aside
            className="rounded-2xl border bg-white p-5"
            style={{ borderColor: "rgba(15,23,42,0.08)" }}
          >
            <DistrictPanel
              district={selectedDistrict}
              weather={selectedWeather}
              loading={status === "loading"}
            />
            <DistrictList
              selectedId={selectedId}
              onSelect={(id) => setSelectedId(id)}
              data={data}
            />
          </aside>
        </div>

        <p className="mt-6 text-xs text-slate-500 text-center">
          Data from{" "}
          <a
            href="https://open-meteo.com/"
            target="_blank"
            rel="noreferrer"
            className="underline"
          >
            Open-Meteo
          </a>
          . Times shown in Asia/Colombo.
        </p>
      </main>
    </div>
  );
}

function SummaryCard({
  icon,
  label,
  value,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  accent: string;
}) {
  return (
    <div
      className="rounded-xl border bg-white p-3 flex items-center gap-3"
      style={{ borderColor: "rgba(15,23,42,0.08)" }}
    >
      <div
        className="w-9 h-9 rounded-lg flex items-center justify-center text-white"
        style={{ background: accent }}
      >
        {icon}
      </div>
      <div className="min-w-0">
        <div className="text-xs text-slate-500">{label}</div>
        <div className="text-base font-semibold text-slate-900">{value}</div>
      </div>
    </div>
  );
}

function DistrictPanel({
  district,
  weather,
  loading,
}: {
  district: District;
  weather: CurrentWeather | undefined;
  loading: boolean;
}) {
  const desc = weather ? describeWeather(weather.weatherCode) : null;
  return (
    <div className="mb-5">
      <div className="flex items-baseline justify-between gap-2">
        <h2 className="text-lg font-semibold text-slate-900">{district.name}</h2>
        <span className="text-xs text-slate-500">{district.province} Province</span>
      </div>
      {weather && desc ? (
        <div className="mt-3">
          <div
            className="rounded-xl p-4 text-white"
            style={{ background: tempColor(weather.temperature) }}
          >
            <div className="flex items-center gap-3">
              <span className="text-4xl">{desc.emoji}</span>
              <div>
                <div className="text-3xl font-bold leading-none">
                  {weather.temperature.toFixed(1)}°C
                </div>
                <div className="text-sm opacity-90">{desc.label}</div>
              </div>
            </div>
          </div>
          <dl className="mt-3 grid grid-cols-3 gap-2 text-center">
            <Stat
              icon={<Thermometer size={13} />}
              label="Feels like"
              value={`${weather.apparentTemperature.toFixed(1)}°`}
            />
            <Stat
              icon={<Droplets size={13} />}
              label="Humidity"
              value={`${weather.humidity}%`}
            />
            <Stat
              icon={<Wind size={13} />}
              label="Wind"
              value={`${weather.windSpeed.toFixed(0)} km/h`}
            />
          </dl>
        </div>
      ) : (
        <div className="mt-3 text-sm text-slate-500">
          {loading ? "Loading weather…" : "No data."}
        </div>
      )}
    </div>
  );
}

function Stat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border bg-slate-50 px-2 py-2" style={{ borderColor: "rgba(15,23,42,0.06)" }}>
      <div className="text-[10px] uppercase tracking-wide text-slate-500 flex items-center justify-center gap-1">
        {icon}
        {label}
      </div>
      <div className="text-sm font-semibold text-slate-900">{value}</div>
    </div>
  );
}

function DistrictList({
  selectedId,
  onSelect,
  data,
}: {
  selectedId: string;
  onSelect: (id: string) => void;
  data: Record<string, CurrentWeather>;
}) {
  const grouped = useMemo(() => {
    const map = new Map<string, District[]>();
    for (const d of districts) {
      const arr = map.get(d.province) ?? [];
      arr.push(d);
      map.set(d.province, arr);
    }
    return Array.from(map.entries());
  }, []);

  return (
    <div>
      <div className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">
        All districts
      </div>
      <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
        {grouped.map(([province, list]) => (
          <div key={province}>
            <div className="text-[11px] text-slate-500 mb-1">{province}</div>
            <div className="grid grid-cols-2 gap-1.5">
              {list.map((d) => {
                const w = data[d.id];
                const isSelected = d.id === selectedId;
                return (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => onSelect(d.id)}
                    className="text-left rounded-md px-2 py-1.5 text-xs border transition-colors"
                    style={{
                      background: isSelected ? "#0f172a" : "white",
                      color: isSelected ? "white" : "#0f172a",
                      borderColor: isSelected ? "#0f172a" : "rgba(15,23,42,0.1)",
                    }}
                  >
                    <div className="font-medium truncate">{d.name}</div>
                    <div
                      className="text-[10px]"
                      style={{ color: isSelected ? "rgba(255,255,255,0.7)" : "#64748b" }}
                    >
                      {w ? `${w.temperature.toFixed(1)}°C` : "—"}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Legend() {
  const stops = [16, 22, 26, 29, 32, 36];
  return (
    <div className="mt-3 flex items-center gap-2 text-xs text-slate-600">
      <span>Cooler</span>
      <div className="flex h-3 rounded-full overflow-hidden flex-1">
        {stops.map((t, i) => {
          const next = stops[i + 1] ?? t;
          return (
            <div
              key={t}
              className="flex-1"
              style={{
                background: `linear-gradient(to right, ${tempColor(t)}, ${tempColor(next)})`,
              }}
            />
          );
        })}
      </div>
      <span>Warmer</span>
    </div>
  );
}
