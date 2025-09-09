import { NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are an assistant that edits text based on instructions.`,
        },
        {
          role: "user",
          content: `Instruction: ${instruction}\n\nText: ${text}`,
        },
      ],
    });

    const suggestion = response.choices[0]?.message?.content?.trim();

    console.log("✅ AI Suggestion:", suggestion);

    return NextResponse.json({ suggestion });
  } catch (error) {
    console.error("❌ Edit API Error:", error);

    return NextResponse.json(
      { error: "Failed to fetch AI edit suggestion." },
      { status: 500 }
    );
  }
}
