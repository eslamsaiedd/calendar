import axios from "axios";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
} from "react";

import type { ReactNode } from "react";

type modifiedPublicEvent = {
  counties?: string[];
  countryCode: string;
  date: string;
  fixed: boolean;
  global: boolean;
  launchYear: number | null;
  localName: string;
  name: string;
  types: string[];
};

type modifiedEvent = {
  date: {
    gregorian: {
      date: string;
    };
    hijri: {
      date: string;
      holidays: string[];
    };
  };
};

export type CalendarEvent = {
  _id?: string;
  id: string;
  title?: string;
  description?: string;
  englishTitle?: string;
  arabicTitle?: string;
  isTranslated?: boolean;
  color?: string;
  colorLabel?: string;
  startTime?: string;
  endTime?: string;
  source?: "holiday" | "user";
  date: string
  type: "event" | "task" | "holiday";
  startDate?: string;
  endDate?: string;
};

type CalendarContextType = {
  events: CalendarEvent[];
  holidayEvents: CalendarEvent[];
  userEvents: CalendarEvent[];
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

const transformIslamicEvents = (data: modifiedEvent[]): CalendarEvent[] => {
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
      source: "holiday",
    }));
  });
};

const transformPublicEvents = (data: modifiedPublicEvent[]): CalendarEvent[] => {
  return data.map((event) => ({
    id: `public-${event.date}`,
    englishTitle: event.name,
    arabicTitle: event.localName,
    isTranslated: true,
    date: event.date,
    type: "holiday",
    source: "holiday",
  }));
};

async function fetchHolidayEvents(
  year: number,
  month: number,
): Promise<CalendarEvent[]> {

    const token = localStorage.getItem("token");

    if (!token) {
      console.error("No token found in localStorage.");
      return [];
    }
  const [islamicRes, publicRes] = await Promise.all([
    fetch(
      `https://api.aladhan.com/v1/calendar/${year}/${month}?latitude=30&longitude=31`,
    ),
    fetch(`https://date.nager.at/api/v3/PublicHolidays/${year}/EG`),
  ]);

  const islamicData = await islamicRes.json();
  const publicData = await publicRes.json();


  const modifiedData = islamicData.data.map((items: unknown[]) => ({
    ...items,
    isTranslated: true,
  }));

  const modifiedDataPublic = publicData.map((item: unknown[]) => ({
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

    const response = await axios.get("https://character-moist-kangaroo.abasthan.app/api/events", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const modifiedData = response.data.data.events.map((item: unknown[]) => ({
      ...item,
      isTranslated: false, 
    }));

    return modifiedData.map((event: CalendarEvent) => ({
      id: event.id || event._id,
      isTranslated: event.isTranslated,
      title: event.title,
      description: event.description,
      color: event.color,
      colorLabel: event.colorLabel || event.color || "blue",
      date: event.startDate ? new Date(event.startDate).toISOString().split("T")[0] : event.date ?? "",
      startTime: event.startTime,
      endTime: event.endTime,
      source: "user",
      type: event.type || "event",
    }));
  } catch (error) {
    console.error("Error fetching user events:", error);
    return [];
  }
}

export function CalendarProvider({ children }: { children: ReactNode }) {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [holidayEvents, setHolidayEvents] = useState<CalendarEvent[]>([]);
  const [userEvents, setUserEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [authToken,] = useState<string | null>(() =>
    typeof window !== "undefined" ? localStorage.getItem("token") : null,
  );
  const holidaysCache = useRef(new Map<string, CalendarEvent[]>());
  const refreshPromiseRef = useRef<Promise<void> | null>(null);

  useEffect(() => {
  const syncAuth = () => {
    return typeof window !== "undefined"
      ? localStorage.getItem("token")
      : null;
  };

    syncAuth();
    window.addEventListener("storage", syncAuth);
    window.addEventListener("auth:changed", syncAuth as EventListener);

    return () => {
      window.removeEventListener("storage", syncAuth);
      window.removeEventListener("auth:changed", syncAuth as EventListener);
    };
  }, []);

  const refreshEvents = useCallback(async (year: number, month: number) => {
    if (!authToken) {
      setHolidayEvents([]);
      setUserEvents([]);
      setEvents([]);
      return;
    }

    if (refreshPromiseRef.current) {
      return refreshPromiseRef.current;
    }

    refreshPromiseRef.current = (async () => {
      setLoading(true);

      try {
        const key = `${year}-${month}`;

        let holidayData: CalendarEvent[];

        if (holidaysCache.current.has(key)) {
          holidayData = holidaysCache.current.get(key)!;
        } else {
          holidayData = await fetchHolidayEvents(year, month);
          holidaysCache.current.set(key, holidayData);
        }

        const userData = await fetchUserEvents();

        setHolidayEvents(holidayData);
        setUserEvents(userData);
        setEvents([...holidayData, ...userData]);
      } catch (error) {
        console.error("Error refreshing calendar events:", error);
      } finally {
        setLoading(false);
        refreshPromiseRef.current = null;
      }
    })();

    return refreshPromiseRef.current;
  }, [authToken]);

  useEffect(() => {
    const today = new Date();

    void refreshEvents(today.getFullYear(), today.getMonth() + 1);
  }, [authToken, refreshEvents]);

  return (
    <CalendarContext.Provider
      value={{
        events,
        holidayEvents,
        userEvents,
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
