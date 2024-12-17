import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { ScatterplotLayer } from "@deck.gl/layers";
import { MapboxOverlay } from "@deck.gl/mapbox";
import chroma from "chroma-js";
import { DataLoader } from "../../data-loader/DataLoader";
import { debounce } from "lodash";

interface IPointLayerProps {
  map: mapboxgl.Map | null;
  layerProp: string | null;
  threshold: { value: number; color: string }[] | null;
  opacity: number;
  source: string | null;
  currentSource: {
    source: string | null,
    layerProp: string[] | null,
    threshold: {value: number, color: string}[] | null
  
  }
}

const PointLayer: React.FC<IPointLayerProps> = (props) => {
  const [geojsonData, setGeojsonData] = useState<GeoJSON.FeatureCollection | null>(null);
  const overlayRef = useRef<MapboxOverlay | null>(null);

  const fetchData = useCallback(
    debounce(async () => {
      if (props.source) {
        const response = await DataLoader.getData(props.source);
        if (response.data) setGeojsonData(response.data);
      }
    }, 300),
    [props.source]
  );

  const interpolateColor = useCallback(
    (value: number | null): [number, number, number, number] => {
      if (value === null || !props.threshold) {
        return [0, 0, 0, 0]; // Transparent
      }

      let lower = props.threshold[0];
      let upper = props.threshold[props.threshold.length - 1];

      for (let i = 0; i < props.threshold.length - 1; i++) {
        if (value >= props.threshold[i].value && value <= props.threshold[i + 1].value) {
          lower = props.threshold[i];
          upper = props.threshold[i + 1];
          break;
        }
      }

      const t = (value - lower.value) / (upper.value - lower.value);
      const color = chroma.mix(lower.color, upper.color, t).rgba();
      return [color[0], color[1], color[2], 255];
    },
    [props.threshold]
  );

  const getFillColor = useMemo(() => {
    return (d: any): [number, number, number, number] => {
      if (!d.properties || !props.layerProp) return [0, 0, 0, 0]; // Transparent if properties or layerProp is missing
  
      const rawValue = d.properties[props.layerProp];
  
      // Return transparent color for null, undefined, or zero values
      if (rawValue === null || rawValue === undefined || rawValue === 0) {
        return [0, 0, 0, 0];
      }
  
      const baseColor: [number, number, number, number] = interpolateColor(rawValue);
  
      // Adjust opacity and return final color
      return [baseColor[0], baseColor[1], baseColor[2], props.opacity];
    };
  }, [props.layerProp, props.opacity, interpolateColor]);

  const updateLayer = useCallback(() => {
    if (!props.map || !geojsonData || !props.threshold) return;

    const scatterplotLayer = new ScatterplotLayer({
      id: "scatterplot-layer",
      data: geojsonData.features,
      getPosition: (d: any) => d.geometry.coordinates,
      getRadius: (d: any) => d.properties.radius || 500,
      getFillColor,
      updateTriggers: {
        getFillColor: [props.opacity, props.layerProp, props.threshold],
      },
      pickable: true,
    });

    if (!overlayRef.current) {
      overlayRef.current = new MapboxOverlay({ layers: [scatterplotLayer] });
      props.map.addControl(overlayRef.current as unknown as mapboxgl.IControl);
    } else {
      overlayRef.current.setProps({ layers: [scatterplotLayer] });
    }
  }, [props.map, geojsonData, getFillColor, props.threshold, props.layerProp, props.opacity]);

  useEffect(() => {
    fetchData();
    return fetchData.cancel;
  }, [props.source]);

  useEffect(() => {
    updateLayer();
  }, [updateLayer]);

  useEffect(() => {
    console.log(props.currentSource)
  },[props.currentSource])

  return null;
};

export default PointLayer;
