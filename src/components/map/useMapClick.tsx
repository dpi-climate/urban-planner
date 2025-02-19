import "./useMapClick.css"
import { useCallback, useEffect, useState } from "react"
import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"
import {createLocationIcon} from "../../utils/Icons"
import * as turf from "@turf/turf"
import { DataLoader } from "../../data-loader/DataLoader"

interface ClickedLocation {
  lat: number
  lng: number
  elevation: number | null
}

interface UseMapClickProps {
  map: mapboxgl.Map | null
  clickedLocal: ClickedLocation | null
  variable: string | null
  spatialLevel: string
  setClickedLocal: React.Dispatch<React.SetStateAction<ClickedLocation | null>>
  updateRiskData: (ptIdx: number | [number, number], elevation: number | null) => void
}

const useMapClick = (props: UseMapClickProps) => {
  const { map, setClickedLocal, clickedLocal } = props
  const [marker, setMarker] = useState<mapboxgl.Marker | null>(null)
  const [clickBoundary, setClickBoundary] = useState(null)

  const fetchClickBoudary = useCallback(() => {
    (
      async () => {
        const b = await DataLoader.getMapClickBoudary()
        setClickBoundary(b)
      }
    )()
    

  },[])

  const addClickEvent = useCallback(() => {
    if (!map) return

    const handleMapClick = (e: mapboxgl.MapMouseEvent) => {
      const { lng, lat } = e.lngLat
      
      const clickedPoint = turf.point([lng, lat])
      
      // Add click boundary
      if(clickBoundary) {
        const illinoisPolygon = turf.featureCollection(clickBoundary.features)

        const isWithinIllinois = clickBoundary.features.some((feature) =>
          turf.booleanPointInPolygon(clickedPoint, feature as turf.Feature<turf.Polygon>)
        )
        
        if (!isWithinIllinois) {
          // alert("Please click within Illinois boundaries.")
          return
        }
      }
      // console.log(props.variable, props.spatialLevel, props.variable === "prcp" && props.spatialLevel === "pt")
      if(props.variable === "prcp" && props.spatialLevel === "pt") {
        let elevation: number | null | undefined = null
        
        if (map.queryTerrainElevation) {
          elevation = map.queryTerrainElevation(e.lngLat) ?? null
        }

        setClickedLocal({ lat, lng, elevation })
        // props.updateRiskData([lat, lng], elevation)
        props.updateRiskData(lat, lng)
          
        if (!marker) {
          const newMarker = new mapboxgl.Marker({
            // element: createCustomMarker(), // Use a custom element
            element: createLocationIcon()
            // element: createEvStationIcon(),
          })
            .setLngLat([lng, lat])
            .addTo(map)

            setMarker(newMarker)
        } else {
          // Update the existing marker's position
          marker.setLngLat([lng, lat])
        }
      } else {
        setClickedLocal(null)
        props.updateRiskData(null, null)
      }
    }

    map.on("click", handleMapClick)

    return () => {
      map.off("click", handleMapClick)
    }
  }, [map, props.variable, props.spatialLevel, marker, clickBoundary, setClickedLocal])

  const cleanUpMarker = useCallback(() => {
    if (clickedLocal === null && marker) {
      marker.remove()
      setMarker(null)
    }
  }, [clickedLocal, marker])

  useEffect(() => fetchClickBoudary(), [fetchClickBoudary])
  useEffect(() => addClickEvent(), [addClickEvent])
  useEffect(() => cleanUpMarker(), [cleanUpMarker])
}

export default useMapClick
