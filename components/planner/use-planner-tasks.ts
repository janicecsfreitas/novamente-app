"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export type TaskArea = "Casa" | "Trabalho" | "Treino" | "Estudo" | "Saúde" | "Outro";
export type TaskPriority = "Normal" | "Alta" | "Essencial";

export interface Task {
  id: string;
  title: string;
  description: string;
  time: string;
  area: TaskArea;
  priority: TaskPriority;
  icon: string;
  done: boolean;
  taskDate: string;
  createdAt: string;
  completedAt?: string;
  userId?: string;
}

function formatDate(date: Date): string {
  return date.toISOString().split("T")[0];
}

function getDayOfWeekName(date: Date): string {
  const days = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"];
  return days[date.getDay()];
}

function getInitialDate(): string {
  if (typeof window !== "undefined") {
    const params = new URLSearchParams(window.location.search);
    const dateParam = params.get("date");
    if (dateParam) return dateParam;
  }
  return formatDate(new Date());
}

export function usePlannerTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(getInitialDate());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();
  const router = useRouter();

  const fetchTasks = useCallback(async (date: string) => {
    try {
      setLoading(true);
      setError(null);

      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        setLoading(false);
        return;
      }

      const { data, error: fetchError } = await supabase
        .from("planner_tasks")
        .select("*")
        .eq("user_id", session.user.id)
        .eq("task_date", date)
        .order("time", { ascending: true });

      if (fetchError) throw fetchError;

      const mappedTasks: Task[] = (data || []).map((row: Record<string, unknown>) => ({
        id: String(row.id),
        title: String(row.title),
        description: String(row.description || ""),
        time: String(row.time),
        area: String(row.area) as TaskArea,
        priority: String(row.priority) as TaskPriority,
        icon: String(row.icon || "task"),
        done: Boolean(row.done),
        taskDate: String(row.task_date),
        createdAt: String(row.created_at),
        completedAt: row.completed_at ? String(row.completed_at) : undefined,
        userId: String(row.user_id),
      }));

      setTasks(mappedTasks);
    } catch (err) {
      console.error("Error fetching tasks:", err);
      setError("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    fetchTasks(selectedDate);
  }, [selectedDate, fetchTasks]);

  const addTask = useCallback(
    async (task: Omit<Task, "id" | "done" | "createdAt" | "icon" | "userId" | "taskDate"> & { taskDate: string }) => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.user) {
          router.push("/login");
          return;
        }

        const icon = task.priority === "Essencial" ? "stars" : task.priority === "Alta" ? "priority_high" : "radio_button_unchecked";

        const { data, error: insertError } = await supabase
          .from("planner_tasks")
          .insert({
            user_id: session.user.id,
            title: task.title,
            description: task.description,
            time: task.time,
            area: task.area,
            priority: task.priority,
            icon,
            done: false,
            task_date: task.taskDate,
          })
          .select()
          .single();

        if (insertError) throw insertError;

        const newTask: Task = {
          id: String(data.id),
          title: data.title,
          description: data.description,
          time: data.time,
          area: data.area as TaskArea,
          priority: data.priority as TaskPriority,
          icon: data.icon,
          done: false,
          taskDate: data.task_date,
          createdAt: data.created_at,
        };

        setTasks((prev) => [...prev, newTask]);
      } catch (err) {
        console.error("Error adding task:", err);
        setError("Failed to add task");
      }
    },
    [supabase, router, selectedDate]
  );

  const toggleTaskDone = useCallback(
    async (taskId: string) => {
      const task = tasks.find((t) => t.id === taskId);
      if (!task) return;

      const newDone = !task.done;
      const completedAt = newDone ? new Date().toISOString() : null;

      try {
        await supabase
          .from("planner_tasks")
          .update({ done: newDone, completed_at: completedAt })
          .eq("id", taskId);

        setTasks((prev) =>
          prev.map((t) =>
            t.id === taskId
              ? { ...t, done: newDone, completedAt: completedAt || undefined }
              : t
          )
        );
      } catch (err) {
        console.error("Error toggling task:", err);
        setError("Failed to update task");
      }
    },
    [supabase, tasks]
  );

  const removeTask = useCallback(
    async (taskId: string) => {
      try {
        await supabase
          .from("planner_tasks")
          .delete()
          .eq("id", taskId);

        setTasks((prev) => prev.filter((t) => t.id !== taskId));
      } catch (err) {
        console.error("Error removing task:", err);
        setError("Failed to remove task");
      }
    },
    [supabase]
  );

  const changeDate = useCallback((date: string) => {
    setSelectedDate(date);
  }, []);

  const goToNextDay = useCallback(() => {
    const current = new Date(selectedDate);
    current.setDate(current.getDate() + 1);
    setSelectedDate(formatDate(current));
  }, [selectedDate]);

  const goToPrevDay = useCallback(() => {
    const current = new Date(selectedDate);
    current.setDate(current.getDate() - 1);
    setSelectedDate(formatDate(current));
  }, [selectedDate]);

  const goToToday = useCallback(() => {
    setSelectedDate(formatDate(new Date()));
  }, []);

  const fetchWeeklyStats = useCallback(async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return [];

      const today = new Date();
      const weekAgo = new Date(today);
      weekAgo.setDate(weekAgo.getDate() - 6);
      const todayStr = formatDate(today);
      const weekAgoStr = formatDate(weekAgo);

      const { data } = await supabase
        .from("planner_tasks")
        .select("task_date, done")
        .eq("user_id", session.user.id)
        .gte("task_date", weekAgoStr)
        .lte("task_date", todayStr);

      return data || [];
    } catch {
      return [];
    }
  }, [supabase]);

  const [weeklyData, setWeeklyData] = useState<{ task_date: string; done: boolean }[]>([]);

  useEffect(() => {
    fetchWeeklyStats().then(setWeeklyData);
  }, [fetchWeeklyStats]);

  const weeklyPerformance = useMemo(() => {
    if (!weeklyData.length) return Array(7).fill(0);

    const byDate: Record<string, number> = {};
    weeklyData.forEach((t) => {
      byDate[t.task_date] = (byDate[t.task_date] || 0) + (t.done ? 1 : 0);
    });

    const byDateTotal: Record<string, number> = {};
    weeklyData.forEach((t) => {
      byDateTotal[t.task_date] = (byDateTotal[t.task_date] || 0) + 1;
    });

    const result: number[] = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = formatDate(d);
      const done = byDate[dateStr] || 0;
      const total = byDateTotal[dateStr] || 0;
      result.push(total > 0 ? Math.round((done / total) * 100) : 0);
    }

    return result;
  }, [weeklyData]);

  const consistencyDays = useMemo(() => {
    return weeklyPerformance.filter(p => p > 0).length;
  }, [weeklyPerformance]);

  const performance = useMemo(() => {
    if (tasks.length === 0) return 0;
    const doneCount = tasks.filter((t) => t.done).length;
    return Math.round((doneCount / tasks.length) * 100);
  }, [tasks]);

  const stats = useMemo(() => {
    return {
      tasksDone: tasks.filter(t => t.done).length,
      totalTasks: tasks.length,
      performance,
    };
  }, [tasks, performance]);

  const historicalStats = useMemo(() => {
    return {
      focus: stats.tasksDone,
      health: performance >= 70 ? "Alta" : performance >= 40 ? "Média" : "Baixa",
      evolution: "+0%",
    };
  }, [performance, stats.tasksDone]);

  const selectedDateObj = useMemo(() => new Date(selectedDate + "T00:00:00"), [selectedDate]);
  
  const dayLabel = useMemo(() => {
    const today = formatDate(new Date());
    if (selectedDate === today) return "Hoje";
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    if (selectedDate === formatDate(tomorrow)) return "Amanhã";
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    if (selectedDate === formatDate(yesterday)) return "Ontem";
    return getDayOfWeekName(selectedDateObj);
  }, [selectedDate, selectedDateObj]);

  const sortedTasks = useMemo(() => {
    return [...tasks].sort((a, b) => {
      if (a.done !== b.done) return a.done ? 1 : -1;
      return a.time.localeCompare(b.time);
    });
  }, [tasks]);

  return {
    tasks: sortedTasks,
    performance,
    historicalStats,
    weeklyPerformance,
    consistencyDays,
    loading,
    error,
    selectedDate,
    dayLabel,
    addTask,
    toggleTaskDone,
    removeTask,
    changeDate,
    goToNextDay,
    goToPrevDay,
    goToToday,
    refetch: () => fetchTasks(selectedDate),
  };
}