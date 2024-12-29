// useLayers.ts
import { useEffect, useMemo, useState } from "react"
import { ScatterplotLayer, GeoJsonLayer } from "@deck.gl/layers"
import { Layer } from "@deck.gl/core"
import { DataLoader } from "../../data-loader/DataLoader"

interface IUseLayersParams {
  variable: string
  year: string
  spatialLevel: string 
  zoom: number
}

// Simplified data types
interface IPointData {
  positions: number[]
  colors: number[]
  length: number
  // any other fields you have
}

interface IPolygonData {
  tracts: Array<{
    GEOID: string
    average_value: number
    color: [number, number, number, number]
    geometry: GeoJSON.Geometry
  }>
}

export default function useLayers({
  variable,
  year,
  spatialLevel,
  zoom,
}: IUseLayersParams): Layer[] {
  const [pointData, setPointData] = useState<IPointData | null>(null)
  const [polygonData, setPolygonData] = useState<IPolygonData | null>(null)

  // --- Example fetch for the point data ---
  useEffect(() => {
    console.log("point useeffect", variable, year, spatialLevel)
    if (!variable || !year || spatialLevel !== "") return

    let isMounted = true;
    (async () => {
      try {
        const data = await DataLoader.getPointLayerData(variable, year, spatialLevel)
        if (!isMounted) return
        setPointData(data)
      } catch (error) {
        console.error("Error fetching point data:", error)
        if (isMounted) setPointData(null)
      }
    })()

    return () => {
      isMounted = false
    }
  }, [variable, year])

  // --- Example fetch for the polygon data ---
  useEffect(() => {
    if (!variable || !year || spatialLevel === null) return

    let isMounted = true;
    (async () => {
      try {
        const data = await DataLoader.getPointLayerData(variable, year, spatialLevel)
        if (!isMounted) return

        if (spatialLevel === "") {
          setPointData(data)

        } else if (spatialLevel === "ct") {
          setPolygonData(data)
        }


      } catch (error) {
        console.error("Error fetching polygon data:", error)
        if (isMounted) {
          if (spatialLevel === "") {
            setPointData(null)
  
          } else if (spatialLevel === "ct") {
            setPolygonData(null)
          }
        }
      }
    })()

    return () => {
      isMounted = false
    }
  }, [variable, year, spatialLevel])

  // Decide how large the points are
  const radiusScale = useMemo(() => {
    // Example logic
    if (zoom <= 6) return 1
    else if (zoom <= 10) return 0.5
    else if (zoom <= 12) return 0.25
    else if (zoom <= 14.5) return 0.1
    else if (zoom <= 17) return 0.05
    return 0.01
  }, [zoom])

  // Create the point layer
  const pointLayer = useMemo(() => {
    if (!pointData) return null

    return new ScatterplotLayer({
      id: `scatterplot-layer-${variable}-${year}`,
      data: {
        length: pointData.length,
        attributes: {
          getPosition: { value: new Float32Array(pointData.positions), size: 2 },
          getFillColor: { value: new Uint8Array(pointData.colors), size: 4 },
        },
      },
      getPosition: (d) => d.getPosition,
      getFillColor: (d) => d.getFillColor,
      getRadius: 500,
      radiusScale: radiusScale,
      radiusMinPixels: 1,
      radiusMaxPixels: 500,
      opacity: 1.0,
      pickable: false,
    })
  }, [pointData, radiusScale, variable, year])

  // Create the polygon layer
  const polygonLayer = useMemo(() => {
    if (!polygonData) return null
    console.log(polygonData)
    const geojson = {
      type: "FeatureCollection",
      features: polygonData.tracts.map((tract) => ({
        type: "Feature",
        properties: {
          GEOID: tract.GEOID,
          average_value: tract.average_value,
          color: tract.color,
        },
        geometry: tract.geometry,
      })),
    }

    return new GeoJsonLayer({
      id: `geojson-layer-${variable}-${year}`,
      data: geojson,
      filled: true,
      stroked: true,
      getFillColor: (f) => f.properties.color,
      getLineColor: [0, 0, 0, 255],
      lineWidthMinPixels: 1,
      pickable: false,
    })
  }, [polygonData, variable, year])

  // Return whichever layers we need
  // (If the user wants polygons, show the polygon layer otherwise show points)
  return useMemo(() => {
    if (spatialLevel === "ct" && polygonLayer) {
      return [polygonLayer]
    } else if (pointLayer) {
      return [pointLayer]
    }
    return []
  }, [spatialLevel, polygonLayer, pointLayer])
}
