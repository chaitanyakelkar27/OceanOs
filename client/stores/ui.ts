import { create } from "zustand";

export type DateRange = { start: string | null; end: string | null };
export type BBox = [number, number, number, number] | null;
export type Viewport = { longitude: number; latitude: number; zoom: number };

interface UIState {
  dateRange: DateRange;
  speciesId: string | null;
  bbox: BBox;
  viewport: Viewport;
  communityReports: boolean;
  setDateRange: (r: DateRange) => void;
  setSpeciesId: (id: string | null) => void;
  setBBox: (b: BBox) => void;
  setViewport: (v: Partial<Viewport>) => void;
  toggleCommunityReports: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  dateRange: { start: null, end: null },
  speciesId: null,
  bbox: null,
  viewport: { longitude: -122.43, latitude: 37.77, zoom: 5 },
  communityReports: true,
  setDateRange: (dateRange) => set({ dateRange }),
  setSpeciesId: (speciesId) => set({ speciesId }),
  setBBox: (bbox) => set({ bbox }),
  setViewport: (v) => set((s) => ({ viewport: { ...s.viewport, ...v } })),
  toggleCommunityReports: () => set((s) => ({ communityReports: !s.communityReports })),
}));
