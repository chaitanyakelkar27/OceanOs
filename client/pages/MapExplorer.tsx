import { useQuery } from "@tanstack/react-query";
import { api } from "@/api/api";
import { useUIStore } from "@/stores/ui";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import { Icon, LatLngBounds } from 'leaflet';
import { useCallback, useState } from 'react';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in Leaflet with Vite
delete (Icon.Default.prototype as any)._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Custom fish observation marker
const fishIcon = new Icon({
  iconUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iIzJkNjNkZiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTMgNmgxOHYxMkg5di00aDZ2MlptLTItMnY0aDJ2LTRIM3oiLz4KPC9zdmc+',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

function MapEventHandler() {
  const { setBBox } = useUIStore();
  
  useMapEvents({
    moveend: function () {
      const bounds = this.getBounds();
      const bbox: [number, number, number, number] = [
        bounds.getWest(),
        bounds.getSouth(), 
        bounds.getEast(),
        bounds.getNorth()
      ];
      setBBox(bbox);
    }
  });
  
  return null;
}

export default function MapExplorer() {
  const { bbox, speciesId, dateRange, toggleCommunityReports, communityReports } = useUIStore();
  const [selectedSpecies, setSelectedSpecies] = useState<string>("");
  const [dateFilter, setDateFilter] = useState({ start: "", end: "" });
  
  const { data, isLoading } = useQuery({
    queryKey: ["geospatial", bbox, speciesId, dateRange],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (bbox) params.set("bbox", bbox.join(","));
      if (speciesId) params.set("speciesId", speciesId);
      if (dateRange.start) params.set("start", dateRange.start);
      if (dateRange.end) params.set("end", dateRange.end);
      const { data } = await api.get("/observations/geospatial?" + params.toString());
      return data;
    },
  });

  // Sample ocean temperature layer data (mock for demo)
  const temperatureData = [
    { lat: 37.7, lng: -122.4, temp: 18.5, color: "#4facfe" },
    { lat: 40.5, lng: -70.0, temp: 22.1, color: "#00f2fe" },
    { lat: 35.2, lng: -75.8, temp: 24.3, color: "#43e97b" },
  ];

  return (
    <div className="grid grid-rows-[auto_1fr] gap-3">
      <div className="rounded-md border bg-card p-3">
        <div className="flex flex-wrap items-center gap-3 text-sm mb-3">
          <span className="text-foreground/70">Filters:</span>
          <select 
            value={selectedSpecies}
            onChange={(e) => setSelectedSpecies(e.target.value)}
            className="rounded border px-2 py-1 bg-background"
          >
            <option value="">All Species</option>
            <option value="sp_1">Yellowfin Tuna</option>
            <option value="sp_2">Mackerel</option>
            <option value="sp_3">Sardine</option>
          </select>
          <input 
            type="date" 
            value={dateFilter.start}
            onChange={(e) => setDateFilter({...dateFilter, start: e.target.value})}
            className="rounded border px-2 py-1 bg-background text-xs"
            placeholder="Start Date"
          />
          <input 
            type="date"
            value={dateFilter.end} 
            onChange={(e) => setDateFilter({...dateFilter, end: e.target.value})}
            className="rounded border px-2 py-1 bg-background text-xs"
            placeholder="End Date"
          />
          <button 
            className={`rounded border px-2 py-1 hover:bg-secondary ${communityReports ? 'bg-primary text-primary-foreground' : ''}`}
            onClick={toggleCommunityReports}
          >
            {communityReports ? "Community Reports ON" : "Community Reports OFF"}
          </button>
        </div>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4 text-xs text-foreground/60">
            <span>🌊 Ocean Temperature Layer</span>
            <span>🐟 Fish Observations</span>
            <span>📡 Sensor Data</span>
          </div>
          <div className="text-xs text-foreground/60">
            {isLoading ? "Loading ocean data..." : `${data?.features?.length ?? 0} observations`}
          </div>
        </div>
      </div>

      <div className="min-h-[70vh] rounded-xl border overflow-hidden">
        <MapContainer
          center={[20.5937, 78.9629]} // India's center coordinates
          zoom={5}
          style={{ height: '100%', width: '100%' }}
          className="rounded-xl"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          <MapEventHandler />
          
          {/* Ocean Temperature Markers */}
          {temperatureData.map((point, idx) => (
            <Marker 
              key={`temp-${idx}`}
              position={[point.lat, point.lng]}
              icon={new Icon({
                iconUrl: `data:image/svg+xml;base64,${btoa(`
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="${point.color}" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="8" fill="${point.color}" opacity="0.7"/>
                    <text x="12" y="16" text-anchor="middle" fill="white" font-size="10">${point.temp}°</text>
                  </svg>
                `)}`,
                iconSize: [24, 24],
                iconAnchor: [12, 12],
              })}
            >
              <Popup>
                <div className="text-sm">
                  <strong>Ocean Temperature</strong><br/>
                  Temperature: {point.temp}°C<br/>
                  Location: {point.lat.toFixed(2)}, {point.lng.toFixed(2)}
                </div>
              </Popup>
            </Marker>
          ))}
          
          {/* Fish Observation Markers */}
          {data?.features?.map((feature: any, idx: number) => (
            <Marker
              key={feature.id || idx}
              position={[
                feature.geometry.coordinates[1],
                feature.geometry.coordinates[0]
              ]}
              icon={fishIcon}
            >
              <Popup>
                <div className="text-sm max-w-xs">
                  <strong className="text-primary">Fish Observation</strong><br/>
                  <strong>Species:</strong> {feature.properties.species_name || 'Unknown'}<br/>
                  <strong>Date:</strong> {new Date(feature.properties.observed_at).toLocaleDateString()}<br/>
                  <strong>Recorded by:</strong> {feature.properties.recorded_by}<br/>
                  {feature.properties.validated_by && (
                    <><strong>Validated by:</strong> {feature.properties.validated_by}<br/></>
                  )}
                  <div className="mt-2">
                    <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                      Verified Observation
                    </span>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}
