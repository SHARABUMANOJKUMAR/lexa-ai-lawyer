import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Declare EdgeRuntime for Supabase background tasks
declare const EdgeRuntime: {
  waitUntil: (promise: Promise<any>) => void;
};

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

// Create Supabase client for database operations
function getSupabaseClient() {
  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  return createClient(supabaseUrl, supabaseKey);
}

// Sync data to Google Sheets with retry logic
async function syncToGoogleSheets(sheetsData: CaseData): Promise<{ success: boolean; error?: string }> {
  try {
    console.log("[sync-to-sheets] Sending data to Google Sheets:", {
      case_id: sheetsData.case_id,
      case_number: sheetsData.case_number,
      full_name: sheetsData.full_name
    });

    const response = await fetch(GOOGLE_SHEETS_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(sheetsData),
    });

    console.log("[sync-to-sheets] Google Sheets response status:", response.status);

    // Try to read response body if available
    let responseText = '';
    try {
      responseText = await response.text();
      console.log("[sync-to-sheets] Google Sheets response:", responseText);
    } catch (e) {
      console.log("[sync-to-sheets] Could not read response body (expected for no-cors)");
    }

    // Consider 200-399 as success (Google Apps Script may redirect)
    if (response.status >= 200 && response.status < 400) {
      return { success: true };
    }

    return { success: false, error: `HTTP ${response.status}: ${responseText}` };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("[sync-to-sheets] Sync error:", errorMessage);
    return { success: false, error: errorMessage };
  }
}

// Log failed sync for retry
async function logFailedSync(supabase: any, caseId: string, payload: CaseData, errorMessage: string) {
  try {
    await supabase.from('failed_syncs').insert({
      case_id: caseId,
      payload: payload,
      error_message: errorMessage,
      status: 'pending',
      retry_count: 0,
      next_retry_at: new Date(Date.now() + 5 * 60 * 1000).toISOString() // 5 minutes from now
    });
    console.log("[sync-to-sheets] Failed sync logged for retry");
  } catch (err) {
    console.error("[sync-to-sheets] Failed to log sync for retry:", err);
  }
}

// Mark sync as successful
async function markSyncSuccess(supabase: any, syncId: string) {
  try {
    await supabase.from('failed_syncs').update({
      status: 'success',
      last_retry_at: new Date().toISOString()
    }).eq('id', syncId);
  } catch (err) {
    console.error("[sync-to-sheets] Failed to mark sync as success:", err);
  }
}

// Mark sync as failed after max retries
async function markSyncFailed(supabase: any, syncId: string) {
  try {
    await supabase.from('failed_syncs').update({
      status: 'failed',
      last_retry_at: new Date().toISOString()
    }).eq('id', syncId);
  } catch (err) {
    console.error("[sync-to-sheets] Failed to mark sync as failed:", err);
  }
}

// Process pending retries (background task)
async function processRetries() {
  const supabase = getSupabaseClient();
  
  console.log("[sync-to-sheets] Processing pending retries...");
  
  const { data: pendingSyncs, error } = await supabase
    .from('failed_syncs')
    .select('*')
    .in('status', ['pending', 'retrying'])
    .lt('next_retry_at', new Date().toISOString())
    .lt('retry_count', 3)
    .limit(10);

  if (error) {
    console.error("[sync-to-sheets] Error fetching pending syncs:", error);
    return;
  }

  if (!pendingSyncs || pendingSyncs.length === 0) {
    console.log("[sync-to-sheets] No pending retries found");
    return;
  }

  console.log(`[sync-to-sheets] Found ${pendingSyncs.length} pending retries`);

  for (const sync of pendingSyncs) {
    // Update status to retrying
    await supabase.from('failed_syncs').update({
      status: 'retrying',
      retry_count: sync.retry_count + 1,
      last_retry_at: new Date().toISOString()
    }).eq('id', sync.id);

    const result = await syncToGoogleSheets(sync.payload as CaseData);
    
    if (result.success) {
      await markSyncSuccess(supabase, sync.id);
      console.log(`[sync-to-sheets] Retry successful for sync ${sync.id}`);
    } else {
      const newRetryCount = sync.retry_count + 1;
      if (newRetryCount >= 3) {
        await markSyncFailed(supabase, sync.id);
        console.log(`[sync-to-sheets] Max retries reached for sync ${sync.id}`);
      } else {
        // Schedule next retry with exponential backoff (5min, 15min, 45min)
        const backoffMinutes = 5 * Math.pow(3, newRetryCount);
        await supabase.from('failed_syncs').update({
          status: 'pending',
          error_message: result.error,
          next_retry_at: new Date(Date.now() + backoffMinutes * 60 * 1000).toISOString()
        }).eq('id', sync.id);
        console.log(`[sync-to-sheets] Retry ${newRetryCount} failed, next retry in ${backoffMinutes} minutes`);
      }
    }
  }
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    
    console.log("[sync-to-sheets] Received request");

    // Check if this is a retry processing request
    if (body.action === 'process_retries') {
      // Use background task for retry processing
      EdgeRuntime.waitUntil(processRetries());
      return new Response(
        JSON.stringify({ success: true, message: "Retry processing started" }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate required fields for normal sync
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

    // Attempt sync to Google Sheets
    const result = await syncToGoogleSheets(sheetsData);

    if (!result.success) {
      // Log for retry in background (non-blocking)
      const supabase = getSupabaseClient();
      EdgeRuntime.waitUntil(logFailedSync(supabase, sheetsData.case_id, sheetsData, result.error || 'Unknown error'));
    }

    // Always return success to not block user flow
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: result.success ? "Case data synced to Google Sheets" : "Case data queued for sync",
        case_id: sheetsData.case_id,
        sync_status: result.success ? 'synced' : 'queued'
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("[sync-to-sheets] Error:", errorMessage);
    
    // Return success anyway - we don't want to block the user flow
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: errorMessage,
        logged: true 
      }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
