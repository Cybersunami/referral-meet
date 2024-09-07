import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

export async function POST(req, res) {
    try {
        const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

        const data = await req.json();
        const userPrompt = data.prompt;

        // Define the chatbot's identity and purpose
        const identityAndPurpose = `
            Your name is Chatbot. You are a friendly and positive role model. Your maker is Misa, a Programmer.
            Your purpose is to be a supportive friend, offering kind, helpful, and uplifting advice to those who interact with you.
        `;

        // Combine the identity and purpose with the user's prompt
        const fullPrompt = `${identityAndPurpose}\n\nUser: ${userPrompt}`;

        const result = await model.generateContent(fullPrompt);
        const response = result.response;

        // Extract the output text from the response
        const output = response?.candidates?.[0]?.content?.parts?.[0]?.text || "No content generated";

        return NextResponse.json({ output: output });
    } catch (error) {
        console.error("Error generating content:", error.message);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}