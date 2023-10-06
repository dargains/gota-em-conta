import React, { useState, useEffect, useCallback, memo } from "react";
import { GoogleMap, useLoadScript } from "@react-google-maps/api";
import MapItem from "./MapItem";

function getColor(value) {
  var hue = ((1 - value) * 120).toString(10);
  return ["hsl(", hue, ",100%,50%)"].join("");
}

function Map({ items }) {
  const [map, setMap] = useState(null);
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_MAPS_API_KEY,
  });

  const onLoad = useCallback(function callback(map) {
    const bounds = new window.google.maps.LatLngBounds();
    items.map((item) => {
      bounds.extend({
        lat: item.Latitude,
        lng: item.Longitude,
      });
    });
    map.fitBounds(bounds);

    setMap(map);
  }, []);

  const onUnmount = useCallback(function callback(map) {
    setMap(null);
  }, []);

  const renderMarkers = () =>
    items.map(({ Id, Latitude, Longitude, Preco }, index) => (
      <MapItem
        key={Id}
        lat={Latitude}
        lng={Longitude}
        text={Preco}
        color={getColor((index + 1) / items.length)}
      />
    ));

  useEffect(() => {
    if (map) {
      const bounds = new window.google.maps.LatLngBounds();
      items.map((item) => {
        bounds.extend({
          lat: item.Latitude,
          lng: item.Longitude,
        });
      });
      map.fitBounds(bounds);
    }
  }, [items]);

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={{
        width: "100%",
        height: "800px",
      }}
      onLoad={onLoad}
      onUnmount={onUnmount}
    >
      {renderMarkers()}
    </GoogleMap>
  ) : (
    <p>A carregar mapa...</p>
  );
}

export default memo(Map);
