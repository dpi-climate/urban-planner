// MapClickHandler.tsx

import React, { useEffect } from "react"
import mapboxgl from "mapbox-gl"

interface MapClickHandlerProps {
  map: mapboxgl.Map
}

const MapClickHandler: React.FC<MapClickHandlerProps> = ({ map }) => {
  useEffect(() => {
    if (!map) return

    const handleClick = (e: mapboxgl.MapMouseEvent) => {
      // Get the coordinates of the click event
      const coordinates = e.lngLat

      // Create a new marker and add it to the map
      new mapboxgl.Marker()
        .setLngLat(coordinates)
        .addTo(map)
    }

    // Add click event listener to the map
    map.on("click", handleClick)

    // Clean up on component unmount
    return () => {
      map.off("click", handleClick)
    }
  }, [map])

  return null // This component does not render anything
}

export default MapClickHandler
