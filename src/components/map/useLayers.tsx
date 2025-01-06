import { useCallback, useEffect, useMemo, useState } from "react"
import { ScatterplotLayer, GeoJsonLayer, IconLayer } from "@deck.gl/layers"
import { Layer } from "@deck.gl/core"
import { DataLoader } from "../../data-loader/DataLoader"

interface IUseLayersParams {
  variable: string | null
  year: string
  spatialLevel: string
  zoom: number
  showStations: boolean
  opacity: number
  boundOpacity: number
  boundaryId: string
  setSocioInfo: React.Dispatch<
    React.SetStateAction<{ name: string; value: number}[]>>
}

// Simplified data types
interface IPointData {
  positions: number[]
  // colors: number[]
  colors: Uint8Array
  length: number
  ids: string[]
  values: number[]
}

interface IPolygonData {
  features: Array<{
    UNITID: string
    value: number
    color: [number, number, number, number]
    geometry: GeoJSON.Geometry
  }>
}

interface IBoundaryData {
  features: Array<{
    UNITID: string
    geometry: GeoJSON.Geometry
  }>
}

// If your stations are in a custom shape, adapt accordingly
interface IStationFeature {
  // geometry: {
  //   type: 'Point'
  //   coordinates: [number, number]
  // }
  // properties: {
  //   stationName: string
  //   // other props
  // }
  // features: any
  features: {
    geometry: {
      type: 'Point',
      coordinates: [number, number]
    }[]
  }[]
  type: "FeatureCollection"
}

export default function useLayers({
  variable,
  year,
  spatialLevel,
  zoom,
  showStations,
  opacity,
  boundOpacity,
  boundaryId,
  setSocioInfo
}: IUseLayersParams): Layer[] {
  const [pointData, setPointData] = useState<IPointData | null>(null)
  const [polygonData, setPolygonData] = useState<IPolygonData | null>(null)
  const [stations, setStations] = useState<IStationFeature | null>(null)
  const [boundaryData, setBoundaryData] = useState<IBoundaryData | null>(null)

  const updateClimateLayers = useCallback(() => {
    if (!variable || !year || spatialLevel === null) return

    let isMounted = true
    ;(async () => {
      try {
        const data = await DataLoader.getPointLayerData(variable, year, spatialLevel)
        console.log(data)
        if (!isMounted || data === null) return

        if (spatialLevel === "pt") {
          setPolygonData(null)
          setPointData(data as unknown as IPointData)

        // } else if (spatialLevel === "ct" || spatialLevel === "bg") {
        } else {
          setPointData(null)
          setPolygonData(data as IPolygonData)
        }
      } catch (error) {
        console.error("Error fetching polygon data:", error)
        if (isMounted) {
          setPointData(null)
          setPolygonData(null)
        }
      }
    })()

    return () => {
      isMounted = false
    }
  },[variable, year, spatialLevel, setPointData, setPolygonData])
  
  useEffect(() => {
    async function loadStations() {
      const stationData = await DataLoader.getStations()
      setStations(stationData)
    }

    loadStations()
  }, [])

  useEffect(() => {
    if (!boundaryId) return
    
    if (boundaryId === "None") {
      setBoundaryData(null)

    } else {
      let isMounted = true
  
      ;(async () => {
        try {
          const data = await DataLoader.getBoundary(boundaryId)

          if (!isMounted || data === null) return
          // console.log(data)
          setBoundaryData(data)

        } catch (error) {
          console.error("Error fetching polygon data:", error)
          
          if (isMounted) {
            setBoundaryData(null)
          }
        }
      })()

      return () => {
        isMounted = false
      }
    }

  },[boundaryId])

  useEffect(() => updateClimateLayers(), [updateClimateLayers])

  const radiusScale = useMemo(() => {
    if (zoom <= 6) return 1
    else if (zoom <= 10) return 0.5
    else if (zoom <= 12) return 0.25
    else if (zoom <= 14.5) return 0.1
    else if (zoom <= 17) return 0.05
    else if (zoom <= 20) return 0.01
    return 0.01
  }, [zoom])

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
        // ids: pointData.ids,
        values: pointData.values,
      },
      getPosition: (d) => d.getPosition,
      getFillColor: (d) => d.getFillColor,
      getRadius: 500,
      radiusScale: radiusScale,
      radiusMinPixels: 1,
      radiusMaxPixels: 500,
      opacity: opacity,
      pickable: false,
      // onClick: (info) => {
      //   const index = info.index;
      //   const value = pointData.values[index];
      //   const cl = pointData.colors[index];
      //   console.log(`Value: ${value !== null ? value : 'N/A'}, ${cl}`);
      // }
    })
  }, [pointData, radiusScale, variable, year, opacity])

  const polygonLayer = useMemo(() => {
    if (!polygonData) return null

    function toGeoJSON(tractData: IPolygonData): GeoJSON.FeatureCollection {
      return {
        type: "FeatureCollection",
        features: tractData.features.map((t) => ({
          type: "Feature",
          properties: {
            UNITID: t.UNITID,
            value: t.value,
            color: t.color,
          },
          geometry: t.geometry,
        })),
      }
    }

    return new GeoJsonLayer({
      id: `geojson-layer-${variable}-${year}`,
      data: toGeoJSON(polygonData),
      filled: true,
      stroked: true,
      getFillColor: (f) => {
        const [r, g, b, a] = f.properties.color
        return [r, g, b, Math.floor(a * opacity)]
      },
      getLineColor: () => [0, 0, 0, Math.floor(150 * boundOpacity)],
      lineWidthMinPixels: 1,
      pickable: true,
      highlightColor: [255, 255, 255, 128],
      autoHighlight: true, 
      onClick: (info) => { handleClick(info.object.properties.UNITID)}
    })
  }, [polygonData, variable, year, opacity, boundOpacity])

  const stationLayer = useMemo(() => {
    if (!showStations || !stations || !stations.features || !stations.features.length) {
      return null
    }

    return new IconLayer({
      id: 'station-layer',
      data: stations.features,
  
      iconAtlas: '/Electric_Charging_Station_Clean_Transparent.png',
      iconMapping: {
        marker: { x: 0, y: 0, width: 900, height: 900, mask: false },
      },
      getPosition: (feature) => feature.geometry.coordinates,

      getIcon: () => 'marker',
      getSize: () => 4,
      sizeScale: 15,
      pickable: false,
      // onClick: (info) => {
      //   // info.object will be your Feature, so you can access properties:
      //   if (info.object) {
      //     const stationName = info.object.properties?.stationName;
      //     alert(`Clicked on station: ${stationName}`);
      //   }
      // },
    });
  }, [stations, showStations]);

  const boundaryLayer = useMemo(() => {
    if (!boundaryData) return null

    function toGeoJSON(tractData: IPolygonData): GeoJSON.FeatureCollection {
      return {
        type: "FeatureCollection",
        features: tractData.features.map((t) => ({
          type: "Feature",
          properties: {
            UNITID: t.UNITID,
          },
          geometry: t.geometry,
        })),
      }
    }

    return new GeoJsonLayer({
      id: `geojson-layer-${boundaryId}`,
      data: toGeoJSON(boundaryData),
      filled: true,
      getFillColor: () => [255, 255, 255, 0],
      stroked: true,
      getLineColor: () => [60, 60, 60, Math.floor(150 * boundOpacity)],
      lineWidthMinPixels: 1,
      pickable: boundaryId === "None",
      // highlightColor: [0, 255, 0, 128], // Green with transparency for hover highlight
      highlightColor: [255, 255, 255, 128],
      autoHighlight: boundaryId === "None",
      onClick: (info) => { handleClick(info.object.properties.UNITID)}

    })
  }, [boundaryData, boundaryId, boundOpacity])

  const handleClick = async (unitId: string) => {
    const unitInfo = await DataLoader.getSocioDataById(unitId, "ct")
    setSocioInfo(unitInfo)
  }

  return useMemo(() => {
    const layers: Layer[] = []

    // if (spatialLevel === "ct" && polygonLayer) {
    //   layers.push(polygonLayer)
    // }

    // else if (spatialLevel === "pt" && pointLayer) {
    //   layers.push(pointLayer)
    // }

    if (polygonLayer) {
      layers.push(polygonLayer)
    }

    else if (pointLayer) {
      layers.push(pointLayer)
    }

    if(boundaryLayer) {
      layers.push(boundaryLayer)
    }

    if (stationLayer) {
      layers.push(stationLayer)
    }


    return layers
  }, [spatialLevel, polygonLayer, pointLayer, stationLayer, boundaryLayer])
}
