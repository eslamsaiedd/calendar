
export function Categories() {
    return (
        <>
        <div className=' dark:text-white border-t border-[var(--border-light)] dark:border-[var(--border)] mt-2 pt-1'>
            <h3 className="font-bold mb-1.5">Categories</h3>
            <div className=" w-full flex items-center flex-wrap gap-1.5">
            {["Work", "Personal", "Holidays", "Travel"].map(label => (
                <button key={label}
                className={`p-1 rounded-2xl text-sm hover:bg-[var(--bg-primary-light)] dark:hover:bg-gray-700 transition
                    ${label === "Work" ? "bg-[var(--event-blue)] text-white" : label === "Personal" ? "bg-[var(--event-purple)] text-white" : label === "Holidays" ? "bg-[var(--event-teal)] text-white" : label === "Travel" ? "bg-[var(--event-amber)] text-white" : "bg-[var(--border-light)] dark:bg-[var(--bg-card)] dark:text-[var(--text-primary-dark)]"}
                `}>
                {label}
                </button>

            ))}
            </div>
        </div>
        </>
    )

}