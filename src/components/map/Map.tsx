import "./Map.css"

import React, { useRef, useState, useCallback, useEffect } from "react"
import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"

import useMapClick from "./useMapClick"
import SingleDeckOverlay from "./SingleDeckOverlay"
import useLayers from "./useLayers"


mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN as string

interface IMap {
  style: string
  center: [number, number]
  zoom: number
  variable: string | null
  year: string
  spatialLevel: any
  showStations: boolean
  opacity: number
  boundOpacity: number
  setClickedLocal: React.Dispatch<
    React.SetStateAction<{ lat: number; lng: number; elevation: number | null } | null>
  >
  clickedLocal: { lat: number; lng: number; elevation: number | null } | null
  boundaryId: string
  updateRiskData: (ptIdx: number | [number, number], elevation: number | null) => void
  setSocioInfo: React.Dispatch<
  React.SetStateAction<{ name: string; value: number}[]>
>

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

    // mapInstance.on("load", () => {
    //   mapInstance.addSource("my-terrain-source", {
    //     type: "raster-dem",
    //     url: "mapbox://mapbox.terrain-rgb",
    //     tileSize: 512,
    //     maxzoom: 14,
    //   })
    //   mapInstance.setTerrain({ source: "my-terrain-source" })
    // })

    mapInstance.on("zoom", () => {
      setCurrentZoom(mapInstance.getZoom())
    })

    setMap(mapInstance)

    return () => mapInstance.remove()
  }, [])

  useEffect(() => startMap(), [startMap])

  useMapClick({
    map,
    clickedLocal: props.clickedLocal,
    variable: props.variable,
    spatialLevel: props.spatialLevel,
    setClickedLocal: props.setClickedLocal,
    updateRiskData: props.updateRiskData
  })

  const deckLayers = useLayers({
    variable: props.variable,
    year: props.year,
    spatialLevel: props.spatialLevel,
    zoom: currentZoom,
    showStations: props.showStations,
    opacity: props.opacity,
    boundOpacity: props.boundOpacity,
    boundaryId: props.boundaryId,
    setSocioInfo:props.setSocioInfo
  })

  return (
    <div className="map-container" ref={mapContainerRef}>
      {map && <SingleDeckOverlay map={map} layers={deckLayers} />}
    </div>
  )
}

export default Map
