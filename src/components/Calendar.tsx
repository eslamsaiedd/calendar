import { useState } from "react";
import { ChevronLeft, ChevronRight } from 'lucide-react';

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
type View = "year" | "month" | "week" | "day";

function Home() {

  const [data, setData] = useState(new Date());
  const [active, setActive] = useState<View>("month");

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



  const options: { label: string; value: View }[] = [
    { label: "Year",  value: "year"  },
    { label: "Month", value: "month" },
    { label: "Week",  value: "week"  },
    { label: "Day",   value: "day"   },
  ];  

  return (
    // h-full يملأ الـ main اللي عنده overflow-y-auto
    <div className="flex flex-col h-full px-6 py-3 bg-[var(--border-light)] dark:bg-[var(--bg-primary)]">

      {/* Top bar */}
      <div className="flex justify-between items-center mb-1.5 shrink-0">
        
        {/* segmented control */}
        <div className="inline-flex bg-white dark:bg-[var(--bg-card)] rounded-[10px] p-1 gap-0.5">
          {options.map(({ label, value }) => (
            <button
              key={value}
              onClick={() => setActive(value)}
              className={`
                px-5 py-1.5 text-[13px] font-medium rounded-[7px] cursor-pointer border-none transition-all duration-150
                ${active === value
                  ? "bg-[linear-gradient(90deg,#7C3AED,#A855F7)] text-white"
                  : "bg-transparent text-[var(--text-secondary-dark)] hover:text-[var(--text-primary-dark)]"
                }
              `}
            >
              {label}
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
          className="px-4 py-1 cursor-pointer dark:text-[var(--text-primary-dark)] dark:bg-[var(--bg-card)] bg-white text-[var(--text-primary-light)] rounded-lg border border-[var(--border-light)] dark:border-[var(--border)] transition">
          Today
        </button>
      </div>

      {/* Calendar — يملأ الباقي بدون scroll */}
      <div className="flex-1 min-h-0 border dark:border-[var(--border)] dark:bg-[var(--bg-card)] bg-white border-[var(--border-light)] rounded-lg overflow-hidden flex flex-col">

        {/* Day headers */}
        <div className="grid grid-cols-7 shrink-0 border-b border-[var(--border-light)] dark:border-[var(--border)]">
          {DAYS.map(day => (
            <div key={day} className="text-center dark:text-[var(--text-secondary-dark)] font-semibold py-2 text-sm">
              {day}
            </div>
          ))}
        </div>

        {/* Rows */}
        <div className="flex-1 min-h-0 flex flex-col">
          {rows.map((row, ri) => (
            <div key={ri} className={`flex-1 grid grid-cols-7 ${ri < rows.length - 1 ? "border-b border-[var(--border-light)] dark:border-[var(--border)]" : ""}`}>
              {row.map((cell, ci) => (
                <div key={ci}
                  className={`p-2 border-r relative border-[var(--border-light)] dark:border-[var(--border)] last:border-r-0
                    ${cell.isCurrentMonth ? "dark:text-white" : "text-gray-400"}
                    ${isToday(cell) ? "hover:bg-[var(--bg-primary-light)] dark:hover:bg-gray-700 text-white" : "hover:bg-[var(--bg-primary-light)] dark:hover:bg-gray-700"}`}>
                      <div className={`${isToday(cell) ? "bg-[var(--primary)] text-center w-7 h-7 rounded-full absolute text-white" : ""}`}>

                      {cell.day}
                      </div>
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