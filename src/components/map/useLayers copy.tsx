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
  ids: string[]
  values: number[]
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

  useEffect(() => {
    if (!variable || !year || spatialLevel === null) return

    let isMounted = true;
    (async () => {
      try {
        const data = await DataLoader.getPointLayerData(variable, year, spatialLevel)

        if (!isMounted) return

        if(spatialLevel === "") {
          setPolygonData(null)
          setPointData(data)
          
        } else if(spatialLevel === "ct") {
          setPointData(null)
          setPolygonData(data)

        }


      } catch (error) {
        console.error("Error fetching polygon data:", error)
        if (isMounted){
          setPointData(null)
          setPolygonData(null)
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
        ids: pointData.ids,
        values: pointData.values,
      },
      getPosition: (d) => d.getPosition,
      getFillColor: (d) => d.getFillColor,
      getRadius: 500,
      radiusScale: radiusScale,
      radiusMinPixels: 1,
      radiusMaxPixels: 500,
      opacity: 1.0,
      pickable: false,
      // onClick: (info) => {
          // // if (props.variable == "prcp" && info.index !== undefined && pointData) {
          // if (info.index !== undefined && pointData) {
          //   const id = pointData.ids[info.index] as number
          //   const value = pointData.values[info.index]
          //   alert(`Value: ${value} Id: ${id}`);
          //   // props.updateRiskData(id)
          // }
        // },
    })
  }, [pointData, radiusScale, variable, year])

  // Create the polygon layer
  const polygonLayer = useMemo(() => {

    if (!polygonData) return null

    function toGeoJSON(tractData) {
      return {
        type: "FeatureCollection",
        features: tractData.tracts.map((t) => ({
          type: "Feature",
          properties: {
            GEOID: t.GEOID,
            average_value: t.average_value,
            color: t.color,
          },
          geometry: t.geometry,
        })),
      };
    }
    
    return new GeoJsonLayer({
      id: `geojson-layer-${variable}-${year}`,
      data: toGeoJSON(polygonData), //geojson,
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
    } else if (spatialLevel === "" && pointLayer) {
      return [pointLayer]
    }
    return []
  }, [spatialLevel, polygonLayer, pointLayer])
}
