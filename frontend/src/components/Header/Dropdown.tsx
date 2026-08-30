import { User, LogOut } from "lucide-react";

type DropdownMenuProps = {
  isOpen: boolean;
  onProfile?: () => void;
  onLogout?: () => void;
  className?: string;
};

export default function Dropdown({
  isOpen,
  className,
}: DropdownMenuProps) {
  if (!isOpen) return null;


  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  }

  
  const handleProfile = () => {
    window.location.href = "/profile";
  }


  return (
    <div className={`${className ?? ""} absolute left-1/2 top-full z-50 mt-2 w-52 min-w-[14rem] -translate-x-1/2 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg dark:border-[#2e2e4a] dark:bg-[#12121f] dark:shadow-[0_12px_40px_rgba(0,0,0,0.35)]`}>
      <button
        onClick={handleProfile}
        className="flex w-full items-center gap-3 px-4 py-3 text-sm text-gray-700 transition-colors hover:bg-gray-100 dark:text-[#e8e8f0] cursor-pointer dark:hover:bg-white/[0.04]"
      >
        <User size={18} />
        <span>Profile</span>
      </button>

      <div className="border-t border-gray-100 dark:border-[#2e2e4a]" />

      <button
        onClick={()=> handleLogout()}
        className="flex w-full items-center gap-3 px-4 py-3 text-sm text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 cursor-pointer dark:hover:bg-red-500/10"
      >
        <LogOut size={18} />
        <span>Logout</span>
      </button>
    </div>
  );
}
