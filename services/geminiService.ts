import { GoogleGenAI, Type, Modality } from "@google/genai";
import { ModelProfile, CustomizationSettings, Message, DetectedFallacy } from "../types";

export interface AIResponse { responseText: string; fallacies?: DetectedFallacy[]; }

export class GeminiService {
  private ai: GoogleGenAI;
  constructor() {
    // Check localStorage first, then fall back to env variable or hardcoded key
    const storedKey = typeof window !== 'undefined' ? localStorage.getItem('gemini_api_key') : null;
    const apiKey = storedKey || import.meta.env.VITE_API_KEY || 'AIzaSyDIKXOKKzg6pV0geAxR6SGzVctsm-ay2-k';
    if (!apiKey) {
      console.warn('API key is not set. Please configure it using the key icon in the header.');
    }
    this.ai = new GoogleGenAI({ apiKey });
  }

  async analyzeDNA(filesContent: string): Promise<Omit<ModelProfile, 'id'>> {
    const response = await this.ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Analyze to extract DNA model: ${filesContent}`,
      config: {
        thinkingConfig: { thinkingBudget: 4000 },
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            summary: { type: Type.STRING },
            metrics: {
              type: Type.OBJECT,
              properties: {
                behavioralTraits: { type: Type.ARRAY, items: { type: Type.STRING } },
                epistemology: { type: Type.STRING },
                moralAxioms: { type: Type.ARRAY, items: { type: Type.STRING } },
                rhetoricalStructure: { type: Type.STRING },
                linguisticPatterns: { type: Type.ARRAY, items: { type: Type.STRING } },
                cognitiveBiases: { type: Type.ARRAY, items: { type: Type.STRING } },
                valueHierarchy: { type: Type.ARRAY, items: { type: Type.STRING } },
                emotionalConstraints: { type: Type.STRING }
              },
              required: ['behavioralTraits', 'epistemology', 'moralAxioms', 'rhetoricalStructure', 'linguisticPatterns', 'cognitiveBiases', 'valueHierarchy', 'emotionalConstraints']
            }
          },
          required: ['name', 'summary', 'metrics']
        }
      }
    });
    return JSON.parse(response.text || '{}');
  }

  async generateResponse(profile: ModelProfile, history: Message[], settings: CustomizationSettings): Promise<AIResponse> {
    const systemInstruction = `IDENTITY: ${profile.name}. EPISTEMOLOGY: ${profile.metrics.epistemology}. VALUES: ${profile.metrics.valueHierarchy.join(' > ')}. AGGRESSIVENESS: ${settings.aggressiveness}. SKEPTICISM: ${settings.skepticism}.

CRITICAL INSTRUCTIONS FOR FALLACY DETECTION:
1. ACTIVELY DETECT logical fallacies, inconsistencies, and flawed reasoning in BOTH user messages AND your own responses.
2. When you detect a fallacy in a user's argument, explicitly point it out in your responseText and include it in the fallacies array.
3. When you detect a fallacy in your own reasoning, acknowledge it and correct yourself in the responseText.
4. For each detected fallacy, provide: the exact fallacy name, a clear description of why it's a fallacy, and the specific example from the conversation context.
5. Be thorough - check for: ad hominem, straw man, false dilemma, appeal to emotion, hasty generalization, post hoc, begging the question, red herring, slippery slope, and other logical fallacies.
6. Point out inconsistencies in arguments, contradictions, and unsupported claims.
7. Your responseText should naturally incorporate fallacy detection - don't just list them, explain why the reasoning is flawed.`;
    
    const response = await this.ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: history.map(msg => ({ role: msg.role === 'model' ? 'model' : 'user', parts: [{ text: msg.content }] })),
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            responseText: { type: Type.STRING },
            fallacies: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: { 
                  name: { type: Type.STRING }, 
                  description: { type: Type.STRING }, 
                  exampleFromContext: { type: Type.STRING } 
                },
                required: ['name', 'description', 'exampleFromContext']
              }
            }
          },
          required: ['responseText']
        }
      }
    });
    return JSON.parse(response.text || '{"responseText": "SILENCE"}');
  }

  async generateAudio(text: string): Promise<Uint8Array | null> {
    const response = await this.ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text }] }],
      config: { responseModalities: [Modality.AUDIO], speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } } } }
    });
    const base64 = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64) return null;
    const bin = atob(base64);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return bytes;
  }
}
export const gemini = new GeminiService();
