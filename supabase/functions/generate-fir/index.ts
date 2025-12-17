import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const FIR_GENERATION_PROMPT = `You are the FIR & Legal Drafting Agent for AI LeXa Lawyer - Smart Judiciary of India. Generate a formal First Information Report (FIR) draft in proper Indian legal format.

**Your Role:**
You are a specialized AI agent responsible for drafting official legal documents following Indian Police regulations and CrPC guidelines.

**FIR Format Requirements:**
1. Use formal Indian legal language - respectful, neutral, and judiciary-grade tone
2. Include all mandatory sections per Indian Police regulations (Section 154 CrPC)
3. Reference appropriate IPC/BNS/CrPC sections based on the incident type
4. Use clear, unambiguous, chronological narrative
5. Include complainant details with proper identification
6. Document accused details (if known) or physical description
7. List any property involved (stolen/damaged)
8. Include witness information if available
9. Add formal prayer/request for investigation and action

**FIR Structure:**
- Official Header: "FIRST INFORMATION REPORT" with FIR number placeholder
- Section 154 CrPC reference
- Police Station details (placeholder)
- Date and time of report
- Date, time, and place of occurrence
- Complainant's full details
- Detailed incident narrative in first person
- Accused details
- Property details if applicable
- Witness information
- Legal sections applicable
- Prayer clause requesting investigation
- Declaration of truthfulness
- Signature area

Generate a complete, professional, court-admissible FIR draft based on the provided information.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    
    // Support both old and new field naming conventions
    const complainantName = body.complainantName || body.fullName || "Not provided";
    const fatherName = body.fatherName || "";
    const complainantAddress = body.complainantAddress || body.address || "Not provided";
    const complainantPhone = body.complainantPhone || body.phone || "Not provided";
    const incidentDate = body.incidentDate || "Not specified";
    const incidentTime = body.incidentTime || "Not specified";
    const incidentLocation = body.incidentLocation || "Not specified";
    const incidentDescription = body.incidentDescription || "Not provided";
    const accusedName = body.accusedName || "Unknown";
    const accusedAddress = body.accusedAddress || "Unknown";
    const accusedDetails = body.accusedDetails || body.accusedDescription || "Not available";
    const caseCategory = body.caseCategory || body.category || "Other";
    const witnessName = body.witnessName || "None";
    const witnessContact = body.witnessContact || "N/A";
    const ipcSections = body.ipcSections || [];
    const bnsSections = body.bnsSections || [];
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      throw new Error("FIR generation service not properly configured");
    }

    console.log("🔍 FIR Drafting Agent: Generating FIR draft for:", complainantName);

    const currentDate = new Date().toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
    
    const firNumber = `FIR/${new Date().getFullYear()}/${String(Math.floor(Math.random() * 100000)).padStart(6, '0')}`;

    const userMessage = `Generate a formal, complete FIR draft with the following details:

**FIR Reference:** ${firNumber}
**Report Date:** ${currentDate}

**Complainant Information:**
- Full Name: ${complainantName}
- Father's/Husband's Name: ${fatherName}
- Address: ${complainantAddress}
- Contact Number: ${complainantPhone}

**Incident Details:**
- Date of Incident: ${incidentDate}
- Time of Incident: ${incidentTime}
- Place of Occurrence: ${incidentLocation}
- Type/Category: ${caseCategory}

**Detailed Description:**
${incidentDescription}

**Accused Person Details:**
- Name: ${accusedName}
- Address: ${accusedAddress}
- Physical Description/Other Details: ${accusedDetails}

**Applicable Legal Sections (AI Identified):**
- IPC Sections: ${ipcSections.length > 0 ? ipcSections.join(', ') : 'To be determined after investigation'}
- BNS Sections: ${bnsSections.length > 0 ? bnsSections.join(', ') : 'To be determined after investigation'}

**Witness Information:**
- Witness Name: ${witnessName}
- Witness Contact: ${witnessContact}

Please generate a complete, formal FIR document that:
1. Follows official Indian Police FIR format
2. Includes Section 154 CrPC header
3. Has proper complainant declaration
4. Contains formal prayer for investigation
5. Includes signature placeholders
6. Adds appropriate legal disclaimers

The document should be suitable for submission to an Indian police station.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: FIR_GENERATION_PROMPT },
          { role: "user", content: userMessage },
        ],
        temperature: 0.3, // Lower temperature for consistent legal formatting
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      // Return a fallback template FIR
      const fallbackFIR = generateFallbackFIR({
        firNumber, currentDate, complainantName, fatherName, complainantAddress, complainantPhone,
        incidentDate, incidentTime, incidentLocation, incidentDescription,
        accusedName, accusedAddress, accusedDetails, caseCategory,
        witnessName, witnessContact, ipcSections, bnsSections
      });
      
      return new Response(JSON.stringify({ 
        fir: fallbackFIR,
        firNumber: firNumber,
        status: "fallback"
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const firContent = data.choices?.[0]?.message?.content;

    if (!firContent) {
      throw new Error("Empty response from AI service");
    }

    console.log("✅ FIR Drafting Agent: FIR generated successfully");

    return new Response(JSON.stringify({ 
      fir: firContent,
      firNumber: firNumber,
      status: "success"
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("FIR generation error:", error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : "FIR generation failed",
      status: "error"
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

function generateFallbackFIR(data: any): string {
  return `
═══════════════════════════════════════════════════════════════
                    FIRST INFORMATION REPORT
                  (Under Section 154 Cr.P.C.)
═══════════════════════════════════════════════════════════════

FIR No.: ${data.firNumber}
Date of Report: ${data.currentDate}
Police Station: ___________________
District: ___________________
State: ___________________

═══════════════════════════════════════════════════════════════
                    COMPLAINANT DETAILS
═══════════════════════════════════════════════════════════════

Name: ${data.complainantName}
Father's/Husband's Name: ${data.fatherName || 'Not provided'}
Address: ${data.complainantAddress}
Contact Number: ${data.complainantPhone}

═══════════════════════════════════════════════════════════════
                    INCIDENT DETAILS
═══════════════════════════════════════════════════════════════

Date of Incident: ${data.incidentDate}
Time of Incident: ${data.incidentTime}
Place of Occurrence: ${data.incidentLocation}
Nature of Offence: ${data.caseCategory}

═══════════════════════════════════════════════════════════════
                    BRIEF FACTS OF THE CASE
═══════════════════════════════════════════════════════════════

${data.incidentDescription}

═══════════════════════════════════════════════════════════════
                    ACCUSED DETAILS
═══════════════════════════════════════════════════════════════

Name: ${data.accusedName}
Address: ${data.accusedAddress}
Physical Description/Other Details: ${data.accusedDetails}

═══════════════════════════════════════════════════════════════
                    APPLICABLE LEGAL SECTIONS
═══════════════════════════════════════════════════════════════

IPC Sections: ${data.ipcSections?.join(', ') || 'To be determined'}
BNS Sections: ${data.bnsSections?.join(', ') || 'To be determined'}

═══════════════════════════════════════════════════════════════
                    WITNESS INFORMATION
═══════════════════════════════════════════════════════════════

Witness Name: ${data.witnessName}
Witness Contact: ${data.witnessContact}

═══════════════════════════════════════════════════════════════
                    PRAYER/REQUEST
═══════════════════════════════════════════════════════════════

I, ${data.complainantName}, hereby request the Hon'ble Police 
authorities to:
1. Register this FIR under appropriate sections of law
2. Investigate the matter thoroughly
3. Take necessary action against the accused person(s)
4. Provide protection if required
5. Recover any stolen property (if applicable)

═══════════════════════════════════════════════════════════════
                    DECLARATION
═══════════════════════════════════════════════════════════════

I, ${data.complainantName}, hereby solemnly declare that the 
contents of this FIR are true and correct to the best of my 
knowledge and belief. I understand that providing false 
information is a punishable offence under the Indian Penal Code.

Signature of Complainant: ___________________
Date: ${data.currentDate}
Place: ${data.incidentLocation}

═══════════════════════════════════════════════════════════════
                    FOR OFFICIAL USE ONLY
═══════════════════════════════════════════════════════════════

Received by: ___________________
Designation: ___________________
Signature: ___________________
Date & Time: ___________________
Seal: 

═══════════════════════════════════════════════════════════════
                    DISCLAIMER
═══════════════════════════════════════════════════════════════

This is an AI-generated draft FIR for guidance purposes only.
This document does NOT constitute an official police report.
Please file the actual FIR at your nearest police station with
proper verification of all facts and documents.

Generated by: AI LeXa Lawyer - Smart Judiciary of India
Generation Date: ${data.currentDate}
═══════════════════════════════════════════════════════════════
`.trim();
}
