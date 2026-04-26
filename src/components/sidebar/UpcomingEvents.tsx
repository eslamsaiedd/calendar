export function UpcomingEvents() {
    return (
        <>
        <div className='flex flex-col gap-1 dark:text-white border-t border-[var(--border-light)] dark:border-[var(--border)] mt-2 pt-1'>
            <h3 className="font-bold">Upcoming Events</h3>
            <ul>
                <li className="flex items-center">
                    <div className='w-2.5 h-2.5 bg-[var(--event-blue)] rounded-full mr-1'></div>
                    Client meeting <div className="text-[var(--text-secondary-light)] dark:text-[var(--text-secondary-dark)]"> {" "} - 10:00 AM</div>
                </li>
                <li className="flex items-center">
                    <div className='w-2.5 h-2.5 bg-[var(--event-purple)] rounded-full mr-1'></div>
                    Design review {" "} <div className="text-[var(--text-secondary-light)] dark:text-[var(--text-secondary-dark)]">  - 1:00 PM</div>
                </li>
            </ul>
        </div>

        </>
    )
}