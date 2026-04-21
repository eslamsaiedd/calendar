import { useState } from "react";



function Home() {

    const totalDays = [];
    const [data, setData] = useState(new Date());
    
    const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    // const TODAY = new Date();

    
    const year = data.getFullYear();
    const month = data.getMonth();
    const monthName = MONTHS[month];


    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();

    

    // to handle the empty spaces before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
        totalDays.push(null);
    }

    for (let i = 0; i < daysInMonth; i++) {
        totalDays.push(i + 1);
    }



   const isToday = (day) => {
        const today = new Date();

        return (
            day === today.getDate() &&
            month === today.getMonth() &&
            year === today.getFullYear()
        );
    };


    const nextMonth = () => {
        setData(new Date(year, month + 1, 1));
    }

    const previousMonth = () => {
        setData(new Date(year, month - 1, 1));
    }


    const today = () => {
        setData(new Date());
    }
    return (
       <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">{monthName} {year}</h1>
            
            <div className="flex gap-3">
                <button onClick={today} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded">
                    Today
                </button>
                <button onClick={previousMonth} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded">
                    Previous
                </button>
                
                <button onClick={nextMonth} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded">
                    Next
                </button>
            </div>

            <div className="grid grid-cols-7 border border-gray-50">

                {/* Header (Days of week) */}
                {DAYS.map((day) => (
                    <div
                        key={day}
                        className="text-center text-gray-500 font-semibold bg-gray-100 p-8"
                    >
                        {day}
                    </div>
                ))}

                {/* Days of month */}
                {totalDays.map((day, index) => (
                    <div
                        key={`${day}-${index}`}
                        className={`h-[80px] p-3 border border-gray-200 ${isToday(day) ? 'bg-blue-500 text-white hover:bg-blue-600' : 'hover:bg-gray-100'}`}
                    >
                        {day ? day : ""}
                    </div>
                ))}
            </div>

        </div>
    );
}   

export default Home

