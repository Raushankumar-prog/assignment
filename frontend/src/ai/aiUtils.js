import { ASK_AI } from "../query/askAi";
import client from "../query/apolloClient";


export async function getAIQuestions(resumeText) {
  const titlePrompt =
    "Generate 6 interview questions in Markdown format for a Full Stack role (React, Node, Express.js, Prisma): two easy, two medium, two hard.";

  const { data } = await client.mutate({
    mutation: ASK_AI,
    variables: { message: titlePrompt },
  });

  const responseText = data?.askAI?.response || "";

  // Return as markdown string
  return responseText;
}



export async function getAIFeedback(answers, resumeText) {
  let score = 60;
  Object.values(answers).forEach((ans) => {
    if (ans.length > 20) score += 10;
  });
  score = Math.min(score, 100);

  return {
    feedback:
      "Gemini: Your answers show good self-awareness and motivation. Keep practicing for more confidence!",
    score,
  };
}
