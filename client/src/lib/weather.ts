/**
 * Open-Meteo client (no API key required) and WMO weather code helpers.
 * Docs: https://open-meteo.com/en/docs
 */

export interface CurrentWeather {
  temperature: number;
  apparentTemperature: number;
  humidity: number;
  windSpeed: number;
  weatherCode: number;
  time: string;
}

interface OpenMeteoResponse {
  current: {
    time: string;
    temperature_2m: number;
    apparent_temperature: number;
    relative_humidity_2m: number;
    wind_speed_10m: number;
    weather_code: number;
  };
}

export async function fetchWeatherForPoints(
  points: { lat: number; lng: number }[],
): Promise<CurrentWeather[]> {
  // Open-Meteo supports comma-separated lat/lon to fetch many locations in one call.
  const lats = points.map((p) => p.lat).join(",");
  const lngs = points.map((p) => p.lng).join(",");
  const url = new URL("https://api.open-meteo.com/v1/forecast");
  url.searchParams.set("latitude", lats);
  url.searchParams.set("longitude", lngs);
  url.searchParams.set(
    "current",
    "temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weather_code",
  );
  url.searchParams.set("timezone", "Asia/Colombo");
  url.searchParams.set("wind_speed_unit", "kmh");

  const res = await fetch(url.toString());
  if (!res.ok) {
    throw new Error(`Weather API error: ${res.status}`);
  }
  const data = (await res.json()) as OpenMeteoResponse | OpenMeteoResponse[];
  const arr = Array.isArray(data) ? data : [data];
  return arr.map((entry) => ({
    temperature: entry.current.temperature_2m,
    apparentTemperature: entry.current.apparent_temperature,
    humidity: entry.current.relative_humidity_2m,
    windSpeed: entry.current.wind_speed_10m,
    weatherCode: entry.current.weather_code,
    time: entry.current.time,
  }));
}

export function describeWeather(code: number): { label: string; emoji: string } {
  // WMO Weather interpretation codes (subset)
  if (code === 0) return { label: "Clear sky", emoji: "☀️" };
  if (code === 1) return { label: "Mainly clear", emoji: "🌤️" };
  if (code === 2) return { label: "Partly cloudy", emoji: "⛅" };
  if (code === 3) return { label: "Overcast", emoji: "☁️" };
  if (code === 45 || code === 48) return { label: "Fog", emoji: "🌫️" };
  if (code >= 51 && code <= 57) return { label: "Drizzle", emoji: "🌦️" };
  if (code >= 61 && code <= 65) return { label: "Rain", emoji: "🌧️" };
  if (code >= 66 && code <= 67) return { label: "Freezing rain", emoji: "🌧️" };
  if (code >= 71 && code <= 77) return { label: "Snow", emoji: "❄️" };
  if (code >= 80 && code <= 82) return { label: "Rain showers", emoji: "🌧️" };
  if (code >= 85 && code <= 86) return { label: "Snow showers", emoji: "🌨️" };
  if (code === 95) return { label: "Thunderstorm", emoji: "⛈️" };
  if (code === 96 || code === 99) return { label: "Thunderstorm with hail", emoji: "⛈️" };
  return { label: "Unknown", emoji: "❓" };
}

/**
 * Map a temperature in °C to a color along a cool→warm scale.
 * Designed for typical Sri Lankan ranges (~18°C uplands → ~34°C lowlands).
 */
export function tempColor(temp: number): string {
  // Clamp into a useful range, then interpolate across stops.
  const stops: { t: number; rgb: [number, number, number] }[] = [
    { t: 16, rgb: [56, 130, 255] },   // cool blue
    { t: 22, rgb: [56, 200, 200] },   // teal
    { t: 26, rgb: [120, 200, 90] },   // green
    { t: 29, rgb: [245, 200, 60] },   // yellow
    { t: 32, rgb: [240, 140, 50] },   // orange
    { t: 36, rgb: [225, 60, 60] },    // red
  ];
  if (temp <= stops[0].t) return rgb(stops[0].rgb);
  if (temp >= stops[stops.length - 1].t) return rgb(stops[stops.length - 1].rgb);
  for (let i = 0; i < stops.length - 1; i++) {
    const a = stops[i];
    const b = stops[i + 1];
    if (temp >= a.t && temp <= b.t) {
      const f = (temp - a.t) / (b.t - a.t);
      return rgb([
        Math.round(a.rgb[0] + (b.rgb[0] - a.rgb[0]) * f),
        Math.round(a.rgb[1] + (b.rgb[1] - a.rgb[1]) * f),
        Math.round(a.rgb[2] + (b.rgb[2] - a.rgb[2]) * f),
      ]);
    }
  }
  return rgb(stops[0].rgb);
}

function rgb([r, g, b]: [number, number, number]) {
  return `rgb(${r}, ${g}, ${b})`;
}
