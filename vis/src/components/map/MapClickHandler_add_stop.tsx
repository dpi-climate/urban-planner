import "./MapClickHandler.css"

import React, { useEffect, useRef } from 'react'
import mapboxgl from 'mapbox-gl'

interface MapClickHandlerProps {
  map: mapboxgl.Map
  isActive: boolean
}

const MapClickHandler: React.FC<MapClickHandlerProps> = ({ map, isActive }) => {
  const isListenerAttached = useRef(false)

  // Store the handleClick function in a ref to maintain the same reference
  const handleClickRef = useRef<(e: mapboxgl.MapMouseEvent) => void>()

  if (!handleClickRef.current) {
    // // Default Icon
    // handleClickRef.current = (e: mapboxgl.MapMouseEvent) => {
    //   const coordinates = e.lngLat

    //   // Create a new marker and add it to the map
    //   new mapboxgl.Marker()
    //     .setLngLat(coordinates)
    //     .addTo(map)
    // }

    handleClickRef.current = (e: mapboxgl.MapMouseEvent) => {
      const coordinates = e.lngLat
  
      // Create a DOM element for the custom marker
      const el = document.createElement('div')
      el.className = 'custom-marker'
      el.style.backgroundImage = 'url(/electric-station-white.png)'
      el.style.width = '32px'
      el.style.height = '32px'
      el.style.backgroundSize = 'cover'
  
      // Create the marker with the custom element
      new mapboxgl.Marker(el)
        .setLngLat(coordinates)
        .addTo(map)
    }
  }

  useEffect(() => {
    if (!map) return

    const handleClick = handleClickRef.current!

    if (isActive && !isListenerAttached.current) {
      // Add click event listener to the map
      map.on('click', handleClick)
      isListenerAttached.current = true
    } else if (!isActive && isListenerAttached.current) {
      // Remove click event listener
      map.off('click', handleClick)
      isListenerAttached.current = false
    }

    // Cleanup on component unmount
    return () => {
      if (isListenerAttached.current) {
        map.off('click', handleClick)
        isListenerAttached.current = false
      }
    }
  }, [map, isActive])

  return null // This component does not render anything
}

export default MapClickHandler
