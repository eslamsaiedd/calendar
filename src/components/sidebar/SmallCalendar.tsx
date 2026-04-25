import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';


export default function SmallCalendar() {
    const [data, setData] = useState(new Date());

  const totalDays = [];
  const MONTHS = [ "January","February","March","April","May","June", "July","August","September","October","November","December", ];

  const month = data.getMonth();
  const year = data.getFullYear();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  
  const lastDayPrevMonth = new Date(year, month, 0).getDate();

  // to handle the empty spaces before the first day of the month
  if (firstDayOfMonth > 0) {
      for (let i = firstDayOfMonth - 1; i >= 0; i--) {
          totalDays.push({
              day: lastDayPrevMonth - i,
              isCurrentMonth: false
          });
      }
  }
   
  for (let i = 0; i < daysInMonth; i++) {
      totalDays.push({
          day: i + 1,
          isCurrentMonth: true
      });
  }

  const isToday = (day: number) => {
      const today = new Date();

      return (
          day === today.getDate() &&
          month === today.getMonth() &&
          year === today.getFullYear()
      );
  };

  const nextMonth = () => {
      setData(new Date(year, month + 1, 1));
  };

  const previousMonth = () => {
      setData(new Date(year, month - 1, 1));
  };
    return (    
        <>
            {/* header */}
            <div className='flex justify-center items-center gap-2 mb-3'>
               <button onClick={previousMonth}
                    className="p-2.5 cursor-pointer dark:bg-[var(--bg-card)] rounded-lg dark:text-white transition">
                    <ChevronLeft size={12} />
                </button>
                <div className='text-white'>{MONTHS[month]} {year}</div>
                <button onClick={nextMonth}
                    className="p-2.5 cursor-pointer dark:bg-[var(--bg-card)] rounded-lg dark:text-white transition">
                    <ChevronRight size={12} />
                </button>
            </div>

            {/* small calendar */}
            <div className='grid grid-cols-7 gap-1 mb-1.5'>
                {["SU", "MO", "TU", "WE", "TH", "FR", "SA"].map(day => (
                    <div key={day} className='text-center text-xs dark:text-[var(--text-secondary-dark)] font-semibold'>
                        {day}
                    </div>
                ))}

                {totalDays.map((d, i) => (
                    <div key={i} className={`aspect-square flex items-center justify-center text-sm rounded-full cursor-pointer transition-colors ${
                        d.isCurrentMonth ? (isToday(d.day) ? 'bg-[var(--primary-color)] text-white' : 'text-[var(--text-primary-light)] dark:text-[var(--text-primary-dark)] hover:bg-gray-200 dark:hover:bg-gray-700') : 'text-[var(--text-secondary-light)] dark:text-[var(--text-secondary-dark)]'
                    }`}>
                        {d.day}
                    </div>
                ))}
            </div>
        </>
    )
}