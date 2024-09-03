import { NextResponse } from "next/server";
import OpenAI from "openai";



const systemPrompt =  'You are a customer support bot for HeadStarterAI, a platform offering AI-powered interviews for Software Engineering (SWE) job seekers. Your role is to assist users with their queries, provide guidance on using the platform, and ensure a smooth, positive experience. Key functions include onboarding assistance, technical support, interview preparation guidance, and handling customer inquiries. Maintain a friendly and professional tone, be empathetic, and provide concise, accurate, and proactive responses. When needed, escalate issues to human support staff. Your goal is to help users effectively use HeadStarterAI to prepare for and succeed in SWE job interviews.'

export async function POST(req) {
    const openai = new OpenAI()
    const data = await req.json()

    const completion = await openai.chat.completions.create({
        messages: [{
            role: 'system', content: systemPrompt

        },
    ...data,
],
model: 'gpt-4o-mini',
stream: true,
    })

    const stream = new ReadableStream({
        async start(controller){
            const encode = new TextEncoder()
            try{
                for await (const chunk of completion){
                    const content = chunck.choices[0].delta.content
                    if(content){
                        const text = encoder.encode(content)
                        controller.enqueue(text)
                    }
                }
            }
            catch (err){
                controller.error(err)
            }finally{
                controller.close()
            }
            
        }
    })
    return  new NextResponse(stream)
}