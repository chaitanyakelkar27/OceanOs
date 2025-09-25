import axios from "axios";

let isRefreshing = false;
let pendingQueue: Array<() => void> = [];

function getAccessToken() {
  return localStorage.getItem("accessToken");
}
function getRefreshToken() {
  return localStorage.getItem("refreshToken");
}

export const api = axios.create({
  baseURL: "/api",
  headers: { "X-Client": "atlas-natura" },
});

api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers = config.headers || {};
    (config.headers as any)["Authorization"] = `Bearer ${token}`;
  }
  (config.headers as any)["X-Provenance"] = JSON.stringify({
    sentAt: new Date().toISOString(),
    app: "atlas-natura",
  });
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original.__isRetryRequest) {
      if (isRefreshing) {
        await new Promise<void>((resolve) => pendingQueue.push(resolve));
      } else {
        try {
          isRefreshing = true;
          const rt = getRefreshToken();
          if (!rt) throw new Error("No refresh token");
          const { data } = await axios.post("/api/auth/refresh", { refreshToken: rt });
          localStorage.setItem("accessToken", data.accessToken);
          pendingQueue.forEach((cb) => cb());
        } catch (e) {
          pendingQueue = [];
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          return Promise.reject(error);
        } finally {
          isRefreshing = false;
        }
      }
      original.__isRetryRequest = true;
      const token = getAccessToken();
      original.headers = original.headers || {};
      original.headers["Authorization"] = token ? `Bearer ${token}` : undefined;
      return api.request(original);
    }
    return Promise.reject(error);
  },
);

export type StatsResponse = {
  totals: { observations: number; species: number; uploads: number };
  lastUpdated: string;
  meta: any;
};
