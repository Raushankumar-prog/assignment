
import { useState } from "react";
import ResumeUpload from "./components/ResumeUpload";
import { parsePDF } from "./pdf/pdfUtils";
import { getAIQuestions } from "./ai/aiUtils";
import UsingReactMarkdown from "./ai/reactMarkdown";
import "./App.css";

function App() {
  const [resume, setResume] = useState("");
  const [step, setStep] = useState("upload");
  const [markdownQuestions, setMarkdownQuestions] = useState("");

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

    const aiMarkdown = await getAIQuestions(text);
    setMarkdownQuestions(aiMarkdown);

    setStep("interview");
  };

  return (
    <div className="app-container">
      <h1>AI-Powered Interview Assistant</h1>
      {step === "upload" && <ResumeUpload onUpload={handleResumeUpload} />}
      {step === "interview" && (
        <div className="markdown-section">
          <UsingReactMarkdown markdown={markdownQuestions} />
        </div>
      )}
    </div>
  );
}

export default App;
