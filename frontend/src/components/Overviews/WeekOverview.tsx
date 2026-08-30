import { useMemo } from "react";
import { useCalendar } from "../../context/CalendarContext";

type Props = {
  data: Date;
};

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const HOUR_HEIGHT = 64;

const COLOR_MAP = {
  purple: "#7c3aed",
  blue: "#3b82f6",
  teal: "#14b8a6",
  pink: "#ec4899",
  amber: "#f59e0b",
  green: "#22c55e",
} as const;

function WeekOverview({ data }: Props) {
  const today = new Date();

  const startOfWeek = useMemo(() => {
    const d = new Date(data);
    const day = d.getDay();
    d.setDate(d.getDate() - day); // start from Sunday
    d.setHours(0, 0, 0, 0);
    return d;
  }, [data]);

  const days = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(startOfWeek);
      d.setDate(startOfWeek.getDate() + i);
      return d;
    });
  }, [startOfWeek]);

  const isToday = (d: Date) =>
    d.getDate() === today.getDate() &&
    d.getMonth() === today.getMonth() &&
    d.getFullYear() === today.getFullYear();

  const { holidayEvents, userEvents } = useCalendar();

  const allEvents = [...holidayEvents, ...userEvents];

  const isSameCalendarDay = (eventDate: string, targetDate: Date) => {
    const [year, month, day] = eventDate.split("-").map(Number);
    return (
      year === targetDate.getFullYear() &&
      month === targetDate.getMonth() + 1 &&
      day === targetDate.getDate()
    );
  };

  return (
    <div className="flex-1 flex flex-col border dark:border-[var(--border)] border-[var(--updated-border-light)] bg-white dark:bg-[var(--bg-card)] rounded-lg overflow-hidden">
      {/* Header (days) */}
      <div className="grid grid-cols-8 border-b border-[var(--updated-border-light)] dark:border-[var(--border)]">
        {/* empty corner */}
        <div />

        {days.map((d, i) => {
          allEvents.filter((ev) =>
            isSameCalendarDay(ev.date, d),
          );

          return (
            <div key={i} className="text-center py-2">
              <div className="text-xs text-gray-400">
                {d.toLocaleDateString("en-US", { weekday: "short" })}
              </div>
              <div
                className={`text-sm font-medium
                  ${isToday(d) ? "text-white bg-[var(--primary)] w-7 h-7 rounded-full mx-auto flex items-center justify-center" : "dark:text-white"}
                `}
              >
                {d.getDate()}
              </div>
            </div>
          );
        })}
      </div>

      {/* Body */}
      <div className="flex-1 overflow-auto">
        <div className="grid grid-cols-8 min-h-full">
          {/* Time column */}
          <div className="border-r border-[var(--updated-border-light)] dark:border-[var(--border)]">
            {HOURS.map((h) => (
              <div
                key={h}
                className="h-16 text-[10px] text-gray-400 pr-2 text-right"
              >
                {h === 0 ? "" : `${h}:00`}
              </div>
            ))}
          </div>

          {/* Days columns */}
          {days.map((di) => {
            const eventsForDay = allEvents.filter((ev) =>
              isSameCalendarDay(ev.date, di),
            );

            const parseTimeToHours = (time?: string) => {
              if (!time) return 0;
              const match = time.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
              if (!match) return 0;
              let h = Number(match[1]);
              const m = Number(match[2]);
              const mer = match[3];
              if (mer && mer.toUpperCase() === "PM" && h < 12) h += 12;
              if (mer && mer.toUpperCase() === "AM" && h === 12) h = 0;
              return h + m / 60;
            };

            return (
              <div
                key={di.toISOString()}
                className="border-r last:border-r-0 border-[var(--updated-border-light)] dark:border-[var(--border)] relative"
              >
                {HOURS.map((h) => (
                  <div
                    key={h}
                    className="h-16 border-b border-[var(--updated-border-light)] dark:border-[var(--border)]"
                  />
                ))}

                {/* Positioned events */}
                {eventsForDay.map((ev) => {
                  const start = parseTimeToHours(ev.startTime);
                  const end = ev.endTime
                    ? parseTimeToHours(ev.endTime)
                    : start + 1;
                  const top = start * HOUR_HEIGHT;
                  const height = Math.max(22, (end - start) * HOUR_HEIGHT);
                  const bg =
                    ev.source === "holiday"
                      ? COLOR_MAP.blue
                      : ev.colorLabel
                        ? ((COLOR_MAP as any)[ev.colorLabel] ??
                          COLOR_MAP.purple)
                        : COLOR_MAP.purple;

                  return (
                    <div
                      key={ev.id}
                      className="absolute left-2 right-2 rounded-md text-white px-2 py-1 text-sm overflow-hidden"
                      style={{ top, height, background: bg }}
                    >
                      {ev.source === "holiday"
                        ? (ev.englishTitle ?? ev.arabicTitle)
                        : ev.title}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default WeekOverview;
