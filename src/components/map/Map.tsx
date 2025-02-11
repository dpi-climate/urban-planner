import "./Map.css"

import React, { useRef, useState, useCallback, useEffect } from "react"
import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"

import useMapClick from "./useMapClick"
import SingleDeckOverlay from "./SingleDeckOverlay"
import useLayers from "./useLayers"
import { StationType } from "../../types-and-interfaces/types"


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
  
  socioVariable: string
  activeSection: "climate" | "socio"
  activeStations: StationType[]
  updateSocioLayer: (varIdx: number | null, sIdx: number | null) => void
  updateRiskData: (ptIdx: number | [number, number], elevation: number | null) => void
  setSocioInfo: React.Dispatch<
  React.SetStateAction<{ name: string; value: number}[]>
>

}

const Map: React.FC<IMap> = (props) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null)
  const [map, setMap] = useState<mapboxgl.Map | null>(null)
  const [currentZoom, setCurrentZoom] = useState<number>(props.zoom)
  const [currentBounds, setCurrentBounds] = useState({})

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
      // const bounds = mapInstance.getBounds()
      // setCurrentBounds(bounds)
      // HL {_sw: WL {lng: number, lat: number}, _ne: WL {lng: number, lat: number} }
    })

    // mapInstance.on('load', () => {
    //   // Slower zoom when using the mouse wheel (default ~1/100)
    //   mapInstance.scrollZoom.setWheelZoomRate(1 / 500); 
    //   // Slower zoom when using a trackpad (default ~1)
    //   mapInstance.scrollZoom.setZoomRate(0.2);         
    // });

    setMap(mapInstance)

    return () => mapInstance.remove()
  }, [])

  useEffect(() => startMap(), [startMap])

  // useMapClick({
  //   map,
  //   clickedLocal: props.clickedLocal,
  //   variable: props.variable,
  //   spatialLevel: props.spatialLevel,
  //   setClickedLocal: props.setClickedLocal,
  //   updateRiskData: props.updateRiskData
  // })

  const deckLayers = useLayers({
<<<<<<< HEAD
    activeStations: props.activeStations,
=======
    bounds: currentBounds,
>>>>>>> b667732 (gunicorn)
    variable: props.variable,
    year: props.year,
    spatialLevel: props.spatialLevel,
    activeSection: props.activeSection,
    setSpatialLevel: props.setSpatialLevel,
    socioVariable: props.socioVariable,
    zoom: currentZoom,
    showStations: props.showStations,
    opacity: props.opacity,
    boundOpacity: props.boundOpacity,
    boundaryId: props.boundaryId,
    updateRiskData: props.updateRiskData,
    setSocioInfo:props.setSocioInfo
  })

  return (
    <div className="map-container" ref={mapContainerRef}>
      {map && <SingleDeckOverlay map={map} layers={deckLayers} />}
    </div>
  )
}

export default Map
