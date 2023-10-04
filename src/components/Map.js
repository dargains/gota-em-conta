import React from 'react'
import { GoogleMap, useLoadScript, MarkerF } from '@react-google-maps/api';
import icon from '../assets/icons/icon.svg'

const containerStyle = {
  width: '100%',
  height: '600px'
};

const defaultMapProps = {
  center: {
    lat: 38.706892,
    lng: -9.304544
  },
  zoom: 12
};

const MapItem = ({lat, lng, text}) => {
  return (
    <MarkerF position={{lat, lng}} label={text} icon={icon}/>
  )
}

function Map({items}) {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.MAPS_API_KEY
  })

  const [map, setMap] = React.useState(null)

  const onLoad = React.useCallback(function callback(map) {
    // todo calculate bounds
    const bounds = new window.google.maps.LatLngBounds(defaultMapProps.center);
    map.fitBounds(bounds);

    setMap(map)
  }, [])

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null)
  }, [])

  return isLoaded ? (
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={defaultMapProps.center}
        zoom={defaultMapProps.zoom}
        // onLoad={onLoad}
        onUnmount={onUnmount}
      >
        {items.map(item => <MapItem key={item.Id} lat={item.Latitude} lng={item.Longitude} text={item.Preco} />)}
      </GoogleMap>
  ) : <p>loading...</p>
}

export default React.memo(Map)