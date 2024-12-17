import React, { useState, useEffect, useCallback, useMemo, useRef } from "react"
import { ScatterplotLayer } from "@deck.gl/layers"
import { MapboxOverlay } from "@deck.gl/mapbox"
import chroma from "chroma-js"
import { DataLoader } from "../../data-loader/DataLoader"

interface IPointLayerProps {
  map: mapboxgl.Map | null
  layerProp: string | null
  threshold: { value: number; color: string }[] | null
  opacity: number
  source: string | null
  currentZoom: number
}

// Simple in-memory cache for previously fetched data
const dataCache: Record<string, GeoJSON.FeatureCollection> = {}

const PointLayer: React.FC<IPointLayerProps> = (props) => {
  const overlayRef = useRef<MapboxOverlay | null>(null)

  // Active states represent the currently displayed layer configuration
  const [activeSource, setActiveSource] = useState<string | null>(null)
  const [activeLayerProp, setActiveLayerProp] = useState<string | null>(null)
  const [activeThreshold, setActiveThreshold] = useState<{ value: number; color: string }[] | null>(null)
  const [activeGeojson, setActiveGeojson] = useState<GeoJSON.FeatureCollection | null>(null)

  // Track loading state when source changes
  const [loading, setLoading] = useState(false)

  const getRadius = useCallback((d: any) => {
    const baseRadius = 600
    const thresholdMinZoom = 6
    const thresholdMaxZoom = 9
    const currentZoom = props.currentZoom

    if (currentZoom <= thresholdMinZoom) return baseRadius

    const denominator = currentZoom <= thresholdMaxZoom
      ? 4
      : 2
    // const denominator = 3
    
    const zoomDifference = currentZoom - thresholdMinZoom
    const scaledRadius = baseRadius * Math.pow(2, -zoomDifference / denominator)

    return scaledRadius

  }, [props.currentZoom])

  useEffect(() => {
    // Fetch data only if the source changes
    const updateForNewSource = async () => {
      if (!props.source || props.source === activeSource) return
  
      setLoading(true)
  
      let newGeojson = dataCache[props.source]
      if (!newGeojson) {
        const response = await DataLoader.getData(props.source)

        newGeojson = response.data ?? null
        if (newGeojson) {
          dataCache[props.source] = newGeojson
        }
      }
  
      // Update all active states after fetching
      setActiveSource(props.source)
      setActiveLayerProp(props.layerProp)
      setActiveThreshold(props.threshold)
      setActiveGeojson(newGeojson)
      setLoading(false)

    }
  
    updateForNewSource()
  }, [props.source]) // Depend only on props.source for fetching
  
  
  useEffect(() => {
    // If the source hasn't changed and we're not loading,
    // just update layerProp and threshold as needed
    if (props.source === activeSource && !loading) {
      if (props.layerProp !== activeLayerProp) {
        setActiveLayerProp(props.layerProp)
      }
      if (props.threshold !== activeThreshold) {
        setActiveThreshold(props.threshold)
      }
    }
  }, [props.source, props.layerProp, props.threshold, activeSource, activeLayerProp, activeThreshold, loading])
  

  /**
   * If only the layerProp or threshold changes (and the source stays the same),
   * update immediately without refetching.
   */
  useEffect(() => {
    if (props.source === activeSource && !loading) {
      if (props.layerProp !== activeLayerProp) {
        setActiveLayerProp(props.layerProp)
      }
      if (props.threshold !== activeThreshold) {
        setActiveThreshold(props.threshold)
      }
    }
  }, [props.source, props.layerProp, props.threshold, activeSource, activeLayerProp, activeThreshold, loading])

  // Interpolate color based on thresholds
  const interpolateColor = useCallback(
    (value: number | null): [number, number, number, number] => {
      if (value === null || value === undefined || !activeThreshold) {
        return [0, 0, 0, 0] // Transparent for invalid values or no threshold
      }

      let lower = activeThreshold[0]
      let upper = activeThreshold[activeThreshold.length - 1]

      for (let i = 0; i < activeThreshold.length - 1; i++) {
        if (value >= activeThreshold[i].value && value <= activeThreshold[i + 1].value) {
          lower = activeThreshold[i]
          upper = activeThreshold[i + 1]
          break
        }
      }

      const t = (value - lower.value) / (upper.value - lower.value)
      const color = chroma.mix(lower.color, upper.color, t).rgba()
      return [color[0], color[1], color[2], 255]
    },
    [activeThreshold]
  )

  // Define getFillColor accessor
  const getFillColor = useMemo(() => {
    return (d: any): [number, number, number, number] => {
      // If loading new data or active configuration not ready, render transparent
      if (loading || !activeLayerProp || !activeGeojson) {
        return [0, 0, 0, 0]
      }

      const value = d.properties?.[activeLayerProp]
      if (value === null || value === undefined || value === 0) {
        return [0, 0, 0, 0] // Transparent for invalid values
      }

      const baseColor = interpolateColor(value)
      return [baseColor[0], baseColor[1], baseColor[2], props.opacity]
    }
  }, [loading, activeLayerProp, activeGeojson, props.opacity, interpolateColor])

  // Update the ScatterplotLayer
  const updateLayer = useCallback(() => {
    if (!props.map || !activeGeojson || !activeSource || !activeLayerProp || !activeThreshold) return

    const scatterplotLayer = new ScatterplotLayer({
      id: "scatterplot-layer",
      data: activeGeojson.features,
      getPosition: (d: any) => d.geometry.coordinates,
      getRadius,
      getFillColor,
      updateTriggers: {
        getFillColor: [activeLayerProp, activeThreshold, props.opacity, loading],
        getRadius: [props.currentZoom]
      },
      pickable: true,
    })

    if (!overlayRef.current) {
      overlayRef.current = new MapboxOverlay({ layers: [scatterplotLayer] })
      props.map.addControl(overlayRef.current as unknown as mapboxgl.IControl)
    } else {
      overlayRef.current.setProps({ layers: [scatterplotLayer] })
    }
  }, [props.map, activeGeojson, activeSource, activeLayerProp, activeThreshold, props.opacity, getFillColor, loading, props.currentZoom])

  useEffect(() => {
    updateLayer()
  }, [updateLayer])

  return null
}

export default PointLayer
