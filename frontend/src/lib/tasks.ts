import api from "./api";
import type {
  CreateTaskData,
  Task,
  TaskListResponse,
  UpdateTaskData,
} from "@/types/task";

export interface GetTasksParams {
  page?: number;
  limit?: number;
  status?: string;
  priority?: string;
  startDate?: string;
  endDate?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export async function getTasks(
  params: GetTasksParams = {},
): Promise<TaskListResponse> {
  const response = await api.get<TaskListResponse>(
    "/tasks",
    {
      params,
    },
  );

  return response.data;
}

export async function getTask(
  taskId: string,
): Promise<Task> {
  const response = await api.get<Task>(
    `/tasks/${taskId}`,
  );

  return response.data;
}

export async function createTask(
  data: CreateTaskData,
): Promise<Task> {
  const formData = new FormData();

  formData.append("title", data.title);

  if (data.description) {
    formData.append(
      "description",
      data.description,
    );
  }

  if (data.status) {
    formData.append("status", data.status);
  }

  if (data.priority) {
    formData.append("priority", data.priority);
  }

  if (data.dueDate) {
    formData.append("dueDate", data.dueDate);
  }

  if (data.location) {
    formData.append("location", data.location);
  }

  if (data.files) {
    data.files.forEach((file) => {
      formData.append("files", file);
    });
  }

  const response = await api.post<Task>(
    "/tasks",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );

  return response.data;
}

export async function updateTask(
  taskId: string,
  data: UpdateTaskData,
): Promise<Task> {
  const response = await api.patch<Task>(
    `/tasks/${taskId}`,
    data,
  );

  return response.data;
}

export async function deleteTask(
  taskId: string,
): Promise<{ message: string }> {
  const response = await api.delete<{
    message: string;
  }>(`/tasks/${taskId}`);

  return response.data;
}

export async function getTaskWeather(
  taskId: string,
) {
  const response = await api.get(
    `/tasks/${taskId}/weather`,
  );

  return response.data;
}