import React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import {
  X,
  Pencil,
  Trash2,
  MoreHorizontal,
  Calendar,
  AlignLeft,
  Tag,
  CheckCircle2,
  Flag,
  MapPin,
  Users,
  Bell,
  Lock,
  Repeat,
  Info,
  Check,
  Copy,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export type ItemType = "event" | "task" | "holiday";
export type TaskStatus = "pending" | "in-progress" | "completed";
export type Priority = "high" | "medium" | "low";

export interface Guest {
  name: string;
  avatarUrl?: string;
}

export interface EventEditValues {
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
}

export interface EventDetailsPopupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  /** "event" or "task" — controls which sections render */
  event: {
    type: ItemType;

    title?: string;
    /** hex color shown as a swatch next to the title, e.g. "#7C3AED" */
    color?: string;

    allDay?: boolean;
    

    description?: string;
    category?: string;

    status?: TaskStatus;
    priority?: Priority;

    location?: string;
    guests?: Guest[];

    reminder?: string;
    visibility?: string;
    repeat?: string;

    createdAt?: string;
    updatedAt?: string;
  }

  /** ISO date-time strings */
  startDateTime: string;
  endDateTime?: string;

  isEditable?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  onSave?: (values: EventEditValues) => Promise<void> | void;
  onMore?: () => void;
  onMarkCompleted?: () => void;
  onDuplicate?: () => void;
}

/* ------------------------------------------------------------------ */
/*  Formatting helpers                                                  */
/* ------------------------------------------------------------------ */

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

const formatTime = (iso: string) =>
  new Date(iso).toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });

const formatShort = (iso: string) =>
  new Date(iso).toLocaleDateString(undefined, {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

const toLocalDateInput = (iso: string) => {
  const date = new Date(iso);
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const toLocalTimeInput = (iso: string) => {
  const date = new Date(iso);
  const hours = `${date.getHours()}`.padStart(2, "0");
  const minutes = `${date.getMinutes()}`.padStart(2, "0");
  return `${hours}:${minutes}`;
};

/* ------------------------------------------------------------------ */
/*  Badge styles                                                       */
/* ------------------------------------------------------------------ */

const statusStyles: Record<TaskStatus, { label: string; className: string }> = {
  pending: {
    label: "Pending",
    className: "bg-slate-100 text-slate-600 ring-slate-500/10",
  },
  "in-progress": {
    label: "In Progress",
    className: "bg-blue-50 text-blue-700 ring-blue-600/20",
  },
  completed: {
    label: "Completed",
    className: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  },
};

const priorityStyles: Record<
  Priority,
  { label: string; className: string; dot: string }
> = {
  high: {
    label: "High",
    className: "bg-red-50 text-red-700 ring-red-600/20",
    dot: "bg-red-500",
  },
  medium: {
    label: "Medium",
    className: "bg-amber-50 text-amber-700 ring-amber-600/20",
    dot: "bg-amber-500",
  },
  low: {
    label: "Low",
    className: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
    dot: "bg-emerald-500",
  },
};

/* ------------------------------------------------------------------ */
/*  Small presentational primitives                                    */
/* ------------------------------------------------------------------ */

const Row: React.FC<{ icon: React.ReactNode; children: React.ReactNode }> = ({
  icon,
  children,
}) => (
  <div className="flex gap-4 py-3">
    <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center text-slate-400">
      {icon}
    </div>
    <div className="min-w-0 flex-1 text-[14.5px] leading-relaxed text-slate-700">
      {children}
    </div>
  </div>
);

const Divider = () => <div className="h-px w-full bg-slate-100" />;

const IconButton: React.FC<{
  onClick?: () => void;
  label: string;
  children: React.ReactNode;
}> = ({ onClick, label, children }) => (
  <button
    type="button"
    onClick={onClick}
    aria-label={label}
    title={label}
    className="flex h-9 w-9 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
  >
    {children}
  </button>
);

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */

export default function EventDetailsPopup({
  open,
  onOpenChange,
  event,
  startDateTime,
  endDateTime,
  isEditable = false,
  onEdit,
  onDelete,
  onSave,
  onMore,
  onMarkCompleted,
  onDuplicate,
}: EventDetailsPopupProps) {
  const isTask = event?.type === "task";
  const isCompleted = event?.status === "completed";
  const [isEditing, setIsEditing] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);
  const [draft, setDraft] = React.useState<EventEditValues>({
    title: event?.title ?? "",
    description: event?.description ?? "",
    date: toLocalDateInput(startDateTime),
    startTime: toLocalTimeInput(startDateTime),
    endTime: toLocalTimeInput(endDateTime ?? startDateTime),
  });

  const startEdit = () => {
    setDraft({
      title: event?.title ?? "",
      description: event?.description ?? "",
      date: toLocalDateInput(startDateTime),
      startTime: toLocalTimeInput(startDateTime),
      endTime: toLocalTimeInput(endDateTime ?? startDateTime),
    });
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!onSave) return;
    setIsSaving(true);
    try {
      await onSave(draft);
      setIsEditing(false);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-[2px] data-[state=open]:animate-[overlayShow_180ms_ease-out] data-[state=closed]:animate-[overlayHide_150ms_ease-in]" />
        <Dialog.Content
          className="fixed left-1/2 top-1/2 z-50 w-[92vw] max-w-[700px] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl bg-white shadow-[0_24px_70px_-12px_rgba(15,23,42,0.35)] focus:outline-none data-[state=open]:animate-[contentShow_200ms_cubic-bezier(0.16,1,0.3,1)] data-[state=closed]:animate-[contentHide_150ms_ease-in]"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          {/* accent strip tying the modal to the event color */}
          <div className="h-1.5 w-full" style={{ backgroundColor: event?.color || "#6366F1" }} />

          {/* Header */}
          <div className="flex items-start justify-between px-6 pb-2 pt-5">
            <Dialog.Title className="sr-only">{event?.title}</Dialog.Title>
            <Dialog.Description className="sr-only">
              Read-only details for {isTask ? "task" : "event"} {event?.title}
            </Dialog.Description>
            <div />{" "}
            {/* spacer to push actions right, title lives in content below */}
            <div className="flex items-center gap-0.5">
              {isEditable && !isEditing && (
                <IconButton label="Edit" onClick={onEdit ? onEdit : startEdit}>
                  <Pencil className="h-[18px] w-[18px]" />
                </IconButton>
              )}
              {isEditable && onDelete && !isEditing && (
                <IconButton label="Delete" onClick={onDelete}>
                  <Trash2 className="h-[18px] w-[18px]" />
                </IconButton>
              )}
              {onMore && (
                <IconButton label="More options" onClick={onMore}>
                  <MoreHorizontal className="h-[18px] w-[18px]" />
                </IconButton>
              )}
              <div className="mx-1 h-5 w-px bg-slate-200" />
              <Dialog.Close asChild>
                <button
                  type="button"
                  aria-label="Close"
                  className="flex h-9 w-9 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
                >
                  <X className="h-[18px] w-[18px]" />
                </button>
              </Dialog.Close>
            </div>
          </div>

          {/* Scrollable body */}
          <div className="max-h-[70vh] overflow-y-auto px-6 pb-6">
            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    Title
                  </label>
                  <input
                    value={draft.title}
                    onChange={(e) =>
                      setDraft((current) => ({
                        ...current,
                        title: e.target.value,
                      }))
                    }
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    Description
                  </label>
                  <textarea
                    value={draft.description}
                    onChange={(e) =>
                      setDraft((current) => ({
                        ...current,
                        description: e.target.value,
                      }))
                    }
                    rows={3}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
                  />
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">
                      Date
                    </label>
                    <input
                      type="date"
                      value={draft.date}
                      onChange={(e) =>
                        setDraft((current) => ({
                          ...current,
                          date: e.target.value,
                        }))
                      }
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">
                      Start time
                    </label>
                    <input
                      type="time"
                      value={draft.startTime}
                      onChange={(e) =>
                        setDraft((current) => ({
                          ...current,
                          startTime: e.target.value,
                        }))
                      }
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    End time
                  </label>
                  <input
                    type="time"
                    value={draft.endTime}
                    onChange={(e) =>
                      setDraft((current) => ({
                        ...current,
                        endTime: e.target.value,
                      }))
                    }
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
                  />
                </div>
              </div>
            ) : (
              <>
                {/* Title row */}
                <div className="flex items-start gap-3 pb-4">
                  <span
                    className="mt-2 h-3 w-3 shrink-0 rounded-[3px]"
                    style={{ backgroundColor: event?.color || "#6366F1" }}
                    aria-hidden
                  />
                  <h2 className="text-[22px] font-semibold leading-snug tracking-tight text-slate-900">
                    {event?.title}
                  </h2>
                </div>

                <Divider />

                {/* Date & time */}
                <Row icon={<Calendar className="h-[18px] w-[18px]" />}>
                  <div className="font-medium text-slate-800">
                    {formatDate(startDateTime)}
                  </div>
                  <div className="text-slate-500">
                    {event?.allDay
                      ? "All-day"
                      : endDateTime
                        ? `${formatTime(startDateTime)} – ${formatTime(endDateTime)}`
                        : formatTime(startDateTime)}
                  </div>
                </Row>

                <Divider />

                {/* Description */}
                <Row icon={<AlignLeft className="h-[18px] w-[18px]" />}>
                  {event?.description ? (
                    <p className="whitespace-pre-line text-left text-slate-700">
                      {event?.description}
                    </p>
                  ) : (
                    <p className="text-left italic text-slate-400">
                      No description provided.
                    </p>
                  )}
                </Row>

                {(event?.category || (isTask && (status || event?.priority))) && <Divider />}

                {/* Category */}
                {event?.category && (
                  <Row icon={<Tag className="h-[18px] w-[18px]" />}>
                    <span className="inline-flex items-center rounded-full bg-indigo-50 px-2.5 py-1 text-[13px] font-medium text-indigo-700 ring-1 ring-inset ring-indigo-600/20">
                      {event?.category}
                    </span>
                  </Row>
                )}

                {/* Task status */}
                {isTask && event?.status && (
                  <Row icon={<CheckCircle2 className="h-[18px] w-[18px]" />}>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[13px] font-medium ring-1 ring-inset ${statusStyles[event.status].className}`}
                    >
                      {statusStyles[event.status].label}
                    </span>
                  </Row>
                )}

                {/* Priority */}
                {isTask && event?.priority && (
                  <Row icon={<Flag className="h-[18px] w-[18px]" />}>
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[13px] font-medium ring-1 ring-inset ${priorityStyles[event?.priority].className}`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${priorityStyles[event?.priority].dot}`}
                      />
                      {priorityStyles[event?.priority].label} priority
                    </span>
                  </Row>
                )}

                {(event?.location || (!isTask && event?.guests?.length)) && <Divider />}

                {/* Location */}
                {event?.location && (
                  <Row icon={<MapPin className="h-[18px] w-[18px]" />}>
                    <span className="text-slate-700">{event?.location}</span>
                  </Row>
                )}

                {/* Guests — events only */}
                {!isTask && event?.guests && event?.guests.length > 0 && (
                  <Row icon={<Users className="h-[18px] w-[18px]" />}>
                    <div className="flex items-center gap-2">
                      <div className="flex -space-x-2">
                        {event?.guests.slice(0, 6).map((g, i) =>
                          g.avatarUrl ? (
                            <img
                              key={i}
                              src={g.avatarUrl}
                              alt={g.name}
                              title={g.name}
                              className="h-7 w-7 rounded-full ring-2 ring-white object-cover"
                            />
                          ) : (
                            <div
                              key={i}
                              title={g.name}
                              className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-200 text-[11px] font-medium text-slate-600 ring-2 ring-white"
                            >
                              {g.name
                                .split(" ")
                                .map((p) => p[0])
                                .slice(0, 2)
                                .join("")
                                .toUpperCase()}
                            </div>
                          ),
                        )}
                      </div>
                      {event?.guests.length > 6 && (
                        <span className="text-[13px] text-slate-500">
                          +{event?.guests.length - 6} more
                        </span>
                      )}
                      <span className="ml-1 text-[13px] text-slate-500">
                        {event?.guests.length} guest{event?.guests.length > 1 ? "s" : ""}
                      </span>
                    </div>
                  </Row>
                )}

                {(event?.reminder || event?.visibility || event?.repeat) && <Divider />}

                {/* Reminder */}
                {event?.reminder && (
                  <Row icon={<Bell className="h-[18px] w-[18px]" />}>
                    <span className="text-slate-700">{event?.reminder}</span>
                  </Row>
                )}

                {/* Visibility */}
                {event?.visibility && (
                  <Row icon={<Lock className="h-[18px] w-[18px]" />}>
                    <span className="text-slate-700">{event?.visibility}</span>
                  </Row>
                )}

                {/* Repeat */}
                {event?.repeat && (
                  <Row icon={<Repeat className="h-[18px] w-[18px]" />}>
                    <span className="text-slate-700">{event?.repeat}</span>
                  </Row>
                )}

                {(event?.createdAt || event?.updatedAt) && <Divider />}

                {/* Created / updated */}
                {(event?.createdAt || event?.updatedAt) && (
                  <Row icon={<Info className="h-[18px] w-[18px]" />}>
                    <div className="text-[13px] text-slate-500">
                      {event?.createdAt && (
                        <div>Created on {formatShort(event.createdAt)}</div>
                      )}
                      {event?.updatedAt && (
                        <div>Last updated {formatShort(event.updatedAt)}</div>
                      )}
                    </div>
                  </Row>
                )}
              </>
            )}
          </div>

          {/* Footer */}
          {isEditing ? (
            <div className="flex justify-end gap-2 border-t border-slate-100 bg-slate-50/60 px-6 py-4">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving}
                className="rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white"
              >
                {isSaving ? "Saving..." : "Save changes"}
              </button>
            </div>
          ) : isTask ? (
            <div className="flex justify-end border-t border-slate-100 bg-slate-50/60 px-6 py-4">
              <button
                type="button"
                disabled={isCompleted}
                onClick={onMarkCompleted}
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-[14px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
                  isCompleted
                    ? "cursor-not-allowed bg-emerald-50 text-emerald-600 ring-1 ring-inset ring-emerald-200"
                    : "bg-slate-900 text-white hover:bg-slate-800 focus-visible:ring-slate-400"
                }`}
              >
                <Check className="h-4 w-4" />
                {isCompleted ? "Completed" : "Mark as Completed"}
              </button>
            </div>
          ) : (
            onDuplicate && (
              <div className="flex justify-end border-t border-slate-100 bg-slate-50/60 px-6 py-4">
                <button
                  type="button"
                  onClick={onDuplicate}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-[14px] font-medium text-slate-700 transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
                >
                  <Copy className="h-4 w-4" />
                  Duplicate Event
                </button>
              </div>
            )
          )}
        </Dialog.Content>
      </Dialog.Portal>

      {/* Scoped keyframes for the radix data-state driven open/close animation */}
      <style>{`
        @keyframes overlayShow { from { opacity: 0 } to { opacity: 1 } }
        @keyframes overlayHide { from { opacity: 1 } to { opacity: 0 } }
        @keyframes contentShow {
          from { opacity: 0; transform: translate(-50%, -50%) scale(0.96); }
          to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        }
        @keyframes contentHide {
          from { opacity: 1; transform: translate(-50%, -50%) scale(1); }
          to { opacity: 0; transform: translate(-50%, -50%) scale(0.96); }
        }
      `}</style>
    </Dialog.Root>
  );
}
