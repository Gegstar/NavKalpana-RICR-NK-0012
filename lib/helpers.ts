import { Course, Assignment, QuizAttempt } from './types'

export const calculateStreak = (currentStreak: number, lastActivityDate: string | null): { streak: number; lastActivityDate: string } => {
  const today = new Date().toDateString()
  if (!lastActivityDate) {
    return { streak: 1, lastActivityDate: today }
  }
  const lastDate = new Date(lastActivityDate)
  const diffDays = Math.floor((new Date().getTime() - lastDate.getTime()) / (1000 * 3600 * 24))
  if (diffDays === 1) {
    return { streak: currentStreak + 1, lastActivityDate: today }
  } else if (diffDays === 0) {
    return { streak: currentStreak, lastActivityDate: lastActivityDate }
  } else {
    return { streak: 1, lastActivityDate: today }
  }
}

export const updateWeeklyActivity = (weeklyActivity: number[]): number[] => {
  const today = new Date().getDay()
  const newActivity = [...weeklyActivity]
  newActivity[today] += 1
  return newActivity
}

export const getSkillsData = (courses: Course[], skillsAcquired: string[]) => {
  const totalSkills = courses.reduce((acc, course) => acc + course.modules.length, 0)
  const acquired = skillsAcquired.length
  return { acquired, total: totalSkills }
}

export const calculateOverallPerformance = (courses: Course[], assignments: Assignment[], quizAttempts: Record<string, QuizAttempt>): number => {
  const courseAvg = courses.reduce((sum, c) => sum + c.progress, 0) / (courses.length || 1)
  const assignmentAvg = assignments.reduce((sum, a) => sum + (a.submission?.marks || 0), 0) / (assignments.length || 1)
  const quizAvg = Object.values(quizAttempts).reduce((sum, q) => sum + q.score, 0) / (Object.keys(quizAttempts).length || 1)
  return (courseAvg + assignmentAvg + quizAvg) / 3
}
