import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const FIR_GENERATION_PROMPT = `You are the FIR & Legal Drafting Agent for AI LeXa Lawyer. Generate a formal First Information Report (FIR) draft in proper Indian legal format.

**FIR Format Requirements:**
1. Use formal Indian legal language
2. Include all mandatory sections per Indian Police regulations
3. Reference appropriate IPC/BNS sections based on the incident
4. Use clear, unambiguous language
5. Follow chronological order for events
6. Include witness details if available

**FIR Structure:**
- Header with police station details
- Date, Time, and Place of occurrence
- Complainant details
- Accused details (if known)
- Detailed description of the incident
- List of stolen/damaged property (if applicable)
- Witness information
- Prayer/Request for action
- Declaration and signature area

Generate a complete, professional FIR draft based on the provided information.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      complainantName,
      complainantAddress,
      complainantPhone,
      incidentDate,
      incidentTime,
      incidentLocation,
      incidentDescription,
      accusedName,
      accusedDetails,
      caseCategory,
      witnessName,
      witnessContact
    } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log("Generating FIR draft for:", complainantName);

    const userMessage = `Generate a formal FIR draft with the following details:

**Complainant Information:**
- Name: ${complainantName}
- Address: ${complainantAddress}
- Phone: ${complainantPhone}

**Incident Details:**
- Date: ${incidentDate}
- Time: ${incidentTime}
- Location: ${incidentLocation}
- Category: ${caseCategory}
- Description: ${incidentDescription}

**Accused Details:**
- Name: ${accusedName || "Unknown"}
- Other Details: ${accusedDetails || "Not available"}

**Witness Information:**
- Name: ${witnessName || "None"}
- Contact: ${witnessContact || "N/A"}

Generate a complete, formal FIR draft suitable for submission to an Indian police station.`;

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
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "FIR generation service unavailable" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const firContent = data.choices?.[0]?.message?.content || "Unable to generate FIR";

    return new Response(JSON.stringify({ firContent }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("FIR generation error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
