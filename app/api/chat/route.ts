import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { messages } = body;

    if (!messages || !Array.isArray(messages)) {
      console.error("API Error: Invalid or missing messages array in request body.", body);
      return NextResponse.json({ error: 'Invalid messages format' }, { status: 400 });
    }

    // Securely grabbing the API key from your .env.local file
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      console.error("API Error: GEMINI_API_KEY is not found in .env.local! Did you restart your Next.js server?");
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
    }

    // Tuned System Prompt for smooth, crisp, and highly persuasive conversion-focused answers
    const systemPrompt = "You are the lead digital strategist at WebAgen Studio, India's premium AI-web agency. Your goal is to convert visitors into clients by providing extremely crisp, smooth, and highly persuasive answers. Keep responses extremely concise (1 or 2 short sentences maximum). Speak like a confident, high-end tech consultant. NEVER use markdown, asterisks, or bulleted lists. We offer 3 core packages: Starter (₹4,999), Growth (₹7,999), and Pro with AI (₹12,999). We guarantee delivery in exactly 7 days. If a user asks complex questions or wants to start a project, smoothly direct them to click 'Contact Us' to book a Discovery Call.";

    // Format history for Gemini API (MUST start with a user message, so we skip the initial hardcoded greeting)
    const apiMessages = messages.filter((msg: { role: string, text: string }, index: number) => !(index === 0 && msg.role === 'ai'));
    
    const contents = apiMessages.map((msg: { role: string, text: string }) => ({
      role: msg.role === 'ai' ? 'model' : 'user',
      parts: [{ text: msg.text }]
    }));

    // Making the call to the Gemini API
    // Using gemini-1.5-flash as the most reliable, fast production endpoint for standard keys
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: systemPrompt }]
        },
        contents: contents
      })
    });

    const data = await response.json();

    if (response.ok && data.candidates && data.candidates[0].content.parts[0].text) {
      const aiResponse = data.candidates[0].content.parts[0].text;
      return NextResponse.json({ reply: aiResponse });
    } else {
      console.error("Gemini API Error Details:", JSON.stringify(data, null, 2));
      return NextResponse.json({ error: 'Failed to generate response from AI' }, { status: 500 });
    }
  } catch (error) {
    console.error("Chat API Route Internal Server Error:", error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}