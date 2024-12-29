import { useEffect, useMemo, useState } from "react"
import { ScatterplotLayer, GeoJsonLayer, IconLayer } from "@deck.gl/layers"
import { Layer } from "@deck.gl/core"
import { DataLoader } from "../../data-loader/DataLoader"

interface IUseLayersParams {
  variable: string
  year: string
  spatialLevel: string
  zoom: number
  showStations: boolean
  opacity: number
}

// Simplified data types
interface IPointData {
  positions: number[]
  colors: number[]
  length: number
  ids: string[]
  values: number[]
}

interface IPolygonData {
  tracts: Array<{
    GEOID: string
    average_value: number
    color: [number, number, number, number]
    geometry: GeoJSON.Geometry
  }>
}

// If your stations are in a custom shape, adapt accordingly
interface IStationFeature {
  geometry: {
    type: 'Point'
    coordinates: [number, number]
  }
  properties: {
    stationName: string
    // other props
  }
}

export default function useLayers({
  variable,
  year,
  spatialLevel,
  zoom,
  showStations,
  opacity
}: IUseLayersParams): Layer[] {
  const [pointData, setPointData] = useState<IPointData | null>(null)
  const [polygonData, setPolygonData] = useState<IPolygonData | null>(null)

  // For demonstration, pretend we get stations from props or otherwise:
  // In a real scenario, pass them in as a prop or load them in a state, etc.
  const [stations, setStations] = useState<IStationFeature[]>([])

  useEffect(() => {
    // Example: load your stations from somewhere
    async function loadStations() {
      const stationData = await DataLoader.getStations()
      setStations(stationData)
    }

    loadStations()
  }, [])

  useEffect(() => {
    if (!variable || !year || spatialLevel === null) return

    let isMounted = true
    ;(async () => {
      try {
        const data = await DataLoader.getPointLayerData(variable, year, spatialLevel)
        if (!isMounted) return

        if (spatialLevel === "") {
          setPolygonData(null)
          setPointData(data)
        } else if (spatialLevel === "ct") {
          setPointData(null)
          setPolygonData(data)
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
  }, [variable, year, spatialLevel])

  // Decide how large the points are
  const radiusScale = useMemo(() => {
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
    })
  }, [pointData, radiusScale, variable, year])

  // Create the polygon layer
  const polygonLayer = useMemo(() => {
    if (!polygonData) return null

    function toGeoJSON(tractData: IPolygonData) {
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
      }
    }

    return new GeoJsonLayer({
      id: `geojson-layer-${variable}-${year}`,
      data: toGeoJSON(polygonData),
      filled: true,
      stroked: true,
      // getFillColor: (f) => f.properties.color,
      getFillColor: (f) => {
        const [r, g, b, a] = f.properties.color
        return [r, g, b, Math.floor(a * opacity)]
      },
      getLineColor: [0, 0, 0, 255],
      // opacity: opacity,
      lineWidthMinPixels: 1,
      pickable: false,
    })
  }, [polygonData, variable, year, opacity])

  const stationLayer = useMemo(() => {
    // 1. Safely check you have a FeatureCollection with non-empty `features`
    if (!showStations || !stations || !stations.features || !stations.features.length) {
      return null;
    }
  
    // 2. Create the IconLayer using `stations.features`
    return new IconLayer({
      id: 'station-layer',
      data: stations.features,
  
      // If you have a single PNG for all markers:
      iconAtlas: '/Electric_Charging_Station_Clean_Transparent.png',
      // Define how to crop your single icon from that PNG
      iconMapping: {
        marker: { x: 0, y: 0, width: 900, height: 900, mask: false },
      },
  
      // Accessors
      // geometry.coordinates should be [lon, lat]
      getPosition: (feature) => feature.geometry.coordinates,
      // If they are simple single-icon markers:
      getIcon: () => 'marker',
      // Adjust size as needed
      getSize: () => 4,
      sizeScale: 15,
  
      pickable: true,
      onClick: (info) => {
        // info.object will be your Feature, so you can access properties:
        if (info.object) {
          const stationName = info.object.properties?.stationName;
          alert(`Clicked on station: ${stationName}`);
        }
      },
    });
  }, [stations, showStations]);

  // Decide which layers to return
  return useMemo(() => {
    const layers: Layer[] = []

    // If polygons are showing at the 'ct' spatial level
    if (spatialLevel === "ct" && polygonLayer) {
      layers.push(polygonLayer)
    }
    // If points are showing at the '' (empty) spatial level
    else if (spatialLevel === "" && pointLayer) {
      layers.push(pointLayer)
    }

    // If we have stations, always place them on top
    if (stationLayer) {
      layers.push(stationLayer)
    }

    return layers
  }, [spatialLevel, polygonLayer, pointLayer, stationLayer])
}
