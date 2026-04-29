
import '../Global.css' 
import { Categories } from './Categories';
import SmallCalendar from './SmallCalendar';
import { UpcomingEvents } from './UpcomingEvents';


export function SideBar() {

  return (
     <aside className="shrink-0 pl-6 pr-0 py-3 w-64 bg-[var(--border-light)] dark:bg-[var(--bg-primary)] transition-all duration-300 ease-in-out z-40">
      <div className='w-full h-full bg-white dark:bg-[var(--bg-card)] rounded-lg'>
        <div className='p-2 h-full overflow-y-auto scrollbar-thin scrollbar-thumb-[var(--primary)] scrollbar-track-transparent'>
            <SmallCalendar/>

            {/* upcoming events */}
            <UpcomingEvents/>

            {/* categories like work, personal, etc. */}
            <Categories/>

        </div>
      </div>
    </aside>
  );
}