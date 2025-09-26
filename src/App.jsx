import { useState } from 'react'
import ResumeUpload from './components/ResumeUpload'
import { parsePDF } from './pdf/pdfUtils'
import { getAIQuestions, getAIFeedback } from './ai/aiUtils'
import './App.css'

function App() {
  const [resume, setResume] = useState('')
  const [step, setStep] = useState('upload')
  const [answers, setAnswers] = useState({ q1: '', q2: '', q3: '' })
  const [feedback, setFeedback] = useState('')
  const [score, setScore] = useState(null)
  const [questions, setQuestions] = useState([
    "Tell me about yourself.",
    "What are your strengths?",
    "Why do you want this role?"
  ])

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0]
    if (file) {
      let text = ''
      if (file.type === 'application/pdf') {
        text = await parsePDF(file)
      } else {
        const reader = new FileReader()
        text = await new Promise(resolve => {
          reader.onload = ev => resolve(ev.target.result)
          reader.readAsText(file)
        })
      }
      setResume(text)
      const aiQuestions = await getAIQuestions(text)
      setQuestions(aiQuestions)
      setStep('interview')
    }
  }

  const handleAnswerChange = (e, idx) => {
    setAnswers({ ...answers, [`q${idx + 1}`]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const aiResult = await getAIFeedback(answers, resume)
    setFeedback(aiResult.feedback)
    setScore(aiResult.score)
    setStep('result')
  }

  return (
    <div className="app-container">
      <h1>AI-Powered Interview Assistant</h1>
      {step === 'upload' && (
        <ResumeUpload onUpload={handleResumeUpload} />
      )}
      {step === 'interview' && (
        <form className="interview-section" onSubmit={handleSubmit}>
          {questions.map((q, idx) => (
            <div key={idx}>
              <label>{q}</label>
              <input
                type="text"
                value={answers[`q${idx + 1}`]}
                onChange={e => handleAnswerChange(e, idx)}
                required
              />
            </div>
          ))}
          <button type="submit">Submit Interview</button>
        </form>
      )}
      {step === 'result' && (
        <div className="result-section">
          <h2>Interview Feedback</h2>
          <p>{feedback}</p>
          <p><b>Score:</b> {score}/100</p>
        </div>
      )}
    </div>
  )
}

export default App
