import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Submission {
  id: number;
  submittedAt: string;
  isLate: boolean;
  status: 'Not Submitted' | 'Submitted' | 'Late Submitted' | 'Evaluated';
  text?: string;
  fileUrl?: string;
  link?: string;
  marks?: number;
  feedback?: string;
}

export interface Assignment {
  id: number;
  title: string;
  description: string;
  dueDate: string;
  totalMarks: number;
  submission?: Submission;
}

// Dummy data
const dummyAssignments: Assignment[] = [
  {
    id: 1,
    title: 'React Final Project',
    description: 'Build a simple e‑commerce frontend with React and Redux.',
    dueDate: '2025-03-28T23:59:59',
    totalMarks: 100,
    submission: {
      id: 1,
      submittedAt: '2025-03-20T10:00:00Z',
      isLate: false,
      status: 'Submitted',
      marks: 90,
      feedback: 'Great work! Keep it up.',
    },
  },
  {
    id: 2,
    title: 'Node.js API',
    description: 'Create a REST API with Express and MongoDB.',
    dueDate: '2025-04-05T23:59:59',
    totalMarks: 100,
  },
  {
    id: 3,
    title: 'Database Design',
    description: 'Design a normalized database for an e‑commerce platform.',
    dueDate: '2025-03-30T23:59:59',
    totalMarks: 100,
  },
  {
    id: 4,
    title: 'UI/UX Case Study',
    description: 'Analyze a popular app and suggest improvements.',
    dueDate: '2025-04-10T23:59:59',
    totalMarks: 50,
  },
];

interface AssignmentsState {
  assignments: Assignment[];
  completedCount: number;
  totalCount: number;
}

const initialState: AssignmentsState = {
  assignments: dummyAssignments,
  completedCount: dummyAssignments.filter(a => a.submission?.status === 'Submitted' || a.submission?.status === 'Evaluated').length,
  totalCount: dummyAssignments.length,
};

const assignmentsSlice = createSlice({
  name: 'assignments',
  initialState,
  reducers: {
    submitAssignment: (
      state,
      action: PayloadAction<{
        assignmentId: number;
        submissionData: { text?: string; fileUrl?: string; link?: string };
      }>
    ) => {
      const assignment = state.assignments.find(a => a.id === action.payload.assignmentId);
      if (!assignment) return;

      const now = new Date();
      const dueDate = new Date(assignment.dueDate);
      const isLate = now > dueDate;

      assignment.submission = {
        id: Date.now(),
        submittedAt: now.toISOString(),
        isLate,
        status: isLate ? 'Late Submitted' : 'Submitted',
        ...action.payload.submissionData,
      };

      // Update counts
      state.completedCount = state.assignments.filter(
        a => a.submission?.status === 'Submitted' || a.submission?.status === 'Evaluated'
      ).length;
    },
    evaluateAssignment: (
      state,
      action: PayloadAction<{
        assignmentId: number;
        marks: number;
        feedback: string;
      }>
    ) => {
      const assignment = state.assignments.find(a => a.id === action.payload.assignmentId);
      if (assignment?.submission) {
        assignment.submission.status = 'Evaluated';
        assignment.submission.marks = action.payload.marks;
        assignment.submission.feedback = action.payload.feedback;
      }
      // Re‑count completed (optional, but keeps consistency)
      state.completedCount = state.assignments.filter(
        a => a.submission?.status === 'Submitted' || a.submission?.status === 'Evaluated'
      ).length;
    },
  },
});

export const { submitAssignment, evaluateAssignment } = assignmentsSlice.actions;
export default assignmentsSlice.reducer;