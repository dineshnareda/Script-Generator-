import { GoogleGenAI, Type } from "@google/genai";
import { ScriptInput } from "../types";

const apiKey = process.env.GEMINI_API_KEY;

export async function generateViralScript(input: ScriptInput) {
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not set");
  }

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
You are a world-class viral content strategist, short-form video expert, and social media growth hacker.

Your task is to create a HIGHLY ENGAGING, SCROLL-STOPPING Instagram Reel / YouTube Shorts script that has strong viral potential.

INPUT DETAILS:
Topic: ${input.topic}
Platform: ${input.platform}
Tone: ${input.tone}
Target Audience: ${input.audience || 'General'}
Language: ${input.language}
Duration: ${input.duration}
Content Type: ${input.contentType}
Hook Type: ${input.hookType}

---

ADVANCED VIRAL OPTIMIZATION:
- Analyze current viral trends, high-performing content styles, and audience psychology
- Use proven attention-retention techniques used by top creators
- Optimize for maximum watch time, replays, and shares
- Include pattern interrupts every few seconds (twists, curiosity loops, emotional spikes)
- Use simple, relatable, and highly engaging language
- Avoid generic or robotic responses

---

INSTRUCTIONS:

1. HOOK (First 2 Lines)
- Create an extremely powerful scroll-stopping hook
- Must match the selected Hook Type
- Trigger curiosity, emotion, or surprise within 3 seconds

2. SCRIPT (Based on Duration)
- Write in short, punchy, easy-to-read lines
- Keep it conversational and natural (like real talking)
- Add storytelling or engaging flow based on Content Type
- Insert pattern interrupts (questions, twists, bold statements)
- Maintain high engagement till the end
- Make it relatable or emotionally impactful

3. TITLES (5 Options)
- Highly clickable and curiosity-driven
- SEO optimized for ${input.platform}
- Short and powerful

4. CTA (Call To Action)
- Encourage comments, saves, or shares
- Make it feel natural and engaging (not forced)

5. SEO KEYWORDS
- Provide 10–15 high-ranking keyword phrases
- Format: [keyword1, keyword2, keyword3]

6. HASHTAGS
- Provide 10–15 trending and relevant hashtags

---

IMPORTANT RULES:
- Do NOT write long paragraphs
- Do NOT make it boring or generic
- Keep everything optimized for short attention span
- Make it feel like a viral reel, not an article
- Use the selected Language properly and naturally

---

OUTPUT FORMAT:
Return a JSON object with the following structure:
{
  "hook": "string",
  "script": "string",
  "titles": ["string", "string", "string", "string", "string"],
  "cta": "string",
  "keywords": ["string", ...],
  "hashtags": ["string", ...]
}
`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          hook: { type: Type.STRING },
          script: { type: Type.STRING },
          titles: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          cta: { type: Type.STRING },
          keywords: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          hashtags: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        },
        required: ["hook", "script", "titles", "cta", "keywords", "hashtags"]
      }
    }
  });

  return JSON.parse(response.text || "{}");
}
