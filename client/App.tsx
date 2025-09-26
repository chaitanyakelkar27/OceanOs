import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "@/components/Layout";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import MapExplorer from "./pages/MapExplorerFixed";
import DataUpload from "./pages/DataUpload";
import About from "./pages/About";
import Modules from "./pages/Modules";
import Taxonomy from "./pages/Taxonomy";
import Otolith from "./pages/Otolith";
import EDNA from "./pages/EDNA";
import Ingestion from "./pages/Ingestion";
import Approvals from "./pages/Approvals";
import MySubmissions from "./pages/MySubmissions";
import SubmissionsStatus from "./pages/SubmissionsStatus";
import AuthPage from "./pages/AuthPage";
import { AuthProvider } from "@/hooks/auth";
import { ProtectedRoute, ResearcherOnly, GovernmentOnly } from "@/components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Layout>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/login" element={<AuthPage />} />
              <Route path="/signup" element={<AuthPage />} />
              <Route path="/map" element={<MapExplorer />} />
              <Route path="/upload" element={
                <ResearcherOnly>
                  <DataUpload />
                </ResearcherOnly>
              } />
              <Route path="/approvals" element={
                <GovernmentOnly>
                  <Approvals />
                </GovernmentOnly>
              } />
              <Route path="/my-submissions" element={
                <ResearcherOnly>
                  <MySubmissions />
                </ResearcherOnly>
              } />
              <Route path="/submissions" element={
                <ResearcherOnly>
                  <SubmissionsStatus />
                </ResearcherOnly>
              } />
              <Route path="/about" element={<About />} />
              <Route path="/modules" element={<Modules />} />
              <Route path="/modules/taxonomy" element={<Taxonomy />} />
              <Route path="/modules/otolith" element={<Otolith />} />
              <Route path="/modules/edna" element={<EDNA />} />
              <Route path="/ingestion" element={<Ingestion />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
