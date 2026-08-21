"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  CalendarDays,
  Cloud,
  CloudDrizzle,
  CloudFog,
  CloudLightning,
  CloudRain,
  CloudSnow,
  CloudSun,
  FileText,
  LogOut,
  MapPin,
  Pencil,
  Plus,
  Search,
  Sun,
  Trash2,
  Umbrella,
  Wind,
  X,
} from "lucide-react";

import { useRouter } from "next/navigation";

import { useAuth } from "@/context/AuthContext";

import {
  createTask,
  deleteTask,
  getTaskWeather,
  getTasks,
  updateTask,
} from "@/lib/tasks";

import type {
  Task,
  TaskPriority,
  TaskStatus,
} from "@/types/task";

export default function DashboardPage() {
  const router = useRouter();

  const {
    user,
    isAuthenticated,
    isLoading: authLoading,
    logout,
  } = useAuth();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const [showCreateForm, setShowCreateForm] =
    useState(false);

  const [editingTask, setEditingTask] =
    useState<Task | null>(null);

  const [deletingTaskId, setDeletingTaskId] =
    useState<string | null>(null);

  const [deleteConfirmTask, setDeleteConfirmTask] =
    useState<Task | null>(null);

  const [weather, setWeather] =
    useState<Record<string, any>>({});

  /*
   * Weather currently being displayed
   */
  const [selectedWeather, setSelectedWeather] =
    useState<{
      weather: Record<string, any>;
      location: string | null;
      taskTitle: string;
    } | null>(null);

  /*
   * =====================================================
   * LOAD TASKS
   * =====================================================
   */

  const loadTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const result = await getTasks({
        page,
        limit: 6,
        search: search || undefined,
        status: status || undefined,
        priority: priority || undefined,
        sortBy: "createdAt",
        sortOrder: "desc",
      });

      setTasks(result.data);
      setTotalPages(result.meta.totalPages || 1);
      setTotal(result.meta.total);
    } catch (err: any) {
      console.error(err);

      const message =
        err?.response?.data?.message;

      setError(
        Array.isArray(message)
          ? message.join(", ")
          : message || "Unable to load tasks.",
      );
    } finally {
      setLoading(false);
    }
  }, [page, search, status, priority]);

  /*
   * =====================================================
   * AUTH CHECK
   * =====================================================
   */

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [
    authLoading,
    isAuthenticated,
    router,
  ]);

  /*
   * =====================================================
   * LOAD TASKS WHEN AUTHENTICATED
   * =====================================================
   */

  useEffect(() => {
    if (isAuthenticated) {
      loadTasks();
    }
  }, [isAuthenticated, loadTasks]);

  /*
   * =====================================================
   * DELETE TASK
   * =====================================================
   */

  async function handleDelete(taskId: string) {
    try {
      setDeletingTaskId(taskId);

      await deleteTask(taskId);
      await loadTasks();

      setDeleteConfirmTask(null);
    } catch (err: any) {
      const message =
        err?.response?.data?.message;

      setError(
        Array.isArray(message)
          ? message.join(", ")
          : message || "Unable to delete task.",
      );
    } finally {
      setDeletingTaskId(null);
    }
  }

  /*
   * =====================================================
   * UPDATE STATUS
   * =====================================================
   */

  async function handleStatusChange(
    task: Task,
    newStatus: TaskStatus,
  ) {
    try {
      await updateTask(task.id, {
        status: newStatus,
      });

      await loadTasks();
    } catch (err: any) {
      const message =
        err?.response?.data?.message;

      setError(
        Array.isArray(message)
          ? message.join(", ")
          : message || "Unable to update task.",
      );
    }
  }

  /*
   * =====================================================
   * WEATHER
   * =====================================================
   */

  async function loadWeather(task: Task) {
    if (!task.location) return;

    try {
      setError("");

      const result =
        await getTaskWeather(task.id);

      setWeather((previous) => ({
        ...previous,
        [task.id]: result.weather,
      }));

      setSelectedWeather({
        weather: result.weather,
        location: task.location,
        taskTitle: task.title,
      });
    } catch (err: any) {
      console.error(
        "Weather request failed:",
        err,
      );

      const message =
        err?.response?.data?.message;

      setError(
        Array.isArray(message)
          ? message.join(", ")
          : message ||
              "Unable to load weather for this location.",
      );
    }
  }

  /*
   * =====================================================
   * LOGOUT
   * =====================================================
   */

  function handleLogout() {
    logout();
    router.replace("/login");
  }

  /*
   * =====================================================
   * LOADING SCREEN
   * =====================================================
   */

  if (
    authLoading ||
    !isAuthenticated
  ) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 px-4">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />

          <p className="font-medium text-gray-700">
            Loading TaskFlow...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-gradient-to-br from-indigo-50 via-white to-purple-50">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/95 backdrop-blur">

        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 sm:py-4 lg:px-8">

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

            {/* BRAND */}

            <div className="flex min-w-0 items-center gap-3">

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-lg sm:h-11 sm:w-11">
                <FileText size={21} />
              </div>

              <div className="min-w-0">

                <h1 className="text-lg font-extrabold text-gray-900 sm:text-xl">
                  TaskFlow
                </h1>

                <p className="truncate text-xs text-gray-600 sm:text-sm">
                  Welcome,{" "}
                  <span className="font-semibold text-indigo-600">
                    {user?.name || "User"}
                  </span>
                </p>

              </div>

            </div>

            {/* LOGOUT */}

            <button
              onClick={handleLogout}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition hover:border-red-300 hover:bg-red-50 hover:text-red-600 sm:w-auto"
            >
              <LogOut size={17} />
              Logout
            </button>

          </div>

        </div>

      </header>

      {/* =====================================================
          MAIN
      ===================================================== */}

      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">

        {/* TITLE */}

        <div className="mb-6 flex flex-col gap-5 sm:mb-7 sm:flex-row sm:items-center sm:justify-between">

          <div className="min-w-0">

            <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-indigo-600 sm:text-sm">
              Personal Workspace
            </p>

            <h2 className="text-2xl font-extrabold text-gray-900 sm:text-3xl">
              My Tasks
            </h2>

            <p className="mt-1 text-sm text-gray-600">
              Stay organized and keep track of your work.
            </p>

          </div>

          <button
            onClick={() =>
              setShowCreateForm(true)
            }
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 sm:w-auto sm:text-base"
          >
            <Plus size={19} />
            Create Task
          </button>

        </div>

        {/* =====================================================
            FILTERS
        ===================================================== */}

        <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:mb-7 sm:p-5">

          <div className="mb-3 flex items-center gap-2">

            <Search
              size={18}
              className="shrink-0 text-indigo-600"
            />

            <h3 className="font-semibold text-gray-900">
              Find your tasks
            </h3>

          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">

            {/* SEARCH */}

            <div className="relative min-w-0">

              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setPage(1);
                }}
                placeholder="Search tasks..."
                className="w-full min-w-0 rounded-xl border border-gray-300 bg-white py-2.5 pl-10 pr-3 text-sm text-gray-900 placeholder:text-gray-500 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />

            </div>

            {/* STATUS */}

            <select
              value={status}
              onChange={(event) => {
                setStatus(event.target.value);
                setPage(1);
              }}
              className="w-full min-w-0 rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            >
              <option value="">
                All statuses
              </option>

              <option value="PENDING">
                Pending
              </option>

              <option value="IN_PROGRESS">
                In Progress
              </option>

              <option value="COMPLETED">
                Completed
              </option>
            </select>

            {/* PRIORITY */}

            <select
              value={priority}
              onChange={(event) => {
                setPriority(event.target.value);
                setPage(1);
              }}
              className="w-full min-w-0 rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            >
              <option value="">
                All priorities
              </option>

              <option value="LOW">
                Low
              </option>

              <option value="MEDIUM">
                Medium
              </option>

              <option value="HIGH">
                High
              </option>
            </select>

            {/* CLEAR */}

            <button
              onClick={() => {
                setSearch("");
                setStatus("");
                setPriority("");
                setPage(1);
              }}
              className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm font-semibold text-gray-700 transition hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700"
            >
              Clear Filters
            </button>

          </div>

        </div>

        {/* =====================================================
            ERROR
        ===================================================== */}

        {error && (
          <div className="mb-6 break-words rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        {/* =====================================================
            LOADING
        ===================================================== */}

        {loading && (
          <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center shadow-sm sm:p-12">

            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />

            <p className="font-medium text-gray-600">
              Loading tasks...
            </p>

          </div>
        )}

        {/* =====================================================
            EMPTY
        ===================================================== */}

        {!loading &&
          tasks.length === 0 && (
            <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm sm:p-14">

              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-100">
                <FileText
                  size={30}
                  className="text-indigo-600"
                />
              </div>

              <h3 className="text-xl font-bold text-gray-900">
                No tasks found
              </h3>

              <p className="mt-2 text-sm text-gray-600">
                Create your first task to get started.
              </p>

              <button
                onClick={() =>
                  setShowCreateForm(true)
                }
                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 font-semibold text-white shadow-md transition hover:bg-indigo-700 sm:w-auto"
              >
                <Plus size={18} />
                Create Task
              </button>

            </div>
          )}

        {/* =====================================================
            TASK GRID
        ===================================================== */}

        {!loading &&
          tasks.length > 0 && (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">

              {tasks.map((task) => (
                <article
                  key={task.id}
                  className="group min-w-0 overflow-hidden rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-xl sm:p-5"
                >

                  {/* CARD HEADER */}

                  <div className="mb-4 flex items-start justify-between gap-3">

                    <div className="min-w-0 flex-1">

                      <h3 className="break-words text-lg font-bold text-gray-900">
                        {task.title}
                      </h3>

                      {task.description && (
                        <p className="mt-1 line-clamp-2 break-words text-sm leading-5 text-gray-600">
                          {task.description}
                        </p>
                      )}

                    </div>

                    {/* STATUS */}

                    <span
                      className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold sm:px-3 sm:text-xs ${
                        task.status ===
                        "COMPLETED"
                          ? "bg-emerald-100 text-emerald-700"
                          : task.status ===
                              "IN_PROGRESS"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {task.status}
                    </span>

                  </div>

                  {/* PRIORITY */}

                  <div className="mb-4">

                    <span
                      className={`inline-flex rounded-lg px-2.5 py-1 text-xs font-bold ${
                        task.priority === "HIGH"
                          ? "bg-red-100 text-red-700"
                          : task.priority === "MEDIUM"
                            ? "bg-orange-100 text-orange-700"
                            : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {task.priority} priority
                    </span>

                  </div>

                  {/* DETAILS */}

                  <div className="space-y-3 text-sm text-gray-600">

                    {task.dueDate && (
                      <div className="flex items-start gap-2">

                        <CalendarDays
                          size={17}
                          className="mt-0.5 shrink-0 text-indigo-500"
                        />

                        <span className="break-words">
                          {new Date(
                            task.dueDate,
                          ).toLocaleString()}
                        </span>

                      </div>
                    )}

                    {task.location && (
                      <div className="flex min-w-0 items-center gap-2">

                        <MapPin
                          size={17}
                          className="shrink-0 text-purple-500"
                        />

                        <span className="min-w-0 truncate">
                          {task.location}
                        </span>

                      </div>
                    )}

                    {weather[task.id] && (
                      <div className="flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-2 text-blue-700">

                        <CloudSun
                          size={17}
                          className="shrink-0"
                        />

                        <span className="truncate font-medium">
                          {Math.round(
                            weather[task.id]
                              .temperature ??
                              weather[task.id]
                                .temp ??
                              0,
                          )}
                          °C{" "}
                          {weather[task.id]
                            .description ||
                            ""}
                        </span>

                      </div>
                    )}

                  </div>

                  {/* ATTACHMENTS */}

                  {task.attachments &&
                    task.attachments.length > 0 && (
                      <div className="mt-4 border-t border-gray-100 pt-4">

                        <p className="mb-2 text-xs font-bold uppercase tracking-wide text-gray-500">
                          Attachments
                        </p>

                        <div className="space-y-2">

                          {task.attachments.map(
                            (attachment) => (
                              <a
                                key={
                                  attachment.id
                                }
                                href={
                                  attachment.fileUrl
                                }
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block truncate rounded-lg bg-indigo-50 px-3 py-2 text-sm font-medium text-indigo-700 transition hover:bg-indigo-100"
                              >
                                📎{" "}
                                {
                                  attachment.fileName
                                }
                              </a>
                            ),
                          )}

                        </div>

                      </div>
                    )}

                  {/* ACTIONS */}

                  <div className="mt-5 flex flex-wrap gap-2 border-t border-gray-100 pt-4">

                    {/* STATUS */}

                    <select
                      value={task.status}
                      onChange={(event) =>
                        handleStatusChange(
                          task,
                          event.target
                            .value as TaskStatus,
                        )
                      }
                      className="min-w-0 flex-1 rounded-lg border border-gray-300 bg-white px-2 py-2 text-xs font-semibold text-gray-900 outline-none focus:border-indigo-500 sm:flex-none"
                    >
                      <option value="PENDING">
                        Pending
                      </option>

                      <option value="IN_PROGRESS">
                        In Progress
                      </option>

                      <option value="COMPLETED">
                        Completed
                      </option>
                    </select>

                    {/* EDIT */}

                    <button
                      onClick={() =>
                        setEditingTask(task)
                      }
                      className="flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-semibold text-gray-700 transition hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700"
                    >
                      <Pencil size={14} />
                      Edit
                    </button>

                    {/* DELETE */}

                    <button
                      onClick={() =>
                        setDeleteConfirmTask(task)
                      }
                      disabled={
                        deletingTaskId ===
                        task.id
                      }
                      className="flex items-center gap-1.5 rounded-lg border border-red-200 bg-white px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                    >
                      <Trash2 size={14} />
                      Delete
                    </button>

                    {/* WEATHER */}

                    {task.location && (
                      <button
                        onClick={() =>
                          loadWeather(task)
                        }
                        className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-blue-200 bg-white px-3 py-2 text-xs font-semibold text-blue-600 transition hover:bg-blue-50 sm:w-auto"
                      >
                        <CloudSun size={14} />
                        Weather
                      </button>
                    )}

                  </div>

                </article>
              ))}

            </div>
          )}

        {/* =====================================================
            PAGINATION
        ===================================================== */}

        {!loading &&
          tasks.length > 0 && (
            <div className="mt-8 flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">

              <button
                disabled={page <= 1}
                onClick={() =>
                  setPage(
                    (previous) =>
                      previous - 1,
                  )
                }
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
              >
                Previous
              </button>

              <span className="rounded-lg bg-indigo-50 px-4 py-2 text-center text-sm font-semibold text-indigo-700">
                Page {page} of {totalPages}
              </span>

              <button
                disabled={
                  page >= totalPages
                }
                onClick={() =>
                  setPage(
                    (previous) =>
                      previous + 1,
                  )
                }
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
              >
                Next
              </button>

            </div>
          )}

      </section>

      {/* =====================================================
          DELETE CONFIRMATION MODAL
      ===================================================== */}

      {deleteConfirmTask && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto bg-black/50 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              setDeleteConfirmTask(null);
            }
          }}
        >

          <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl sm:p-6">

            <div className="flex items-start gap-3 sm:gap-4">

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-100">
                <Trash2
                  size={22}
                  className="text-red-600"
                />
              </div>

              <div className="min-w-0 flex-1">

                <h2 className="text-xl font-bold text-gray-900">
                  Delete Task
                </h2>

                <p className="mt-2 break-words text-sm leading-6 text-gray-600">
                  Are you sure you want to
                  delete{" "}
                  <span className="font-semibold text-gray-900">
                    "{deleteConfirmTask.title}"
                  </span>
                  ?
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  This action cannot be undone.
                </p>

              </div>

              <button
                type="button"
                onClick={() =>
                  setDeleteConfirmTask(null)
                }
                disabled={
                  deletingTaskId ===
                  deleteConfirmTask.id
                }
                className="shrink-0 rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900 disabled:opacity-50"
              >
                <X size={20} />
              </button>

            </div>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

              <button
                type="button"
                onClick={() =>
                  setDeleteConfirmTask(null)
                }
                disabled={
                  deletingTaskId ===
                  deleteConfirmTask.id
                }
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 font-semibold text-gray-700 transition hover:bg-gray-100 disabled:opacity-50 sm:w-auto"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() =>
                  handleDelete(
                    deleteConfirmTask.id,
                  )
                }
                disabled={
                  deletingTaskId ===
                  deleteConfirmTask.id
                }
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-3 font-semibold text-white shadow-sm transition hover:bg-red-700 disabled:opacity-50 sm:w-auto"
              >
                <Trash2 size={17} />

                {deletingTaskId ===
                deleteConfirmTask.id
                  ? "Deleting..."
                  : "Delete Task"}
              </button>

            </div>

          </div>

        </div>
      )}

      {/* =====================================================
          CREATE TASK MODAL
      ===================================================== */}

      {showCreateForm && (
        <TaskForm
          onClose={() =>
            setShowCreateForm(false)
          }
          onSuccess={async () => {
            setShowCreateForm(false);
            setPage(1);
            await loadTasks();
          }}
        />
      )}

      {/* =====================================================
          EDIT TASK MODAL
      ===================================================== */}

      {editingTask && (
        <EditTaskForm
          task={editingTask}
          onClose={() =>
            setEditingTask(null)
          }
          onSuccess={async () => {
            setEditingTask(null);
            await loadTasks();
          }}
        />
      )}

      {/* =====================================================
          LIVE WEATHER MODAL
      ===================================================== */}

      {selectedWeather && (
        <LiveWeatherModal
          weather={selectedWeather.weather}
          location={selectedWeather.location}
          taskTitle={selectedWeather.taskTitle}
          onClose={() =>
            setSelectedWeather(null)
          }
        />
      )}

    </main>
  );
}

/* =========================================================
   CREATE TASK FORM
========================================================= */

function TaskForm({
  onClose,
  onSuccess,
}: {
  onClose: () => void;
  onSuccess: () => Promise<void>;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] =
    useState("");

  const [status, setStatus] =
    useState<TaskStatus>("PENDING");

  const [priority, setPriority] =
    useState<TaskPriority>("MEDIUM");

  const [dueDate, setDueDate] =
    useState("");

  const [location, setLocation] =
    useState("");

  const [files, setFiles] =
    useState<File[]>([]);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  async function submit(
    event: React.FormEvent,
  ) {
    event.preventDefault();

    if (!title.trim()) {
      setError("Title is required.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await createTask({
        title: title.trim(),
        description:
          description.trim() || undefined,
        status,
        priority,
        dueDate:
          dueDate || undefined,
        location:
          location.trim() || undefined,
        files,
      });

      await onSuccess();
    } catch (err: any) {
      const message =
        err?.response?.data?.message;

      setError(
        Array.isArray(message)
          ? message.join(", ")
          : message ||
              "Unable to create task.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-3 backdrop-blur-sm sm:p-4"
      onMouseDown={(event) => {
        if (
          event.target ===
          event.currentTarget
        ) {
          onClose();
        }
      }}
    >

      <div className="my-4 w-full max-w-lg rounded-2xl bg-white p-5 shadow-2xl sm:my-8 sm:p-6">

        <div className="mb-5 flex items-center justify-between sm:mb-6">

          <div className="min-w-0">

            <p className="text-sm font-semibold text-indigo-600">
              New task
            </p>

            <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
              Create Task
            </h2>

          </div>

          <button
            onClick={onClose}
            className="shrink-0 rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
          >
            <X size={20} />
          </button>

        </div>

        {error && (
          <div className="mb-4 break-words rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        <form
          onSubmit={submit}
          className="space-y-4"
        >

          <input
            value={title}
            onChange={(e) =>
              setTitle(e.target.value)
            }
            placeholder="Task title"
            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-500 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />

          <textarea
            value={description}
            onChange={(e) =>
              setDescription(
                e.target.value,
              )
            }
            placeholder="Description"
            rows={3}
            className="w-full resize-none rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-500 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">

            <select
              value={status}
              onChange={(e) =>
                setStatus(
                  e.target.value as TaskStatus,
                )
              }
              className="w-full rounded-xl border border-gray-300 bg-white px-3 py-3 text-gray-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            >
              <option value="PENDING">
                Pending
              </option>

              <option value="IN_PROGRESS">
                In Progress
              </option>

              <option value="COMPLETED">
                Completed
              </option>
            </select>

            <select
              value={priority}
              onChange={(e) =>
                setPriority(
                  e.target.value as TaskPriority,
                )
              }
              className="w-full rounded-xl border border-gray-300 bg-white px-3 py-3 text-gray-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            >
              <option value="LOW">
                Low
              </option>

              <option value="MEDIUM">
                Medium
              </option>

              <option value="HIGH">
                High
              </option>
            </select>

          </div>

          <input
            type="datetime-local"
            value={dueDate}
            onChange={(e) =>
              setDueDate(e.target.value)
            }
            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />

          <input
            value={location}
            onChange={(e) =>
              setLocation(e.target.value)
            }
            placeholder="Location / City"
            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-500 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />

          <div className="rounded-xl border border-dashed border-indigo-300 bg-indigo-50 p-4">

            <label className="mb-2 block text-sm font-semibold text-indigo-800">
              Attach files
            </label>

            <input
              type="file"
              multiple
              accept="image/*,.pdf,.doc,.docx,.txt"
              onChange={(e) =>
                setFiles(
                  Array.from(
                    e.target.files || [],
                  ),
                )
              }
              className="w-full text-sm text-gray-700 file:mr-3 file:rounded-lg file:border-0 file:bg-indigo-600 file:px-3 file:py-2 file:font-semibold file:text-white hover:file:bg-indigo-700"
            />

            <p className="mt-2 text-xs text-gray-500">
              Images, PDF, DOC, DOCX and TXT files are supported.
            </p>

          </div>

          <div className="flex flex-col gap-3 pt-3 sm:flex-row">

            <button
              type="button"
              onClick={onClose}
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 font-semibold text-gray-700 transition hover:bg-gray-100 sm:flex-1"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-3 font-semibold text-white shadow-md transition hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 sm:flex-1"
            >
              {loading
                ? "Creating..."
                : "Create Task"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

/* =========================================================
   EDIT TASK FORM
========================================================= */

function EditTaskForm({
  task,
  onClose,
  onSuccess,
}: {
  task: Task;
  onClose: () => void;
  onSuccess: () => Promise<void>;
}) {
  const [title, setTitle] =
    useState(task.title);

  const [description, setDescription] =
    useState(task.description || "");

  const [status, setStatus] =
    useState<TaskStatus>(task.status);

  const [priority, setPriority] =
    useState<TaskPriority>(task.priority);

  const [location, setLocation] =
    useState(task.location || "");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  async function submit(
    event: React.FormEvent,
  ) {
    event.preventDefault();

    if (!title.trim()) {
      setError("Title is required.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await updateTask(task.id, {
        title: title.trim(),
        description:
          description.trim(),
        status,
        priority,
        location:
          location.trim(),
      });

      await onSuccess();
    } catch (err: any) {
      const message =
        err?.response?.data?.message;

      setError(
        Array.isArray(message)
          ? message.join(", ")
          : message ||
              "Unable to update task.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-3 backdrop-blur-sm sm:p-4"
      onMouseDown={(event) => {
        if (
          event.target ===
          event.currentTarget
        ) {
          onClose();
        }
      }}
    >

      <div className="my-4 w-full max-w-lg rounded-2xl bg-white p-5 shadow-2xl sm:my-8 sm:p-6">

        <div className="mb-5 flex items-center justify-between sm:mb-6">

          <div className="min-w-0">

            <p className="text-sm font-semibold text-purple-600">
              Update task
            </p>

            <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
              Edit Task
            </h2>

          </div>

          <button
            onClick={onClose}
            className="shrink-0 rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
          >
            <X size={20} />
          </button>

        </div>

        {error && (
          <div className="mb-4 break-words rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        <form
          onSubmit={submit}
          className="space-y-4"
        >

          <input
            value={title}
            onChange={(e) =>
              setTitle(e.target.value)
            }
            placeholder="Task title"
            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-500 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />

          <textarea
            value={description}
            onChange={(e) =>
              setDescription(
                e.target.value,
              )
            }
            rows={3}
            placeholder="Description"
            className="w-full resize-none rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-500 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">

            <select
              value={status}
              onChange={(e) =>
                setStatus(
                  e.target.value as TaskStatus,
                )
              }
              className="w-full rounded-xl border border-gray-300 bg-white px-3 py-3 text-gray-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            >
              <option value="PENDING">
                Pending
              </option>

              <option value="IN_PROGRESS">
                In Progress
              </option>

              <option value="COMPLETED">
                Completed
              </option>
            </select>

            <select
              value={priority}
              onChange={(e) =>
                setPriority(
                  e.target.value as TaskPriority,
                )
              }
              className="w-full rounded-xl border border-gray-300 bg-white px-3 py-3 text-gray-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            >
              <option value="LOW">
                Low
              </option>

              <option value="MEDIUM">
                Medium
              </option>

              <option value="HIGH">
                High
              </option>
            </select>

          </div>

          <input
            value={location}
            onChange={(e) =>
              setLocation(e.target.value)
            }
            placeholder="Location / City"
            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-500 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />

          <div className="flex flex-col gap-3 pt-3 sm:flex-row">

            <button
              type="button"
              onClick={onClose}
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 font-semibold text-gray-700 transition hover:bg-gray-100 sm:flex-1"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-3 font-semibold text-white shadow-md transition hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 sm:flex-1"
            >
              {loading
                ? "Saving..."
                : "Save Changes"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

/* =========================================================
   LIVE WEATHER MODAL
========================================================= */

function LiveWeatherModal({
  weather,
  location,
  taskTitle,
  onClose,
}: {
  weather: Record<string, any>;
  location: string | null;
  taskTitle: string;
  onClose: () => void;
}) {
  /*
   * Support several common backend response names.
   */

  const description = String(
    weather?.description ||
      weather?.condition ||
      weather?.weather ||
      "Weather",
  );

  const temperature =
    weather?.temperature ??
    weather?.temp ??
    weather?.temperatureC ??
    0;

  const feelsLike =
    weather?.feelsLike ??
    weather?.feels_like ??
    weather?.feelsLikeC ??
    null;

  const humidity =
    weather?.humidity ??
    weather?.humidityPercent ??
    null;

  const wind =
    weather?.windSpeed ??
    weather?.wind_speed ??
    weather?.wind ??
    null;

  /*
   * Determine visual weather condition.
   */

  const condition =
    description.toLowerCase();

  const isRain =
    condition.includes("rain") ||
    condition.includes("drizzle") ||
    condition.includes("shower");

  const isStorm =
    condition.includes("storm") ||
    condition.includes("thunder") ||
    condition.includes("lightning");

  const isSnow =
    condition.includes("snow") ||
    condition.includes("sleet") ||
    condition.includes("ice");

  const isFog =
    condition.includes("fog") ||
    condition.includes("mist") ||
    condition.includes("haze");

  const isCloudy =
    condition.includes("cloud") ||
    condition.includes("overcast");

  const isClear =
    condition.includes("clear") ||
    condition.includes("sun");

  let WeatherIcon = CloudSun;

  if (isStorm) {
    WeatherIcon = CloudLightning;
  } else if (isRain) {
    WeatherIcon = CloudRain;
  } else if (isSnow) {
    WeatherIcon = CloudSnow;
  } else if (isFog) {
    WeatherIcon = CloudFog;
  } else if (isCloudy) {
    WeatherIcon = Cloud;
  } else if (isClear) {
    WeatherIcon = Sun;
  }

  /*
   * Weather visual theme.
   */

  let backgroundClass =
    "from-sky-500 via-blue-500 to-indigo-600";

  if (isRain) {
    backgroundClass =
      "from-slate-600 via-blue-700 to-indigo-900";
  }

  if (isStorm) {
    backgroundClass =
      "from-slate-800 via-indigo-900 to-purple-950";
  }

  if (isSnow) {
    backgroundClass =
      "from-sky-200 via-blue-300 to-indigo-500";
  }

  if (isFog) {
    backgroundClass =
      "from-gray-500 via-slate-500 to-gray-700";
  }

  if (isCloudy) {
    backgroundClass =
      "from-slate-400 via-blue-500 to-indigo-700";
  }

  if (isClear) {
    backgroundClass =
      "from-cyan-400 via-sky-500 to-indigo-600";
  }

  /*
   * Close with Escape.
   */

  useEffect(() => {
    function handleEscape(
      event: KeyboardEvent,
    ) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener(
      "keydown",
      handleEscape,
    );

    return () => {
      document.removeEventListener(
        "keydown",
        handleEscape,
      );
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center overflow-y-auto bg-black/60 p-3 backdrop-blur-md sm:p-5"
      onMouseDown={(event) => {
        if (
          event.target ===
          event.currentTarget
        ) {
          onClose();
        }
      }}
    >

      {/* WEATHER SCREEN */}

      <div
        className={`relative my-4 min-h-[520px] w-full max-w-2xl overflow-hidden rounded-[2rem] bg-gradient-to-br ${backgroundClass} text-white shadow-2xl sm:min-h-[580px]`}
      >

        {/* =================================================
            ANIMATED WEATHER BACKGROUND
        ================================================= */}

        {isRain && (
          <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-50">

            {Array.from({
              length: 35,
            }).map((_, index) => (
              <span
                key={index}
                className="absolute h-16 w-px animate-pulse bg-white/60"
                style={{
                  left: `${(index * 29) % 100}%`,
                  top: `${(index * 17) % 100}%`,
                  animationDelay: `${
                    index * 0.08
                  }s`,
                  transform:
                    "rotate(15deg)",
                }}
              />
            ))}

          </div>
        )}

        {isSnow && (
          <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-80">

            {Array.from({
              length: 30,
            }).map((_, index) => (
              <span
                key={index}
                className="absolute h-2 w-2 animate-pulse rounded-full bg-white"
                style={{
                  left: `${(index * 31) % 100}%`,
                  top: `${(index * 19) % 100}%`,
                  animationDelay: `${
                    index * 0.12
                  }s`,
                }}
              />
            ))}

          </div>
        )}

        {isClear && (
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-yellow-200/30 blur-3xl" />
        )}

        {/* =================================================
            CLOSE BUTTON
        ================================================= */}

        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-20 rounded-full bg-black/20 p-2.5 text-white backdrop-blur-md transition hover:bg-black/35 sm:right-5 sm:top-5"
        >
          <X size={21} />
        </button>

        {/* =================================================
            CONTENT
        ================================================= */}

        <div className="relative z-10 flex min-h-[520px] flex-col p-6 sm:min-h-[580px] sm:p-10">

          {/* TOP */}

          <div className="flex items-start gap-3">

            <div className="rounded-2xl bg-white/15 p-3 backdrop-blur-md">

              <MapPin size={22} />

            </div>

            <div className="min-w-0">

              <p className="text-sm font-medium text-white/70">
                Live Weather
              </p>

              <h2 className="truncate text-xl font-bold sm:text-2xl">
                {location || "Unknown location"}
              </h2>

              <p className="mt-1 truncate text-xs text-white/70 sm:text-sm">
                Task: {taskTitle}
              </p>

            </div>

          </div>

          {/* MAIN WEATHER */}

          <div className="flex flex-1 flex-col items-center justify-center text-center">

            <div className="mb-5 rounded-full bg-white/15 p-5 shadow-xl backdrop-blur-md sm:p-7">

              <WeatherIcon
                size={72}
                strokeWidth={1.5}
                className="sm:h-24 sm:w-24"
              />

            </div>

            <div className="flex items-start justify-center">

              <span className="text-6xl font-extrabold tracking-tight sm:text-8xl">
                {Math.round(
                  Number(temperature) || 0,
                )}
              </span>

              <span className="mt-2 text-3xl font-semibold sm:text-4xl">
                °C
              </span>

            </div>

            <h3 className="mt-3 text-2xl font-bold capitalize sm:text-3xl">
              {description}
            </h3>

            <p className="mt-2 text-sm text-white/70">
              Current conditions
            </p>

          </div>

          {/* WEATHER STATS */}

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">

            {/* FEELS LIKE */}

            <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-md">

              <p className="text-xs font-medium text-white/60">
                Feels like
              </p>

              <p className="mt-1 text-lg font-bold">
                {feelsLike !== null
                  ? `${Math.round(
                      Number(feelsLike) ||
                        0,
                    )}°C`
                  : "—"}
              </p>

            </div>

            {/* HUMIDITY */}

            <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-md">

              <p className="text-xs font-medium text-white/60">
                Humidity
              </p>

              <p className="mt-1 text-lg font-bold">
                {humidity !== null
                  ? `${humidity}%`
                  : "—"}
              </p>

            </div>

            {/* WIND */}

            <div className="col-span-2 rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-md sm:col-span-1">

              <div className="flex items-center gap-2">

                <Wind size={16} />

                <p className="text-xs font-medium text-white/60">
                  Wind
                </p>

              </div>

              <p className="mt-1 text-lg font-bold">
                {wind !== null
                  ? `${wind}`
                  : "—"}
              </p>

            </div>

          </div>

          {/* BOTTOM */}

          <div className="mt-5 flex items-center justify-center gap-2 text-xs text-white/60">

            {isRain && (
              <>
                <Umbrella size={14} />
                Rainy conditions
              </>
            )}

            {isStorm && (
              <>
                <CloudLightning
                  size={14}
                />
                Storm conditions
              </>
            )}

            {isSnow && (
              <>
                <CloudSnow size={14} />
                Snowy conditions
              </>
            )}

            {isFog && (
              <>
                <CloudFog size={14} />
                Low visibility
              </>
            )}

            {isCloudy && !isRain && (
              <>
                <Cloud size={14} />
                Cloudy conditions
              </>
            )}

            {isClear && (
              <>
                <Sun size={14} />
                Clear skies
              </>
            )}

            {!isRain &&
              !isStorm &&
              !isSnow &&
              !isFog &&
              !isCloudy &&
              !isClear && (
                <>
                  <CloudSun size={14} />
                  Weather information
                </>
              )}

          </div>

        </div>

      </div>

    </div>
  );
}