"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import {
  HelpCircle,
  Calendar,
  Upload,
  FileText,
  CheckCircle,
  Clock,
  AlertCircle,
  ChevronRight,
  X,
  Send,
  MessageSquare,
  Video,
  BookOpen,
  Users,
  Sparkles,
  Loader2,
  ExternalLink,
  Plus,
  History,
} from "lucide-react";
import styles from "@/styles/LearningSupport.module.css";
import { learningSupportService, DoubtSubmission, BackupClassRequest, Course } from "@/services/learning-support.services";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

type TabType = 'doubt' | 'backup' | 'history';

export default function LearningSupportPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('doubt');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [myDoubts, setMyDoubts] = useState<DoubtSubmission[]>([]);
  const [myBackupRequests, setMyBackupRequests] = useState<BackupClassRequest[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<number | ''>('');
  const [selectedTopic, setSelectedTopic] = useState('');
  const [topics, setTopics] = useState<string[]>([]);
  const [description, setDescription] = useState('');
  const [attachment, setAttachment] = useState<File | null>(null);
  const [attachmentPreview, setAttachmentPreview] = useState<string | null>(null);

  // Backup class form state
  const [backupForm, setBackupForm] = useState({
    courseId: '' as number | '',
    topic: '',
    preferredDate: '',
    preferredTime: '',
    reason: '',
  });

  // Fetch initial data
  useEffect(() => {
    fetchInitialData();
  }, []);

  // Fetch topics when course changes
  useEffect(() => {
    if (selectedCourse) {
      fetchCourseTopics(selectedCourse);
    } else {
      setTopics([]);
    }
  }, [selectedCourse]);

  useEffect(() => {
    if (backupForm.courseId) {
      fetchCourseTopics(backupForm.courseId);
    }
  }, [backupForm.courseId]);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [coursesData, doubtsData, backupsData] = await Promise.all([
        learningSupportService.getCourses(),
        learningSupportService.getMyDoubts(),
        learningSupportService.getMyBackupRequests(),
      ]);
      setCourses(coursesData);
      setMyDoubts(doubtsData);
      setMyBackupRequests(backupsData);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const fetchCourseTopics = async (courseId: number) => {
    try {
      const topicsData = await learningSupportService.getCourseTopics(courseId);
      setTopics(topicsData);
    } catch (error) {
      console.error("Error fetching topics:", error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      return;
    }
    setAttachment(file);
    setAttachmentPreview(URL.createObjectURL(file));
  };

  const handleSubmitDoubt = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourse || !selectedTopic || !description) {
      toast.error("Please fill in all required fields");
      return;
    }

    setSubmitting(true);
    const toastId = toast.loading("Submitting your doubt...");

    try {
      const formData = new FormData();
      formData.append('courseId', selectedCourse.toString());
      formData.append('topic', selectedTopic);
      formData.append('description', description);
      if (attachment) {
        formData.append('attachment', attachment);
      }

      const newDoubt = await learningSupportService.submitDoubt(formData);
      setMyDoubts(prev => [newDoubt, ...prev]);
      toast.success("Doubt submitted successfully!", { id: toastId });

      // Reset form
      setSelectedCourse('');
      setSelectedTopic('');
      setDescription('');
      setAttachment(null);
      setAttachmentPreview(null);

      setTimeout(() => setActiveTab('history'), 2000);
    } catch (error) {
      console.error("Error submitting doubt:", error);
      toast.error("Failed to submit doubt", { id: toastId });
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitBackupRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!backupForm.courseId || !backupForm.topic || !backupForm.preferredDate || !backupForm.preferredTime || !backupForm.reason) {
      toast.error("Please fill in all fields");
      return;
    }

    setSubmitting(true);
    const toastId = toast.loading("Submitting backup class request...");

    try {
      const requestData: BackupClassRequest = {
        courseId: backupForm.courseId as number,
        topic: backupForm.topic,
        preferredDate: backupForm.preferredDate,
        preferredTime: backupForm.preferredTime,
        reason: backupForm.reason,
        status: 'pending',
      };

      const newRequest = await learningSupportService.requestBackupClass(requestData);
      setMyBackupRequests(prev => [newRequest, ...prev]);
      toast.success("Backup class requested successfully!", { id: toastId });

      setBackupForm({
        courseId: '',
        topic: '',
        preferredDate: '',
        preferredTime: '',
        reason: '',
      });

      setTimeout(() => setActiveTab('history'), 2000);
    } catch (error) {
      console.error("Error requesting backup class:", error);
      toast.error("Failed to submit request", { id: toastId });
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancelBackupRequest = async (id: number) => {
    if (!confirm("Are you sure you want to cancel this request?")) return;
    try {
      await learningSupportService.cancelBackupRequest(id);
      setMyBackupRequests(prev => prev.map(req =>
        req.id === id ? { ...req, status: 'cancelled' } : req
      ));
      toast.success("Request cancelled");
    } catch (error) {
      toast.error("Failed to cancel request");
    }
  };

  const getStatusBadge = (status: string) => {
    const config = {
      pending: { icon: Clock, color: '#F59E0B', bg: '#F59E0B15', text: 'Pending' },
      'in-progress': { icon: Loader2, color: '#3B82F6', bg: '#3B82F615', text: 'In Progress' },
      resolved: { icon: CheckCircle, color: '#10B981', bg: '#10B98115', text: 'Resolved' },
      scheduled: { icon: Calendar, color: '#3B82F6', bg: '#3B82F615', text: 'Scheduled' },
      completed: { icon: CheckCircle, color: '#10B981', bg: '#10B98115', text: 'Completed' },
      cancelled: { icon: X, color: '#EF4444', bg: '#EF444415', text: 'Cancelled' },
    };
    const { icon: Icon, color, bg, text } = config[status as keyof typeof config] || config.pending;

    return (
      <span className={styles.statusBadge} style={{ background: bg, color }}>
        <Icon size={12} />
        {text}
      </span>
    );
  };

  // Animation variants – properly typed
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
      }
    }
  };

  const cardVariants: Variants = {
    hidden: { scale: 0.9, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 20,
      }
    },
    hover: {
      y: -4,
      scale: 1.02,
      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 15,
      }
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner} />
        <p>Loading learning support...</p>
      </div>
    );
  }

  return (
    <motion.div
      className={styles.container}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div className={styles.header} variants={itemVariants}>
        <div className={styles.headerLeft}>
          <motion.h1
            className={styles.title}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
          >
            Learning Support
            <motion.span
              className={styles.titleSparkle}
              animate={{ rotate: 360, scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Sparkles size={20} />
            </motion.span>
          </motion.h1>
          <motion.p
            className={styles.subtitle}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            Get help with your doubts or request backup classes
          </motion.p>
        </div>
      </motion.div>

      {/* Tabs */}
      <motion.div className={styles.tabs} variants={itemVariants}>
        <motion.button
          className={`${styles.tab} ${activeTab === 'doubt' ? styles.active : ''}`}
          onClick={() => setActiveTab('doubt')}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.95 }}
        >
          <HelpCircle size={18} />
          Submit Doubt
        </motion.button>
        <motion.button
          className={`${styles.tab} ${activeTab === 'backup' ? styles.active : ''}`}
          onClick={() => setActiveTab('backup')}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.95 }}
        >
          <Calendar size={18} />
          Request Backup Class
        </motion.button>
        <motion.button
          className={`${styles.tab} ${activeTab === 'history' ? styles.active : ''}`}
          onClick={() => setActiveTab('history')}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.95 }}
        >
          <History size={18} />
          History
        </motion.button>
      </motion.div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'doubt' && (
          <motion.div
            key="doubt"
            className={styles.tabContent}
            variants={{
              hidden: { opacity: 0, x: -20 },
              visible: { opacity: 1, x: 0 }
            }}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            <form onSubmit={handleSubmitDoubt} className={styles.form}>
              <motion.div className={styles.formGroup} variants={itemVariants}>
                <label className={styles.label}>
                  <BookOpen size={16} />
                  Select Course <span className={styles.required}>*</span>
                </label>
                <motion.select
                  value={selectedCourse}
                  onChange={(e) => setSelectedCourse(e.target.value ? Number(e.target.value) : '')}
                  className={styles.select}
                  whileHover={{ scale: 1.02 }}
                  whileFocus={{ scale: 1.02 }}
                  required
                >
                  <option value="">Choose a course</option>
                  {courses.map(course => (
                    <option key={course.id} value={course.id}>{course.name}</option>
                  ))}
                </motion.select>
              </motion.div>

              <motion.div className={styles.formGroup} variants={itemVariants}>
                <label className={styles.label}>
                  <MessageSquare size={16} />
                  Select Topic <span className={styles.required}>*</span>
                </label>
                <motion.select
                  value={selectedTopic}
                  onChange={(e) => setSelectedTopic(e.target.value)}
                  className={styles.select}
                  whileHover={{ scale: 1.02 }}
                  whileFocus={{ scale: 1.02 }}
                  disabled={!selectedCourse}
                  required
                >
                  <option value="">Choose a topic</option>
                  {topics.map(topic => (
                    <option key={topic} value={topic}>{topic}</option>
                  ))}
                </motion.select>
              </motion.div>

              <motion.div className={styles.formGroup} variants={itemVariants}>
                <label className={styles.label}>
                  <FileText size={16} />
                  Describe Your Doubt <span className={styles.required}>*</span>
                </label>
                <motion.textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className={styles.textarea}
                  rows={5}
                  placeholder="Please describe your doubt in detail..."
                  whileHover={{ scale: 1.01 }}
                  whileFocus={{ scale: 1.01 }}
                  required
                />
                <span className={styles.charCount}>
                  {description.length}/500
                </span>
              </motion.div>

              <motion.div className={styles.formGroup} variants={itemVariants}>
                <label className={styles.label}>
                  <Upload size={16} />
                  Attachment (Optional)
                </label>
                <div className={styles.fileUploadArea}>
                  <input
                    type="file"
                    id="attachment"
                    onChange={handleFileChange}
                    className={styles.fileInput}
                    accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
                  />
                  <label htmlFor="attachment" className={styles.fileLabel}>
                    <Upload size={24} />
                    <span>{attachment ? attachment.name : 'Click to upload screenshot or file'}</span>
                    <span className={styles.fileHint}>Max 5MB (JPG, PNG, PDF, DOC)</span>
                  </label>
                </div>
                {attachmentPreview && (
                  <motion.div
                    className={styles.filePreview}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <img src={attachmentPreview} alt="Preview" />
                    <button
                      type="button"
                      onClick={() => {
                        setAttachment(null);
                        setAttachmentPreview(null);
                      }}
                      className={styles.removeFile}
                    >
                      <X size={14} />
                    </button>
                  </motion.div>
                )}
              </motion.div>

              <motion.button
                type="submit"
                className={styles.submitBtn}
                disabled={submitting}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                variants={itemVariants}
              >
                {submitting ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <Loader2 size={18} />
                    </motion.div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send size={18} />
                    Submit Doubt
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>
        )}

        {activeTab === 'backup' && (
          <motion.div
            key="backup"
            className={styles.tabContent}
            variants={{
              hidden: { opacity: 0, x: -20 },
              visible: { opacity: 1, x: 0 }
            }}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            <form onSubmit={handleSubmitBackupRequest} className={styles.form}>
              <motion.div className={styles.formGroup} variants={itemVariants}>
                <label className={styles.label}>
                  <BookOpen size={16} />
                  Select Course <span className={styles.required}>*</span>
                </label>
                <motion.select
                  value={backupForm.courseId}
                  onChange={(e) => setBackupForm({ ...backupForm, courseId: e.target.value ? Number(e.target.value) : '' })}
                  className={styles.select}
                  whileHover={{ scale: 1.02 }}
                  whileFocus={{ scale: 1.02 }}
                  required
                >
                  <option value="">Choose a course</option>
                  {courses.map(course => (
                    <option key={course.id} value={course.id}>{course.name}</option>
                  ))}
                </motion.select>
              </motion.div>

              <motion.div className={styles.formGroup} variants={itemVariants}>
                <label className={styles.label}>
                  <MessageSquare size={16} />
                  Topic <span className={styles.required}>*</span>
                </label>
                <motion.select
                  value={backupForm.topic}
                  onChange={(e) => setBackupForm({ ...backupForm, topic: e.target.value })}
                  className={styles.select}
                  whileHover={{ scale: 1.02 }}
                  whileFocus={{ scale: 1.02 }}
                  disabled={!backupForm.courseId}
                  required
                >
                  <option value="">Choose a topic</option>
                  {topics.map(topic => (
                    <option key={topic} value={topic}>{topic}</option>
                  ))}
                </motion.select>
              </motion.div>

              <div className={styles.row}>
                <motion.div className={styles.formGroup} variants={itemVariants}>
                  <label className={styles.label}>
                    <Calendar size={16} />
                    Preferred Date <span className={styles.required}>*</span>
                  </label>
                  <motion.input
                    type="date"
                    value={backupForm.preferredDate}
                    onChange={(e) => setBackupForm({ ...backupForm, preferredDate: e.target.value })}
                    className={styles.input}
                    min={new Date().toISOString().split('T')[0]}
                    whileHover={{ scale: 1.02 }}
                    whileFocus={{ scale: 1.02 }}
                    required
                  />
                </motion.div>

                <motion.div className={styles.formGroup} variants={itemVariants}>
                  <label className={styles.label}>
                    <Clock size={16} />
                    Preferred Time <span className={styles.required}>*</span>
                  </label>
                  <motion.input
                    type="time"
                    value={backupForm.preferredTime}
                    onChange={(e) => setBackupForm({ ...backupForm, preferredTime: e.target.value })}
                    className={styles.input}
                    whileHover={{ scale: 1.02 }}
                    whileFocus={{ scale: 1.02 }}
                    required
                  />
                </motion.div>
              </div>

              <motion.div className={styles.formGroup} variants={itemVariants}>
                <label className={styles.label}>
                  <FileText size={16} />
                  Reason for Request <span className={styles.required}>*</span>
                </label>
                <motion.textarea
                  value={backupForm.reason}
                  onChange={(e) => setBackupForm({ ...backupForm, reason: e.target.value })}
                  className={styles.textarea}
                  rows={3}
                  placeholder="Please explain why you need a backup class..."
                  whileHover={{ scale: 1.01 }}
                  whileFocus={{ scale: 1.01 }}
                  required
                />
              </motion.div>

              <motion.button
                type="submit"
                className={styles.submitBtn}
                disabled={submitting}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                variants={itemVariants}
              >
                {submitting ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <Loader2 size={18} />
                    </motion.div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <Calendar size={18} />
                    Request Backup Class
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>
        )}

        {activeTab === 'history' && (
          <motion.div
            key="history"
            className={styles.tabContent}
            variants={{
              hidden: { opacity: 0, x: -20 },
              visible: { opacity: 1, x: 0 }
            }}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            <div className={styles.historySections}>
              {/* Doubts History */}
              <motion.div className={styles.historySection} variants={itemVariants}>
                <h2 className={styles.sectionTitle}>
                  <HelpCircle size={20} />
                  My Doubts
                </h2>
                <div className={styles.historyList}>
                  {myDoubts.length === 0 ? (
                    <p className={styles.emptyText}>No doubts submitted yet</p>
                  ) : (
                    myDoubts.map((doubt, index) => (
                      <motion.div
                        key={doubt.id}
                        className={styles.historyCard}
                        variants={cardVariants}
                        whileHover="hover"
                        custom={index}
                      >
                        <div className={styles.cardHeader}>
                          <div>
                            <h3>{doubt.topic}</h3>
                            <p className={styles.courseName}>{doubt.courseName}</p>
                          </div>
                          {getStatusBadge(doubt.status)}
                        </div>
                        <p className={styles.description}>{doubt.description}</p>
                        {doubt.attachmentUrl && (
                          <a
                            href={doubt.attachmentUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.attachmentLink}
                          >
                            <FileText size={14} />
                            View Attachment
                            <ExternalLink size={12} />
                          </a>
                        )}
                        <div className={styles.cardFooter}>
                          <span className={styles.date}>
                            {new Date(doubt.createdAt!).toLocaleDateString()}
                          </span>
                          {doubt.response && (
                            <div className={styles.response}>
                              <MessageSquare size={14} />
                              <span>{doubt.response}</span>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </motion.div>

              {/* Backup Classes History */}
              <motion.div className={styles.historySection} variants={itemVariants}>
                <h2 className={styles.sectionTitle}>
                  <Calendar size={20} />
                  Backup Class Requests
                </h2>
                <div className={styles.historyList}>
                  {myBackupRequests.length === 0 ? (
                    <p className={styles.emptyText}>No backup class requests yet</p>
                  ) : (
                    myBackupRequests.map((request, index) => (
                      <motion.div
                        key={request.id}
                        className={styles.historyCard}
                        variants={cardVariants}
                        whileHover="hover"
                        custom={index}
                      >
                        <div className={styles.cardHeader}>
                          <div>
                            <h3>{request.topic}</h3>
                            <p className={styles.courseName}>{request.courseName}</p>
                          </div>
                          {getStatusBadge(request.status)}
                        </div>
                        <p className={styles.description}>{request.reason}</p>
                        <div className={styles.requestDetails}>
                          <span>
                            <Calendar size={14} />
                            {new Date(request.preferredDate).toLocaleDateString()} at {request.preferredTime}
                          </span>
                        </div>
                        {request.scheduledDate && request.meetingLink && (
                          <div className={styles.scheduledDetails}>
                            <p>
                              <CheckCircle size={14} />
                              Scheduled: {new Date(request.scheduledDate).toLocaleDateString()} at {request.scheduledTime}
                            </p>
                            <a
                              href={request.meetingLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={styles.meetingLink}
                            >
                              <Video size={14} />
                              Join Meeting
                              <ExternalLink size={12} />
                            </a>
                          </div>
                        )}
                        <div className={styles.cardFooter}>
                          <span className={styles.date}>
                            Requested: {new Date(request.createdAt!).toLocaleDateString()}
                          </span>
                          {request.status === 'pending' && (
                            <button
                              onClick={() => handleCancelBackupRequest(request.id!)}
                              className={styles.cancelBtn}
                            >
                              <X size={14} />
                              Cancel
                            </button>
                          )}
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Button for Mobile */}
      <motion.button
        className={styles.fab}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", delay: 1 }}
        onClick={() => setActiveTab('doubt')}
      >
        <Plus size={24} />
      </motion.button>
    </motion.div>
  );
}