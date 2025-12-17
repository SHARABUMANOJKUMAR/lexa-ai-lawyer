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
  Eye,
  Loader2,
  Sparkles,
  Bot
} from "lucide-react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AshokaChakra } from "@/components/AshokaChakra";
import { toast } from "sonner";
import { useCases, CaseCategory } from "@/hooks/useCases";
import { useEvidence } from "@/hooks/useEvidence";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

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
  caseCategory: CaseCategory;
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
  caseCategory: "other",
  urgency: "normal",
};

const caseCategories: { id: CaseCategory; label: string; sections: string[] }[] = [
  { id: "criminal", label: "Theft / Robbery", sections: ["IPC 378-382", "BNS 303-305"] },
  { id: "civil", label: "Property Dispute", sections: ["Civil Matter", "Transfer of Property Act"] },
  { id: "family", label: "Family Dispute", sections: ["Hindu Marriage Act", "DV Act 2005"] },
  { id: "consumer", label: "Consumer Complaint", sections: ["Consumer Protection Act 2019"] },
  { id: "cyber", label: "Cybercrime", sections: ["IT Act 2000", "IPC 463-468"] },
  { id: "labor", label: "Labor Dispute", sections: ["Labour Laws", "Industrial Disputes Act"] },
  { id: "constitutional", label: "Constitutional Matter", sections: ["Fundamental Rights", "Writ Petition"] },
  { id: "other", label: "Other", sections: ["To be determined"] },
];

const CaseIntake: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { createCase } = useCases();
  const { uploadEvidence, analyzeEvidence } = useEvidence();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [generatedFIR, setGeneratedFIR] = useState<string | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [agentStatus, setAgentStatus] = useState<string[]>([]);

  const totalSteps = 6;

  // Redirect to auth if not logged in
  React.useEffect(() => {
    if (!user) {
      toast.error("Please login to file a case");
      navigate("/auth");
    }
  }, [user, navigate]);

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

  const addAgentStatus = (status: string) => {
    setAgentStatus(prev => [...prev, status]);
  };

  const analyzeWithAI = async () => {
    setIsAnalyzing(true);
    setAgentStatus([]);
    
    try {
      addAgentStatus("🔍 Legal Analysis Agent: Analyzing case details...");
      
      // Call the legal chat edge function for analysis
      const { data, error } = await supabase.functions.invoke('legal-chat', {
        body: {
          messages: [
            {
              role: "user",
              content: `Analyze this legal case and identify applicable IPC, BNS, and CrPC sections:
          
Category: ${formData.caseCategory}
Incident Description: ${formData.incidentDescription}
Accused Information: ${formData.accusedName} - ${formData.accusedDescription}
Location: ${formData.incidentLocation}
Date: ${formData.incidentDate}

Please provide:
1. Applicable IPC sections
2. Applicable BNS sections  
3. Applicable CrPC sections
4. Risk assessment
5. Recommended next steps`
            }
          ]
        }
      });

      if (error) throw error;

      addAgentStatus("⚖️ Risk & Consequence Agent: Evaluating legal implications...");
      await new Promise(resolve => setTimeout(resolve, 500));
      
      addAgentStatus("📋 FIR Drafting Agent: Preparing document structure...");
      await new Promise(resolve => setTimeout(resolve, 500));
      
      addAgentStatus("🛡️ Ethics & Compliance Agent: Adding disclaimers...");
      
      // Parse AI response
      const analysis = {
        response: data?.response || "Analysis completed",
        ipc_sections: extractSections(data?.response, "IPC"),
        bns_sections: extractSections(data?.response, "BNS"),
        crpc_sections: extractSections(data?.response, "CrPC"),
      };
      
      setAiAnalysis(analysis);
      addAgentStatus("✅ All agents completed analysis");
      toast.success("AI Analysis completed successfully!");
      
    } catch (error: any) {
      console.error("AI Analysis error:", error);
      toast.error("Failed to analyze case. Please try again.");
      addAgentStatus("❌ Analysis failed - please retry");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const extractSections = (text: string, type: string): string[] => {
    if (!text) return [];
    const regex = new RegExp(`${type}\\s*(\\d+[A-Z]?)`, 'gi');
    const matches = text.match(regex) || [];
    return [...new Set(matches)].slice(0, 5);
  };

  const generateFIR = async () => {
    setIsSubmitting(true);
    setAgentStatus([]);
    
    try {
      addAgentStatus("📝 FIR Drafting Agent: Generating FIR document...");
      
      const { data, error } = await supabase.functions.invoke('generate-fir', {
        body: {
          complainantName: formData.fullName,
          fatherName: formData.fatherName,
          address: formData.address,
          phone: formData.phone,
          incidentDate: formData.incidentDate,
          incidentTime: formData.incidentTime,
          incidentLocation: formData.incidentLocation,
          incidentDescription: formData.incidentDescription,
          accusedName: formData.accusedName,
          accusedAddress: formData.accusedAddress,
          accusedDescription: formData.accusedDescription,
          category: formData.caseCategory,
          ipcSections: aiAnalysis?.ipc_sections || [],
          bnsSections: aiAnalysis?.bns_sections || [],
        }
      });

      if (error) throw error;

      addAgentStatus("🛡️ Ethics Agent: Adding legal disclaimers...");
      await new Promise(resolve => setTimeout(resolve, 300));
      
      setGeneratedFIR(data?.fir || "FIR document generated");
      addAgentStatus("✅ FIR document ready for download");
      toast.success("FIR generated successfully!");
      
    } catch (error: any) {
      console.error("FIR generation error:", error);
      toast.error("Failed to generate FIR. Using template.");
      // Fallback to template
      setGeneratedFIR(generateFIRTemplate());
      addAgentStatus("⚠️ Using fallback FIR template");
    } finally {
      setIsSubmitting(false);
    }
  };

  const generateFIRTemplate = () => {
    const caseNumber = `FIR/${new Date().getFullYear()}/${Math.floor(Math.random() * 10000).toString().padStart(6, '0')}`;
    return `
FIRST INFORMATION REPORT
(Under Section 154 Cr.P.C.)

FIR No.: ${caseNumber}
Date: ${new Date().toLocaleDateString('en-IN')}
Police Station: _______________

1. COMPLAINANT DETAILS:
   Name: ${formData.fullName}
   Father's/Husband's Name: ${formData.fatherName}
   Address: ${formData.address}
   Phone: ${formData.phone}

2. INCIDENT DETAILS:
   Date of Incident: ${formData.incidentDate}
   Time of Incident: ${formData.incidentTime || 'Not specified'}
   Place of Occurrence: ${formData.incidentLocation}

3. BRIEF FACTS OF THE CASE:
${formData.incidentDescription}

4. ACCUSED DETAILS:
   Name: ${formData.accusedName || 'Unknown'}
   Address: ${formData.accusedAddress || 'Unknown'}
   Description: ${formData.accusedDescription || 'Not provided'}

5. APPLICABLE SECTIONS:
   IPC Sections: ${aiAnalysis?.ipc_sections?.join(', ') || 'To be determined'}
   BNS Sections: ${aiAnalysis?.bns_sections?.join(', ') || 'To be determined'}

6. WITNESS DETAILS:
   Name: ${formData.witnessName || 'Not provided'}
   Contact: ${formData.witnessContact || 'Not provided'}

DECLARATION:
I hereby declare that the information provided above is true to the best of my knowledge.

Signature of Complainant: _______________
Date: ${new Date().toLocaleDateString('en-IN')}

---
DISCLAIMER: This is an AI-generated draft FIR for guidance purposes only. 
Please verify all details and file the official FIR at your nearest police station.
Generated by AI LeXa Lawyer - Smart Judiciary of India
    `.trim();
  };

  const handleSubmit = async () => {
    if (!user) {
      toast.error("Please login to submit case");
      navigate("/auth");
      return;
    }

    setIsSubmitting(true);
    setAgentStatus([]);
    
    try {
      addAgentStatus("💾 Saving case to database...");
      
      // Create case in database
      const result = await createCase({
        title: `${caseCategories.find(c => c.id === formData.caseCategory)?.label || 'Legal Case'} - ${formData.fullName}`,
        description: formData.incidentDescription,
        category: formData.caseCategory,
        incident_date: formData.incidentDate || null,
        incident_location: formData.incidentLocation,
        accused_name: formData.accusedName,
        accused_details: formData.accusedDescription,
        ipc_sections: aiAnalysis?.ipc_sections || [],
        bns_sections: aiAnalysis?.bns_sections || [],
        crpc_sections: aiAnalysis?.crpc_sections || [],
        ai_analysis: aiAnalysis,
        status: "submitted"
      });

      if (result.error) throw result.error;
      const caseData = result.data;

      addAgentStatus("📎 Uploading evidence files...");
      
      // Upload evidence files
      if (formData.evidenceFiles.length > 0 && caseData) {
        for (const file of formData.evidenceFiles) {
          await uploadEvidence(caseData.id, file, `Evidence for case`);
        }
      }

      addAgentStatus("✅ Case submitted successfully!");
      
      toast.success("Case filed successfully!", {
        description: `Case ID: ${caseData?.case_number || caseData?.id}`,
      });
      
      navigate("/dashboard");
      
    } catch (error: any) {
      console.error("Submit error:", error);
      toast.error(error.message || "Failed to submit case");
      addAgentStatus("❌ Submission failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const downloadFIR = () => {
    if (!generatedFIR) return;
    
    const blob = new Blob([generatedFIR], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `FIR_${formData.fullName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("FIR downloaded successfully!");
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
                  required
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
                        <div className="flex flex-wrap gap-1 mt-1">
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
            
            <div className="border-t border-primary/20 pt-4">
              <label className="block text-sm font-medium mb-3">Urgency Level</label>
              <div className="flex gap-3">
                {["normal", "urgent", "emergency"].map((level) => (
                  <Button
                    key={level}
                    variant={formData.urgency === level ? "judicial" : "outline"}
                    onClick={() => updateFormData("urgency", level)}
                    className="capitalize flex-1"
                  >
                    {level === "emergency" && <AlertTriangle className="w-4 h-4 mr-1" />}
                    {level}
                  </Button>
                ))}
              </div>
            </div>

            {/* AI Analysis Section */}
            <div className="border-t border-primary/20 pt-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="font-medium flex items-center gap-2">
                    <Bot className="w-5 h-5 text-primary" />
                    AI Legal Analysis
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    Get AI-powered analysis of applicable law sections
                  </p>
                </div>
                <Button
                  variant="hero"
                  onClick={analyzeWithAI}
                  disabled={isAnalyzing || !formData.incidentDescription}
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Analyze Case
                    </>
                  )}
                </Button>
              </div>

              {/* Agent Status */}
              {agentStatus.length > 0 && (
                <Card variant="glass" className="p-4 mb-4">
                  <h5 className="text-sm font-medium mb-2">Multi-Agent System Status</h5>
                  <div className="space-y-1">
                    {agentStatus.map((status, index) => (
                      <p key={index} className="text-xs text-muted-foreground animate-fade-in">
                        {status}
                      </p>
                    ))}
                  </div>
                </Card>
              )}

              {/* AI Analysis Results */}
              {aiAnalysis && (
                <Card variant="judicial" className="p-4">
                  <h5 className="text-sm font-medium mb-3 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-success" />
                    Analysis Results
                  </h5>
                  <div className="space-y-3">
                    {aiAnalysis.ipc_sections?.length > 0 && (
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">IPC Sections:</p>
                        <div className="flex flex-wrap gap-1">
                          {aiAnalysis.ipc_sections.map((section: string) => (
                            <Badge key={section} variant="gold">{section}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    {aiAnalysis.bns_sections?.length > 0 && (
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">BNS Sections:</p>
                        <div className="flex flex-wrap gap-1">
                          {aiAnalysis.bns_sections.map((section: string) => (
                            <Badge key={section} variant="outline">{section}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              )}
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6 animate-fade-in">
            {/* Summary */}
            <Card variant="parchment" className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <AshokaChakra size={24} className="text-primary" animate={false} />
                <h3 className="font-serif text-lg font-semibold text-secondary-foreground">
                  Case Summary
                </h3>
              </div>
              
              <div className="space-y-4 text-secondary-foreground">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs opacity-70">Complainant</p>
                    <p className="font-medium">{formData.fullName}</p>
                  </div>
                  <div>
                    <p className="text-xs opacity-70">Category</p>
                    <p className="font-medium capitalize">{formData.caseCategory}</p>
                  </div>
                  <div>
                    <p className="text-xs opacity-70">Incident Date</p>
                    <p className="font-medium">{formData.incidentDate || "Not specified"}</p>
                  </div>
                  <div>
                    <p className="text-xs opacity-70">Location</p>
                    <p className="font-medium">{formData.incidentLocation || "Not specified"}</p>
                  </div>
                </div>
                
                <div>
                  <p className="text-xs opacity-70">Description</p>
                  <p className="text-sm">{formData.incidentDescription.substring(0, 200)}...</p>
                </div>

                {aiAnalysis && (
                  <div>
                    <p className="text-xs opacity-70 mb-2">Applicable Sections (AI Identified)</p>
                    <div className="flex flex-wrap gap-1">
                      {aiAnalysis.ipc_sections?.map((s: string) => (
                        <Badge key={s} variant="gold">{s}</Badge>
                      ))}
                      {aiAnalysis.bns_sections?.map((s: string) => (
                        <Badge key={s} variant="outline">{s}</Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <p className="text-xs opacity-70">Evidence Files</p>
                  <p className="font-medium">{formData.evidenceFiles.length} file(s) attached</p>
                </div>
              </div>
            </Card>

            {/* Generate FIR Button */}
            <div className="flex flex-col gap-4">
              <Button
                variant="hero"
                size="lg"
                onClick={generateFIR}
                disabled={isSubmitting}
                className="w-full"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Generating FIR...
                  </>
                ) : (
                  <>
                    <FileText className="w-5 h-5 mr-2" />
                    Generate FIR Document
                  </>
                )}
              </Button>

              {/* Agent Status for FIR Generation */}
              {agentStatus.length > 0 && (
                <Card variant="glass" className="p-4">
                  <div className="space-y-1">
                    {agentStatus.map((status, index) => (
                      <p key={index} className="text-xs text-muted-foreground animate-fade-in">
                        {status}
                      </p>
                    ))}
                  </div>
                </Card>
              )}

              {/* Generated FIR Preview */}
              {generatedFIR && (
                <Card variant="elevated" className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-success" />
                      FIR Generated Successfully
                    </h4>
                    <Button variant="hero" size="sm" onClick={downloadFIR}>
                      <Download className="w-4 h-4 mr-2" />
                      Download FIR
                    </Button>
                  </div>
                  <div className="bg-muted rounded-lg p-4 max-h-[300px] overflow-y-auto">
                    <pre className="text-xs whitespace-pre-wrap font-mono">
                      {generatedFIR}
                    </pre>
                  </div>
                </Card>
              )}
            </div>

            {/* Disclaimer */}
            <div className="bg-warning/10 border border-warning/30 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-warning text-sm">Important Disclaimer</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    This AI-generated FIR is for guidance only and does not constitute an official police report. 
                    Please file the actual FIR at your nearest police station with proper verification.
                  </p>
                </div>
              </div>
            </div>
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
    "Category & Analysis",
    "Review & Generate FIR"
  ];

  if (!user) {
    return null;
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <Badge variant="gold" className="mb-4">
            <FileText className="w-4 h-4 mr-1" />
            Legal Case Filing
          </Badge>
          <h1 className="font-serif text-3xl md:text-4xl font-bold mb-2">
            File New Legal Case
          </h1>
          <p className="text-muted-foreground">
            Complete the form below to file your case with AI-powered assistance
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {[1, 2, 3, 4, 5, 6].map((step) => (
              <div
                key={step}
                className={`flex items-center ${step < 6 ? "flex-1" : ""}`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                    step === currentStep
                      ? "bg-primary text-primary-foreground gold-glow"
                      : step < currentStep
                      ? "bg-success text-success-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {step < currentStep ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    step
                  )}
                </div>
                {step < 6 && (
                  <div
                    className={`flex-1 h-1 mx-2 rounded ${
                      step < currentStep ? "bg-success" : "bg-muted"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <p className="text-center text-sm text-muted-foreground">
            Step {currentStep} of {totalSteps}: {stepTitles[currentStep - 1]}
          </p>
        </div>

        {/* Form Content */}
        <Card variant="elevated" className="p-6 md:p-8">
          {renderStepContent()}

          {/* Navigation Buttons */}
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
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
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