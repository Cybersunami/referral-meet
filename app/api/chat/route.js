import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

export async function POST(req, res) {
    try {
        const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY)
        const model = genAI.getGenerativeModel({model:'gemini-pro'})
        const data = await req.json()
        const prompt = data.prompt
        const result = await model.generateContent(prompt)
        const response = result.response;
        const output = response.candidates[0].content.parts[0].text
        return NextResponse.json({output:output})
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })        
    }
}
