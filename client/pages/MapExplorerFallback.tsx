import { useQuery } from "@tanstack/react-query";
import { api } from "@/api/api";
import { useUIStore } from "@/stores/ui";

export default function MapExplorerFallback() {
  const { toggleCommunityReports, communityReports } = useUIStore();
  
  const { data, isLoading } = useQuery({
    queryKey: ["geospatial"],
    queryFn: async () => {
      const { data } = await api.get("/observations/geospatial");
      return data;
    },
  });

  return (
    <div className="space-y-6">
      <div className="rounded-md border bg-card p-4">
        <h2 className="text-xl font-serif mb-3">Ocean Map Explorer</h2>
        <p className="text-foreground/70 mb-4">
          Interactive map showing real-time marine observations, temperature data, and species distribution across Indian coastal waters.
        </p>
        
        <div className="flex flex-wrap items-center gap-3 text-sm mb-4">
          <span className="text-foreground/70">Filters:</span>
          <select className="rounded border px-2 py-1 bg-background">
            <option value="">All Species</option>
            <option value="sp_1">Yellowfin Tuna</option>
            <option value="sp_2">Mackerel</option>
            <option value="sp_3">Sardine</option>
          </select>
          <button 
            className={`rounded border px-2 py-1 hover:bg-secondary ${communityReports ? 'bg-primary text-primary-foreground' : ''}`}
            onClick={toggleCommunityReports}
          >
            {communityReports ? "Community Reports ON" : "Community Reports OFF"}
          </button>
        </div>
      </div>

      {/* Map Placeholder with Data */}
      <div className="min-h-[70vh] rounded-xl border bg-gradient-to-br from-blue-50 to-cyan-50 flex flex-col">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4 max-w-lg">
            <div className="w-20 h-20 mx-auto bg-primary/20 rounded-full flex items-center justify-center">
              <svg className="w-10 h-10 text-primary" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-xl font-serif">Interactive Ocean Map</h3>
            <p className="text-foreground/70">
              Showing {data?.features?.length || 0} fish observations across Indian coastal waters.
              Map includes temperature layers, species distribution, and real-time sensor data.
            </p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-white/60 rounded-lg p-3">
                <div className="font-semibold text-blue-600">🌊 Ocean Data</div>
                <div>Temperature monitoring</div>
                <div>pH levels & salinity</div>
              </div>
              <div className="bg-white/60 rounded-lg p-3">
                <div className="font-semibold text-green-600">🐟 Marine Life</div>
                <div>Species identification</div>
                <div>Migration patterns</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Data Summary */}
        <div className="border-t bg-white/80 p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-primary">{data?.features?.length || 0}</div>
              <div className="text-sm text-foreground/70">Total Observations</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">3</div>
              <div className="text-sm text-foreground/70">Temperature Sensors</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">
                {data?.features?.filter((f: any) => f.properties.validated_by).length || 0}
              </div>
              <div className="text-sm text-foreground/70">Validated Records</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600">
                {isLoading ? "..." : "Live"}
              </div>
              <div className="text-sm text-foreground/70">Data Status</div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Observations List */}
      <div className="rounded-xl border bg-card p-4">
        <h3 className="text-lg font-serif mb-3">Recent Marine Observations</h3>
        <div className="space-y-2">
          {data?.features?.slice(0, 5).map((feature: any, idx: number) => (
            <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🐟</span>
                <div>
                  <div className="font-medium">{feature.properties.species_name}</div>
                  <div className="text-sm text-foreground/70">
                    {feature.properties.recorded_by} • {new Date(feature.properties.observed_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
              <div className="text-right text-sm">
                <div>Lat: {feature.geometry.coordinates[1].toFixed(2)}</div>
                <div>Lng: {feature.geometry.coordinates[0].toFixed(2)}</div>
                {feature.properties.validated_by && (
                  <span className="text-green-600">✓ Verified</span>
                )}
              </div>
            </div>
          )) || (
            <div className="text-center text-foreground/50 py-8">
              {isLoading ? "Loading observations..." : "No observations available"}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}