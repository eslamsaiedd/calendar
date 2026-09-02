import { useMemo, useState } from "react";
import axios from "axios";
import { useCalendar, type CalendarEvent as CalendarEventModel } from "../../context/CalendarContext";
import EventDetailsPopup from "../sidebar/EventDetailsModal";
import { useToast } from "../../context/ToastContext";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

type Props = {
  data: Date;
};

const COLOR_MAP = {
  purple: "#7c3aed",
  blue: "#3b82f6",
  teal: "#14b8a6",
  pink: "#ec4899",
  amber: "#f59e0b",
  green: "#22c55e",
} as const;


export function MonthOverview({ data }: Props) {

  type EventDate = {
    day: number;
    event: CalendarEventModel;
    source: "holiday" | "user";
    isTranslated: boolean;
    englishTitle?: string;
    arabicTitle?: string;
    title?: string;
    colorLabel?: string;
  };

  const { showToast } = useToast();

  const [selectedEvent, setSelectedEvent] = useState<CalendarEventModel | null>(null);
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

  const { holidayEvents, userEvents, refreshEvents } = useCalendar();

  [...holidayEvents, ...userEvents].forEach((event) => {
    const [y, m, d] = event.date.split("-").map(Number);

    if (y === year && m === month + 1) {
      if (event.source === "holiday" && event.isTranslated === true) {
        eventsDate.push({
          day: d,
          event,
          source: "holiday",
          isTranslated: true,
          englishTitle: event.englishTitle ?? "",
          arabicTitle: event.arabicTitle ?? "",
        });
      } else if (event.source === "user") {
        eventsDate.push({
          day: d,
          event,
          source: "user",
          isTranslated: false,
          title: event.title ?? "Event",
          colorLabel: event.colorLabel || event.color || "blue",
        });
      }
    }
  });
  

  const getDateTime = (value?: string, fallbackDate = "") => {
    if (!value) {
      return new Date(fallbackDate || `${year}-${String(month + 1).padStart(2, "0")}-01T00:00:00`).toISOString();
    }

    const match = value.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);

    if (!match) {
      return new Date(`${fallbackDate || `${year}-${String(month + 1).padStart(2, "0")}-01`}T00:00:00`).toISOString();
    }

    const [, rawHours, rawMinutes, meridiem] = match;
    let hours = Number(rawHours);
    const minutes = Number(rawMinutes);

    if (meridiem?.toUpperCase() === "PM" && hours < 12) {
      hours += 12;
    }

    if (meridiem?.toUpperCase() === "AM" && hours === 12) {
      hours = 0;
    }

    const base = new Date(`${fallbackDate || `${year}-${String(month + 1).padStart(2, "0")}-01`}T00:00:00`);
    base.setHours(hours, minutes, 0, 0);

    return base.toISOString();
  };

  const openDetails = (event: CalendarEventModel) => setSelectedEvent(event);

  //! handle save events

  const handleSaveEvent = async (values: { title: string; description: string; date: string; startTime: string; endTime: string }) => {
    if (!selectedEvent || selectedEvent.source !== "user") return;

    const token = localStorage.getItem("token");

    if (!token) {
      return;
    }

    const startDate = new Date(`${values.date}T${values.startTime || "00:00"}:00`);
    const endDate = new Date(`${values.date}T${values.endTime || "23:59"}:00`);

    await axios.patch(
      `https://character-moist-kangaroo.abasthan.app/api/events/${selectedEvent.id}`,
      {
        title: values.title,
        description: values.description,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        startTime: values.startTime,
        endTime: values.endTime,
        allDay: false,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    await refreshEvents(data.getFullYear(), data.getMonth() + 1);
    showToast("eventUpdated");
    setSelectedEvent(null);
  };

  const handleDeleteEvent = async () => {
    if (!selectedEvent || selectedEvent.source !== "user") return;

    const token = localStorage.getItem("token");

    if (!token) {
      return;
    }

    await axios.delete(`https://character-moist-kangaroo.abasthan.app/api/events/${selectedEvent.id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    await refreshEvents(data.getFullYear(), data.getMonth() + 1);
    showToast("eventDeleted");
    setSelectedEvent(null);
  };

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
                      <button
                        key={index}
                        type="button"
                        onClick={() => openDetails(event.event)}
                        className="flex w-full cursor-pointer flex-col items-center gap-0.5 text-left"
                      >
                        {event.source === "holiday" ? (
                          <>
                            <div className="w-full rounded bg-[var(--event-blue)] px-1 py-0.5 text-xs font-medium text-white">
                              {event.englishTitle}
                            </div>
                            <div className="w-full rounded bg-[var(--event-blue)] px-1 py-0.5 text-xs font-medium text-white">
                              {event.arabicTitle}
                            </div>
                          </>
                        ) : (
                          <div
                            className="w-full rounded px-1 pb-1 py-0.5 text-xs font-medium text-white"
                            style={{
                              backgroundColor: COLOR_MAP[event.colorLabel as keyof typeof COLOR_MAP] || COLOR_MAP.blue,
                            }}
                          >
                            {event.title}
                          </div>
                        )}
                      </button>
                    );
                  }
                  return null;
                })}
              </div>
            ))}
          </div>
        ))}
      </div>
      {selectedEvent && (
        <EventDetailsPopup
          open={Boolean(selectedEvent)}
          onOpenChange={(open) => {
            if (!open) setSelectedEvent(null);
          }}
          event={selectedEvent}
          startDateTime={selectedEvent ? getDateTime(selectedEvent.startTime, selectedEvent.date) : new Date().toISOString()}
          endDateTime={selectedEvent?.endTime ? getDateTime(selectedEvent.endTime, selectedEvent.date) : undefined}
          isEditable={selectedEvent?.source === "user"}
          onDelete={selectedEvent?.source === "user" ? handleDeleteEvent : undefined}
          onSave={selectedEvent?.source === "user" ? handleSaveEvent : undefined}
        />
      )}
    </div>
  );
}

export default MonthOverview;
