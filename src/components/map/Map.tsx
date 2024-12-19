import "./Map.css"
import React, { useRef, useState, useCallback, useEffect } from "react"
import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"
import useMapClick from "./useMapClick" // Import the custom hook

import PointLayer from "./PointLayer"

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN as string

interface IMap {
  style: string
  center: [number, number]
  zoom: number
  // source: string | null
  source: string
  layerProp: string | null
  threshold: { value: number; color: string }[] | null
  setClickedLocal: React.Dispatch<
    React.SetStateAction<{ lat: number; lng: number; elevation: number | null } | null>
  >
  clickedLocal: { lat: number; lng: number; elevation: number | null } | null
  currentSource: {
    source: string | null,
    layerProp: string[] | null,
    threshold: {value: number, color: string}[] | null
    currentLayer: { varId: string , year: string }
  
  }
}

const Map: React.FC<IMap> = (props) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null)
  const [map, setMap] = useState<mapboxgl.Map | null>(null)
  const [currentZoom, setCurrentZoom] = useState<number>(props.zoom)

  const startMap = useCallback(() => {
    if (!mapContainerRef.current) return

    const mapInstance = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: props.style,
      center: props.center,
      zoom: props.zoom,
    })

    mapInstance.on("load", () => {
      mapInstance.addSource("my-terrain-source", {
        type: "raster-dem",
        url: "mapbox://mapbox.terrain-rgb",
        tileSize: 512,
        maxzoom: 14,
      })
      mapInstance.setTerrain({ source: "my-terrain-source" })
    })

    mapInstance.on("zoom", () => {
      setCurrentZoom(mapInstance.getZoom())
    })

    setMap(mapInstance)

    return () => mapInstance.remove()
  }, [])

  useEffect(() => startMap(), [startMap])

  // Use the custom hook for click and marker handling
  useMapClick({
    map,
    setClickedLocal: props.setClickedLocal,
    clickedLocal: props.clickedLocal,
  })

  const renderLayers = () => {
    return <>
    <PointLayer
      map={map}
      layerProp={props.layerProp}
      opacity={1}
      threshold={props.threshold}
      source={props.source}
      currentZoom={currentZoom}
      currentLayer={props.currentLayer}
    />
    </>
  }

  return (
    <div className="map-container" ref={mapContainerRef}>
      {map && renderLayers()}
    </div>
  )
}

export default Map
