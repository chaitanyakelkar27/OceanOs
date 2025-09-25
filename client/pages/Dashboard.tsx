import { useQuery } from "@tanstack/react-query";
import { api, type StatsResponse } from "@/api/api";
import { Link } from "react-router-dom";
import { CuratorNote } from "@/components/CuratorNote";
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, TrendingDown, AlertTriangle, Waves, Fish, Thermometer } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Mock real-time ocean data
const oceanHealthData = [
  { month: 'Jan', temperature: 24.5, ph: 8.1, salinity: 35.2, fishCatch: 1250 },
  { month: 'Feb', temperature: 25.1, ph: 8.0, salinity: 35.4, fishCatch: 1180 },
  { month: 'Mar', temperature: 26.2, ph: 7.9, salinity: 35.1, fishCatch: 1320 },
  { month: 'Apr', temperature: 27.8, ph: 7.8, salinity: 35.6, fishCatch: 980 },
  { month: 'May', temperature: 28.5, ph: 7.7, salinity: 35.8, fishCatch: 850 },
  { month: 'Jun', temperature: 29.1, ph: 7.6, salinity: 36.0, fishCatch: 720 }
];

const speciesDistribution = [
  { name: 'Tuna', value: 35, color: '#0088FE' },
  { name: 'Mackerel', value: 28, color: '#00C49F' },
  { name: 'Sardine', value: 22, color: '#FFBB28' },
  { name: 'Pomfret', value: 10, color: '#FF8042' },
  { name: 'Others', value: 5, color: '#8884d8' }
];

const recentAlerts = [
  { type: 'warning', message: 'Ocean temperature 2°C above normal in Mumbai waters', time: '2 hours ago', severity: 'medium' },
  { type: 'info', message: 'Sardine population recovered 15% in Kerala coast', time: '4 hours ago', severity: 'low' },
  { type: 'alert', message: 'Overfishing detected in Gujarat fishing zones', time: '6 hours ago', severity: 'high' },
  { type: 'info', message: 'New tuna migration route identified via satellite tracking', time: '1 day ago', severity: 'low' }
];

export default function Dashboard() {
  const { data: stats } = useQuery({
    queryKey: ["stats"],
    queryFn: async () => (await api.get<StatsResponse>("/stats")).data,
  });

  // Mock real-time activity data
  const { data: realtimeData } = useQuery({
    queryKey: ["realtime-activity"],
    queryFn: async () => {
      // Simulate API call with realistic marine data
      return {
        recentObservations: [
          { species: 'Yellowfin Tuna school', location: 'Mumbai offshore', time: '12 min ago', validated: true },
          { species: 'Indian Mackerel catch', location: 'Kochi fishing port', time: '25 min ago', validated: true },
          { species: 'Oil Sardine migration', location: 'Mangalore coast', time: '1 hr ago', validated: false },
          { species: 'Pomfret juvenile sighting', location: 'Goa waters', time: '2 hrs ago', validated: true },
        ],
        ecosystemHealth: {
          status: 'moderate',
          temperature: { value: 29.1, trend: 'up', alert: true },
          ph: { value: 7.6, trend: 'down', alert: true },
          fishStock: { value: 72, trend: 'down', alert: false }
        }
      };
    },
    refetchInterval: 30000 // Refresh every 30 seconds
  });

  const getAlertIcon = (type: string, severity: string) => {
    if (severity === 'high') return <AlertTriangle className="w-4 h-4 text-red-500" />;
    if (type === 'warning') return <Thermometer className="w-4 h-4 text-orange-500" />;
    return <Fish className="w-4 h-4 text-blue-500" />;
  };

  const getAlertBadge = (severity: string) => {
    const colors = {
      high: 'bg-red-100 text-red-800',
      medium: 'bg-orange-100 text-orange-800', 
      low: 'bg-blue-100 text-blue-800'
    };
    return <Badge className={colors[severity as keyof typeof colors]}>{severity.toUpperCase()}</Badge>;
  };

  return (
    <div className="space-y-8">
      <header className="rounded-xl bg-card p-8 shadow-sm ring-1 ring-border">
        <h1 className="text-3xl md:text-4xl font-serif tracking-tight">OceanOS — AI-Powered Marine Intelligence Platform</h1>
        <p className="mt-3 max-w-3xl text-foreground/80">
          Real-time ocean monitoring, AI-driven species identification, and sustainable fishing insights. 
          Integrating fisheries data, biodiversity observations, and sensor networks across Indian waters.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link to="/map" className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-primary-foreground shadow hover:bg-primary/90">
            <Waves className="w-4 h-4 mr-2" />
            Ocean Map Explorer
          </Link>
          <Link to="/modules/taxonomy" className="inline-flex items-center rounded-md bg-secondary px-4 py-2 hover:bg-secondary/80">
            <Fish className="w-4 h-4 mr-2" />
            AI Species ID
          </Link>
          <Link to="/upload" className="inline-flex items-center rounded-md border px-4 py-2 hover:bg-secondary">Upload Dataset</Link>
        </div>
      </header>

      {/* Enhanced Stats with Trends */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard 
          label="Total Observations" 
          value={stats?.totals.observations ?? 1247} 
          trend={12}
          icon={<Fish className="w-5 h-5 text-primary" />}
        />
        <StatCard 
          label="Species Identified" 
          value={stats?.totals.species ?? 89} 
          trend={5}
          icon={<Fish className="w-5 h-5 text-green-600" />}
        />
        <StatCard 
          label="Active Sensors" 
          value={stats?.totals.uploads ?? 24} 
          trend={-2}
          icon={<Waves className="w-5 h-5 text-blue-600" />}
        />
        <StatCard 
          label="Data Points Today" 
          value={15420} 
          trend={8}
          icon={<TrendingUp className="w-5 h-5 text-purple-600" />}
        />
      </section>

      {/* Ocean Health Charts */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Thermometer className="w-5 h-5" />
              Ocean Temperature & pH Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={oceanHealthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="temp" orientation="left" />
                <YAxis yAxisId="ph" orientation="right" />
                <Tooltip />
                <Line yAxisId="temp" type="monotone" dataKey="temperature" stroke="#ff7300" strokeWidth={2} name="Temperature (°C)" />
                <Line yAxisId="ph" type="monotone" dataKey="ph" stroke="#0088fe" strokeWidth={2} name="pH Level" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Fish className="w-5 h-5" />
              Fish Catch Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={oceanHealthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="fishCatch" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} name="Fish Catch (tons)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </section>

      {/* Species Distribution and Alerts */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Species Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={speciesDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  dataKey="value"
                >
                  {speciesDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
              {speciesDistribution.map((entry, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }}></div>
                  <span>{entry.name}: {entry.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Real-Time Activity Feed</span>
                <span className="text-xs text-foreground/60">
                  Last updated: {new Date().toLocaleTimeString()}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {realtimeData?.recentObservations.map((obs, i) => (
                  <li key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                    <div className="flex items-center gap-3">
                      <Fish className="w-4 h-4 text-primary" />
                      <div>
                        <span className="font-medium">{obs.species}</span>
                        <p className="text-sm text-foreground/70">{obs.location}</p>
                      </div>
                    </div>
                    <div className="text-right text-xs">
                      <div className="text-foreground/60">{obs.time}</div>
                      {obs.validated && <span className="text-green-600">✓ Verified</span>}
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Ecosystem Health Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-500" />
            Marine Ecosystem Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-orange-50">
              <Thermometer className="w-8 h-8 text-orange-500" />
              <div>
                <p className="text-sm text-foreground/70">Ocean Temp</p>
                <p className="text-xl font-bold">29.1°C</p>
                <p className="text-xs text-orange-600">↑ 2°C above normal</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-red-50">
              <Waves className="w-8 h-8 text-red-500" />
              <div>
                <p className="text-sm text-foreground/70">pH Level</p>
                <p className="text-xl font-bold">7.6</p>
                <p className="text-xs text-red-600">↓ Acidification risk</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-50">
              <Fish className="w-8 h-8 text-blue-500" />
              <div>
                <p className="text-sm text-foreground/70">Fish Stock</p>
                <p className="text-xl font-bold">72%</p>
                <p className="text-xs text-blue-600">↓ Declining trend</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-green-50">
              <TrendingUp className="w-8 h-8 text-green-500" />
              <div>
                <p className="text-sm text-foreground/70">Biodiversity</p>
                <p className="text-xl font-bold">Good</p>
                <p className="text-xs text-green-600">89 species active</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            {recentAlerts.map((alert, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center gap-3">
                  {getAlertIcon(alert.type, alert.severity)}
                  <div>
                    <p className="font-medium">{alert.message}</p>
                    <p className="text-sm text-foreground/70">{alert.time}</p>
                  </div>
                </div>
                {getAlertBadge(alert.severity)}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI Modules Quick Access */}
      <section>
        <h2 className="font-serif text-2xl mb-4">AI-Powered Analysis Tools</h2>
        <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
          <QuickCard 
            title="Species Identification" 
            to="/modules/taxonomy" 
            subtitle="AI-powered fish classification with 92% accuracy"
            badge="New AI Model"
          />
          <QuickCard 
            title="Ocean Map Explorer" 
            to="/map" 
            subtitle="Real-time fish distribution and environmental data"
            badge="Live Data"
          />
          <QuickCard 
            title="Sustainable Fishing" 
            to="/modules/recommendations" 
            subtitle="AI recommendations for responsible fishing practices"
            badge="Beta"
          />
        </div>
      </section>

      {/* Legacy sections for curator notes */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 rounded-xl border bg-card p-4">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-xl">Recent Curator Activity</h2>
            <span className="text-xs text-foreground/60">Updated 5 min ago</span>
          </div>
          <ul className="mt-3 divide-y">
            <li className="py-3 flex items-center justify-between">
              <span>Yellowfin Tuna identification approved (Mumbai offshore)</span>
              <span className="text-xs text-foreground/60">15 min ago</span>
            </li>
            <li className="py-3 flex items-center justify-between">
              <span>New sardine migration pattern validated</span>
              <span className="text-xs text-foreground/60">32 min ago</span>
            </li>
            <li className="py-3 flex items-center justify-between">
              <span>Community report flagged for review</span>
              <span className="text-xs text-foreground/60">1 hr ago</span>
            </li>
          </ul>
        </div>
        <div className="rounded-xl border bg-card p-4">
          <h2 className="font-serif text-xl">Curator's Corner</h2>
          <div className="mt-3">
            <CuratorNote author="Dr. C. Marin">
              Ocean temperatures are showing unusual warming patterns. Focus collection efforts on temperature-sensitive species like sardines and mackerel in the next two weeks.
            </CuratorNote>
          </div>
          <div className="mt-4 text-sm text-foreground/70">
            💡 Tip: Use the AI species identification for faster processing - current accuracy is 92% for common Indian Ocean species.
          </div>
        </div>
      </section>
    </div>
  );
}

function StatCard({ label, value, trend, icon }: { label: string; value: number; trend?: number; icon?: React.ReactNode }) {
  return (
    <div className="rounded-xl border bg-card p-6">
      <div className="flex items-center justify-between">
        <div className="text-sm text-foreground/70">{label}</div>
        {icon}
      </div>
      <div className="mt-2 flex items-baseline gap-2">
        <div className="text-3xl font-serif">{value.toLocaleString()}</div>
        {trend && (
          <div className={`flex items-center text-sm ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {trend > 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            {Math.abs(trend)}%
          </div>
        )}
      </div>
    </div>
  );
}

function QuickCard({ title, subtitle, to, badge }: { title: string; subtitle: string; to: string; badge?: string }) {
  return (
    <Link to={to} className="rounded-xl border bg-card p-5 block hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-2">
        <div className="font-serif text-lg">{title}</div>
        {badge && <Badge variant="secondary" className="text-xs">{badge}</Badge>}
      </div>
      <div className="text-sm text-foreground/70">{subtitle}</div>
    </Link>
  );
}