import React from "react";
import { MarkerF } from "@react-google-maps/api";
import icon from "../assets/icons/icon.svg";

const MapItem = ({ lat, lng, text }) => {
  return <MarkerF position={{ lat, lng }} label={text} icon={icon} />;
};

export default MapItem;
