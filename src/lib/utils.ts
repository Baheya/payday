export const transformDate = (date: string) => {
  const datePartsArray =
    date &&
    new Intl.DateTimeFormat("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).formatToParts(new Date(date));
  const day =
    datePartsArray &&
    datePartsArray.find((parts) => parts.type === "day")?.value;
  const month =
    datePartsArray &&
    datePartsArray.find((parts) => parts.type === "month")?.value;
  const year =
    datePartsArray &&
    datePartsArray.find((parts) => parts.type === "year")?.value;
  return `${day} ${month} ${year}`;
};
