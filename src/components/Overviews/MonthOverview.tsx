import { useMemo } from "react";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

type Props = {
  data: Date;
};

export function MonthOverview({ data }: Props) {
  const today = new Date();
  const month = data.getMonth();
  const year = data.getFullYear();

  const { rows } = useMemo(() => {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const lastDayPrevMonth = new Date(year, month, 0).getDate();

    const totalDays: { day: number; isCurrentMonth: boolean }[] = [];

    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
      totalDays.push({
        day: lastDayPrevMonth - i,
        isCurrentMonth: false,
      });
    }

    for (let i = 1; i <= daysInMonth; i++) {
      totalDays.push({ day: i, isCurrentMonth: true });
    }

    while (totalDays.length % 7 !== 0) {
      totalDays.push({
        day: totalDays.length - daysInMonth - firstDayOfMonth + 1,
        isCurrentMonth: false,
      });
    }

    const rows: (typeof totalDays)[] = [];
    for (let i = 0; i < totalDays.length; i += 7) {
      rows.push(totalDays.slice(i, i + 7));
    }

    return { rows };
  }, [month, year]);

  const isToday = (d: { day: number; isCurrentMonth: boolean }) =>
    d.isCurrentMonth &&
    d.day === today.getDate() &&
    month === today.getMonth() &&
    year === today.getFullYear();

  return (
    <div className="flex-1 min-h-0 border dark:bg-[var(--bg-card)] bg-white dark:border-[var(--border)] border-[var(--updated-border-light)] rounded-lg overflow-hidden flex flex-col">
      {/* Day headers */}
      <div className="grid grid-cols-7 shrink-0 border-b border-[var(--updated-border-light)] dark:border-[var(--border)]">
        {DAYS.map((day) => (
          <div
            key={day}
            className="text-center dark:text-[var(--text-secondary-dark)] font-semibold py-2 text-sm"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Rows */}
      <div className="flex-1 min-h-0 flex flex-col">
        {rows.map((row, ri) => (
          <div
            key={ri}
            className={`flex-1 grid grid-cols-7 ${
              ri < rows.length - 1
                ? "border-b border-[var(--updated-border-light)] dark:border-[var(--border)]"
                : ""
            }`}
          >
            {row.map((cell, ci) => (
              <div
                key={ci}
                className={`p-2 border-r relative border-[var(--updated-border-light)] dark:border-[var(--border)] last:border-r-0
                  ${cell.isCurrentMonth ? "dark:text-white" : "text-gray-400"}
                  hover:bg-[var(--bg-primary-light)] dark:hover:bg-gray-700`}
              >
                <div
                  className={`${
                    isToday(cell)
                      ? "bg-[var(--primary)] text-center w-7 h-7 rounded-full absolute text-white"
                      : ""
                  }`}
                >
                  {cell.day}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default MonthOverview;
