"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { AppHeader, MobileBottomMenu } from "@/components/app-navigation";
import { usePlannerTasks, TaskArea, TaskPriority } from "@/components/planner/use-planner-tasks";

function getTodayDate(): string {
  return new Date().toISOString().split("T")[0];
}

export default function NovaTarefaPage() {
  const router = useRouter();
  const { addTask } = usePlannerTasks();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const taskDate = formData.get("taskDate") as string;
    
    addTask({
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      time: formData.get("time") as string || "12:00",
      taskDate,
      area: (formData.get("area") as TaskArea) || "Casa",
      priority: (formData.get("priority") as TaskPriority) || "Normal",
    });

    router.push(`/planner?date=${taskDate}`);
  }

  return (
    <div className="min-h-screen bg-[#f5f5f7] pb-28 text-[#111827] md:pb-8 md:pl-72">
      <AppHeader active="routine" />

      <main className="mx-auto max-w-4xl px-4 py-6">
        <section className="rounded-[2.5rem] border border-white/70 bg-white/80 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.06)] backdrop-blur-xl md:p-8">
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <span className="inline-flex rounded-full bg-[#e8f2ff] px-4 py-2 text-[11px] font-black uppercase tracking-[0.22em] text-[#FF6B2C]">
                Apple Planner
              </span>

              <h1 className="mt-4 text-4xl font-black tracking-[-0.05em] md:text-5xl">
                Nova tarefa
              </h1>

              <p className="mt-2 text-sm leading-7 text-black/45">
                Organize seu dia com foco, leveza e clareza.
              </p>
            </div>

            <Link
              href="/planner"
              className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-black text-black/55 shadow-[0_10px_30px_rgba(0,0,0,0.06)] transition hover:text-[##FF6B2C]"
            >
              <span className="material-symbols-outlined text-[18px]">
                arrow_back
              </span>
              Voltar
            </Link>
          </div>

          <form onSubmit={handleSubmit} className="grid gap-5">
            <div>
              <label
                htmlFor="title"
                className="mb-2 block text-[11px] font-black uppercase tracking-[0.22em] text-black/35"
              >
                Título
              </label>

              <input
                id="title"
                name="title"
                type="text"
                required
                placeholder="Ex: Bloco de foco profundo"
                className="h-14 w-full rounded-2xl bg-[#f8f8fa] px-5 text-sm font-semibold outline-none transition focus:bg-white focus:ring-4 focus:ring-[#FF6B2C]/10"
              />
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              <div>
                <label
                  htmlFor="time"
                  className="mb-2 block text-[11px] font-black uppercase tracking-[0.22em] text-black/35"
                >
                  Horário
                </label>

                <input
                  id="time"
                  name="time"
                  type="time"
                  className="h-14 w-full rounded-2xl bg-[#f8f8fa] px-5 text-sm font-semibold outline-none transition focus:bg-white focus:ring-4 focus:ring-[#FF6B2C]/10"
                />
              </div>

              <div>
                <label
                  htmlFor="taskDate"
                  className="mb-2 block text-[11px] font-black uppercase tracking-[0.22em] text-black/35"
                >
                  Data
                </label>

                <input
                  id="taskDate"
                  name="taskDate"
                  type="date"
                  min={getTodayDate()}
                  defaultValue={getTodayDate()}
                  required
                  className="h-14 w-full rounded-2xl bg-[#f8f8fa] px-5 text-sm font-semibold outline-none transition focus:bg-white focus:ring-4 focus:ring-[#FF6B2C]/10"
                />
              </div>

              <div>
                <label
                  htmlFor="area"
                  className="mb-2 block text-[11px] font-black uppercase tracking-[0.22em] text-black/35"
                >
                  Área
                </label>

                <select
                  id="area"
                  name="area"
                  className="h-14 w-full rounded-2xl bg-[#f8f8fa] px-5 text-sm font-semibold outline-none transition focus:bg-white focus:ring-4 focus:ring-[#FF6B2C]/10"
                >
                  <option value="Casa">Casa</option>
                  <option value="Trabalho">Trabalho</option>
                  <option value="Treino">Treino</option>
                  <option value="Estudo">Estudo</option>
                  <option value="Saúde">Saúde</option>
                  <option value="Outro">Outro</option>
                </select>
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label
                  htmlFor="description"
                  className="mb-2 block text-[11px] font-black uppercase tracking-[0.22em] text-black/35"
                >
                  Descrição
                </label>

                <textarea
                  id="description"
                  name="description"
                  rows={5}
                  placeholder="Descreva o objetivo desta tarefa..."
                  className="w-full rounded-2xl bg-[#f8f8fa] px-5 py-4 text-sm font-semibold outline-none transition focus:bg-white focus:ring-4 focus:ring-[#FF6B2C]/10"
                />
              </div>

              <div>
                <label
                  htmlFor="priority"
                  className="mb-2 block text-[11px] font-black uppercase tracking-[0.22em] text-black/35"
                >
                  Prioridade
                </label>

                <select
                  id="priority"
                  name="priority"
                  className="h-14 w-full rounded-2xl bg-[#f8f8fa] px-5 text-sm font-semibold outline-none transition focus:bg-white focus:ring-4 focus:ring-[#FF6B2C]/10"
                >
                  <option value="Normal">Normal</option>
                  <option value="Alta">Alta</option>
                  <option value="Essencial">Essencial</option>
                </select>
              </div>
            </div>

            <div className="mt-6 grid gap-3 md:grid-cols-2">
              <button
                type="submit"
                className="flex h-14 items-center justify-center rounded-[1.5rem] bg-[#FF6B2C] font-black text-white shadow-[0_18px_45px_rgba(0,113,227,0.22)] transition hover:-translate-y-0.5 "
              >
                Criar tarefa
              </button>

              <Link
                href="/planner"
                className="flex h-14 items-center justify-center rounded-[1.5rem] bg-white font-black text-black/55 shadow-[0_10px_30px_rgba(0,0,0,0.06)] transition hover:text-[#FF6B2C]"
              >
                Cancelar
              </Link>
            </div>
          </form>
        </section>
      </main>

      <MobileBottomMenu active="routine" />
    </div>
  );
}