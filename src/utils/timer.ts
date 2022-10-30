export const currTime = () => Math.floor(Date.now() / 1000);
export const hoursToSeconds = (hours: number) => hours * 60 * 60;
export const secondsToHours = (seconds: number) => {
  const hoursRemaining = Math.floor(seconds / 60 / 60);
  const minutesRemaining = Math.floor(
    (seconds - hoursRemaining * 60 * 60) / 60
  );
  const secondsRemaining =
    seconds - hoursRemaining * 60 * 60 - minutesRemaining * 60;
  return `${hoursRemaining}h:${minutesRemaining}m:${secondsRemaining}s`;
};

export const wait = async (seconds: number) =>
  new Promise((resolve) => setTimeout(resolve, seconds * 1000));
