// import OpenAI from "openai";
// import { NextResponse } from "next/server";

// const client = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// export async function POST(req) {
//   try {
//     const { message } = await req.json();

//     if (!message) {
//       return NextResponse.json({ error: "Message is required" }, { status: 400 });
//     }

//     const response = await client.responses.create({
//       model: "gpt-4.1-mini", // faster + cheaper, use gpt-4.1 or gpt-4o for production
//       input: message,
//     });

//     const reply =
//       response.output?.[0]?.content?.[0]?.text ||
//       "⚠️ No response generated.";

//     return NextResponse.json({ reply });
//   } catch (error) {
//     console.error("Chat API Error:", error);

//     if (error.response?.status === 429) {
//       return NextResponse.json(
//         { reply: "⚠️ Quota exceeded. Please check your OpenAI billing." },
//         { status: 200 }
//       );
//     }

//     if (error.response?.status === 401) {
//       return NextResponse.json(
//         { reply: "⚠️ Invalid or missing OpenAI API key." },
//         { status: 200 }
//       );
//     }

//     return NextResponse.json(
//       { error: "Failed to fetch AI response" },
//       { status: 500 }
//     );
//   }
// }



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
