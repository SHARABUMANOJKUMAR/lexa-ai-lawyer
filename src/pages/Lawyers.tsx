import React, { useState, useEffect } from "react";
import { 
  Users, 
  MapPin, 
  Star, 
  Phone, 
  Mail, 
  Clock, 
  CheckCircle, 
  Award,
  Briefcase,
  Search,
  Filter,
  ChevronRight,
  MessageSquare,
  Calendar,
  Shield
} from "lucide-react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

interface Lawyer {
  id: string;
  name: string;
  specialization: string[];
  experience: number;
  location: string;
  rating: number;
  reviews: number;
  available: boolean;
  avatar: string;
  email: string;
  phone: string;
  barCouncilId: string;
  languages: string[];
  fees: string;
  bio: string;
}

const lawyerData: Lawyer[] = [
  {
    id: "1",
    name: "Adv. Priya Sharma",
    specialization: ["Criminal Law", "Cybercrime"],
    experience: 12,
    location: "Delhi",
    rating: 4.8,
    reviews: 156,
    available: true,
    avatar: "PS",
    email: "priya.sharma@lexalawyers.in",
    phone: "+91 98765 43210",
    barCouncilId: "DL/1234/2012",
    languages: ["Hindi", "English"],
    fees: "₹2,000 - ₹5,000 per consultation",
    bio: "Specializing in criminal defense and cybercrime cases with over 12 years of courtroom experience."
  },
  {
    id: "2",
    name: "Adv. Rajesh Kumar",
    specialization: ["Family Law", "Divorce", "Child Custody"],
    experience: 15,
    location: "Mumbai",
    rating: 4.9,
    reviews: 203,
    available: true,
    avatar: "RK",
    email: "rajesh.kumar@lexalawyers.in",
    phone: "+91 98765 43211",
    barCouncilId: "MH/5678/2009",
    languages: ["Hindi", "English", "Marathi"],
    fees: "₹3,000 - ₹7,000 per consultation",
    bio: "Family law specialist with expertise in matrimonial disputes, custody battles, and domestic violence cases."
  },
  {
    id: "3",
    name: "Adv. Anjali Verma",
    specialization: ["Property Law", "Real Estate"],
    experience: 10,
    location: "Bangalore",
    rating: 4.7,
    reviews: 89,
    available: false,
    avatar: "AV",
    email: "anjali.verma@lexalawyers.in",
    phone: "+91 98765 43212",
    barCouncilId: "KA/9012/2014",
    languages: ["Hindi", "English", "Kannada"],
    fees: "₹2,500 - ₹6,000 per consultation",
    bio: "Property law expert handling land disputes, real estate transactions, and RERA matters."
  },
  {
    id: "4",
    name: "Adv. Mohammed Rizwan",
    specialization: ["Corporate Law", "Business Disputes"],
    experience: 18,
    location: "Hyderabad",
    rating: 4.9,
    reviews: 178,
    available: true,
    avatar: "MR",
    email: "mohammed.rizwan@lexalawyers.in",
    phone: "+91 98765 43213",
    barCouncilId: "TS/3456/2006",
    languages: ["Hindi", "English", "Telugu", "Urdu"],
    fees: "₹5,000 - ₹15,000 per consultation",
    bio: "Corporate law veteran with extensive experience in mergers, acquisitions, and commercial litigation."
  },
  {
    id: "5",
    name: "Adv. Sunita Patel",
    specialization: ["Labour Law", "Employment Disputes"],
    experience: 8,
    location: "Chennai",
    rating: 4.6,
    reviews: 67,
    available: true,
    avatar: "SP",
    email: "sunita.patel@lexalawyers.in",
    phone: "+91 98765 43214",
    barCouncilId: "TN/7890/2016",
    languages: ["Hindi", "English", "Tamil"],
    fees: "₹1,500 - ₹4,000 per consultation",
    bio: "Labour law specialist helping employees and employers with workplace disputes and compliance."
  },
  {
    id: "6",
    name: "Adv. Vikram Singh",
    specialization: ["Constitutional Law", "PIL"],
    experience: 20,
    location: "Chandigarh",
    rating: 4.8,
    reviews: 234,
    available: true,
    avatar: "VS",
    email: "vikram.singh@lexalawyers.in",
    phone: "+91 98765 43215",
    barCouncilId: "PB/1122/2004",
    languages: ["Hindi", "English", "Punjabi"],
    fees: "₹4,000 - ₹10,000 per consultation",
    bio: "Senior advocate specializing in constitutional matters and public interest litigation."
  },
  {
    id: "7",
    name: "Adv. Deepa Menon",
    specialization: ["Consumer Law", "FEMA"],
    experience: 11,
    location: "Kochi",
    rating: 4.7,
    reviews: 92,
    available: false,
    avatar: "DM",
    email: "deepa.menon@lexalawyers.in",
    phone: "+91 98765 43216",
    barCouncilId: "KL/3344/2013",
    languages: ["Hindi", "English", "Malayalam"],
    fees: "₹2,000 - ₹5,000 per consultation",
    bio: "Consumer rights advocate with expertise in FEMA regulations and NRI legal matters."
  },
  {
    id: "8",
    name: "Adv. Arjun Reddy",
    specialization: ["Tax Law", "GST"],
    experience: 14,
    location: "Pune",
    rating: 4.8,
    reviews: 145,
    available: true,
    avatar: "AR",
    email: "arjun.reddy@lexalawyers.in",
    phone: "+91 98765 43217",
    barCouncilId: "MH/5566/2010",
    languages: ["Hindi", "English", "Telugu", "Marathi"],
    fees: "₹3,500 - ₹8,000 per consultation",
    bio: "Tax law expert handling direct and indirect taxation matters, GST disputes, and tax planning."
  }
];

const specializations = [
  "All",
  "Criminal Law",
  "Family Law",
  "Property Law",
  "Corporate Law",
  "Labour Law",
  "Constitutional Law",
  "Consumer Law",
  "Tax Law",
  "Cybercrime"
];

const Lawyers: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpec, setSelectedSpec] = useState("All");
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);
  const [selectedLawyer, setSelectedLawyer] = useState<Lawyer | null>(null);
  const [showConnectDialog, setShowConnectDialog] = useState(false);
  const [connecting, setConnecting] = useState(false);

  const filteredLawyers = lawyerData.filter(lawyer => {
    const matchesSearch = lawyer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lawyer.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lawyer.specialization.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesSpec = selectedSpec === "All" || lawyer.specialization.includes(selectedSpec);
    const matchesAvailable = !showAvailableOnly || lawyer.available;
    return matchesSearch && matchesSpec && matchesAvailable;
  });

  const connectToRandomLawyer = () => {
    const availableLawyers = lawyerData.filter(l => l.available);
    if (availableLawyers.length === 0) {
      toast.error("No lawyers available at the moment");
      return;
    }
    const randomLawyer = availableLawyers[Math.floor(Math.random() * availableLawyers.length)];
    setSelectedLawyer(randomLawyer);
    setShowConnectDialog(true);
  };

  const handleConnect = async () => {
    if (!user) {
      toast.error("Please login to connect with a lawyer");
      navigate("/auth");
      return;
    }

    setConnecting(true);
    // Simulate connection request
    await new Promise(resolve => setTimeout(resolve, 2000));
    setConnecting(false);
    setShowConnectDialog(false);
    
    toast.success(`Connection request sent to ${selectedLawyer?.name}!`, {
      description: "You will receive a confirmation within 24 hours."
    });
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge variant="gold" className="mb-4">
            <Users className="w-4 h-4 mr-1" />
            Verified Advocates
          </Badge>
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">
            Connect with Legal Experts
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            Find and connect with verified advocates registered with the Bar Council of India. 
            Get professional legal representation for your case.
          </p>
          
          {/* Quick Connect Button */}
          <Button variant="hero" size="xl" onClick={connectToRandomLawyer}>
            <Shield className="w-5 h-5 mr-2" />
            Connect to Available Lawyer
            <ChevronRight className="w-5 h-5 ml-2" />
          </Button>
        </div>

        {/* Search and Filters */}
        <Card variant="glass" className="p-4 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by name, location, or specialization..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-muted border border-primary/30 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <select
              value={selectedSpec}
              onChange={(e) => setSelectedSpec(e.target.value)}
              className="bg-muted border border-primary/30 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              {specializations.map(spec => (
                <option key={spec} value={spec}>{spec}</option>
              ))}
            </select>
            <Button
              variant={showAvailableOnly ? "judicial" : "outline"}
              onClick={() => setShowAvailableOnly(!showAvailableOnly)}
            >
              <Clock className="w-4 h-4 mr-2" />
              Available Now
            </Button>
          </div>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Verified Advocates", value: lawyerData.length.toString(), icon: Users },
            { label: "Specializations", value: "10+", icon: Briefcase },
            { label: "Available Now", value: lawyerData.filter(l => l.available).length.toString(), icon: CheckCircle },
            { label: "Avg. Rating", value: "4.8★", icon: Star },
          ].map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.label} variant="glass" className="p-4 text-center">
                <Icon className="w-6 h-6 text-primary mx-auto mb-2" />
                <p className="text-2xl font-bold font-serif">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </Card>
            );
          })}
        </div>

        {/* Lawyer Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLawyers.map((lawyer, index) => (
            <Card 
              key={lawyer.id} 
              variant="elevated" 
              className="overflow-hidden animate-fade-in-up cursor-pointer hover:border-primary/50 transition-all"
              style={{ animationDelay: `${index * 50}ms` }}
              onClick={() => {
                setSelectedLawyer(lawyer);
                setShowConnectDialog(true);
              }}
            >
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-gold-light flex items-center justify-center text-xl font-bold text-primary-foreground">
                      {lawyer.avatar}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{lawyer.name}</CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant={lawyer.available ? "success" : "outline"} className="text-xs">
                          {lawyer.available ? "Available" : "Busy"}
                        </Badge>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Star className="w-3 h-3 text-warning fill-warning" />
                          {lawyer.rating} ({lawyer.reviews})
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-1">
                    {lawyer.specialization.map(spec => (
                      <Badge key={spec} variant="outline" className="text-xs">
                        {spec}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>{lawyer.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-4 h-4" />
                      <span>{lawyer.experience} years experience</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4" />
                      <span>Bar Council: {lawyer.barCouncilId}</span>
                    </div>
                  </div>

                  <Button variant="outline" className="w-full mt-4" onClick={(e) => {
                    e.stopPropagation();
                    setSelectedLawyer(lawyer);
                    setShowConnectDialog(true);
                  }}>
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Connect Now
                    <ChevronRight className="w-4 h-4 ml-auto" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredLawyers.length === 0 && (
          <Card variant="glass" className="p-8 text-center">
            <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No lawyers found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filters</p>
          </Card>
        )}

        {/* Connect Dialog */}
        <Dialog open={showConnectDialog} onOpenChange={setShowConnectDialog}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="font-serif text-2xl">
                Connect with {selectedLawyer?.name}
              </DialogTitle>
              <DialogDescription>
                Send a connection request to schedule a consultation
              </DialogDescription>
            </DialogHeader>
            
            {selectedLawyer && (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-gold-light flex items-center justify-center text-2xl font-bold text-primary-foreground">
                    {selectedLawyer.avatar}
                  </div>
                  <div>
                    <h3 className="font-semibold">{selectedLawyer.name}</h3>
                    <p className="text-sm text-muted-foreground">{selectedLawyer.location}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Star className="w-4 h-4 text-warning fill-warning" />
                      <span className="text-sm">{selectedLawyer.rating} ({selectedLawyer.reviews} reviews)</span>
                    </div>
                  </div>
                </div>

                <Card variant="parchment" className="p-4">
                  <p className="text-sm text-secondary-foreground">{selectedLawyer.bio}</p>
                </Card>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Specialization</p>
                    <p className="font-medium">{selectedLawyer.specialization.join(", ")}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Experience</p>
                    <p className="font-medium">{selectedLawyer.experience} years</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Languages</p>
                    <p className="font-medium">{selectedLawyer.languages.join(", ")}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Consultation Fees</p>
                    <p className="font-medium">{selectedLawyer.fees}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <a href={`tel:${selectedLawyer.phone}`} className="flex-1">
                    <Button variant="outline" className="w-full">
                      <Phone className="w-4 h-4 mr-2" />
                      Call
                    </Button>
                  </a>
                  <a href={`mailto:${selectedLawyer.email}`} className="flex-1">
                    <Button variant="outline" className="w-full">
                      <Mail className="w-4 h-4 mr-2" />
                      Email
                    </Button>
                  </a>
                </div>
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowConnectDialog(false)}>
                Cancel
              </Button>
              <Button variant="hero" onClick={handleConnect} disabled={connecting || !selectedLawyer?.available}>
                {connecting ? (
                  <>
                    <Clock className="w-4 h-4 mr-2 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <Calendar className="w-4 h-4 mr-2" />
                    Request Consultation
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default Lawyers;