import { RequestHandler } from "express";

const sensors = [
  { id: "s_1", label: "Pier Temp Probe", location: { type: "Point", coordinates: [-122.41, 37.79] }, meta: { vendor: "Acme" } },
  { id: "s_2", label: "Buoy 7 pH", location: { type: "Point", coordinates: [-122.50, 37.80] }, meta: { vendor: "OceanX" } },
];

export const listSensors: RequestHandler = (_req, res) => {
  res.json({ sensors, meta: { total: sensors.length } });
};

export const sensorData: RequestHandler = (req, res) => {
  const { id } = req.params;
  const { start, end, agg = "1hr" } = req.query as { start?: string; end?: string; agg?: string };
  const t0 = start ? new Date(start) : new Date(Date.now() - 1000 * 60 * 60 * 24);
  const t1 = end ? new Date(end) : new Date();
  const points = [] as { time: string; value: number }[];
  const stepMs = agg === "raw" ? 60_000 : agg === "1min" ? 60_000 : 3_600_000;
  for (let t = t0.getTime(); t <= t1.getTime(); t += stepMs) {
    points.push({ time: new Date(t).toISOString(), value: 10 + 5 * Math.sin(t / 3.6e6) });
  }
  res.json({ sensorId: id, agg, data: points, meta: { unit: "°C" } });
};
