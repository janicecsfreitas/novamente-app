"use client";

import Link from "next/link";
import { AppHeader, MobileBottomMenu } from "@/components/app-navigation";
import { usePlannerTasks } from "@/components/planner/use-planner-tasks";

function formatDateDisplay(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
}

export default function PlannerPage() {
  const { tasks, performance, historicalStats, weeklyPerformance, consistencyDays, loading, error, selectedDate, dayLabel, toggleTaskDone, removeTask, goToNextDay, goToPrevDay, goToToday } = usePlannerTasks();

  const statsItems = [
    ["timer", "Foco", `${historicalStats.focus}`],
    ["favorite", "Saúde", historicalStats.health],
    ["trending_up", "Evolução", historicalStats.evolution],
  ] as const;

  const handleDelete = async (taskId: string) => {
    if (window.confirm("Tem certeza que deseja excluir esta tarefa?")) {
      await removeTask(taskId);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f7] pb-28 text-[#111827] md:pb-8 md:pl-72">
      <AppHeader active="routine" />

      <main className="mx-auto max-w-7xl px-4 py-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_1.35fr_0.9fr]">
          {/* LEFT */}
          <section className="space-y-6">
            <div className="rounded-[2.5rem] border border-white/70 bg-white/80 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.06)] backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <span className="inline-flex rounded-full bg-[#e8f2ff] px-4 py-2 text-[11px] font-black uppercase tracking-[0.22em] text-[#FF6B2C]">
                  Health Planner
                </span>
                
                <button
                  type="button"
                  onClick={goToToday}
                  className="rounded-full bg-[#FF6B2C] px-3 py-1 text-[8px] font-black text-white"
                >
                  Hoje
                </button>
              </div>

              <div className="mt-3 flex items-center gap-2">
                <button
                  type="button"
                  onClick={goToPrevDay}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f8f8fa] text-black/55 transition hover:bg-[#FF6B2C] hover:text-white"
                >
                  <span className="material-symbols-outlined text-xl">chevron_left</span>
                </button>
                
                <h1 className="flex-1 text-3xl font-black tracking-[-0.05em] md:text-2xl">
                  {dayLabel}
                </h1>
                
                <button
                  type="button"
                  onClick={goToNextDay}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f8f8fa] text-black/55 transition hover:bg-[#FF6B2C] hover:text-white"
                >
                  <span className="material-symbols-outlined text-xl">chevron_right</span>
                </button>
              </div>

              <p className="mt-2 text-sm text-black/45">
                {formatDateDisplay(selectedDate)} • {performance}% de eficiência
              </p>

              <div className="mt-6 rounded-[2rem] bg-[#f8f8fa] p-5">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-[11px] font-black uppercase tracking-[0.2em] text-black/35">
                    Performance
                  </span>

                  <span className="text-3xl font-black text-[#FF6B2C]">
                    {performance}%
                  </span>
                </div>

                <div className="h-3 overflow-hidden rounded-full bg-black/10">
                  <div className="h-full rounded-full bg-[#FF6B2C]" style={{ width: `${performance}%` }} />
                </div>
              </div>
            </div>

            <section className="grid grid-cols-3 gap-3">
              {statsItems.map(([icon, label, value]) => (
                <article
                  key={label}
                  className="rounded-[1.75rem] border border-white/70 bg-white/80 p-4 text-center shadow-[0_18px_50px_rgba(0,0,0,0.05)]"
                >
                  <span className="material-symbols-outlined text-[#FF6B2C]">
                    {icon}
                  </span>

                  <p className="mt-2 text-[10px] font-black uppercase tracking-[0.18em] text-black/35">
                    {label}
                  </p>

                  <strong className="mt-1 block text-sm font-black">
                    {value}
                  </strong>
                </article>
              ))}
            </section>
          </section>

          {/* CENTER */}
          <section className="rounded-[2.5rem] border border-white/70 bg-white/80 p-5 shadow-[0_20px_60px_rgba(0,0,0,0.06)] backdrop-blur-xl">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[#FF6B2C]">
                  Agenda
                </p>

                <h2 className="mt-1 text-2xl font-black">Tarefas de hoje</h2>
              </div>

              <Link
                href="/tarefas/nova"
                className="hidden rounded-full bg-[#FF6B2C] px-5 py-3 text-xs font-black text-white shadow-[0_12px_30px_rgba(255,107,44,0.25)] lg:inline-flex"
              >
                Nova tarefa
              </Link>
            </div>

            <div className="space-y-4">
              {tasks.map((task) => (
                <article
                  key={task.id}
                  className={`rounded-[2rem] border border-white/70 bg-white p-4 shadow-[0_15px_45px_rgba(0,0,0,0.05)] ${
                    task.done ? "opacity-60" : ""
                  }`}
                >
                  <div className="mb-3 flex items-center justify-between">
                    <span className="rounded-full bg-[#f8f8fa] px-3 py-1 text-[11px] font-black text-black/45">
                      {task.time}
                    </span>

                    <span className="text-[11px] font-black uppercase tracking-[0.18em] text-[#FF6B2C]">
                      {task.area}
                    </span>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e8f2ff] text-[#FF6B2C]">
                      <span className="material-symbols-outlined">
                        {task.icon}
                      </span>
                    </div>

                    <div className="flex-1">
                      <h3 className="font-black">{task.title}</h3>
                      <p className="text-sm text-black/45">{task.description}</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleTaskDone(task.id)}
                      className={`flex h-8 w-8 items-center justify-center rounded-full transition ${
                        task.done
                          ? "bg-[#FF6B2C] text-white"
                          : "bg-[#f8f8fa] text-transparent hover:bg-[#FF6B2C]/20"
                      }`}
                    >
                      <span className="material-symbols-outlined text-sm">
                        check
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(task.id)}
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f8f8fa] text-black/35 transition hover:bg-red-100 hover:text-red-500"
                    >
                      <span className="material-symbols-outlined text-sm">
                        delete
                      </span>
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* RIGHT */}
          <aside className="hidden space-y-6 lg:block">
            <div className="rounded-[2.5rem] border border-white/70 bg-white/80 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.06)]">
              <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[#FF6B2C]">
                Semana
              </p>

              <h3 className="mt-2 text-2xl font-black">Constância</h3>

              <div className="mt-6 flex h-36 items-end gap-3">
                {weeklyPerformance.map((height, index) => (
                  <div
                    key={index}
                    className="flex-1 rounded-full bg-[#FF6B2C]"
                    style={{ height: `${height || 10}%`, opacity: height > 0 ? 1 : 0.3 }}
                  />
                ))}
              </div>

              <p className="mt-5 text-sm leading-7 text-black/45">
                Você manteve consistência em {consistencyDays} dos últimos 7 dias.
              </p>
            </div>

            <div className="rounded-[2.5rem] border border-white/70 bg-white/80 p-5 shadow-[0_20px_60px_rgba(0,0,0,0.06)]">
              <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[#FF6B2C]">
                Resumo
              </p>

              <div className="mt-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-black/55">Total</span>
                  <span className="font-black">{tasks.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-black/55">Concluídas</span>
                  <span className="font-black text-green-600">{tasks.filter(t => t.done).length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-black/55">Pendentes</span>
                  <span className="font-black text-[#FF6B2C]">{tasks.filter(t => !t.done).length}</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* <Link
        href="/tarefas/nova"
        className="fixed bottom-28 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#FF6B2C] text-white shadow-[0_18px_45px_rgba(255,107,44,0.25)] active:scale-95 md:bottom-8"
      >
        <span className="material-symbols-outlined text-2xl">add</span>
      </Link> */}

      <MobileBottomMenu active="routine" />
    </div>
  );
}
