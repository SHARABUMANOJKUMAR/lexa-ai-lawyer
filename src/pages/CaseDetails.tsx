import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { 
  ArrowLeft, 
  Download, 
  FileText, 
  Scale, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Upload,
  Eye,
  Calendar,
  MapPin,
  User,
  Loader2,
  Shield,
  BookOpen,
  Gavel,
  FileCheck,
  History
} from "lucide-react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format } from "date-fns";
import { generateFIRPdf } from "@/utils/pdfGenerator";
import FilePreviewModal from "@/components/FilePreviewModal";

interface CaseData {
  id: string;
  title: string;
  description: string;
  case_number: string | null;
  status: string;
  category: string;
  incident_date: string | null;
  incident_location: string | null;
  accused_name: string | null;
  accused_details: string | null;
  ipc_sections: string[] | null;
  bns_sections: string[] | null;
  crpc_sections: string[] | null;
  ai_analysis: any;
  created_at: string;
  updated_at: string;
}

interface EvidenceFile {
  id: string;
  file_name: string;
  file_path: string;
  file_size: number | null;
  mime_type: string | null;
  description: string | null;
  created_at: string;
  ai_analysis: any;
}

interface LegalDocument {
  id: string;
  title: string;
  document_type: string;
  content: string | null;
  file_path: string | null;
  created_at: string;
}

const CaseDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [caseData, setCaseData] = useState<CaseData | null>(null);
  const [evidence, setEvidence] = useState<EvidenceFile[]>([]);
  const [documents, setDocuments] = useState<LegalDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const [previewFile, setPreviewFile] = useState<{ path: string; name: string; mime: string } | null>(null);
  const [profile, setProfile] = useState<{ full_name: string; phone: string; address: string } | null>(null);

  useEffect(() => {
    if (!user) {
      toast.error("Please login to view case details");
      navigate("/auth");
      return;
    }
    fetchCaseData();
  }, [id, user]);

  const fetchCaseData = async () => {
    if (!id) return;
    
    setIsLoading(true);
    try {
      // Fetch case details
      const { data: caseResult, error: caseError } = await supabase
        .from("cases")
        .select("*")
        .eq("id", id)
        .single();

      if (caseError) throw caseError;
      setCaseData(caseResult);

      // Fetch evidence files
      const { data: evidenceResult } = await supabase
        .from("evidence_files")
        .select("*")
        .eq("case_id", id)
        .order("created_at", { ascending: false });

      setEvidence(evidenceResult || []);

      // Fetch legal documents
      const { data: docsResult } = await supabase
        .from("legal_documents")
        .select("*")
        .eq("case_id", id)
        .order("created_at", { ascending: false });

      setDocuments(docsResult || []);

      // Fetch user profile for FIR
      const { data: profileResult } = await supabase
        .from("profiles")
        .select("full_name, phone, address")
        .eq("user_id", user?.id)
        .single();

      setProfile(profileResult);

    } catch (error) {
      console.error("Error fetching case:", error);
      toast.error("Failed to load case details");
      navigate("/dashboard");
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "draft":
        return { label: "Draft", color: "outline", icon: FileText, description: "Case draft saved" };
      case "submitted":
        return { label: "Filed", color: "success", icon: FileCheck, description: "FIR has been filed" };
      case "under_review":
        return { label: "Under Review", color: "warning", icon: AlertCircle, description: "Case is being reviewed" };
      case "assigned":
        return { label: "Assigned", color: "default", icon: User, description: "Lawyer has been assigned" };
      case "in_progress":
        return { label: "In Progress", color: "success", icon: Clock, description: "Investigation ongoing" };
      case "resolved":
        return { label: "Resolved", color: "gold", icon: CheckCircle, description: "Case has been resolved" };
      case "closed":
        return { label: "Closed", color: "gold", icon: Gavel, description: "Case is closed" };
      default:
        return { label: status, color: "outline", icon: FileText, description: "" };
    }
  };

  const handleDownloadFIR = async () => {
    if (!caseData) return;

    setIsDownloading(true);
    try {
      const firData = {
        firNumber: caseData.case_number || `DRAFT-${caseData.id.slice(0, 8).toUpperCase()}`,
        policeStation: "_________________ Police Station",
        district: "_________________ District",
        state: "_________________ State",
        reportDate: format(new Date(caseData.created_at), "dd/MM/yyyy"),
        reportTime: format(new Date(caseData.created_at), "HH:mm"),
        complainantName: profile?.full_name || "________________",
        fatherName: "________________",
        complainantAddress: profile?.address || "________________",
        complainantPhone: profile?.phone || "________________",
        incidentDate: caseData.incident_date ? format(new Date(caseData.incident_date), "dd/MM/yyyy") : "________________",
        incidentTime: "________________",
        incidentLocation: caseData.incident_location || "________________",
        incidentDescription: caseData.description,
        accusedName: caseData.accused_name || "Unknown",
        accusedAddress: "________________",
        accusedDetails: caseData.accused_details || "Not provided",
        caseCategory: caseData.category.charAt(0).toUpperCase() + caseData.category.slice(1),
        ipcSections: caseData.ipc_sections || [],
        bnsSections: caseData.bns_sections || [],
        crpcSections: caseData.crpc_sections || [],
      };

      const pdfBlob = await generateFIRPdf(firData);
      const url = URL.createObjectURL(pdfBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `FIR_${caseData.case_number || caseData.id.slice(0, 8)}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success("FIR document downloaded successfully");
    } catch (error) {
      console.error("Error generating FIR:", error);
      toast.error("Failed to generate FIR document");
    } finally {
      setIsDownloading(false);
    }
  };

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return "Unknown size";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  if (!user) return null;

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <span className="ml-2 text-muted-foreground">Loading case details...</span>
          </div>
        </div>
      </Layout>
    );
  }

  if (!caseData) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <Card variant="glass" className="p-8 text-center">
            <Scale className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h2 className="font-serif text-xl font-semibold mb-2">Case Not Found</h2>
            <p className="text-muted-foreground mb-4">The requested case could not be found.</p>
            <Link to="/dashboard">
              <Button variant="hero">Return to Dashboard</Button>
            </Link>
          </Card>
        </div>
      </Layout>
    );
  }

  const statusConfig = getStatusConfig(caseData.status);
  const StatusIcon = statusConfig.icon;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-8">
          <div className="flex items-start gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="font-serif text-2xl md:text-3xl font-bold">{caseData.title}</h1>
                <Badge variant={statusConfig.color as any} className="flex items-center gap-1">
                  <StatusIcon className="w-3 h-3" />
                  {statusConfig.label}
                </Badge>
              </div>
              <p className="text-muted-foreground">
                {caseData.case_number || "Draft"} • {caseData.category.charAt(0).toUpperCase() + caseData.category.slice(1)} Case
              </p>
            </div>
          </div>
          <Button 
            variant="hero" 
            onClick={handleDownloadFIR}
            disabled={isDownloading}
          >
            {isDownloading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Download className="w-4 h-4 mr-2" />
            )}
            Download FIR
          </Button>
        </div>

        {/* Case Lifecycle Status */}
        <Card variant="glass" className="p-6 mb-8">
          <h2 className="font-serif text-lg font-semibold mb-4 flex items-center gap-2">
            <History className="w-5 h-5 text-primary" />
            Case Lifecycle
          </h2>
          <div className="flex flex-wrap items-center gap-2">
            {["draft", "submitted", "under_review", "in_progress", "resolved", "closed"].map((step, index) => {
              const stepConfig = getStatusConfig(step);
              const StepIcon = stepConfig.icon;
              const isActive = caseData.status === step;
              const isPast = ["draft", "submitted", "under_review", "in_progress", "resolved", "closed"].indexOf(caseData.status) > index;
              
              return (
                <React.Fragment key={step}>
                  <div className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                    isActive ? "bg-primary text-primary-foreground" : 
                    isPast ? "bg-success/20 text-success" : "bg-muted text-muted-foreground"
                  }`}>
                    <StepIcon className="w-4 h-4" />
                    <span className="text-sm font-medium capitalize">{step.replace("_", " ")}</span>
                  </div>
                  {index < 5 && (
                    <div className={`h-0.5 w-8 ${isPast ? "bg-success" : "bg-muted"}`} />
                  )}
                </React.Fragment>
              );
            })}
          </div>
          <p className="text-sm text-muted-foreground mt-4">{statusConfig.description}</p>
        </Card>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* FIR Information */}
            <Card variant="elevated" className="p-6">
              <CardHeader className="p-0 mb-4">
                <CardTitle className="flex items-center gap-2 font-serif">
                  <FileText className="w-5 h-5 text-primary" />
                  FIR Information
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Case Number</p>
                    <p className="font-medium">{caseData.case_number || "Not assigned (Draft)"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Category</p>
                    <p className="font-medium capitalize">{caseData.category}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Incident Date</p>
                    <p className="font-medium flex items-center gap-1">
                      <Calendar className="w-4 h-4 text-primary" />
                      {caseData.incident_date ? format(new Date(caseData.incident_date), "dd MMM yyyy") : "Not specified"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Incident Location</p>
                    <p className="font-medium flex items-center gap-1">
                      <MapPin className="w-4 h-4 text-primary" />
                      {caseData.incident_location || "Not specified"}
                    </p>
                  </div>
                </div>

                <Separator />

                <div>
                  <p className="text-sm text-muted-foreground mb-2">Incident Description</p>
                  <p className="text-foreground whitespace-pre-wrap">{caseData.description}</p>
                </div>

                <Separator />

                <div>
                  <p className="text-sm text-muted-foreground mb-2">Accused Details</p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Name</p>
                      <p className="font-medium">{caseData.accused_name || "Unknown"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Additional Details</p>
                      <p className="font-medium">{caseData.accused_details || "Not provided"}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Applicable Laws */}
            <Card variant="elevated" className="p-6">
              <CardHeader className="p-0 mb-4">
                <CardTitle className="flex items-center gap-2 font-serif">
                  <BookOpen className="w-5 h-5 text-primary" />
                  Applicable Legal Sections
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 space-y-4">
                {caseData.ipc_sections && caseData.ipc_sections.length > 0 && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Indian Penal Code (IPC)</p>
                    <div className="flex flex-wrap gap-2">
                      {caseData.ipc_sections.map((section) => (
                        <Badge key={section} variant="outline" className="bg-primary/10">
                          {section}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                {caseData.bns_sections && caseData.bns_sections.length > 0 && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Bharatiya Nyaya Sanhita (BNS)</p>
                    <div className="flex flex-wrap gap-2">
                      {caseData.bns_sections.map((section) => (
                        <Badge key={section} variant="outline" className="bg-gold/10">
                          {section}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                {caseData.crpc_sections && caseData.crpc_sections.length > 0 && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Code of Criminal Procedure (CrPC)</p>
                    <div className="flex flex-wrap gap-2">
                      {caseData.crpc_sections.map((section) => (
                        <Badge key={section} variant="outline" className="bg-success/10">
                          {section}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                {(!caseData.ipc_sections || caseData.ipc_sections.length === 0) && 
                 (!caseData.bns_sections || caseData.bns_sections.length === 0) && 
                 (!caseData.crpc_sections || caseData.crpc_sections.length === 0) && (
                  <p className="text-muted-foreground">No legal sections identified yet.</p>
                )}
              </CardContent>
            </Card>

            {/* AI Analysis */}
            {caseData.ai_analysis && (
              <Card variant="elevated" className="p-6">
                <CardHeader className="p-0 mb-4">
                  <CardTitle className="flex items-center gap-2 font-serif">
                    <Shield className="w-5 h-5 text-primary" />
                    AI Legal Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="bg-muted/50 rounded-lg p-4 text-sm whitespace-pre-wrap">
                    {typeof caseData.ai_analysis === "string" 
                      ? caseData.ai_analysis 
                      : JSON.stringify(caseData.ai_analysis, null, 2)}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Evidence Files */}
            <Card variant="elevated" className="p-6">
              <CardHeader className="p-0 mb-4">
                <CardTitle className="flex items-center gap-2 font-serif">
                  <Upload className="w-5 h-5 text-primary" />
                  Evidence Files ({evidence.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {evidence.length === 0 ? (
                  <p className="text-muted-foreground">No evidence files uploaded yet.</p>
                ) : (
                  <div className="space-y-3">
                    {evidence.map((file) => (
                      <div key={file.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <FileText className="w-8 h-8 text-primary" />
                          <div>
                            <p className="font-medium">{file.file_name}</p>
                            <p className="text-xs text-muted-foreground">
                              {formatFileSize(file.file_size)} • {format(new Date(file.created_at), "dd MMM yyyy")}
                            </p>
                          </div>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => setPreviewFile({ 
                            path: file.file_path, 
                            name: file.file_name, 
                            mime: file.mime_type || "" 
                          })}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Info */}
            <Card variant="glass" className="p-4">
              <h3 className="font-serif font-semibold mb-4">Case Timeline</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Created</span>
                  <span>{format(new Date(caseData.created_at), "dd MMM yyyy, HH:mm")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Last Updated</span>
                  <span>{format(new Date(caseData.updated_at), "dd MMM yyyy, HH:mm")}</span>
                </div>
              </div>
            </Card>

            {/* Document History */}
            <Card variant="glass" className="p-4">
              <h3 className="font-serif font-semibold mb-4 flex items-center gap-2">
                <History className="w-4 h-4 text-primary" />
                Document History
              </h3>
              {documents.length === 0 ? (
                <p className="text-sm text-muted-foreground">No documents generated yet.</p>
              ) : (
                <div className="space-y-3">
                  {documents.map((doc) => (
                    <div key={doc.id} className="flex items-start gap-3 text-sm">
                      <FileText className="w-4 h-4 text-primary mt-0.5" />
                      <div>
                        <p className="font-medium">{doc.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {doc.document_type} • {format(new Date(doc.created_at), "dd MMM")}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {/* Actions */}
            <Card variant="parchment" className="p-4">
              <h3 className="font-serif font-semibold mb-4 text-secondary-foreground">Quick Actions</h3>
              <div className="space-y-2">
                <Link to="/chat">
                  <Button variant="outline" className="w-full justify-start">
                    <Scale className="w-4 h-4 mr-2" />
                    Get AI Guidance
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={handleDownloadFIR}
                  disabled={isDownloading}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download FIR PDF
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* File Preview Modal */}
      <FilePreviewModal
        isOpen={!!previewFile}
        onClose={() => setPreviewFile(null)}
        filePath={previewFile?.path || ""}
        fileName={previewFile?.name || ""}
        mimeType={previewFile?.mime}
      />
    </Layout>
  );
};

export default CaseDetails;
