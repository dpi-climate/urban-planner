import React, { useEffect, useMemo, useState } from "react"
import { ScatterplotLayer, ScatterplotLayerProps  } from "@deck.gl/layers"
import { MapboxOverlay } from "@deck.gl/mapbox"
import { DataLoader } from "../../data-loader/DataLoader"

interface IBinaryData {
  length: number;
  attributes: {
    getPosition: { value: Float32Array; size: number };
    getFillColor: { value: Uint8Array; size: number };
    getRadius: { value: Float32Array; size: number };
  };
}

interface IPointLayerProps {
  map: mapboxgl.Map | null
  layerProp: string | null
  threshold: { value: number; color: string }[] | null
  opacity: number
  source: string | null
  currentZoom: number
}

const PointLayer: React.FC<IPointLayerProps> = (props) => {

  const [binaryData, setBinaryData] = useState<IBinaryData | null>(null)

  useEffect(() => {

    if (!props.source) return

    let isMounted = true;

    (async () => {
      if (!props.source) return

      try {
        const response = await DataLoader.getData(props.source)
        const data = response.data

        if (!isMounted || !data) return

        // Convert numeric arrays to typed arrays
        const positions = new Float32Array(data.positions)
        const colors = new Uint8Array(data.colors)
        const radii = new Float32Array(data.radii)

        const binary: IBinaryData = {
          length: data.length,
          attributes: {
            getPosition: { value: positions, size: 2 },
            getFillColor: { value: colors, size: 4 },
            getRadius: { value: radii, size: 1 },
          },
        }

        setBinaryData(binary)

      } catch (err) {
        console.error("Error fetching binary data:", err)
        setBinaryData(null)

      }
    })()

    return () => {
      isMounted = false
    }

  },[props.source])

  const layers = useMemo(() => {
    if (!binaryData) return [];
    return [
      new ScatterplotLayer({
        id: "scatterplot-layer",
        data: binaryData,
        getPosition: "getPosition" as unknown as ScatterplotLayerProps<any>["getPosition"],
        getFillColor: "getFillColor" as unknown as ScatterplotLayerProps<any>["getFillColor"],
        getRadius: "getRadius" as unknown as ScatterplotLayerProps<any>["getRadius"],
        // radiusMinPixels,
        // radiusMaxPixels,
        // opacity: opacity / 255,
        pickable: false,
      }),
    ];
  }, [binaryData, props.opacity])

  useEffect(() => {
    if (!props.map || layers.length === 0) return

    // Create the MapboxOverlay and add it as a control to the map
    const overlay = new MapboxOverlay({ layers });
    props.map.addControl(overlay as unknown as mapboxgl.IControl)

    return () => {
      if (!props.map) return
      props.map.removeControl(overlay as unknown as mapboxgl.IControl)
    };
  }, [props.map, layers])

  return null
}

export default PointLayer