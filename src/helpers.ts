import { Coordinates, ResultItem } from "./Types";

export const alpha = (a: { Descritivo: string }, b: { Descritivo: string }) =>
  a.Descritivo.localeCompare(b.Descritivo);

export const getColor = (value: number) => {
  const clampedValue = Math.min(1, Math.max(0, value));
  const hue = ((1 - clampedValue) * 120).toString(10);
  return ["hsl(", hue, ",100%,50%)"].join("");
};

export const formatNumber = (number: number) => parseFloat(number.toFixed(2));

export const getMedian = (items: ResultItem[]) => {
  if (!items.length) {
    return 0;
  }

  const total = items.reduce((accumulator, object) => {
    return accumulator + object.price!;
  }, 0);
  return formatNumber(total / items.length);
};

const toRadians = (value: number) => (value * Math.PI) / 180;

export const filterStationsByRadius = (
  items: ResultItem[],
  currentLocation: Coordinates | null,
  radiusKm: number
) => {
  if (!currentLocation || !radiusKm) {
    return items;
  }

  const earthRadiusKm = 6371;

  return items.filter((item) => {
    const latitudeDelta = toRadians(item.Latitude - currentLocation.lat);
    const longitudeDelta = toRadians(item.Longitude - currentLocation.lng);
    const currentLatitude = toRadians(currentLocation.lat);
    const itemLatitude = toRadians(item.Latitude);

    const a =
      Math.sin(latitudeDelta / 2) * Math.sin(latitudeDelta / 2) +
      Math.cos(currentLatitude) *
      Math.cos(itemLatitude) *
      Math.sin(longitudeDelta / 2) *
      Math.sin(longitudeDelta / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distanceKm = earthRadiusKm * c;

    return distanceKm <= radiusKm;
  });
};
