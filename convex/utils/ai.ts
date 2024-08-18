import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY as string;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "application/json",
};

export async function generateCards(topic: string, card_count: number) {
  const prompt = `Make detailed and comprehensive q and a cards on ${topic}
include ${card_count} cards. The question should be marked by question and answer should be marked by answer.
Output format
{
  cards:[
{question:the question,answer:the answer}
  ]
}
`;
  const chatSession = model.startChat({
    generationConfig,
  });

  const result = await chatSession.sendMessage(prompt);
  return JSON.parse(result.response.text());
}
