// Format the time in seconds as mm:ss
export function formatMMSS(seconds: number): string {
  // Calculate the remaining time in minutes and seconds
  const min = Math.floor(seconds / 60);
  const sec = seconds % 60;

  // Add leading zeros to minutes and seconds if they are less than 2 digits long
  const formattedMinutes = min < 10 ? `0${min}` : min;
  const formattedSeconds = sec < 10 ? `0${sec}` : sec;

  // Format the remaining time as mm:ss
  const formattedRemainingTime = `${formattedMinutes}:${formattedSeconds}`;

  return formattedRemainingTime;
}

// Format the time in seconds as HHh MMmin SSs
export function formatHHMMSS(seconds: number): string {
  // Calculate the remaining time in hours, minutes and seconds
  const hours = Math.floor(seconds / 3600);
  const min = Math.floor((seconds % 3600) / 60);
  const sec = seconds % 60;

  // Format the remaining time as HHh MMmin SSs
  return `${hours}h ${min}min ${sec}s`;
}
