import React from "react";
import { Link } from "react-router-dom";
import { 
  Scale, 
  Mail, 
  Phone, 
  MapPin,
  ExternalLink,
  Twitter,
  Linkedin,
  Youtube
} from "lucide-react";
import { AshokaChakra } from "@/components/AshokaChakra";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-navy-light border-t border-primary/20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <AshokaChakra size={36} className="text-primary" animate={false} />
              <div>
                <h3 className="font-serif font-bold text-gradient-gold">AI LeXa Lawyer</h3>
                <p className="text-xs text-muted-foreground">Smart Judiciary of India</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Empowering citizens with AI-powered legal guidance based on Indian Constitution, 
              IPC, BNS, and CrPC.
            </p>
            <div className="flex gap-3">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif font-semibold text-foreground mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {[
                { label: "AI Legal Chat", path: "/chat" },
                { label: "File New Case", path: "/case-intake" },
                { label: "Citizen Dashboard", path: "/dashboard" },
                { label: "Find a Lawyer", path: "/lawyers" },
                { label: "Legal Resources", path: "/resources" },
              ].map((link) => (
                <li key={link.path}>
                  <Link 
                    to={link.path}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Resources */}
          <div>
            <h4 className="font-serif font-semibold text-foreground mb-4">Legal Resources</h4>
            <ul className="space-y-2">
              {[
                { label: "Indian Penal Code (IPC)", url: "#" },
                { label: "Bharatiya Nyaya Sanhita (BNS)", url: "#" },
                { label: "Code of Criminal Procedure", url: "#" },
                { label: "Indian Constitution", url: "#" },
                { label: "Supreme Court Judgments", url: "#" },
              ].map((link) => (
                <li key={link.label}>
                  <a 
                    href={link.url}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
                  >
                    {link.label}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-serif font-semibold text-foreground mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4 mt-0.5 text-primary" />
                <span>New Delhi, India</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="w-4 h-4 text-primary" />
                <a href="mailto:support@ailexalawyer.in" className="hover:text-primary transition-colors">
                  support@ailexalawyer.in
                </a>
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="w-4 h-4 text-primary" />
                <span>1800-XXX-XXXX (Toll Free)</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-primary/20">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Scale className="w-4 h-4 text-primary" />
              <span>© 2024 AI LeXa Lawyer. All rights reserved.</span>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
              <Link to="/terms" className="hover:text-primary transition-colors">Terms of Service</Link>
              <Link to="/disclaimer" className="hover:text-primary transition-colors">Legal Disclaimer</Link>
            </div>
          </div>
          <p className="text-xs text-muted-foreground/70 mt-4 text-center">
            <strong>Disclaimer:</strong> AI LeXa Lawyer provides legal information and guidance only. 
            It does not replace professional legal advice. Always consult a qualified lawyer for specific legal matters.
          </p>
        </div>
      </div>
    </footer>
  );
};
