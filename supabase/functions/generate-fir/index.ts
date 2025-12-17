import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Allowed origins for CORS - restrict to app domains
const ALLOWED_ORIGINS = [
  'https://ratlfzpryvunqzqmbuvk.lovableproject.com',
  'https://lovable.dev',
  'http://localhost:5173',
  'http://localhost:8080',
];

const getCorsHeaders = (origin: string | null) => {
  const allowedOrigin = origin && ALLOWED_ORIGINS.some(allowed => origin.startsWith(allowed.replace(/\/$/, ''))) 
    ? origin 
    : ALLOWED_ORIGINS[0];
  return {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  };
};

// Input validation and sanitization
const MAX_TEXT_LENGTH = 5000;
const MAX_NAME_LENGTH = 200;
const MAX_ADDRESS_LENGTH = 500;

const sanitizeInput = (input: any, maxLength: number = MAX_TEXT_LENGTH): string => {
  if (typeof input !== 'string') return '';
  return input
    .replace(/[\x00-\x1F\x7F]/g, '') // Remove control characters
    .replace(/[<>]/g, '') // Remove HTML-like characters
    .trim()
    .slice(0, maxLength);
};

const sanitizeName = (name: any): string => {
  return sanitizeInput(name, MAX_NAME_LENGTH) || "Not provided";
};

const sanitizeAddress = (address: any): string => {
  return sanitizeInput(address, MAX_ADDRESS_LENGTH) || "Not provided";
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
  const origin = req.headers.get('origin');
  const corsHeaders = getCorsHeaders(origin);

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify authentication
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      console.error("Missing authorization header");
      return new Response(JSON.stringify({ error: "Authentication required" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Verify user with Supabase
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: { headers: { Authorization: authHeader } }
    });

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      console.error("Auth error:", authError);
      return new Response(JSON.stringify({ error: "Invalid authentication" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json();
    
    // Validate and sanitize all inputs
    const complainantName = sanitizeName(body.complainantName || body.fullName);
    const fatherName = sanitizeName(body.fatherName);
    const complainantAddress = sanitizeAddress(body.complainantAddress || body.address);
    const complainantPhone = sanitizeInput(body.complainantPhone || body.phone, 20) || "Not provided";
    const incidentDate = sanitizeInput(body.incidentDate, 50) || "Not specified";
    const incidentTime = sanitizeInput(body.incidentTime, 50) || "Not specified";
    const incidentLocation = sanitizeAddress(body.incidentLocation) || "Not specified";
    const incidentDescription = sanitizeInput(body.incidentDescription);
    const accusedName = sanitizeName(body.accusedName) || "Unknown";
    const accusedAddress = sanitizeAddress(body.accusedAddress) || "Unknown";
    const accusedDetails = sanitizeInput(body.accusedDetails || body.accusedDescription) || "Not available";
    const caseCategory = sanitizeInput(body.caseCategory || body.category, 100) || "Other";
    const witnessName = sanitizeName(body.witnessName) || "None";
    const witnessContact = sanitizeInput(body.witnessContact, 50) || "N/A";
    
    // Validate arrays
    const ipcSections = Array.isArray(body.ipcSections) 
      ? body.ipcSections.slice(0, 20).map((s: any) => sanitizeInput(String(s), 50))
      : [];
    const bnsSections = Array.isArray(body.bnsSections) 
      ? body.bnsSections.slice(0, 20).map((s: any) => sanitizeInput(String(s), 50))
      : [];
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      throw new Error("FIR generation service not properly configured");
    }

    console.log("FIR Drafting Agent: Generating FIR draft for user:", user.id);

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
${incidentDescription || "Not provided"}

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
        temperature: 0.3,
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

    console.log("FIR Drafting Agent: FIR generated successfully");

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
      error: "An unexpected error occurred. Please try again.",
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

${data.incidentDescription || 'Details not provided'}

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
