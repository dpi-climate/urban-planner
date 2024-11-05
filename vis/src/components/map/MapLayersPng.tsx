import { useEffect, useCallback } from "react"
import { BitmapLayer } from '@deck.gl/layers';
import { MapboxOverlay } from '@deck.gl/mapbox';

const MapLayers = ({ map }) => {
  const populateMap = useCallback(() => {
    if (!map) return;

    // Define the exact bounds for the image overlay
    // const bounds = [
    //   [-98.0, 38.0],  // Bottom-left corner (longitude, latitude)
    //   [-95.0, 40.0]   // Top-right corner (longitude, latitude)
    // ];

    const bounds = [-98.0, 38.0, -95.0, 40.0];

    const bitmapLayer = new BitmapLayer({
      id: 'bitmap-layer',
      bounds: bounds,
      image: './temperature_contour.png',
      opacity: 0.6,  // Adjust opacity if needed
    });

    const deckOverlay = new MapboxOverlay({
      interleaved: true,
      layers: [bitmapLayer]
    });

    map.addControl(deckOverlay);
  }, [map]);

  useEffect(() => {
    populateMap();
  }, [populateMap]);

  return null;
};

export default MapLayers;
