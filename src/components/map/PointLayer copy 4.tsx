import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { ScatterplotLayer } from "@deck.gl/layers";
import { MapboxOverlay } from "@deck.gl/mapbox";
import chroma from "chroma-js";
import { DataLoader } from "../../data-loader/DataLoader";

interface IPointLayerProps {
  map: mapboxgl.Map | null;
  layerProp: string | null;
  threshold: { value: number; color: string }[] | null;
  opacity: number;
  source: string | null;
}

const PointLayer: React.FC<IPointLayerProps> = (props) => {
  const [geojsonData, setGeojsonData] = useState<GeoJSON.FeatureCollection | null>(null);
  const [isSynchronized, setIsSynchronized] = useState(false); // Track synchronization
  const overlayRef = useRef<MapboxOverlay | null>(null);

  // State for synchronized layer properties
  const [currentLayer, setCurrentLayer] = useState({
    source: props.source,
    layerProp: props.layerProp,
    threshold: props.threshold,
  });

  // Monitor props and determine synchronization
  useEffect(() => {
    const isSync = 
      props.source === currentLayer.source &&
      props.layerProp === currentLayer.layerProp &&
      props.threshold === currentLayer.threshold;

    if (!isSync) {
      setIsSynchronized(false); // Not synchronized
    }

    if (props.source && props.layerProp && props.threshold) {
      setCurrentLayer({
        source: props.source,
        layerProp: props.layerProp,
        threshold: props.threshold,
      });
      setIsSynchronized(true); // Synchronized
    }
  }, [props.source, props.layerProp, props.threshold, currentLayer]);

  // Fetch GeoJSON data when the source changes
  const fetchData = useCallback(async () => {
    if (currentLayer.source) {
      const response = await DataLoader.getData(currentLayer.source);
      if (response.data) setGeojsonData(response.data);
    }
  }, [currentLayer.source]);

  useEffect(() => {
    fetchData();
  }, [currentLayer.source, fetchData]);

  // Interpolate color based on thresholds
  const interpolateColor = useCallback(
    (value: number | null): [number, number, number, number] => {
      if (value === null || value === undefined || !currentLayer.threshold) {
        return [0, 0, 0, 0]; // Transparent
      }

      let lower = currentLayer.threshold[0];
      let upper = currentLayer.threshold[currentLayer.threshold.length - 1];

      for (let i = 0; i < currentLayer.threshold.length - 1; i++) {
        if (value >= currentLayer.threshold[i].value && value <= currentLayer.threshold[i + 1].value) {
          lower = currentLayer.threshold[i];
          upper = currentLayer.threshold[i + 1];
          break;
        }
      }

      const t = (value - lower.value) / (upper.value - lower.value);
      const color = chroma.mix(lower.color, upper.color, t).rgba();
      return [color[0], color[1], color[2], 255];
    },
    [currentLayer.threshold]
  );

  // Define getFillColor accessor
  const getFillColor = useMemo(() => {
    return (d: any): [number, number, number, number] => {
      if (!isSynchronized || !currentLayer.layerProp) return [0, 0, 0, 0]; // Transparent if not synchronized

      const value = d.properties?.[currentLayer.layerProp];
      if (value === null || value === undefined || value === 0) {
        return [0, 0, 0, 0]; // Transparent for invalid values
      }

      const baseColor = interpolateColor(value);
      return [baseColor[0], baseColor[1], baseColor[2], props.opacity];
    };
  }, [isSynchronized, currentLayer.layerProp, props.opacity, interpolateColor]);

  // Update the ScatterplotLayer
  const updateLayer = useCallback(() => {
    const { source, layerProp, threshold } = currentLayer;

    if (!props.map || !geojsonData || !source || !layerProp || !threshold) return;

    const scatterplotLayer = new ScatterplotLayer({
      id: "scatterplot-layer",
      data: geojsonData.features,
      getPosition: (d: any) => d.geometry.coordinates,
      getRadius: (d: any) => d.properties.radius || 500,
      getFillColor,
      updateTriggers: {
        getFillColor: [layerProp, threshold, props.opacity, isSynchronized],
      },
      pickable: true,
    });

    if (!overlayRef.current) {
      overlayRef.current = new MapboxOverlay({ layers: [scatterplotLayer] });
      props.map.addControl(overlayRef.current as unknown as mapboxgl.IControl);
    } else {
      overlayRef.current.setProps({ layers: [scatterplotLayer] });
    }
  }, [props.map, geojsonData, currentLayer, props.opacity, getFillColor, isSynchronized]);

  useEffect(() => {
    updateLayer();
  }, [updateLayer]);

  return null;
};

export default PointLayer;
