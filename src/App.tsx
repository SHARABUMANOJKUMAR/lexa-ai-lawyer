import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import Chat from "./pages/Chat";
import Dashboard from "./pages/Dashboard";
import CaseIntake from "./pages/CaseIntake";
import CaseDetails from "./pages/CaseDetails";
import Auth from "./pages/Auth";
import LawyerPortal from "./pages/LawyerPortal";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import Lawyers from "./pages/Lawyers";
import Resources from "./pages/Resources";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import LegalDisclaimer from "./pages/LegalDisclaimer";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/case-intake" element={<CaseIntake />} />
            <Route path="/case/:id" element={<CaseDetails />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/lawyer-portal" element={<LawyerPortal />} />
            <Route path="/lawyer" element={<LawyerPortal />} />
            <Route path="/lawyers" element={<Lawyers />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/disclaimer" element={<LegalDisclaimer />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
