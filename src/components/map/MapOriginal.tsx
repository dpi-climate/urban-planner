import "./Map.css"
import React, { useRef, useState, useCallback, useEffect, Dispatch, SetStateAction } from "react"
import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN as string

interface IMap {
  style: string
  center: [number, number]
  zoom: number
  source: string | null
  layerProp: string | null
  threshold: { value: number; color: string }[] | null
  setClickedLocal: Dispatch<SetStateAction<{ lat: number; lng: number; elevation: number | null } | null>>
  clickedLocal: { lat: number; lng: number; elevation: number | null } | null // Added to track the state of clicked location
}

const Map: React.FC<IMap> = (props) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null)
  const [map, setMap] = useState<mapboxgl.Map | null>(null)
  const [marker, setMarker] = useState<mapboxgl.Marker | null>(null)

  const startMap = useCallback(() => {
    if (!mapContainerRef.current) return

    const mapInstance = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: props.style,
      center: props.center,
      zoom: props.zoom,
    })

    // Set up terrain on map load
    mapInstance.on("load", () => {
      mapInstance.addSource("my-terrain-source", {
        type: "raster-dem",
        url: "mapbox://mapbox.terrain-rgb",
        tileSize: 512,
        maxzoom: 14,
      })
      mapInstance.setTerrain({ source: "my-terrain-source" })
    })

    setMap(mapInstance)

    return () => mapInstance.remove()
  }, [])

  useEffect(() => startMap(), [startMap])

  // Add a click event to get lat/lon and elevation, and place a marker
  useEffect(() => {
    if (!map) return;
  
    const handleMapClick = (e: mapboxgl.MapMouseEvent) => {
      const { lng, lat } = e.lngLat;
  
      let elevation: number | null | undefined = null;
      if (map.queryTerrainElevation) {
        elevation = map.queryTerrainElevation(e.lngLat) ?? null;
      }
  
      props.setClickedLocal({ lat, lng, elevation });
  
      // Remove the previous marker if it exists
      if (marker) {
        marker.remove();
      }
  
      // // Create a custom HTML element for the red pin
      // const redPin = document.createElement("div");
      // redPin.className = "red-pin";
  
      // Add a new marker with the custom element
      // const newMarker = new mapboxgl.Marker({ element: redPin })
      const newMarker = new mapboxgl.Marker()
        .setLngLat([lng, lat])
        .addTo(map);
  
      setMarker(newMarker);
    };
  
    map.on("click", handleMapClick);
  
    return () => {
      map.off("click", handleMapClick);
    };
  }, [map, marker, props]);
  

  // Remove the marker if clickedLocal becomes null
  useEffect(() => {
    if (props.clickedLocal === null && marker) {
      marker.remove()
      setMarker(null)
    }
  }, [props.clickedLocal, marker])

  const renderLayers = () => {
    return (
      <>
        {/* Additional layers can be rendered here */}
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
