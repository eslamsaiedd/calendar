import { useMemo, useRef, useEffect } from "react";

type Props = {
  data: Date;
};

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const HOUR_HEIGHT = 64; // same as week view

function DayOverview({ data }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const today = new Date();

  const isToday =
    data.getDate() === today.getDate() &&
    data.getMonth() === today.getMonth() &&
    data.getFullYear() === today.getFullYear();

  // scroll to current time
  useEffect(() => {
    if (!containerRef.current) return;
    const now = new Date();
    const top = (now.getHours() + now.getMinutes() / 60) * HOUR_HEIGHT;
    containerRef.current.scrollTop = top - 200; // offset for better view
  }, []);

  const currentTimeTop = useMemo(() => {
    const now = new Date();
    return (now.getHours() + now.getMinutes() / 60) * HOUR_HEIGHT;
  }, []);

  return (
    <div className="flex-1 flex flex-col border dark:border-[var(--border)] border-[var(--updated-border-light)] bg-white dark:bg-[var(--bg-card)] rounded-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-center border-b border-[var(--updated-border-light)] dark:border-[var(--border)] py-3">
        <div className="text-center">
          <div className="text-xs text-gray-400">
            {data.toLocaleDateString("en-US", { weekday: "long" })}
          </div>
          <div
            className={`text-lg font-semibold
              ${
                isToday
                  ? "text-white bg-[var(--primary)] w-9 h-9 rounded-full flex items-center justify-center mx-auto"
                  : "dark:text-white"
              }
            `}
          >
            {data.getDate()}
          </div>
        </div>
      </div>

      {/* Body */}
      <div ref={containerRef} className="flex-1 overflow-auto relative">
        <div className="grid grid-cols-[60px_1fr] min-h-full">
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

          {/* Day column */}
          <div className="relative">
            {HOURS.map((h) => (
              <div
                key={h}
                className="h-16 border-b border-[var(--updated-border-light)] dark:border-[var(--border)]"
              />
            ))}

            {/* Current time line */}
            {isToday && (
              <div
                className="absolute left-0 right-0 h-[2px] bg-red-500 z-10"
                style={{ top: currentTimeTop }}
              >
                <div className="absolute -left-1 -top-1 w-3 h-3 bg-red-500 rounded-full" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DayOverview;
