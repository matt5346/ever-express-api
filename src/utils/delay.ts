export const awaitDelay = async (time: number) =>
  new Promise((res) => setTimeout(res, time));
