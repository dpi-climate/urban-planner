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

  const [isAddingIcon, setIsAddingIcon] = useState<boolean>(false)
  const [isRemovingIcon, setIsRemovingIcon] = useState<boolean>(false)

  const startMap = useCallback(() => {
    if (!mapContainerRef.current) return

    const mapInstance = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: props.style,
      center: props.center,
      zoom: props.zoom,
    })

    setMap(mapInstance)

    return () => mapInstance.remove()
  }, [props.center, props.style, props.zoom])

  useEffect(() => startMap(), [startMap])

  return (
    <>
      <div style={{ padding: '10px' }}>
        <button onClick={() => {
          setIsAddingIcon(true)
          setIsRemovingIcon(false)
        }}>
          Add Icon
        </button>
        <button onClick={() => {
          setIsAddingIcon(false)
          setIsRemovingIcon(true)
        }}>
          Remove Icon
        </button>
        <button onClick={() => {
          setIsAddingIcon(false)
          setIsRemovingIcon(false)
        }}>
          Stop
        </button>
      </div>
      <div className="map-container" ref={mapContainerRef}>
        {map && (
          <>
            {/* <MapLayers map={map} geoFile={props.geoFile} /> */}
            <MapLayers map={map} />
            <MapClickHandler map={map} isAdding={isAddingIcon} isRemoving={isRemovingIcon} />
          </>
        )}
      </div>
    </>
  )
}

export default Map
