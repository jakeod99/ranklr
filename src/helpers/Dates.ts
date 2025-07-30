export const today = () => {
  const today_arr = new Date().toLocaleDateString('en-US', { timeZone: 'America/New_York' }).split("/");
  const today = `${today_arr[2]}-${today_arr[0].padStart(2, "0")}-${today_arr[1].padStart(2, "0")}`;
  return today
}
