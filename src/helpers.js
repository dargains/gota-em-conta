export const alpha = (a, b) => a.Descritivo.localeCompare(b.Descritivo);

export const getColor = (value) => {
  var hue = ((1 - value) * 120).toString(10);
  return ["hsl(", hue, ",100%,50%)"].join("");
};

export const formatNumber = (number) => parseFloat(number.toFixed(2));

export const getMedian = (items) => {
  const total = items.reduce((accumulator, object) => {
    return accumulator + object.price;
  }, 0);
  return formatNumber(total / items.length);
};
