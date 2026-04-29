import { useMemo } from "react";

type Props = {
  data: Date;
};

const HOURS = Array.from({ length: 24 }, (_, i) => i);

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

  return (
    <div className="flex-1 flex flex-col border dark:border-[var(--border)] border-[var(--updated-border-light)] bg-white dark:bg-[var(--bg-card)] rounded-lg overflow-hidden">
      {/* Header (days) */}
      <div className="grid grid-cols-8 border-b border-[var(--updated-border-light)] dark:border-[var(--border)]">
        {/* empty corner */}
        <div />

        {days.map((d, i) => (
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
        ))}
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
          {days.map(( di) => (
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
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default WeekOverview;
