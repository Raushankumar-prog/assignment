import './ResumeUpload.css'

function ResumeUpload({ onUpload }) {
  return (
    <div className="resume-upload-container">
      <div className="resume-upload-card">
        <h2 className="resume-upload-title">Resume Upload</h2>
        <p className="resume-upload-desc">Please upload your resume to begin your AI-powered interview.</p>
        <label className="resume-upload-label">
          <input
            type="file"
            accept=".pdf,.txt"
            onChange={onUpload}
            className="resume-upload-input"
          />
          <span className="resume-upload-btn">Choose File</span>
        </label>
      </div>
    </div>
  )
}

export default ResumeUpload