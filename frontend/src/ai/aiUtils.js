import { ASK_AI } from "../query/askAi";
import client from "../query/apolloClient";


export async function getAIQuestions(resumeText) {
  const titlePrompt =
    "Generate 6 interview questions in Markdown format for a Full Stack role (React, Node, Express.js, Prisma): two easy, two medium, two hard. in json format";

  const { data } = await client.mutate({
    mutation: ASK_AI,
    variables: { message: titlePrompt },
  });

  const responseText = data?.askAI?.response || "";

  // Return as markdown string
  return responseText;
}


export async function getAIFeedback(questions, answers) {
  // Build Q&A context for AI
  const qaPairs = questions.map((q, i) => {
    return `Q${i + 1}: ${q.question}\nA${i + 1}: ${answers[`q${i}`] || "No answer"}`;
  }).join("\n\n");

  const titlePrompt = `${qaPairs}\n\nGive an overall feedback on the answers and also provide a score out of 100. 
Return JSON in this format:
{
  "feedback": "string",
  "score": number
}`;

  const { data } = await client.mutate({
    mutation: ASK_AI,
    variables: { message: titlePrompt },
  });

  const responseText = data?.askAI?.response || "";

  // Try parsing AI response as JSON
  try {
    let cleaned = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
    return JSON.parse(cleaned);
  } catch (err) {
    console.error("Failed to parse AI feedback:", err, responseText);
    return { feedback: responseText, score: 0 }; // fallback
  }
}

