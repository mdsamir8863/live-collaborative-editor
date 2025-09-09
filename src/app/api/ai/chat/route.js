import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req) {
  try {
    const { messages } = await req.json();

    if (!process.env.GEMINI_API_KEY) {
      return new Response(
        JSON.stringify({ error: "Missing GEMINI_API_KEY in environment." }),
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // free & fast

    // last user message
    const userMessage = messages[messages.length - 1]?.content || "";

    const result = await model.generateContent(userMessage);
    const reply = result.response.text();

    return new Response(JSON.stringify({ reply }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Gemini API Error:", err);
    return new Response(
      JSON.stringify({ error: "Failed to connect Gemini API" }),
      { status: 500 }
    );
  }
}
