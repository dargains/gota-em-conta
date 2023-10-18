import React from "react";

import { MarkerF } from "@react-google-maps/api";

interface Coordinates {
  lat: number;
  lng: number;
}

const CurrentLocation = ({ lat, lng }: Coordinates) => {
  const icon = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" viewBox="0 0 30 30" xml:space="preserve" width="30" height="30" ><circle r="10" cx="15" cy="15" fill="dodgerblue"/><circle r="14" cx="15" cy="15" fill="none" style="stroke-width: 2px; stroke: dodgerblue"/></svg>`;
  return <MarkerF position={{ lat, lng }} icon={icon} />;
};

export default CurrentLocation;
