import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { User, AuthResponse, LoginRequest, RegisterRequest, UserRole } from "@shared/api";

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || "dev-access-secret";
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "dev-refresh-secret";

// In-memory demo users and refresh tokens (scaffold only)
const users: User[] = [
  { 
    id: "1", 
    email: "admin@oceanos.gov", 
    role: "government", 
    name: "Ocean Administrator", 
    organization: "Department of Marine Resources",
    createdAt: "2024-01-01T00:00:00.000Z",
    isActive: true
  },
  { 
    id: "2", 
    email: "researcher@university.edu", 
    role: "researcher", 
    name: "Dr. Marine Scientist", 
    organization: "Ocean Research Institute",
    createdAt: "2024-01-15T00:00:00.000Z",
    isActive: true
  },
  { 
    id: "3", 
    email: "researcher2@lab.org", 
    role: "researcher", 
    name: "Research Fellow", 
    organization: "Marine Biology Lab",
    createdAt: "2024-02-01T00:00:00.000Z",
    isActive: true
  },
];

const refreshStore = new Map<string, { userId: string }>();

// Demo passwords (in production, use proper hashing)
const userPasswords = new Map([
  ["admin@oceanos.gov", "admin123"],
  ["researcher@university.edu", "research123"],
  ["researcher2@lab.org", "research123"],
]);

function signAccessToken(payload: any) {
  return jwt.sign(payload, ACCESS_SECRET, { expiresIn: "15m" });
}
function signRefreshToken(payload: any) {
  return jwt.sign(payload, REFRESH_SECRET, { expiresIn: "14d" });
}

export const login: RequestHandler = (req, res) => {
  const { email, password } = req.body as LoginRequest;
  
  // Find user and verify password
  const user = users.find((u) => u.email === email);
  const storedPassword = userPasswords.get(email);
  
  if (!user || !storedPassword || storedPassword !== password || !user.isActive) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const accessToken = signAccessToken({ sub: user.id, role: user.role });
  const refreshToken = signRefreshToken({ sub: user.id });
  refreshStore.set(refreshToken, { userId: user.id });
  
  const response: AuthResponse = {
    accessToken,
    refreshToken,
    user,
    meta: { issuedAt: new Date().toISOString() },
  };
  
  res.json(response);
};

export const register: RequestHandler = (req, res) => {
  const { email, password, name, role, organization } = req.body as RegisterRequest;
  
  // Check if user already exists
  if (users.find(u => u.email === email)) {
    return res.status(400).json({ error: "User already exists" });
  }

  // Validate role
  if (!["government", "researcher"].includes(role)) {
    return res.status(400).json({ error: "Invalid role" });
  }

  // Create new user
  const newUser: User = {
    id: Date.now().toString(), // Simple ID generation for demo
    email,
    name,
    role: role as UserRole,
    organization,
    createdAt: new Date().toISOString(),
    isActive: true,
  };

  users.push(newUser);
  userPasswords.set(email, password);

  const accessToken = signAccessToken({ sub: newUser.id, role: newUser.role });
  const refreshToken = signRefreshToken({ sub: newUser.id });
  refreshStore.set(refreshToken, { userId: newUser.id });
  
  const response: AuthResponse = {
    accessToken,
    refreshToken,
    user: newUser,
    meta: { issuedAt: new Date().toISOString() },
  };
  
  res.json(response);
};

export const me: RequestHandler = (req, res) => {
  const auth = req.headers.authorization || "";
  const token = auth.replace(/^Bearer\s+/i, "");
  try {
    const decoded = jwt.verify(token, ACCESS_SECRET) as any;
    const user = users.find((u) => u.id === decoded.sub);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ user, meta: { fetchedAt: new Date().toISOString() } });
  } catch {
    res.status(401).json({ error: "Unauthorized" });
  }
};

export const refresh: RequestHandler = (req, res) => {
  const { refreshToken } = req.body as { refreshToken: string };
  if (!refreshToken || !refreshStore.has(refreshToken)) {
    return res.status(401).json({ error: "Invalid refresh token" });
  }
  try {
    const decoded = jwt.verify(refreshToken, REFRESH_SECRET) as any;
    const user = users.find((u) => u.id === decoded.sub);
    if (!user) return res.status(401).json({ error: "Invalid refresh token" });
    const accessToken = signAccessToken({ sub: user.id, role: user.role });
    res.json({ accessToken, meta: { rotatedAt: new Date().toISOString() } });
  } catch {
    res.status(401).json({ error: "Invalid refresh token" });
  }
};

export const logout: RequestHandler = (req, res) => {
  const { refreshToken } = req.body as { refreshToken?: string };
  if (refreshToken) refreshStore.delete(refreshToken);
  res.json({ success: true });
};

// Middleware for protecting routes
export const requireAuth: RequestHandler = (req, res, next) => {
  const auth = req.headers.authorization || "";
  const token = auth.replace(/^Bearer\s+/i, "");
  
  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }
  
  try {
    const decoded = jwt.verify(token, ACCESS_SECRET) as any;
    const user = users.find((u) => u.id === decoded.sub);
    
    if (!user || !user.isActive) {
      return res.status(401).json({ error: "User not found or inactive" });
    }
    
    // Add user to request object for use in route handlers
    (req as any).user = user;
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
};

// Middleware for role-based access
export const requireRole = (...roles: UserRole[]): RequestHandler => {
  return (req, res, next) => {
    const user = (req as any).user;
    
    if (!user) {
      return res.status(401).json({ error: "Authentication required" });
    }
    
    if (!roles.includes(user.role)) {
      return res.status(403).json({ error: "Insufficient permissions" });
    }
    
    next();
  };
};

// Combined middleware for government-only routes
export const requireGovernment: RequestHandler[] = [requireAuth, requireRole("government")];

// Combined middleware for researcher routes
export const requireResearcher: RequestHandler[] = [requireAuth, requireRole("researcher", "government")];
