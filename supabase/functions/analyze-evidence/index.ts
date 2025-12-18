import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// CORS headers - allow all lovableproject.com subdomains and localhost
const getCorsHeaders = (origin: string | null) => {
  const isAllowed = origin && (
    origin.endsWith('.lovableproject.com') ||
    origin.includes('lovable.dev') ||
    origin.startsWith('http://localhost')
  );
  return {
    "Access-Control-Allow-Origin": isAllowed ? origin : '*',
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  };
};

// Input validation and sanitization
const MAX_TEXT_LENGTH = 5000;
const MAX_FILENAME_LENGTH = 255;

const sanitizeInput = (input: string, maxLength: number = MAX_TEXT_LENGTH): string => {
  if (typeof input !== 'string') return '';
  return input
    .replace(/[\x00-\x1F\x7F]/g, '') // Remove control characters
    .replace(/[<>]/g, '') // Remove HTML-like characters
    .trim()
    .slice(0, maxLength);
};

const sanitizeFileName = (fileName: string): string => {
  if (typeof fileName !== 'string') return 'unknown';
  // Remove path traversal attempts and sanitize
  return fileName
    .replace(/\.\./g, '')
    .replace(/[\/\\:*?"<>|]/g, '')
    .trim()
    .slice(0, MAX_FILENAME_LENGTH) || 'unknown';
};

const ANALYSIS_PROMPT = `You are an AI Evidence Analysis Agent for the AI LeXa Lawyer platform. Your role is to analyze uploaded evidence files and provide legal insights.

**Your Tasks:**
1. Identify the type of evidence (document, photo, video description, screenshot, etc.)
2. Assess relevance to common legal cases in India
3. Suggest how this evidence might support a legal claim
4. Identify potential IPC/BNS/CrPC sections this evidence relates to
5. Flag any authenticity concerns or verification needs
6. Recommend how to properly preserve and present this evidence

**Response Format:**
- Evidence Type
- Relevance Assessment
- Supporting Legal Sections
- Preservation Recommendations
- Authenticity Notes
- Next Steps

Always include a disclaimer that evidence assessment requires verification by legal professionals.`;

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
    
    // Validate and sanitize inputs
    const fileName = sanitizeFileName(body.fileName);
    const fileType = sanitizeInput(body.fileType || 'unknown', 100);
    const description = sanitizeInput(body.description || '');
    const caseContext = sanitizeInput(body.caseContext || '');
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log("Analyzing evidence for user:", user.id, "file:", fileName);

    const userMessage = `Analyze the following evidence file:
File Name: ${fileName}
File Type: ${fileType}
User Description: ${description || "No description provided"}
Case Context: ${caseContext || "General evidence upload"}

Provide a comprehensive analysis of this evidence's potential legal relevance under Indian law.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: ANALYSIS_PROMPT },
          { role: "user", content: userMessage },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "Evidence analysis service unavailable" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const analysis = data.choices?.[0]?.message?.content || "Unable to analyze evidence";

    return new Response(JSON.stringify({ analysis }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Evidence analysis error:", error);
    return new Response(JSON.stringify({ error: "An unexpected error occurred" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
