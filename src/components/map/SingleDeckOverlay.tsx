import React, { useEffect, useRef } from "react"
import { MapboxOverlay } from "@deck.gl/mapbox"
import mapboxgl from "mapbox-gl"
import { Layer } from "@deck.gl/core"

interface ISingleDeckOverlayProps {
  map: mapboxgl.Map
  layers: Layer[] // array of Deck.gl layers
}

export default function SingleDeckOverlay({ map, layers }: ISingleDeckOverlayProps) {
  const overlayRef = useRef<MapboxOverlay | null>(null)

  useEffect(() => {
    if (!map) return

    // Create the overlay once
    if (!overlayRef.current) {
      overlayRef.current = new MapboxOverlay({
        layers, // initial layers
      })
      map.addControl(overlayRef.current as unknown as mapboxgl.IControl)
    }

    // Whenever layers change, update them
    if (overlayRef.current) {
      overlayRef.current.setProps({ layers })
    }

    // Do not remove the overlay on every re-render only if unmounted for good
    return () => {
      // If you want to remove the control completely when the component unmounts:
      // if (overlayRef.current) {
      //   map.removeControl(overlayRef.current as unknown as mapboxgl.IControl)
      // }
    }
  }, [map, layers])

  return null // This component doesn't render any DOM
}
