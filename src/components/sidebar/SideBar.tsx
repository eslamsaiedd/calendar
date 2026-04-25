
import '../Global.css' 
import SmallCalendar from './SmallCalendar';


export function SideBar() {

    
    
  return (
     <aside className="shrink-0 pl-6 pr-0 py-3 w-64 dark:bg-[var(--bg-primary)] transition-all duration-300 ease-in-out z-40">
      <div className='w-full h-full bg-[var(--bg-card)] rounded-lg'>
        <div className='p-2 h-full'>
            <SmallCalendar/>
        </div>
      </div>
    </aside>
  );
}