import React, { useEffect, useMemo, useState } from "react";
import { ScatterplotLayer, ScatterplotLayerProps } from "@deck.gl/layers";
import { MapboxOverlay } from "@deck.gl/mapbox";
import { DataLoader } from "../../data-loader/DataLoader";

interface IBinaryData {
  length: number;
  attributes: {
    getPosition: { value: Float32Array; size: number };
    getFillColor: { value: Uint8Array; size: number };
    // Removed getRadius to avoid conflict
  };
}

interface IPointLayerProps {
  map: mapboxgl.Map | null;
  opacity: number; // Should be between 0 and 1
  source: string;
  currentZoom: number; // Not needed in this approach
}

const PointLayer: React.FC<IPointLayerProps> = (props) => {
  const [binaryData, setBinaryData] = useState<IBinaryData | null>(null)

  const radiusScale = useMemo(() => {
    const baseScale = props.currentZoom <= 6
      ? 1
      : props.currentZoom <= 10
        ? 0.5
        : props.currentZoom <= 12
          ? 0.25
          : props.currentZoom <= 14.5
            ? 0.1
            : props.currentZoom <= 17
              ? 0.05
              : 0.01

      return baseScale
      
  }, [props.currentZoom]);

  useEffect(() => {
    if (!props.source) return;

    console.log(props.currentLayer)

    let isMounted = true;

    (async () => {
      try {
        const response = await DataLoader.getData(props.source);
        const data = response.data;

        if (!isMounted || !data) return;

        // Convert numeric arrays to typed arrays
        const positions = new Float32Array(data.positions);
        const colors = new Uint8Array(data.colors);

        const binary: IBinaryData = {
          length: data.length,
          attributes: {
            getPosition: { value: positions, size: 2 },
            getFillColor: { value: colors, size: 4 },
            // Removed getRadius
          },
        };

        setBinaryData(binary);
      } catch (err) {
        console.error("Error fetching binary data:", err);
        setBinaryData(null);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [props.source, props.currentLayer]);

  const layers = useMemo(() => {
    if (!binaryData) return [];
    console.log(radiusScale)
    return [
      new ScatterplotLayer({
        id: "scatterplot-layer",
        data: binaryData,
        // Corrected casting to ScatterplotLayerProps
        getPosition: "getPosition" as unknown as ScatterplotLayerProps<any>["getPosition"],
        getFillColor: "getFillColor" as unknown as ScatterplotLayerProps<any>["getFillColor"],
        // Use getRadius function via deck.gl's properties
        getRadius: 500, // Base radius (can be adjusted)
        radiusScale: radiusScale, // Overall scaling factor
        radiusMinPixels: 1, // Minimum pixel radius
        radiusMaxPixels: 500, // Maximum pixel radius
        opacity: props.opacity, // Layer opacity (0 to 1)
        pickable: false,
        // Optional: Enable auto highlighting on hover
        // autoHighlight: true,
        // Optional: Set blending mode if needed
        // blending: 1,
      }),
    ];
  }, [binaryData, props.opacity, radiusScale]);

  useEffect(() => {
    if (!props.map || layers.length === 0) return;

    // Create the MapboxOverlay and add it as a control to the map
    const overlay = new MapboxOverlay({ layers });
    props.map.addControl(overlay as unknown as mapboxgl.IControl);

    return () => {
      if (!props.map) return;
      props.map.removeControl(overlay as unknown as mapboxgl.IControl);
    };
  }, [props.map, layers]);

  return null;
};

export default PointLayer;
