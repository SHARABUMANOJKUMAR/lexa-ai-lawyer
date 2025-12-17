import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  Scale, 
  MessageSquare, 
  FileText, 
  LayoutDashboard, 
  Users, 
  Shield,
  Menu,
  X,
  User,
  LogOut,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { AshokaChakra } from "@/components/AshokaChakra";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

const navItems = [
  { path: "/", label: "Home", icon: Scale },
  { path: "/chat", label: "AI Legal Chat", icon: MessageSquare },
  { path: "/case-intake", label: "New Case", icon: FileText },
  { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
];

export const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    toast.success("Signed out successfully");
    navigate("/");
    setMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-primary/20">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <AshokaChakra size={40} className="text-primary" animate={false} />
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="hidden sm:block">
              <h1 className="font-serif text-lg font-bold text-gradient-gold leading-tight">
                AI LeXa Lawyer
              </h1>
              <p className="text-[10px] text-muted-foreground -mt-0.5">
                Smart Judiciary of India
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link key={item.path} to={item.path}>
                  <Button
                    variant={isActive ? "judicial" : "ghost"}
                    size="sm"
                    className={`gap-2 ${isActive ? "gold-glow-sm" : ""}`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </Button>
                </Link>
              );
            })}
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-2">
            {user ? (
              <>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-muted rounded-lg">
                  <User className="w-4 h-4 text-primary" />
                  <span className="text-sm truncate max-w-[120px]">
                    {user.email?.split('@')[0]}
                  </span>
                </div>
                <Button variant="ghost" size="sm" onClick={handleSignOut}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/auth">
                  <Button variant="ghost" size="sm">Login</Button>
                </Link>
                <Link to="/auth">
                  <Button variant="hero" size="sm">
                    Get Started
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-primary/20 py-4 animate-fade-in-down">
            <nav className="flex flex-col gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                
                return (
                  <Link 
                    key={item.path} 
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Button
                      variant={isActive ? "judicial" : "ghost"}
                      className="w-full justify-start gap-3"
                    >
                      <Icon className="w-5 h-5" />
                      {item.label}
                    </Button>
                  </Link>
                );
              })}
              
              <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-primary/20">
                {user ? (
                  <>
                    <div className="flex items-center gap-2 px-4 py-2 bg-muted rounded-lg">
                      <User className="w-4 h-4 text-primary" />
                      <span className="text-sm">{user.email}</span>
                    </div>
                    <Button variant="outline" className="w-full" onClick={handleSignOut}>
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <>
                    <Link to="/auth" className="w-full" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="outline" className="w-full">Login</Button>
                    </Link>
                    <Link to="/auth" className="w-full" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="hero" className="w-full">Get Started</Button>
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};