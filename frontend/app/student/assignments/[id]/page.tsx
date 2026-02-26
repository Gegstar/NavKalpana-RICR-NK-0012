"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Link2,
  Type,
  Clock,
  CheckCircle,
  AlertCircle,
  Award,
  MessageSquare,
  Upload,
  Send,
  X,
  Calendar,
  AlertTriangle,
  ChevronRight,
  FileUp,
  ExternalLink,
} from "lucide-react";
import styles from "@/styles/Assignment.module.css";
import { dashboardService } from "@/services/dashboard.services";
import { fileUploadService } from "@/services/fileupload.services";
import type {
  AssignmentWithSubmissionResponse,
  AssignmentData,
  SubmissionData,
} from "@/models/assignment-submission.model";
import toast from "react-hot-toast";

type SubmissionType = "file" | "text" | "link";

// Helper: map status for display
const getStatusDisplay = (
  status: string
): "NOT_SUBMITTED" | "SUBMITTED" | "LATE_SUBMITTED" | "EVALUATED" => {
  const map: Record<string, any> = {
    NOT_SUBMITTED: "NOT_SUBMITTED",
    SUBMITTED: "SUBMITTED",
    LATE_SUBMITTED: "LATE_SUBMITTED",
    EVALUATED: "EVALUATED",
    PENDING: "SUBMITTED",
    COMPLETED: "EVALUATED",
    GRADED: "EVALUATED",
  };
  return map[status] || "NOT_SUBMITTED";
};

export default function AssignmentPage() {
  const params = useParams();
  const router = useRouter();
  const assignmentId = params?.id ? Number(params.id) : null;

  const [data, setData] = useState<AssignmentWithSubmissionResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [selectedType, setSelectedType] = useState<SubmissionType>("file");
  const [formData, setFormData] = useState({
    file: null as File | null,
    text: "",
    link: "",
  });
  const [timeRemaining, setTimeRemaining] = useState("");
  const [isLate, setIsLate] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // --- Fetch assignment and submission ---
  useEffect(() => {
    if (!assignmentId) {
      setLoading(false);
      setApiError("No assignment ID provided");
      return;
    }
    fetchData();
  }, [assignmentId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setApiError(null);
      
      console.log("Fetching assignment with ID:", assignmentId);
      const res = await dashboardService.getAssignmentById(assignmentId!.toString());
      console.log("API Response:", res);
      
      if (!res || !res.assignment) {
        throw new Error("Invalid response from server");
      }
      
      setData(res);

      // Pre-fill form if existing submission
      if (res.submission) {
        setFormData({
          file: null,
          text: res.submission.textAnswer || "",
          link: res.submission.externalLink || "",
        });
        if (res.submission.textAnswer) setSelectedType("text");
        if (res.submission.externalLink) setSelectedType("link");
      }
    } catch (error: any) {
      console.error("Fetch error:", error);
      
      let errorMessage = "Failed to load assignment";
      if (error.response) {
        errorMessage = `Server error: ${error.response.status}`;
        console.error("Response data:", error.response.data);
      } else if (error.request) {
        errorMessage = "Cannot connect to server. Please check if backend is running.";
      } else {
        errorMessage = error.message || "Unknown error";
      }
      
      setApiError(errorMessage);
      toast.error(errorMessage);
      
      // Use mock data for development
      if (process.env.NODE_ENV === 'development') {
        console.log("Using mock data");
        const mockData: AssignmentWithSubmissionResponse = {
          assignment: {
            id: assignmentId || 1,
            title: "Sample Assignment (Development Mode)",
            description: "This is mock data because the API connection failed. Check your backend connection.",
            deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          submission: null,
          isSubmitted: false,
        };
        setData(mockData);
      }
    } finally {
      setLoading(false);
    }
  };

  // --- Countdown timer ---
  useEffect(() => {
    if (!data?.assignment) return;

    const deadline = new Date(data.assignment.deadline);
    const timer = setInterval(() => {
      const now = new Date();
      const diff = deadline.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeRemaining("Deadline passed");
        setIsLate(true);
        clearInterval(timer);
      } else {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        setTimeRemaining(
          days > 0
            ? `${days}d ${hours}h remaining`
            : hours > 0
            ? `${hours}h ${minutes}m remaining`
            : `${minutes}m remaining`
        );
        setIsLate(false);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [data?.assignment]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size must be less than 10MB");
      return;
    }
    setFormData((prev) => ({ ...prev, file }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignmentId || !data?.assignment) return;

    if (selectedType === "file" && !formData.file && !data?.submission?.fileUrl) {
      toast.error("Please select a file to upload");
      return;
    }
    if (selectedType === "text" && !formData.text.trim()) {
      toast.error("Please enter your answer");
      return;
    }
    if (selectedType === "link" && !formData.link.trim()) {
      toast.error("Please enter a link");
      return;
    }

    setSubmitting(true);
    const toastId = toast.loading("Submitting assignment...");

    try {
      let fileUrl = data?.submission?.fileUrl || "";

      if (formData.file) {
        const uploadRes = await fileUploadService.uploadFile(formData.file);
        fileUrl = uploadRes?.url || uploadRes?.fileUrl || "";
      }

      const formDataObj = new FormData();
      if (fileUrl) formDataObj.append("fileUrl", fileUrl);
      if (formData.text) formDataObj.append("textAnswer", formData.text);
      if (formData.link) formDataObj.append("externalLink", formData.link);

      await dashboardService.submitAssignment(assignmentId.toString(), formDataObj);
      toast.success("Assignment submitted successfully!", { id: toastId });
      await fetchData();
      setFormData({ file: null, text: "", link: "" });
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("Failed to submit. Please try again.", { id: toastId });
    } finally {
      setSubmitting(false);
    }
  };

  const StatusBadge = ({ status }: { status: string }) => {
    const display = getStatusDisplay(status);
    const config = {
      NOT_SUBMITTED: { label: "Not Submitted", color: "#64748B", icon: AlertCircle },
      SUBMITTED: { label: "Submitted", color: "#3B82F6", icon: CheckCircle },
      LATE_SUBMITTED: { label: "Late Submitted", color: "#F59E0B", icon: AlertTriangle },
      EVALUATED: { label: "Evaluated", color: "#10B981", icon: Award },
    };
    const { label, color, icon: Icon } = config[display as keyof typeof config];
    return (
      <span className={styles.statusBadge} style={{ backgroundColor: `${color}15`, color }}>
        <Icon size={14} /> {label}
      </span>
    );
  };

  // --- Loading state ---
  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner} />
        <p>Loading assignment...</p>
      </div>
    );
  }

  // --- API Error with retry button ---
  if (apiError && !data?.assignment) {
    return (
      <div className={styles.errorContainer}>
        <AlertCircle size={48} />
        <h2>Failed to Load Assignment</h2>
        <p>{apiError}</p>
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
          <button onClick={() => router.back()} className={styles.backButton}>
            Go Back
          </button>
          <button onClick={fetchData} className={styles.retryButton}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!data?.assignment) {
    return (
      <div className={styles.errorContainer}>
        <AlertCircle size={48} />
        <h2>Assignment Not Found</h2>
        <button onClick={() => router.back()} className={styles.backButton}>
          Go Back
        </button>
      </div>
    );
  }

  const { assignment, submission, isSubmitted } = data;
  const deadline = new Date(assignment.deadline);

  return (
    <div className={styles.container}>
      {/* Development mode indicator */}
      {process.env.NODE_ENV === 'development' && !apiError && (
        <div style={{ 
          background: '#f0f9ff', 
          padding: '0.5rem 1rem', 
          borderRadius: '8px',
          marginBottom: '1rem',
          fontSize: '0.9rem',
          color: '#0369a1'
        }}>
          🔧 Development Mode - Connected to: {process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}
        </div>
      )}

      {/* Header */}
      <motion.div
        className={styles.header}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className={styles.headerLeft}>
          <h1 className={styles.title}>{assignment.title}</h1>
          <div className={styles.metaInfo}>
            <span className={styles.metaItem}>
              <Calendar size={16} />
              Deadline: {deadline.toLocaleDateString()} at {deadline.toLocaleTimeString()}
            </span>
            <span className={styles.metaItem}>
              <Clock size={16} />
              {timeRemaining}
            </span>
          </div>
        </div>
        {submission && (
          <div className={styles.headerRight}>
            <StatusBadge status={submission.status} />
          </div>
        )}
      </motion.div>

      {/* Main Grid */}
      <div className={styles.contentGrid}>
        {/* Left column – Assignment details */}
        <motion.div
          className={styles.leftColumn}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Assignment Description</h2>
            <p className={styles.description}>{assignment.description}</p>
          </div>

          {submission && getStatusDisplay(submission.status) === "EVALUATED" && (
            <motion.div
              className={styles.evaluationCard}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className={styles.cardTitle}>Evaluation Result</h2>
              <div className={styles.evaluationContent}>
                <div className={styles.marksContainer}>
                  <span className={styles.marksLabel}>Marks Obtained</span>
                  <span className={styles.marksValue}>{submission.marks ?? 0} / 100</span>
                </div>
                {submission.feedback && (
                  <div className={styles.feedbackContainer}>
                    <span className={styles.feedbackLabel}>
                      <MessageSquare size={16} /> Feedback
                    </span>
                    <p className={styles.feedbackText}>{submission.feedback}</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Right column – Submission form or details */}
        <motion.div
          className={styles.rightColumn}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {!isSubmitted ? (
            <div className={styles.submissionCard}>
              <h2 className={styles.cardTitle}>Submit Assignment</h2>

              <div className={styles.typeSelector}>
                <button
                  type="button"
                  className={`${styles.typeButton} ${selectedType === "file" ? styles.active : ""}`}
                  onClick={() => setSelectedType("file")}
                >
                  <FileUp size={18} /> File Upload
                </button>
                <button
                  type="button"
                  className={`${styles.typeButton} ${selectedType === "text" ? styles.active : ""}`}
                  onClick={() => setSelectedType("text")}
                >
                  <Type size={18} /> Text Answer
                </button>
                <button
                  type="button"
                  className={`${styles.typeButton} ${selectedType === "link" ? styles.active : ""}`}
                  onClick={() => setSelectedType("link")}
                >
                  <Link2 size={18} /> External Link
                </button>
              </div>

              <form onSubmit={handleSubmit} className={styles.form}>
                <AnimatePresence mode="wait">
                  {selectedType === "file" && (
                    <motion.div
                      key="file"
                      className={styles.formGroup}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <label className={styles.label}>
                        <Upload size={16} /> Upload File
                      </label>
                      <div className={styles.fileUploadArea}>
                        <input
                          type="file"
                          id="file"
                          onChange={handleFileChange}
                          className={styles.fileInput}
                          accept=".pdf,.doc,.docx,.txt,.zip,.jpg,.png"
                        />
                        <label htmlFor="file" className={styles.fileLabel}>
                          <FileText size={24} />
                          <span>
                            {formData.file ? formData.file.name : "Click to upload or drag and drop"}
                          </span>
                          <span className={styles.fileHint}>
                            Max file size: 10MB (PDF, DOC, DOCX, TXT, ZIP, JPG, PNG)
                          </span>
                        </label>
                      </div>
                      {formData.file && (
                        <motion.div
                          className={styles.filePreview}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                        >
                          <FileText size={16} />
                          <span>{formData.file.name}</span>
                          <span className={styles.fileSize}>
                            ({(formData.file.size / 1024 / 1024).toFixed(2)} MB)
                          </span>
                          <button
                            type="button"
                            onClick={() => setFormData((prev) => ({ ...prev, file: null }))}
                            className={styles.removeFile}
                          >
                            <X size={14} />
                          </button>
                        </motion.div>
                      )}
                    </motion.div>
                  )}

                  {selectedType === "text" && (
                    <motion.div
                      key="text"
                      className={styles.formGroup}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <label className={styles.label}>
                        <Type size={16} /> Your Answer
                      </label>
                      <textarea
                        value={formData.text}
                        onChange={(e) => setFormData((prev) => ({ ...prev, text: e.target.value }))}
                        className={styles.textarea}
                        placeholder="Type your answer here..."
                        rows={8}
                      />
                      <span className={styles.charCount}>{formData.text.length} characters</span>
                    </motion.div>
                  )}

                  {selectedType === "link" && (
                    <motion.div
                      key="link"
                      className={styles.formGroup}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <label className={styles.label}>
                        <Link2 size={16} /> External Link
                      </label>
                      <input
                        type="url"
                        value={formData.link}
                        onChange={(e) => setFormData((prev) => ({ ...prev, link: e.target.value }))}
                        className={styles.input}
                        placeholder="https://github.com/your-repo or https://docs.google.com/..."
                      />
                      {formData.link && (
                        <motion.a
                          href={formData.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.linkPreview}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                        >
                          <ExternalLink size={14} /> Preview link
                        </motion.a>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                {isLate && (
                  <motion.div className={styles.warning} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
                    <AlertTriangle size={16} />
                    <span>Deadline has passed. Your submission will be marked as late.</span>
                  </motion.div>
                )}

                <button type="submit" className={styles.submitButton} disabled={submitting}>
                  {submitting ? (
                    <>
                      <span className={styles.spinner} /> Submitting...
                    </>
                  ) : (
                    <>
                      <Send size={18} /> Submit Assignment
                    </>
                  )}
                </button>
              </form>
            </div>
          ) : (
            submission && (
              <motion.div
                className={styles.submissionCard}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <h2 className={styles.cardTitle}>Your Submission</h2>

                <div className={styles.submissionDetails}>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Submitted on</span>
                    <span className={styles.detailValue}>
                      {new Date(submission.submissionTime).toLocaleString()}
                    </span>
                  </div>

                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Status</span>
                    <div className={styles.detailValue}>
                      <StatusBadge status={submission.status} />
                    </div>
                  </div>

                  {submission.lateFlag && (
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>Late Submission</span>
                      <span className={styles.detailValue} style={{ color: "#F59E0B" }}>Yes</span>
                    </div>
                  )}

                  {submission.fileUrl && (
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>Submitted File</span>
                      <a href={submission.fileUrl} target="_blank" rel="noopener noreferrer" className={styles.fileLink}>
                        <FileText size={16} /> View File <ExternalLink size={12} />
                      </a>
                    </div>
                  )}

                  {submission.textAnswer && (
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>Your Answer</span>
                      <div className={styles.textAnswer}>{submission.textAnswer}</div>
                    </div>
                  )}

                  {submission.externalLink && (
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>External Link</span>
                      <a href={submission.externalLink} target="_blank" rel="noopener noreferrer" className={styles.link}>
                        {submission.externalLink} <ExternalLink size={12} />
                      </a>
                    </div>
                  )}
                </div>

                {getStatusDisplay(submission.status) !== "EVALUATED" && (
                  <div className={styles.pendingMessage}>
                    <Clock size={16} />
                    <span>Your submission is pending evaluation. You'll receive feedback soon.</span>
                  </div>
                )}

                <button onClick={() => router.push("/student/assignments")} className={styles.backToAssignments}>
                  <ChevronRight size={16} /> Back to Assignments
                </button>
              </motion.div>
            )
          )}
        </motion.div>
      </div>
    </div>
  );
}