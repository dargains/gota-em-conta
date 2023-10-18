import React, { useState, useEffect, useCallback, memo } from "react";
import { GoogleMap, useLoadScript } from "@react-google-maps/api";
import MapItem from "./MapItem";
import CurrentLocation from "./CurrentLocation";
import { getColor } from "../helpers";

const googleMapsApiKey = process.env.REACT_APP_MAPS_API_KEY;

function Map({ items, currentLocation }) {
  const [map, setMap] = useState(null);

  const { isLoaded } = useLoadScript({ googleMapsApiKey });

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
        color={getColor(index / items.length)}
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
      {currentLocation ? (
        <CurrentLocation lat={currentLocation.lat} lng={currentLocation.lng} />
      ) : null}
      {renderMarkers()}
    </GoogleMap>
  ) : (
    <p>A carregar mapa...</p>
  );
}

export default memo(Map);
