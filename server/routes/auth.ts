import { RequestHandler } from "express";
import jwt from "jsonwebtoken";

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || "dev-access-secret";
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "dev-refresh-secret";

// In-memory demo users and refresh tokens (scaffold only)
const users = [
  { id: "1", email: "viewer@example.com", role: "viewer", name: "Viewer V." },
  { id: "2", email: "curator@example.com", role: "curator", name: "Curator C." },
  { id: "3", email: "admin@example.com", role: "admin", name: "Admin A." },
];
const refreshStore = new Map<string, { userId: string }>();

function signAccessToken(payload: any) {
  return jwt.sign(payload, ACCESS_SECRET, { expiresIn: "15m" });
}
function signRefreshToken(payload: any) {
  return jwt.sign(payload, REFRESH_SECRET, { expiresIn: "14d" });
}

export const login: RequestHandler = (req, res) => {
  const { email } = req.body as { email: string; password: string };
  const user = users.find((u) => u.email === email);
  if (!user) return res.status(401).json({ error: "Invalid credentials" });
  const accessToken = signAccessToken({ sub: user.id, role: user.role });
  const refreshToken = signRefreshToken({ sub: user.id });
  refreshStore.set(refreshToken, { userId: user.id });
  res.json({
    accessToken,
    refreshToken,
    user: { id: user.id, email: user.email, role: user.role, name: user.name },
    meta: { issuedAt: new Date().toISOString() },
  });
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
