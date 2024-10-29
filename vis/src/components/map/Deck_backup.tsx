import "./Map.css"
import React, { useCallback, useEffect, useRef, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

import { FeatureCollection, Geometry } from 'geojson';
import { MapboxOverlay } from '@deck.gl/mapbox'

import { ContourLayer } from '@deck.gl/aggregation-layers';


mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN as string

const MapDec = () => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [geojsonData, setGeojsonData] = useState<FeatureCollection<Geometry> | null>(null)

  const populateMapbox = useCallback(() => {
    if (!mapRef.current || !geojsonData) return
  
    mapRef.current.addSource('temperature', {
      type: 'geojson',
      data: geojsonData
    });
  
    mapRef.current.addLayer({
      'id': 'temperature-heat',
      'type': 'heatmap',
      'source': 'temperature',
      'maxzoom': 9,
      'paint': {
        // Increase the heatmap weight based on temperature
        'heatmap-weight': [
          'interpolate',
          ['linear'],
          ['get', 'temperature'],
          0, 0,
          23, 15  // Adjust based on your temperature range
        ],
        // Modify heatmap color to create discrete steps
        'heatmap-color': [
          'step',
          ['heatmap-density'],
          'rgba(33,102,172,0)', // Base color
          0.2, 'rgb(103,169,207)',
          0.4, 'rgb(209,229,240)',
          0.6, 'rgb(253,219,199)',
          0.8, 'rgb(239,138,98)',
          1, 'rgb(178,24,43)'
        ],
        // Adjust the heatmap radius by zoom level
        'heatmap-radius': [
          'interpolate',
          ['linear'],
          ['zoom'],
          0, 2,
          9, 20
        ],
        // Keep heatmap opacity constant
        'heatmap-opacity': 1,
      }
    });
  }, [geojsonData]);
  
  
  const populateMap = useCallback(() => {

    if (!mapRef.current || !geojsonData) return;

    // Create the Deck.gl ContourLayer
    const deckOverlay = new MapboxOverlay({
      interleaved: true,
      layers: [
        new ContourLayer({
          id: 'contour-layer',
          data: geojsonData.features,
          getPosition: d => d.geometry.coordinates,
          getWeight: d => d.properties.temperature,
          contours: [
            { threshold: [0, 10], color: [255, 255, 178], strokeWidth: 0 },
            { threshold: [10, 20], color: [254, 204, 92], strokeWidth: 0 },
            { threshold: [20, 30], color: [253, 141, 60], strokeWidth: 0 },
            { threshold: [30, 40], color: [240, 59, 32], strokeWidth: 0 },
            { threshold: [40, 50], color: [189, 0, 38], strokeWidth: 0 },
          ],
          aggregation: 'MEAN',
          cellSize: 50000, // Adjust based on data density
        }),
      ],
    });

    mapRef.current.addControl(deckOverlay);

  },[geojsonData])
  
  
  const populateMapPoints = useCallback(() => {
    if (!mapRef.current || !geojsonData) return

    mapRef.current.addSource('temperature', {
      type: 'geojson',
      data: geojsonData // Replace with your tileset ID
    })

    mapRef.current.addLayer({
      'id': 'temperature-heat',
      'type': 'heatmap',
      'source': 'temperature',
      'maxzoom': 9,
      'paint': {
          // Increase the heatmap weight based on temperature
          'heatmap-weight': [
              'interpolate',
              ['linear'],
              ['get', 'temperature'],
              0, 0,
              40, 1  // Adjust based on your temperature range
          ],
          // Color ramp for heatmap
          'heatmap-color': [
              'interpolate',
              ['linear'],
              ['heatmap-density'],
              0, 'rgba(33,102,172,0)',
              0.2, 'rgb(103,169,207)',
              0.4, 'rgb(209,229,240)',
              0.6, 'rgb(253,219,199)',
              0.8, 'rgb(239,138,98)',
              1, 'rgb(178,24,43)'
          ],
          // Adjust the heatmap radius by zoom level
          'heatmap-radius': [
              'interpolate',
              ['linear'],
              ['zoom'],
              0, 2,
              9, 20
          ],
          // Transition from heatmap to circle layer by zoom level
          'heatmap-opacity': [
              'interpolate',
              ['linear'],
              ['zoom'],
              7, 1,
              9, 0
          ],
      }
    });

  },[geojsonData])
  
  
  const startMap = useCallback(() => {
    if (!mapContainerRef.current) return

    // Initialize map only once
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/light-v9',
      center: [-98.20, 38.96],
      zoom: 3,
    })

    // Cleanup function to remove the map on component unmount
    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
      }
    }

  },[])

  
  useEffect(() => {
    fetch('/temperature.geojson')
      .then(response => response.json())
      .then(data => setGeojsonData(data))
      .catch(error => console.error('Error fetching data:', error));
  }, [])
  useEffect(() => startMap(), [startMap])
  useEffect(() => populateMap(), [populateMap])


  return (
    <div
      className="map-container"
      ref={mapContainerRef}
    ></div>
  );
};

export default MapDec;
