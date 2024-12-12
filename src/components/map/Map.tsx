import "./Map.css"
import React, { useRef, useState, useCallback, useEffect } from "react"
import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"
import PointLayer from "./PointLayer"

const stops = [
  { value: 0, color: "#FFFFFF" },
  { value: 76.2, color: "#E0F3DB" },
  { value: 127, color: "#C2E699" },
  { value: 203.2, color: "#78C679" },
  { value: 279.4, color: "#31A354" },
  { value: 330.2, color: "#006837" },
  { value: 406.4, color: "#FFEDA0" },
  { value: 457.2, color: "#FED976" },
  { value: 533.4, color: "#FEB24C" },
  { value: 609.6, color: "#FD8D3C" },
  { value: 660.4, color: "#FC4E2A" },
  { value: 736.6, color: "#E31A1C" },
  { value: 812.8, color: "#BD0026" },
  { value: 863.6, color: "#800026" },
  { value: 939.8, color: "#54278F" },
  { value: 990.6, color: "#756BB1" },
  { value: 1066.8, color: "#9E9AC8" },
  { value: 1143, color: "#CBC9E2" },
  { value: 1193.8, color: "#DADAEB" },
  { value: 1270, color: "#F2F0F7" },
] 

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN as string

interface IMap {
  style: string
  center: [number, number]
  zoom: number
  year: string
  climateVariable: string
  source: string | null
  layerProp: string | null
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
          climateVariable={props.climateVariable}
          year={props.layerProp}
          opacity={opacity}
          stops={stops}
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
