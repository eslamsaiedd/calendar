import { useEffect, useMemo } from "react";
import { useCalendar } from "../../context/CalendarContext";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

type Props = {
  data: Date;
};

export type CalendarEvent = {
  id: string;
  title: string;
  englishTitle: string;
  arabicTitle: string;
  isTranslated: boolean;
  date: string; // "YYYY-MM-DD"
  type: "event" | "task" | "holiday";
};

type AladhanDay = {
  date: {
    gregorian: {
      date: string; // "DD-MM-YYYY"
    };
    hijri: {
      holidays: string[];
    };
  };
};


export function MonthOverview({ data }: Props) {
  type EventDate =
    | {
        day: number;
        isTranslated: true;
        englishTitle: string;
        arabicTitle: string;
      }
    | {
        day: number;
        isTranslated: false;
        title: string;
      };

  const eventsDate: EventDate[] = [];

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

  const { events, refreshEvents } = useCalendar();

  useEffect(() => {
    refreshEvents(year, month + 1);
  }, [year, month]);

  events.forEach((event) => {
    const [y, m, d] = event.date.split("-").map(Number);

    if (y === year && m === month + 1) {
      if (event.isTranslated === true) {
        eventsDate.push({
          day: d,
          isTranslated: true,
          englishTitle: event.englishTitle ?? "",
          arabicTitle: event.arabicTitle ?? "",
        });
      } else {
        eventsDate.push({
          day: d,
          isTranslated: false,
          title: event.title ?? "Event",
        });
      }
    }
  });

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
                {/* Event indicators */}
                {eventsDate.map((event, index) => {
                  if (event.day === cell.day && cell.isCurrentMonth) {
                    return (
                      <div
                        key={index}
                        className="flex gap-0.5 flex-col items-center w-full"
                      >
                        {event.isTranslated ? (
                          <>
                            <div className="py-0.5 bg-[var(--event-blue)] w-full rounded text-xs px-1 font-medium text-white">
                              {event.englishTitle}
                            </div>
                            <div className="py-0.5 bg-[var(--event-blue)] w-full rounded text-xs px-1 font-medium text-white">
                              {event.arabicTitle}
                            </div>
                          </>
                        ) : (
                          <div className="py-0.5 bg-[var(--event-blue)] w-full rounded text-xs px-1 font-medium text-white">
                            {event.title}
                          </div>
                        )}
                      </div>
                    );
                  }
                  return null;
                })}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default MonthOverview;
