export async function getAIQuestions(resumeText) {
  // Simulate AI question generation
  if (!resumeText) return [
    "Tell me about yourself.",
    "What are your strengths?",
    "Why do you want this role?"
  ]
  const keywords = resumeText.split(/\s+/).slice(0, 3).join(', ')
  return [
    `Based on your experience with ${keywords}, what achievement are you most proud of?`,
    "How do your skills fit this position?",
    "What motivates you in your career?"
  ]
}

export async function getAIFeedback(answers, resumeText) {
  // Simulate AI feedback and scoring
  let score = 60
  Object.values(answers).forEach(ans => {
    if (ans.length > 20) score += 10
  })
  score = Math.min(score, 100)
  return {
    feedback: "Gemini: Your answers show good self-awareness and motivation. Keep practicing for more confidence!",
    score
  }
}