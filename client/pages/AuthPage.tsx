import { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { useAuth } from "@/hooks/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, User, Shield, AlertCircle } from "lucide-react";

export default function AuthPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login, register } = useAuth();
  const [activeTab, setActiveTab] = useState(searchParams.get("tab") || "login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [loginForm, setLoginForm] = useState({
    email: "",
    password: ""
  });

  const [signupForm, setSignupForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "" as "" | "government" | "researcher"
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      console.log("Attempting login with:", loginForm.email, "password length:", loginForm.password.length);
      await login(loginForm.email, loginForm.password);
      console.log("Login successful, navigating to dashboard");
      navigate("/dashboard");
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!signupForm.role) {
        setError("Please select a role");
        setLoading(false);
        return;
      }
      
      await register({
        name: signupForm.name,
        email: signupForm.email,
        password: signupForm.password,
        role: signupForm.role as "government" | "researcher"
      });
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.error || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const fillDemoCredentials = (userType: "government" | "researcher") => {
    if (userType === "government") {
      setLoginForm({
        email: "admin@oceanos.gov",
        password: "admin123"
      });
    } else {
      setLoginForm({
        email: "researcher@university.edu", 
        password: "research123"
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        {/* Back to Home Link */}
        <div className="mb-8">
          <Link 
            to="/"
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 bg-white px-4 py-2 rounded border border-gray-200 transition-all duration-200"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
        </div>

        <Card className="card-gov-elevated shadow-lg">
          <CardHeader className="text-center pb-6">
            <div className="mb-6">
              <div className="w-16 h-16 mx-auto bg-blue-100 rounded-lg flex items-center justify-center">
                <Shield className="h-8 w-8 text-blue-600" />
              </div>
            </div>
            <CardTitle className="text-2xl font-serif text-gray-900 mb-2">
              OceanOS Access Portal
            </CardTitle>
            <CardDescription className="text-gray-600 text-base">
              Secure authentication for Marine Intelligence Platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
              
              {error && (
                <Alert className="mt-4 border-red-200 bg-red-50">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-red-700">{error}</AlertDescription>
                </Alert>
              )}

              <TabsContent value="login" className="space-y-4">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={loginForm.email}
                      onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                      placeholder="your.email@example.com"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={loginForm.password}
                      onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                      required
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={loading}
                  >
                    {loading ? "Logging in..." : "Login"}
                  </Button>
                </form>

                {/* Demo Credentials */}
                <div className="mt-6 space-y-3">
                  <h4 className="text-sm font-medium text-gray-700">Demo Accounts:</h4>
                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => fillDemoCredentials("government")}
                      className="w-full justify-start text-left"
                    >
                      <Shield className="h-4 w-4 mr-2" />
                      <div>
                        <div className="font-medium">Government User</div>
                        <div className="text-xs text-gray-500">admin@oceanos.gov</div>
                      </div>
                      <Badge variant="outline" className="ml-auto">Demo</Badge>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => fillDemoCredentials("researcher")}
                      className="w-full justify-start text-left"
                    >
                      <User className="h-4 w-4 mr-2" />
                      <div>
                        <div className="font-medium">Researcher</div>
                        <div className="text-xs text-gray-500">researcher@university.edu</div>
                      </div>
                      <Badge variant="outline" className="ml-auto">Demo</Badge>
                    </Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="signup" className="space-y-4">
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={signupForm.name}
                      onChange={(e) => setSignupForm({ ...signupForm, name: e.target.value })}
                      placeholder="Dr. Jane Smith"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      value={signupForm.email}
                      onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}
                      placeholder="jane.smith@university.edu"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      value={signupForm.password}
                      onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })}
                      placeholder="Minimum 6 characters"
                      required
                      minLength={6}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Select
                      value={signupForm.role}
                      onValueChange={(value: "government" | "researcher") => 
                        setSignupForm({ ...signupForm, role: value })
                      }
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select your role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="researcher">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            <div>
                              <div>Researcher</div>
                              <div className="text-xs text-gray-500">Submit data for approval</div>
                            </div>
                          </div>
                        </SelectItem>
                        <SelectItem value="government">
                          <div className="flex items-center gap-2">
                            <Shield className="h-4 w-4" />
                            <div>
                              <div>Government Agency</div>
                              <div className="text-xs text-gray-500">Review and approve data</div>
                            </div>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={loading}
                  >
                    {loading ? "Creating Account..." : "Create Account"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="mt-6 text-center text-sm text-ocean-300 space-y-3">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-3 border border-white/20">
            <p className="font-semibold text-ocean-200 mb-2">Demo Credentials</p>
            <p>
              <span className="font-semibold">admin@ocean.org</span> (admin role)<br />
              <span className="font-semibold">researcher@ocean.org</span> (researcher role)<br />
              Password: <span className="font-mono bg-white/10 px-2 py-1 rounded">demo123</span>
            </p>
          </div>
          <p className="text-xs text-ocean-400">
            By signing up, you agree to our terms of service and privacy policy.
          </p>
        </div>
        
        {/* Animated waves */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden">
          <svg 
            className="relative block w-full h-20 text-cyan-200/20"
            viewBox="0 0 1200 120" 
            preserveAspectRatio="none"
          >
            <path 
              d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,149.3C960,160,1056,160,1152,149.3L1248,139L1248,200L1152,200C1056,200,960,200,864,200C768,200,672,200,576,200C480,200,384,200,288,200C192,200,96,200,48,200L0,200Z" 
              fill="currentColor"
              style={{
                animation: "wave 6s ease-in-out infinite"
              }}
            />
          </svg>
        </div>
      </div>
    </div>
  );
}