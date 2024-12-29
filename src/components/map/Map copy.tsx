import "./Map.css"
import React, { useRef, useState, useCallback, useEffect } from "react"
import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"
import useMapClick from "./useMapClick" // Import the custom hook
import { Row, Col, Form, Dropdown, Button } from 'react-bootstrap'

import PointLayer from "./PointLayer"
import PolygonLayerComponent from "./PolygonLayer"

import ColorBar from "./ColorBar"
import ColorBarWrapper from "./ColorBarWrapper"

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN as string

interface IMap {
  style: string
  center: [number, number]
  zoom: number
  // source: string | null
  variable: string
  year: string
  // threshold: { value: number; color: string }[] | null
  setClickedLocal: React.Dispatch<
    React.SetStateAction<{ lat: number; lng: number; elevation: number | null } | null>
  >
  clickedLocal: { lat: number; lng: number; elevation: number | null } | null
  updateRiskData: (ptIdx: number | [number, number], elevation: number | null) => void

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

  useMapClick({
    map,
    clickedLocal: props.clickedLocal,
    setClickedLocal: props.setClickedLocal,
    updateRiskData: props.updateRiskData
  })

  const renderLayers = () => {
    console.log(props.spatialLevel)
    if(props.spatialLevel === "") {
      return <>
      <PointLayer
        map={map}
        variable={props.variable}
        year={props.year}
        opacity={1}
        zoom={currentZoom}
        // updateRiskData={props.updateRiskData}
      />
      </>
    }
  }

  const renderPolygonLayer = () => {
    console.log(props.spatialLevel)
    if(props.spatialLevel === "ct") {
      return (
        <PolygonLayerComponent
        map={map}
        variable={props.variable}
        year={props.year}
        opacity={1}
        zoom={currentZoom}
        spatialLevel={props.spatialLevel}
  
      />
      )
    }
  }

  return (
    <div className="map-container" ref={mapContainerRef}>
      {map && renderLayers()}
      {map && renderPolygonLayer()}
    </div>
  )
}

export default Map
