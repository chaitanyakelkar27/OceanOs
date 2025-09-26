import { useQuery } from "@tanstack/react-query";
import { api } from "@/api/api";
import { useUIStore } from "@/stores/ui";
import { MapContainer, TileLayer, Marker, Popup, Circle, Polyline } from 'react-leaflet';
import { Icon, LatLng } from 'leaflet';
import { useState, useMemo } from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Thermometer, Fish, Waves, AlertTriangle, Eye, EyeOff } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in Leaflet with Vite
delete (Icon.Default.prototype as any)._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Different marker icons for different types
const fishIcon = new Icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const tempIcon = new Icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg width="25" height="41" viewBox="0 0 25 41" xmlns="http://www.w3.org/2000/svg">
      <path fill="#ff6b35" d="M12.5 0C5.596 0 0 5.596 0 12.5c0 12.5 12.5 28.5 12.5 28.5S25 25 25 12.5C25 5.596 19.404 0 12.5 0z"/>
      <circle cx="12.5" cy="12.5" r="6" fill="white"/>
      <text x="12.5" y="16" text-anchor="middle" fill="#ff6b35" font-size="8">T</text>
    </svg>
  `),
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const alertIcon = new Icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg width="25" height="41" viewBox="0 0 25 41" xmlns="http://www.w3.org/2000/svg">
      <path fill="#dc2626" d="M12.5 0C5.596 0 0 5.596 0 12.5c0 12.5 12.5 28.5 12.5 28.5S25 25 25 12.5C25 5.596 19.404 0 12.5 0z"/>
      <path fill="white" d="M10 8h5l-1 8h-3l-1-8zM12.5 20a2 2 0 100-4 2 2 0 000 4z"/>
    </svg>
  `),
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

export default function MapExplorer() {
  const { bbox, speciesId, dateRange, toggleCommunityReports, communityReports, setBBox } = useUIStore();
  const [selectedSpecies, setSelectedSpecies] = useState<string>("");
  const [dateFilter, setDateFilter] = useState({ start: "", end: "" });
  const [showTemperature, setShowTemperature] = useState(true);
  const [showMigration, setShowMigration] = useState(true);
  const [showAlerts, setShowAlerts] = useState(true);
  const [selectedObservation, setSelectedObservation] = useState<any>(null);
  
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

  // Enhanced ocean data with more points across Indian waters
  const temperatureData = [
    { id: 1, lat: 19.0760, lng: 72.8777, temp: 28.5, status: 'normal', location: 'Mumbai Coast' },
    { id: 2, lat: 11.2588, lng: 75.7139, temp: 29.2, status: 'warm', location: 'Kochi Waters' },
    { id: 3, lat: 13.0827, lng: 80.2707, temp: 27.8, status: 'normal', location: 'Chennai Bay' },
    { id: 4, lat: 15.2993, lng: 74.1240, temp: 30.1, status: 'hot', location: 'Goa Coast' },
    { id: 5, lat: 23.0225, lng: 69.6293, temp: 26.2, status: 'cool', location: 'Gujarat Waters' },
    { id: 6, lat: 22.5726, lng: 88.3639, temp: 28.9, status: 'normal', location: 'Kolkata Port' },
    { id: 7, lat: 17.6868, lng: 83.2185, temp: 29.5, status: 'warm', location: 'Visakhapatnam' },
    { id: 8, lat: 8.5241, lng: 76.9366, temp: 29.8, status: 'warm', location: 'Thiruvananthapuram' },
    { id: 9, lat: 12.2958, lng: 74.7875, temp: 28.1, status: 'normal', location: 'Mangalore Coast' },
    { id: 10, lat: 21.1702, lng: 72.8311, temp: 27.5, status: 'normal', location: 'Surat Waters' },
  ];

  // Migration routes for different species
  const migrationRoutes = [
    {
      species: 'Hilsa Shad',
      color: '#3b82f6',
      path: [
        [22.5726, 88.3639], // Kolkata
        [21.2787, 81.8661], // Central Bay
        [18.1716, 83.9567], // Visakhapatnam
        [13.0827, 80.2707], // Chennai
        [11.2588, 75.7139], // Kochi
      ] as [number, number][]
    },
    {
      species: 'Indian Mackerel',
      color: '#10b981',
      path: [
        [23.0225, 69.6293], // Gujarat
        [19.0760, 72.8777], // Mumbai
        [15.2993, 74.1240], // Goa
        [12.2958, 74.7875], // Mangalore
      ] as [number, number][]
    },
    {
      species: 'Oil Sardine',
      color: '#f59e0b',
      path: [
        [11.2588, 75.7139], // Kochi
        [12.2958, 74.7875], // Mangalore
        [15.2993, 74.1240], // Goa
        [19.0760, 72.8777], // Mumbai
      ] as [number, number][]
    }
  ];  // Environmental alerts
  const environmentalAlerts = [
    { id: 1, lat: 15.2993, lng: 74.1240, type: 'temperature', severity: 'high', message: 'Ocean temperature 3°C above normal' },
    { id: 2, lat: 11.2588, lng: 75.7139, type: 'overfishing', severity: 'medium', message: 'Sardine catch exceeds sustainable limits' },
    { id: 3, lat: 22.5726, lng: 88.3639, type: 'pollution', severity: 'high', message: 'Industrial runoff detected' },
    { id: 4, lat: 17.6868, lng: 83.2185, type: 'weather', severity: 'low', message: 'Favorable fishing conditions' },
  ];

  // Temperature zone circles
  const temperatureZones = useMemo(() => {
    return temperatureData.map(point => ({
      ...point,
      radius: point.status === 'hot' ? 50000 : point.status === 'warm' ? 30000 : 20000,
      color: point.status === 'hot' ? '#dc2626' : 
             point.status === 'warm' ? '#f59e0b' : 
             point.status === 'cool' ? '#3b82f6' : '#10b981'
    }));
  }, []);

  // Filter observations based on selected species
  const filteredObservations = useMemo(() => {
    if (!data?.features) return [];
    return data.features.filter((feature: any) => 
      !selectedSpecies || feature.properties.species_id === selectedSpecies
    );
  }, [data?.features, selectedSpecies]);

  return (
    <div className="grid grid-rows-[auto_1fr] gap-3">
      <div className="rounded-md border bg-card p-4">
        {/* Main Filters */}
        <div className="flex flex-wrap items-center gap-3 text-sm mb-4">
          <span className="text-foreground/70 font-medium">Species Filter:</span>
          <select 
            value={selectedSpecies}
            onChange={(e) => setSelectedSpecies(e.target.value)}
            className="rounded border px-3 py-2 bg-background min-w-[140px]"
          >
            <option value="">All Species</option>
            <option value="sp_1">Yellowfin Tuna</option>
            <option value="sp_2">Indian Mackerel</option>
            <option value="sp_3">Oil Sardine</option>
            <option value="sp_4">Silver Pomfret</option>
            <option value="sp_5">Bombay Duck</option>
          </select>
          
          <span className="text-foreground/70 font-medium ml-4">Date Range:</span>
          <input 
            type="date" 
            value={dateFilter.start}
            onChange={(e) => setDateFilter({...dateFilter, start: e.target.value})}
            className="rounded border px-3 py-2 bg-background"
          />
          <span className="text-foreground/70">to</span>
          <input 
            type="date"
            value={dateFilter.end} 
            onChange={(e) => setDateFilter({...dateFilter, end: e.target.value})}
            className="rounded border px-3 py-2 bg-background"
          />
        </div>

        {/* Layer Controls */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <span className="text-foreground/70 font-medium">Map Layers:</span>
          <Button
            variant={showTemperature ? "default" : "outline"}
            size="sm"
            onClick={() => setShowTemperature(!showTemperature)}
            className="text-xs"
          >
            <Thermometer className="w-3 h-3 mr-1" />
            Temperature {showTemperature ? <Eye className="w-3 h-3 ml-1" /> : <EyeOff className="w-3 h-3 ml-1" />}
          </Button>
          <Button
            variant={showMigration ? "default" : "outline"}
            size="sm"
            onClick={() => setShowMigration(!showMigration)}
            className="text-xs"
          >
            <Fish className="w-3 h-3 mr-1" />
            Migration Routes {showMigration ? <Eye className="w-3 h-3 ml-1" /> : <EyeOff className="w-3 h-3 ml-1" />}
          </Button>
          <Button
            variant={showAlerts ? "default" : "outline"}
            size="sm"
            onClick={() => setShowAlerts(!showAlerts)}
            className="text-xs"
          >
            <AlertTriangle className="w-3 h-3 mr-1" />
            Environmental Alerts {showAlerts ? <Eye className="w-3 h-3 ml-1" /> : <EyeOff className="w-3 h-3 ml-1" />}
          </Button>
          <Button
            variant={communityReports ? "default" : "outline"}
            size="sm"
            onClick={toggleCommunityReports}
            className="text-xs"
          >
            <Waves className="w-3 h-3 mr-1" />
            Community Reports
          </Button>
        </div>

        {/* Stats Bar */}
        <div className="flex justify-between items-center pt-2 border-t">
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span>{filteredObservations.length} Fish Observations</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-orange-500"></div>
              <span>{temperatureData.length} Temperature Sensors</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span>{environmentalAlerts.length} Active Alerts</span>
            </div>
          </div>
          <div className="text-xs text-foreground/60">
            {isLoading ? "Loading..." : "Live Data"}
          </div>
        </div>
      </div>

      <div className="min-h-[75vh] rounded-xl border overflow-hidden">
        <MapContainer
          center={[18.5937, 78.9629]} // Adjusted for better India view
          zoom={6}
          style={{ height: '100%', width: '100%' }}
          className="rounded-xl"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {/* Temperature Zone Circles */}
          {showTemperature && temperatureZones.map((zone, idx) => (
            <Circle
              key={`zone-${idx}`}
              center={[zone.lat, zone.lng]}
              radius={zone.radius}
              pathOptions={{
                color: zone.color,
                fillColor: zone.color,
                fillOpacity: 0.1,
                weight: 2,
              }}
            />
          ))}
          
          {/* Temperature Sensor Markers */}
          {showTemperature && temperatureData.map((point, idx) => (
            <Marker 
              key={`temp-${idx}`}
              position={[point.lat, point.lng]}
              icon={tempIcon}
            >
              <Popup>
                <div className="text-sm min-w-[200px]">
                  <div className="flex items-center gap-2 mb-2">
                    <Thermometer className="w-4 h-4 text-orange-500" />
                    <strong>Ocean Temperature Sensor</strong>
                  </div>
                  <div className="space-y-1">
                    <div><strong>Location:</strong> {point.location}</div>
                    <div><strong>Temperature:</strong> 
                      <Badge className={`ml-2 ${
                        point.status === 'hot' ? 'bg-red-100 text-red-800' :
                        point.status === 'warm' ? 'bg-orange-100 text-orange-800' :
                        point.status === 'cool' ? 'bg-blue-100 text-blue-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {point.temp}°C
                      </Badge>
                    </div>
                    <div><strong>Status:</strong> 
                      <Badge className={`ml-2 ${
                        point.status === 'hot' ? 'bg-red-500 text-white' :
                        point.status === 'warm' ? 'bg-orange-500 text-white' :
                        point.status === 'cool' ? 'bg-blue-500 text-white' :
                        'bg-green-500 text-white'
                      }`}>
                        {point.status.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="text-xs text-gray-600 mt-2">
                      Coordinates: {point.lat.toFixed(3)}, {point.lng.toFixed(3)}
                    </div>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}

          {/* Migration Routes */}
          {showMigration && migrationRoutes.map((route, idx) => (
            <Polyline
              key={`route-${idx}`}
              positions={route.path}
              pathOptions={{
                color: route.color,
                weight: 3,
                opacity: 0.8,
                dashArray: '10, 10'
              }}
            >
              <Popup>
                <div className="text-sm">
                  <div className="flex items-center gap-2 mb-1">
                    <Fish className="w-4 h-4" style={{color: route.color}} />
                    <strong>{route.species} Migration Route</strong>
                  </div>
                  <div className="text-xs text-gray-600">
                    Typical seasonal migration pattern based on water temperature and food availability
                  </div>
                </div>
              </Popup>
            </Polyline>
          ))}

          {/* Environmental Alerts */}
          {showAlerts && environmentalAlerts.map((alert, idx) => (
            <Marker
              key={`alert-${idx}`}
              position={[alert.lat, alert.lng]}
              icon={alertIcon}
            >
              <Popup>
                <div className="text-sm min-w-[250px]">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-4 h-4 text-red-500" />
                    <strong>Environmental Alert</strong>
                    <Badge className={`ml-2 ${
                      alert.severity === 'high' ? 'bg-red-500 text-white' :
                      alert.severity === 'medium' ? 'bg-orange-500 text-white' :
                      'bg-blue-500 text-white'
                    }`}>
                      {alert.severity.toUpperCase()}
                    </Badge>
                  </div>
                  <div><strong>Type:</strong> {alert.type.charAt(0).toUpperCase() + alert.type.slice(1)}</div>
                  <div><strong>Message:</strong> {alert.message}</div>
                  <div className="text-xs text-gray-600 mt-2">
                    Action required: {alert.severity === 'high' ? 'Immediate response needed' : 
                                    alert.severity === 'medium' ? 'Monitor closely' : 'Advisory only'}
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
          
          {/* Fish Observation Markers */}
          {filteredObservations.map((feature: any, idx: number) => (
            <Marker
              key={feature.id || idx}
              position={[
                feature.geometry.coordinates[1],
                feature.geometry.coordinates[0]
              ]}
              icon={fishIcon}
              eventHandlers={{
                click: () => setSelectedObservation(feature),
              }}
            >
              <Popup>
                <div className="text-sm max-w-xs">
                  <div className="flex items-center gap-2 mb-2">
                    <Fish className="w-4 h-4 text-blue-500" />
                    <strong className="text-primary">Fish Observation</strong>
                  </div>
                  <div className="space-y-1">
                    <div><strong>Species:</strong> {feature.properties.species_name || 'Unknown'}</div>
                    <div><strong>Date:</strong> {new Date(feature.properties.observed_at).toLocaleDateString()}</div>
                    <div><strong>Recorded by:</strong> {feature.properties.recorded_by}</div>
                    {feature.properties.validated_by && (
                      <div><strong>Validated by:</strong> {feature.properties.validated_by}</div>
                    )}
                    {feature.properties.temperature && (
                      <div><strong>Water Temp:</strong> {feature.properties.temperature}°C</div>
                    )}
                    {feature.properties.depth && (
                      <div><strong>Depth:</strong> {feature.properties.depth}m</div>
                    )}
                  </div>
                  <div className="mt-3 flex gap-2">
                    <Badge className="bg-green-100 text-green-800">
                      ✓ Verified
                    </Badge>
                    {communityReports && (
                      <Badge className="bg-blue-100 text-blue-800">
                        Community Report
                      </Badge>
                    )}
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Info Panel */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-card rounded-lg border">
        <div className="text-center">
          <div className="text-2xl font-bold text-primary">{data?.features?.length || 0}</div>
          <div className="text-sm text-foreground/70">Fish Observations</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">{temperatureData.length}</div>
          <div className="text-sm text-foreground/70">Temperature Sensors</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">
            {data?.features?.filter((f: any) => f.properties.validated_by).length || 0}
          </div>
          <div className="text-sm text-foreground/70">Validated Records</div>
        </div>
      </div>
    </div>
  );
}