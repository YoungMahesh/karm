export const currTime = () => Math.ceil(Date.now() / 1000);
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
export const secondsToHours1 = (seconds: number): [number, number, number] => {
  const hoursRemaining = Math.floor(seconds / 60 / 60);
  const minutesRemaining = Math.floor(
    (seconds - hoursRemaining * 60 * 60) / 60
  );
  const secondsRemaining =
    seconds - hoursRemaining * 60 * 60 - minutesRemaining * 60;
  return [hoursRemaining, minutesRemaining, secondsRemaining];
};

export const wait = async (seconds: number) =>
  new Promise((resolve) => setTimeout(resolve, seconds * 1000));

export const secondsToDate = (seconds: number) => {
  const date = new Date(seconds * 1000);
  const month = date.toLocaleString("default", { month: "short" });
  return `${date.getDate()}-${month}-${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`;
};

export const itemsPerPage = 5;
