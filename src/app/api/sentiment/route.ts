// src/app/api/sentiment/route.ts
import { Langbase } from 'langbase';
import { NextResponse } from 'next/server';  // Add this import

export const runtime = 'edge';

export async function POST(req: Request) {
    try {
        if (!process.env.LANGBASE_AI_PIPE_SENTIMENT_API_KEY) {
            return NextResponse.json(  // Change to NextResponse
                { error: 'Please set LANGBASE_AI_PIPE_SENTIMENT_API_KEY in your environment variables.' },
                { status: 500 }
            );
        }

        const body = await req.json();
        const { email } = body;

        const langbase = new Langbase();

        const sentiment = await langbase.pipe.run({
            apiKey: process.env.LANGBASE_AI_PIPE_SENTIMENT_API_KEY,
            messages: [],
            variables: [
                {
                    name: 'email',
                    value: email
                }
            ]
        });

        // Parse JSON response from Langbase
        const response = JSON.parse(sentiment.completion);  // Remove : JSON type annotation

        return NextResponse.json(response);  // Change to NextResponse
    } catch (error: any) {
        console.error('Uncaught API Error:', error);
        return NextResponse.json(  // Change to NextResponse
            { error: error.message || 'An error occurred' },
            { status: 500 }
        );
    }
}
