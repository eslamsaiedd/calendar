import { useMemo } from "react";

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];

const DAYS = ["S", "M", "T", "W", "T", "F", "S"];

type Props = {
  data: Date;
};

function YearOverview({ data }: Props) {
  const year = data.getFullYear();
  const today = new Date();

  const generateMonth = (month: number) => {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    const prevMonthDays = new Date(year, month, 0).getDate();

    const cells: {
      day: number;
      isCurrentMonth: boolean;
    }[] = [];

    // prev month
    for (let i = firstDay - 1; i >= 0; i--) {
      cells.push({
        day: prevMonthDays - i,
        isCurrentMonth: false,
      });
    }

    // current month
    for (let d = 1; d <= daysInMonth; d++) {
      cells.push({ day: d, isCurrentMonth: true });
    }

    // next month (fill to 42 cells)
    while (cells.length < 42) {
      cells.push({
        day: cells.length - daysInMonth - firstDay + 1,
        isCurrentMonth: false,
      });
    }

    return cells;
  };

  const monthsData = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => generateMonth(i));
  }, [year]);

  const isToday = (month: number, day: number, isCurrentMonth: boolean) =>
    isCurrentMonth &&
    month === today.getMonth() &&
    day === today.getDate() &&
    year === today.getFullYear();

  return (
    <div className="flex-1 overflow-auto p-4 rounded dark:bg-[var(--bg-card)] bg-white">
      <div className="grid grid-cols-4 gap-6">

        {monthsData.map((cells, monthIndex) => (
          <div key={monthIndex} className="space-y-2">

            {/* Month name */}
            <div className="text-lg font-semibold text-center dark:text-white">
              {MONTHS[monthIndex]}
            </div>

            {/* Week headers */}
            <div className="grid grid-cols-7 text-[10px] text-center dark:text-[var(--text-secondary-dark)]">
              {DAYS.map((d) => (
                <div key={d}>{d}</div>
              ))}
            </div>

            {/* Days grid */}
            <div className="grid grid-cols-7 text-[10px] gap-y-1">
              {cells.map((cell, i) => (
                <div
                  key={i}
                  className={`text-center
                    ${cell.isCurrentMonth ? "dark:text-white" : "text-gray-400"}
                  `}
                >
                  <span
                    className={`inline-flex items-center justify-center w-5 h-5 rounded-full
                      ${
                        isToday(monthIndex, cell.day, cell.isCurrentMonth)
                          ? "bg-[var(--primary)] text-white"
                          : ""
                      }
                    `}
                  >
                    {cell.day}
                  </span>
                </div>
              ))}
            </div>

          </div>
        ))}

      </div>
    </div>
  );
}

export default YearOverview;