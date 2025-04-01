export const getDaysAgo = (timestamp) => {
    const appliedDate = new Date(timestamp);
    const currentDate = new Date();
    const diffTime = currentDate - appliedDate;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "1 day ago";
    return `${diffDays} days ago`;
  };