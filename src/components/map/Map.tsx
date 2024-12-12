import "./Map.css"
import React, { useRef, useState, useCallback, useEffect } from "react"
import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"
import PointLayer from "./PointLayer"

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN as string

interface IMap {
  style: string
  center: [number, number]
  zoom: number
  source: string | null
  layerProp: string | null
  threshold: {value: number, color: string}[] | null
}

const Map: React.FC<IMap> = (props) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null)
  const [map, setMap] = useState<mapboxgl.Map | null>(null) 
  const [opacity, setOpacity] = useState<number>(255) 

  const startMap = useCallback(() => {
    if (!mapContainerRef.current) return

    const mapInstance = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: props.style,
      center: props.center,
      zoom: props.zoom
    })

    // Once the map loads, set up terrain if you have a DEM source in your style
    mapInstance.on('load', () => {
      // If needed, add a DEM source and set the terrain:
      mapInstance.addSource('my-terrain-source', {
        "type": "raster-dem",
        "url": "mapbox://mapbox.terrain-rgb",
        "tileSize": 512,
        "maxzoom": 14
      });
      mapInstance.setTerrain({ source: 'my-terrain-source' });
    });

    setMap(mapInstance)

    return () => mapInstance.remove()

  },[])

  useEffect(() => startMap(), [startMap])

  // Add a click event to get lat/lon and elevation
  useEffect(() => {
    if (!map) return

    map.on('click', (e) => {
      const { lng, lat } = e.lngLat

      let elevation: number | null | undefined = null

      // queryTerrainElevation returns elevation in meters if a terrain is set
      if (map.queryTerrainElevation) {
        elevation = map.queryTerrainElevation(e.lngLat) ?? null  // meters
      }

      console.log('Clicked location:', { lat, lng, elevation })
    })

    return () => {
      if (map) {
        map.off('click', () => {})
      }
    }
  }, [map])

  const renderLayers = () => {
    return (
      <>
        <PointLayer
          map={map}
          layerProp={props.layerProp}
          opacity={opacity}
          threshold={props.threshold}
          source={props.source}
        />
      </>
    )
  }
  
  return (
    <div className="map-container" ref={mapContainerRef}>
      {map && renderLayers()}
    </div>
  )
}

export default Map
