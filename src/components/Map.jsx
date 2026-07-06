import React, { useState, useEffect, useCallback, memo } from "react";
import { CircleF, GoogleMap, useLoadScript } from "@react-google-maps/api";
import MapItem from "./MapItem";
import CurrentLocation from "./CurrentLocation";
import { getColor } from "../helpers";

const googleMapsApiKey = process.env.REACT_APP_MAPS_API_KEY;

function Map({ items, currentLocation, radiusKm }) {
  const [map, setMap] = useState(null);

  const { isLoaded } = useLoadScript({ googleMapsApiKey });

  const fitBounds = useCallback(
    (mapInstance) => {
      const bounds = new window.google.maps.LatLngBounds();

      items.forEach((item) => {
        bounds.extend({
          lat: item.Latitude,
          lng: item.Longitude,
        });
      });

      if (currentLocation) {
        bounds.extend(currentLocation);
      }

      if (items.length > 0 || currentLocation) {
        mapInstance.fitBounds(bounds);
      }
    },
    [currentLocation, items]
  );

  const onLoad = useCallback(
    function callback(mapInstance) {
      fitBounds(mapInstance);
      setMap(mapInstance);
    },
    [fitBounds]
  );

  const onUnmount = useCallback(function callback() {
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
      fitBounds(map);
    }
  }, [fitBounds, map]);

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
        <>
          <CurrentLocation lat={currentLocation.lat} lng={currentLocation.lng} />
          <CircleF
            center={currentLocation}
            radius={radiusKm * 1000}
            options={{
              strokeColor: "#2563eb",
              strokeOpacity: 0.8,
              strokeWeight: 2,
              fillColor: "#2563eb",
              fillOpacity: 0.15,
              clickable: false,
              editable: false,
            }}
          />
        </>
      ) : null}
      {renderMarkers()}
    </GoogleMap>
  ) : (
    <p>A carregar mapa...</p>
  );
}

export default memo(Map);
