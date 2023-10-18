import { ResultItem } from "./Types";

export const alpha = (a: { Descritivo: string }, b: { Descritivo: string }) =>
  a.Descritivo.localeCompare(b.Descritivo);

export const getColor = (value: number) => {
  var hue = ((1 - value) * 120).toString(10);
  return ["hsl(", hue, ",100%,50%)"].join("");
};

export const formatNumber = (number: number) => parseFloat(number.toFixed(2));

export const getMedian = (items: ResultItem[]) => {
  const total = items.reduce((accumulator, object) => {
    return accumulator + object.price!;
  }, 0);
  return formatNumber(total / items.length);
};
