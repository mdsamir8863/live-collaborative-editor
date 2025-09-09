import { NextResponse } from "next/server";

// Gemini API client
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

export async function POST(req) {
  try {
    const { text, instruction } = await req.json();

    if (!text || !instruction) {
      return NextResponse.json(
        { error: "Both 'text' and 'instruction' are required." },
        { status: 400 }
      );
    }

    console.log("✍️ Edit Request:", { text, instruction });

    // Gemini API call
    const response = await fetch("https://api.generative.ai/v1/models/gemini-1.5/edits", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${GEMINI_API_KEY}`,
      },
      body: JSON.stringify({
        input: text,
        instruction: instruction,
      }),
    });

    const data = await response.json();

    // Gemini response structure
    const suggestion = data?.candidates?.[0]?.content?.[0]?.text?.trim() || "";

    console.log("✅ Gemini Suggestion:", suggestion);

    return NextResponse.json({ suggestion });
  } catch (error) {
    console.error("❌ Edit API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch Gemini edit suggestion." },
      { status: 500 }
    );
  }
}
