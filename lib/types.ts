export interface User {
  name: string
  studentId: string
}

export interface Lesson {
  id: string
  title: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  video?: string
  notes?: string
  quiz?: string
  codeLab?: string
  completed: boolean
}

export interface Module {
  id: string
  name: string
  lessons: Lesson[]
  progress: number // 0-100
}

export interface Course {
  id: string
  name: string
  instructor: string
  thumbnail?: string
  modules: Module[]
  progress: number
  attendancePercentage: number
}

export interface AssignmentSubmission {
  type: 'file' | 'text' | 'link'
  content: string
  submittedAt: string
  isLate: boolean
  status: 'Submitted' | 'Late Submitted'
  marks?: number
  feedback?: string
}

export interface Assignment {
  id: string
  title: string
  description: string
  deadline: string
  submission?: AssignmentSubmission
  status: 'Not Submitted' | 'Submitted' | 'Late Submitted' | 'Evaluated'
}

export interface QuizQuestion {
  id: string
  text: string
  options: string[]
  correctAnswers: number[]
  multiple: boolean
}

export interface Quiz {
  id: string
  title: string
  duration: number // minutes
  questions: QuizQuestion[]
}

export interface QuizAttempt {
  quizId: string
  score: number
  correct: number
  incorrect: number
  submittedAt: string
}

export interface AttendanceRecord {
  date: string
  status: 'present' | 'absent'
}

export interface CourseAttendance {
  courseId: string
  records: AttendanceRecord[]
  totalClasses: number
}

export interface LeaderboardEntry {
  studentName: string
  score: number
}

export interface Event {
  id: string
  title: string
  date: string
  type: 'assignment' | 'quiz' | 'platform'
}