/**
 * Format date to Australian format (DD/MM/YYYY)
 * @param dateString - Date string in various formats (YYYY-MM-DD, Date object, etc.)
 * @param includeTime - Whether to include time (HH:MM) in the output
 * @returns Formatted date string in DD/MM/YYYY format
 */
export function formatDateAU(
  dateString: string | Date,
  includeTime: boolean = false,
): string {
  const date =
    typeof dateString === "string" ? new Date(dateString) : dateString;

  if (isNaN(date.getTime())) {
    return dateString.toString(); // Return original if invalid date
  }

  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();

  let formatted = `${day}/${month}/${year}`;

  if (includeTime) {
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    formatted += ` ${hours}:${minutes}`;
  }

  return formatted;
}

/**
 * Parse date string in YYYY-MM-DD format and convert to Australian format
 * @param dateString - Date string in YYYY-MM-DD format
 * @returns Formatted date string in DD/MM/YYYY format
 */
export function parseAndFormatDate(dateString: string): string {
  // Handle YYYY-MM-DD format
  if (/^\d{4}-\d{2}-\d{2}/.test(dateString)) {
    const [year, month, day] = dateString.split(/[-T\s]/);
    return `${day}/${month}/${year}`;
  }

  // Fallback to Date object parsing
  return formatDateAU(dateString);
}

/**
 * Parse date string with time (YYYY-MM-DD HH:MM) and convert to Australian format
 * @param dateString - Date string in YYYY-MM-DD HH:MM format
 * @returns Formatted date string in DD/MM/YYYY HH:MM format
 */
export function parseAndFormatDateTime(dateString: string): string {
  // Handle YYYY-MM-DD HH:MM format
  const match = dateString.match(/^(\d{4})-(\d{2})-(\d{2})\s+(\d{2}):(\d{2})/);
  if (match) {
    const [, year, month, day, hours, minutes] = match;
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  }

  // Fallback to Date object parsing
  return formatDateAU(dateString, true);
}

/**
 * Convert month name format (e.g., "Jan 15, 2025") to Australian format (DD/MM/YYYY)
 * @param dateString - Date string in "MMM DD, YYYY" format
 * @returns Formatted date string in DD/MM/YYYY format
 */
export function convertMonthNameToAU(dateString: string): string {
  const months: { [key: string]: string } = {
    Jan: "01",
    Feb: "02",
    Mar: "03",
    Apr: "04",
    May: "05",
    Jun: "06",
    Jul: "07",
    Aug: "08",
    Sep: "09",
    Oct: "10",
    Nov: "11",
    Dec: "12",
  };

  const match = dateString.match(/(\w+)\s+(\d+),\s+(\d{4})/);
  if (match) {
    const [, monthName, day, year] = match;
    const month = months[monthName] || "01";
    const dayPadded = day.padStart(2, "0");
    return `${dayPadded}/${month}/${year}`;
  }

  // Fallback to Date object parsing
  return formatDateAU(dateString);
}
