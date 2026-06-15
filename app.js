'use strict';

// ── Zone metadata ──────────────────────────────────────────────────────────────

// Colors sampled directly from the PDF legends.
// Proposed-legend zones: use proposed PDF color in both views (title match = same color).
// Existing-only zones: use existing PDF color.
// Zones in GIS but absent from proposed PDF legend: use existing PDF color.
const ZONE_META = {
  // ── In proposed PDF legend ─────────────────────────────────────────────────
  'RESIDENCE A':                                           { color: '#f7e9ba', label: 'RESIDENCE A',                 definition: 'Family suburban residential area with related public uses' },
  'RESIDENCE B':                                           { color: '#ff02c5', label: 'RESIDENCE B',                 definition: 'Medium-density residential of various housing types' },
  'BUSINESS':                                              { color: '#d8ebf2', label: 'BUSINESS',                    definition: 'Retail and services' },
  'CENTRAL BUSINESS DISTRICT':                             { color: '#ffff00', label: 'CENTRAL BUSINESS DISTRICT',   definition: 'Preserves and improves character of Stoneham Square' },
  'COMMERCIAL 1':                                          { color: '#fdab01', label: 'COMMERCIAL 1',                definition: 'Light manufacturing, assembly, research, industrial & office parks, high-tech uses' },
  'COMMERCIAL 3':                                          { color: '#734c00', label: 'COMMERCIAL 3',                proposedLabel: 'COMMERCIAL 2', definition: 'Light manufacturing, assembly, research, industrial & office parks, high-tech uses, plus large-scale retail' },
  'COMMERCIAL/MIXED USE':                                  { color: '#c97af7', label: 'FALLON ROAD MIXED USE',        proposedLabel: 'MIXED USE', hideFromExistingLegend: true, definition: 'Commercial, office, and light industrial uses along Fallon Road', proposedDefinition: 'Mixed for commercial, office, housing, and light industrial uses' },
  'HIGHWAY BUSINESS':                                      { color: '#0071fd', label: 'HIGHWAY BUSINESS',            definition: 'Highway-oriented shopping centers, businesses, and services for transient use' },
  'HIGHWAY BUSINESS DISTRICT':                             { color: '#0071fd', label: 'HIGHWAY BUSINESS',            definition: 'Highway-oriented shopping centers, businesses, and services for transient use' },
  'MEDICAL/OFFICE/RESIDENTIAL':                            { color: '#9d9d9d', label: 'MEDICAL/OFFICE/RESIDENTIAL',  definition: 'Medical services, office and research uses, and mixed residential development.' },
  'RECREATION AND OPEN SPACE':                             { color: '#569c2a', label: 'RECREATION AND OPEN SPACE',   definition: 'Protects water supply, open space, and natural features with low-intensity public uses.' },
  'RESIDENTIAL FALLON RD DISTRICT':                        { color: '#c97af7', label: 'FALLON ROAD MIXED USE',        proposedLabel: 'FALLON ROAD MIXED USE DISTRICT', definition: 'Commercial, office, and light industrial uses along Fallon Road.' },
  // North Main is crosshatch in both PDFs; using solid periwinkle for web
  'NORTH MAIN MIXED USE RESIDENTIAL OVERLAY':              { color: '#7b83d4', label: 'NORTH MAIN MIXED USE RESIDENTIAL OVERLAY DISTRICT', proposedLabel: 'NORTH MAIN MIXED USE RESIDENTIAL OVERLAY', definition: 'Mixed-use and multifamily addition to underlying Highway Business zone' },
  'NORTH MAIN MIXED USE RESIDENTIAL OVERLAY DISTRICT':     { color: '#7b83d4', label: 'NORTH MAIN MIXED USE RESIDENTIAL OVERLAY DISTRICT', proposedLabel: 'NORTH MAIN MIXED USE RESIDENTIAL OVERLAY', definition: 'Mixed-use and multifamily addition to underlying Highway Business zone' },
  'NORTH MAIN STREET MIXED USE OVERLAY':                   { color: '#7b83d4', label: 'NORTH MAIN MIXED USE RESIDENTIAL OVERLAY DISTRICT', proposedLabel: 'NORTH MAIN MIXED USE RESIDENTIAL OVERLAY', definition: 'Mixed-use and multifamily addition to underlying Highway Business zone' },
  'NORTH MAIN STREET MIXED USE RESIDENTIAL OVERLAY':       { color: '#7b83d4', label: 'NORTH MAIN MIXED USE RESIDENTIAL OVERLAY DISTRICT', proposedLabel: 'NORTH MAIN MIXED USE RESIDENTIAL OVERLAY', definition: 'Mixed-use and multifamily addition to underlying Highway Business zone' },

  // ── In GIS but absent from proposed PDF legend — hidden in proposed/compare views ─
  'MEDICAL':                                               { color: '#c6d79e', label: 'MEDICAL',                        hideInProposed: true },
  'EAST SCHOOL':                                           { color: '#ff752b', label: 'EAST SCHOOL',                    hideInProposed: true },
  'HIGHWAY':                                               { color: '#9c9c9c', label: 'HIGHWAY RIGHT OF WAY',           hideInProposed: true },
  'MAPLE STREET OVERLAY':                                  { color: '#ff2e25', label: 'MAPLE STREET OVERLAY',           hideInProposed: true, filterInCompare: true, filterInAll: true, isOverlay: true },
  'SENIOR OVERLAY':                                        { color: '#eb924b', label: 'SENIOR OVERLAY',                 hideInProposed: true, filterInCompare: true, filterInAll: true, isOverlay: true },
  'TELECOM OVERLAY':                                       { color: '#5a5550', label: 'WIRELESS SERVICE FACILITIES',    hideInProposed: true, filterInCompare: true, filterInAll: true, isOverlay: true },

  // ── Existing only — existing PDF colors ───────────────────────────────────
  'EDUCATION DISTRICT':                                    { color: '#ca4643', label: 'EDUCATION' },
  'NEIGHBORHOOD BUSINESS':                                 { color: '#0a938d', label: 'NEIGHBORHOOD BUSINESS' },
  'NORTH SCHOOL':                                          { color: '#963d31', label: 'NORTH SCHOOL' },
  'RAILROAD RIGHT-OF-WAY OVERLAY':                         { color: '#9c9c9c', label: 'Railroad Right-of-Way',          hideInExisting: true, isOverlay: true },
  'RESIDENTIAL/BUSINESS OVERLAY':                          { color: '#b82d25', label: 'RESIDENTIAL/BUSINESS OVERLAY',  filterInAll: true },
};

function zoneMeta(z) {
  return ZONE_META[z] || { color: '#cccccc', label: z || 'Unknown' };
}

// Zone type strings that represent the same real-world zone (mirrors CANONICAL in compute_changed_areas.py)
const ZONE_CANONICAL = {
  'NORTH MAIN MIXED USE RESIDENTIAL OVERLAY':          'NORTH MAIN',
  'NORTH MAIN MIXED USE RESIDENTIAL OVERLAY DISTRICT': 'NORTH MAIN',
  'NORTH MAIN STREET MIXED USE OVERLAY':               'NORTH MAIN',
  'NORTH MAIN STREET MIXED USE RESIDENTIAL OVERLAY':   'NORTH MAIN',
  'HIGHWAY BUSINESS':                                  'HIGHWAY BUSINESS',
  'HIGHWAY BUSINESS DISTRICT':                         'HIGHWAY BUSINESS',
  'COMMERCIAL/MIXED USE':                              'FALLON RD',
  'RESIDENTIAL FALLON RD DISTRICT':                    'FALLON RD',
};
function zoneCanonical(z) { return ZONE_CANONICAL[z] || z; }

// Returns the display label for a zone type in the given mode
function zoneLabel(zt, mode) {
  const meta = zoneMeta(zt);
  if (mode !== 'current' && meta.proposedLabel) return meta.proposedLabel;
  return meta.label;
}

// Returns the definition string for a zone type in the given mode, or null
function zoneDefinition(zt, mode) {
  const meta = zoneMeta(zt);
  if (mode !== 'current' && meta.proposedDefinition) return meta.proposedDefinition;
  return meta.definition || null;
}

// Display order for legend rows (matches current zoning PDF order)
const LEGEND_ORDER = [
  'BUSINESS',
  'CENTRAL BUSINESS DISTRICT',
  'COMMERCIAL 1',
  'COMMERCIAL 3',
  'FALLON ROAD MIXED USE',
  'EDUCATION',
  'HIGHWAY RIGHT OF WAY',
  'HIGHWAY BUSINESS',
  'MEDICAL',
  'MEDICAL/OFFICE/RESIDENTIAL',
  'NEIGHBORHOOD BUSINESS',
  'RECREATION AND OPEN SPACE',
  'RESIDENCE A',
  'RESIDENCE B',
  'EAST SCHOOL',
  'NORTH MAIN MIXED USE RESIDENTIAL OVERLAY DISTRICT',
  'NORTH SCHOOL',
  'MAPLE STREET OVERLAY',
  'RESIDENTIAL/BUSINESS OVERLAY',
  'SENIOR OVERLAY',
  'WIRELESS SERVICE FACILITIES',
];

// Display order for legend rows in proposed/compare view (matches proposed zoning PDF order)
const PROPOSED_LEGEND_ORDER = [
  'BUSINESS',
  'CENTRAL BUSINESS DISTRICT',
  'COMMERCIAL 1',
  'COMMERCIAL 2',
  'HIGHWAY BUSINESS',
  'MEDICAL/OFFICE/RESIDENTIAL',
  'MIXED USE',
  'RECREATION AND OPEN SPACE',
  'RESIDENCE A',
  'RESIDENCE B',
  'FALLON ROAD MIXED USE DISTRICT',
  'NORTH MAIN MIXED USE RESIDENTIAL OVERLAY',
];

// Per-mode visibility: zones in these sets are hidden on the map.
// filterInCompare: start hidden in compare mode only
// filterInAll: start hidden in all modes
const hiddenByMode = { current: new Set(), proposed: new Set(), compare: new Set() };
Object.entries(ZONE_META).forEach(([zt, meta]) => {
  if (meta.filterInCompare) hiddenByMode.compare.add(zt);
  if (meta.filterInAll) {
    hiddenByMode.current.add(zt);
    hiddenByMode.proposed.add(zt);
    hiddenByMode.compare.add(zt);
  }
});

// Sort features smallest-first so specific zones win over large background zones in findZone
[EXISTING_ZONING, PROPOSED_ZONING].forEach(fc => {
  fc.features.sort((a, b) => (a.properties.Shape_Area || 0) - (b.properties.Shape_Area || 0));
});

// ── Map initialization ─────────────────────────────────────────────────────────

const map = L.map('map', { center: [42.474, -71.102], zoom: 17, zoomControl: false });
L.control.zoom({ position: 'topleft' }).addTo(map);

L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
  attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors © <a href="https://carto.com/attributions">CARTO</a>',
  maxZoom: 19
}).addTo(map);

// ── Layer styles ───────────────────────────────────────────────────────────────

function filledStyle(feature) {
  const c = zoneMeta(feature.properties.ZONETYPE).color;
  return { fillColor: c, fillOpacity: 0.65, color: '#333', weight: 0.8, opacity: 0.5 };
}

const INVISIBLE = { fillOpacity: 0, opacity: 0, weight: 0 };

function existingFilledStyle(feature) {
  const zt = feature.properties.ZONETYPE;
  if (zoneMeta(zt).hideInExisting || hiddenByMode.current.has(zt)) return INVISIBLE;
  return filledStyle(feature);
}

function proposedFilledStyle(feature) {
  const zt = feature.properties.ZONETYPE;
  if (zoneMeta(zt).hideInProposed || hiddenByMode.proposed.has(zt)) return INVISIBLE;
  return filledStyle(feature);
}

function compareFillStyle(feature) {
  const zt = feature.properties.ZONETYPE;
  if (zoneMeta(zt).hideInProposed || hiddenByMode.compare.has(zt)) return INVISIBLE;
  const c = zoneMeta(zt).color;
  return { fillColor: c, fillOpacity: 0.55, color: '#444', weight: 0.5, opacity: 0.4 };
}

function changedAreaStyle(feature) {
  const { old_zone, new_zone } = feature.properties;
  if (zoneMeta(old_zone).hideInExisting || zoneMeta(new_zone).hideInProposed) return INVISIBLE;
  if (hiddenByMode.compare.has(old_zone) || hiddenByMode.compare.has(new_zone)) return INVISIBLE;
  return { fillOpacity: 0, color: '#e94560', weight: 2.0, opacity: 1, dashArray: '6 4' };
}

// ── GeoJSON layers ─────────────────────────────────────────────────────────────

const existingLayer        = L.geoJSON(EXISTING_ZONING, { style: existingFilledStyle });
const proposedLayer        = L.geoJSON(PROPOSED_ZONING,  { style: proposedFilledStyle });
const proposedCompareLayer = L.geoJSON(PROPOSED_ZONING, { style: compareFillStyle });
const changedAreasLayer    = L.geoJSON(CHANGED_AREAS,   { style: changedAreaStyle });

// ── Mode management ────────────────────────────────────────────────────────────

let currentMode = 'current';
const allDataLayers = [existingLayer, proposedLayer, proposedCompareLayer, changedAreasLayer];

function setMode(mode) {
  currentMode = mode;
  allDataLayers.forEach(l => { if (map.hasLayer(l)) map.removeLayer(l); });

  if (mode === 'current') {
    existingLayer.addTo(map);
  } else if (mode === 'proposed') {
    proposedLayer.addTo(map);
  } else {
    proposedCompareLayer.addTo(map);
    changedAreasLayer.addTo(map);
  }

  document.querySelectorAll('.view-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.mode === mode);
  });

  updateLegend(mode);
  map.closePopup();
}

// ── Legend ─────────────────────────────────────────────────────────────────────

const existingZoneTypes = [...new Set(EXISTING_ZONING.features.map(f => f.properties.ZONETYPE))].sort();
const proposedZoneTypes = [...new Set(PROPOSED_ZONING.features.map(f => f.properties.ZONETYPE))].filter(Boolean).sort();

function updateLegend(mode) {
  document.getElementById('legend-title').textContent = 'Zone Legend';

  const body = document.getElementById('legend-body');
  const showBadges = mode === 'compare';

  const visibleExistingZones = existingZoneTypes.filter(z => !zoneMeta(z).hideInExisting && !zoneMeta(z).hideFromExistingLegend);
  const visibleProposedZones = proposedZoneTypes.filter(z => !zoneMeta(z).hideInProposed);
  const rawZones = showBadges
    ? [...new Set([...visibleExistingZones, ...visibleProposedZones])].filter(Boolean).sort()
    : (mode === 'current' ? visibleExistingZones : visibleProposedZones);

  // Use canonical sets for badge logic — more robust than label matching across modes
  const existingCanon = new Set(visibleExistingZones.map(z => zoneCanonical(z)));
  const proposedCanon = new Set(visibleProposedZones.map(z => zoneCanonical(z)));

  // Group zone type strings that share the same (color, mode-specific label) into one row
  const groups = new Map();
  for (const z of rawZones) {
    if (!z) continue;
    const meta = zoneMeta(z);
    const label = zoneLabel(z, mode);
    const key = `${meta.color}|${label}`;
    if (!groups.has(key)) groups.set(key, { meta, label, zoneTypes: [] });
    groups.get(key).zoneTypes.push(z);
  }

  const order = (mode === 'proposed' || mode === 'compare') ? PROPOSED_LEGEND_ORDER : LEGEND_ORDER;
  const sortedGroups = [...groups.values()].sort((a, b) => {
    const ai = order.indexOf(a.label);
    const bi = order.indexOf(b.label);
    return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
  });

  function makeRow({ meta, label, zoneTypes }, badge = '') {
    const allHidden = zoneTypes.every(zt => hiddenByMode[mode].has(zt));
    return `<label class="legend-row">
      <input type="checkbox" class="zone-toggle" data-zones="${zoneTypes.join(',')}" ${allHidden ? '' : 'checked'}>
      <div class="swatch" style="background:${meta.color}"></div>
      <span class="zone-name">${label}</span>${badge}
    </label>`;
  }

  const rows = [];
  if (showBadges) {
    const activeGroups = [];
    const removedGroups = [];
    for (const g of sortedGroups) {
      const canon = g.zoneTypes.map(z => zoneCanonical(z));
      const inProposed = canon.some(c => proposedCanon.has(c));
      const inExisting = canon.some(c => existingCanon.has(c));
      if (inExisting && !inProposed) removedGroups.push(g);
      else activeGroups.push(g);
    }
    for (const g of activeGroups) {
      const canon = g.zoneTypes.map(z => zoneCanonical(z));
      const badge = canon.some(c => !existingCanon.has(c) && proposedCanon.has(c))
        ? '<span class="badge-new">new</span>' : '';
      rows.push(makeRow(g, badge));
    }
    if (removedGroups.length) {
      rows.push('<div class="legend-removed-header">Removed in Proposal</div>');
      removedGroups.forEach(g => rows.push(makeRow(g)));
    }
  } else {
    sortedGroups.forEach(g => rows.push(makeRow(g)));
  }

  body.innerHTML = rows.join('');
}

let legendCollapsed = false;
document.getElementById('legend-toggle').addEventListener('click', () => {
  legendCollapsed = !legendCollapsed;
  document.getElementById('legend-body').classList.toggle('collapsed', legendCollapsed);
  document.getElementById('legend-arrow').classList.toggle('open', !legendCollapsed);
});

document.getElementById('legend-body').addEventListener('change', e => {
  const cb = e.target.closest('input[data-zones]');
  if (!cb) return;
  const zts = cb.dataset.zones.split(',');
  if (cb.checked) zts.forEach(z => hiddenByMode[currentMode].delete(z));
  else zts.forEach(z => hiddenByMode[currentMode].add(z));

  if (currentMode === 'current') existingLayer.setStyle(existingFilledStyle);
  else if (currentMode === 'proposed') proposedLayer.setStyle(proposedFilledStyle);
  else {
    proposedCompareLayer.setStyle(compareFillStyle);
    changedAreasLayer.setStyle(changedAreaStyle);
  }
});

// ── Mode buttons ───────────────────────────────────────────────────────────────

document.getElementById('btn-current').addEventListener('click', () => setMode('current'));
document.getElementById('btn-proposed').addEventListener('click', () => setMode('proposed'));
document.getElementById('btn-compare').addEventListener('click', () => setMode('compare'));

// ── Map click — all modes ──────────────────────────────────────────────────────

map.on('click', function(e) {
  if (currentMode === 'current' || currentMode === 'proposed') {
    const geojson = currentMode === 'current' ? EXISTING_ZONING : PROPOSED_ZONING;
    const zone = findZone(geojson, e.latlng, currentMode);
    if (!zone) return;
    const meta = zoneMeta(zone);
    const def = zoneDefinition(zone, currentMode);
    L.popup()
      .setLatLng(e.latlng)
      .setContent(`<div class="popup-block">
        <div class="popup-label">${currentMode === 'current' ? 'Current Zone' : 'Proposed Zone'}</div>
        <div class="popup-row">
          <div class="popup-swatch" style="background:${meta.color}"></div>
          <div class="popup-zone-group">
            <div class="popup-zone">${zoneLabel(zone, currentMode)}</div>
            ${def ? `<div class="popup-zone-def">${def}</div>` : ''}
          </div>
        </div>
      </div>`)
      .openOn(map);
    return;
  }

  const existingZone = findZone(EXISTING_ZONING, e.latlng, 'compare_existing');
  const proposedZone = findZone(PROPOSED_ZONING, e.latlng, 'compare_proposed');
  if (!existingZone && !proposedZone) return;

  const exMeta = zoneMeta(existingZone);
  const prMeta = zoneMeta(proposedZone);
  const proposedColor = proposedZone ? prMeta.color : 'transparent';
  const noChange = existingZone && proposedZone && zoneCanonical(existingZone) === zoneCanonical(proposedZone);

  const exDef = existingZone ? zoneDefinition(existingZone, 'current') : null;
  const prDef = proposedZone ? zoneDefinition(proposedZone, 'proposed') : null;
  const content = noChange
    ? `<div class="popup-block">
        <div class="popup-label">No Change</div>
        <div class="popup-row">
          <div class="popup-swatch" style="background:${exMeta.color}"></div>
          <div class="popup-zone-group">
            <div class="popup-zone">${zoneLabel(existingZone, 'current')}</div>
            ${exDef ? `<div class="popup-zone-def">${exDef}</div>` : ''}
          </div>
        </div>
      </div>`
    : `<div class="popup-compare">
        <div class="popup-block">
          <div class="popup-label">Current Zone</div>
          <div class="popup-row">
            <div class="popup-swatch" style="background:${exMeta.color}"></div>
            <div class="popup-zone-group">
              <div class="popup-zone">${zoneLabel(existingZone, 'current')}</div>
              ${exDef ? `<div class="popup-zone-def">${exDef}</div>` : ''}
            </div>
          </div>
        </div>
        <div class="popup-block popup-block-last">
          <div class="popup-label">Proposed Zone</div>
          <div class="popup-row">
            <div class="popup-swatch" style="background:${proposedColor}"></div>
            <div class="popup-zone-group">
              <div class="popup-zone">${proposedZone ? zoneLabel(proposedZone, 'proposed') : '(not in proposed plan)'}</div>
              ${prDef ? `<div class="popup-zone-def">${prDef}</div>` : ''}
            </div>
          </div>
        </div>
      </div>`;
  L.popup()
    .setLatLng(e.latlng)
    .setContent(content)
    .openOn(map);
});

// ── Point-in-polygon (ray casting) ────────────────────────────────────────────

function pointInRing(pt, ring) {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const xi = ring[i][0], yi = ring[i][1];
    const xj = ring[j][0], yj = ring[j][1];
    if ((yi > pt[1]) !== (yj > pt[1]) && pt[0] < (xj - xi) * (pt[1] - yi) / (yj - yi) + xi)
      inside = !inside;
  }
  return inside;
}

function pointInPolygon(pt, coords) {
  // GIS export stores separate parcels as multiple rings rather than a proper MultiPolygon;
  // treat every ring as a potential outer polygon instead of assuming extras are holes.
  return coords.some(ring => pointInRing(pt, ring));
}

function pointInGeometry(pt, geom) {
  if (geom.type === 'MultiPolygon')
    return geom.coordinates.some(poly => pointInPolygon(pt, poly));
  return pointInPolygon(pt, geom.coordinates);
}

function findZone(geojson, latlng, mode) {
  const pt = [latlng.lng, latlng.lat];
  let overlayFallback = null;
  for (const feature of geojson.features) {
    if (!pointInGeometry(pt, feature.geometry)) continue;
    const zt = feature.properties.ZONETYPE || '';
    const meta = zoneMeta(zt);
    if (mode === 'current'          && (meta.hideInExisting || hiddenByMode.current.has(zt)))           continue;
    if (mode === 'proposed'         && (meta.hideInProposed || hiddenByMode.proposed.has(zt)))          continue;
    if (mode === 'compare'          && hiddenByMode.compare.has(zt))                                    continue;
    if (mode === 'compare_existing' && (meta.hideInExisting || hiddenByMode.compare.has(zt)))           continue;
    if (mode === 'compare_proposed' && (meta.hideInProposed || hiddenByMode.compare.has(zt)))           continue;
    if (meta.isOverlay) {
      if (!overlayFallback) overlayFallback = zt;
    } else {
      return zt;
    }
  }
  return overlayFallback;
}

// ── Address search ─────────────────────────────────────────────────────────────

let searchMarker = null;

const redPinIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
  className: 'red-marker-icon'
});

let toastTimer = null;
function showToast(message) {
  const toast = document.getElementById('search-toast');
  toast.textContent = message;
  toast.classList.add('visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('visible'), 4000);
}

async function searchAddress(address) {
  const btn = document.getElementById('search-btn');
  btn.disabled = true;

  try {
    const q = encodeURIComponent(address.trim() + ', Stoneham, MA');
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${q}&format=json&limit=1&countrycodes=us&viewbox=-71.13,42.51,-71.07,42.44&bounded=1`
    );
    const data = await res.json();

    if (!data.length) {
      showToast("Not found. Use full Stoneham addresses, e.g. '35 Central Street'");
      return;
    }

    const latlng = { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
    const existingZone = findZone(EXISTING_ZONING, latlng, 'current');
    const proposedZone = findZone(PROPOSED_ZONING, latlng, 'proposed');

    if (!existingZone && !proposedZone) {
      showToast("Not found. Use full Stoneham addresses, e.g. '35 Central Street'");
      return;
    }

    if (searchMarker) map.removeLayer(searchMarker);
    searchMarker = L.marker([latlng.lat, latlng.lng], { icon: redPinIcon }).addTo(map);
    map.setView([latlng.lat, latlng.lng], 17);

    showResultCard(address, existingZone, proposedZone);
  } catch {
    showToast('Network failure. Check your connection and try again.');
  } finally {
    btn.disabled = false;
  }
}

function showResultCard(address, existingZone, proposedZone) {
  const content = document.getElementById('result-content');
  const exMeta = zoneMeta(existingZone);
  const prMeta = zoneMeta(proposedZone);
  const exPrimary = currentMode !== 'proposed';
  const prPrimary = currentMode !== 'current';
  content.innerHTML = `
    <p class="result-addr"></p>
    <div class="result-zones">
      <div class="result-zone ${exPrimary ? '' : 'result-zone-secondary'}">
        <span class="result-zone-label">Current Zone</span>
        <div class="result-zone-row">
          <div class="result-swatch" style="background:${exMeta.color}"></div>
          <span class="result-zone-name">${zoneLabel(existingZone, 'current')}</span>
        </div>
      </div>
      <div class="result-zone ${prPrimary ? '' : 'result-zone-secondary'}">
        <span class="result-zone-label">Proposed Zone</span>
        <div class="result-zone-row">
          <div class="result-swatch" style="background:${prMeta.color}"></div>
          <span class="result-zone-name">${zoneLabel(proposedZone, 'proposed')}</span>
        </div>
      </div>
    </div>`;
  content.querySelector('.result-addr').textContent = address;
  document.getElementById('result-card').classList.remove('hidden');
}

document.getElementById('result-close').addEventListener('click', () => {
  document.getElementById('result-card').classList.add('hidden');
  if (searchMarker) { map.removeLayer(searchMarker); searchMarker = null; }
});

document.getElementById('search-btn').addEventListener('click', () => {
  const v = document.getElementById('address-input').value.trim();
  if (v) searchAddress(v);
});

document.getElementById('address-input').addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    const v = e.target.value.trim();
    if (v) searchAddress(v);
  }
});

// ── Sidebar toggle ─────────────────────────────────────────────────────────────

function toggleSidebar(collapse) {
  const sidebar = document.getElementById('sidebar');
  const isCollapsed = collapse !== undefined ? collapse : !sidebar.classList.contains('collapsed');
  sidebar.classList.toggle('collapsed', isCollapsed);
  document.body.classList.toggle('sidebar-collapsed', isCollapsed);
}

document.getElementById('sidebar-collapse').addEventListener('click', () => toggleSidebar(true));
document.getElementById('sidebar-expand').addEventListener('click', () => toggleSidebar(false));

// ── Boot ───────────────────────────────────────────────────────────────────────

setMode('compare');
