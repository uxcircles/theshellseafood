/* The Shell map: MapLibre + OpenFreeMap vector tiles, drawn in the site's night-navy palette.
   Loaded on demand by main.js after maplibre-gl.js. Change colours in C below. */
(() => {
  const C = {
    land: '#11263d',        // raised navy (--ink-2)
    building: '#183552',
    buildingLine: '#21436a',
    park: '#123a3a',        // deep sea green
    water: '#0b5578',       // badge blue, darkened
    road: '#2a4a6c',
    roadCase: '#0d2035',
    major: '#3b6690',
    majorCase: '#0d2035',
    path: '#2f5274',
    rail: '#3a5675',
    label: '#c9d5e1',
    labelSoft: '#8fa3b8',
    park_label: '#7fb3a6',
    halo: '#0a1a2c',        // --ink
  };

  const name = ['coalesce', ['get', 'name:en'], ['get', 'name_en'], ['get', 'name']];
  // road width by zoom: [z14, z16, z18]
  const width = (a, b, c) => ['interpolate', ['exponential', 1.6], ['zoom'], 14, a, 16, b, 18, c];
  const major = ['match', ['get', 'class'], ['motorway', 'trunk', 'primary', 'secondary'], true, false];
  const minor = ['match', ['get', 'class'], ['tertiary', 'minor', 'service', 'street', 'residential'], true, false];

  const style = {
    version: 8,
    glyphs: 'https://tiles.openfreemap.org/fonts/{fontstack}/{range}.pbf',
    sources: {
      omt: { type: 'vector', url: 'https://tiles.openfreemap.org/planet' },
    },
    layers: [
      { id: 'land', type: 'background', paint: { 'background-color': C.land } },
      { id: 'park', type: 'fill', source: 'omt', 'source-layer': 'park', paint: { 'fill-color': C.park } },
      {
        id: 'green', type: 'fill', source: 'omt', 'source-layer': 'landcover',
        filter: ['match', ['get', 'class'], ['grass', 'wood', 'farmland'], true, false],
        paint: { 'fill-color': C.park },
      },
      {
        id: 'green-landuse', type: 'fill', source: 'omt', 'source-layer': 'landuse',
        filter: ['match', ['get', 'class'], ['park', 'grass', 'cemetery', 'pitch', 'playground'], true, false],
        paint: { 'fill-color': C.park },
      },
      { id: 'water', type: 'fill', source: 'omt', 'source-layer': 'water', paint: { 'fill-color': C.water } },
      {
        id: 'waterway', type: 'line', source: 'omt', 'source-layer': 'waterway',
        paint: { 'line-color': C.water, 'line-width': ['interpolate', ['linear'], ['zoom'], 13, 1, 18, 6] },
      },
      {
        id: 'building', type: 'fill', source: 'omt', 'source-layer': 'building', minzoom: 13,
        paint: { 'fill-color': C.building, 'fill-outline-color': C.buildingLine },
      },
      {
        id: 'path', type: 'line', source: 'omt', 'source-layer': 'transportation', minzoom: 15,
        filter: ['match', ['get', 'class'], ['path', 'track'], true, false],
        paint: { 'line-color': C.path, 'line-width': 1.2, 'line-dasharray': [2, 1.5] },
      },
      {
        id: 'rail', type: 'line', source: 'omt', 'source-layer': 'transportation',
        filter: ['match', ['get', 'class'], ['rail', 'transit'], true, false],
        paint: { 'line-color': C.rail, 'line-width': 1.4, 'line-dasharray': [3, 2] },
      },
      {
        id: 'road-case', type: 'line', source: 'omt', 'source-layer': 'transportation',
        filter: minor, layout: { 'line-cap': 'round', 'line-join': 'round' },
        paint: { 'line-color': C.roadCase, 'line-width': width(2.5, 7, 22) },
      },
      {
        id: 'major-case', type: 'line', source: 'omt', 'source-layer': 'transportation',
        filter: major, layout: { 'line-cap': 'round', 'line-join': 'round' },
        paint: { 'line-color': C.majorCase, 'line-width': width(4, 11, 32) },
      },
      {
        id: 'road', type: 'line', source: 'omt', 'source-layer': 'transportation',
        filter: minor, layout: { 'line-cap': 'round', 'line-join': 'round' },
        paint: { 'line-color': C.road, 'line-width': width(1.5, 5, 18) },
      },
      {
        id: 'major', type: 'line', source: 'omt', 'source-layer': 'transportation',
        filter: major, layout: { 'line-cap': 'round', 'line-join': 'round' },
        paint: { 'line-color': C.major, 'line-width': width(2.5, 8.5, 28) },
      },
      {
        id: 'road-label', type: 'symbol', source: 'omt', 'source-layer': 'transportation_name', minzoom: 15,
        layout: {
          'symbol-placement': 'line', 'text-field': name, 'text-font': ['Noto Sans Regular'],
          'text-size': ['interpolate', ['linear'], ['zoom'], 15, 10, 18, 13], 'text-letter-spacing': 0.03,
        },
        paint: { 'text-color': C.labelSoft, 'text-halo-color': C.halo, 'text-halo-width': 1.4 },
      },
      {
        id: 'park-label', type: 'symbol', source: 'omt', 'source-layer': 'poi', minzoom: 15,
        filter: ['match', ['get', 'class'], ['park', 'garden'], true, false],
        layout: { 'text-field': name, 'text-font': ['Noto Sans Italic'], 'text-size': 11, 'text-max-width': 8 },
        paint: { 'text-color': C.park_label, 'text-halo-color': C.halo, 'text-halo-width': 1.2 },
      },
      {
        id: 'area-label', type: 'symbol', source: 'omt', 'source-layer': 'place',
        filter: ['match', ['get', 'class'], ['suburb', 'quarter', 'neighbourhood'], true, false],
        layout: {
          'text-field': ['upcase', name], 'text-font': ['Noto Sans Bold'], 'text-size': 11,
          'text-letter-spacing': 0.18, 'text-max-width': 8,
        },
        paint: { 'text-color': C.label, 'text-halo-color': C.halo, 'text-halo-width': 1.4 },
      },
    ],
  };

  const el = (html, className) => {
    const div = document.createElement('div');
    div.className = className;
    div.innerHTML = html;
    return div;
  };

  window.shellMap = (container) => {
    const { maplibregl } = window;
    const home = [Number(container.dataset.lng), Number(container.dataset.lat)];
    const stations = JSON.parse(container.dataset.stations); // [[name, lng, lat], …]

    const map = new maplibregl.Map({
      container,
      style,
      center: home,
      zoom: 16,
      maxZoom: 19,
      minZoom: 12,
      pitchWithRotate: false,
      dragRotate: false,
      // page scrolls normally; two fingers (or Ctrl/⌘ + wheel) move the map
      cooperativeGestures: true,
      attributionControl: { compact: true },
    });
    map.touchZoomRotate.disableRotation();
    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-left');

    const bounds = new maplibregl.LngLatBounds(home, home);
    stations.forEach(([label, lng, lat]) => {
      new maplibregl.Marker({ element: el(`<span class="roundel"></span><span class="station-name">${label}</span>`, 'map-station'), anchor: 'center' })
        .setLngLat([lng, lat]).addTo(map);
      bounds.extend([lng, lat]);
    });
    // the lobster badge from the logo, in a coral pin
    new maplibregl.Marker({ element: el(`<span class="pin"><img src="${container.dataset.logo}" alt="" width="34" height="34"></span><span class="pin-label">The Shell</span>`, 'map-pin'), anchor: 'bottom' })
      .setLngLat(home).addTo(map);

    // frame the restaurant and both stations
    map.fitBounds(bounds, { padding: { top: 80, bottom: 70, left: 60, right: 130 }, maxZoom: 16.4, duration: 0 });
    return map;
  };
})();
