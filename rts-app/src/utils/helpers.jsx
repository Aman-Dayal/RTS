export const getFormattedDateTime = (timestamp) => {
  const appliedDate = new Date(timestamp);
  const currentDate = new Date();

  const diffTime = currentDate - appliedDate;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  // Format date and time
  const options = { year: "numeric", month: "short", day: "numeric", hour: "numeric", minute: "numeric", hour12: true };
  const formattedDate = appliedDate.toLocaleString("en-US", options);

  if (diffDays === 0) return `Today at ${appliedDate.toLocaleTimeString("en-US", { hour: "numeric", minute: "numeric", hour12: true })}`;
  if (diffDays === 1) return `Yesterday at ${appliedDate.toLocaleTimeString("en-US", { hour: "numeric", minute: "numeric", hour12: true })}`;
  
  return formattedDate; // Example: "Mar 30, 2025, 2:45 PM"
};
