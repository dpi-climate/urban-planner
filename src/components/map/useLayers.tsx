import { useCallback, useEffect, useMemo, useState } from "react"
import { ScatterplotLayer, GeoJsonLayer, IconLayer } from "@deck.gl/layers"
import { Layer } from "@deck.gl/core"
import { DataLoader } from "../../data-loader/DataLoader"
// import wellknown from "wellknown";
import { StationType } from "../../types-and-interfaces/types";

interface IUseLayersParams {
  activeStations: StationType[]
  variable: string | null
  year: string
  spatialLevel: string
  zoom: number
  showStations: boolean
  opacity: number
  boundOpacity: number
  boundaryId: string
  activeSection: string,
  socioVariable: string,
  updateRiskData: (lat: number, lon: number, name: string) => void
  setSpatialLevel: React.Dispatch<
  React.SetStateAction<string>>

  setSocioInfo: React.Dispatch<
    React.SetStateAction<{ name: string; value: number}[]>>
}

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
    }[],
    properties: any
  }[]
  type: "FeatureCollection"
}

export default function useLayers({
  activeStations,
  variable,
  year,
  spatialLevel,
  zoom,
  showStations,
  opacity,
  boundOpacity,
  boundaryId,
  activeSection,
  setSocioInfo,
  setSpatialLevel,
  socioVariable,
  updateRiskData
}: IUseLayersParams): Layer[] {
  const [pointData, setPointData] = useState<IPointData | null>(null)
  const [polygonData, setPolygonData] = useState<IPolygonData | null>(null)
  const [stations, setStations] = useState<IStationFeature | null>(null)
  const [boundaryData, setBoundaryData] = useState<IBoundaryData | null>(null)

  const updateClimateLayers = useCallback(() => {

    // if (!variable) {
    //   setPointData(null)
    //   setPolygonData(null)

    //   return
    
    // } else if (activeSection !== "climate" || !year || spatialLevel === null) return

    if (activeSection !== "climate" || !year || spatialLevel === null) {
      return 
      
    } else if (!variable) {
      setPointData(null)
      setPolygonData(null)
      return 
    }

    let isMounted = true
    ;(async () => {
      try {
        // const newBounds = spatialLevel === "pt" ? null : (bounds._sw.lng, bounds._sw.lat, bounds._ne.lng, bounds._nw.lat)
        // (min_lng, min_lat, max_lng, max_lat)
        // const data = await DataLoader.getPointLayerData(variable, year, spatialLevel, newBounds)
        const data = await DataLoader.getPointLayerData(variable, year, spatialLevel, null)

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
  
  const updateSocioLayers = useCallback(() => {    
    if (activeSection !== "socio" ||  spatialLevel === null) {
      return
      
    } else if (!socioVariable) {
      setPointData(null)
      setPolygonData(null)

      return
    
    }
      
    let isMounted = true

    ;(async () => {
      try {

        const data = await DataLoader.getSocioLayer(socioVariable, spatialLevel)
        if (!isMounted || data === null) return

          setPointData(null)
          setPolygonData(data as IPolygonData)

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
  },[socioVariable, spatialLevel, setPolygonData])
  
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
  useEffect(() => updateSocioLayers(), [updateSocioLayers])

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

  const polygonLayerGjson = useMemo(() => {
    if (!polygonData) return null

    // console.log(polygonData)

    return new GeoJsonLayer({
      id: `geojson-layer-${variable}-${year}`,
      data: polygonData,
      filled: true,
      stroked: true,
      getFillColor: (f) => {
        const [r, g, b, a] = [255, 255, 255, 0]//f.properties.color
        return [r, g, b, Math.floor(a * opacity)]
      },
      getLineColor: () => [0, 0, 0, Math.floor(150 * boundOpacity)],
      lineWidthMinPixels: 1,
      pickable: true,
      highlightColor: [255, 255, 255, 128],
      autoHighlight: true, 
      onClick: (info) => { console.log(info.object.properties.value, info.object.properties.UNITID); handleClick(info.object.properties.UNITID)}
    })
  }, [polygonData, variable, year, opacity, boundOpacity])
  
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
      onClick: (info) => { console.log(info.object.properties.value, info.object.properties.UNITID); handleClick(info.object.properties.UNITID)}
    })
  }, [polygonData, variable, year, opacity, boundOpacity])

  const stationLayer = useMemo(() => {
    if (!showStations || !stations || !stations.features || !stations.features.length) {
      return null
    }

    return new IconLayer({
      id: 'station-layer',
      // data: stations.features,
      // data: stations.features.filter(feature => feature.properties["Type"] === "electric"),
      data: stations.features.filter(feature => activeStations.includes(feature.properties["Type"])),
  
      // iconAtlas: '/EV_Station.png',
      // iconMapping: {
      //   marker: { x: 0, y: 0, width: 900, height: 900, mask: false },
      // },
      getPosition: (feature) => feature.geometry.coordinates,

      // getIcon: () => 'marker',
      // getIcon: (feature) => {console.log(feature.properties); return {url: '/EV_Station.png', x: 0, y: 0, width: 900, height: 900, mask: false }},
      // getIcon: (feature) => {console.log(feature.properties); return {url: '/EV_Station.png', width: 50, height: 50 }},
      getIcon: (feature) => ({ 
        url: feature.properties["Type"] === "electric" 
          ? '/EV_Station.png'
          : feature.properties["Type"] === "biodiesel"
            ? '/biodiesel.png'
            : feature.properties["Type"] === "ethanol"
              ? '/ethanol.png'
              : feature.properties["Type"] === "cng"
                ? '/cng.png'
                : feature.properties["Type"] === "lng"
                  ? '/lng.png'
                  : feature.properties["Type"] === "lpg"
                    ? 'lpg.png'
                    : null
            ,
        width: 1000,
        height: 1000,
      }),
      getSize: () => 3,
      sizeScale: 14,
      // getSize: () => 3,
      // sizeScale: 14,
      pickable: true,
      onClick: (info) => {
        console.log("click")
        // console.log(info.object.geometry.coordinates)
        const name = info.object.properties["Station Name"]
        const lon = info.object.geometry.coordinates[0]
        const lat = info.object.geometry.coordinates[1]
        updateRiskData(lat, lon, name)
      },
    });
  }, [stations, showStations, activeStations]);

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
    // const unitInfo = await DataLoader.getSocioDataById(unitId, "ct")
    // setSocioInfo(unitInfo)
  }

  return useMemo(() => {
    const layers: Layer[] = []

    if (polygonLayer) {
      // layers.push(polygonLayer)
      layers.push(polygonLayer)
    }

    // if (polygonLayerGjson) {
    //   layers.push(polygonLayerGjson)
    // }

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
