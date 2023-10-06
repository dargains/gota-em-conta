import React from "react";
import { MarkerF } from "@react-google-maps/api";

const MapItem = ({ lat, lng, text, color }) => {
  const icon = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="64" height="24" viewBox="0 0 64 24" xml:space="preserve" fill="${color}"><rect width="64" height="24" style="stroke-width:3;stroke:rgb(0,0,0)" /></svg>`;
  return <MarkerF position={{ lat, lng }} label={text} icon={icon} />;
};

export default MapItem;
