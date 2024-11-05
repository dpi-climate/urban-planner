// MapClickHandler.tsx

import React, { useEffect, useRef, useState } from 'react'
import mapboxgl from 'mapbox-gl'

interface MapClickHandlerProps {
  map: mapboxgl.Map
  isAdding: boolean
  isRemoving: boolean
}

const MapClickHandler: React.FC<MapClickHandlerProps> = ({ map, isAdding, isRemoving }) => {
  const isAddListenerAttached = useRef(false)
  const [markers, setMarkers] = useState<mapboxgl.Marker[]>([])

  // Ref to store the current value of isRemoving
  const isRemovingRef = useRef(isRemoving)

  useEffect(() => {
    isRemovingRef.current = isRemoving
  }, [isRemoving])

  // Store the handleMapClick function in a ref
  const handleMapClickRef = useRef<(e: mapboxgl.MapMouseEvent) => void>()

  if (!handleMapClickRef.current) {
    handleMapClickRef.current = (e: mapboxgl.MapMouseEvent) => {
      const coordinates = e.lngLat

      const marker = new mapboxgl.Marker()
        .setLngLat(coordinates)
        .addTo(map)

      const markerElement = marker.getElement()

      markerElement.addEventListener('click', (event) => {
        // Always prevent map click when marker is clicked
        event.stopPropagation()

        if (isRemovingRef.current) {
          marker.remove()
          setMarkers((prevMarkers) => prevMarkers.filter((m) => m !== marker))
        }
      })

      setMarkers((prevMarkers) => [...prevMarkers, marker])
    }
  }

  useEffect(() => {
    if (!map) return

    const handleMapClick = handleMapClickRef.current!

    if (isAdding && !isAddListenerAttached.current) {
      map.on('click', handleMapClick)
      isAddListenerAttached.current = true
    } else if (!isAdding && isAddListenerAttached.current) {
      map.off('click', handleMapClick)
      isAddListenerAttached.current = false
    }

    // Cleanup on component unmount
    return () => {
      if (isAddListenerAttached.current) {
        map.off('click', handleMapClick)
        isAddListenerAttached.current = false
      }
    }
  }, [map, isAdding])

  return null // This component does not render anything
}

export default MapClickHandler
