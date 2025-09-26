import { useQuery } from "@tanstack/react-query";
import { api, type StatsResponse } from "@/api/api";
import { Link } from "react-router-dom";
import { CuratorNote } from "@/components/CuratorNote";
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, TrendingDown, AlertTriangle, Waves, Fish, Thermometer, FileCheck, Upload, Users, MapPin, BarChart3 } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/auth";
import { AuthenticatedOnly } from "@/components/ProtectedRoute";

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
    <div className="min-h-screen bg-gov-light space-y-8 p-8">
      <header className="card-gov-elevated shadow-lg">
        <div className="p-8">
          <h1 className="text-3xl md:text-4xl font-serif text-gray-900 mb-4">
            OceanOS — Marine Intelligence Platform
          </h1>
          <p className="max-w-4xl text-gray-600 text-lg leading-relaxed mb-8">
            Comprehensive marine data management system providing real-time monitoring, scientific analysis, and research collaboration tools for sustainable marine resource management across Indian waters.
          </p>
          <div className="flex flex-wrap gap-4">
            <QuickCard to="/modules/taxonomy" title="Species Identification" subtitle="AI-powered marine species identification" />
            <QuickCard to="/modules/environmental" title="Environmental Monitoring" subtitle="Real-time water quality & temperature tracking" />
            <QuickCard to="/data-upload" title="Data Upload" subtitle="Upload research data & observations" badge="New" />
            <QuickCard to="/modules/ai" title="AI Research Tools" subtitle="Advanced analysis & pattern recognition" />
          </div>
        </div>
      </header>

      <AuthenticatedOnly>
        <RoleBasedDashboard />
      </AuthenticatedOnly>

      {/* Government Statistics Overview */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard 
          label="Marine Observations" 
          value={stats?.totals.observations ?? 1247} 
          trend={12}
          icon={<Fish className="w-5 h-5 text-blue-600" />}
        />
        <StatCard 
          label="Species Catalogued" 
          value={stats?.totals.species ?? 89} 
          trend={5}
          icon={<Fish className="w-5 h-5 text-green-600" />}
        />
        <StatCard 
          label="Monitoring Stations" 
          value={stats?.totals.uploads ?? 24} 
          trend={-2}
          icon={<Waves className="w-5 h-5 text-blue-600" />}
        />
        <StatCard 
          label="Daily Data Points" 
          value={15420} 
          trend={8}
          icon={<TrendingUp className="w-5 h-5 text-indigo-600" />}
        />
      </section>

      {/* Ocean Health Charts */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="card-gov">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-gray-900">
              <Thermometer className="w-5 h-5 text-orange-500" />
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

        <Card className="card-gov">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-gray-900">
              <Fish className="w-5 h-5 text-blue-500" />
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
        <Card className="card-gov">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900">
              <BarChart3 className="w-5 h-5" />
              Species Distribution
            </CardTitle>
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
          <Card className="card-gov">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-gray-900">
                <span className="flex items-center gap-2">
                  Real-Time Activity Feed
                </span>
                <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded">
                  Last updated: {new Date().toLocaleTimeString()}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {realtimeData?.recentObservations.map((obs, i) => (
                  <li key={i} className="flex items-center justify-between p-4 rounded-lg bg-gray-50 border border-gray-200 hover:bg-gray-100 transition-all duration-200">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded bg-blue-100">
                        <Fish className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <span className="font-semibold text-gray-900">{obs.species}</span>
                        <p className="text-sm text-gray-600">
                          {obs.location}
                        </p>
                      </div>
                    </div>
                    <div className="text-right text-xs">
                      <div className="text-gray-500 mb-1">{obs.time}</div>
                      {obs.validated && <span className="text-green-600 bg-green-100 px-2 py-1 rounded font-medium">✓ Verified</span>}
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Ecosystem Health Alerts */}
      <Card className="card-gov">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-gray-900">
            <AlertTriangle className="w-5 h-5 text-orange-500" />
            Marine Ecosystem Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="flex items-center gap-4 p-6 rounded-xl bg-gradient-to-br from-orange-100 to-orange-50 border border-orange-200 hover:shadow-md transition-all duration-200">
              <div className="p-2 rounded-lg bg-white/70">
                <Thermometer className="w-6 h-6 text-orange-500" />
              </div>
              <div>
                <p className="text-sm text-orange-700 font-medium">Ocean Temp</p>
                <p className="text-xl font-bold text-orange-800">29.1°C</p>
                <p className="text-xs text-orange-600 font-semibold">2°C above normal</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-6 rounded-xl bg-gradient-to-br from-red-100 to-red-50 border border-red-200 hover:shadow-md transition-all duration-200">
              <div className="p-2 rounded-lg bg-white/70">
                <Waves className="w-6 h-6 text-red-500" />
              </div>
              <div>
                <p className="text-sm text-red-700 font-medium">pH Level</p>
                <p className="text-xl font-bold text-red-800">7.6</p>
                <p className="text-xs text-red-600 font-semibold">Acidification risk</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-6 rounded-xl bg-gradient-to-br from-blue-100 to-blue-50 border border-blue-200 hover:shadow-md transition-all duration-200">
              <div className="p-2 rounded-lg bg-white/70">
                <Fish className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-blue-700 font-medium">Fish Stock</p>
                <p className="text-xl font-bold text-blue-800">72%</p>
                <p className="text-xs text-blue-600 font-semibold">Declining trend</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-6 rounded-xl bg-gradient-to-br from-emerald-100 to-emerald-50 border border-emerald-200 hover:shadow-md transition-all duration-200">
              <div className="p-2 rounded-lg bg-white/70">
                <TrendingUp className="w-6 h-6 text-emerald-500" />
              </div>
              <div>
                <p className="text-sm text-emerald-700 font-medium">Biodiversity</p>
                <p className="text-xl font-bold text-emerald-800">Good</p>
                <p className="text-xs text-emerald-600 font-semibold">89 species active</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            {recentAlerts.map((alert, i) => (
                            <div key={i} className="flex items-center justify-between p-5 rounded-lg bg-gray-50 border border-gray-200 hover:bg-gray-100 transition-all duration-200">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded bg-orange-100">
                    <AlertTriangle className="w-4 h-4 text-orange-500" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{alert.message}</p>
                    <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                      {alert.time}
                    </p>
                  </div>
                </div>
                <Badge className="px-3 py-1 text-xs font-medium bg-orange-100 text-orange-700">
                  {alert.severity}
                </Badge>
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
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
            Tip: Use the AI species identification for faster processing - current accuracy is 92% for common Indian Ocean species.
          </div>
        </div>
      </section>
    </div>
  );
}

function StatCard({ label, value, trend, icon }: { label: string; value: number; trend?: number; icon?: React.ReactNode }) {
  return (
    <div className="card-gov p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="text-sm text-gray-600 font-medium uppercase tracking-wide">{label}</div>
        <div className="p-2 rounded bg-gray-100">
          {icon}
        </div>
      </div>
      <div className="flex items-baseline gap-3">
        <div className="text-3xl font-serif text-gray-900">{value.toLocaleString()}</div>
        {trend && (
          <div className={`flex items-center text-sm font-semibold px-2 py-1 rounded ${
            trend > 0 ? 'text-green-700 bg-green-100' : 'text-red-700 bg-red-100'
          }`}>
            {trend > 0 ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
            {Math.abs(trend)}%
          </div>
        )}
      </div>
    </div>
  );
}



function RoleBasedDashboard() {
  const { user, isGovernment, isResearcher } = useAuth();

  if (isGovernment) {
    return (
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="card-gov border-l-4 border-l-blue-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-3 text-gray-900">
              <FileCheck className="h-5 w-5 text-blue-600" />
              Pending Approvals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600 mb-2">5</div>
            <p className="text-sm text-gray-600 mb-4">
              Data submissions waiting for your review
            </p>
            <Link to="/approvals">
              <Button className="w-full btn-gov" size="sm">
                Review Submissions
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="card-gov border-l-4 border-l-emerald-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-3 text-gray-900">
              <Users className="h-5 w-5 text-emerald-600" />
              Active Researchers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-emerald-600 mb-2">23</div>
            <p className="text-sm text-gray-600 mb-4">
              Registered researchers in the system
            </p>
            <Button className="w-full btn-gov-outline" size="sm">
              View Analytics
            </Button>
          </CardContent>
        </Card>

        <Card className="card-gov border-l-4 border-l-purple-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-3 text-gray-900">
              <TrendingUp className="h-5 w-5 text-purple-600" />
              Data Quality Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600 mb-2">94%</div>
            <p className="text-sm text-gray-600 mb-4">
              Overall data quality metrics
            </p>
            <Button className="w-full btn-gov-outline" size="sm">
              View Report
            </Button>
          </CardContent>
        </Card>
      </section>
    );
  }

  if (isResearcher) {
    return (
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="card-gov border-l-4 border-l-orange-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-3 text-gray-900">
              <Upload className="h-5 w-5 text-orange-600" />
              My Submissions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600 mb-2">8</div>
            <p className="text-sm text-gray-600 mb-4">
              Total data submissions made
            </p>
            <Link to="/my-submissions">
              <Button className="w-full btn-gov" size="sm">
                View Submissions
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="card-gov border-l-4 border-l-teal-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-3 text-gray-900">
              <FileCheck className="h-5 w-5 text-teal-600" />
              Approved Data
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-teal-600 mb-2">6</div>
            <p className="text-sm text-gray-600 mb-4">
              Submissions approved and published
            </p>
            <Button className="w-full btn-gov-outline" size="sm">
              View Published
            </Button>
          </CardContent>
        </Card>

        <Card className="card-gov border-l-4 border-l-indigo-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-3 text-gray-900">
              <Upload className="h-5 w-5 text-indigo-600" />
              Quick Submit
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Submit new research data for government approval
            </p>
            <Link to="/upload">
              <Button className="w-full btn-gov" size="sm">
                <Upload className="h-4 w-4 mr-2" />
                Submit Data
              </Button>
            </Link>
          </CardContent>
        </Card>
      </section>
    );
  }

  return (
    <div className="text-center py-8">
      <h3 className="text-lg font-semibold mb-2">Welcome to OceanOS</h3>
      <p className="text-gray-600 mb-4">Please log in to access role-specific features</p>
    </div>
  );
}

function QuickCard({ title, subtitle, to, badge }: { title: string; subtitle: string; to: string; badge?: string }) {
  return (
    <Link to={to} className="card-gov hover:scale-105 transition-all duration-300 block group">
      <div className="flex items-start justify-between mb-3">
        <div className="font-medium text-lg text-gray-900 group-hover:text-blue-600 transition-colors">{title}</div>
        {badge && <Badge className="text-xs bg-blue-100 text-blue-700 hover:bg-blue-200">{badge}</Badge>}
      </div>
      <div className="text-sm text-gray-600">{subtitle}</div>
    </Link>
  );
}