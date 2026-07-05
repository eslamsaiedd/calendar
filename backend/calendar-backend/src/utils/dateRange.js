/**
 * Returns a [start, end) Date range for a single calendar day.
 */
function dayRange(dateStr) {
  const start = new Date(dateStr);
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(end.getDate() + 1);
  return { start, end };
}

/**
 * Returns a [start, end) Date range for a calendar month (1-12).
 */
function monthRange(month, year) {
  const start = new Date(year, month - 1, 1, 0, 0, 0, 0);
  const end = new Date(year, month, 1, 0, 0, 0, 0);
  return { start, end };
}

/**
 * Returns a [start, end) Date range for an ISO-8601 week number within a year.
 * Week 1 is the week containing the year's first Thursday; weeks start Monday.
 */
function weekRange(week, year) {
  // Find Jan 4th, which is always in ISO week 1
  const jan4 = new Date(year, 0, 4);
  const jan4Day = jan4.getDay() || 7; // Sunday=0 -> 7
  const week1Monday = new Date(jan4);
  week1Monday.setDate(jan4.getDate() - jan4Day + 1);

  const start = new Date(week1Monday);
  start.setDate(start.getDate() + (week - 1) * 7);
  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setDate(end.getDate() + 7);

  return { start, end };
}

module.exports = { dayRange, monthRange, weekRange };
