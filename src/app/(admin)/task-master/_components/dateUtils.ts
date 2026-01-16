// Force local date interpretation without timezone shifting
export function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return "";
  // Split YYYY-MM-DD and create date using local arguments
  // This prevents the "UTC Midnight" shift
  const parts = dateString.split("T")[0].split("-");
  if (parts.length !== 3) return dateString;

  const year = parseInt(parts[0]);
  const month = parseInt(parts[1]) - 1; // Months are 0-indexed
  const day = parseInt(parts[2]);

  const date = new Date(year, month, day);
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

// Get 'YYYY-MM-DD' for input values
export function toInputDate(dateString: string | null | undefined): string {
  if (!dateString) return "";
  return dateString.split("T")[0];
}

// Check urgency
export function getDaysUntil(dateString: string | null): number {
  if (!dateString) return 999;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const parts = dateString.split("T")[0].split("-");
  const due = new Date(
    parseInt(parts[0]),
    parseInt(parts[1]) - 1,
    parseInt(parts[2])
  );

  return Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}
