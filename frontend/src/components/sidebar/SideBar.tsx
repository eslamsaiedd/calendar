
// import '../style/Global.css' 
// import { Categories } from './Categories';
// import SmallCalendar from './SmallCalendar';
// import { UpcomingEvents } from './UpcomingEvents';


// export function SideBar() {

//   return (
//      <aside className="shrink-0 pl-6 pr-0 py-3 w-64 bg-[var(--border-light)] dark:bg-[var(--bg-primary)] transition-all duration-300 ease-in-out z-40">
//       <div className='w-full h-full bg-white dark:bg-[var(--bg-card)] rounded-lg'>
//         <div className='p-2 h-full overflow-y-auto scrollbar-thin scrollbar-thumb-[var(--primary)] scrollbar-track-transparent'>
//             <SmallCalendar/>

//             {/* upcoming events */}
//             <UpcomingEvents/>

//             {/* categories like work, personal, etc. */}
//             <Categories/>

//         </div>
//       </div>
//     </aside>
//   );
// }


import '../style/Global.css';
import { Categories } from './Categories';
import SmallCalendar from './SmallCalendar';
import { UpcomingEvents } from './UpcomingEvents';
import { useSidebar } from '../../context/SidebarContext';

export function SideBar() {
  const { isOpen, close } = useSidebar();

  return (
    <>
      {/* Mobile backdrop — tapping it closes the sidebar */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={close}
          aria-hidden="true"
        />
      )}

      <aside
        className={`
          shrink-0 py-3 z-40 transition-all duration-300 ease-in-out
          bg-[var(--border-light)] dark:bg-[var(--bg-primary)]

          /* Mobile: slide-over drawer */
          fixed top-16 left-0 h-[calc(100dvh-4rem)] pl-3 pr-3
          lg:static lg:h-auto lg:pl-6 lg:pr-0

          /* Width: collapsed = 0, open = 256px */
          ${isOpen ? 'w-64 opacity-100' : 'w-0 opacity-0 overflow-hidden'}

          /* On large screens keep it in flow (not a drawer) */
          lg:relative lg:translate-x-0
        `}
      >
        <div className="w-full h-full bg-white dark:bg-[var(--bg-card)] rounded-lg
          min-w-[224px]">
          <div className="p-2 h-full overflow-y-auto scrollbar-thin
            scrollbar-thumb-[var(--primary)] scrollbar-track-transparent">
            <SmallCalendar />
            <UpcomingEvents />
            <Categories />
          </div>
        </div>
      </aside>
    </>
  );
}