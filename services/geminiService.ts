import { GoogleGenAI, Type } from "@google/genai";
import { ChatMessage, MessageSender, MarketNode } from '../types';

// Get API key from Vite environment variables
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.VITE_API_KEY;

if (!API_KEY) {
  console.error("API key not found. Please set VITE_GEMINI_API_KEY in your environment variables.");
  throw new Error("API key not configured");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export const getInitialAnalysis = async (idea: string): Promise<string> => {
  try {
    const prompt = `
      You are an expert startup analyst. A user has provided a startup idea.
      Your task is to provide a concise, high-value summary in three parts.
      1. Identify the market category for this idea.
      2. List 2-3 potential key competitors.
      3. List 2-3 common challenges in this market space.

      Format your response exactly as follows, using markdown for bolding and newlines between sections:
      **Market:** [Your market analysis]
      **Key Players:** [Competitor A, Competitor B]
      **Common Challenges:** [Challenge 1, Challenge 2]

      User's Idea: "${idea}"
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    return response.text;
  } catch (error) {
    console.error("Error getting initial analysis:", error);
    return "There was an error analyzing your idea. Please check your API key and try again.";
  }
};


export const continueConversation = async (history: ChatMessage[], newText: string): Promise<string> => {
    try {
        const fullHistory = [
            ...history.map(msg => ({
                role: msg.sender === MessageSender.User ? 'user' : 'model',
                parts: [{text: msg.text}]
            }))
        ];

        const chat = ai.chats.create({
            model: 'gemini-2.5-flash',
            config: {
                systemInstruction: `You are an AI co-founder, a Socratic partner designed to help users validate their startup ideas.
Your goal is to challenge assumptions, encourage metric-driven thinking, and deconstruct the problem using first principles.
- Ask probing, open-ended questions.
- If the user provides an answer, challenge it constructively. Ask "Why?" or "What data supports that?"
- Guide the user to think about key metrics like Impact, Demand, and Market Fit.
- Keep your responses concise and conversational.
- Your persona is supportive but rigorous. You are here to strengthen the idea, not just agree with it.
- Never break character.`
            },
            history: fullHistory
        });
        
        const response = await chat.sendMessage({ message: newText });

        return response.text;
    } catch (error) {
        console.error("Error continuing conversation:", error);
        return "An error occurred. Please try again.";
    }
};

export const generateValidationDocument = async (history: ChatMessage[]): Promise<string> => {
  try {
    const conversation = history.map(msg => `${msg.sender}: ${msg.text}`).join('\n');
    const prompt = `
      You are a business analyst tasked with creating a professional validation document.
      Based on the following conversation between an entrepreneur and an AI co-founder, generate a structured summary.

      The document should have the following sections:
      1.  **Problem Statement:** A clear definition of the problem being solved.
      2.  **Proposed Solution:** A description of the proposed product or service.
      3.  **Key Metrics Analysis:** A summary of the discussion around Impact, Demand, Market Fit, and other relevant metrics.
      4.  **First Principles Breakdown:** A summary of the core assumptions that were challenged and the foundational truths identified.
      5.  **Final Recommendation:** A concluding thought on the viability of the concept and next steps.

      Format the output in clean Markdown.

      Conversation History:
      ${conversation}
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-pro',
      contents: prompt,
    });

    return response.text;
  } catch (error) {
    console.error("Error generating document:", error);
    return "Failed to generate the validation document.";
  }
};

const marketNodeSchema = {
    type: Type.OBJECT,
    properties: {
        name: { type: Type.STRING, description: 'The concise name for the sub-market or business idea.' },
        probability: { type: Type.INTEGER, description: 'Estimated percentage probability (1-100) of high profitability.' },
        details: { type: Type.STRING, description: 'For leaf nodes (specific business ideas), provide a brief 1-2 sentence description of the problem it solves. Omit for parent categories.' },
        children: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    name: { type: Type.STRING },
                    probability: { type: Type.INTEGER },
                    details: { type: Type.STRING },
                    children: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                name: { type: Type.STRING },
                                probability: { type: Type.INTEGER },
                                details: { type: Type.STRING }
                            }
                        }
                    }
                }
            }
        }
    },
    required: ['name', 'probability']
};

export const generateMarketTree = async (marketName: string): Promise<MarketNode | null> => {
    try {
        const prompt = `
        For the market "${marketName}", generate a hierarchical tree structure of potential sub-markets and niche business ideas that are projected to grow and become highly profitable in the next 5 years.
        The structure should be a JSON object.
        Each node in the tree must have:
        1.  "name" (string): A concise name for the sub-market or business idea.
        2.  "probability" (integer between 1 and 100): Your estimated percentage probability of this niche achieving high profitability.
        3.  "children" (array of nodes, optional): For broader categories, list more specific ideas under them. Leaf nodes (specific business ideas) should not have a "children" property.
        4.  "details" (string, optional): For leaf nodes ONLY, provide a brief 1-2 sentence description of the opportunity or the problem it solves. This property should be omitted for parent nodes that have children.

        The root of the tree should represent the overall market. Create a rich tree with at least 2 levels of depth.
        `;
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: marketNodeSchema,
            },
        });

        const jsonText = response.text.trim();
        if (jsonText.startsWith('{') && jsonText.endsWith('}')) {
            return JSON.parse(jsonText) as MarketNode;
        }
        console.error("Failed to parse JSON response for market tree:", jsonText);
        return null;

    } catch (error) {
        console.error(`Error generating market tree for ${marketName}:`, error);
        return null;
    }
};
