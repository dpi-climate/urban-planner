import "./Map.css"

import React, { useRef, useState, useCallback, useEffect } from "react"
import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"

// import useMapClick from "./useMapClick"
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
  showStations: boolean
  opacity: number
  boundOpacity: number
  colorScheme: any
  setClickedLocal: React.Dispatch<
    React.SetStateAction<{ lat: number; lng: number; elevation: number | null } | null>
  >
  clickedLocal: { lat: number; lng: number; elevation: number | null } | null
  boundaryId: string
  
  socioVariable: string
  activeSection: "climate" | "socio"
  activeStations: StationType[]
  setDomain: React.Dispatch<React.SetStateAction<[number, number] | null>>
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
  // const [currentBounds, setCurrentBounds] = useState({})
  const [spatialLevel, setSpatialLevel] = useState<string>("pt")


  const startMap = useCallback(() => {
    if (!mapContainerRef.current) return

    const mapInstance = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: props.style,
      center: props.center,
      zoom: props.zoom,
      minZoom: 6
    })

    mapInstance.on("zoom", () => {
      setCurrentZoom(mapInstance.getZoom())
      // const bounds = mapInstance.getBounds()
      // setCurrentBounds(bounds)
      // HL {_sw: WL {lng: number, lat: number}, _ne: WL {lng: number, lat: number} }
    })

    setMap(mapInstance)

    return () => mapInstance.remove()
  }, [])

  const updateSpatialLevel = useCallback(() => {
    // if (!props.variable && !props.year && ! spatialLevel === null) return
    // if (!props.variable && !props.year && !props.socioVariable) return

    ;(async () => {
      try {

        let newSpatialLevel = "bg"

        if (currentZoom < 6.6) {
          newSpatialLevel = "pt"
        
        } else if (currentZoom < 7.8){
          newSpatialLevel = "co"
        
        } else if(currentZoom < 10) {

          newSpatialLevel = "ct"
        
        } else if(currentZoom < 12) {
          newSpatialLevel = "bg"
        }

        if(newSpatialLevel !== spatialLevel) {
          setSpatialLevel(newSpatialLevel)
          
        }

      } catch (error) {
        console.error("Error fetching polygon data:", error)
      }
    })()


  },[currentZoom, spatialLevel])

  useEffect(() => startMap(), [startMap])
  useEffect(() => updateSpatialLevel(), [updateSpatialLevel])

  const deckLayers = useLayers({
    setDomain: props.setDomain,
    activeStations: props.activeStations,
    variable: props.variable,
    year: props.year,
    spatialLevel: spatialLevel,
    activeSection: props.activeSection,
    setSpatialLevel: setSpatialLevel,
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
