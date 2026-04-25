import { useState } from "react";
import { ChevronLeft, ChevronRight } from 'lucide-react';

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function Home() {
  const [data, setData] = useState(new Date());
  const today = new Date();

  const month = data.getMonth();
  const year = data.getFullYear();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const lastDayPrevMonth = new Date(year, month, 0).getDate();

  const totalDays: { day: number; isCurrentMonth: boolean }[] = [];

  for (let i = firstDayOfMonth - 1; i >= 0; i--)
    totalDays.push({ day: lastDayPrevMonth - i, isCurrentMonth: false });
  for (let i = 1; i <= daysInMonth; i++)
    totalDays.push({ day: i, isCurrentMonth: true });
  while (totalDays.length % 7 !== 0)
    totalDays.push({ day: totalDays.length - daysInMonth - firstDayOfMonth + 1, isCurrentMonth: false });

  const rows: typeof totalDays[] = [];
  for (let i = 0; i < totalDays.length; i += 7)
    rows.push(totalDays.slice(i, i + 7));

  const isToday = (d: { day: number; isCurrentMonth: boolean }) =>
    d.isCurrentMonth &&
    d.day === today.getDate() &&
    month === today.getMonth() &&
    year === today.getFullYear();

  return (
    // h-full يملأ الـ main اللي عنده overflow-y-auto
    <div className="flex flex-col h-full px-6 py-3 dark:bg-[var(--bg-primary)]">

      {/* Top bar */}
      <div className="flex justify-between items-center mb-1.5 shrink-0">
        <div className="flex gap-1.5">
          {["Year", "Month", "Day"].map(v => (
            <button key={v} className="px-4 py-1 cursor-pointer text-[var(--text-primary-light)] dark:text-[var(--text-primary-dark)] rounded-lg bg-[linear-gradient(90deg,#7C3AED,#A855F7)] transition">
              {v}
            </button>
          ))}
        </div>
        <div className="flex gap-2 items-center">
          <button onClick={() => setData(new Date(year, month - 1, 1))}
            className="p-2.5 cursor-pointer dark:bg-[var(--bg-card)] rounded-lg dark:text-white transition">
            <ChevronLeft size={12} />
          </button>
          <div className="font-bold text-2xl dark:text-white">{MONTHS[month]} {year}</div>
          <button onClick={() => setData(new Date(year, month + 1, 1))}
            className="p-2.5 cursor-pointer dark:bg-[var(--bg-card)] rounded-lg dark:text-white transition">
            <ChevronRight size={12} />
          </button>
        </div>
        <button onClick={() => setData(new Date())}
          className="px-4 py-1 cursor-pointer text-[var(--text-primary-light)] dark:text-[var(--text-primary-dark)] rounded-lg bg-[linear-gradient(90deg,#7C3AED,#A855F7)] transition">
          Today
        </button>
      </div>

      {/* Calendar — يملأ الباقي بدون scroll */}
      <div className="flex-1 min-h-0 border dark:border-[var(--border)] dark:bg-[var(--bg-card)] rounded-lg overflow-hidden flex flex-col">

        {/* Day headers */}
        <div className="grid grid-cols-7 shrink-0 border-b dark:border-[var(--border)]">
          {DAYS.map(day => (
            <div key={day} className="text-center dark:text-[var(--text-secondary-dark)] font-semibold py-2 text-sm">
              {day}
            </div>
          ))}
        </div>

        {/* Rows */}
        <div className="flex-1 min-h-0 flex flex-col">
          {rows.map((row, ri) => (
            <div key={ri} className={`flex-1 grid grid-cols-7 ${ri < rows.length - 1 ? "border-b dark:border-[var(--border)]" : ""}`}>
              {row.map((cell, ci) => (
                <div key={ci}
                  className={`p-2 border-r dark:border-[var(--border)] last:border-r-0
                    ${cell.isCurrentMonth ? "dark:text-white" : "text-gray-400"}
                    ${isToday(cell) ? "bg-blue-500 text-white hover:bg-blue-600" : "hover:bg-gray-100 dark:hover:bg-[var(--bg-hover)]"}`}>
                  {cell.day}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;