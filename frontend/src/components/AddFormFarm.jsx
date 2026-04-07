import { useState } from 'react';
import { useFarms } from '../context/FarmContext';
import { useGPSLocation } from '../hooks/useGPSLocation';
import { MapPin, Navigation, Map, AlertTriangle, CheckCircle, Loader, X } from 'lucide-react';
import MapPicker from './MapPicker';

// All 30 Rwanda districts with coordinates
const DISTRICT_COORDINATES = {
  Gasabo:     { latitude: -1.9441, longitude: 30.0619 },
  Kicukiro:   { latitude: -1.9706, longitude: 30.1044 },
  Nyarugenge: { latitude: -1.9503, longitude: 30.0588 },
  Musanze:    { latitude: -1.4994, longitude: 29.6340 },
  Burera:     { latitude: -1.3667, longitude: 29.8500 },
  Gakenke:    { latitude: -1.6893, longitude: 29.7793 },
  Gicumbi:    { latitude: -1.5761, longitude: 30.0731 },
  Rulindo:    { latitude: -1.7256, longitude: 30.0653 },
  Huye:       { latitude: -2.5963, longitude: 29.7394 },
  Gisagara:   { latitude: -2.6148, longitude: 29.8289 },
  Kamonyi:    { latitude: -2.0380, longitude: 29.8766 },
  Muhanga:    { latitude: -2.0833, longitude: 29.7500 },
  Nyamagabe:  { latitude: -2.4833, longitude: 29.4833 },
  Nyanza:     { latitude: -2.3500, longitude: 29.7333 },
  Nyaruguru:  { latitude: -2.7167, longitude: 29.5500 },
  Ruhango:    { latitude: -2.2167, longitude: 29.7833 },
  Bugesera:   { latitude: -2.1667, longitude: 30.1667 },
  Gatsibo:    { latitude: -1.5833, longitude: 30.4667 },
  Kayonza:    { latitude: -1.8833, longitude: 30.6500 },
  Kirehe:     { latitude: -2.1500, longitude: 30.6833 },
  Ngoma:      { latitude: -2.1500, longitude: 30.5000 },
  Nyagatare:  { latitude: -1.2992, longitude: 30.3281 },
  Rwamagana:  { latitude: -1.9500, longitude: 30.4333 },
  Karongi:    { latitude: -2.0667, longitude: 29.3833 },
  Ngororero:  { latitude: -1.8833, longitude: 29.5333 },
  Nyabihu:    { latitude: -1.6500, longitude: 29.5000 },
  Nyamasheke: { latitude: -2.3333, longitude: 29.1667 },
  Rubavu:     { latitude: -1.6781, longitude: 29.3383 },
  Rusizi:     { latitude: -2.4833, longitude: 28.9000 },
  Rutsiro:    { latitude: -1.9333, longitude: 29.4000 },
};

const RWANDA_DISTRICTS = Object.keys(DISTRICT_COORDINATES).sort();

const AddFarmForm = ({ onClose, onSuccess }) => {
  const { addFarm } = useFarms();
  const [submitting, setSubmitting] = useState(false);
  const [locationMethod, setLocationMethod] = useState('district');
  const [mapCoords, setMapCoords] = useState(null); // for Leaflet pin (Phase 2)
  const [manualLat, setManualLat] = useState('');
  const [manualLng, setManualLng] = useState('');
  const [manualSaved, setManualSaved] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    district: '',
    size: '',
    soilType: '',
    irrigation: 'Manual',
  });

  // Unified GPS hook — no farmId here, saving happens after farm is created
  const { status: gpsStatus, coordinates: gpsCoords, error: gpsError, 
          loading: gpsLoading, requestGPS, retryGPS, clearGPS } = useGPSLocation();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDistrictSelect = (e) => {
    setFormData({ ...formData, district: e.target.value });
  };

  const handleManualSave = () => {
    const lat = parseFloat(manualLat);
    const lng = parseFloat(manualLng);
    if (isNaN(lat) || isNaN(lng)) return alert('Enter valid coordinates');
    if (lat < -90 || lat > 90) return alert('Latitude must be between -90 and 90');
    if (lng < -180 || lng > 180) return alert('Longitude must be between -180 and 180');
    setManualSaved(true);
  };

  // Resolve final coordinates based on selected method
  const getFinalCoords = () => {
    if (locationMethod === 'gps' && gpsCoords) {
      return { 
        latitude: gpsCoords.latitude, 
        longitude: gpsCoords.longitude,
        locationAccuracy: 'gps_at_farm'
      };
    }
    if (locationMethod === 'map' && manualSaved) {
      return { 
        latitude: parseFloat(manualLat), 
        longitude: parseFloat(manualLng),
        locationAccuracy: 'map_pin'
      };
    }
    if (locationMethod === 'district' && formData.district) {
      const dc = DISTRICT_COORDINATES[formData.district];
      if (dc) return { 
        latitude: dc.latitude, 
        longitude: dc.longitude,
        locationAccuracy: 'district_fallback'
      };
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const coords = getFinalCoords();

    if (!coords) {
      alert('Please set farm location using one of the three methods');
      return;
    }
    if (!formData.name || !formData.district || !formData.size || !formData.soilType) {
      alert('Please fill all required fields');
      return;
    }

    setSubmitting(true);
    try {
      await addFarm({
        name: formData.name,
        district: formData.district,
        location: formData.district,
        size: parseFloat(formData.size),
        soilType: formData.soilType,
        irrigation: formData.irrigation,
        latitude: coords.latitude,
        longitude: coords.longitude,
        locationAccuracy: coords.locationAccuracy,
      });
      if (onSuccess) onSuccess();
      if (onClose) onClose();
    } catch (err) {
      console.error('Error adding farm:', err);
      alert('Failed to add farm. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-[2rem] max-w-2xl w-full max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-black text-gray-900">Register New Farm</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">

          {/* Farm Information */}
          <div className="space-y-4">
            <h3 className="text-base font-black text-gray-900">Farm Information</h3>

            <div>
              <label className="text-xs font-black uppercase text-gray-400 tracking-widest block mb-2">
                Farm Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="e.g., Green Valley Farm"
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-black uppercase text-gray-400 tracking-widest block mb-2">
                District *
              </label>
              <select
                name="district"
                value={formData.district}
                onChange={handleDistrictSelect}
                required
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
              >
                <option value="">Select District</option>
                {RWANDA_DISTRICTS.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-black uppercase text-gray-400 tracking-widest block mb-2">
                  Size (hectares) *
                </label>
                <input
                  type="number"
                  name="size"
                  value={formData.size}
                  onChange={handleChange}
                  required
                  step="0.1"
                  placeholder="e.g., 5.5"
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-black uppercase text-gray-400 tracking-widest block mb-2">
                  Soil Type *
                </label>
                <select
                  name="soilType"
                  value={formData.soilType}
                  onChange={handleChange}
                  required
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
                >
                  <option value="">Select Soil Type</option>
                  <option value="Clay">Clay</option>
                  <option value="Sandy">Sandy</option>
                  <option value="Loamy">Loamy</option>
                  <option value="Silt">Silt</option>
                  <option value="Peaty">Peaty</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-black uppercase text-gray-400 tracking-widest block mb-2">
                Irrigation Type
              </label>
              <select
                name="irrigation"
                value={formData.irrigation}
                onChange={handleChange}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
              >
                <option value="Manual">Manual</option>
                <option value="Drip">Drip Irrigation</option>
                <option value="Sprinkler">Sprinkler System</option>
                <option value="Flood">Flood Irrigation</option>
              </select>
            </div>
          </div>

          {/* Location Method */}
          <div className="space-y-4">
            <h3 className="text-base font-black text-gray-900">Farm Location</h3>
            <p className="text-xs text-gray-400 font-medium -mt-2">
              Best accuracy: GPS at farm → Map pin → District fallback
            </p>

            <div className="grid grid-cols-3 gap-3">
              {[
                { key: 'gps', icon: Navigation, label: 'GPS at Farm' },
                { key: 'map', icon: Map, label: 'Map Pin' },
                { key: 'district', icon: MapPin, label: 'District' },
              ].map(({ key, icon: Icon, label }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => { setLocationMethod(key); clearGPS(); }}
                  className={`p-3 rounded-xl border-2 transition-all ${
                    locationMethod === key
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : 'border-gray-200 hover:border-gray-300 text-gray-500'
                  }`}
                >
                  <Icon size={20} className="mx-auto mb-1" />
                  <p className="font-bold text-xs">{label}</p>
                </button>
              ))}
            </div>

            {/* GPS option */}
            {locationMethod === 'gps' && (
              <div className="bg-gray-50 rounded-xl p-5 text-center">
                {gpsStatus === 'idle' && (
                  <>
                    <button
                      type="button"
                      onClick={requestGPS}
                      className="bg-green-600 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-green-700 inline-flex items-center gap-2"
                    >
                      <Navigation size={16} />
                      Capture Farm Location
                    </button>
                    <p className="text-xs text-gray-400 mt-3">
                      Only use this while physically at your farm
                    </p>
                  </>
                )}
                {gpsStatus === 'requesting' && (
                  <div>
                    <Loader size={28} className="mx-auto mb-2 text-green-600 animate-spin" />
                    <p className="text-sm font-bold text-gray-600">Getting location...</p>
                  </div>
                )}
                {(gpsStatus === 'granted' || gpsStatus === 'saved') && gpsCoords && (
                  <div>
                    <CheckCircle size={28} className="mx-auto mb-2 text-green-600" />
                    <p className="font-bold text-green-700 text-sm">Farm Location Captured</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {gpsCoords.latitude.toFixed(6)}, {gpsCoords.longitude.toFixed(6)}
                    </p>
                    <button
                      type="button"
                      onClick={retryGPS}
                      className="mt-2 text-green-600 text-xs font-bold hover:underline"
                    >
                      Recapture
                    </button>
                  </div>
                )}
                {gpsStatus === 'denied' && (
                  <div>
                    <AlertTriangle size={28} className="mx-auto mb-2 text-red-500" />
                    <p className="text-sm font-bold text-red-600">GPS Denied</p>
                    <p className="text-xs text-gray-500 mt-1">{gpsError}</p>
                    <button
                      type="button"
                      onClick={retryGPS}
                      className="mt-2 bg-red-500 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-red-600"
                    >
                      Try Again
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Map pin option — Leaflet map picker */}
            {locationMethod === 'map' && (
              <div className="bg-gray-50 rounded-xl p-5 space-y-3">
                <p className="text-xs text-gray-400">
                  Click the map or drag the marker to set your farm's exact location.
                </p>
                <MapPicker
                  initialLat={
                    formData.district && DISTRICT_COORDINATES[formData.district]
                      ? DISTRICT_COORDINATES[formData.district].latitude
                      : -1.9403
                  }
                  initialLng={
                    formData.district && DISTRICT_COORDINATES[formData.district]
                      ? DISTRICT_COORDINATES[formData.district].longitude
                      : 29.8739
                  }
                  onLocationSelect={(lat, lng) => {
                    if (lat && lng) {
                      setManualLat(String(lat));
                      setManualLng(String(lng));
                      setManualSaved(true);
                    } else {
                      setManualLat('');
                      setManualLng('');
                      setManualSaved(false);
                    }
                  }}
                  height="300px"
                />
                {manualSaved && (
                  <div className="p-3 bg-green-50 rounded-xl">
                    <p className="text-xs font-bold text-green-700">✅ Location pinned</p>
                    <p className="text-xs text-green-600">
                      {parseFloat(manualLat).toFixed(6)}, {parseFloat(manualLng).toFixed(6)}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* District fallback */}
            {locationMethod === 'district' && (
              <div className="bg-gray-50 rounded-xl p-5">
                <p className="text-xs text-gray-400 mb-3">
                  Uses district center coordinates. Less accurate than GPS or map pin.
                </p>
                {formData.district ? (
                  <div className="p-3 bg-green-50 rounded-xl">
                    <CheckCircle size={15} className="inline text-green-600 mr-1.5" />
                    <span className="text-sm font-bold text-green-700">{formData.district}</span>
                    <p className="text-xs text-green-500 mt-1">
                      {DISTRICT_COORDINATES[formData.district]?.latitude}, {DISTRICT_COORDINATES[formData.district]?.longitude}
                    </p>
                  </div>
                ) : (
                  <div className="p-3 bg-amber-50 rounded-xl">
                    <AlertTriangle size={15} className="inline text-amber-500 mr-1.5" />
                    <span className="text-sm text-amber-700">Select a district above first</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-green-600 text-white py-4 rounded-2xl font-black text-sm hover:bg-green-700 transition-all disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
          >
            {submitting ? 'Registering...' : 'Register Farm'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddFarmForm;