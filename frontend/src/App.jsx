// App.jsx
import { useState } from "react";
import ResumeUpload from "./components/ResumeUpload";
import { parsePDF, extractContactInfo } from "./pdf/pdfUtils";
import { getAIQuestions, getAIFeedback } from "./ai/aiUtils";
import UsingReactMarkdown from "./ai/reactMarkdown";
import "./App.css";

function App() {
  const [resume, setResume] = useState("");
  const [step, setStep] = useState("upload");

  // Default initialized values
  const [contactInfo, setContactInfo] = useState({
    name: "Raushan ....",
    phone: "87578xxxx",   // your first 5 digits + xxxx
    email: "xyz@gmail.com"
  });

  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [feedback, setFeedback] = useState("");
  const [score, setScore] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const extractJSONArray = (text) => {
    try {
      let cleaned = text.replace(/```json/g, "").replace(/```/g, "").trim();
      const match = cleaned.match(/\[\s*{[\s\S]*}\s*\]/);
      if (match) return JSON.parse(match[0]);
      return JSON.parse(cleaned);
    } catch (e) {
      console.error("Failed JSON parse:", e, text);
      return null;
    }
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    let text = "";
    if (file.type === "application/pdf") {
      text = await parsePDF(file);
    } else {
      const reader = new FileReader();
      text = await new Promise((resolve) => {
        reader.onload = (ev) => resolve(ev.target.result);
        reader.readAsText(file);
      });
    }

    setResume(text);

    // Extract and update contact info (will replace defaults)
    const info = extractContactInfo(text);
    setContactInfo(info);

    setLoading(true);
    setStep("loading")
    setError("");

    try {
      const aiResponse = await getAIQuestions(text);
      const parsed = extractJSONArray(aiResponse);
      if (!parsed || !Array.isArray(parsed)) {
        throw new Error("AI response did not contain a valid JSON array.");
      }

      setQuestions(parsed);
      setStep("interview");
      setCurrentIdx(0);
    } catch (err) {
      console.error("Error parsing AI questions:", err);
      setError("Failed to load AI questions. Please try again.");
      setStep("error");
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (e) => {
    setAnswers({ ...answers, [`q${currentIdx}`]: e.target.value });
  };

  const handleNext = () => {
    if (currentIdx + 1 < questions.length) {
      setCurrentIdx(currentIdx + 1);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const aiResult = await getAIFeedback(questions, answers);
      setFeedback(aiResult.feedback);
      setScore(aiResult.score);
      setStep("result");
    } catch (err) {
      console.error(err);
      setError("Failed to get feedback from AI.");
      setStep("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      {/* Candidate Info (shows defaults first, then updates after upload) */}
      {contactInfo?.name && (
        <div className="candidate-info">
          <span>Candidate: {contactInfo.name}</span>
          {contactInfo.email && <p>Email: {contactInfo.email}</p>}
          {contactInfo.phone && <p>Phone: {contactInfo.phone}</p>}
        </div>
      )}

      <h1>AI-Powered Interview Assistant</h1>

      {step === "upload" && <ResumeUpload onUpload={handleResumeUpload} />}
      {step==="loading" && (
         <div className="loader-container">
      <div className="spinner"></div>
      <p className="loading-text">Loading your AI interview...</p>
    </div>
      )}
      {step === "error" && <p className="error">{error}</p>}

      {step === "interview" && questions.length > 0 && (
          <div className="interview-section">
  <div className="question">
    <UsingReactMarkdown markdown={questions[currentIdx].question} />
  </div>

  <div className="answer-box">
    <textarea
      value={answers[`q${currentIdx}`] || ""}
      onChange={handleAnswerChange}
      placeholder="Type your answer here..."
      rows={6}
    />
    <button onClick={handleNext}>
      {currentIdx + 1 < questions.length ? "Next Question" : "Submit Interview"}
    </button>
  </div>
</div>

      )}

      {step === "result" && (
        <div className="result-section">
          <h2>Interview Feedback</h2>
          <UsingReactMarkdown markdown={feedback} />
          <p>
            <b>Score:</b> {score}/100
          </p>
        </div>
      )}
    </div>
  );
}

export default App;
