import React from "react";
import { Link } from "react-router-dom";
import { Scale, Mail, Phone, MapPin, ExternalLink } from "lucide-react";
import { AshokaChakra } from "@/components/AshokaChakra";

// Custom social icons to match the design
const TwitterIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

const YouTubeIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

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
            <div className="flex gap-4">
              <a 
                href="https://x.com/Sharabumanoj?t=zWNXk-B0Q13uf8PvWeAC-w&s=08" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Twitter/X"
              >
                <TwitterIcon />
              </a>
              <a 
                href="https://www.linkedin.com/in/sharabu-manoj-kumar/?originalSubdomain=in" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="LinkedIn"
              >
                <LinkedInIcon />
              </a>
              <a 
                href="https://www.youtube.com/@sharabumanojkumar" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="YouTube"
              >
                <YouTubeIcon />
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
                { label: "Lawyer Portal", path: "/lawyer-portal" },
                { label: "Admin Panel", path: "/admin" },
              ].map(link => (
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
                { label: "Indian Penal Code (IPC)", url: "https://indiankanoon.org/search/?formInput=indian+penal+code" },
                { label: "Bharatiya Nyaya Sanhita (BNS)", url: "https://www.mha.gov.in/en/bharatiya-nyaya-sanhita" },
                { label: "Code of Criminal Procedure", url: "https://indiankanoon.org/search/?formInput=crpc" },
                { label: "Indian Constitution", url: "https://legislative.gov.in/constitution-of-india/" },
                { label: "Supreme Court Judgments", url: "https://main.sci.gov.in/judgments" },
              ].map(link => (
                <li key={link.label}>
                  <a 
                    href={link.url} 
                    target="_blank"
                    rel="noopener noreferrer"
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
                <MapPin className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                <span>Andhra Pradesh, India</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="w-4 h-4 text-primary flex-shrink-0" />
                <a 
                  href="mailto:sharabumanojachari@gmail.com" 
                  className="hover:text-primary transition-colors"
                >
                  sharabumanojachari@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="w-4 h-4 text-primary flex-shrink-0" />
                <span>1800-1800-1800 (Toll Free)</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-primary/20">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Scale className="w-4 h-4 text-primary" />
              <span>© 2024 AI LeXa Lawyer – Smart Judiciary of India. All rights reserved.</span>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
              <Link to="/terms" className="hover:text-primary transition-colors">Terms of Service</Link>
              <Link to="/disclaimer" className="hover:text-primary transition-colors">Legal Disclaimer</Link>
            </div>
          </div>
          <p className="text-xs text-muted-foreground/70 mt-4 text-center">
            <strong>⚖️ Disclaimer:</strong> AI LeXa Lawyer provides legal information and guidance only. 
            It does not replace professional legal advice. Always consult a qualified lawyer for specific legal matters.
            The AI provides guidance, not judgments.
          </p>
        </div>
      </div>
    </footer>
  );
};