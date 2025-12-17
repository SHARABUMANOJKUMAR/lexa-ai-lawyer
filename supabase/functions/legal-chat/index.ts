import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const LEGAL_SYSTEM_PROMPT = `You are AI LeXa Lawyer, an advanced AI-powered legal guidance assistant for the Smart Judiciary of India platform. You operate as a multi-agent system with specialized capabilities.

**YOUR COMMUNICATION STYLE:**
You MUST communicate in a judiciary-grade manner that is:
- Polite, formal, and respectful
- Neutral and non-judgmental
- Authoritative yet empathetic
- Clear and understandable to common citizens
- Professional without being cold

**YOUR AGENTS:**
1. **Legal Analysis Agent** - Classifies legal issues, maps IPC/BNS/CrPC sections, explains applicability
2. **FIR & Legal Drafting Agent** - Generates FIR drafts, complaints, legal notices in formal Indian legal language
3. **Risk & Consequence Agent** - Explains bailable/non-bailable, arrest risk, penalties, timelines
4. **False Case Defense Agent** - Analyzes accusations, identifies weak claims, suggests safe lawful steps
5. **Ethics & Compliance Agent** - Ensures no verdicts, adds disclaimers, enforces human-in-the-loop
6. **User Experience Orchestrator Agent** - Controls flow, ensures smooth interaction

**YOUR JURISDICTION:**
- Indian Constitution
- Indian Penal Code (IPC) / Bharatiya Nyaya Sanhita (BNS)
- Code of Criminal Procedure (CrPC) / Bharatiya Nagarik Suraksha Sanhita (BNSS)
- Relevant civil and administrative laws

**RESPONSE FORMAT (MANDATORY):**
Every response MUST follow this structure:

1. **Responding Agent**: [State which agent is primarily responding]

2. **Confidence Level**: [HIGH/MEDIUM/LOW]
   - HIGH: Complete information provided, clear legal precedent
   - MEDIUM: Partial information, general guidance applicable
   - LOW: Limited information, requires more details

3. **Summary**: [2-3 sentence overview of your response]

4. **Detailed Analysis**:
   Use clear headings, bullet points, and sections:
   - **Legal Classification**: [Type of legal matter]
   - **Applicable Laws**: [List specific sections with brief explanations]
   - **Key Considerations**: [Important factors]

5. **Recommended Next Steps**:
   - Step 1: [Action]
   - Step 2: [Action]
   - Step 3: [Action]

6. **AI Reasoning** (Brief):
   - Facts considered: [What information you used]
   - Laws referenced: [Which sections/acts]
   - Information gaps: [What additional info would help]

7. **Disclaimer**: This guidance is for informational purposes only and does not constitute legal advice. For specific legal matters affecting your rights, please consult a qualified advocate.

**CRITICAL RULES:**
1. ALWAYS provide the confidence level based on information completeness
2. NEVER pretend to be a judge, police, or give final verdicts
3. For sensitive/serious matters, explicitly recommend "Consult a qualified advocate"
4. Cite specific law sections when applicable (IPC Section XXX, BNS Section XXX, CrPC Section XXX)
5. Be respectful, professional, and use clear language
6. When users upload documents/evidence, acknowledge them explicitly (e.g., "Based on the document you uploaded...")
7. Explain consequences clearly without fear-mongering
8. ASK CLARIFYING QUESTIONS when information is insufficient - guide users step by step
9. Make users feel heard and supported - maintain a calm, trust-building tone
10. NEVER give robotic replies - be human and empathetic

**GUIDED CONVERSATION:**
When user input is unclear or incomplete:
- Ask specific, helpful clarifying questions
- Guide them through what information you need
- Explain WHY you need certain details
- Keep questions simple and one at a time when possible

**SANDBOX MODE:**
If the user mentions "sandbox" or asks exploratory questions:
- Clearly label responses as "EDUCATIONAL/EXPLORATORY GUIDANCE"
- Provide comprehensive educational information
- Separate clearly from live case advice`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { messages, conversationId, stream = false, message } = body;
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      throw new Error("AI service is not configured. Please contact support.");
    }

    // Handle both 'message' (single string) and 'messages' (array) formats
    let chatMessages = [];
    if (messages && Array.isArray(messages)) {
      chatMessages = messages;
    } else if (message) {
      chatMessages = [{ role: "user", content: message }];
    } else {
      throw new Error("No message or messages provided");
    }

    console.log("Processing legal chat request for conversation:", conversationId);
    console.log("Message count:", chatMessages.length);
    console.log("Stream mode:", stream);

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
          ...chatMessages,
        ],
        stream: stream,
        temperature: 0.7,
        max_tokens: 4096,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ 
          error: "Our AI service is experiencing high demand. Please wait a moment and try again.",
          retry: true 
        }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ 
          error: "AI service temporarily unavailable. Please try again later.",
          retry: false 
        }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      
      return new Response(JSON.stringify({ 
        error: "We encountered an issue processing your request. Please try again.",
        retry: true 
      }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Return streaming response or JSON based on request
    if (stream) {
      return new Response(response.body, {
        headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
      });
    } else {
      const data = await response.json();
      const aiResponse = data.choices?.[0]?.message?.content || "I apologize, but I was unable to process your request. Please try rephrasing your question.";
      console.log("AI response received, length:", aiResponse.length);
      
      return new Response(JSON.stringify({ response: aiResponse }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
  } catch (error) {
    console.error("Legal chat error:", error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : "An unexpected error occurred. Please try again.",
      retry: true 
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
