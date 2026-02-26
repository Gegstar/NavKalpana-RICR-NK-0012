import { api } from "@/lib/api";
import type { AssignmentWithSubmissionResponse } from "@/models/assignment-submission.model";

class AssignmentService {
  private base = "/assignments";

  async getAssignmentWithSubmission(id: number): Promise<AssignmentWithSubmissionResponse> {
    const response = await api.get(`${this.base}/my-assignment/${id}`);
    return response.data;
  }

  async submit(id: number, formData: FormData): Promise<void> {
    await api.post(`${this.base}/${id}/submit`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  }
}

export const assignmentService = new AssignmentService();