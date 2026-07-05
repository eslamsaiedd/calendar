import axios from "axios";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
  useRef,
} from "react";

export type CalendarEvent = {
  id: string;
  title?: string;
  englishTitle?: string;
  arabicTitle?: string;
  isTranslated?: boolean;
  date: string;
  type: "event" | "task" | "holiday";
};

type CalendarContextType = {
  events: CalendarEvent[];
  loading: boolean;
  refreshEvents: (year: number, month: number) => Promise<void>;
};

const CalendarContext = createContext<CalendarContextType | null>(null);

const EVENT_MAP: Record<string, string> = {
  fitr: "عيد الفطر",
  "eid-ul-adha": "عيد الأضحى",
  ramadan: "بداية رمضان",
  ashura: "يوم عاشوراء",
  muharram: "رأس السنة الهجرية",
  "new year": "رأس السنة الهجرية",
  mawlid: "المولد النبوي الشريف",
  isra: "الإسراء والمعراج",
  miraj: "الإسراء والمعراج",
};

const getEventData = (holiday: string) => {
  const h = holiday.toLowerCase();

  for (const key in EVENT_MAP) {
    if (h.includes(key)) {
      return {
        english: holiday,
        arabic: EVENT_MAP[key],
      };
    }
  }

  return null;
};

const transformIslamicEvents = (data: any[]): CalendarEvent[] => {
  return data.flatMap((day) => {
    const holidays = day.date.hijri.holidays;

    if (!holidays.length) return [];

    const events = holidays.map(getEventData).filter(Boolean);

    if (!events.length) return [];

    const [d, m, y] = day.date.gregorian.date.split("-");

    return events.map((event: any, index: number) => ({
      id: `islamic-${y}-${m}-${d}-${index}`,
      englishTitle: event.english,
      arabicTitle: event.arabic,
      date: `${y}-${m}-${d}`,
      type: "holiday",
      isTranslated: true,
    }));
  });
};

const transformPublicEvents = (data: any[]): CalendarEvent[] => {
  return data.map((event) => ({
    id: `public-${event.date}`,
    englishTitle: event.name,
    arabicTitle: event.localName,
    isTranslated: true,
    date: event.date,
    type: "holiday",
  }));
};

async function fetchHolidayEvents(
  year: number,
  month: number,
): Promise<CalendarEvent[]> {
  const [islamicRes, publicRes] = await Promise.all([
    fetch(
      `https://api.aladhan.com/v1/calendar/${year}/${month}?latitude=30&longitude=31`,
    ),
    fetch(`https://date.nager.at/api/v3/PublicHolidays/${year}/EG`),
  ]);

  const islamicData = await islamicRes.json();
  const publicData = await publicRes.json();

  const modifiedData = islamicData.data.map((items) => ({
    ...items,
    isTranslated: true,
  }));

  const modifiedDataPublic = publicData.map((item) => ({
    ...item,
    isTranslated: true,
  }));

  return [
    ...transformIslamicEvents(modifiedData),
    ...transformPublicEvents(modifiedDataPublic),
  ];
}

async function fetchUserEvents() {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("No token found in localStorage.");
      return [];
    }

    const response = await axios.get("http://localhost:5000/api/events", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const modifiedData = response.data.data.events.map((item) => ({
      ...item,
      isTranslated: false, // Add a new property
    }));

    return modifiedData.map((event: any) => ({
      id: event._id,
      isTranslated: event.isTranslated,
      title: event.title,
      date: new Date(event.startDate).toISOString().split("T")[0],
      type: event.type || "event",
    }));
  } catch (error) {
    console.error("Error fetching user events:", error);
    return [];
  }
}

export function CalendarProvider({ children }: { children: ReactNode }) {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [userEvents, setUserEvents] = useState<CalendarEvent[]>([]);
  const holidaysCache = useRef(new Map<string, CalendarEvent[]>());

  
  
    useEffect(() => {
        const loadUserEvents = async () => {
            const events = await fetchUserEvents();
            setUserEvents(events);
        };

        loadUserEvents();
    }, []);
  

    const refreshEvents = useCallback(async (year: number, month: number) => {
        setLoading(true);

        try {

            const key = `${year}-${month}`;

            let holidayEvents: CalendarEvent[];

            if (holidaysCache.current.has(key)) {
            holidayEvents = holidaysCache.current.get(key)!;
            } else {
            holidayEvents = await fetchHolidayEvents(year, month);
            holidaysCache.current.set(key, holidayEvents);
            }

            setEvents([...holidayEvents, ...userEvents]);
        } finally {
            setLoading(false);
        }
    }, [userEvents]);

  useEffect(() => {
    const today = new Date();

    void refreshEvents(today.getFullYear(), today.getMonth() + 1);
  }, [refreshEvents]);

  return (
    <CalendarContext.Provider
      value={{
        events,
        loading,
        refreshEvents,
      }}
    >
      {children}
    </CalendarContext.Provider>
  );
}

export function useCalendar() {
  const context = useContext(CalendarContext);

  if (!context) {
    throw new Error("useCalendar must be used inside CalendarProvider");
  }

  return context;
}
