import { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import "../Global.css"
import { useModal } from '../../context/ModalContext';

export default function SmallCalendar() {

  const { openModal } = useModal();
    const [data, setData] = useState(new Date());


    const [open, setOpen] = useState(false);
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
            <div className='flex justify-center items-center gap-2'>
               <button onClick={previousMonth}
                    className="p-2.5 cursor-pointer dark:bg-[var(--bg-card)] rounded-lg dark:text-white transition">
                    <ChevronLeft size={12} />
                </button>
                <div className='dark:text-[var(--text-primary-dark)] text-[var(--text-primary-light)] font-bold '>
                    {MONTHS[month]} {year}
                </div>
                <button onClick={nextMonth}
                    className="p-2.5 cursor-pointer dark:bg-[var(--bg-card)] rounded-lg dark:text-white transition">
                    <ChevronRight size={12} />
                </button>
            </div>

            {/* small calendar */}
            <div className='grid grid-cols-7 mb-1'>
                {["SU", "MO", "TU", "WE", "TH", "FR", "SA"].map(day => (
                    <div key={day} className='text-center text-xs dark:text-[var(--text-secondary-dark)] font-semibold'>
                        {day}
                    </div>
                ))}

                {totalDays.map((d, i) => (
                    <div key={i} className={`aspect-square flex items-center justify-center text-xs rounded-full cursor-pointer transition-colors ${
                        d.isCurrentMonth ? (isToday(d.day) ? 'bg-[var(--primary)] text-center w-6 h-6 rounded-full text-white' : 'text-[var(--text-primary-light)] dark:text-[var(--text-primary-dark)] hover:bg-gray-200 dark:hover:bg-gray-700') : 'text-[var(--text-secondary-light)] dark:text-[var(--text-secondary-dark)]'
                    }`}>
                        {d.day}
                    </div>
                ))}
            </div>
            
           <button
            onClick={() => setOpen(!open)}
           
            className=" mt-2 flex items-center  cursor-pointer text-center justify-center h-fit text-lg gap-1 p-2 w-full bg-[linear-gradient(90deg,#7C3AED,#A855F7)] text-white rounded-lg hover:bg-[var(--primary-hover)]">
                <Plus className='w-5 h-5' />
                create 
            </button>

            {open && (
                <div className='w-[200px] shadow-lg absolute bg-[var(--updated-border-light)] z-50 mt-2 p-2 rounded-lg dark:bg-[var(--bg-primary)] border border-[var(--border-light)] dark:border-[var(--border)]'>
                    <div className='flex flex-col gap-1 text-sm font-semibold dark:text-white text-[var(--text-primary-light)]'>
                        <div
                        onClick={() => openModal("event")}
                        className='p-1 rounded cursor-pointer hover:dark:bg-gray-700 hover:bg-[var(--bg-primary-light)]'>
                            Event
                        </div>
                        <div 
                        onClick={() => openModal("task")}
                        className='p-1 rounded cursor-pointer hover:dark:bg-gray-700 hover:bg-[var(--bg-primary-light)]'>
                            Task
                        </div>
                    </div>
                </div>
            )}

        </>
    )
}