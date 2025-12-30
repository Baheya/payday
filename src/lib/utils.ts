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

export const setCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    currencyDisplay: "narrowSymbol",
  }).format(amount);
};

export const getPreviousMonthISOString = () => {
  const currentMonth = new Date().getMonth();
  const previousMonth = currentMonth === 1 ? 12 : currentMonth - 1;
  return new Date(new Date().setMonth(previousMonth)).toISOString();
};

export const includes = <T extends U, U>(
  coll: ReadonlyArray<T>,
  el: U,
): el is T => {
  return coll.includes(el as T);
};
