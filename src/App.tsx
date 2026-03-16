import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/hooks/use-theme";
import RouteSeo from "@/components/RouteSeo";
import Navbar from "./components/Navbar";
import LoadingScreen from "./components/LoadingScreen";
import SmoothScroll from "./components/SmoothScroll";
import Index from "./pages/Index";

// Lazy load non-critical routes
const Events = lazy(() => import("./pages/Events"));
const EventDetail = lazy(() => import("./pages/EventDetail"));
const FlagshipEventDetail = lazy(() => import("./pages/FlagshipEventDetail"));
const Register = lazy(() => import("./pages/Register"));
const CulturalRegister = lazy(() => import("./pages/CulturalRegister"));
const Certificate = lazy(() => import("./pages/Certificate"));
const AdminLogin = lazy(() => import("./pages/AdminLogin"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const DepartmentEvents = lazy(() => import("./pages/DepartmentEvents"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const PageLoader = () => (
  <LoadingScreen progress={0.72} cached label="Loading page" />
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <RouteSeo />
          <SmoothScroll />
          <Navbar />
          <main className="lg:pl-24">
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/events" element={<Events />} />
                <Route path="/event/:eventId" element={<FlagshipEventDetail />} />
                <Route path="/events/:eventId" element={<EventDetail />} />
                <Route path="/departments/:deptId" element={<DepartmentEvents />} />
                <Route path="/register" element={<Register />} />
                <Route path="/cultural-register" element={<CulturalRegister />} />
                <Route path="/certificate" element={<Certificate />} />
                <Route path="/admin" element={<AdminLogin />} />
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
            <Suspense fallback={null}>
              <Footer />
            </Suspense>
          </main>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

const Footer = lazy(() => import("./components/Footer"));

export default App;
