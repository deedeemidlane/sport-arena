export const TIME_SLOTS = [
  "00:00",
  "01:30",
  "03:00",
  "04:30",
  "06:00",
  "07:30",
  "09:00",
  "10:30",
  "12:00",
  "13:30",
  "15:00",
  "16:30",
  "18:00",
  "19:30",
  "21:00",
  "22:30",
  "23:59",
];

export const getTimeIndex = (time: string) => {
  return TIME_SLOTS.indexOf(time);
};
