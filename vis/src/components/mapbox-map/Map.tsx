import "./Map.css"
import React, { useRef } from "react"
import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN as string


const Map = () => {

  const mapContainerRef = useRef<HTMLDivElement | null>(null)

  return <div id="map-container" ref={mapContainerRef}> Map </div>

}

export default Map