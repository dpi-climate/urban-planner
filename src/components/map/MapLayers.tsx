import React, { useCallback, useEffect } from 'react'
import { Feature, FeatureCollection, Geometry, MultiPolygon } from 'geojson'
import * as d3 from 'd3-contour'
import { scaleLinear } from 'd3-scale'
// import mapboxgl from 'mapbox-gl'

const lonRange = [-98.0, -95.0]
const latRange = [38.0, 40.0]

const MapWithContours = ({ map }: {map: mapboxgl.Map | null}) => {
  useEffect(() => {
    if (!map) return

    // const rows = 160
    // const columns = 220
    const rows = 160
    const columns = 220
    const temperatureGrid = Array.from({ length: rows }, () =>
      Array.from({ length: columns }, () => Math.round(Math.random() * 15) + 15) // Values from 15 to 30
    )
    console.log(temperatureGrid)
    const lonRange = [-98.0, -95.0]
    const latRange = [38.0, 40.0]

    // Wait for the map's style to load before adding the contours
    map.on('style.load', () => {
      // Define scales to map grid coordinates to longitude and latitude
      const xScale = scaleLinear()
        .domain([0, temperatureGrid[0].length - 1])  // Grid width
        .range(lonRange)                            // Longitude range

      const yScale = scaleLinear()
        .domain([0, temperatureGrid.length - 1])     // Grid height
        .range(latRange)                            // Latitude range

      // Generate contour paths using d3.contours
      const contours = d3.contours()
        .size([temperatureGrid[0].length, temperatureGrid.length])  // Grid dimensions
        .thresholds([15, 18, 21, 24, 27, 30])                       // Define thresholds
        (temperatureGrid.flat())                                   // Flatten 2D array to 1D

      // Convert contours to GeoJSON format
      const contourFeatures: Feature<MultiPolygon, { value: number }>[] = contours.map(contour => ({
        type: "Feature",
        properties: { value: contour.value },
        geometry: {
          type: "MultiPolygon",
          coordinates: contour.coordinates.map(polygon =>
            polygon.map(ring =>
              ring.map(([x, y]) => [xScale(x), yScale(y)])   // Convert grid to lon/lat
            )
          )
        }
      }))
      
      const geojson: FeatureCollection<MultiPolygon, { value: number }> = {
        type: "FeatureCollection",
        features: contourFeatures
      }
      
      // Add GeoJSON as a source in Mapbox
      if (!map.getSource('contours')) {
        map.addSource('contours', {
          type: 'geojson',
          data: geojson
        })
      }

      // Add a layer to style the contours
      if (!map.getLayer('contours')) {
        map.addLayer({
          id: 'contours',
          type: 'fill',
          source: 'contours',
          paint: {
            'fill-color': [
              'interpolate',
              ['linear'],
              ['get', 'value'],
              15, '#ffffb2',
              18, '#fecb5c',
              21, '#fd8d3c',
              24, '#f03b20',
              27, '#bd0026'
            ],
            'fill-opacity': 0.6
          }
        })
      }
    })

    // Cleanup on component unmount
    return () => {
      if (map.getLayer('contours')) map.removeLayer('contours')
      if (map.getSource('contours')) map.removeSource('contours')
    }
  }, [map])

  return null
}

export default MapWithContours
