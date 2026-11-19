import { NextResponse } from 'next/server';

type ChatMessage = {
  role: 'ai' | 'user';
  text: string;
};

const CONTACT_REPLY =
  'Contact WebAgen Studio at company@webagen.dev or call +91 63098 47855. You can also WhatsApp us at https://wa.me/916309847855.';

function getFallbackReply(message: string) {
  const normalizedMessage = message.toLowerCase();

  if (/\b(contact|email|phone|call|whatsapp|get in touch)\b/.test(normalizedMessage)) {
    return CONTACT_REPLY;
  }

  if (/\b(price|pricing|packages?|cost|how much)\b/.test(normalizedMessage)) {
    return 'WebAgen packages are Starter (₹4,999), Growth (₹7,999), and Pro with AI (₹12,999). Contact us at company@webagen.dev or +91 63098 47855 to discuss the right fit.';
  }

  if (/\b(delivery|timeline|how long|days)\b/.test(normalizedMessage)) {
    return 'Our standard website delivery timeline is 7 days. Contact us at company@webagen.dev or +91 63098 47855 to discuss your project.';
  }

  if (/\b(services?|websites?|web development|chatbots?|what do you do)\b/.test(normalizedMessage)) {
    return 'WebAgen builds websites, web apps, and AI chatbot integrations for businesses. Contact us at company@webagen.dev or +91 63098 47855 to discuss your needs.';
  }

  return `AI replies are temporarily unavailable, but you can still reach WebAgen Studio at company@webagen.dev or +91 63098 47855.`;
}

export async function POST(req: Request) {
  let body: unknown;

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  if (!body || typeof body !== 'object' || !('messages' in body) || !Array.isArray(body.messages)) {
    return NextResponse.json({ error: 'Invalid messages format' }, { status: 400 });
  }

  const messages = body.messages as unknown[];
  const isValidMessage = (message: unknown): message is ChatMessage =>
    typeof message === 'object' &&
    message !== null &&
    'role' in message &&
    (message.role === 'ai' || message.role === 'user') &&
    'text' in message &&
    typeof message.text === 'string' &&
    message.text.length <= 2000;

  if (
    messages.length === 0 ||
    messages.length > 20 ||
    !messages.every(isValidMessage) ||
    !messages.some((message) => message.role === 'user')
  ) {
    return NextResponse.json({ error: 'Invalid messages format' }, { status: 400 });
  }

  const chatMessages = messages as ChatMessage[];
  const latestUserMessage = [...chatMessages].reverse().find((message) => message.role === 'user');

  if (!latestUserMessage) {
    return NextResponse.json({ error: 'A user message is required' }, { status: 400 });
  }

  if (/\b(contact|email|phone|call|whatsapp|get in touch)\b/i.test(latestUserMessage.text)) {
    return NextResponse.json({ reply: CONTACT_REPLY });
  }

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.error('Chat API is unavailable: GEMINI_API_KEY is not configured.');
    return NextResponse.json(
      { error: 'AI replies are not configured', reply: getFallbackReply(latestUserMessage.text) },
      { status: 503 },
    );
  }

  const systemPrompt =
    "You are the lead digital strategist at WebAgen Studio, India's premium AI-web agency. Your goal is to convert visitors into clients by providing extremely crisp, smooth, and highly persuasive answers. Keep responses extremely concise (1 or 2 short sentences maximum). Speak like a confident, high-end tech consultant. NEVER use markdown, asterisks, or bulleted lists. We offer 3 core packages: Starter (₹4,999), Growth (₹7,999), and Pro with AI (₹12,999). We guarantee delivery in exactly 7 days. If a user asks for contact details or asks how to contact us, provide company@webagen.dev, +91 63098 47855, and https://wa.me/916309847855. If a user asks complex questions or wants to start a project, smoothly direct them to click 'Contact Us' to book a Discovery Call.";

  const apiMessages = chatMessages.filter(
    (message, index) => !(index === 0 && message.role === 'ai'),
  );
  const contents = apiMessages.map((message) => ({
    role: message.role === 'ai' ? 'model' : 'user',
    parts: [{ text: message.text }],
  }));

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: systemPrompt }]
        },
        contents: contents
      })
      },
    );

    const data = await response.json();
    const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!response.ok || typeof aiResponse !== 'string' || !aiResponse.trim()) {
      console.error('Gemini API request failed:', data.error?.message ?? response.statusText);
      return NextResponse.json(
        { error: 'Failed to generate response from AI', reply: getFallbackReply(latestUserMessage.text) },
        { status: 503 },
      );
    }

    return NextResponse.json({ reply: aiResponse });
  } catch (error) {
    console.error("Chat API Route Internal Server Error:", error);
    return NextResponse.json(
      { error: 'AI service is unavailable', reply: getFallbackReply(latestUserMessage.text) },
      { status: 503 },
    );
  }
}