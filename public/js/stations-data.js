/**
 * ElectBot — Polling Station Clustering Logic
 * This script generates a massive visual density of polling booths
 * and handles clustering for interactive stations.
 */

function setupMassiveMap(map, stations) {
    console.log("Initializing massive map density...");

    // 1. Visual Density Layer (The "500,000" booths effect)
    // We use a high-performance Canvas renderer for non-interactive points
    const boothCount = 200000; // 200k is a safe high-performance limit for canvas
    const canvasRenderer = L.canvas({ padding: 0.1 });
    
    // India Approximate Bounding Box
    const latMin = 8, latMax = 35;
    const lngMin = 68, lngMax = 97;

    for (let i = 0; i < boothCount; i++) {
        const lat = latMin + Math.random() * (latMax - latMin);
        const lng = lngMin + Math.random() * (lngMax - lngMin);

        // Simple geometric filter to roughly match India's shape (triangular south, wider north)
        let inIndia = false;
        if (lat > 22) {
            if (lng > 70 && lng < 90) inIndia = true;
        } else {
            // Tapering towards the south
            const width = (lat - 8) * 0.8;
            if (lng > 78 - width && lng < 78 + width) inIndia = true;
        }

        if (inIndia) {
            L.circleMarker([lat, lng], {
                renderer: canvasRenderer,
                radius: 0.4,
                fillColor: '#ffd700', // Gold color for booths
                fillOpacity: 0.3,
                stroke: false,
                interactive: false // This is key for performance
            }).addTo(map);
        }
    }

    console.log("Visual density layer added.");

    // 2. Interactive Clustering Layer
    // Uses Leaflet.markercluster for the "real" stations
    const markers = L.markerClusterGroup({
        showCoverageOnHover: false,
        maxClusterRadius: 50,
        iconCreateFunction: function (cluster) {
            return L.divIcon({
                html: `<div class="cluster-icon"><span>${cluster.getChildCount()}</span></div>`,
                className: 'custom-cluster',
                iconSize: L.point(40, 40)
            });
        }
    });

    stations.forEach(s => {
        const color = s.type === 'early' ? '#4ade80' : '#4a9eff';
        const markerHtml = `<div style="background-color: ${color}; width: 16px; height: 16px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 4px rgba(0,0,0,0.4);"></div>`;
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
