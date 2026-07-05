import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { MonthOverview } from "../components/Overviews/MonthOverview";
import YearOverview from "../components/Overviews/YearOverview";
import WeekOverview from "../components/Overviews/WeekOverview";
import DayOverview from "../components/Overviews/DayOverview";
import { useModal } from "../context/ModalContext";
import FormModal from "../components/FormModal";
import axios from "axios";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

type View = "year" | "month" | "week" | "day";

function Home() {
  const { isOpen } = useModal();

  const [data, setData] = useState(new Date());
  const [active, setActive] = useState<View>("month");

  // const today = new Date();
  const month = data.getMonth();
  const year = data.getFullYear();
  const day = data.getDate();

  const options: { label: string; value: View }[] = [
    { label: "Year", value: "year" },
    { label: "Month", value: "month" },
    { label: "Week", value: "week" },
    { label: "Day", value: "day" },
  ];


  return (
    // h-full يملأ الـ main اللي عنده overflow-y-auto
    <div className="flex flex-col h-full px-6 py-3 bg-[var(--border-light)] dark:bg-[var(--bg-primary)]">
      {/* Top bar */}
      <div className="flex justify-between items-center mb-1.5 shrink-0">
        {/* segmented control */}
        <div className="inline-flex bg-white dark:bg-[var(--bg-card)]
      rounded-[10px] p-1 gap-0.5 overflow-x-auto max-w-full">
          {options.map(({ label, value }) => (
            <button
              key={value}
              onClick={() => setActive(value)}
              className={`
                px-5 py-1.5 text-[13px] font-medium rounded-[7px] cursor-pointer border-none transition-all duration-150
                ${
                  active === value
                    ? "bg-[linear-gradient(90deg,#7C3AED,#A855F7)] text-white"
                    : "bg-transparent text-[var(--text-secondary-dark)] hover:text-[var(--text-primary-dark)]"
                }
              `}
            >
              {label}
            </button>
          ))}
        </div>

        {/* move through the years */}
        {active === "year" && (
          <div className="flex gap-2 items-center">
            <button
              onClick={() => setData(new Date(year - 1, month, 1))}
              className="p-2.5 cursor-pointer hover:bg-[var(--bg-primary-light)] dark:hover:bg-gray-700 dark:bg-[var(--bg-card)] bg-white rounded-lg dark:text-white transition"
            >
              <ChevronLeft size={12} />
            </button>
            <div className="font-bold text-2xl dark:text-white">{year}</div>
            <button
              onClick={() => setData(new Date(year + 1, month, 1))}
              className="p-2.5 cursor-pointer hover:bg-[var(--bg-primary-light)] dark:hover:bg-gray-700 dark:bg-[var(--bg-card)] bg-white rounded-lg dark:text-white transition"
            >
              <ChevronRight size={12} />
            </button>
          </div>
        )}

        {/* move through the months */}
        {active === "month" && (
          <div className="flex gap-2 items-center">
            <button
              onClick={() => setData(new Date(year, month - 1, 1))}
              className="p-2.5 cursor-pointer hover:bg-[var(--bg-primary-light)] dark:hover:bg-gray-700 dark:bg-[var(--bg-card)] bg-white rounded-lg dark:text-white transition"
            >
              <ChevronLeft size={12} />
            </button>
            <div className="font-bold text-2xl dark:text-white">
              {MONTHS[month]} {year}
            </div>
            <button
              onClick={() => setData(new Date(year, month + 1, 1))}
              className="p-2.5 cursor-pointer hover:bg-[var(--bg-primary-light)] dark:hover:bg-gray-700 dark:bg-[var(--bg-card)] bg-white rounded-lg dark:text-white transition"
            >
              <ChevronRight size={12} />
            </button>
          </div>
        )}

        {/* move through the weeks */}
        {active === "week" && (
          <div className="flex gap-2 items-center">
            <button
              onClick={() => setData(new Date(year, month, day - 7))}
              className="p-2.5 cursor-pointer hover:bg-[var(--bg-primary-light)] dark:hover:bg-gray-700 dark:bg-[var(--bg-card)] bg-white rounded-lg dark:text-white transition"
            >
              <ChevronLeft size={12} />
            </button>
            <div className="font-bold text-2xl dark:text-white">
              Week of {new Date(year, month, day).toLocaleDateString()}
            </div>
            <button
              onClick={() => setData(new Date(year, month, day + 7))}
              className="p-2.5 cursor-pointer hover:bg-[var(--bg-primary-light)] dark:hover:bg-gray-700 dark:bg-[var(--bg-card)] bg-white rounded-lg dark:text-white transition"
            >
              <ChevronRight size={12} />
            </button>
          </div>
        )}

        {/* move through the days */}
        {active === "day" && (
          <div className="flex gap-2 items-center">
            <button
              onClick={() => setData(new Date(year, month, day - 1))}
              className="p-2.5 cursor-pointer hover:bg-[var(--bg-primary-light)] dark:hover:bg-gray-700 dark:bg-[var(--bg-card)] bg-white rounded-lg dark:text-white transition"
            >
              <ChevronLeft size={12} />
            </button>
            <div className="font-bold text-2xl dark:text-white">
              {MONTHS[month]} {day}, {year}
            </div>
            <button
              onClick={() => setData(new Date(year, month, day + 1))}
              className="p-2.5 cursor-pointer hover:bg-[var(--bg-primary-light)] dark:hover:bg-gray-700 dark:bg-[var(--bg-card)] bg-white rounded-lg dark:text-white transition"
            >
              <ChevronRight size={12} />
            </button>
          </div>
        )}

        <button
          onClick={() => setData(new Date())}
          className="px-4 py-1 cursor-pointer hover:bg-[var(--bg-primary-light)] dark:hover:bg-gray-700 dark:text-[var(--text-primary-dark)] dark:bg-[var(--bg-card)] bg-white text-[var(--text-primary-light)] rounded-lg border border-[var(--updated-border-light)] dark:border-[var(--border)] transition"
        >
          Today
        </button>
      </div>
      {isOpen && <FormModal onSubmit={(data) => console.log(data)} />}

      {active === "year" && <YearOverview data={data} />}
      {active === "month" && <MonthOverview data={data} />}
      {active === "week" && <WeekOverview data={data} />}
      {active === "day" && <DayOverview data={data} />}
    </div>
  );
}

export default Home;
