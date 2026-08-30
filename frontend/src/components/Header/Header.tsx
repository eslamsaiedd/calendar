import { CalendarDays, Search, ChevronDown } from "lucide-react";
import ThemeToggle from "../../ThemeToggle";
import "../style/Global.css";
import { UserContext } from "../../context/UserContext";
import { useContext, useState } from "react";
import { NavLink } from "react-router-dom";
import Dropdown from "./Dropdown";

export function Header() {
  const { user } = useContext(UserContext);
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <nav className="w-full sticky top-0 border-b border-[var(--updated-border-light)] dark:border-[var(--border)] z-50 bg-white dark:bg-[var(--bg-primary)] h-16 flex items-center justify-between px-6">
      {/* Logo */}
      <h1 className="text-2xl font-bold flex items-center gap-1 dark:text-white text-[var(--primary-color)]">
        <CalendarDays className="dark:text-white w-7 h-7" />
        Calendar
      </h1>

      {/* Search bar */}
      <div className="flex items-center gap-2 rounded-2xl px-4 bg-[var(--border-light)] text-[var(--text-primary-light)] dark:text-[var(--text-primary-dark)] dark:bg-[var(--bg-card)] py-2 w-[400px]">
        <Search className="h-5 w-5  text-[var(--text-secondary-light)]  dark:text-[var(--text-secondary-dark)]" />
        <input
          className="w-full focus:outline-none placeholder:text-[var(--text-secondary-light)] placeholder:dark:text-[var(--text-secondary-dark)]"
          type="text"
          placeholder="Search events, people or categories"
        />
      </div>
      {/* User profile */}
      <div className="flex gap-1.5 items-center">
        {user ? (
          <div className="relative">
            <button
              className="flex items-center gap-3 p-2 rounded-xl transition-all bg-[var(--border-light)] border border-gray-200 text-[var(--text-primary-light)] hover:bg-gray-200 dark:bg-[var(--bg-card)] dark:border-[#2e2e4a] dark:text-[var(--text-primary-dark)] dark:hover:bg-white/[0.04]"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center font-semibold text-sm text-gray-600 dark:bg-[var(--bg-navbar)] dark:text-[var(--text-primary-dark)]">
                {user.username
                  ? user.username
                      .split(" ")
                      .map((n: string) => n[0])
                      .join("")
                      .toUpperCase()
                  : null}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-[var(--text-primary-light)] dark:text-[var(--text-primary-dark)]">
                  {user.username}
                </p>
                <p className="text-xs text-gray-500 dark:text-[var(--text-secondary-dark)]">
                  {user.email}
                </p>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400 dark:text-[#b0b0cc]" />
            </button>
            {showDropdown && (
              <Dropdown
                className="z-50"
                isOpen={showDropdown}
              />
            )}
          </div>
        ) : (
          <NavLink
            to="/login"
            className="px-4 py-1.5 hover:cursor-pointer text-[var(--text-primary-light)] dark:text-[var(--text-primary-dark)] rounded-lg w-fit h-fit bg-[linear-gradient(90deg,#7C3AED,#A855F7)] transition "
          >
            Login
          </NavLink>
        )}

        {/* toggle button */}
        <ThemeToggle />
      </div>
    </nav>
  );
}
