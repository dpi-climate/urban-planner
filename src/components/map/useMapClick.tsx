import "./useMapClick.css"
import { useCallback, useEffect, useState } from "react"
import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"
import createEvStationIcon from "../../utils/EvStationIcon"
import { update } from "lodash"

interface ClickedLocation {
  lat: number
  lng: number
  elevation: number | null
}

interface UseMapClickProps {
  map: mapboxgl.Map | null
  clickedLocal: ClickedLocation | null
  setClickedLocal: React.Dispatch<React.SetStateAction<ClickedLocation | null>>
  updateRiskData: (ptIdx: number | [number, number], elevation: number | null) => void
}

const useMapClick = (props: UseMapClickProps) => {
  const { map, setClickedLocal, clickedLocal } = props
  const [marker, setMarker] = useState<mapboxgl.Marker | null>(null)

  const addClickEvent = useCallback(() => {
    if (!map) return

    const handleMapClick = (e: mapboxgl.MapMouseEvent) => {
      const { lng, lat } = e.lngLat

      let elevation: number | null | undefined = null
      if (map.queryTerrainElevation) {
        elevation = map.queryTerrainElevation(e.lngLat) ?? null
      }

      setClickedLocal({ lat, lng, elevation })
      props.updateRiskData([lat, lng], elevation)

      if (!marker) {
        const newMarker = new mapboxgl.Marker({
          // element: createCustomMarker(), // Use a custom element
          element: createEvStationIcon(),
        })
          .setLngLat([lng, lat])
          .addTo(map)

        setMarker(newMarker)
      } else {
        // Update the existing marker's position
        marker.setLngLat([lng, lat])
      }
    }

    map.on("click", handleMapClick)

    return () => {
      map.off("click", handleMapClick)
    }
  }, [map, marker, setClickedLocal])

  const cleanUpMarker = useCallback(() => {
    console.log(clickedLocal)
    if (clickedLocal === null && marker) {
      marker.remove()
      setMarker(null)
    }
  }, [clickedLocal, marker])

  useEffect(() => addClickEvent(), [addClickEvent])
  useEffect(() => cleanUpMarker(), [cleanUpMarker])
}

export default useMapClick
