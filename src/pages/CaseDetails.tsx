import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { 
  ArrowLeft, 
  FileText, 
  Download, 
  Calendar, 
  MapPin, 
  User, 
  Scale, 
  Eye,
  Upload,
  Clock,
  CheckCircle,
  AlertCircle,
  Loader2,
  Brain,
  Trash2
} from "lucide-react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format } from "date-fns";
import FilePreviewModal from "@/components/FilePreviewModal";
import { generateFIRDocx, FIRData } from "@/utils/docxGenerator";
import { jsPDF } from "jspdf";

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
  ai_analysis: any;
  created_at: string;
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
  const [previewFile, setPreviewFile] = useState<{ path: string; name: string; type: string | null } | null>(null);
  const [downloadingFIR, setDownloadingFIR] = useState(false);

  useEffect(() => {
    if (!user) {
      toast.error("Please login to view case details");
      navigate("/auth");
      return;
    }
    if (id) {
      fetchCaseData();
    }
  }, [id, user, navigate]);

  const fetchCaseData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch case
      const { data: caseResult, error: caseError } = await supabase
        .from("cases")
        .select("*")
        .eq("id", id)
        .single();

      if (caseError) throw caseError;
      setCaseData(caseResult);

      // Fetch evidence files
      const { data: evidenceResult, error: evidenceError } = await supabase
        .from("evidence_files")
        .select("*")
        .eq("case_id", id)
        .order("created_at", { ascending: false });

      if (!evidenceError && evidenceResult) {
        setEvidence(evidenceResult);
      }

      // Fetch legal documents
      const { data: docsResult, error: docsError } = await supabase
        .from("legal_documents")
        .select("*")
        .eq("case_id", id)
        .order("created_at", { ascending: false });

      if (!docsError && docsResult) {
        setDocuments(docsResult);
      }

    } catch (error) {
      console.error("Error fetching case:", error);
      toast.error("Failed to load case details");
      navigate("/dashboard");
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "in_progress": return "success";
      case "submitted":
      case "under_review": return "warning";
      case "resolved":
      case "closed": return "gold";
      case "draft": return "outline";
      case "assigned": return "default";
      default: return "outline";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "in_progress":
      case "assigned": return <Clock className="w-4 h-4" />;
      case "submitted":
      case "under_review": return <AlertCircle className="w-4 h-4" />;
      case "resolved":
      case "closed": return <CheckCircle className="w-4 h-4" />;
      case "draft": return <FileText className="w-4 h-4" />;
      default: return null;
    }
  };

  const handleViewEvidence = async (file: EvidenceFile) => {
    setPreviewFile({
      path: file.file_path,
      name: file.file_name,
      type: file.mime_type
    });
  };

  const handleDownloadEvidence = async (file: EvidenceFile) => {
    try {
      const { data, error } = await supabase.storage
        .from("evidence")
        .createSignedUrl(file.file_path, 3600);

      if (error) throw error;

      const a = document.createElement("a");
      a.href = data.signedUrl;
      a.download = file.file_name;
      a.target = "_blank";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      toast.success("Download started");
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Failed to download file");
    }
  };

  const generateFIRPDF = async () => {
    if (!caseData) return;

    setDownloadingFIR(true);
    try {
      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      let yPos = 20;
      const leftMargin = 20;
      const rightMargin = pageWidth - 20;
      const contentWidth = rightMargin - leftMargin;

      // Helper functions
      const addCenteredText = (text: string, y: number, size: number = 12, bold: boolean = false) => {
        pdf.setFontSize(size);
        pdf.setFont("helvetica", bold ? "bold" : "normal");
        pdf.text(text, pageWidth / 2, y, { align: "center" });
      };

      const addLine = (y: number) => {
        pdf.setDrawColor(218, 165, 32);
        pdf.setLineWidth(0.5);
        pdf.line(leftMargin, y, rightMargin, y);
      };

      const addField = (label: string, value: string, y: number): number => {
        pdf.setFontSize(11);
        pdf.setFont("helvetica", "bold");
        pdf.text(label, leftMargin, y);
        pdf.setFont("helvetica", "normal");
        const labelWidth = pdf.getTextWidth(label) + 2;
        
        const splitText = pdf.splitTextToSize(value || "Not provided", contentWidth - labelWidth);
        pdf.text(splitText, leftMargin + labelWidth, y);
        return y + (splitText.length * 5) + 3;
      };

      const addSectionHeader = (text: string, y: number): number => {
        addLine(y);
        pdf.setFontSize(13);
        pdf.setFont("helvetica", "bold");
        pdf.setTextColor(0, 51, 102);
        pdf.text(text, leftMargin, y + 8);
        pdf.setTextColor(0, 0, 0);
        return y + 15;
      };

      // Header
      pdf.setTextColor(0, 51, 102);
      addCenteredText("FIRST INFORMATION REPORT", yPos, 18, true);
      yPos += 8;
      pdf.setTextColor(0, 0, 0);
      addCenteredText("(Under Section 154 Cr.P.C.)", yPos, 11, false);
      yPos += 10;
      addLine(yPos);
      yPos += 15;

      // FIR Details
      yPos = addSectionHeader("FIR DETAILS", yPos);
      yPos = addField("FIR Number:", caseData.case_number || "Draft - Pending Submission", yPos);
      yPos = addField("Date of Report:", format(new Date(caseData.created_at), "dd/MM/yyyy"), yPos);
      yPos = addField("Case Category:", caseData.category?.replace("_", " ").toUpperCase() || "Not specified", yPos);
      yPos += 5;

      // Incident Details
      yPos = addSectionHeader("INCIDENT DETAILS", yPos);
      yPos = addField("Date of Incident:", caseData.incident_date ? format(new Date(caseData.incident_date), "dd/MM/yyyy") : "Not specified", yPos);
      yPos = addField("Place of Occurrence:", caseData.incident_location || "Not specified", yPos);
      yPos += 5;

      // Brief Facts
      yPos = addSectionHeader("BRIEF FACTS OF THE CASE", yPos);
      pdf.setFontSize(11);
      pdf.setFont("helvetica", "normal");
      const descLines = pdf.splitTextToSize(caseData.description || "Details not provided", contentWidth);
      pdf.text(descLines, leftMargin, yPos);
      yPos += (descLines.length * 5) + 10;

      // Check for page overflow
      if (yPos > 250) {
        pdf.addPage();
        yPos = 20;
      }

      // Accused Details
      yPos = addSectionHeader("ACCUSED DETAILS", yPos);
      yPos = addField("Name:", caseData.accused_name || "Unknown", yPos);
      yPos = addField("Description/Details:", caseData.accused_details || "Not provided", yPos);
      yPos += 5;

      // Legal Sections
      yPos = addSectionHeader("APPLICABLE LEGAL SECTIONS", yPos);
      yPos = addField("IPC Sections:", caseData.ipc_sections?.join(", ") || "To be determined", yPos);
      yPos = addField("BNS Sections:", caseData.bns_sections?.join(", ") || "To be determined", yPos);
      if (caseData.crpc_sections?.length) {
        yPos = addField("CrPC Sections:", caseData.crpc_sections.join(", "), yPos);
      }
      yPos += 5;

      // Check for page overflow
      if (yPos > 220) {
        pdf.addPage();
        yPos = 20;
      }

      // Signature Section
      yPos = addSectionHeader("SIGNATURE", yPos);
      yPos += 15;
      pdf.text("Signature of Complainant: _______________________", leftMargin, yPos);
      yPos += 10;
      pdf.text(`Date: ${format(new Date(), "dd/MM/yyyy")}`, leftMargin, yPos);
      yPos += 15;

      // Official Use Section
      yPos = addSectionHeader("FOR OFFICIAL USE ONLY", yPos);
      yPos = addField("Received by:", "_______________________", yPos);
      yPos = addField("Designation:", "_______________________", yPos);
      yPos = addField("Station Seal:", "_______________________", yPos);
      yPos += 10;

      // Disclaimer
      addLine(yPos);
      yPos += 8;
      pdf.setFontSize(9);
      pdf.setTextColor(102, 102, 102);
      pdf.setFont("helvetica", "italic");
      const disclaimer = "DISCLAIMER: This is an AI-generated draft FIR for guidance purposes only. This document does NOT constitute an official police report. Please file the actual FIR at your nearest police station with proper verification.";
      const disclaimerLines = pdf.splitTextToSize(disclaimer, contentWidth);
      pdf.text(disclaimerLines, leftMargin, yPos);
      yPos += (disclaimerLines.length * 4) + 5;
      
      pdf.setTextColor(0, 51, 102);
      addCenteredText("Generated by: AI LeXa Lawyer - Smart Judiciary of India", yPos, 9);

      // Save PDF
      const fileName = `FIR_${caseData.case_number || caseData.id.slice(0, 8)}_${format(new Date(), "yyyyMMdd")}.pdf`;
      pdf.save(fileName);
      toast.success("FIR downloaded successfully");
    } catch (error) {
      console.error("PDF generation error:", error);
      toast.error("Failed to generate FIR document");
    } finally {
      setDownloadingFIR(false);
    }
  };

  const handleDeleteEvidence = async (file: EvidenceFile) => {
    if (!confirm("Are you sure you want to delete this evidence file?")) return;

    try {
      // Delete from storage
      await supabase.storage.from("evidence").remove([file.file_path]);
      
      // Delete from database
      const { error } = await supabase
        .from("evidence_files")
        .delete()
        .eq("id", file.id);

      if (error) throw error;
      
      setEvidence(prev => prev.filter(e => e.id !== file.id));
      toast.success("Evidence deleted successfully");
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete evidence");
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">Loading case details...</span>
        </div>
      </Layout>
    );
  }

  if (!caseData) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 text-center">
          <Scale className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <h1 className="text-2xl font-serif font-bold mb-2">Case Not Found</h1>
          <p className="text-muted-foreground mb-4">The requested case could not be found.</p>
          <Link to="/dashboard">
            <Button>Return to Dashboard</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="font-serif text-2xl font-bold">{caseData.title}</h1>
                <Badge variant={getStatusColor(caseData.status) as any} className="flex items-center gap-1">
                  {getStatusIcon(caseData.status)}
                  <span className="capitalize">{caseData.status.replace("_", " ")}</span>
                </Badge>
              </div>
              <p className="text-muted-foreground">
                {caseData.case_number || "Draft"} • {caseData.category}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={generateFIRPDF} disabled={downloadingFIR}>
              {downloadingFIR ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Download className="w-4 h-4 mr-2" />
              )}
              Download FIR
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Case Details */}
            <Card variant="glass">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  Case Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-2">
                    <Calendar className="w-4 h-4 text-primary mt-1" />
                    <div>
                      <p className="text-sm text-muted-foreground">Incident Date</p>
                      <p className="font-medium">
                        {caseData.incident_date 
                          ? format(new Date(caseData.incident_date), "MMMM d, yyyy")
                          : "Not specified"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-primary mt-1" />
                    <div>
                      <p className="text-sm text-muted-foreground">Location</p>
                      <p className="font-medium">{caseData.incident_location || "Not specified"}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Description</h4>
                  <p className="text-muted-foreground bg-muted/50 rounded-lg p-4">
                    {caseData.description}
                  </p>
                </div>

                {(caseData.accused_name || caseData.accused_details) && (
                  <div className="flex items-start gap-2">
                    <User className="w-4 h-4 text-primary mt-1" />
                    <div>
                      <p className="text-sm text-muted-foreground">Accused</p>
                      <p className="font-medium">{caseData.accused_name || "Unknown"}</p>
                      {caseData.accused_details && (
                        <p className="text-sm text-muted-foreground">{caseData.accused_details}</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Legal Sections */}
                <div>
                  <h4 className="font-medium mb-2">Applicable Legal Sections</h4>
                  <div className="flex flex-wrap gap-2">
                    {caseData.ipc_sections?.map((section) => (
                      <Badge key={section} variant="outline">{section}</Badge>
                    ))}
                    {caseData.bns_sections?.map((section) => (
                      <Badge key={section} variant="outline">{section}</Badge>
                    ))}
                    {caseData.crpc_sections?.map((section) => (
                      <Badge key={section} variant="outline">{section}</Badge>
                    ))}
                    {!caseData.ipc_sections?.length && !caseData.bns_sections?.length && (
                      <span className="text-muted-foreground text-sm">To be determined</span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* AI Analysis */}
            {caseData.ai_analysis && (
              <Card variant="glass">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="w-5 h-5 text-primary" />
                    AI Legal Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted/50 rounded-lg p-4">
                    <pre className="whitespace-pre-wrap text-sm">
                      {typeof caseData.ai_analysis === "string" 
                        ? caseData.ai_analysis 
                        : JSON.stringify(caseData.ai_analysis, null, 2)}
                    </pre>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Evidence Files */}
            <Card variant="glass">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="w-5 h-5 text-primary" />
                  Evidence Files ({evidence.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {evidence.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Upload className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No evidence files uploaded</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {evidence.map((file) => (
                      <div key={file.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <FileText className="w-8 h-8 text-primary" />
                          <div>
                            <p className="font-medium text-sm">{file.file_name}</p>
                            <p className="text-xs text-muted-foreground">
                              {file.file_size ? `${(file.file_size / 1024).toFixed(1)} KB` : "Unknown size"} • 
                              {format(new Date(file.created_at), "MMM d, yyyy")}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleViewEvidence(file)}
                            title="View"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleDownloadEvidence(file)}
                            title="Download"
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleDeleteEvidence(file)}
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Case Timeline */}
            <Card variant="glass">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  Case Timeline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                    <div>
                      <p className="font-medium text-sm">Case Created</p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(caseData.created_at), "MMM d, yyyy h:mm a")}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                    <div>
                      <p className="font-medium text-sm">Last Updated</p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(caseData.updated_at), "MMM d, yyyy h:mm a")}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Legal Documents */}
            <Card variant="glass">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  Documents ({documents.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {documents.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No documents generated yet
                  </p>
                ) : (
                  <div className="space-y-2">
                    {documents.map((doc) => (
                      <div key={doc.id} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                        <div>
                          <p className="text-sm font-medium">{doc.title}</p>
                          <p className="text-xs text-muted-foreground capitalize">{doc.document_type}</p>
                        </div>
                        <Button variant="ghost" size="icon">
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card variant="parchment">
              <CardHeader>
                <CardTitle className="text-secondary-foreground">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link to="/chat" className="block">
                  <Button variant="outline" className="w-full justify-start">
                    <Scale className="w-4 h-4 mr-2" />
                    AI Legal Consultation
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={generateFIRPDF}
                  disabled={downloadingFIR}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download FIR PDF
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* File Preview Modal */}
      {previewFile && (
        <FilePreviewModal
          isOpen={!!previewFile}
          onClose={() => setPreviewFile(null)}
          filePath={previewFile.path}
          fileName={previewFile.name}
          mimeType={previewFile.type}
        />
      )}
    </Layout>
  );
};

export default CaseDetails;
