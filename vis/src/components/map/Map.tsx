import "./Map.css"
import React, { useRef, useState, useCallback, useEffect } from "react"
import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"
import MapLayers from "./MapLayers"
import MapClickHandler from "./MapClickHandler"

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN as string

interface IMap {
  style: string
  center: [number, number]
  zoom: number
  geoFile: string

}

const Map: React.FC<IMap> = (props) => {

  const mapContainerRef = useRef<HTMLDivElement | null>(null)
  const [map, setMap] = useState<mapboxgl.Map | null>(null)

  const startMap = useCallback(() => {
    if (!mapContainerRef.current) return

    // Initialize map only once
    const mapInstance = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: props.style,
      center: props.center,
      zoom: props.zoom
    })

    setMap(mapInstance)

    // Cleanup function to remove the map on component unmount
    return () => mapInstance.remove()

  },[])

  useEffect(() => startMap(), [startMap])

  return (
    <div className="map-container" ref={mapContainerRef}>
      { map && 
        <>
          <MapLayers map={map} geoFile={props.geoFile}/>
          {/* <MapClickHandler map={map} /> */}
        </>      
      }

    </div>
  ) 


}

export default Map