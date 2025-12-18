import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, BorderStyle, Table, TableRow, TableCell, WidthType } from 'docx';

export interface FIRData {
  firNumber: string;
  reportDate: string;
  complainantName: string;
  fatherName?: string;
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
  witnessName?: string;
  witnessContact?: string;
  ipcSections?: string[];
  bnsSections?: string[];
}

export const generateFIRDocx = async (data: FIRData): Promise<Blob> => {
  const doc = new Document({
    sections: [{
      properties: {},
      children: [
        // Header
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 200 },
          children: [
            new TextRun({
              text: "FIRST INFORMATION REPORT",
              bold: true,
              size: 32,
              color: "003366"
            })
          ]
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 400 },
          children: [
            new TextRun({
              text: "(Under Section 154 Cr.P.C.)",
              size: 22,
              italics: true
            })
          ]
        }),
        
        // Decorative line
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 300 },
          children: [
            new TextRun({
              text: "═".repeat(60),
              color: "DAA520"
            })
          ]
        }),

        // FIR Details
        createSectionHeader("FIR DETAILS"),
        createKeyValueParagraph("FIR Number:", data.firNumber),
        createKeyValueParagraph("Date of Report:", data.reportDate),
        createKeyValueParagraph("Police Station:", "___________________"),
        createKeyValueParagraph("District:", "___________________"),
        
        // Complainant Details
        createSectionHeader("COMPLAINANT DETAILS"),
        createKeyValueParagraph("Full Name:", data.complainantName),
        createKeyValueParagraph("Father's/Husband's Name:", data.fatherName || "Not provided"),
        createKeyValueParagraph("Address:", data.complainantAddress),
        createKeyValueParagraph("Contact Number:", data.complainantPhone),
        
        // Incident Details
        createSectionHeader("INCIDENT DETAILS"),
        createKeyValueParagraph("Date of Incident:", data.incidentDate),
        createKeyValueParagraph("Time of Incident:", data.incidentTime),
        createKeyValueParagraph("Place of Occurrence:", data.incidentLocation),
        createKeyValueParagraph("Nature of Offence:", data.caseCategory),
        
        // Brief Facts
        createSectionHeader("BRIEF FACTS OF THE CASE"),
        new Paragraph({
          spacing: { after: 300 },
          children: [
            new TextRun({
              text: data.incidentDescription || "Details not provided",
              size: 22
            })
          ]
        }),
        
        // Accused Details
        createSectionHeader("ACCUSED DETAILS"),
        createKeyValueParagraph("Name:", data.accusedName),
        createKeyValueParagraph("Address:", data.accusedAddress),
        createKeyValueParagraph("Physical Description/Details:", data.accusedDetails),
        
        // Legal Sections
        createSectionHeader("APPLICABLE LEGAL SECTIONS"),
        createKeyValueParagraph("IPC Sections:", data.ipcSections?.join(", ") || "To be determined"),
        createKeyValueParagraph("BNS Sections:", data.bnsSections?.join(", ") || "To be determined"),
        
        // Witness Information
        createSectionHeader("WITNESS INFORMATION"),
        createKeyValueParagraph("Witness Name:", data.witnessName || "None"),
        createKeyValueParagraph("Witness Contact:", data.witnessContact || "N/A"),
        
        // Prayer Section
        createSectionHeader("PRAYER/REQUEST"),
        new Paragraph({
          spacing: { after: 200 },
          children: [
            new TextRun({
              text: `I, ${data.complainantName}, hereby request the Hon'ble Police authorities to:`,
              size: 22
            })
          ]
        }),
        createBulletPoint("Register this FIR under appropriate sections of law"),
        createBulletPoint("Investigate the matter thoroughly"),
        createBulletPoint("Take necessary action against the accused person(s)"),
        createBulletPoint("Provide protection if required"),
        createBulletPoint("Recover any stolen property (if applicable)"),
        
        // Declaration
        createSectionHeader("DECLARATION"),
        new Paragraph({
          spacing: { after: 400 },
          children: [
            new TextRun({
              text: `I, ${data.complainantName}, hereby solemnly declare that the contents of this FIR are true and correct to the best of my knowledge and belief. I understand that providing false information is a punishable offence under the Indian Penal Code.`,
              size: 22
            })
          ]
        }),
        
        // Signature Section
        new Paragraph({
          spacing: { before: 400, after: 100 },
          children: [
            new TextRun({
              text: "Signature of Complainant: ___________________",
              size: 22
            })
          ]
        }),
        createKeyValueParagraph("Date:", data.reportDate),
        createKeyValueParagraph("Place:", data.incidentLocation),
        
        // Official Use Section
        createSectionHeader("FOR OFFICIAL USE ONLY"),
        createKeyValueParagraph("Received by:", "___________________"),
        createKeyValueParagraph("Designation:", "___________________"),
        createKeyValueParagraph("Signature:", "___________________"),
        createKeyValueParagraph("Date & Time:", "___________________"),
        
        // Disclaimer
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 400 },
          children: [
            new TextRun({
              text: "═".repeat(60),
              color: "DAA520"
            })
          ]
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 100 },
          children: [
            new TextRun({
              text: "DISCLAIMER",
              bold: true,
              size: 20,
              color: "990000"
            })
          ]
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({
              text: "This is an AI-generated draft FIR for guidance purposes only. This document does NOT constitute an official police report. Please file the actual FIR at your nearest police station with proper verification of all facts and documents.",
              size: 18,
              italics: true,
              color: "666666"
            })
          ]
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 200 },
          children: [
            new TextRun({
              text: "Generated by: AI LeXa Lawyer - Smart Judiciary of India",
              size: 18,
              color: "003366"
            })
          ]
        })
      ]
    }]
  });

  return await Packer.toBlob(doc);
};

function createSectionHeader(text: string): Paragraph {
  return new Paragraph({
    spacing: { before: 400, after: 200 },
    children: [
      new TextRun({
        text: "═".repeat(60),
        color: "DAA520"
      })
    ]
  });
}

function createKeyValueParagraph(key: string, value: string): Paragraph {
  return new Paragraph({
    spacing: { after: 100 },
    children: [
      new TextRun({
        text: key + " ",
        bold: true,
        size: 22
      }),
      new TextRun({
        text: value,
        size: 22
      })
    ]
  });
}

function createBulletPoint(text: string): Paragraph {
  return new Paragraph({
    spacing: { after: 50 },
    children: [
      new TextRun({
        text: "• " + text,
        size: 22
      })
    ]
  });
}

export const generateReportDocx = async (content: string, title: string): Promise<Blob> => {
  const lines = content.split('\n').filter(line => line.trim());
  
  const doc = new Document({
    sections: [{
      properties: {},
      children: [
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 400 },
          children: [
            new TextRun({
              text: title,
              bold: true,
              size: 32,
              color: "003366"
            })
          ]
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 200 },
          children: [
            new TextRun({
              text: `Generated: ${new Date().toLocaleString('en-IN')}`,
              size: 20,
              italics: true
            })
          ]
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 400 },
          children: [
            new TextRun({
              text: "═".repeat(60),
              color: "DAA520"
            })
          ]
        }),
        ...lines.map(line => {
          const isHeader = line.includes('===') || line.includes('---') || 
            line.toUpperCase() === line && line.length > 3;
          const isSeparator = line.startsWith('═') || line.startsWith('-');
          
          if (isSeparator) {
            return new Paragraph({
              spacing: { before: 200, after: 200 },
              children: [
                new TextRun({
                  text: "═".repeat(60),
                  color: "DAA520"
                })
              ]
            });
          }
          
          if (isHeader) {
            return new Paragraph({
              spacing: { before: 300, after: 100 },
              children: [
                new TextRun({
                  text: line.replace(/[=\-]/g, '').trim(),
                  bold: true,
                  size: 26,
                  color: "003366"
                })
              ]
            });
          }
          
          return new Paragraph({
            spacing: { after: 100 },
            children: [
              new TextRun({
                text: line,
                size: 22
              })
            ]
          });
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 400 },
          children: [
            new TextRun({
              text: "Generated by AI LeXa Lawyer - Smart Judiciary of India",
              size: 18,
              italics: true,
              color: "666666"
            })
          ]
        })
      ]
    }]
  });

  return await Packer.toBlob(doc);
};