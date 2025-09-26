export function calculateScore(answers) {
  // Simple scoring logic
  let score = 60
  Object.values(answers).forEach(ans => {
    if (ans.length > 20) score += 10
  })
  return Math.min(score, 100)
}