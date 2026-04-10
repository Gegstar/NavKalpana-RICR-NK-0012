import { Course, Assignment, Quiz, CourseAttendance, LeaderboardEntry, Event } from './types'

export const initialCourses: Course[] = [
  {
    id: '1',
    name: 'React Fundamentals',
    instructor: 'Dr. Sarah Johnson',
    thumbnail: 'https://via.placeholder.com/150',
    modules: [
      {
        id: 'm1',
        name: 'Introduction to React',
        lessons: [
          { id: 'l1', title: 'What is React?', difficulty: 'Easy', completed: false, video: 'https://example.com/vid1', notes: 'React is a library...' },
          { id: 'l2', title: 'JSX', difficulty: 'Easy', completed: false, video: 'https://example.com/vid2', notes: 'JSX is syntax extension...' },
        ],
        progress: 0,
      },
      {
        id: 'm2',
        name: 'Components & Props',
        lessons: [
          { id: 'l3', title: 'Functional Components', difficulty: 'Medium', completed: false, video: 'https://example.com/vid3' },
          { id: 'l4', title: 'Props', difficulty: 'Medium', completed: false },
        ],
        progress: 0,
      },
    ],
    progress: 0,
    attendancePercentage: 85,
  },
  {
    id: '2',
    name: 'Advanced TypeScript',
    instructor: 'Prof. Michael Chen',
    modules: [
      {
        id: 'm3',
        name: 'TypeScript Basics',
        lessons: [
          { id: 'l5', title: 'Types', difficulty: 'Easy', completed: false },
          { id: 'l6', title: 'Interfaces', difficulty: 'Easy', completed: false },
        ],
        progress: 0,
      },
    ],
    progress: 0,
    attendancePercentage: 92,
  },
]

export const initialAssignments: Assignment[] = [
  {
    id: 'a1',
    title: 'React Component Challenge',
    description: 'Create a reusable button component.',
    deadline: '2025-04-10T23:59:59',
    status: 'Not Submitted',
  },
  {
    id: 'a2',
    title: 'TypeScript Types Exercise',
    description: 'Define interfaces for a user profile.',
    deadline: '2025-04-15T23:59:59',
    status: 'Not Submitted',
  },
]

export const initialQuizzes: Quiz[] = [
  {
    id: 'q1',
    title: 'React Basics Quiz',
    duration: 10,
    questions: [
      {
        id: 'qq1',
        text: 'What is JSX?',
        options: ['JavaScript XML', 'Java Syntax Extension', 'JSON XHR', 'None'],
        correctAnswers: [0],
        multiple: false,
      },
      {
        id: 'qq2',
        text: 'Which of the following are hooks? (Select all that apply)',
        options: ['useState', 'useEffect', 'useClass', 'useReducer'],
        correctAnswers: [0, 1, 3],
        multiple: true,
      },
    ],
  },
  {
    id: 'q2',
    title: 'TypeScript Fundamentals',
    duration: 15,
    questions: [
      {
        id: 'qq3',
        text: 'What does "interface" do?',
        options: ['Defines a contract', 'Creates a class', 'Implements inheritance', 'None'],
        correctAnswers: [0],
        multiple: false,
      },
    ],
  },
]

export const initialAttendance: CourseAttendance[] = [
  {
    courseId: '1',
    records: [
      { date: '2025-04-01', status: 'present' },
      { date: '2025-04-02', status: 'present' },
      { date: '2025-04-03', status: 'absent' },
      { date: '2025-04-04', status: 'present' },
    ],
    totalClasses: 4,
  },
  {
    courseId: '2',
    records: [
      { date: '2025-04-01', status: 'present' },
      { date: '2025-04-02', status: 'present' },
      { date: '2025-04-03', status: 'present' },
    ],
    totalClasses: 3,
  },
]

export const leaderboardData: LeaderboardEntry[] = [
  { studentName: 'Alex Johnson', score: 95 },
  { studentName: 'Maria Garcia', score: 92 },
  { studentName: 'James Smith', score: 88 },
  { studentName: 'Linda Brown', score: 85 },
]

export const eventsData: Event[] = [
  { id: 'e1', title: 'React Component Challenge Due', date: '2025-04-10', type: 'assignment' },
  { id: 'e2', title: 'TypeScript Quiz', date: '2025-04-12', type: 'quiz' },
  { id: 'e3', title: 'Platform Webinar', date: '2025-04-15', type: 'platform' },
]
