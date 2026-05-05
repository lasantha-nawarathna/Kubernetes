import {
  districts,
  projectLngLat,
  MAP_VIEW,
  SRI_LANKA_OUTLINE,
  type District,
} from "@/data/sriLankaDistricts";
import { describeWeather, tempColor, type CurrentWeather } from "@/lib/weather";

interface Props {
  weatherByDistrict: Record<string, CurrentWeather | undefined>;
  selectedId: string | null;
  onSelect: (district: District) => void;
}

export default function SriLankaWeatherMap({
  weatherByDistrict,
  selectedId,
  onSelect,
}: Props) {
  const outlinePath =
    SRI_LANKA_OUTLINE.map(([lng, lat], i) => {
      const { x, y } = projectLngLat(lng, lat);
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    }).join(" ") + " Z";

  return (
    <svg
      viewBox={`0 0 ${MAP_VIEW.width} ${MAP_VIEW.height}`}
      className="w-full h-auto max-h-[80vh] block"
      role="img"
      aria-label="Map of Sri Lanka with current weather by district"
    >
      <defs>
        <radialGradient id="sea" cx="50%" cy="40%" r="80%">
          <stop offset="0%" stopColor="#dff1ff" />
          <stop offset="100%" stopColor="#bfe1f5" />
        </radialGradient>
        <linearGradient id="land" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f4f7e8" />
          <stop offset="100%" stopColor="#e3edc6" />
        </linearGradient>
      </defs>

      <rect
        x={0}
        y={0}
        width={MAP_VIEW.width}
        height={MAP_VIEW.height}
        fill="url(#sea)"
      />

      <path
        d={outlinePath}
        fill="url(#land)"
        stroke="#7a8a4a"
        strokeWidth={1.5}
        strokeLinejoin="round"
      />

      {/* District markers */}
      {districts.map((d) => {
        const { x, y } = projectLngLat(d.lng, d.lat);
        const w = weatherByDistrict[d.id];
        const isSelected = selectedId === d.id;
        const fill = w ? tempColor(w.temperature) : "#cbd5e1";
        const radius = isSelected ? 22 : 18;
        return (
          <g
            key={d.id}
            transform={`translate(${x}, ${y})`}
            style={{ cursor: "pointer" }}
            onClick={() => onSelect(d)}
          >
            <circle
              r={radius}
              fill={fill}
              stroke={isSelected ? "#0f172a" : "white"}
              strokeWidth={isSelected ? 3 : 2}
              opacity={0.95}
            >
              <title>
                {d.name}
                {w
                  ? ` — ${w.temperature.toFixed(1)}°C, ${describeWeather(w.weatherCode).label}`
                  : ""}
              </title>
            </circle>
            {w ? (
              <>
                <text
                  textAnchor="middle"
                  y={-1}
                  fontSize={11}
                  fontWeight={700}
                  fill="#0f172a"
                  style={{ pointerEvents: "none", fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  {Math.round(w.temperature)}°
                </text>
                <text
                  textAnchor="middle"
                  y={11}
                  fontSize={10}
                  style={{ pointerEvents: "none" }}
                >
                  {describeWeather(w.weatherCode).emoji}
                </text>
              </>
            ) : (
              <text
                textAnchor="middle"
                y={4}
                fontSize={10}
                fill="#475569"
                style={{ pointerEvents: "none" }}
              >
                …
              </text>
            )}
            <text
              textAnchor="middle"
              y={radius + 12}
              fontSize={10}
              fill="#1e293b"
              style={{ pointerEvents: "none", fontFamily: "'Space Grotesk', sans-serif" }}
            >
              {d.name}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
