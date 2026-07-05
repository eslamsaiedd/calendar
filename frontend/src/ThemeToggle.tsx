import { useTheme } from "./context/ThemeContext";
import { Moon, Sun  } from 'lucide-react';

export default function ThemeToggle() {
  const { dark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg dark:text-white text-[var(--primary-color)] bg-[var(--border-light)] hover:bg-gray-200 
     dark:bg-[var(--bg-card)] dark:hover:bg-gray-700 hover:cursor-pointer md:block"
    >
        {dark?(
            <Sun />
            ): (
            <Moon />
        )}
    </button>
  );
}
