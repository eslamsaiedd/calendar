import { useState, useRef, useEffect } from "react";
import {
  X,
  Calendar,
  Clock,
  ChevronDown,
  Check,
  Tag,
  Folder,
  Plus,
} from "lucide-react";
import { useModal } from "../context/ModalContext";

// ─── Types ────────────────────────────────────────────────────────────────────

// type TabType = "event" | "task";
type ColorId = "purple" | "blue" | "teal" | "pink" | "amber" | "green";

interface ColorOption {
  id: ColorId;
  bg: string;
  ring: string;
}

interface Category {
  id: string;
  label: string;
}

interface FormState {
  title: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  allDay: boolean;
  description: string;
  category: string;
  colorLabel: ColorId;
}

interface CreateEventFormProps {
  onSubmit?: (data: FormState) => void;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const COLORS: ColorOption[] = [
  { id: "purple", bg: "#7c3aed", ring: "ring-violet-400"  },
  { id: "blue",   bg: "#3b82f6", ring: "ring-blue-400"    },
  { id: "teal",   bg: "#14b8a6", ring: "ring-teal-400"    },
  { id: "pink",   bg: "#ec4899", ring: "ring-pink-400"    },
  { id: "amber",  bg: "#f59e0b", ring: "ring-amber-400"   },
  { id: "green",  bg: "#22c55e", ring: "ring-green-400"   },
];

const DEFAULT_CATEGORIES: Category[] = [
  { id: "work",     label: "Work"     },
  { id: "personal", label: "Personal" },
  { id: "health",   label: "Health"   },
  { id: "social",   label: "Social"   },
  { id: "finance",  label: "Finance"  },
  { id: "travel",   label: "Travel"   },
  { id: "learning", label: "Learning" },
  { id: "other",    label: "Other"    },
];

// ─── Shared class helpers ─────────────────────────────────────────────────────

// Light:  white bg, gray-200 border, gray-800 text
// Dark:   #1e1e32 bg, #2e2e4a border, #e8e8f0 text
const fieldCls = `
  flex items-center gap-2 rounded-lg px-3 py-2
  bg-[#e5e7eb58] border border-gray-200 text-gray-800
  dark:bg-[#1e1e32] dark:border-[#2e2e4a] dark:text-[#e8e8f0]
`;

const labelCls = "text-[11px] font-medium tracking-wide text-gray-500 dark:text-[#8888aa]";

const iconCls  = "shrink-0 text-gray-400 dark:text-[#8888aa]";

const inputInnerCls = `
  bg-transparent border-none outline-none text-[13px] font-medium w-full
  text-gray-800 placeholder:text-gray-400
  dark:text-[#e8e8f0] dark:placeholder:text-[#8888aa]
`;

// ─── Category Dropdown (opens UPWARD) ────────────────────────────────────────

interface CategoryDropdownProps {
  categories: Category[];
  selected: string;
  onSelect: (id: string) => void;
  onCreateNew: (label: string) => void;
}

function CategoryDropdown({ categories, selected, onSelect, onCreateNew }: CategoryDropdownProps) {
  const [open, setOpen]         = useState(false);
  const [newLabel, setNewLabel] = useState("");
  const [creating, setCreating] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef    = useRef<HTMLInputElement>(null);

  const selectedCat = categories.find((c) => c.id === selected);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
        setCreating(false);
        setNewLabel("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (creating) inputRef.current?.focus();
  }, [creating]);

  const handleCreate = () => {
    const trimmed = newLabel.trim();
    if (!trimmed) return;
    onCreateNew(trimmed);
    setNewLabel("");
    setCreating(false);
    setOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleCreate();
    if (e.key === "Escape") { setCreating(false); setNewLabel(""); }
  };

  return (
    <div ref={dropdownRef} className="relative">

      {/* ── Trigger ── */}
      <button
        onClick={() => { setOpen((v) => !v); setCreating(false); setNewLabel(""); }}
        className={`
          w-full flex items-center gap-2 rounded-lg px-3 py-2 cursor-pointer transition-all text-left
          bg-[#e5e7eb58] border text-gray-800
          dark:bg-[#1e1e32] dark:text-[#e8e8f0]
          ${open
            ? "border-violet-500/60 dark:border-violet-500/60"
            : "border-gray-200 dark:border-[#2e2e4a]"
          }
        `}
      >
        <Folder size={14} className={iconCls} />
        <span className="flex-1 text-[13px] font-medium">
          {selectedCat
            ? selectedCat.label
            : <span className="text-gray-400 dark:text-[#8888aa]">Select category</span>
          }
        </span>
        <ChevronDown
          size={13}
          className={`${iconCls} transition-transform duration-200 ${open ? "rotate-180" : "rotate-0"}`}
        />
      </button>

      {/* ── Panel — opens UPWARD ── */}
      {open && (
        <div className="
          absolute left-0 right-0 z-50 rounded-[10px] overflow-hidden
          bottom-[calc(100%+6px)]
          bg-white border border-gray-200 shadow-lg
          dark:bg-[#12121f] dark:border-[#2e2e4a] dark:shadow-[0_-12px_32px_rgba(0,0,0,0.5)]
        ">
          {/* Create new — at TOP when opening upward */}
          <div className="p-2">
            {creating ? (
              <div className="
                flex items-center gap-2 px-2 py-1.5 rounded-[7px]
                bg-violet-50 border border-violet-200
                dark:bg-violet-500/10 dark:border-violet-500/35
              ">
                <input
                  ref={inputRef}
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Category name..."
                  className="
                    flex-1 bg-transparent border-none outline-none text-[13px]
                    text-gray-800 placeholder:text-gray-400
                    dark:text-[#e8e8f0] dark:placeholder:text-[#8888aa]
                  "
                />
                <button
                  onClick={handleCreate}
                  disabled={!newLabel.trim()}
                  className={`
                    flex items-center justify-center w-5 h-5 rounded-md border-none cursor-pointer transition-colors
                    ${newLabel.trim()
                      ? "bg-violet-600"
                      : "bg-violet-200 dark:bg-violet-500/25"
                    }
                  `}
                >
                  <Check size={11} color="white" strokeWidth={2.5} />
                </button>
                <button
                  onClick={() => { setCreating(false); setNewLabel(""); }}
                  className="
                    flex items-center justify-center w-5 h-5 rounded-md border-none cursor-pointer
                    bg-gray-100 dark:bg-white/[0.07]
                  "
                >
                  <X size={11} className="text-gray-400 dark:text-[#8888aa]" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setCreating(true)}
                className="
                  w-full flex items-center gap-2 px-2 py-1.5 rounded-[7px]
                  text-[12px] font-medium cursor-pointer transition-colors border-none
                  text-violet-600 bg-transparent border border-dashed border-violet-300
                  hover:bg-violet-50
                  dark:text-violet-400 dark:border-violet-500/40 dark:hover:bg-violet-500/[0.08]
                "
              >
                <Plus size={13} />
                Create new category
              </button>
            )}
          </div>

          {/* Divider */}
          <div className="h-px mx-3 bg-gray-200 dark:bg-[#2e2e4a]" />

          {/* List */}
          <div className="max-h-44 overflow-y-auto">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => { onSelect(cat.id); setOpen(false); }}
                className={`
                  w-full flex items-center justify-between px-3 py-2
                  text-[13px] font-medium cursor-pointer transition-colors text-left border-none
                  ${selected === cat.id
                    ? "bg-violet-50 text-violet-600 dark:bg-violet-500/15 dark:text-violet-300"
                    : "text-gray-700 hover:bg-gray-50 dark:text-[#b0b0cc] dark:hover:bg-white/[0.04]"
                  }
                `}
              >
                {cat.label}
                {selected === cat.id && (
                  <Check size={13} className="text-violet-600 dark:text-violet-300" strokeWidth={2.5} />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function CreateEventForm({ onSubmit }: CreateEventFormProps) {
//   const [activeTab, setActiveTab] = useState<TabType>("event");
  const [categories, setCategories] = useState<Category[]>(DEFAULT_CATEGORIES);
  const [form, setForm] = useState<FormState>({
    title: "",
    startDate: "2026-04-23",
    endDate: "2026-04-23",
    startTime: "10:00 AM",
    endTime: "11:00 AM",
    allDay: false,
    description: "",
    category: "work",
    colorLabel: "purple",
  });

  const { isOpen, closeModal } = useModal();

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleCreateCategory = (label: string) => {
    const id = label.toLowerCase().replace(/\s+/g, "-");
    setCategories((prev) => [...prev, { id, label }]);
    update("category", id);
  };

  return (
    <>
      {isOpen && (
        /* ── Overlay ── */
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm dark:bg-black/70">

          {/* ── Modal ── */}
          <div className="
            w-[450px] rounded-2xl p-6 relative
            bg-white border border-gray-200 shadow-2xl shadow-black/10
            dark:bg-[#1a1a2e] dark:border-[#2e2e4a] dark:shadow-[0_24px_64px_rgba(0,0,0,0.7)]
          ">

            {/* ── Header ── */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[18px] font-bold tracking-tight text-gray-900 dark:text-[#e8e8f0]">
                Create Event
              </h2>
              <button
                onClick={closeModal}
                className="
                  w-7 h-7 rounded-lg flex items-center justify-center border-none cursor-pointer transition-colors
                  bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-700
                  dark:bg-white/[0.06] dark:hover:bg-white/[0.12] dark:text-[#8888aa] dark:hover:text-[#e8e8f0]
                "
              >
                <X size={14} />
              </button>
            </div>

            {/* ── Tabs ── */}
            {/* <div className="flex p-1 gap-1 rounded-[9px] w-fit mb-4 bg-gray-100 dark:bg-[#1e1e32]">
              {(["event", "task"] as TabType[]).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`
                    px-4 py-1.5 rounded-[6px] text-[13px] font-medium capitalize transition-all cursor-pointer border-none
                    ${activeTab === tab
                      ? "bg-violet-600 text-white shadow-[0_2px_8px_rgba(124,58,237,0.35)]"
                      : "bg-transparent text-gray-500 hover:text-gray-800 dark:text-[#8888aa] dark:hover:text-[#e8e8f0]"
                    }
                  `}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div> */}

            {/* ── Title ── */}
            <input
              type="text"
              placeholder="Add title"
              value={form.title}
              onChange={(e) => update("title", e.target.value)}
              className="
                w-full rounded-[9px] px-3.5 py-2.5 text-[14px] font-medium mb-3 outline-none transition-all
                bg-[#e5e7eb58] border-[1.5px] border-violet-600
                text-gray-900 placeholder:text-gray-400
                ring-[3px] ring-violet-500/10
                focus:ring-violet-500/20 focus:border-violet-500
                dark:bg-transparent dark:text-[#e8e8f0] dark:placeholder:text-[#8888aa]
                dark:ring-violet-500/10 dark:focus:ring-violet-500/[0.22]
              "
            />

            {/* ── Dates ── */}
            <div className="grid grid-cols-2 gap-2.5 mb-2.5">
              {(["startDate", "endDate"] as const).map((key, i) => (
                <div key={key} className="flex flex-col gap-1">
                  <span className={labelCls}>{i === 0 ? "Start Date" : "End Date"}</span>
                  <div className={fieldCls}>
                    <Calendar size={14} className={iconCls} />
                    <input
                      type="date"
                      value={form[key]}
                      onChange={(e) => update(key, e.target.value)}
                      className={`${inputInnerCls} [color-scheme:light] dark:[color-scheme:dark]`}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* ── Times (manual) ── */}
            <div className="grid grid-cols-2 gap-2.5 mb-3">
              {(["startTime", "endTime"] as const).map((key, i) => (
                <div key={key} className="flex flex-col gap-1">
                  <span className={labelCls}>{i === 0 ? "Start Time" : "End Time"}</span>
                  <div className={fieldCls}>
                    <Clock size={14} className={iconCls} />
                    <input
                      type="text"
                      value={form[key]}
                      onChange={(e) => update(key, e.target.value)}
                      placeholder="e.g. 10:00 AM"
                      className={`${inputInnerCls} flex-1`}
                    />
                  </div>
                </div>
              ))}
            </div>


            {/* ── Description ── */}
            <textarea
              placeholder="Add description..."
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
              rows={2}
              className="
                w-full rounded-[9px] px-3.5 py-2.5 text-[13px] outline-none resize-none mb-3 transition-colors
                bg-[#e5e7eb58] border border-gray-200
                text-gray-800 placeholder:text-gray-400
                focus:border-violet-400/60
                dark:bg-[#1e1e32] dark:border-[#2e2e4a]
                dark:text-[#e8e8f0] dark:placeholder:text-[#8888aa]
                dark:focus:border-violet-500/55
              "
            />

            {/* ── Category ── */}
            <div className="mb-3">
              <span className={`${labelCls} block mb-1.5`}>Category</span>
              <CategoryDropdown
                categories={categories}
                selected={form.category}
                onSelect={(id) => update("category", id)}
                onCreateNew={handleCreateCategory}
              />
            </div>

            {/* ── Color Label ── */}
            <div className="flex items-center mb-4">
              <div className="flex items-center gap-2">
                <Tag size={14} className={iconCls} />
                <span className="text-[13px] font-medium text-gray-800 dark:text-[#e8e8f0]">
                  Color Label
                </span>
              </div>
              <div className="flex items-center gap-1.5 ml-auto">
                {COLORS.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => update("colorLabel", c.id)}
                    className={`
                      w-7 h-7 rounded-full flex items-center justify-center border-none cursor-pointer transition-all
                      ${form.colorLabel === c.id
                        ? `scale-110 ring-2 ring-offset-1 ${c.ring} ring-offset-white dark:ring-offset-[#1a1a2e]`
                        : "scale-100 hover:scale-105"
                      }
                    `}
                    style={{ background: c.bg }}
                  >
                    {form.colorLabel === c.id && (
                      <Check size={12} color="white" strokeWidth={2.5} />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* ── Divider ── */}
            <div className="mb-4 h-px bg-gray-200 dark:bg-[#2e2e4a]" />

            {/* ── Footer ── */}
            <div className="flex gap-2.5">
              <button
                onClick={closeModal}
                className="
                  flex-1 py-2.5 rounded-[9px] text-[13px] font-semibold transition-all cursor-pointer border
                  bg-transparent text-gray-500 border-gray-200
                  hover:border-violet-400/50 hover:text-violet-600
                  dark:text-[#8888aa] dark:border-[#2e2e4a]
                  dark:hover:border-violet-500/40 dark:hover:text-[#e8e8f0]
                "
              >
                Cancel
              </button>
              <button
                onClick={() => onSubmit?.(form)}
                className="
                  py-2.5 rounded-[9px] text-[13px] font-bold text-white border-none cursor-pointer transition-all
                  bg-gradient-to-br from-violet-600 to-violet-500
                  shadow-[0_4px_16px_rgba(124,58,237,0.35)]
                  hover:-translate-y-px hover:shadow-[0_6px_22px_rgba(124,58,237,0.5)]
                  active:translate-y-0
                "
                style={{ flex: 1.6 }}
              >
                Create Event
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}