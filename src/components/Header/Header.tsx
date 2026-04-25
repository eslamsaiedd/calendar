import { CalendarDays, Search, ChevronDown } from 'lucide-react';
import ThemeToggle from '../../ThemeToggle';
import '../Global.css'

export function Header() {

    const auth = true
    const name = 'eslam saied'

 return (
    <nav className="w-full sticky top-0 border-b border-[var(--border-light)] dark:border-[var(--border)] z-50 bg-[var(--bg-primary-light)] dark:bg-[var(--bg-primary)] h-16 flex items-center justify-between px-6">
      <h1 className="text-2xl font-bold flex items-center gap-1 dark:text-white text-[var(--primary-color)]">
        <CalendarDays className="dark:text-white w-7 h-7"/>
        Calendar
      </h1>

      <div className="flex items-center gap-2 rounded-2xl px-4 bg-[var(--bg-input-light)] text-[var(--text-secondary-light)] dark:bg-[var(--bg-surface)] dark:text-[var(--text-primary-dark)] py-2 w-[400px]">
        <Search className='h-5 w-5  text-[var(--text-secondary-light)]  dark:text-[var(--text-secondary-dark)]'/>
        <input className="w-full focus:outline-none placeholder:text-[var(--text-secondary-light)] placeholder:dark:text-[var(--text-secondary-dark)]" type="text" placeholder="Search events, people or categories"/>
      </div>

      <div className="flex gap-1.5 items-center">
        {auth ? (
            <button
                  className="flex items-center gap-3 p-2 bg-[var(--bg-input-light)] dark:bg-[var(--bg-surface)] hover:dark:bg-[var(--bg-input)] hover:cursor-pointer hover:dark:bg-[var()] hover:bg-gray-200 rounded-xl transition"
                >
                <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center dark:text-[var(--text-primary-dark)] dark:bg-[var(--bg-navbar)] font-semibold text-sm">
                    {name ? (
                        name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .toUpperCase()
                    ) : (
                      null
                    )}
                    
                </div>
                <div className="hidden md:block text-left">
                <p className="text-sm font-medium dark:text-[var(--text-primary-dark)] text-[var( --text-primary-light)]">
                    {/* {user?.name} */}
                    {name}
                </p>
                <p className="text-xs dark:text-[var( --text-secondary-dark)]  text-gray-500">
                    {/* {user?.email} */}
                    eslam@gmail.com
                </p>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-400" />
            </button>
        ) : (
             <button className="px-4 py-1.5 hover:cursor-pointer text-[var(--text-primary-light)] dark:text-[var(--text-primary-dark)] rounded-lg w-fit h-fit bg-[linear-gradient(90deg,#7C3AED,#A855F7)] transition ">Login</button>
        )}

        {/* toggle button */}
        <ThemeToggle/>
      </div>
    </nav>
  )
}