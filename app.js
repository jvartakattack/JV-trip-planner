// ── Configuration ───────────────────────────────────────────────────────────

const HOME_STOP = { lat: 37.7510, lng: -122.4786, name: '2020 20th Ave' };

// NextBus/Umo stop tags for real-time predictions (no API key needed)
const NEXTBUS_AGENCY = 'sf-muni';
const NEXTBUS_STOPS = {
  // route|stopTag pairs for predictionsForMultiStops
  bus28: { route: '28', stopTag: '6298' },   // 28 at 19th & Quintara
  bus48: { route: '48', stopTag: '6298' },   // 48 at Quintara & 19th
  trainK: { route: 'KT', stopTag: '7218' },  // K at West Portal
  trainL_wp: { route: 'L', stopTag: '7218' }, // L at West Portal
  trainM: { route: 'M', stopTag: '7218' },    // M at West Portal
  trainL_tav: { route: 'L', stopTag: '6297' } // L at Taraval & 19th
};

const WALK_TO_BUS_STOP_MIN = 3;

const BUS_ROUTES = {
  '28': {
    name: '28',
    color: '#d4a017',
    cssClass: 'r28',
    dotClass: 'bus',
    direction: '19th Ave Inbound',
    stopCoords: { lat: 37.7462, lng: -122.4756 },
    transferStation: 'West Portal',
    transferCoords: { lat: 37.7408, lng: -122.4661 },
    walkToStop: WALK_TO_BUS_STOP_MIN,
    timeToTransfer: 8,
    trainLines: ['K', 'L', 'M'],
    schedule: {
      weekday: {
        start: 300, end: 1500, // 5:00 AM – 1:00 AM (minutes from midnight)
        peakFreq: 8, offPeakFreq: 12,
        peakWindows: [[420, 540], [960, 1140]] // 7-9 AM, 4-7 PM
      },
      weekend: { start: 360, end: 1500, freq: 15 }
    }
  },
  '48': {
    name: '48',
    color: '#7b1fa2',
    cssClass: 'r48',
    dotClass: 'bus-48',
    direction: 'Quintara / 24th St',
    stopCoords: { lat: 37.7462, lng: -122.4756 },
    transferStation: 'Taraval & 19th',
    transferCoords: { lat: 37.7432, lng: -122.4755 },
    walkToStop: WALK_TO_BUS_STOP_MIN,
    timeToTransfer: 3,
    trainLines: ['L'],
    schedule: {
      weekday: {
        start: 330, end: 1470, // 5:30 AM – 12:30 AM
        peakFreq: 10, offPeakFreq: 15,
        peakWindows: [[420, 540], [960, 1140]]
      },
      weekend: { start: 360, end: 1470, freq: 20 }
    }
  }
};

const TRAIN_LINE_COLORS = {
  K: { color: '#009bdf', cssClass: 'k', name: 'K Ingleside' },
  L: { color: '#9b59b6', cssClass: 'l', name: 'L Taraval' },
  M: { color: '#4caf50', cssClass: 'm', name: 'M Ocean View' }
};

const TRAIN_SCHEDULES = {
  'West Portal': {
    K: { weekday: { peakFreq: 8, offPeakFreq: 12 }, weekend: { freq: 15 } },
    L: { weekday: { peakFreq: 9, offPeakFreq: 12 }, weekend: { freq: 15 } },
    M: { weekday: { peakFreq: 8, offPeakFreq: 12 }, weekend: { freq: 15 } }
  },
  'Taraval & 19th': {
    L: { weekday: { peakFreq: 9, offPeakFreq: 12 }, weekend: { freq: 15 } }
  }
};

// Muni Metro stations — shared subway trunk + branch-specific surface stops
// travelTime = minutes from West Portal (or Taraval & 19th for L surface stops)
const MUNI_STATIONS = {
  // L Taraval surface stops (west of West Portal)
  'Taraval & 46th':    { lat: 37.7432, lng: -122.5040, lines: ['L'], travelTime: { L: -12 } },
  'Taraval & 40th':    { lat: 37.7432, lng: -122.4960, lines: ['L'], travelTime: { L: -9 } },
  'Taraval & 32nd':    { lat: 37.7432, lng: -122.4880, lines: ['L'], travelTime: { L: -6 } },
  'Taraval & 28th':    { lat: 37.7432, lng: -122.4840, lines: ['L'], travelTime: { L: -4 } },
  'Taraval & 24th':    { lat: 37.7432, lng: -122.4810, lines: ['L'], travelTime: { L: -3 } },
  'Taraval & 19th':    { lat: 37.7432, lng: -122.4755, lines: ['L'], travelTime: { L: 0 } },
  'Taraval & 15th':    { lat: 37.7432, lng: -122.4710, lines: ['L'], travelTime: { L: 2 } },

  // Shared subway trunk
  'West Portal':       { lat: 37.7408, lng: -122.4661, lines: ['K','L','M'], travelTime: { K: 0, L: 4, M: 0 } },
  'Forest Hill':       { lat: 37.7480, lng: -122.4590, lines: ['K','L','M'], travelTime: { K: 3, L: 7, M: 3 } },
  'Castro':            { lat: 37.7625, lng: -122.4351, lines: ['K','L','M'], travelTime: { K: 7, L: 11, M: 7 } },
  'Church':            { lat: 37.7672, lng: -122.4290, lines: ['K','L','M'], travelTime: { K: 9, L: 13, M: 9 } },
  'Van Ness':          { lat: 37.7752, lng: -122.4193, lines: ['K','L','M'], travelTime: { K: 11, L: 15, M: 11 } },
  'Civic Center':      { lat: 37.7797, lng: -122.4140, lines: ['K','L','M'], travelTime: { K: 13, L: 17, M: 13 } },
  'Powell':            { lat: 37.7842, lng: -122.4080, lines: ['K','L','M'], travelTime: { K: 15, L: 19, M: 15 } },
  'Montgomery':        { lat: 37.7894, lng: -122.4017, lines: ['K','L','M'], travelTime: { K: 17, L: 21, M: 17 } },
  'Embarcadero':       { lat: 37.7930, lng: -122.3970, lines: ['K','L','M'], travelTime: { K: 19, L: 23, M: 19 } },

  // K Ingleside branch (south of West Portal)
  'St Francis Circle': { lat: 37.7348, lng: -122.4690, lines: ['K'], travelTime: { K: -3 } },
  'Balboa Park':       { lat: 37.7218, lng: -122.4474, lines: ['K'], travelTime: { K: -7 } },

  // M Ocean View branch (south of West Portal)
  'SF State':          { lat: 37.7220, lng: -122.4830, lines: ['M'], travelTime: { M: -8 } },
  'Stonestown':        { lat: 37.7282, lng: -122.4760, lines: ['M'], travelTime: { M: -5 } }
};


// E-bike: walk to nearest dock, then ride to a Muni station
const WALK_TO_DOCK_MIN = 7;       // home → nearest dock (Outer Sunset)
const EBIKE_STATIONS = [
  { name: 'Taraval & 19th', ...MUNI_STATIONS['Taraval & 19th'], rideMin: 2, walkMin: WALK_TO_DOCK_MIN },
  { name: 'West Portal',    ...MUNI_STATIONS['West Portal'],    rideMin: 5, walkMin: WALK_TO_DOCK_MIN }
];

// Walk: only Taraval & 19th is walkable (~12 min from home)
const WALK_STATION = {
  name: 'Taraval & 19th',
  ...MUNI_STATIONS['Taraval & 19th'],
  walkMin: 12
};

// Haversine without depending on the function defined below (hoisted for EBIKE_STATIONS init)
function haversineDistanceRaw(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}


// ── Utility Functions ───────────────────────────────────────────────────────

function now() { return new Date(); }

function minutesSinceMidnight(date) {
  return date.getHours() * 60 + date.getMinutes();
}

function isWeekend(date) {
  const day = date.getDay();
  return day === 0 || day === 6;
}

function isPeakHour(minutesFromMidnight, peakWindows) {
  return peakWindows.some(([start, end]) =>
    minutesFromMidnight >= start && minutesFromMidnight < end
  );
}

function haversineDistance(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function formatTime(date) {
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

function formatMinutes(min) {
  if (min < 1) return 'now';
  if (min < 60) return `${Math.round(min)} min`;
  const h = Math.floor(min / 60);
  const m = Math.round(min % 60);
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

function formatAddress(display) {
  // Clean up Nominatim address ranges like "336;338;340"
  return display.replace(/(\d+);[\d;]+/g, (_, first) => first);
}


// ── Real-Time Data Layer (NextBus/Umo API — no key needed) ──────────────────

let liveData = { bus: {}, train: {}, alerts: {}, lastFetch: 0, active: false, error: false };

const NEXTBUS_BASE = 'https://retro.umoiq.com/service/publicXMLFeed';

async function fetchNextBusPredictions() {
  // Batch all stops in one request using predictionsForMultiStops
  const stops = Object.values(NEXTBUS_STOPS)
    .map(s => `stops=${s.route}|${s.stopTag}`)
    .join('&');
  const url = `${NEXTBUS_BASE}?command=predictionsForMultiStops&a=${NEXTBUS_AGENCY}&${stops}`;

  const resp = await fetch(url);
  if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
  const text = await resp.text();

  // Parse XML response
  const parser = new DOMParser();
  const xml = parser.parseFromString(text, 'text/xml');
  return xml;
}

function parseNextBusXml(xml) {
  const results = { bus: {}, train: {} };
  const now = new Date();
  const predictions = xml.querySelectorAll('predictions');

  for (const pred of predictions) {
    const routeTag = pred.getAttribute('routeTag');
    const directions = pred.querySelectorAll('direction');

    const arrivals = [];
    for (const dir of directions) {
      for (const p of dir.querySelectorAll('prediction')) {
        const epochMs = parseInt(p.getAttribute('epochTime'));
        const departureTime = new Date(epochMs);
        const etaMinutes = Math.max(0, parseInt(p.getAttribute('minutes')));
        arrivals.push({ departureTime, etaMinutes, isRealTime: true });
      }
    }
    arrivals.sort((a, b) => a.etaMinutes - b.etaMinutes);

    // Map route tags to our data structure
    if (routeTag === '28') {
      results.bus['28'] = arrivals;
    } else if (routeTag === '48') {
      results.bus['48'] = arrivals;
    } else if (routeTag === 'KT') {
      if (!results.train['West Portal']) results.train['West Portal'] = {};
      results.train['West Portal'].K = arrivals;
    } else if (routeTag === 'L') {
      // L serves both West Portal and Taraval & 19th — split by stop tag
      // The XML has a stopTag attribute on each prediction element
      const wpArrivals = [];
      const tavArrivals = [];
      for (const dir of directions) {
        for (const p of dir.querySelectorAll('prediction')) {
          const stopTag = p.getAttribute('stopTag') || pred.getAttribute('stopTag');
          const epochMs = parseInt(p.getAttribute('epochTime'));
          const departureTime = new Date(epochMs);
          const etaMinutes = Math.max(0, parseInt(p.getAttribute('minutes')));
          const entry = { departureTime, etaMinutes, isRealTime: true };

          if (stopTag === NEXTBUS_STOPS.trainL_wp.stopTag) {
            wpArrivals.push(entry);
          } else if (stopTag === NEXTBUS_STOPS.trainL_tav.stopTag) {
            tavArrivals.push(entry);
          } else {
            // If we can't distinguish, add to both
            wpArrivals.push(entry);
            tavArrivals.push(entry);
          }
        }
      }
      if (!results.train['West Portal']) results.train['West Portal'] = {};
      results.train['West Portal'].L = wpArrivals.sort((a, b) => a.etaMinutes - b.etaMinutes);
      if (!results.train['Taraval & 19th']) results.train['Taraval & 19th'] = {};
      results.train['Taraval & 19th'].L = tavArrivals.sort((a, b) => a.etaMinutes - b.etaMinutes);
    } else if (routeTag === 'M') {
      if (!results.train['West Portal']) results.train['West Portal'] = {};
      results.train['West Portal'].M = arrivals;
    }
  }

  return results;
}

async function fetchNextBusMessages() {
  const routes = ['28', '48', 'KT', 'L', 'M'];
  const alerts = {};

  await Promise.all(routes.map(async (route) => {
    try {
      const url = `${NEXTBUS_BASE}?command=messages&a=${NEXTBUS_AGENCY}&r=${route}`;
      const resp = await fetch(url);
      if (!resp.ok) return;
      const text = await resp.text();
      const parser = new DOMParser();
      const xml = parser.parseFromString(text, 'text/xml');

      const messages = [];
      for (const msg of xml.querySelectorAll('message')) {
        const priority = msg.getAttribute('priority') || 'Normal';
        const textEl = msg.querySelector('text');
        if (textEl?.textContent) {
          messages.push({ text: textEl.textContent.trim(), priority });
        }
      }
      if (messages.length > 0) {
        // Map NextBus route tags to our display names
        const displayRoute = route === 'KT' ? 'K' : route;
        alerts[displayRoute] = messages;
      }
    } catch { /* ignore individual route failures */ }
  }));

  return alerts;
}

// Detect delays by comparing real-time gaps to expected frequency
function detectGapDelays(currentTime) {
  const delays = {};
  const weekend = isWeekend(currentTime);
  const nowMin = minutesSinceMidnight(currentTime);

  // Check bus routes
  for (const [name, route] of Object.entries(BUS_ROUTES)) {
    const live = liveData.bus[name];
    if (!live || live.length < 1) continue;
    const sched = weekend ? route.schedule.weekend : route.schedule.weekday;
    if (!sched) continue;
    const expectedFreq = sched.freq || (isPeakHour(nowMin, sched.peakWindows || []) ? sched.peakFreq : sched.offPeakFreq);

    // If next bus is more than 1.5x the expected frequency away, flag as delayed
    const nextEta = live[0].etaMinutes;
    if (nextEta > expectedFreq * 1.5) {
      delays[name] = { minutesLate: Math.round(nextEta - expectedFreq), type: 'gap' };
    }
  }

  // Check train lines
  for (const [station, lines] of Object.entries(liveData.train)) {
    for (const [line, preds] of Object.entries(lines)) {
      if (!preds || preds.length < 1) continue;
      const schedStation = TRAIN_SCHEDULES[station]?.[line];
      if (!schedStation) continue;
      const sched = weekend ? schedStation.weekend : schedStation.weekday;
      const expectedFreq = sched.freq || (isPeakHour(nowMin, [[420, 540], [960, 1140]]) ? sched.peakFreq : sched.offPeakFreq);

      const nextEta = preds[0].etaMinutes;
      if (nextEta > expectedFreq * 1.5) {
        delays[line] = { minutesLate: Math.round(nextEta - expectedFreq), type: 'gap' };
      }
    }
  }

  return delays;
}

async function refreshLiveData() {
  const stale = Date.now() - liveData.lastFetch > 25000;
  if (!stale && liveData.active) return;

  try {
    const [xml, alerts] = await Promise.all([
      fetchNextBusPredictions(),
      fetchNextBusMessages()
    ]);
    const parsed = parseNextBusXml(xml);
    liveData.bus = parsed.bus;
    liveData.train = parsed.train;
    liveData.alerts = alerts;
    liveData.active = true;
    liveData.error = false;
    liveData.lastFetch = Date.now();
  } catch (e) {
    console.warn('NextBus API error:', e.message);
    liveData.error = true;
    liveData.active = false;
  }

  updateLiveBadge();
}

function updateLiveBadge() {
  const badge = document.getElementById('live-badge');
  if (!badge) return;
  if (liveData.active) {
    badge.textContent = 'LIVE';
    badge.className = 'live-badge';
  } else if (liveData.error) {
    badge.textContent = 'OFFLINE';
    badge.className = 'live-badge error';
  } else {
    badge.className = 'live-badge hidden';
  }
}

// Get real-time bus arrivals, falling back to schedule
function getArrivals(route, currentTime, count = 8) {
  const live = liveData.bus[route.name];
  if (live && live.length > 0) {
    return live.slice(0, count).map(p => ({
      departureTime: p.departureTime,
      etaMinutes: p.etaMinutes,
      isRealTime: p.isRealTime
    }));
  }
  return calculateScheduledArrivals(route, currentTime, count).map(a => ({
    ...a, isRealTime: false
  }));
}

// Get real-time train departure, falling back to schedule
function getNextTrain(station, line, afterMinutes, currentTime) {
  const stationData = liveData.train[station];
  const livePredictions = stationData?.[line];

  if (livePredictions && livePredictions.length > 0) {
    const nowMin = minutesSinceMidnight(currentTime);
    for (const p of livePredictions) {
      const trainMin = nowMin + p.etaMinutes;
      if (trainMin >= afterMinutes) {
        return {
          departureMinutes: trainMin,
          waitTime: Math.max(0, trainMin - afterMinutes),
          frequency: null,
          isRealTime: p.isRealTime
        };
      }
    }
  }

  const sched = getNextTrainDeparture(station, line, afterMinutes, currentTime);
  return sched ? { ...sched, isRealTime: false } : null;
}


// ── Schedule Engine (fallback) ──────────────────────────────────────────────

function calculateScheduledArrivals(route, currentTime, count = 8) {
  const weekend = isWeekend(currentTime);
  const sched = weekend ? route.schedule.weekend : route.schedule.weekday;
  if (!sched) return []; // no service (e.g. 28R on weekends)

  const nowMin = minutesSinceMidnight(currentTime);
  const arrivals = [];
  let t = sched.start;

  // Walk through the schedule generating departure times
  while (t <= sched.end && arrivals.length < count * 3) {
    let freq;
    if (sched.freq) {
      freq = sched.freq;
    } else {
      freq = isPeakHour(t, sched.peakWindows) ? sched.peakFreq : sched.offPeakFreq;
    }

    if (t >= nowMin) {
      arrivals.push(t);
    }
    t += freq;
  }

  return arrivals.slice(0, count).map(mins => {
    const arrivalDate = new Date(currentTime);
    arrivalDate.setHours(Math.floor(mins / 60), mins % 60, 0, 0);
    const etaMin = (mins - nowMin);
    return { departureTime: arrivalDate, etaMinutes: Math.max(0, etaMin) };
  });
}


// ── Journey Planner ─────────────────────────────────────────────────────────

function findClosestStation(destLat, destLng, trainLines) {
  let closest = null;
  let minDist = Infinity;

  for (const [name, station] of Object.entries(MUNI_STATIONS)) {
    // Only consider stations on lines available from the transfer station
    const matchingLine = station.lines.find(l => trainLines.includes(l));
    if (!matchingLine) continue;

    const dist = haversineDistance(destLat, destLng, station.lat, station.lng);
    if (dist < minDist) {
      minDist = dist;
      closest = { name, ...station, line: matchingLine, distanceKm: dist };
    }
  }
  return closest;
}

function getNextTrainDeparture(station, line, afterMinutes, currentTime) {
  const weekend = isWeekend(currentTime);
  const schedules = TRAIN_SCHEDULES[station];
  if (!schedules || !schedules[line]) return null;

  const sched = weekend ? schedules[line].weekend : schedules[line].weekday;
  const freq = sched.freq || (isPeakHour(afterMinutes, [[420, 540], [960, 1140]])
    ? sched.peakFreq : sched.offPeakFreq);

  // Next train after arrival: round up to next departure
  const waitTime = freq - (afterMinutes % freq);
  const departMin = afterMinutes + (waitTime === freq ? 0 : waitTime);

  return { departureMinutes: departMin, waitTime: Math.min(waitTime, freq), frequency: freq };
}

function planJourney(route, busArrival, destination, currentTime) {
  const walkToStop = route.walkToStop || 0;
  const busEta = busArrival.etaMinutes;
  const busArrivalMin = minutesSinceMidnight(currentTime) + busEta;

  // Time bus arrives at transfer station
  const transferArrivalMin = busArrivalMin + route.timeToTransfer;

  // Find closest station to destination
  const closestStation = findClosestStation(destination.lat, destination.lng, route.trainLines);
  if (!closestStation) return null;

  // Find next train after arriving at transfer (real-time or schedule)
  const train = getNextTrain(
    route.transferStation, closestStation.line, transferArrivalMin, currentTime
  );
  if (!train) return null;

  // Travel time on train from transfer station to exit station
  const transferStationTravelTime = MUNI_STATIONS[route.transferStation]?.travelTime?.[closestStation.line] || 0;
  const exitStationTravelTime = closestStation.travelTime[closestStation.line];
  const trainRideTime = Math.abs(exitStationTravelTime - transferStationTravelTime);

  // Walking time from exit station to destination (~5 km/h average walking speed)
  const walkTimeMin = Math.round((closestStation.distanceKm / 5) * 60);

  // Total journey time: walk to stop + bus ride + train wait + train ride (excludes walk at destination)
  const totalTime = walkToStop + route.timeToTransfer + train.waitTime + trainRideTime;

  // Arrival at exit station as Date
  const arrivalDate = new Date(currentTime);
  const arrivalMin = minutesSinceMidnight(currentTime) + busEta + totalTime;
  arrivalDate.setHours(Math.floor(arrivalMin / 60), Math.round(arrivalMin % 60), 0, 0);

  return {
    busRoute: route.name,
    walkToStop,
    busEta,
    busDeparture: busArrival.departureTime,
    transferStation: route.transferStation,
    busToTransferTime: route.timeToTransfer,
    trainLine: closestStation.line,
    trainWait: train.waitTime,
    trainDepartureMin: train.departureMinutes,
    trainRideTime,
    exitStation: closestStation.name,
    walkTime: walkTimeMin,
    totalTime,
    arrivalTime: arrivalDate,
    // Coords for map
    busPickup: route.stopCoords,
    transferCoords: route.transferCoords,
    exitCoords: { lat: closestStation.lat, lng: closestStation.lng },
    destCoords: { lat: destination.lat, lng: destination.lng }
  };
}


// ── Geolocation & Reverse Geocoding ─────────────────────────────────────────

async function getCurrentPosition() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) return reject(new Error('Geolocation not supported'));
    navigator.geolocation.getCurrentPosition(
      pos => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      err => reject(err),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  });
}

async function reverseGeocode(lat, lng) {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1`;
    const resp = await fetch(url, {
      headers: { 'Accept-Language': 'en', 'User-Agent': 'SFTransitBoard/1.0' }
    });
    const r = await resp.json();
    let short;
    if (r.address?.road) {
      short = `${r.address.house_number || ''} ${r.address.road}`.trim();
    } else if (r.name) {
      short = r.name;
    } else {
      short = formatAddress(r.display_name).split(',')[0];
    }
    const context = [r.address?.neighbourhood, r.address?.suburb, r.address?.city_district]
      .filter(Boolean)[0] || '';
    return { short, context, lat, lng, display: formatAddress(r.display_name) };
  } catch {
    return { short: `${lat.toFixed(4)}, ${lng.toFixed(4)}`, context: '', lat, lng, display: '' };
  }
}


// ── Inbound Trip Planning ───────────────────────────────────────────────────

// Bay Wheels GBFS — real-time e-bike availability (no API key needed)
const GBFS_STATION_INFO_URL = 'https://gbfs.lyft.com/gbfs/2.3/bay/en/station_information.json';
const GBFS_STATION_STATUS_URL = 'https://gbfs.lyft.com/gbfs/2.3/bay/en/station_status.json';
const WEST_PORTAL_DOCK_ID = '2114365359206953814'; // "West Portal MUNI" dock
const EBIKE_RIDE_HOME_MIN = 5; // West Portal → home by e-bike

// Home-area Bay Wheels docks (24th Ave at Quintara & 21st Ave at Noriega)
// These are new docks not yet in the GBFS feed — matched by proximity at runtime
const HOME_DOCKS = [
  { name: '24th Ave at Quintara St', lat: 37.7493, lng: -122.4830 },
  { name: '21st Ave at Noriega St',  lat: 37.7535, lng: -122.4800 }
];
const HOME_DOCK_SEARCH_RADIUS_KM = 0.4; // match GBFS stations within 400m of known dock

// Unified e-bike availability state
let ebikeAvailability = { westPortal: null, home: null, homeDocks: [], lastChecked: 0 };
let bayWheelsStationCache = null;
let bayWheelsStatusMap = {};

function getEbikeCountFromStatus(status) {
  if (!status) return 0;
  const ebikeType = status.vehicle_types_available?.find(v => v.vehicle_type_id === '2');
  return ebikeType ? ebikeType.count : (status.num_ebikes_available || 0);
}

async function refreshEbikeAvailability() {
  if (Date.now() - ebikeAvailability.lastChecked < 60000) return;
  try {
    // Fetch station locations (once) and current statuses
    const fetches = [fetch(GBFS_STATION_STATUS_URL)];
    if (!bayWheelsStationCache) fetches.push(fetch(GBFS_STATION_INFO_URL));
    const responses = await Promise.all(fetches);

    const statusData = await responses[0].json();
    if (responses[1]) {
      const infoData = await responses[1].json();
      bayWheelsStationCache = infoData.data.stations;
    }

    // Build status lookup (cached globally for per-dock lookups)
    bayWheelsStatusMap = {};
    for (const s of statusData.data.stations) bayWheelsStatusMap[String(s.station_id)] = s;

    // West Portal availability
    ebikeAvailability.westPortal = getEbikeCountFromStatus(bayWheelsStatusMap[WEST_PORTAL_DOCK_ID]);

    // Home-area availability: match GBFS stations to known home docks by proximity
    let homeTotal = 0;
    const dockDetails = [];
    if (bayWheelsStationCache) {
      for (const dock of HOME_DOCKS) {
        // Find closest GBFS station to this dock location
        let best = null;
        for (const s of bayWheelsStationCache) {
          const dist = haversineDistanceRaw(dock.lat, dock.lng, s.lat, s.lon);
          if (dist <= HOME_DOCK_SEARCH_RADIUS_KM && (!best || dist < best.dist)) {
            best = { id: String(s.station_id), name: s.name, dist };
          }
        }
        const count = best ? getEbikeCountFromStatus(bayWheelsStatusMap[best.id]) : 0;
        homeTotal += count;
        dockDetails.push({ name: dock.name, ebikes: count, matched: !!best });
      }
    }
    ebikeAvailability.home = homeTotal;
    ebikeAvailability.homeDocks = dockDetails;

    ebikeAvailability.lastChecked = Date.now();
  } catch { /* fail silently */ }
}

// Home-area exit stations for inbound trips
const INBOUND_EXIT_STATIONS = {
  'Taraval & 19th': { walkHome: 12, ebikeHome: null },
  'West Portal':    { walkHome: 18, ebikeHome: EBIKE_RIDE_HOME_MIN }
};

// Find the closest Muni station to an origin point (for boarding)
function findClosestBoardingStation(originLat, originLng) {
  let results = [];
  for (const [name, station] of Object.entries(MUNI_STATIONS)) {
    // Skip home-area surface stops west of West Portal — those are exit stations, not boarding
    if (INBOUND_EXIT_STATIONS[name]) continue;
    const dist = haversineDistance(originLat, originLng, station.lat, station.lng);
    const walkMin = Math.round((dist / 5) * 60); // 5 km/h walking
    const bikeMin = Math.round((dist / 15) * 60); // 15 km/h biking
    for (const line of station.lines) {
      results.push({ name, ...station, line, distKm: dist, walkMin, bikeMin });
    }
  }
  results.sort((a, b) => a.distKm - b.distKm);
  return results;
}

// Find nearest Bay Wheels dock to a point, return walk time in minutes
function findNearestDock(lat, lng) {
  if (!bayWheelsStationCache || bayWheelsStationCache.length === 0) return null;
  let best = null;
  for (const s of bayWheelsStationCache) {
    const dist = haversineDistanceRaw(lat, lng, s.lat, s.lon);
    if (!best || dist < best.dist) best = { lat: s.lat, lng: s.lon, dist, name: s.name, stationId: String(s.station_id) };
  }
  if (!best) return null;
  const ebikes = getEbikeCountFromStatus(bayWheelsStatusMap[best.stationId]);
  return { lat: best.lat, lng: best.lng, name: best.name, stationId: best.stationId, ebikes, walkMin: Math.max(1, Math.round((best.dist / 5) * 60)) };
}

function buildInboundEntries(origin, currentTime, firstMileMode) {
  if (!origin) return [];
  const entries = [];
  const nowMin = minutesSinceMidnight(currentTime);

  // For e-bike: find nearest dock to origin, compute walk-to-dock + bike-to-station
  // Only use if the dock actually has e-bikes available
  let nearestDock = null;
  if (firstMileMode === 'ebike') {
    const dock = findNearestDock(origin.lat, origin.lng);
    if (dock && dock.ebikes > 0) nearestDock = dock;
  }

  const boardingOptions = findClosestBoardingStation(origin.lat, origin.lng);
  // Consider the 6 closest station+line combos
  const nearbyStations = boardingOptions.slice(0, 6);

  for (const boarding of nearbyStations) {
    let firstMileTime, walkToDock = 0, bikeRide = 0;
    if (firstMileMode === 'ebike' && nearestDock) {
      walkToDock = nearestDock.walkMin;
      // Bike from dock to boarding station
      const dockToStation = haversineDistanceRaw(nearestDock.lat, nearestDock.lng, boarding.lat, boarding.lng);
      bikeRide = Math.max(1, Math.round((dockToStation / 15) * 60));
      firstMileTime = walkToDock + bikeRide;
    } else {
      firstMileTime = boarding.walkMin;
    }

    const arriveAtStationMin = nowMin + firstMileTime;
    const boardingTT = boarding.travelTime[boarding.line];

    // Use reference station schedule (same pattern as outbound code)
    const scheduledStation = Object.keys(TRAIN_SCHEDULES).find(s =>
      TRAIN_SCHEDULES[s][boarding.line]
    );
    if (!scheduledStation) continue;

    const scheduledStationTT = MUNI_STATIONS[scheduledStation]?.travelTime?.[boarding.line] || 0;
    // Offset: how many minutes the boarding station is from the reference station
    const offset = boardingTT - scheduledStationTT;

    // When do we need a train at the *reference* station so it arrives at boarding on time?
    const refArrivalMin = arriveAtStationMin - offset;
    const train = getNextTrainDeparture(scheduledStation, boarding.line, refArrivalMin, currentTime);
    if (!train) continue;

    // When does this train actually reach our boarding station?
    const trainAtBoardingMin = train.departureMinutes + offset;
    if (trainAtBoardingMin < arriveAtStationMin) continue;
    const waitTime = trainAtBoardingMin - arriveAtStationMin;

    // Find the best exit station for this line
    for (const [exitName, exitInfo] of Object.entries(INBOUND_EXIT_STATIONS)) {
      const exitStation = MUNI_STATIONS[exitName];
      if (!exitStation || !exitStation.lines.includes(boarding.line)) continue;

      const exitTT = exitStation.travelTime[boarding.line];
      const trainRideTime = boardingTT - exitTT;

      // Skip if exit is east of boarding (wrong direction — we're going home/west)
      if (trainRideTime <= 0) continue;

      // Generate last-mile variants: walk home, and e-bike home if available at this station
      const lastMileOptions = [{ mode: 'walk', time: exitInfo.walkHome }];
      if (exitInfo.ebikeHome && ebikeAvailability.westPortal > 0) {
        lastMileOptions.push({ mode: 'ebike', time: exitInfo.ebikeHome });
      }

      for (const lastMile of lastMileOptions) {
        const totalTime = firstMileTime + waitTime + trainRideTime + lastMile.time;

        const arrivalDate = new Date(currentTime);
        const arrivalMin = nowMin + totalTime;
        arrivalDate.setHours(Math.floor(arrivalMin / 60), Math.round(arrivalMin % 60), 0, 0);

        entries.push({
          boardingStation: boarding.name,
          boardingCoords: { lat: boarding.lat, lng: boarding.lng },
          firstMileMode,
          firstMileTime,
          walkToDock: walkToDock,
          bikeRide: bikeRide,
          dockName: nearestDock ? nearestDock.name : null,
          dockEbikes: nearestDock ? nearestDock.ebikes : null,
          trainLine: boarding.line,
          trainWait: Math.round(waitTime),
          trainRideTime,
          trainDepartAbsolute: trainAtBoardingMin,
          exitStation: exitName,
          lastMileMode: lastMile.mode,
          lastMileTime: lastMile.time,
          walkHome: lastMile.time,
          totalTime,
          arrivalTime: arrivalDate,
          arrivalMin
        });
      }
    }
  }

  // Sort by total time, deduplicate by station+line+lastMile
  entries.sort((a, b) => a.totalTime - b.totalTime);
  const seen = new Set();
  return entries.filter(e => {
    const key = `${e.boardingStation}|${e.trainLine}|${e.lastMileMode || 'walk'}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  }).slice(0, 10);
}

function getBestInboundJourney(origin, currentTime) {
  if (!origin) return null;
  let best = null;
  for (const mode of ['walk', 'ebike']) {
    const entries = buildInboundEntries(origin, currentTime, mode);
    if (entries.length > 0 && (!best || entries[0].arrivalMin < best.arrivalMin)) {
      best = entries[0];
    }
  }
  return best;
}


// ── Search (Nominatim) ─────────────────────────────────────────────────────

let searchTimeout = null;

async function searchDestination(query) {
  if (query.length < 3) return [];
  const url = `https://nominatim.openstreetmap.org/search?` +
    `q=${encodeURIComponent(query + ', San Francisco, CA')}` +
    `&format=json&addressdetails=1&limit=6&bounded=1` +
    `&viewbox=-122.52,37.81,-122.35,37.70`;

  try {
    const resp = await fetch(url, {
      headers: { 'Accept-Language': 'en', 'User-Agent': 'SFTransitBoard/1.0' }
    });
    const results = await resp.json();
    return results.map(r => {
      const display = formatAddress(r.display_name);
      // Prefer the POI/station name over the street name
      let short;
      if (r.name && r.name !== r.address?.road) {
        // Use the actual name for stations, landmarks, businesses
        short = r.name;
      } else if (r.address?.road) {
        short = `${r.address.house_number || ''} ${r.address.road}`.trim();
      } else {
        short = display.split(',')[0];
      }
      // Add neighborhood/city context
      const context = [r.address?.neighbourhood, r.address?.suburb, r.address?.city_district]
        .filter(Boolean)[0] || '';
      return {
        display,
        short,
        context,
        lat: parseFloat(r.lat),
        lng: parseFloat(r.lon)
      };
    });
  } catch {
    return [];
  }
}


// ── UI Rendering ────────────────────────────────────────────────────────────

let selectedDestination = null;
let journeys = [];
let mapInstance = null;
let activeTab = 'bus';
let activeDirection = 'outbound';

function updateClock() {
  const el = document.getElementById('clock');
  el.textContent = now().toLocaleTimeString('en-US', {
    hour: 'numeric', minute: '2-digit', second: '2-digit'
  });
}

function buildDefaultEntries(currentTime) {
  const entries = [];
  const nowMin = minutesSinceMidnight(currentTime);

  for (const [key, route] of Object.entries(BUS_ROUTES)) {
    const walkToStop = route.walkToStop || 0;
    const arrivals = getArrivals(route, currentTime, 6);
    for (const arrival of arrivals) {
      const busArrivalMin = nowMin + arrival.etaMinutes;
      const transferArrivalMin = busArrivalMin + route.timeToTransfer;

      let bestTrain = null;
      for (const line of route.trainLines) {
        const train = getNextTrain(
          route.transferStation, line, transferArrivalMin, currentTime
        );
        if (!train) continue;
        if (!bestTrain || train.departureMinutes < bestTrain.departureMinutes) {
          bestTrain = { ...train, line };
        }
      }
      if (!bestTrain) continue;

      // Time remaining before you must leave the house (busEta minus walkToStop)
      const leaveIn = Math.max(0, arrival.etaMinutes - walkToStop);

      entries.push({
        busRoute: route.name,
        walkToStop,
        busEta: arrival.etaMinutes,
        leaveIn,
        busDeparture: arrival.departureTime,
        transferStation: route.transferStation,
        busToTransferTime: route.timeToTransfer,
        trainLine: bestTrain.line,
        trainWait: bestTrain.waitTime,
        trainDepartureMin: bestTrain.departureMinutes,
        availableLines: route.trainLines,
        trainDepartAbsolute: bestTrain.departureMinutes,
        isRealTime: arrival.isRealTime || bestTrain.isRealTime
      });
    }
  }

  entries.sort((a, b) => a.trainDepartAbsolute - b.trainDepartAbsolute);
  return entries.slice(0, 12);
}

function buildEbikeEntries(currentTime) {
  const entries = [];
  const nowMin = minutesSinceMidnight(currentTime);

  for (const station of EBIKE_STATIONS) {
    const walkMin = station.walkMin || 0;
    const arrivalAtStationMin = nowMin + walkMin + station.rideMin;

    for (const line of station.lines) {
      // Try real-time train data first, then fall back to schedule
      const train = getNextTrain(station.name, line, arrivalAtStationMin, currentTime);
      if (!train) continue;

      // For real-time data, train.departureMinutes is already absolute
      // For schedule fallback via getNextTrain → getNextTrainDeparture, it's also absolute
      // but may need offset if station differs from scheduled station
      let trainAtThisStation = train.departureMinutes;

      if (!train.isRealTime) {
        // Schedule fallback: adjust for station position on the line
        const scheduledStation = Object.keys(TRAIN_SCHEDULES).find(s =>
          TRAIN_SCHEDULES[s][line]
        );
        if (scheduledStation && scheduledStation !== station.name) {
          const scheduledTT = MUNI_STATIONS[scheduledStation]?.travelTime?.[line] || 0;
          const stationTT = station.travelTime[line];
          trainAtThisStation = train.departureMinutes + (stationTT - scheduledTT);
        }
      }

      if (trainAtThisStation < arrivalAtStationMin) continue;
      const waitAtStation = trainAtThisStation - arrivalAtStationMin;

      entries.push({
        stationName: station.name,
        stationCoords: { lat: station.lat, lng: station.lng },
        walkMin,
        rideMin: station.rideMin,
        trainLine: line,
        trainWait: Math.round(waitAtStation),
        trainDepartAbsolute: trainAtThisStation,
        availableLines: station.lines,
        isRealTime: train.isRealTime
      });
    }
  }

  // Sort by earliest train departure, deduplicate by station+line keeping only the soonest
  entries.sort((a, b) => a.trainDepartAbsolute - b.trainDepartAbsolute);

  const seen = new Set();
  const deduped = [];
  for (const e of entries) {
    const key = `${e.stationName}|${e.trainLine}`;
    if (seen.has(key)) continue;
    seen.add(key);
    deduped.push(e);
  }

  return deduped.slice(0, 12);
}

function buildWalkEntries(currentTime) {
  const entries = [];
  const nowMin = minutesSinceMidnight(currentTime);
  const station = WALK_STATION;
  const arrivalAtStationMin = nowMin + station.walkMin;

  for (const line of station.lines) {
    const train = getNextTrain(station.name, line, arrivalAtStationMin, currentTime);
    if (!train) continue;

    let trainAtThisStation = train.departureMinutes;

    if (!train.isRealTime) {
      const scheduledStation = Object.keys(TRAIN_SCHEDULES).find(s =>
        TRAIN_SCHEDULES[s][line]
      );
      if (scheduledStation && scheduledStation !== station.name) {
        const scheduledTT = MUNI_STATIONS[scheduledStation]?.travelTime?.[line] || 0;
        const stationTT = station.travelTime[line];
        trainAtThisStation = train.departureMinutes + (stationTT - scheduledTT);
      }
    }

    if (trainAtThisStation < arrivalAtStationMin) continue;
    const waitAtStation = trainAtThisStation - arrivalAtStationMin;

    entries.push({
      stationName: station.name,
      stationCoords: { lat: station.lat, lng: station.lng },
      walkMin: station.walkMin,
      trainLine: line,
      trainWait: Math.round(waitAtStation),
      trainDepartAbsolute: trainAtThisStation,
      isRealTime: train.isRealTime
    });
  }

  entries.sort((a, b) => a.trainDepartAbsolute - b.trainDepartAbsolute);
  return entries.slice(0, 12);
}

function getBestWalkJourney(currentTime, destination) {
  const nowMin = minutesSinceMidnight(currentTime);
  const station = WALK_STATION;
  const arrivalAtStationMin = nowMin + station.walkMin;
  let best = null;

  for (const line of station.lines) {
    const scheduledStation = Object.keys(TRAIN_SCHEDULES).find(s => TRAIN_SCHEDULES[s][line]);
    if (!scheduledStation) continue;
    const train = getNextTrainDeparture(scheduledStation, line, arrivalAtStationMin, currentTime);
    if (!train) continue;

    const scheduledStationTT = MUNI_STATIONS[scheduledStation]?.travelTime?.[line] || 0;
    const stationTT = MUNI_STATIONS[station.name]?.travelTime?.[line] || 0;
    const offset = stationTT - scheduledStationTT;
    const trainAtStation = train.departureMinutes + offset;
    if (trainAtStation < arrivalAtStationMin) continue;
    const waitAtStation = trainAtStation - arrivalAtStationMin;

    if (destination) {
      const exitStation = findClosestStation(destination.lat, destination.lng, [line]);
      if (!exitStation) continue;
      const trainRideTime = Math.abs(exitStation.travelTime[line] - stationTT);
      const totalTime = station.walkMin + waitAtStation + trainRideTime;
      const arrivalMin = nowMin + totalTime;
      const arrivalDate = new Date(currentTime);
      arrivalDate.setHours(Math.floor(arrivalMin / 60), Math.round(arrivalMin % 60), 0, 0);
      if (!best || arrivalMin < best.arrivalMin) {
        best = { stationName: station.name, walkMin: station.walkMin, trainLine: line, exitStation: exitStation.name, trainRideTime, totalTime, arrivalMin, arrivalTime: arrivalDate, trainWait: Math.round(waitAtStation) };
      }
    } else {
      if (!best || trainAtStation < best.trainDepartMin) {
        const departTime = new Date(currentTime);
        departTime.setHours(Math.floor(trainAtStation / 60), Math.round(trainAtStation % 60), 0, 0);
        best = { stationName: station.name, walkMin: station.walkMin, trainLine: line, trainDepartMin: trainAtStation, departTime, trainWait: Math.round(waitAtStation) };
      }
    }
  }
  return best;
}

function getBestBikeJourney(currentTime, destination) {
  const nowMin = minutesSinceMidnight(currentTime);
  let best = null;

  for (const station of EBIKE_STATIONS) {
    const walkMin = station.walkMin || 0;
    const arrivalAtStationMin = nowMin + walkMin + station.rideMin;
    for (const line of station.lines) {
      const scheduledStation = Object.keys(TRAIN_SCHEDULES).find(s => TRAIN_SCHEDULES[s][line]);
      if (!scheduledStation) continue;
      const train = getNextTrainDeparture(scheduledStation, line, arrivalAtStationMin, currentTime);
      if (!train) continue;

      const scheduledStationTT = MUNI_STATIONS[scheduledStation]?.travelTime?.[line] || 0;
      const stationTT = MUNI_STATIONS[station.name]?.travelTime?.[line] || 0;
      const offset = stationTT - scheduledStationTT;
      const trainAtStation = train.departureMinutes + offset;
      if (trainAtStation < arrivalAtStationMin) continue;
      const waitAtStation = trainAtStation - arrivalAtStationMin;

      if (destination) {
        const exitStation = findClosestStation(destination.lat, destination.lng, [line]);
        if (!exitStation) continue;
        const trainRideTime = Math.abs(exitStation.travelTime[line] - stationTT);
        const totalTime = walkMin + station.rideMin + waitAtStation + trainRideTime;
        const arrivalMin = nowMin + totalTime;
        const arrivalDate = new Date(currentTime);
        arrivalDate.setHours(Math.floor(arrivalMin / 60), Math.round(arrivalMin % 60), 0, 0);
        if (!best || arrivalMin < best.arrivalMin) {
          best = { stationName: station.name, walkMin, rideMin: station.rideMin, trainLine: line, exitStation: exitStation.name, totalTime, arrivalMin, arrivalTime: arrivalDate, trainWait: Math.round(waitAtStation) };
        }
      } else {
        // No destination — optimize for earliest train departure
        if (!best || trainAtStation < best.trainDepartMin) {
          const departTime = new Date(currentTime);
          departTime.setHours(Math.floor(trainAtStation / 60), Math.round(trainAtStation % 60), 0, 0);
          best = { stationName: station.name, walkMin, rideMin: station.rideMin, trainLine: line, trainDepartMin: trainAtStation, departTime, trainWait: Math.round(waitAtStation) };
        }
      }
    }
  }
  return best;
}

function getBestBusJourney(currentTime, destination) {
  const nowMin = minutesSinceMidnight(currentTime);

  if (destination) {
    let best = null;
    for (const [key, route] of Object.entries(BUS_ROUTES)) {
      const arrivals = calculateScheduledArrivals(route, currentTime, 4);
      for (const arrival of arrivals) {
        const j = planJourney(route, arrival, destination, currentTime);
        if (!j) continue;
        const arrivalMin = nowMin + arrival.etaMinutes + j.totalTime;
        if (!best || arrivalMin < best.arrivalMin) {
          best = { ...j, arrivalMin };
        }
      }
    }
    return best;
  } else {
    const entries = buildDefaultEntries(currentTime);
    if (entries.length === 0) return null;
    const e = entries[0];
    const departTime = new Date(currentTime);
    departTime.setHours(Math.floor(e.trainDepartureMin / 60), Math.round(e.trainDepartureMin % 60), 0, 0);
    return { ...e, trainDepartMin: e.trainDepartureMin, departTime };
  }
}

function renderRecommendation(currentTime) {
  const recEl = document.getElementById('recommendation');

  const bestBus = getBestBusJourney(currentTime, selectedDestination);
  const bestBike = getBestBikeJourney(currentTime, selectedDestination);
  const bestWalk = getBestWalkJourney(currentTime, selectedDestination);

  if (!bestBus && !bestBike && !bestWalk) { recEl.classList.add('hidden'); return; }

  // Build candidate descriptions keyed by arrival or departure time
  const candidates = [];

  if (selectedDestination) {
    if (bestBus) {
      const busLeaveIn = Math.max(0, bestBus.busEta - (bestBus.walkToStop || 0));
      const busLeaveNote = busLeaveIn <= 0 ? 'Leave now' : `Leave in ${busLeaveIn}m`;
      const trainName = TRAIN_LINE_COLORS[bestBus.trainLine].name;
      candidates.push({ min: bestBus.arrivalMin, mode: 'bus', journey: bestBus,
        summary: `${busLeaveNote} — take the ${bestBus.busRoute} to ${bestBus.transferStation}, catch the ${trainName} to ${bestBus.exitStation}. Arrive by ${formatTime(bestBus.arrivalTime)}.`
      });
    }
    if (bestBike) {
      const trainName = TRAIN_LINE_COLORS[bestBike.trainLine].name;
      candidates.push({ min: bestBike.arrivalMin, mode: 'ebike', journey: bestBike,
        summary: `Pick up e-bike near home, bike to ${bestBike.stationName}, catch the ${trainName} to ${bestBike.exitStation}. Arrive by ${formatTime(bestBike.arrivalTime)}.`
      });
    }
    if (bestWalk) {
      const trainName = TRAIN_LINE_COLORS[bestWalk.trainLine].name;
      candidates.push({ min: bestWalk.arrivalMin, mode: 'walk', journey: bestWalk,
        summary: `Walk to ${bestWalk.stationName}, catch the ${trainName} to ${bestWalk.exitStation}. Arrive by ${formatTime(bestWalk.arrivalTime)}.`
      });
    }
  } else {
    if (bestBus) {
      const busLeaveIn = Math.max(0, bestBus.busEta - (bestBus.walkToStop || 0));
      const busLeaveNote = busLeaveIn <= 0 ? 'Leave now' : `Leave in ${busLeaveIn}m`;
      const trainName = TRAIN_LINE_COLORS[bestBus.trainLine].name;
      candidates.push({ min: bestBus.trainDepartMin, mode: 'bus', journey: bestBus,
        summary: `${busLeaveNote} — take the ${bestBus.busRoute} to ${bestBus.transferStation}, catch the ${trainName} at ${formatTime(bestBus.departTime)}.`
      });
    }
    if (bestBike) {
      const trainName = TRAIN_LINE_COLORS[bestBike.trainLine].name;
      candidates.push({ min: bestBike.trainDepartMin, mode: 'ebike', journey: bestBike,
        summary: `Pick up e-bike near home, bike to ${bestBike.stationName}, catch the ${trainName} at ${formatTime(bestBike.departTime)}.`
      });
    }
    if (bestWalk) {
      const trainName = TRAIN_LINE_COLORS[bestWalk.trainLine].name;
      candidates.push({ min: bestWalk.trainDepartMin, mode: 'walk', journey: bestWalk,
        summary: `Walk to ${bestWalk.stationName}, catch the ${trainName} at ${formatTime(bestWalk.departTime)}.`
      });
    }
  }

  if (candidates.length === 0) { recEl.classList.add('hidden'); return; }

  candidates.sort((a, b) => a.min - b.min);
  const winner = candidates[0];
  const runnerUp = candidates[1];

  const modeLabels = { bus: 'the bus', ebike: 'biking', walk: 'walking' };
  let detail = '';
  if (runnerUp) {
    const diff = Math.round(runnerUp.min - winner.min);
    if (diff > 0) {
      const comparison = selectedDestination ? `arrive ${diff}min sooner than if you took` : `be on a train ${diff}min sooner than if you took`;
      detail = `You'll ${comparison} ${modeLabels[runnerUp.mode]}.`;
    }
  }

  const availLine = winner.availHtml ? `<div class="rec-avail">${winner.availHtml}</div>` : '';
  recEl.innerHTML = `<div class="rec-label">Recommended</div><div class="rec-summary">${winner.summary}</div>${availLine}${detail ? `<div class="rec-detail">${detail}</div>` : ''}`;
  recEl.style.cursor = 'pointer';
  recEl.classList.remove('hidden');
  recEl.onclick = () => {
    const j = winner.journey;
    if (winner.mode === 'bus') {
      selectedDestination ? openBusDestModal(j) : openDefaultBusModal(j);
    } else if (winner.mode === 'ebike') {
      const stationData = MUNI_STATIONS[j.stationName];
      openEbikeModal({ ...j, stationCoords: stationData ? { lat: stationData.lat, lng: stationData.lng } : null });
    } else {
      openWalkModal(j);
    }
  };
}

function renderAlertsBanner(delays, alerts) {
  // Build a compact alerts banner for delayed lines
  const items = [];

  // Gap-based delays
  for (const [route, info] of Object.entries(delays)) {
    items.push(`<span class="alert-route">${route}</span> ~${info.minutesLate}m behind schedule`);
  }

  // Service alerts from NextBus messages (only high-priority)
  for (const [route, messages] of Object.entries(alerts)) {
    for (const msg of messages) {
      if (msg.priority === 'High' || msg.priority === 'Critical') {
        items.push(`<span class="alert-route">${route}</span> ${msg.text}`);
      }
    }
  }

  if (items.length === 0) return '';
  return `<div class="alerts-banner">${items.map(t => `<div class="alert-item">${t}</div>`).join('')}</div>`;
}

function getDelayBadge(routeOrLine, delays) {
  const d = delays[routeOrLine];
  if (!d) return '';
  const cls = d.minutesLate > 10 ? '' : 'warn';
  return `<span class="delay-badge ${cls}">~${d.minutesLate}m late</span>`;
}

function renderArrivals() {
  const list = document.getElementById('arrivals-list');
  const currentTime = now();

  // Inbound mode
  if (activeDirection === 'inbound') {
    if (!selectedDestination) {
      document.getElementById('recommendation').classList.add('hidden');
      list.innerHTML = '<div class="empty-state">Search for your current location above</div>';
      return;
    }

    const origin = selectedDestination; // in inbound mode, "destination" is actually the origin
    const modeMap = { bus: 'walk', ebike: 'ebike', walk: 'walk' };
    const firstMileMode = modeMap[activeTab] || 'walk';
    const inboundEntries = buildInboundEntries(origin, currentTime, firstMileMode);

    // Inbound recommendation
    renderInboundRecommendation(origin, currentTime);

    if (inboundEntries.length === 0) {
      list.innerHTML = '<div class="empty-state">No inbound options found from here</div>';
      return;
    }

    list.innerHTML = inboundEntries.map((e, i) => {
      const trainInfo = TRAIN_LINE_COLORS[e.trainLine];
      const trainDepartTime = new Date(currentTime);
      trainDepartTime.setHours(Math.floor(e.trainDepartAbsolute / 60), Math.round(e.trainDepartAbsolute % 60), 0, 0);

      const firstMileLabel = e.firstMileMode === 'ebike'
        ? `${e.walkToDock}m walk + ${e.bikeRide}m bike`
        : `${e.firstMileTime}m walk`;
      const firstMileIcon = e.firstMileMode === 'ebike' ? '&#x1f6b2;' : '&#x1F6B6;';

      const lastMileLabel = e.lastMileMode === 'ebike' ? `${e.lastMileTime}m e-bike` : `${e.walkHome}m walk`;
      const lastMileIcon = e.lastMileMode === 'ebike' ? '&#x1f6b2;' : '&#x1F3E0;';

      return `
        <div class="arrival-card" data-index="${i}">
          <div class="card-top">
            <div style="display:flex;align-items:center;gap:10px">
              <span style="font-size:16px">${firstMileIcon}</span>
              <span style="font-size:14px;font-weight:600">${e.boardingStation}</span>
            </div>
            <span style="font-size:13px;color:var(--text-dim)">${firstMileLabel}</span>
          </div>
          <div class="card-mid">
            <span class="train-badge ${trainInfo.cssClass}">${e.trainLine}</span>
            <span class="arrow">&rarr;</span>
            <span>${e.exitStation}</span>
            <span class="arrow">&rarr;</span>
            <span>${lastMileIcon}</span>
            <span style="font-size:12px;color:var(--text-dim)">${lastMileLabel}</span>
          </div>
          <div class="card-bottom">
            <span>Home by ${formatTime(e.arrivalTime)}</span>
            <span class="total-time">${formatMinutes(e.totalTime)}</span>
          </div>
        </div>
      `;
    }).join('');

    list.querySelectorAll('.arrival-card').forEach(card => {
      card.addEventListener('click', () => {
        const idx = parseInt(card.dataset.index);
        openInboundModal(inboundEntries[idx]);
      });
    });
    return;
  }

  renderRecommendation(currentTime);

  // Compute delay info from live data
  const delays = liveData.active ? detectGapDelays(currentTime) : {};
  const alertsBanner = liveData.active ? renderAlertsBanner(delays, liveData.alerts) : '';

  // ── Destination mode: full journey planning ──
  if (selectedDestination) {
    if (activeTab === 'bus') {
      journeys = [];

      for (const [key, route] of Object.entries(BUS_ROUTES)) {
        const arrivals = calculateScheduledArrivals(route, currentTime);
        for (const arrival of arrivals) {
          const journey = planJourney(route, arrival, selectedDestination, currentTime);
          if (journey) journeys.push(journey);
        }
      }

      journeys.sort((a, b) => a.totalTime - b.totalTime);
      journeys = journeys.slice(0, 10);

      if (journeys.length === 0) {
        list.innerHTML = '<div class="empty-state">No upcoming transit options found</div>';
        return;
      }

      list.innerHTML = alertsBanner + journeys.map((j, i) => {
        const leaveIn = Math.max(0, j.busEta - j.walkToStop);
        const urgencyClass = leaveIn <= 0 ? 'urgent' : leaveIn <= 3 ? 'soon' : '';
        const etaClass = leaveIn <= 0 ? 'urgent' : leaveIn <= 3 ? 'soon' : '';
        const routeClass = BUS_ROUTES[j.busRoute].cssClass;
        const trainInfo = TRAIN_LINE_COLORS[j.trainLine];
        const busDelayBadge = getDelayBadge(j.busRoute, delays);
        const trainDelayBadge = getDelayBadge(j.trainLine, delays);
        const leaveLabel = leaveIn <= 0 ? 'leave now' : `leave in ${leaveIn}m`;

        return `
          <div class="arrival-card ${urgencyClass}" data-index="${i}">
            <div class="card-top">
              <div style="display:flex;align-items:center;gap:10px">
                <span class="route-badge ${routeClass}">${j.busRoute}</span>
                <span style="font-size:13px;color:var(--text-dim)">${leaveLabel} · ${j.walkToStop}m walk</span>
                ${busDelayBadge}
              </div>
              <span class="bus-eta ${etaClass}">${j.busEta <= 0 ? 'NOW' : j.busEta + 'm'}</span>
            </div>
            <div class="card-mid">
              <span>${j.transferStation}</span>
              <span class="arrow">&rarr;</span>
              <span class="train-badge ${trainInfo.cssClass}">${j.trainLine}</span>${trainDelayBadge}
              <span class="arrow">&rarr;</span>
              <span>${j.exitStation}</span>
            </div>
            <div class="card-bottom">
              <span>At ${j.exitStation} by ${formatTime(j.arrivalTime)}</span>
              <span class="total-time">${formatMinutes(j.totalTime)}</span>
            </div>
          </div>
        `;
      }).join('');

      list.querySelectorAll('.arrival-card').forEach(card => {
        card.addEventListener('click', () => {
          const idx = parseInt(card.dataset.index);
          openBusDestModal(journeys[idx]);
        });
      });

    } else if (activeTab === 'ebike') {
      // ── E-Bike + destination ──
      const nowMin = minutesSinceMidnight(currentTime);
      const closestStation = findClosestStation(
        selectedDestination.lat, selectedDestination.lng, ['K', 'L', 'M']
      );
      const entries = [];

      for (const station of EBIKE_STATIONS) {
        const walkMin = station.walkMin || 0;
        const arrivalAtStationMin = nowMin + walkMin + station.rideMin;

        for (const line of station.lines) {
          const scheduledStation = Object.keys(TRAIN_SCHEDULES).find(s =>
            TRAIN_SCHEDULES[s][line]
          );
          if (!scheduledStation) continue;

          const train = getNextTrainDeparture(scheduledStation, line, arrivalAtStationMin, currentTime);
          if (!train) continue;

          // Find the exit station for this line closest to destination
          const exitStation = findClosestStation(
            selectedDestination.lat, selectedDestination.lng, [line]
          );
          if (!exitStation) continue;

          const scheduledTravelTime = MUNI_STATIONS[station.name]?.travelTime?.[line] || 0;
          const exitTravelTime = exitStation.travelTime[line];
          const trainRideTime = Math.abs(exitTravelTime - scheduledTravelTime);

          const scheduledStationTravelTime = MUNI_STATIONS[scheduledStation]?.travelTime?.[line] || 0;
          const offset = (MUNI_STATIONS[station.name]?.travelTime?.[line] || 0) - scheduledStationTravelTime;
          const trainAtThisStation = train.departureMinutes + offset;
          if (trainAtThisStation < arrivalAtStationMin) continue;

          const waitAtStation = trainAtThisStation - arrivalAtStationMin;
          const totalTime = walkMin + station.rideMin + waitAtStation + trainRideTime;

          const arrivalDate = new Date(currentTime);
          const arrivalMin = nowMin + totalTime;
          arrivalDate.setHours(Math.floor(arrivalMin / 60), Math.round(arrivalMin % 60), 0, 0);

          entries.push({
            stationName: station.name,
            walkMin,
            rideMin: station.rideMin,
            trainLine: line,
            trainWait: Math.round(waitAtStation),
            trainRideTime,
            exitStation: exitStation.name,
            totalTime,
            arrivalTime: arrivalDate,
            trainDepartAbsolute: trainAtThisStation
          });
        }
      }

      entries.sort((a, b) => a.totalTime - b.totalTime);
      const seen = new Set();
      const deduped = entries.filter(e => {
        const key = `${e.stationName}|${e.trainLine}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      }).slice(0, 10);

      if (deduped.length === 0) {
        list.innerHTML = '<div class="empty-state">No upcoming transit options found</div>';
        return;
      }

      list.innerHTML = alertsBanner + deduped.map((e, i) => {
        const trainInfo = TRAIN_LINE_COLORS[e.trainLine];
        const trainDelayBadge = getDelayBadge(e.trainLine, delays);
        const travelLabel = e.walkMin ? `${e.walkMin}m walk + ${e.rideMin}m ride` : `${e.rideMin}m ride`;
        return `
          <div class="arrival-card" data-index="${i}">
            <div class="card-top">
              <div style="display:flex;align-items:center;gap:10px">
                <span style="font-size:16px">&#x1f6b2;</span>
                <span style="font-size:14px;font-weight:600">${e.stationName}</span>
              </div>
              <span style="font-size:13px;color:var(--text-dim)">${travelLabel}</span>
            </div>
            <div class="card-mid">
              <span class="train-badge ${trainInfo.cssClass}">${e.trainLine}</span>${trainDelayBadge}
              <span class="arrow">&rarr;</span>
              <span>${e.exitStation}</span>
            </div>
            <div class="card-bottom">
              <span>At ${e.exitStation} by ${formatTime(e.arrivalTime)}</span>
              <span class="total-time">${formatMinutes(e.totalTime)}</span>
            </div>
          </div>
        `;
      }).join('');

      list.querySelectorAll('.arrival-card').forEach(card => {
        card.addEventListener('click', () => {
          const idx = parseInt(card.dataset.index);
          const e = deduped[idx];
          const stationData = MUNI_STATIONS[e.stationName];
          openEbikeModal({ ...e, stationCoords: stationData ? { lat: stationData.lat, lng: stationData.lng } : null });
        });
      });

    } else {
      // ── Walk + destination ──
      const nowMin = minutesSinceMidnight(currentTime);
      const station = WALK_STATION;
      const arrivalAtStationMin = nowMin + station.walkMin;
      const walkEntries = [];

      for (const line of station.lines) {
        const scheduledStation = Object.keys(TRAIN_SCHEDULES).find(s =>
          TRAIN_SCHEDULES[s][line]
        );
        if (!scheduledStation) continue;

        const train = getNextTrainDeparture(scheduledStation, line, arrivalAtStationMin, currentTime);
        if (!train) continue;

        const exitStation = findClosestStation(
          selectedDestination.lat, selectedDestination.lng, [line]
        );
        if (!exitStation) continue;

        const stationTT = MUNI_STATIONS[station.name]?.travelTime?.[line] || 0;
        const exitTravelTime = exitStation.travelTime[line];
        const trainRideTime = Math.abs(exitTravelTime - stationTT);

        const scheduledStationTravelTime = MUNI_STATIONS[scheduledStation]?.travelTime?.[line] || 0;
        const offset = stationTT - scheduledStationTravelTime;
        const trainAtThisStation = train.departureMinutes + offset;
        if (trainAtThisStation < arrivalAtStationMin) continue;

        const waitAtStation = trainAtThisStation - arrivalAtStationMin;
        const totalTime = station.walkMin + waitAtStation + trainRideTime;

        const arrivalDate = new Date(currentTime);
        const arrivalMin = nowMin + totalTime;
        arrivalDate.setHours(Math.floor(arrivalMin / 60), Math.round(arrivalMin % 60), 0, 0);

        walkEntries.push({
          stationName: station.name,
          walkMin: station.walkMin,
          trainLine: line,
          trainWait: Math.round(waitAtStation),
          trainRideTime,
          exitStation: exitStation.name,
          totalTime,
          arrivalTime: arrivalDate,
          trainDepartAbsolute: trainAtThisStation
        });
      }

      walkEntries.sort((a, b) => a.totalTime - b.totalTime);

      if (walkEntries.length === 0) {
        list.innerHTML = '<div class="empty-state">No upcoming transit options found</div>';
        return;
      }

      list.innerHTML = alertsBanner + walkEntries.map((e, i) => {
        const trainInfo = TRAIN_LINE_COLORS[e.trainLine];
        const trainDelayBadge = getDelayBadge(e.trainLine, delays);
        return `
          <div class="arrival-card" data-index="${i}">
            <div class="card-top">
              <div style="display:flex;align-items:center;gap:10px">
                <span style="font-size:16px">&#x1F6B6;</span>
                <span style="font-size:14px;font-weight:600">${e.stationName}</span>
              </div>
              <span style="font-size:13px;color:var(--text-dim)">${e.walkMin}m walk</span>
            </div>
            <div class="card-mid">
              <span class="train-badge ${trainInfo.cssClass}">${e.trainLine}</span>${trainDelayBadge}
              <span class="arrow">&rarr;</span>
              <span>${e.exitStation}</span>
            </div>
            <div class="card-bottom">
              <span>At ${e.exitStation} by ${formatTime(e.arrivalTime)}</span>
              <span class="total-time">${formatMinutes(e.totalTime)}</span>
            </div>
          </div>
        `;
      }).join('');

      list.querySelectorAll('.arrival-card').forEach(card => {
        card.addEventListener('click', () => {
          const idx = parseInt(card.dataset.index);
          openWalkModal(walkEntries[idx]);
        });
      });
    }
    return;
  }

  // ── Default mode ──
  if (activeTab === 'bus') {
    const entries = buildDefaultEntries(currentTime);

    if (entries.length === 0) {
      list.innerHTML = '<div class="empty-state">No upcoming service</div>';
      return;
    }

    list.innerHTML = alertsBanner + entries.map((e, i) => {
      const urgencyClass = e.leaveIn <= 0 ? 'urgent' : e.leaveIn <= 3 ? 'soon' : '';
      const etaClass = e.leaveIn <= 0 ? 'urgent' : e.leaveIn <= 3 ? 'soon' : '';
      const routeClass = BUS_ROUTES[e.busRoute].cssClass;
      const bestTrainInfo = TRAIN_LINE_COLORS[e.trainLine];
      const busDelayBadge = getDelayBadge(e.busRoute, delays);
      const trainDelayBadge = getDelayBadge(e.trainLine, delays);

      const trainBadges = e.availableLines.map(l => {
        const info = TRAIN_LINE_COLORS[l];
        const isBest = l === e.trainLine;
        return `<span class="train-badge ${info.cssClass}" style="${isBest ? '' : 'opacity:0.45'}">${l}</span>`;
      }).join(' ');

      const trainDepartTime = new Date(currentTime);
      trainDepartTime.setHours(Math.floor(e.trainDepartureMin / 60), e.trainDepartureMin % 60, 0, 0);

      const leaveLabel = e.leaveIn <= 0 ? 'leave now' : `leave in ${e.leaveIn}m`;

      return `
        <div class="arrival-card ${urgencyClass}" data-index="${i}">
          <div class="card-top">
            <div style="display:flex;align-items:center;gap:10px">
              <span class="route-badge ${routeClass}">${e.busRoute}</span>
              <span style="font-size:13px;color:var(--text-dim)">${leaveLabel} · ${e.walkToStop}m walk</span>
              ${busDelayBadge}
            </div>
            <span class="bus-eta ${etaClass}">${e.busEta <= 0 ? 'NOW' : e.busEta + 'm'}</span>
          </div>
          <div class="card-mid">
            <span>${e.transferStation}</span>
            <span class="arrow">&rarr;</span>
            ${trainBadges}
          </div>
          <div class="card-bottom">
            <span><span class="train-badge ${bestTrainInfo.cssClass}">${e.trainLine}</span> departs ${formatTime(trainDepartTime)}${trainDelayBadge}</span>
            <span class="total-time">wait ${e.trainWait}m for your train</span>
          </div>
        </div>
      `;
    }).join('');

    list.querySelectorAll('.arrival-card').forEach(card => {
      card.addEventListener('click', () => {
        const idx = parseInt(card.dataset.index);
        openDefaultBusModal(entries[idx]);
      });
    });

  } else if (activeTab === 'ebike') {
    // ── E-Bike tab ──
    const entries = buildEbikeEntries(currentTime);

    if (entries.length === 0) {
      list.innerHTML = '<div class="empty-state">No upcoming service</div>';
      return;
    }

    list.innerHTML = alertsBanner + entries.map((e, i) => {
      const trainInfo = TRAIN_LINE_COLORS[e.trainLine];
      const trainDelayBadge = getDelayBadge(e.trainLine, delays);

      const trainDepartTime = new Date(currentTime);
      trainDepartTime.setHours(Math.floor(e.trainDepartAbsolute / 60), Math.round(e.trainDepartAbsolute % 60), 0, 0);

      const travelLabel = e.walkMin ? `${e.walkMin}m walk + ${e.rideMin}m ride` : `${e.rideMin}m ride`;

      return `
        <div class="arrival-card" data-index="${i}">
          <div class="card-top">
            <div style="display:flex;align-items:center;gap:10px">
              <span style="font-size:16px">&#x1f6b2;</span>
              <span style="font-size:14px;font-weight:600">${e.stationName}</span>
            </div>
            <span style="font-size:13px;color:var(--text-dim)">${travelLabel}</span>
          </div>
          <div class="card-bottom">
            <span><span class="train-badge ${trainInfo.cssClass}">${e.trainLine}</span> departs ${formatTime(trainDepartTime)}${trainDelayBadge}</span>
            <span class="total-time">wait ${e.trainWait}m for your train</span>
          </div>
        </div>
      `;
    }).join('');

    list.querySelectorAll('.arrival-card').forEach(card => {
      card.addEventListener('click', () => {
        const idx = parseInt(card.dataset.index);
        openEbikeModal(entries[idx]);
      });
    });

  } else {
    // ── Walk tab ──
    const entries = buildWalkEntries(currentTime);

    if (entries.length === 0) {
      list.innerHTML = '<div class="empty-state">No upcoming service</div>';
      return;
    }

    list.innerHTML = alertsBanner + entries.map((e, i) => {
      const trainInfo = TRAIN_LINE_COLORS[e.trainLine];
      const trainDelayBadge = getDelayBadge(e.trainLine, delays);

      const trainDepartTime = new Date(currentTime);
      trainDepartTime.setHours(Math.floor(e.trainDepartAbsolute / 60), Math.round(e.trainDepartAbsolute % 60), 0, 0);

      return `
        <div class="arrival-card" data-index="${i}">
          <div class="card-top">
            <div style="display:flex;align-items:center;gap:10px">
              <span style="font-size:16px">&#x1F6B6;</span>
              <span style="font-size:14px;font-weight:600">${e.stationName}</span>
            </div>
            <span style="font-size:13px;color:var(--text-dim)">${e.walkMin}m walk</span>
          </div>
          <div class="card-bottom">
            <span><span class="train-badge ${trainInfo.cssClass}">${e.trainLine}</span> departs ${formatTime(trainDepartTime)}${trainDelayBadge}</span>
            <span class="total-time">wait ${e.trainWait}m for your train</span>
          </div>
        </div>
      `;
    }).join('');

    list.querySelectorAll('.arrival-card').forEach(card => {
      card.addEventListener('click', () => {
        const idx = parseInt(card.dataset.index);
        openWalkModal(entries[idx]);
      });
    });
  }
}


// ── Modal & Map ─────────────────────────────────────────────────────────────

function openBusDestModal(journey) {
  const overlay = document.getElementById('modal-overlay');
  const content = document.getElementById('modal-content');
  const route = BUS_ROUTES[journey.busRoute];
  const trainInfo = TRAIN_LINE_COLORS[journey.trainLine];

  const walkToStop = journey.walkToStop || 0;
  const leaveIn = Math.max(0, journey.busEta - walkToStop);

  content.innerHTML = `
    <div class="journey-header">
      <span class="route-badge ${route.cssClass}">${journey.busRoute}</span>
      <div>
        <div class="journey-total">${formatMinutes(journey.totalTime)}</div>
        <div class="journey-total-label">to ${journey.exitStation} &middot; by ${formatTime(journey.arrivalTime)}</div>
      </div>
    </div>

    <div class="timeline">
      ${walkToStop > 0 ? `
      <div class="timeline-step">
        <div class="timeline-line">
          <div class="timeline-dot walk"></div>
          <div class="timeline-connector"></div>
        </div>
        <div class="timeline-content">
          <div class="timeline-title">Walk to bus stop</div>
          <div class="timeline-duration">${walkToStop} min walk</div>
          <div class="timeline-detail">${leaveIn <= 0 ? 'Leave now' : `Leave in ${leaveIn} min`}</div>
        </div>
      </div>
      ` : ''}

      <div class="timeline-step">
        <div class="timeline-line">
          <div class="timeline-dot ${route.dotClass}"></div>
          <div class="timeline-connector"></div>
        </div>
        <div class="timeline-content">
          <div class="timeline-title">Catch ${journey.busRoute} at stop</div>
          <div class="timeline-detail">Departs ${formatTime(journey.busDeparture)}</div>
          <div class="timeline-duration">${journey.busEta <= 0 ? 'Departing now' : `Bus in ${journey.busEta} min`}</div>
        </div>
      </div>

      <div class="timeline-step">
        <div class="timeline-line">
          <div class="timeline-dot walk"></div>
          <div class="timeline-connector"></div>
        </div>
        <div class="timeline-content">
          <div class="timeline-title">Ride to ${journey.transferStation}</div>
          <div class="timeline-duration">${journey.busToTransferTime} min on bus</div>
        </div>
      </div>

      <div class="timeline-step">
        <div class="timeline-line">
          <div class="timeline-dot train-${journey.trainLine.toLowerCase()}"></div>
          <div class="timeline-connector"></div>
        </div>
        <div class="timeline-content">
          <div class="timeline-title">Transfer to <span class="train-badge ${trainInfo.cssClass}">${journey.trainLine}</span> ${trainInfo.name}</div>
          <div class="timeline-detail">Wait ~${journey.trainWait} min</div>
          <div class="timeline-duration">${journey.trainRideTime} min to ${journey.exitStation}</div>
        </div>
      </div>

      <div class="timeline-step">
        <div class="timeline-line">
          <div class="timeline-dot destination"></div>
        </div>
        <div class="timeline-content">
          <div class="timeline-title">Walk to destination</div>
          <div class="timeline-duration">${journey.walkTime} min walk</div>
        </div>
      </div>
    </div>

    <div id="modal-map"></div>
  `;

  overlay.classList.remove('hidden');
  requestAnimationFrame(() => renderMap(journey));
}

function openDefaultBusModal(entry) {
  const overlay = document.getElementById('modal-overlay');
  const content = document.getElementById('modal-content');
  const route = BUS_ROUTES[entry.busRoute];
  const trainInfo = TRAIN_LINE_COLORS[entry.trainLine];
  const trainDepartTime = new Date();
  trainDepartTime.setHours(Math.floor(entry.trainDepartureMin / 60), entry.trainDepartureMin % 60, 0, 0);

  const walkToStop = entry.walkToStop || 0;
  const leaveIn = Math.max(0, entry.busEta - walkToStop);

  content.innerHTML = `
    <div class="journey-header">
      <span class="route-badge ${route.cssClass}">${entry.busRoute}</span>
      <div>
        <div class="journey-total">${trainInfo.name} at ${formatTime(trainDepartTime)}</div>
        <div class="journey-total-label">via ${entry.transferStation}</div>
      </div>
    </div>

    <div class="timeline">
      ${walkToStop > 0 ? `
      <div class="timeline-step">
        <div class="timeline-line">
          <div class="timeline-dot walk"></div>
          <div class="timeline-connector"></div>
        </div>
        <div class="timeline-content">
          <div class="timeline-title">Walk to bus stop</div>
          <div class="timeline-duration">${walkToStop} min walk</div>
          <div class="timeline-detail">${leaveIn <= 0 ? 'Leave now' : `Leave in ${leaveIn} min`}</div>
        </div>
      </div>
      ` : ''}

      <div class="timeline-step">
        <div class="timeline-line">
          <div class="timeline-dot ${route.dotClass}"></div>
          <div class="timeline-connector"></div>
        </div>
        <div class="timeline-content">
          <div class="timeline-title">Catch ${entry.busRoute} at stop</div>
          <div class="timeline-detail">Departs ${formatTime(entry.busDeparture)}</div>
          <div class="timeline-duration">${entry.busEta <= 0 ? 'Departing now' : `Bus in ${entry.busEta} min`}</div>
        </div>
      </div>

      <div class="timeline-step">
        <div class="timeline-line">
          <div class="timeline-dot walk"></div>
          <div class="timeline-connector"></div>
        </div>
        <div class="timeline-content">
          <div class="timeline-title">Ride to ${entry.transferStation}</div>
          <div class="timeline-duration">${entry.busToTransferTime} min on bus</div>
        </div>
      </div>

      <div class="timeline-step">
        <div class="timeline-line">
          <div class="timeline-dot train-${entry.trainLine.toLowerCase()}"></div>
        </div>
        <div class="timeline-content">
          <div class="timeline-title">Board <span class="train-badge ${trainInfo.cssClass}">${entry.trainLine}</span> ${trainInfo.name}</div>
          <div class="timeline-detail">Wait ~${entry.trainWait} min</div>
          <div class="timeline-duration">Departs ${formatTime(trainDepartTime)}</div>
        </div>
      </div>
    </div>
  `;

  overlay.classList.remove('hidden');
}

function openEbikeModal(entry) {
  const overlay = document.getElementById('modal-overlay');
  const content = document.getElementById('modal-content');
  const trainInfo = TRAIN_LINE_COLORS[entry.trainLine];
  const trainDepartTime = new Date();
  const departMin = entry.trainDepartAbsolute || entry.trainDepartureMin || 0;
  trainDepartTime.setHours(Math.floor(departMin / 60), Math.round(departMin % 60), 0, 0);

  const hasExit = entry.exitStation && entry.exitStation !== entry.stationName;

  const walkMin = entry.walkMin || 0;

  content.innerHTML = `
    <div class="journey-header">
      <span style="font-size:22px">&#x1f6b2;</span>
      <div>
        <div class="journey-total">${trainInfo.name} at ${formatTime(trainDepartTime)}</div>
        <div class="journey-total-label">bike to ${entry.stationName}${hasExit ? ' &middot; exit ' + entry.exitStation : ''}</div>
      </div>
    </div>

    <div class="timeline">
      ${walkMin > 0 ? `
      <div class="timeline-step">
        <div class="timeline-line">
          <div class="timeline-dot walk"></div>
          <div class="timeline-connector"></div>
        </div>
        <div class="timeline-content">
          <div class="timeline-title">Walk to e-bike dock near home</div>
          <div class="timeline-duration">${walkMin} min walk</div>
        </div>
      </div>
      ` : ''}

      <div class="timeline-step">
        <div class="timeline-line">
          <div class="timeline-dot walk"></div>
          <div class="timeline-connector"></div>
        </div>
        <div class="timeline-content">
          <div class="timeline-title">Bike to ${entry.stationName}</div>
          <div class="timeline-duration">${entry.rideMin} min ride</div>
        </div>
      </div>

      <div class="timeline-step">
        <div class="timeline-line">
          <div class="timeline-dot train-${entry.trainLine.toLowerCase()}"></div>
          ${hasExit ? '<div class="timeline-connector"></div>' : ''}
        </div>
        <div class="timeline-content">
          <div class="timeline-title">Board <span class="train-badge ${trainInfo.cssClass}">${entry.trainLine}</span> ${trainInfo.name}</div>
          <div class="timeline-detail">Wait ~${entry.trainWait} min</div>
          <div class="timeline-duration">Departs ${formatTime(trainDepartTime)}</div>
        </div>
      </div>

      ${hasExit ? `
      <div class="timeline-step">
        <div class="timeline-line">
          <div class="timeline-dot destination"></div>
        </div>
        <div class="timeline-content">
          <div class="timeline-title">Exit at ${entry.exitStation}</div>
          ${entry.trainRideTime ? `<div class="timeline-duration">${entry.trainRideTime} min on train</div>` : ''}
        </div>
      </div>
      ` : ''}
    </div>

    ${entry.stationCoords ? '<div id="modal-map"></div>' : ''}
  `;

  overlay.classList.remove('hidden');

  if (entry.stationCoords) {
    requestAnimationFrame(() => {
      if (mapInstance) { mapInstance.remove(); mapInstance = null; }
      const mapEl = document.getElementById('modal-map');
      if (!mapEl) return;
      mapInstance = L.map('modal-map', { zoomControl: false });
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OSM &amp; CARTO', maxZoom: 18
      }).addTo(mapInstance);

      function makeIcon(color) {
        return L.divIcon({ className: '', html: `<div style="width:14px;height:14px;border-radius:50%;background:${color};border:2px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,0.5)"></div>`, iconSize: [14, 14], iconAnchor: [7, 7] });
      }

      const markers = [
        L.marker([HOME_STOP.lat, HOME_STOP.lng], { icon: makeIcon('#64b5f6') }).bindPopup('Home'),
        L.marker([entry.stationCoords.lat, entry.stationCoords.lng], { icon: makeIcon(trainInfo.color) }).bindPopup(entry.stationName)
      ];
      markers.forEach(m => m.addTo(mapInstance));
      mapInstance.fitBounds(L.latLngBounds(markers.map(m => m.getLatLng())), { padding: [30, 30] });
    });
  }
}

function openWalkModal(entry) {
  const overlay = document.getElementById('modal-overlay');
  const content = document.getElementById('modal-content');
  const trainInfo = TRAIN_LINE_COLORS[entry.trainLine];
  const departMin = entry.trainDepartAbsolute || 0;
  const trainDepartTime = new Date();
  trainDepartTime.setHours(Math.floor(departMin / 60), Math.round(departMin % 60), 0, 0);

  const hasExit = entry.exitStation && entry.exitStation !== entry.stationName;

  content.innerHTML = `
    <div class="journey-header">
      <span style="font-size:22px">&#x1F6B6;</span>
      <div>
        <div class="journey-total">${hasExit ? formatMinutes(entry.totalTime) : trainInfo.name + ' at ' + formatTime(trainDepartTime)}</div>
        <div class="journey-total-label">walk to ${entry.stationName}${hasExit ? ' &middot; exit ' + entry.exitStation : ''}</div>
      </div>
    </div>

    <div class="timeline">
      <div class="timeline-step">
        <div class="timeline-line">
          <div class="timeline-dot walk"></div>
          <div class="timeline-connector"></div>
        </div>
        <div class="timeline-content">
          <div class="timeline-title">Walk to ${entry.stationName}</div>
          <div class="timeline-duration">${entry.walkMin} min walk</div>
        </div>
      </div>

      <div class="timeline-step">
        <div class="timeline-line">
          <div class="timeline-dot train-${entry.trainLine.toLowerCase()}"></div>
          ${hasExit ? '<div class="timeline-connector"></div>' : ''}
        </div>
        <div class="timeline-content">
          <div class="timeline-title">Board <span class="train-badge ${trainInfo.cssClass}">${entry.trainLine}</span> ${trainInfo.name}</div>
          <div class="timeline-detail">Wait ~${entry.trainWait} min</div>
          <div class="timeline-duration">Departs ${formatTime(trainDepartTime)}</div>
        </div>
      </div>

      ${hasExit ? `
      <div class="timeline-step">
        <div class="timeline-line">
          <div class="timeline-dot destination"></div>
        </div>
        <div class="timeline-content">
          <div class="timeline-title">Exit at ${entry.exitStation}</div>
          ${entry.trainRideTime ? `<div class="timeline-duration">${entry.trainRideTime} min on train</div>` : ''}
        </div>
      </div>
      ` : ''}
    </div>

    <div id="modal-map"></div>
  `;

  overlay.classList.remove('hidden');

  requestAnimationFrame(() => {
    if (mapInstance) { mapInstance.remove(); mapInstance = null; }
    const mapEl = document.getElementById('modal-map');
    if (!mapEl) return;
    mapInstance = L.map('modal-map', { zoomControl: false });
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OSM &amp; CARTO', maxZoom: 18
    }).addTo(mapInstance);

    function makeIcon(color) {
      return L.divIcon({ className: '', html: `<div style="width:14px;height:14px;border-radius:50%;background:${color};border:2px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,0.5)"></div>`, iconSize: [14, 14], iconAnchor: [7, 7] });
    }

    const stationCoords = MUNI_STATIONS[entry.stationName] || WALK_STATION;
    const markers = [
      L.marker([HOME_STOP.lat, HOME_STOP.lng], { icon: makeIcon('#64b5f6') }).bindPopup('Home'),
      L.marker([stationCoords.lat, stationCoords.lng], { icon: makeIcon(trainInfo.color) }).bindPopup(entry.stationName)
    ];
    markers.forEach(m => m.addTo(mapInstance));
    mapInstance.fitBounds(L.latLngBounds(markers.map(m => m.getLatLng())), { padding: [30, 30] });
  });
}

function renderInboundRecommendation(origin, currentTime) {
  const recEl = document.getElementById('recommendation');
  const candidates = [];

  for (const mode of ['walk', 'ebike']) {
    const entries = buildInboundEntries(origin, currentTime, mode);
    if (entries.length === 0) continue;
    // The best entry already factors in e-bike last mile if available
    const e = entries[0];
    const trainName = TRAIN_LINE_COLORS[e.trainLine].name;
    const dockLabel = e.dockName ? ` at ${e.dockName}` : '';
    const firstMileDesc = mode === 'ebike'
      ? `Pick up e-bike${dockLabel}, bike to ${e.boardingStation}`
      : `Walk to ${e.boardingStation}`;
    const lastMileDesc = e.lastMileMode === 'ebike' ? 'e-bike home' : 'walk home';
    // Build availability line for e-bike legs
    const availParts = [];
    if (mode === 'ebike' && e.dockEbikes !== null && e.dockName) {
      availParts.push(`${e.dockEbikes} e-bike${e.dockEbikes !== 1 ? 's' : ''} available at ${e.dockName}`);
    }
    if (e.lastMileMode === 'ebike' && ebikeAvailability.westPortal !== null) {
      availParts.push(`${ebikeAvailability.westPortal} e-bike${ebikeAvailability.westPortal !== 1 ? 's' : ''} available at West Portal`);
    }
    candidates.push({
      min: e.arrivalMin,
      mode: `${mode}-${e.lastMileMode || 'walk'}`,
      entry: e,
      summary: `${firstMileDesc}, catch the ${trainName} to ${e.exitStation}, ${lastMileDesc}. Home by ${formatTime(e.arrivalTime)}.`,
      availHtml: availParts.length > 0 ? availParts.join(' · ') : ''
    });
  }

  if (candidates.length === 0) { recEl.classList.add('hidden'); return; }
  candidates.sort((a, b) => a.min - b.min);
  const winner = candidates[0];
  const runnerUp = candidates.find(c => c.min > winner.min);

  let detail = '';
  if (runnerUp) {
    const diff = Math.round(runnerUp.min - winner.min);
    if (diff > 0) {
      detail = `You'll be home ${diff}m sooner than the next option.`;
    }
  }

  const availLine = winner.availHtml ? `<div class="rec-avail">${winner.availHtml}</div>` : '';
  recEl.innerHTML = `<div class="rec-label">Recommended</div><div class="rec-summary">${winner.summary}</div>${availLine}${detail ? `<div class="rec-detail">${detail}</div>` : ''}`;
  recEl.style.cursor = 'pointer';
  recEl.classList.remove('hidden');
  recEl.onclick = () => {
    openInboundModal(winner.entry);
  };
}

function openInboundModal(entry) {
  const overlay = document.getElementById('modal-overlay');
  const content = document.getElementById('modal-content');
  const trainInfo = TRAIN_LINE_COLORS[entry.trainLine];
  const trainDepartTime = new Date();
  trainDepartTime.setHours(Math.floor(entry.trainDepartAbsolute / 60), Math.round(entry.trainDepartAbsolute % 60), 0, 0);

  const isEbike = entry.firstMileMode === 'ebike';
  const headerIcon = isEbike ? '&#x1f6b2;' : '&#x1F6B6;';

  content.innerHTML = `
    <div class="journey-header">
      <span style="font-size:22px">${headerIcon}</span>
      <div>
        <div class="journey-total">${formatMinutes(entry.totalTime)} to home</div>
        <div class="journey-total-label">via ${entry.boardingStation} &middot; home by ${formatTime(entry.arrivalTime)}</div>
      </div>
    </div>

    <div class="timeline">
      ${isEbike ? `
      <div class="timeline-step">
        <div class="timeline-line">
          <div class="timeline-dot walk"></div>
          <div class="timeline-connector"></div>
        </div>
        <div class="timeline-content">
          <div class="timeline-title">Walk to ${entry.dockName || 'e-bike dock'}</div>
          <div class="timeline-duration">${entry.walkToDock} min walk</div>
          ${entry.dockEbikes !== null && entry.dockName ? `<div class="timeline-detail">${entry.dockEbikes} e-bike${entry.dockEbikes !== 1 ? 's' : ''} available at ${entry.dockName}</div>` : ''}
        </div>
      </div>
      <div class="timeline-step">
        <div class="timeline-line">
          <div class="timeline-dot walk"></div>
          <div class="timeline-connector"></div>
        </div>
        <div class="timeline-content">
          <div class="timeline-title">Bike to ${entry.boardingStation}</div>
          <div class="timeline-duration">${entry.bikeRide} min ride</div>
        </div>
      </div>
      ` : `
      <div class="timeline-step">
        <div class="timeline-line">
          <div class="timeline-dot walk"></div>
          <div class="timeline-connector"></div>
        </div>
        <div class="timeline-content">
          <div class="timeline-title">Walk to ${entry.boardingStation}</div>
          <div class="timeline-duration">${entry.firstMileTime} min walk</div>
        </div>
      </div>
      `}

      <div class="timeline-step">
        <div class="timeline-line">
          <div class="timeline-dot train-${entry.trainLine.toLowerCase()}"></div>
          <div class="timeline-connector"></div>
        </div>
        <div class="timeline-content">
          <div class="timeline-title">Board <span class="train-badge ${trainInfo.cssClass}">${entry.trainLine}</span> ${trainInfo.name}</div>
          <div class="timeline-detail">Wait ~${entry.trainWait} min</div>
          <div class="timeline-duration">${entry.trainRideTime} min to ${entry.exitStation}</div>
        </div>
      </div>

      <div class="timeline-step">
        <div class="timeline-line">
          <div class="timeline-dot walk"></div>
          <div class="timeline-connector"></div>
        </div>
        <div class="timeline-content">
          <div class="timeline-title">Exit at ${entry.exitStation}</div>
          <div class="timeline-duration">Departs ${formatTime(trainDepartTime)}</div>
        </div>
      </div>

      <div class="timeline-step">
        <div class="timeline-line">
          <div class="timeline-dot destination"></div>
        </div>
        <div class="timeline-content">
          <div class="timeline-title">${entry.lastMileMode === 'ebike' ? 'E-bike home' : 'Walk home'}</div>
          <div class="timeline-duration">${entry.lastMileTime || entry.walkHome} min ${entry.lastMileMode === 'ebike' ? 'ride' : 'walk'}</div>
          ${entry.lastMileMode === 'ebike' && ebikeAvailability.westPortal !== null ? `<div class="timeline-detail">${ebikeAvailability.westPortal} e-bike${ebikeAvailability.westPortal !== 1 ? 's' : ''} available at West Portal</div>` : ''}
        </div>
      </div>
    </div>

    <div id="modal-map"></div>
  `;

  overlay.classList.remove('hidden');

  requestAnimationFrame(() => {
    if (mapInstance) { mapInstance.remove(); mapInstance = null; }
    const mapEl = document.getElementById('modal-map');
    if (!mapEl) return;
    mapInstance = L.map('modal-map', { zoomControl: false });
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OSM &amp; CARTO', maxZoom: 18
    }).addTo(mapInstance);

    function makeIcon(color) {
      return L.divIcon({ className: '', html: '<div style="width:14px;height:14px;border-radius:50%;background:' + color + ';border:2px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,0.5)"></div>', iconSize: [14, 14], iconAnchor: [7, 7] });
    }

    const markers = [
      L.marker([entry.boardingCoords.lat, entry.boardingCoords.lng], { icon: makeIcon(trainInfo.color) }).bindPopup(entry.boardingStation),
      L.marker([HOME_STOP.lat, HOME_STOP.lng], { icon: makeIcon('#64b5f6') }).bindPopup('Home')
    ];
    const exitCoords = MUNI_STATIONS[entry.exitStation];
    if (exitCoords) {
      markers.push(L.marker([exitCoords.lat, exitCoords.lng], { icon: makeIcon('#66bb6a') }).bindPopup('Exit: ' + entry.exitStation));
    }
    markers.forEach(m => m.addTo(mapInstance));
    mapInstance.fitBounds(L.latLngBounds(markers.map(m => m.getLatLng())), { padding: [30, 30] });
  });
}

function closeModal() {
  document.getElementById('modal-overlay').classList.add('hidden');
  if (mapInstance) {
    mapInstance.remove();
    mapInstance = null;
  }
}

function renderMap(journey) {
  if (mapInstance) {
    mapInstance.remove();
    mapInstance = null;
  }

  const mapEl = document.getElementById('modal-map');
  if (!mapEl) return;

  mapInstance = L.map('modal-map', { zoomControl: false });
  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; OSM &amp; CARTO',
    maxZoom: 18
  }).addTo(mapInstance);

  const route = BUS_ROUTES[journey.busRoute];
  const trainInfo = TRAIN_LINE_COLORS[journey.trainLine];

  function makeIcon(color) {
    return L.divIcon({
      className: '',
      html: `<div style="width:14px;height:14px;border-radius:50%;background:${color};border:2px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,0.5)"></div>`,
      iconSize: [14, 14],
      iconAnchor: [7, 7]
    });
  }

  const markers = [
    L.marker([journey.busPickup.lat, journey.busPickup.lng], { icon: makeIcon(route.color) })
      .bindPopup(`<b>${journey.busRoute}</b> pickup<br>${HOME_STOP.name}`),
    L.marker([journey.transferCoords.lat, journey.transferCoords.lng], { icon: makeIcon(trainInfo.color) })
      .bindPopup(`<b>${journey.trainLine}</b> at ${journey.transferStation}`),
    L.marker([journey.destCoords.lat, journey.destCoords.lng], { icon: makeIcon('#66bb6a') })
      .bindPopup(`Destination`)
  ];

  // Add exit station marker if different from transfer
  if (journey.exitStation !== journey.transferStation) {
    markers.push(
      L.marker([journey.exitCoords.lat, journey.exitCoords.lng], { icon: makeIcon(trainInfo.color) })
        .bindPopup(`Exit at ${journey.exitStation}`)
    );
  }

  markers.forEach(m => m.addTo(mapInstance));

  const bounds = L.latLngBounds(markers.map(m => m.getLatLng()));
  mapInstance.fitBounds(bounds, { padding: [30, 30] });
}


// ── Event Wiring ────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('destination-input');
  const searchBtn = document.getElementById('search-btn');
  const suggestionsEl = document.getElementById('suggestions');
  const destDisplay = document.getElementById('destination-display');
  const modalOverlay = document.getElementById('modal-overlay');
  const modalClose = document.getElementById('modal-close');

  // Clock
  updateClock();
  setInterval(updateClock, 1000);

  // Refresh real-time data every 30s, then re-render
  async function refreshAndRender() {
    await Promise.all([refreshLiveData(), refreshEbikeAvailability()]);
    renderArrivals();
  }
  setInterval(refreshAndRender, 30000);

  // Landing screen
  const landing = document.getElementById('landing');
  const app = document.getElementById('app');
  const backBtn = document.getElementById('back-btn');

  function launchRocket(card, callback) {
    const icon = card.querySelector('.landing-icon');
    if (!icon) { callback(); return; }

    const rect = icon.getBoundingClientRect();
    const clone = document.createElement('div');
    clone.textContent = icon.textContent;
    clone.style.cssText = `
      position:fixed;left:${rect.left}px;top:${rect.top}px;
      font-size:${rect.height}px;line-height:1;
      z-index:9999;pointer-events:none;will-change:transform,opacity;
    `;
    document.body.appendChild(clone);
    icon.style.opacity = '0';

    // Fade out landing page
    landing.style.transition = 'opacity 0.5s ease';
    landing.style.opacity = '0';

    // Animate with meandering sine-wave path
    const duration = 700; // ms
    const startX = rect.left;
    const startY = rect.top;
    const endY = -(rect.height + 80); // off the top
    const centerX = window.innerWidth / 2 - rect.width / 2;
    const driftX = centerX - startX; // drift toward center
    const wobbleAmp = 30; // px side-to-side
    const wobbleFreq = 2.5; // full oscillations
    const startTime = performance.now();

    function frame(now) {
      const elapsed = now - startTime;
      const t = Math.min(elapsed / duration, 1);
      // Ease-in curve for acceleration
      const ease = t * t;

      const y = startY + (endY - startY) * ease;
      const x = startX + driftX * ease + Math.sin(t * wobbleFreq * Math.PI * 2) * wobbleAmp * (1 - t * 0.5);
      const scale = 1 + ease * 0.9;
      const rotate = -15 + Math.sin(t * wobbleFreq * Math.PI * 2) * 12;
      const opacity = 1 - t * 0.8;

      clone.style.transform = `translate(${x - startX}px, ${y - startY}px) scale(${scale}) rotate(${rotate}deg)`;
      clone.style.opacity = opacity;

      if (t < 1) {
        requestAnimationFrame(frame);
      } else {
        clone.remove();
        icon.style.opacity = '';
        landing.style.transition = '';
        landing.style.opacity = '';
        callback();
      }
    }
    requestAnimationFrame(frame);
  }

  function dropHome(card, callback) {
    const icon = card.querySelector('.landing-icon');
    if (!icon) { callback(); return; }

    const rect = icon.getBoundingClientRect();
    const clone = document.createElement('div');
    clone.textContent = icon.textContent;
    clone.style.cssText = `
      position:fixed;left:${rect.left}px;top:${rect.top}px;
      font-size:${rect.height}px;line-height:1;
      z-index:9999;pointer-events:none;will-change:transform,opacity;
    `;
    document.body.appendChild(clone);
    icon.style.opacity = '0';

    landing.style.transition = 'opacity 0.5s ease';
    landing.style.opacity = '0';

    const startX = rect.left;
    const startY = rect.top;
    const floor = window.innerHeight - rect.height - 10;
    const dropDist = floor - startY;
    const offScreenX = window.innerWidth + 60;

    // Phase 1: drop to floor (0 → 0.25)
    // Phase 2: bounce 1 — high, rightward (0.25 → 0.50)
    // Phase 3: bounce 2 — medium (0.50 → 0.72)
    // Phase 4: bounce 3 — small, tumbles off right (0.72 → 1.0)
    const duration = 1800;
    const startTime = performance.now();
    let callbackFired = false;

    function frame(now) {
      const elapsed = now - startTime;
      const t = Math.min(elapsed / duration, 1);
      let x = 0, y = 0, rotate = 0, opacity = 1;

      if (t < 0.25) {
        // Drop: accelerate downward
        const p = t / 0.25;
        const ease = p * p;
        y = dropDist * ease;
        rotate = p * 5;
      } else if (t < 0.50) {
        // Bounce 1: high arc, move right
        const p = (t - 0.25) / 0.25;
        const arc = Math.sin(p * Math.PI);
        y = dropDist - arc * dropDist * 0.35;
        x = p * 80;
        rotate = 5 + p * 10;
      } else if (t < 0.72) {
        // Bounce 2: medium arc, more rightward
        const p = (t - 0.50) / 0.22;
        const arc = Math.sin(p * Math.PI);
        y = dropDist - arc * dropDist * 0.15;
        x = 80 + p * 100;
        rotate = 15 + p * 15;
      } else {
        // Bounce 3: small bounce, tumble off right edge
        const p = (t - 0.72) / 0.28;
        const arc = Math.sin(p * Math.PI * 0.7);
        y = dropDist - arc * dropDist * 0.06;
        x = 180 + p * (offScreenX - startX);
        rotate = 30 + p * 90;
        opacity = 1 - Math.max(0, (p - 0.5) * 2);
      }

      // Fire callback after first bounce lands so app loads underneath
      if (t >= 0.50 && !callbackFired) {
        callbackFired = true;
        callback();
      }

      clone.style.transform = `translate(${x}px, ${y}px) rotate(${rotate}deg)`;
      clone.style.opacity = opacity;

      if (t < 1) {
        requestAnimationFrame(frame);
      } else {
        clone.remove();
        icon.style.opacity = '';
      }
    }
    requestAnimationFrame(frame);
  }

  async function enterApp(direction) {
    activeDirection = direction;
    input.placeholder = direction === 'inbound' ? 'Where are you coming from?' : 'Where are you going?';

    const showApp = async () => {
      landing.classList.add('hidden');
      app.classList.remove('hidden');

      if (direction === 'inbound') {
        document.getElementById('arrivals-list').innerHTML = '<div class="empty-state">Detecting your location...</div>';
        try {
          const [pos] = await Promise.all([getCurrentPosition(), refreshEbikeAvailability()]);
          const geo = await reverseGeocode(pos.lat, pos.lng);
          input.value = geo.short;
          selectDestination({ ...geo, lat: pos.lat, lng: pos.lng });
        } catch (err) {
          document.getElementById('arrivals-list').innerHTML = '<div class="empty-state">Could not detect location. Search above.</div>';
        }
      }
      await refreshAndRender();
    };

    return showApp();
  }

  document.querySelectorAll('.landing-card').forEach(card => {
    card.addEventListener('click', () => {
      const direction = card.dataset.direction;
      if (direction === 'outbound') {
        launchRocket(card, () => enterApp(direction));
      } else {
        dropHome(card, () => enterApp(direction));
      }
    });
  });

  backBtn.addEventListener('click', () => {
    app.classList.add('hidden');
    landing.classList.remove('hidden');
    selectedDestination = null;
    input.value = '';
    destDisplay.classList.add('hidden');
    document.getElementById('recommendation').classList.add('hidden');
  });

  // Tabs
  document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      activeTab = tab.dataset.tab;
      renderArrivals();
    });
  });

  // Search input
  input.addEventListener('input', () => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(async () => {
      const results = await searchDestination(input.value);
      if (results.length === 0) {
        suggestionsEl.classList.add('hidden');
        return;
      }
      suggestionsEl.innerHTML = results.map((r, i) =>
        `<div class="suggestion-item" data-index="${i}">${r.short}${r.context ? `<span style="color:var(--text-dim);font-size:12px;margin-left:6px">${r.context}</span>` : ''}</div>`
      ).join('');
      suggestionsEl.classList.remove('hidden');

      suggestionsEl.querySelectorAll('.suggestion-item').forEach(item => {
        item.addEventListener('click', () => {
          const idx = parseInt(item.dataset.index);
          selectDestination(results[idx]);
        });
      });
    }, 350);
  });

  // Search button triggers search on current input
  searchBtn.addEventListener('click', async () => {
    const results = await searchDestination(input.value);
    if (results.length > 0) selectDestination(results[0]);
  });

  // Enter key
  input.addEventListener('keydown', async (e) => {
    if (e.key === 'Enter') {
      const results = await searchDestination(input.value);
      if (results.length > 0) selectDestination(results[0]);
    }
  });

  // Close suggestions on outside click
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.search-container')) {
      suggestionsEl.classList.add('hidden');
    }
  });

  // Modal
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });
  modalClose.addEventListener('click', closeModal);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

  function selectDestination(dest) {
    selectedDestination = dest;
    input.value = dest.short;
    suggestionsEl.classList.add('hidden');
    const label = activeDirection === 'inbound' ? 'From' : 'To';
    destDisplay.innerHTML = `<span class="dest-label">${label}</span> ${dest.short}${dest.context ? ', ' + dest.context : ''}<button id="clear-dest" style="margin-left:auto;background:none;border:none;color:var(--text-dim);cursor:pointer;font-size:16px;padding:0 4px" aria-label="Clear destination">&times;</button>`;
    destDisplay.classList.remove('hidden');
    document.getElementById('clear-dest').addEventListener('click', () => {
      selectedDestination = null;
      input.value = '';
      destDisplay.classList.add('hidden');
      renderArrivals();
    });
    renderArrivals();
  }

});
