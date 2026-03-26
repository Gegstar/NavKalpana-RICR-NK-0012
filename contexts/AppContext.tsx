'use client'

import React, { createContext, useContext, useReducer, useMemo, use } from 'react'
import toast from 'react-hot-toast'
import { initialCourses, initialAssignments, initialQuizzes, initialAttendance, leaderboardData, eventsData } from '@/lib/data'
import { calculateStreak, updateWeeklyActivity, getSkillsData, calculateOverallPerformance } from '@/lib/helpers'
import { User, Course, Assignment, Quiz, CourseAttendance, LeaderboardEntry, Event, QuizAttempt, AssignmentSubmission } from '@/lib/types'
// ✅ Helper to get cookie
const getCookie = (name: string) => {
  if (typeof document === 'undefined') return null;

  const match = document.cookie.match(
    new RegExp('(^| )' + name + '=([^;]+)')
  );
  return match ? match[2] : null;
};

const userRole = getCookie('user_role');

interface AppState {
  user: User,
  role: string,
  courses: Course[]
  assignments: Assignment[]
  quizAttempts: Record<string, QuizAttempt>
  attendance: CourseAttendance[]
  weeklyActivity: number[]
  streak: number
  lastActivityDate: string | null
  skillsAcquired: string[]
}

type Action =
  | { type: 'COMPLETE_LESSON'; payload: { courseId: string; moduleId: string; lessonId: string } }
  | { type: 'MARK_COURSE_COMPLETE'; payload: { courseId: string } }
  | { type: 'SUBMIT_ASSIGNMENT'; payload: { assignmentId: string; submission: Omit<AssignmentSubmission, 'submittedAt' | 'isLate' | 'status'> } }
  | { type: 'SUBMIT_QUIZ'; payload: { quizId: string; score: number; totalQuestions: number; answers: number[] } }

const initialState: AppState = {
  user: { name: 'Alex Johnson', studentId: 'S12345' },
  role:"",
  courses: initialCourses,
  assignments: initialAssignments,
  quizAttempts: {},
  attendance: initialAttendance,
  weeklyActivity: Array(7).fill(0),
  streak: 0,
  lastActivityDate: null,
  skillsAcquired: [],
}

initialState.role = userRole || 'STUDENT'

const appReducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    case 'COMPLETE_LESSON': {
      const { courseId, moduleId, lessonId } = action.payload
      const courses = state.courses.map(course => {
        if (course.id !== courseId) return course
        const modules = course.modules.map(module => {
          if (module.id !== moduleId) return module
          const lessons = module.lessons.map(lesson =>
            lesson.id === lessonId ? { ...lesson, completed: true } : lesson
          )
          const completedLessons = lessons.filter(l => l.completed).length
          const progress = (completedLessons / lessons.length) * 100
          return { ...module, lessons, progress }
        })
        const totalLessons = modules.reduce((acc, m) => acc + m.lessons.length, 0)
        const completedLessons = modules.reduce((acc, m) => acc + m.lessons.filter(l => l.completed).length, 0)
        const courseProgress = (completedLessons / totalLessons) * 100
        return { ...course, modules, progress: courseProgress }
      })
      const newWeeklyActivity = updateWeeklyActivity(state.weeklyActivity)
      const { streak: newStreak, lastActivityDate } = calculateStreak(state.streak, state.lastActivityDate)
      let skillsAcquired = [...state.skillsAcquired]
      const updatedCourses = courses
      updatedCourses.forEach(course => {
        course.modules.forEach(module => {
          const allCompleted = module.lessons.every(l => l.completed)
          if (allCompleted && !skillsAcquired.includes(module.id)) {
            skillsAcquired.push(module.id)
          }
        })
      })
      return {
        ...state,
        courses: updatedCourses,
        weeklyActivity: newWeeklyActivity,
        streak: newStreak,
        lastActivityDate,
        skillsAcquired,
      }
    }
    case 'MARK_COURSE_COMPLETE': {
      const { courseId } = action.payload
      const courses = state.courses.map(course => {
        if (course.id !== courseId) return course
        const modules = course.modules.map(module => ({
          ...module,
          lessons: module.lessons.map(lesson => ({ ...lesson, completed: true })),
          progress: 100,
        }))
        return { ...course, modules, progress: 100 }
      })
      let skillsAcquired = [...state.skillsAcquired]
      const targetCourse = courses.find(c => c.id === courseId)
      if (targetCourse) {
        targetCourse.modules.forEach(module => {
          if (!skillsAcquired.includes(module.id)) skillsAcquired.push(module.id)
        })
      }
      const newWeeklyActivity = updateWeeklyActivity(state.weeklyActivity)
      const { streak: newStreak, lastActivityDate } = calculateStreak(state.streak, state.lastActivityDate)
      return {
        ...state,
        courses,
        skillsAcquired,
        weeklyActivity: newWeeklyActivity,
        streak: newStreak,
        lastActivityDate,
      }
    }
    case 'SUBMIT_ASSIGNMENT': {
      const { assignmentId, submission } = action.payload
      const now = new Date()
      const assignments = state.assignments.map(ass => {
        if (ass.id !== assignmentId) return ass
        const deadline = new Date(ass.deadline)
        const isLate = now > deadline
        const status = isLate ? 'Late Submitted' : 'Submitted'
        const marks = Math.floor(Math.random() * 100)
        const feedback = `Auto-evaluated: ${marks}%`
        return {
          ...ass,
          submission: {
            ...submission,
            submittedAt: now.toISOString(),
            isLate,
            status,
            marks,
            feedback,
          },
          status: 'Evaluated',
        }
      })
      const { streak: newStreak, lastActivityDate } = calculateStreak(state.streak, state.lastActivityDate)
      const newWeeklyActivity = updateWeeklyActivity(state.weeklyActivity)
      toast.success('Assignment submitted and evaluated!')
      return { ...state, streak: newStreak, lastActivityDate, weeklyActivity: newWeeklyActivity }
    }
    case 'SUBMIT_QUIZ': {
      const { quizId, score, totalQuestions } = action.payload
      const percentage = (score / totalQuestions) * 100
      const attempt: QuizAttempt = {
        quizId,
        score: percentage,
        correct: score,
        incorrect: totalQuestions - score,
        submittedAt: new Date().toISOString(),
      }
      const quizAttempts = { ...state.quizAttempts, [quizId]: attempt }
      const { streak: newStreak, lastActivityDate } = calculateStreak(state.streak, state.lastActivityDate)
      const newWeeklyActivity = updateWeeklyActivity(state.weeklyActivity)
      toast.success(`Quiz submitted! Score: ${percentage}%`)
      return { ...state, quizAttempts, streak: newStreak, lastActivityDate, weeklyActivity: newWeeklyActivity }
    }
    default:
      return state
  }
}

interface AppContextType extends AppState {
  overallPerformance: number
  assignmentSummary: { completed: number; total: number }
  skillsData: { acquired: number; total: number }
  leaderboard: typeof leaderboardData
  events: typeof eventsData
  quizzes: Quiz[]
  dispatch: React.Dispatch<Action>
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState)

  const overallPerformance = useMemo(() => calculateOverallPerformance(state.courses, state.assignments, state.quizAttempts), [state.courses, state.assignments, state.quizAttempts])
  const assignmentSummary = useMemo(() => {
    const total = state.assignments.length
    const completed = state.assignments.filter(a => a.status === 'Evaluated' || a.status === 'Submitted').length
    return { completed, total }
  }, [state.assignments])
  const skillsData = useMemo(() => getSkillsData(state.courses, state.skillsAcquired), [state.courses, state.skillsAcquired])

  const value: AppContextType = {
    ...state,
    overallPerformance,
    assignmentSummary,
    skillsData,
    leaderboard: leaderboardData,
    events: eventsData,
    quizzes: initialQuizzes,
    dispatch,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export const useApp = () => {
  const context = useContext(AppContext)
  if (!context) throw new Error('useApp must be used within AppProvider')
  return context
}