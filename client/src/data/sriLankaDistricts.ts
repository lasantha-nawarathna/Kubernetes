/**
 * Sri Lanka districts with approximate centroid coordinates.
 * Used to query Open-Meteo weather and place markers on an SVG outline.
 */

export interface District {
  id: string;
  name: string;
  province: string;
  lat: number;
  lng: number;
}

export const districts: District[] = [
  // Western
  { id: "colombo", name: "Colombo", province: "Western", lat: 6.93, lng: 79.86 },
  { id: "gampaha", name: "Gampaha", province: "Western", lat: 7.09, lng: 80.0 },
  { id: "kalutara", name: "Kalutara", province: "Western", lat: 6.58, lng: 79.96 },

  // Central
  { id: "kandy", name: "Kandy", province: "Central", lat: 7.29, lng: 80.64 },
  { id: "matale", name: "Matale", province: "Central", lat: 7.47, lng: 80.62 },
  { id: "nuwara-eliya", name: "Nuwara Eliya", province: "Central", lat: 6.97, lng: 80.78 },

  // Southern
  { id: "galle", name: "Galle", province: "Southern", lat: 6.05, lng: 80.22 },
  { id: "matara", name: "Matara", province: "Southern", lat: 5.95, lng: 80.55 },
  { id: "hambantota", name: "Hambantota", province: "Southern", lat: 6.12, lng: 81.1 },

  // Northern
  { id: "jaffna", name: "Jaffna", province: "Northern", lat: 9.66, lng: 80.02 },
  { id: "kilinochchi", name: "Kilinochchi", province: "Northern", lat: 9.39, lng: 80.4 },
  { id: "mannar", name: "Mannar", province: "Northern", lat: 8.98, lng: 79.91 },
  { id: "mullaitivu", name: "Mullaitivu", province: "Northern", lat: 9.27, lng: 80.82 },
  { id: "vavuniya", name: "Vavuniya", province: "Northern", lat: 8.75, lng: 80.5 },

  // Eastern
  { id: "trincomalee", name: "Trincomalee", province: "Eastern", lat: 8.59, lng: 81.21 },
  { id: "batticaloa", name: "Batticaloa", province: "Eastern", lat: 7.72, lng: 81.7 },
  { id: "ampara", name: "Ampara", province: "Eastern", lat: 7.3, lng: 81.68 },

  // North Western
  { id: "kurunegala", name: "Kurunegala", province: "North Western", lat: 7.49, lng: 80.36 },
  { id: "puttalam", name: "Puttalam", province: "North Western", lat: 8.03, lng: 79.83 },

  // North Central
  { id: "anuradhapura", name: "Anuradhapura", province: "North Central", lat: 8.31, lng: 80.41 },
  { id: "polonnaruwa", name: "Polonnaruwa", province: "North Central", lat: 7.94, lng: 81.0 },

  // Uva
  { id: "badulla", name: "Badulla", province: "Uva", lat: 6.99, lng: 81.06 },
  { id: "monaragala", name: "Monaragala", province: "Uva", lat: 6.87, lng: 81.35 },

  // Sabaragamuwa
  { id: "ratnapura", name: "Ratnapura", province: "Sabaragamuwa", lat: 6.68, lng: 80.4 },
  { id: "kegalle", name: "Kegalle", province: "Sabaragamuwa", lat: 7.25, lng: 80.35 },
];

// Sri Lanka bounding box (approximate, mainland)
export const BBOX = {
  minLat: 5.85,
  maxLat: 9.9,
  minLng: 79.6,
  maxLng: 81.95,
};

export const MAP_VIEW = { width: 400, height: 700 };

export function projectLngLat(lng: number, lat: number) {
  const x = ((lng - BBOX.minLng) / (BBOX.maxLng - BBOX.minLng)) * MAP_VIEW.width;
  const y = ((BBOX.maxLat - lat) / (BBOX.maxLat - BBOX.minLat)) * MAP_VIEW.height;
  return { x, y };
}

/**
 * Hand-traced simplified outline of Sri Lanka in lng/lat pairs (clockwise from north).
 * Projected at render-time to the SVG viewBox.
 */
export const SRI_LANKA_OUTLINE: [number, number][] = [
  [80.22, 9.83], // Point Pedro
  [80.45, 9.75],
  [80.82, 9.27], // Mullaitivu
  [81.05, 8.95],
  [81.21, 8.59], // Trincomalee
  [81.45, 8.2],
  [81.7, 7.72], // Batticaloa
  [81.83, 7.2],
  [81.83, 6.87], // Pottuvil
  [81.5, 6.4],
  [81.13, 6.12], // Hambantota
  [80.85, 5.95],
  [80.59, 5.92], // Dondra
  [80.22, 6.04], // Galle
  [80.0, 6.45],
  [79.85, 6.93], // Colombo
  [79.84, 7.21], // Negombo
  [79.83, 7.6],
  [79.83, 8.03], // Puttalam
  [79.7, 8.45],
  [79.91, 8.98], // Mannar
  [79.85, 9.4],
  [80.02, 9.66], // Jaffna
  [80.22, 9.83], // close
];
