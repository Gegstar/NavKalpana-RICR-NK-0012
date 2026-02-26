export interface AssignmentData {
  id: number;
  title: string;
  description: string;
  deadline: string; // ISO string
  createdAt: string;
  updatedAt: string;
}

export interface SubmissionData {
  id: number;
  assignmentId: number;
  studentId: number;
  fileUrl?: string;
  textAnswer?: string;
  externalLink?: string;
  submissionTime: string;
  lateFlag: boolean;
  status: "NOT_SUBMITTED" | "SUBMITTED" | "LATE_SUBMITTED" | "EVALUATED" | "PENDING";
  marks?: number;
  feedback?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AssignmentWithSubmissionResponse {
  assignment: AssignmentData;
  submission: SubmissionData | null;
  isSubmitted: boolean;
}