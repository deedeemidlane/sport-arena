import { IField } from "@/types/Field";

export function formatPriceInVND(price: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
}

export function formatDate(dateString: string) {
  // Create a new Date object from the string
  const date = new Date(dateString);

  // Extract the day, month, and year from the date
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed
  const year = date.getFullYear();

  // Format the date as dd/mm/yyyy
  return `${day}/${month}/${year}`;
}

export function formatTime(dateString: string) {
  const date = new Date(dateString);

  // Extract hours, minutes, and seconds
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  // const seconds = String(date.getSeconds()).padStart(2, "0");

  // Format the time as hh:mm:ss
  return `${hours}:${minutes}`;
}

export function formatHour(hour: number) {
  return `${hour.toString().padStart(2, "0")}:00`;
}

export function getFullImageUrl(imageUrl: string) {
  return `https://res.cloudinary.com/${
    import.meta.env.VITE_CLOUD_NAME
  }/image/upload/${imageUrl}`;
}

export function getAverageRating(field: IField | undefined) {
  if (!field || field.reviews.length === 0) {
    return 0;
  }

  const averageRating =
    field.reviews.reduce((acc, slot) => acc + slot.rating, 0) /
    field.reviews.length;

  return parseFloat(averageRating.toFixed(1)); // Round to one decimal place
}
