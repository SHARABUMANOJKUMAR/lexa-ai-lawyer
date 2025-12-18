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
const MAX_MESSAGE_LENGTH = 10000;
const MAX_MESSAGES = 50;

const sanitizeInput = (input: string): string => {
  if (typeof input !== 'string') return '';
  return input
    .replace(/[\x00-\x1F\x7F]/g, '') // Remove control characters
    .trim()
    .slice(0, MAX_MESSAGE_LENGTH);
};

const validateMessages = (messages: any[]): { valid: boolean; error?: string; sanitized?: any[] } => {
  if (!Array.isArray(messages)) {
    return { valid: false, error: "Messages must be an array" };
  }
  if (messages.length === 0) {
    return { valid: false, error: "At least one message is required" };
  }
  if (messages.length > MAX_MESSAGES) {
    return { valid: false, error: `Maximum ${MAX_MESSAGES} messages allowed` };
  }

  const sanitized = [];
  for (const msg of messages) {
    if (!msg || typeof msg !== 'object') {
      return { valid: false, error: "Invalid message format" };
    }
    const role = msg.role;
    if (!['user', 'assistant', 'system'].includes(role)) {
      return { valid: false, error: "Invalid message role" };
    }
    const content = sanitizeInput(msg.content || '');
    if (content.length === 0) {
      return { valid: false, error: "Message content cannot be empty" };
    }
    sanitized.push({ role, content });
  }

  return { valid: true, sanitized };
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
    const { messages, conversationId, stream = false, message } = body;
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      throw new Error("AI service is not configured. Please contact support.");
    }

    // Validate and sanitize input
    let chatMessages = [];
    if (messages && Array.isArray(messages)) {
      const validation = validateMessages(messages);
      if (!validation.valid) {
        return new Response(JSON.stringify({ error: validation.error }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      chatMessages = validation.sanitized!;
    } else if (message) {
      const sanitizedMessage = sanitizeInput(message);
      if (sanitizedMessage.length === 0) {
        return new Response(JSON.stringify({ error: "Message cannot be empty" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      chatMessages = [{ role: "user", content: sanitizedMessage }];
    } else {
      return new Response(JSON.stringify({ error: "No message or messages provided" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log("Processing legal chat request for user:", user.id, "conversation:", conversationId);
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
      error: "An unexpected error occurred. Please try again.",
      retry: true 
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
