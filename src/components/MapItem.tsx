import { useState } from "react";

import { InfoWindowF, MarkerF } from "@react-google-maps/api";

interface MapItemProps {
  lat: number;
  lng: number;
  text: string;
  color: string;
  stationName: string;
}

const MapItem = ({ lat, lng, text, color, stationName }: MapItemProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const icon = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="48" height="24" viewBox="0 0 48 24" xml:space="preserve" fill="${color}"><rect width="48" height="24" style="stroke-width:3;stroke:rgb(0,0,0)" /></svg>`;

  return (
    <>
      <MarkerF
        position={{ lat, lng }}
        label={text}
        icon={icon}
        onClick={() => setIsOpen(true)}
      />
      {isOpen ? (
        <InfoWindowF position={{ lat, lng }} onCloseClick={() => setIsOpen(false)}>
          <div>{stationName}</div>
        </InfoWindowF>
      ) : null}
    </>
  );
};

export default MapItem;
