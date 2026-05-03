/**
 * ElectBot — Polling Station Clustering Logic
 *
 * Generates a massive visual density of polling booths using Canvas rendering
 * for performance, and handles interactive station clustering with Leaflet.
 *
 * @module stations-data
 * @version 2.0.0
 * @requires L - Leaflet library
 */

'use strict';

// ═══════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════

/** @type {number} Number of visual density points to render */
const BOOTH_COUNT = 200000;

/** @type {number} India's southern latitude boundary */
const INDIA_LAT_MIN = 8;

/** @type {number} India's northern latitude boundary */
const INDIA_LAT_MAX = 35;

/** @type {number} India's western longitude boundary */
const INDIA_LNG_MIN = 68;

/** @type {number} India's eastern longitude boundary */
const INDIA_LNG_MAX = 97;

/** @type {number} Maximum cluster grouping radius (px) */
const MAX_CLUSTER_RADIUS = 50;

/** @type {string} Color for canvas booth markers */
const BOOTH_COLOR = '#ffd700';

/** @type {number} Opacity for canvas booth markers */
const BOOTH_OPACITY = 0.3;

/** @type {number} Radius for canvas booth markers (px) */
const BOOTH_RADIUS = 0.4;

// ═══════════════════════════════════════
// MAP SETUP
// ═══════════════════════════════════════

/**
 * Check if a latitude/longitude point falls roughly within India's borders.
 * Uses a simplified geometric approximation — wider in the north,
 * tapering toward the southern peninsula.
 *
 * @param {number} lat - Latitude of the point
 * @param {number} lng - Longitude of the point
 * @returns {boolean} True if the point is approximately within India
 */
function isPointInIndia(lat, lng) {
  if (lat > 22) {
    return lng > 70 && lng < 90;
  }
  // Tapering towards the south
  const width = (lat - INDIA_LAT_MIN) * 0.8;
  return lng > 78 - width && lng < 78 + width;
}

/**
 * Set up the massive polling station map visualization.
 * Creates two layers:
 * 1. A Canvas-rendered density layer with thousands of non-interactive points
 * 2. An interactive MarkerCluster layer for real station data
 *
 * @param {L.Map} map - The Leaflet map instance
 * @param {Array<{name: string, address: string, hours: string, lat: number, lng: number, type: string}>} stations - Array of station objects
 */
function setupMassiveMap(map, stations) {
  console.log('Initializing massive map density...');

  // 1. Visual Density Layer — Canvas renderer for performance
  const canvasRenderer = L.canvas({ padding: 0.1 });

  for (let i = 0; i < BOOTH_COUNT; i++) {
    const lat = INDIA_LAT_MIN + Math.random() * (INDIA_LAT_MAX - INDIA_LAT_MIN);
    const lng = INDIA_LNG_MIN + Math.random() * (INDIA_LNG_MAX - INDIA_LNG_MIN);

    if (isPointInIndia(lat, lng)) {
      L.circleMarker([lat, lng], {
        renderer: canvasRenderer,
        radius: BOOTH_RADIUS,
        fillColor: BOOTH_COLOR,
        fillOpacity: BOOTH_OPACITY,
        stroke: false,
        interactive: false
      }).addTo(map);
    }
  }

  console.log('Visual density layer added.');

  // 2. Interactive Clustering Layer
  const markers = L.markerClusterGroup({
    showCoverageOnHover: false,
    maxClusterRadius: MAX_CLUSTER_RADIUS,
    /**
     * Create a custom cluster icon.
     * @param {L.MarkerCluster} cluster - The cluster object
     * @returns {L.DivIcon} Custom div icon
     */
    iconCreateFunction: function (cluster) {
      return L.divIcon({
        html: `<div class="cluster-icon"><span>${cluster.getChildCount()}</span></div>`,
        className: 'custom-cluster',
        iconSize: L.point(40, 40)
      });
    }
  });

  stations.forEach((s) => {
    const color = s.type === 'early' ? '#4ade80' : '#4a9eff';
    const markerHtml = `<div style="background-color: ${color}; width: 16px; height: 16px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 4px rgba(0,0,0,0.4);" role="img" aria-label="${s.name} polling station"></div>`;
    const icon = L.divIcon({
      html: markerHtml,
      className: 'custom-leaflet-marker',
      iconSize: [20, 20],
      iconAnchor: [10, 10]
    });

    const marker = L.marker([s.lat, s.lng], { icon: icon });
    marker.bindPopup(`
      <div style="color:#333;padding:5px;font-family:var(--font-sans)">
        <strong style="display:block;margin-bottom:4px">${s.name}</strong>
        <p style="margin:0;font-size:12px;color:#666">${s.address}</p>
        <div style="margin-top:8px;padding-top:8px;border-top:1px solid #eee">
          <span style="font-size:10px;text-transform:uppercase;color:#888">Polling Hours</span><br>
          <span style="font-size:11px;font-weight:600">${s.hours}</span>
        </div>
      </div>
    `);
    markers.addLayer(marker);
  });

  map.addLayer(markers);
}
