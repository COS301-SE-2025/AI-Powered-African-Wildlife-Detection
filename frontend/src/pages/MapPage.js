import React, {useEffect, useState} from 'react';
import { Container } from 'react-bootstrap';
import { MapContainer, TileLayer, Marker, LayersControl } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './MapPage.css';

const MapPage = () => {
  const [currentPosition, setCurrentPosition] = useState(null);  // user current location
  const defaultPosition  = [-25.8812222, 28.291611111111113]; //starting location - hardcoded for now

  delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentPosition([
            position.coords.latitude,
            position.coords.longitude
          ]);
        },
        (error) => {
          console.error("Geolocation error:", error);
        }
      );
    }
  }, []);

  return (
    <Container className="map-page">
      <MapContainer
        // center={currentPosition || defaultPosition}
        center={defaultPosition}  // change this later
        zoom={16}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}
        className='map-container'
      >
        <LayersControl position="topright">
          <LayersControl.BaseLayer name="Default">
            <TileLayer
              attribution='&copy; OpenStreetMap contributors' 
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer checked name="Satellite">
            <TileLayer
              attribution='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, etc.'
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            />
          </LayersControl.BaseLayer>
        </LayersControl>

        {defaultPosition && (
          <Marker position={defaultPosition} />
        )}

      </MapContainer>
    </Container>
  );
};

export default MapPage;
