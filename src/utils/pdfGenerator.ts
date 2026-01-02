import jsPDF from 'jspdf';

export interface FIRPdfData {
  firNumber: string;
  policeStation: string;
  district: string;
  state: string;
  reportDate: string;
  reportTime: string;
  complainantName: string;
  fatherName: string;
  complainantAddress: string;
  complainantPhone: string;
  incidentDate: string;
  incidentTime: string;
  incidentLocation: string;
  incidentDescription: string;
  accusedName: string;
  accusedAddress: string;
  accusedDetails: string;
  caseCategory: string;
  ipcSections: string[];
  bnsSections: string[];
  crpcSections: string[];
}

export const generateFIRPdf = async (data: FIRPdfData): Promise<Blob> => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  const contentWidth = pageWidth - 2 * margin;
  let y = 20;

  // Helper functions
  const centerText = (text: string, fontSize: number, isBold = false) => {
    doc.setFontSize(fontSize);
    doc.setFont("helvetica", isBold ? "bold" : "normal");
    doc.text(text, pageWidth / 2, y, { align: "center" });
    y += fontSize * 0.5;
  };

  const addLine = () => {
    doc.setDrawColor(218, 165, 32); // Gold color
    doc.setLineWidth(0.5);
    doc.line(margin, y, pageWidth - margin, y);
    y += 5;
  };

  const addSection = (title: string) => {
    y += 8;
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 51, 102);
    doc.text(title, margin, y);
    y += 6;
    doc.setTextColor(0, 0, 0);
  };

  const addField = (label: string, value: string) => {
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text(label, margin, y);
    doc.setFont("helvetica", "normal");
    const labelWidth = doc.getTextWidth(label + " ");
    const valueLines = doc.splitTextToSize(value, contentWidth - labelWidth - 10);
    doc.text(valueLines, margin + labelWidth, y);
    y += 6 * Math.max(1, valueLines.length);
  };

  const addWrappedText = (text: string, fontSize = 10) => {
    doc.setFontSize(fontSize);
    doc.setFont("helvetica", "normal");
    const lines = doc.splitTextToSize(text, contentWidth);
    doc.text(lines, margin, y);
    y += 5 * lines.length;
  };

  const checkPageBreak = (requiredSpace: number) => {
    if (y + requiredSpace > doc.internal.pageSize.getHeight() - 30) {
      doc.addPage();
      y = 20;
    }
  };

  // Header
  doc.setTextColor(0, 51, 102);
  centerText("भारत सरकार / GOVERNMENT OF INDIA", 12, true);
  y += 2;
  centerText("FIRST INFORMATION REPORT", 16, true);
  y += 2;
  centerText("(Under Section 154 of the Code of Criminal Procedure)", 10, false);
  y += 5;
  addLine();
  y += 3;

  doc.setTextColor(0, 0, 0);

  // FIR Details Section
  addSection("═══════════════════ FIR DETAILS ═══════════════════");
  addField("FIR Number:", data.firNumber);
  addField("Date of Report:", `${data.reportDate} at ${data.reportTime}`);
  addField("Police Station:", data.policeStation);
  addField("District:", data.district);
  addField("State:", data.state);

  // Complainant Details
  checkPageBreak(60);
  addSection("═══════════════════ COMPLAINANT DETAILS ═══════════════════");
  addField("Full Name:", data.complainantName);
  addField("Father's/Husband's Name:", data.fatherName);
  addField("Address:", data.complainantAddress);
  addField("Contact Number:", data.complainantPhone);

  // Incident Details
  checkPageBreak(60);
  addSection("═══════════════════ INCIDENT DETAILS ═══════════════════");
  addField("Date of Incident:", data.incidentDate);
  addField("Time of Incident:", data.incidentTime);
  addField("Place of Occurrence:", data.incidentLocation);
  addField("Nature of Offence:", data.caseCategory);

  // Brief Facts
  checkPageBreak(80);
  addSection("═══════════════════ BRIEF FACTS OF THE CASE ═══════════════════");
  addWrappedText(data.incidentDescription || "Details not provided");

  // Accused Details
  checkPageBreak(50);
  addSection("═══════════════════ ACCUSED DETAILS ═══════════════════");
  addField("Name of Accused:", data.accusedName);
  addField("Address:", data.accusedAddress);
  addField("Physical Description/Other Details:", data.accusedDetails);

  // Applicable Legal Sections
  checkPageBreak(50);
  addSection("═══════════════════ APPLICABLE LEGAL SECTIONS ═══════════════════");
  if (data.ipcSections.length > 0) {
    addField("IPC Sections:", data.ipcSections.join(", "));
  }
  if (data.bnsSections.length > 0) {
    addField("BNS Sections:", data.bnsSections.join(", "));
  }
  if (data.crpcSections.length > 0) {
    addField("CrPC Sections:", data.crpcSections.join(", "));
  }
  if (data.ipcSections.length === 0 && data.bnsSections.length === 0 && data.crpcSections.length === 0) {
    addField("Sections:", "To be determined by investigating officer");
  }

  // Prayer Section
  checkPageBreak(60);
  addSection("═══════════════════ PRAYER / REQUEST ═══════════════════");
  addWrappedText(`I, ${data.complainantName}, hereby request the Hon'ble Police authorities to:`);
  y += 3;
  const prayers = [
    "• Register this FIR under appropriate sections of law",
    "• Investigate the matter thoroughly and impartially",
    "• Take necessary legal action against the accused person(s)",
    "• Provide protection to the complainant if required",
    "• Recover any stolen property (if applicable)"
  ];
  prayers.forEach(prayer => {
    addWrappedText(prayer);
  });

  // Declaration
  checkPageBreak(50);
  addSection("═══════════════════ DECLARATION ═══════════════════");
  addWrappedText(
    `I, ${data.complainantName}, hereby solemnly declare that the contents of this FIR are true and correct to the best of my knowledge and belief. I understand that providing false information is a punishable offence under the Indian Penal Code / Bharatiya Nyaya Sanhita.`
  );

  // Signature Section
  checkPageBreak(50);
  y += 10;
  addField("Signature of Complainant:", "___________________________");
  y += 5;
  addField("Date:", data.reportDate);
  addField("Place:", data.incidentLocation);

  // Official Use Section
  checkPageBreak(60);
  addSection("═══════════════════ FOR OFFICIAL USE ONLY ═══════════════════");
  addField("Received by (Name):", "___________________________");
  addField("Designation:", "___________________________");
  addField("Signature & Seal:", "___________________________");
  addField("Date & Time of Receipt:", "___________________________");

  // Footer with disclaimer
  checkPageBreak(40);
  y += 10;
  addLine();
  y += 5;
  
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(153, 0, 0);
  doc.text("IMPORTANT DISCLAIMER", pageWidth / 2, y, { align: "center" });
  y += 5;
  
  doc.setFont("helvetica", "italic");
  doc.setTextColor(100, 100, 100);
  const disclaimer = "This is an AI-generated draft FIR for guidance purposes only. This document does NOT constitute an official police report. Please file the actual FIR at your nearest police station with proper verification of all facts and documents. The actual FIR will be prepared by the police authorities based on your statement.";
  const disclaimerLines = doc.splitTextToSize(disclaimer, contentWidth);
  doc.text(disclaimerLines, pageWidth / 2, y, { align: "center" });
  y += 5 * disclaimerLines.length;

  y += 5;
  doc.setFontSize(8);
  doc.setTextColor(0, 51, 102);
  doc.text("Generated by: AI LeXa Lawyer - Smart Judiciary of India", pageWidth / 2, y, { align: "center" });
  y += 4;
  doc.text(`Document Generated: ${new Date().toLocaleString('en-IN')}`, pageWidth / 2, y, { align: "center" });

  return doc.output('blob');
};
