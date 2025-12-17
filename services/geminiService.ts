
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

export async function suggestRegexForRule(description: string): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `生成一个适用于 JavaScript 的正则表达式，用于匹配描述为 "${description}" 的短信。只返回正则字符串，不要包含反引号或其他文字解释。`,
    });
    return response.text?.trim() || ".*";
  } catch (error) {
    console.error("AI Regex Generation failed:", error);
    return ".*";
  }
}

export async function analyzeSMS(content: string): Promise<{ isSpam: boolean; reason: string; suggestedRegex: string }> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `分析以下短信内容： "${content}"。判断它是否为垃圾信息或诈骗信息，并给出中文理由，同时提供一个可以拦截此类信息的正则表达式。`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            isSpam: { type: Type.BOOLEAN },
            reason: { type: Type.STRING },
            suggestedRegex: { type: Type.STRING },
          },
          required: ["isSpam", "reason", "suggestedRegex"]
        }
      }
    });
    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("AI Analysis failed:", error);
    return { isSpam: false, reason: "分析出错", suggestedRegex: ".*" };
  }
}
