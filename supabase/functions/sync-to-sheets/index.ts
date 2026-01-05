import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const GOOGLE_SHEETS_URL = "https://script.google.com/macros/s/AKfycbyVo9E88HsrIuDEvVg8ZS0YJa5a3A1Y7Z1pCzJavZjB5aj_VjLwPmj-TuZaHSRrJhziLg/exec";

interface CaseData {
  case_id: string;
  case_number: string;
  full_name: string;
  father_or_husband_name: string;
  phone_number: string;
  email: string;
  complete_address: string;
  id_type: string;
  id_number: string;
  incident_date: string;
  incident_time: string;
  incident_location: string;
  incident_description: string;
  accused_name: string;
  accused_address: string;
  relation_with_accused: string;
  physical_description: string;
  witness_name: string;
  witness_contact: string;
  case_category: string;
  urgency_level: string;
  case_status: string;
  evidence_count: number;
}

// Sanitize input to prevent injection
function sanitizeInput(input: any, maxLength: number = 1000): string {
  if (input === null || input === undefined) return '';
  const str = String(input)
    .replace(/[\x00-\x1F\x7F]/g, '') // Remove control characters
    .trim();
  return str.substring(0, maxLength);
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    
    console.log("[sync-to-sheets] Received request to sync case data");

    // Validate required fields
    if (!body.case_id) {
      console.error("[sync-to-sheets] Missing case_id");
      return new Response(
        JSON.stringify({ success: false, error: "Missing case_id" }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Prepare sanitized data for Google Sheets
    const sheetsData: CaseData = {
      case_id: sanitizeInput(body.case_id, 100),
      case_number: sanitizeInput(body.case_number, 50),
      full_name: sanitizeInput(body.full_name, 200),
      father_or_husband_name: sanitizeInput(body.father_or_husband_name, 200),
      phone_number: sanitizeInput(body.phone_number, 20),
      email: sanitizeInput(body.email, 100),
      complete_address: sanitizeInput(body.complete_address, 500),
      id_type: sanitizeInput(body.id_type, 50),
      id_number: sanitizeInput(body.id_number, 50),
      incident_date: sanitizeInput(body.incident_date, 50),
      incident_time: sanitizeInput(body.incident_time, 20),
      incident_location: sanitizeInput(body.incident_location, 500),
      incident_description: sanitizeInput(body.incident_description, 2000),
      accused_name: sanitizeInput(body.accused_name, 200),
      accused_address: sanitizeInput(body.accused_address, 500),
      relation_with_accused: sanitizeInput(body.relation_with_accused, 100),
      physical_description: sanitizeInput(body.physical_description, 500),
      witness_name: sanitizeInput(body.witness_name, 200),
      witness_contact: sanitizeInput(body.witness_contact, 100),
      case_category: sanitizeInput(body.case_category, 50),
      urgency_level: sanitizeInput(body.urgency_level, 20),
      case_status: sanitizeInput(body.case_status || 'Filed', 50),
      evidence_count: typeof body.evidence_count === 'number' ? body.evidence_count : 0,
    };

    console.log("[sync-to-sheets] Sending data to Google Sheets:", {
      case_id: sheetsData.case_id,
      case_number: sheetsData.case_number,
      full_name: sheetsData.full_name
    });

    // Send to Google Sheets using no-cors mode equivalent (just fire and continue)
    // Note: Google Apps Script Web Apps require specific handling
    const response = await fetch(GOOGLE_SHEETS_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(sheetsData),
    });

    // Google Apps Script may return redirect or opaque response
    // We consider it successful if no network error occurred
    console.log("[sync-to-sheets] Google Sheets response status:", response.status);

    // Try to read response body if available
    let responseText = '';
    try {
      responseText = await response.text();
      console.log("[sync-to-sheets] Google Sheets response:", responseText);
    } catch (e) {
      console.log("[sync-to-sheets] Could not read response body (expected for no-cors)");
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Case data synced to Google Sheets",
        case_id: sheetsData.case_id 
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("[sync-to-sheets] Error syncing to Google Sheets:", errorMessage);
    
    // Return success anyway - we don't want to block the user flow
    // The error is logged for retry/monitoring purposes
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: errorMessage,
        logged: true 
      }),
      { 
        status: 200, // Return 200 even on failure to not block the flow
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
