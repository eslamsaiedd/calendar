import { useCalendar, type CalendarEvent } from "../../context/CalendarContext";

const COLOR_MAP = {
  purple: "#7c3aed",
  blue: "#3b82f6",
  teal: "#14b8a6",
  pink: "#ec4899",
  amber: "#f59e0b",
  green: "#22c55e",
} as const;

const getEventDateTime = (event: CalendarEvent) => {  
  const baseDate = new Date(event.date);
  
  
  if (!event.startTime) {
    return baseDate;
  }

  const match = event.startTime.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);

  if (!match) {
    return baseDate;
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

  const dateTime = new Date(baseDate);
  dateTime.setHours(hours, minutes, 0, 0);
  return dateTime;
};

export function UpcomingEvents() {
  const { userEvents } = useCalendar();
  const now = new Date();

  const futureEvents = userEvents 
    .filter((event: CalendarEvent) => getEventDateTime(event) >= now)
    .sort((a, b) => getEventDateTime(a).getTime() - getEventDateTime(b).getTime());

  return (
    <>
      <div className="flex flex-col gap-1 dark:text-white border-t border-[var(--updated-border-light)] dark:border-[var(--border)] mt-2 pt-1">
        <h3 className="font-bold">Upcoming Events</h3>
        
        {futureEvents.length > 0 ? (
          
          <ul>
            {futureEvents.map((event: CalendarEvent) => (
              <li key={event.id} className="flex items-center justify-between flex-row gap-2 ">
                <div className="flex items-center">
                  <div
                    className={`w-2.5 h-2.5 rounded-full mr-1`}
                    style={{
                      backgroundColor: COLOR_MAP[event.colorLabel as keyof typeof COLOR_MAP] || COLOR_MAP.blue,
                    }}
                    aria-hidden="true"
                  ></div>
                  {event.title?.split(" ").slice(0, 2).join(" ")} 
                  <div className="text-[var(--text-secondary-light)] text-[12px] dark:text-[var(--text-secondary-dark)]">
                  - {event.startTime} 
                  </div>
                </div>

                <div className="text-[var(--text-secondary-light)] text-[12px] dark:text-[var(--text-secondary-dark)]">
                  {new Date(event.date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </div>
              </li>
            ))}
          </ul>

        ): (
            <p className="text-[var(--text-secondary-light)] dark:text-[var(--text-secondary-dark)]">
              No upcoming events.
            </p>
        )}

      </div>
    </>
  );
}
