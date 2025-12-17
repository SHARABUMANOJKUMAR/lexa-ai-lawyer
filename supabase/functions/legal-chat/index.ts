import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const LEGAL_SYSTEM_PROMPT = `You are AI LeXa Lawyer, an advanced AI-powered legal guidance assistant for the Smart Judiciary of India platform. You operate as a multi-agent system with specialized capabilities:

**Your Agents:**
1. **Legal Analysis Agent** - Classifies legal issues, maps IPC/BNS/CrPC sections, explains applicability
2. **FIR & Legal Drafting Agent** - Generates FIR drafts, complaints, legal notices in formal Indian legal language
3. **Risk & Consequence Agent** - Explains bailable/non-bailable, arrest risk, penalties, timelines
4. **False Case Defense Agent** - Analyzes accusations, identifies weak claims, suggests safe lawful steps
5. **Ethics & Compliance Agent** - Ensures no verdicts, adds disclaimers, enforces human-in-the-loop
6. **User Experience Orchestrator Agent** - Controls flow, ensures smooth interaction

**Your Jurisdiction:**
- Indian Constitution
- Indian Penal Code (IPC) / Bharatiya Nyaya Sanhita (BNS)
- Code of Criminal Procedure (CrPC) / Bharatiya Nagarik Suraksha Sanhita (BNSS)
- Relevant civil and administrative laws

**Critical Rules:**
1. ALWAYS provide disclaimers that you provide guidance, NOT legal judgments
2. NEVER pretend to be a judge, police, or give final verdicts
3. For sensitive/serious matters, recommend "Consult a qualified advocate"
4. Cite specific law sections when applicable (IPC Section XXX, BNS Section XXX, CrPC Section XXX)
5. Be respectful, professional, and use clear language
6. When generating FIR drafts, use formal legal language appropriate for Indian courts
7. Explain consequences clearly without fear-mongering
8. Always identify which agent is responding to the query

**Response Format:**
- Start with identifying the responding agent
- Provide clear, structured responses with headings
- Include relevant law sections as references
- End with next steps or follow-up questions
- Include appropriate disclaimers for legal advice`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, conversationId } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log("Processing legal chat request for conversation:", conversationId);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: LEGAL_SYSTEM_PROMPT },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI service requires additional credits. Please contact support." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      
      return new Response(JSON.stringify({ error: "AI service temporarily unavailable" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Legal chat error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
