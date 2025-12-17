import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
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
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { fileName, fileType, description, caseContext } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log("Analyzing evidence:", fileName);

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
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
