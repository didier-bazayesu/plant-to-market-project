// frontend/src/components/MapPicker.jsx
import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl:       'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl:     'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const RWANDA_CENTER = [-1.9403, 29.8739];
const DEFAULT_ZOOM  = 9;

export default function MapPicker({
  initialLat = RWANDA_CENTER[0],
  initialLng = RWANDA_CENTER[1],
  onLocationSelect,
  height = '350px',
  disabled = false,
}) {
  const mapContainerRef = useRef(null);
  const mapRef          = useRef(null);
  const markerRef       = useRef(null);
  const [selectedCoords, setSelectedCoords] = useState(null);

  // Search state
  const [searchQuery, setSearchQuery]   = useState('');
  const [searching, setSearching]       = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [searchError, setSearchError]   = useState(null);

  // ─── Init map ────────────────────────────────────────────
  useEffect(() => {
    if (mapRef.current || !mapContainerRef.current) return;

    const map = L.map(mapContainerRef.current).setView(
      [initialLat, initialLng], DEFAULT_ZOOM
    );

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map);

    const marker = L.marker([initialLat, initialLng], {
      draggable: !disabled,
    }).addTo(map);

    marker.bindPopup('📍 Drag to set farm location').openPopup();

    marker.on('dragend', (e) => {
      const { lat, lng } = e.target.getLatLng();
      setSelectedCoords({ lat, lng });
      onLocationSelect?.(lat, lng);
      marker.bindPopup(`📍 ${lat.toFixed(6)}, ${lng.toFixed(6)}`).openPopup();
    });

    if (!disabled) {
      map.on('click', (e) => {
        const { lat, lng } = e.latlng;
        marker.setLatLng([lat, lng]);
        setSelectedCoords({ lat, lng });
        onLocationSelect?.(lat, lng);
        marker.bindPopup(`📍 ${lat.toFixed(6)}, ${lng.toFixed(6)}`).openPopup();
      });
    }

    mapRef.current    = map;
    markerRef.current = marker;

    return () => {
      map.remove();
      mapRef.current    = null;
      markerRef.current = null;
    };
  }, []);

  // ─── Sync marker if initialLat/Lng change ────────────────
  useEffect(() => {
    if (!markerRef.current) return;
    markerRef.current.setLatLng([initialLat, initialLng]);
    mapRef.current?.setView([initialLat, initialLng], DEFAULT_ZOOM);
  }, [initialLat, initialLng]);

  // ─── Search handler ───────────────────────────────────────
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setSearching(true);
    setSearchError(null);
    setSearchResults([]);

    try {
      const query = `${searchQuery}, Rwanda`;
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=5&countrycodes=rw`,
        { headers: { 'Accept-Language': 'en' } }
      );
      const data = await res.json();
      if (data.length === 0) {
        setSearchError('No results found. Try a different name.');
      } else {
        setSearchResults(data);
      }
    } catch {
      setSearchError('Search failed. Check your connection.');
    } finally {
      setSearching(false);
    }
  };

  // ─── Select a search result ───────────────────────────────
  const handleSelectResult = (result) => {
    const lat = parseFloat(result.lat);
    const lng = parseFloat(result.lon);

    markerRef.current?.setLatLng([lat, lng]);
    mapRef.current?.setView([lat, lng], 14);
    setSelectedCoords({ lat, lng });
    onLocationSelect?.(lat, lng);
    markerRef.current
      ?.bindPopup(`📍 ${result.display_name.split(',')[0]}`)
      .openPopup();

    // Clear search
    setSearchResults([]);
    setSearchQuery('');
  };

  return (
    <div className="rounded-xl overflow-hidden border border-gray-200 shadow-sm">

      {/* Search bar */}
      {!disabled && (
        <div className="p-3 bg-white border-b border-gray-100">
          <div className="flex gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={e => { setSearchQuery(e.target.value); setSearchResults([]); setSearchError(null); }}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
              placeholder="Search location in Rwanda..."
              className="flex-1 px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
            />
            <button
              type="button"
              onClick={handleSearch}
              disabled={searching || !searchQuery.trim()}
              className="px-4 py-2 bg-green-600 text-white text-sm font-bold rounded-xl hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              {searching ? '...' : 'Search'}
            </button>
          </div>

          {/* Search results dropdown */}
          {searchResults.length > 0 && (
            <div className="mt-2 border border-gray-200 rounded-xl overflow-hidden shadow-sm">
              {searchResults.map((result, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleSelectResult(result)}
                  className="w-full text-left px-3 py-2.5 text-sm hover:bg-green-50 border-b border-gray-100 last:border-0 transition-colors"
                >
                  <p className="font-semibold text-gray-800 truncate">
                    {result.display_name.split(',')[0]}
                  </p>
                  <p className="text-xs text-gray-400 truncate">{result.display_name}</p>
                </button>
              ))}
            </div>
          )}

          {/* Search error */}
          {searchError && (
            <p className="mt-2 text-xs text-red-500 font-medium">{searchError}</p>
          )}
        </div>
      )}

      {/* Map */}
      <div
        ref={mapContainerRef}
        style={{ height, width: '100%' }}
        className={disabled ? 'opacity-60 pointer-events-none' : ''}
      />

      {/* Coordinate display */}
      <div className="bg-gray-50 border-t border-gray-200 px-3 py-2 flex items-center justify-between text-sm">
        {selectedCoords ? (
          <span className="text-green-700 font-medium">
            ✅ {selectedCoords.lat.toFixed(6)}, {selectedCoords.lng.toFixed(6)}
          </span>
        ) : (
          <span className="text-gray-500">
            {disabled ? 'Map view only' : 'Search, click map, or drag marker to set location'}
          </span>
        )}
        {selectedCoords && !disabled && (
          <button
            type="button"
            onClick={() => {
              setSelectedCoords(null);
              onLocationSelect?.(null, null);
              markerRef.current?.setLatLng([initialLat, initialLng]);
              mapRef.current?.setView([initialLat, initialLng], DEFAULT_ZOOM);
            }}
            className="text-xs text-gray-400 hover:text-red-500 transition-colors"
          >
            Reset
          </button>
        )}
      </div>
    </div>
  );
}