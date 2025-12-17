import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  FileText, 
  ChevronRight, 
  ChevronLeft, 
  Scale,
  AlertTriangle,
  CheckCircle,
  User,
  MapPin,
  Calendar,
  Clock,
  Upload,
  Plus,
  X,
  Download,
  Eye
} from "lucide-react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AshokaChakra } from "@/components/AshokaChakra";
import { toast } from "sonner";

interface FormData {
  // Step 1: Personal Info
  fullName: string;
  fatherName: string;
  address: string;
  phone: string;
  email: string;
  idType: string;
  idNumber: string;
  
  // Step 2: Incident Details
  incidentDate: string;
  incidentTime: string;
  incidentLocation: string;
  incidentDescription: string;
  
  // Step 3: Accused Info
  accusedName: string;
  accusedAddress: string;
  accusedRelation: string;
  accusedDescription: string;
  
  // Step 4: Evidence
  evidenceFiles: File[];
  witnessName: string;
  witnessContact: string;
  
  // Step 5: Category
  caseCategory: string;
  urgency: string;
}

const initialFormData: FormData = {
  fullName: "",
  fatherName: "",
  address: "",
  phone: "",
  email: "",
  idType: "aadhaar",
  idNumber: "",
  incidentDate: "",
  incidentTime: "",
  incidentLocation: "",
  incidentDescription: "",
  accusedName: "",
  accusedAddress: "",
  accusedRelation: "known",
  accusedDescription: "",
  evidenceFiles: [],
  witnessName: "",
  witnessContact: "",
  caseCategory: "",
  urgency: "normal",
};

const caseCategories = [
  { id: "theft", label: "Theft / Robbery", sections: ["IPC 378-382", "BNS 303-305"] },
  { id: "fraud", label: "Fraud / Cheating", sections: ["IPC 420", "BNS 316"] },
  { id: "assault", label: "Assault / Hurt", sections: ["IPC 319-326", "BNS 115-117"] },
  { id: "harassment", label: "Harassment / Stalking", sections: ["IPC 354D", "BNS 78"] },
  { id: "property", label: "Property Dispute", sections: ["Civil Matter", "Transfer of Property Act"] },
  { id: "cyber", label: "Cybercrime", sections: ["IT Act 2000", "IPC 463-468"] },
  { id: "domestic", label: "Domestic Violence", sections: ["DV Act 2005", "IPC 498A"] },
  { id: "other", label: "Other", sections: ["To be determined"] },
];

const CaseIntake: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalSteps = 5;

  const updateFormData = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      updateFormData("evidenceFiles", [...formData.evidenceFiles, ...Array.from(files)]);
    }
  };

  const removeFile = (index: number) => {
    const newFiles = [...formData.evidenceFiles];
    newFiles.splice(index, 1);
    updateFormData("evidenceFiles", newFiles);
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    toast.success("Case filed successfully!", {
      description: "Your case ID is CASE-2024-005. You will receive updates via email.",
    });
    
    setIsSubmitting(false);
    navigate("/dashboard");
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4 animate-fade-in">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Full Name *</label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => updateFormData("fullName", e.target.value)}
                  className="w-full bg-muted border border-primary/30 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Father's/Husband's Name *</label>
                <input
                  type="text"
                  value={formData.fatherName}
                  onChange={(e) => updateFormData("fatherName", e.target.value)}
                  className="w-full bg-muted border border-primary/30 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="Enter father's/husband's name"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Complete Address *</label>
              <textarea
                value={formData.address}
                onChange={(e) => updateFormData("address", e.target.value)}
                className="w-full bg-muted border border-primary/30 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 min-h-[80px]"
                placeholder="Enter your complete address with PIN code"
              />
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Phone Number *</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => updateFormData("phone", e.target.value)}
                  className="w-full bg-muted border border-primary/30 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="+91 XXXXX XXXXX"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email Address</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateFormData("email", e.target.value)}
                  className="w-full bg-muted border border-primary/30 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="your.email@example.com"
                />
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">ID Type *</label>
                <select
                  value={formData.idType}
                  onChange={(e) => updateFormData("idType", e.target.value)}
                  className="w-full bg-muted border border-primary/30 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <option value="aadhaar">Aadhaar Card</option>
                  <option value="pan">PAN Card</option>
                  <option value="voter">Voter ID</option>
                  <option value="passport">Passport</option>
                  <option value="driving">Driving License</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">ID Number *</label>
                <input
                  type="text"
                  value={formData.idNumber}
                  onChange={(e) => updateFormData("idNumber", e.target.value)}
                  className="w-full bg-muted border border-primary/30 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="Enter ID number"
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4 animate-fade-in">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Date of Incident *</label>
                <input
                  type="date"
                  value={formData.incidentDate}
                  onChange={(e) => updateFormData("incidentDate", e.target.value)}
                  className="w-full bg-muted border border-primary/30 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Approximate Time</label>
                <input
                  type="time"
                  value={formData.incidentTime}
                  onChange={(e) => updateFormData("incidentTime", e.target.value)}
                  className="w-full bg-muted border border-primary/30 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Location of Incident *</label>
              <input
                type="text"
                value={formData.incidentLocation}
                onChange={(e) => updateFormData("incidentLocation", e.target.value)}
                className="w-full bg-muted border border-primary/30 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="Enter complete address where the incident occurred"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Detailed Description of Incident *</label>
              <p className="text-xs text-muted-foreground mb-2">
                Describe what happened in detail. Include sequence of events, actions, and any relevant facts.
              </p>
              <textarea
                value={formData.incidentDescription}
                onChange={(e) => updateFormData("incidentDescription", e.target.value)}
                className="w-full bg-muted border border-primary/30 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 min-h-[200px]"
                placeholder="Describe the incident in detail..."
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4 animate-fade-in">
            <div>
              <label className="block text-sm font-medium mb-2">Name of Accused Person(s)</label>
              <input
                type="text"
                value={formData.accusedName}
                onChange={(e) => updateFormData("accusedName", e.target.value)}
                className="w-full bg-muted border border-primary/30 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="Enter name(s) if known"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Address/Location of Accused</label>
              <textarea
                value={formData.accusedAddress}
                onChange={(e) => updateFormData("accusedAddress", e.target.value)}
                className="w-full bg-muted border border-primary/30 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 min-h-[80px]"
                placeholder="Enter address if known"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Relation with Accused</label>
              <select
                value={formData.accusedRelation}
                onChange={(e) => updateFormData("accusedRelation", e.target.value)}
                className="w-full bg-muted border border-primary/30 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="unknown">Unknown Person</option>
                <option value="known">Known Person</option>
                <option value="relative">Relative</option>
                <option value="neighbor">Neighbor</option>
                <option value="colleague">Colleague</option>
                <option value="business">Business Associate</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Physical Description (if unknown)</label>
              <textarea
                value={formData.accusedDescription}
                onChange={(e) => updateFormData("accusedDescription", e.target.value)}
                className="w-full bg-muted border border-primary/30 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 min-h-[100px]"
                placeholder="Describe physical appearance, clothing, distinguishing features..."
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4 animate-fade-in">
            <div>
              <label className="block text-sm font-medium mb-2">Upload Evidence</label>
              <p className="text-xs text-muted-foreground mb-3">
                Upload documents, photos, videos, or screenshots related to the incident.
              </p>
              
              <div className="border-2 border-dashed border-primary/30 rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                <input
                  type="file"
                  id="evidence-upload"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                  accept="image/*,video/*,.pdf,.doc,.docx"
                />
                <label htmlFor="evidence-upload" className="cursor-pointer">
                  <Upload className="w-10 h-10 text-primary mx-auto mb-3" />
                  <p className="text-sm font-medium">Click to upload files</p>
                  <p className="text-xs text-muted-foreground">PDF, Images, Videos up to 10MB each</p>
                </label>
              </div>
              
              {formData.evidenceFiles.length > 0 && (
                <div className="mt-4 space-y-2">
                  {formData.evidenceFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-muted rounded-lg p-3">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-primary" />
                        <span className="text-sm truncate max-w-[200px]">{file.name}</span>
                        <span className="text-xs text-muted-foreground">
                          ({(file.size / 1024 / 1024).toFixed(2)} MB)
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeFile(index)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="border-t border-primary/20 pt-4">
              <h4 className="font-medium mb-3">Witness Information (Optional)</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Witness Name</label>
                  <input
                    type="text"
                    value={formData.witnessName}
                    onChange={(e) => updateFormData("witnessName", e.target.value)}
                    className="w-full bg-muted border border-primary/30 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="Enter witness name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Witness Contact</label>
                  <input
                    type="tel"
                    value={formData.witnessContact}
                    onChange={(e) => updateFormData("witnessContact", e.target.value)}
                    className="w-full bg-muted border border-primary/30 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="Phone number"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-4 animate-fade-in">
            <div>
              <label className="block text-sm font-medium mb-3">Case Category *</label>
              <div className="grid md:grid-cols-2 gap-3">
                {caseCategories.map((category) => (
                  <Card
                    key={category.id}
                    variant={formData.caseCategory === category.id ? "judicial" : "glass"}
                    className={`p-4 cursor-pointer transition-all ${
                      formData.caseCategory === category.id ? "ring-2 ring-primary" : ""
                    }`}
                    onClick={() => updateFormData("caseCategory", category.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{category.label}</h4>
                        <div className="flex gap-1 mt-1">
                          {category.sections.map((section) => (
                            <Badge key={section} variant="outline" className="text-xs">
                              {section}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      {formData.caseCategory === category.id && (
                        <CheckCircle className="w-5 h-5 text-primary" />
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-3">Urgency Level</label>
              <div className="flex gap-3">
                {[
                  { id: "normal", label: "Normal", description: "Standard processing" },
                  { id: "urgent", label: "Urgent", description: "Priority handling" },
                  { id: "emergency", label: "Emergency", description: "Immediate attention" },
                ].map((level) => (
                  <Card
                    key={level.id}
                    variant={formData.urgency === level.id ? "judicial" : "glass"}
                    className={`flex-1 p-4 cursor-pointer transition-all ${
                      formData.urgency === level.id ? "ring-2 ring-primary" : ""
                    }`}
                    onClick={() => updateFormData("urgency", level.id)}
                  >
                    <h4 className="font-medium">{level.label}</h4>
                    <p className="text-xs text-muted-foreground">{level.description}</p>
                  </Card>
                ))}
              </div>
            </div>
            
            <Card variant="parchment" className="p-4 mt-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
                <div className="text-secondary-foreground">
                  <h4 className="font-medium mb-1">Declaration</h4>
                  <p className="text-sm">
                    I hereby declare that the information provided above is true to the best of my knowledge. 
                    I understand that providing false information is punishable under law (IPC Section 182/191).
                  </p>
                </div>
              </div>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  const stepTitles = [
    "Personal Information",
    "Incident Details",
    "Accused Information",
    "Evidence & Witnesses",
    "Case Category",
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <Badge variant="gold" className="mb-4">
            <FileText className="w-4 h-4 mr-1" />
            Case Filing Wizard
          </Badge>
          <h1 className="font-serif text-3xl font-bold mb-2">File a New Case</h1>
          <p className="text-muted-foreground">
            Complete the form below to file your complaint. AI will assist in generating proper legal documentation.
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {stepTitles.map((title, index) => (
              <div
                key={index}
                className={`flex flex-col items-center flex-1 ${
                  index !== stepTitles.length - 1 ? "relative" : ""
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-medium text-sm transition-all ${
                    currentStep > index + 1
                      ? "bg-success text-success-foreground"
                      : currentStep === index + 1
                        ? "bg-primary text-primary-foreground gold-glow-sm"
                        : "bg-muted text-muted-foreground"
                  }`}
                >
                  {currentStep > index + 1 ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    index + 1
                  )}
                </div>
                <span className={`text-xs mt-2 text-center hidden md:block ${
                  currentStep === index + 1 ? "text-primary font-medium" : "text-muted-foreground"
                }`}>
                  {title}
                </span>
                {index !== stepTitles.length - 1 && (
                  <div className={`absolute top-5 left-[55%] w-full h-0.5 ${
                    currentStep > index + 1 ? "bg-success" : "bg-muted"
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Card */}
        <Card variant="elevated" className="p-6 md:p-8">
          <div className="mb-6">
            <h2 className="font-serif text-xl font-semibold">{stepTitles[currentStep - 1]}</h2>
            <p className="text-sm text-muted-foreground">Step {currentStep} of {totalSteps}</p>
          </div>

          {renderStepContent()}

          {/* Navigation */}
          <div className="flex justify-between mt-8 pt-6 border-t border-primary/20">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>
            
            {currentStep < totalSteps ? (
              <Button variant="hero" onClick={nextStep}>
                Next Step
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button 
                variant="hero" 
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin mr-2" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Scale className="w-4 h-4 mr-2" />
                    Submit Case
                  </>
                )}
              </Button>
            )}
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default CaseIntake;
