export const alpha = (a, b) => a.Descritivo.localeCompare(b.Descritivo);

export const getColor = (value) => {
  var hue = ((1 - value) * 120).toString(10);
  return ["hsl(", hue, ",100%,50%)"].join("");
};

export const formatNumber = (number) => parseFloat(number.toFixed(2));
