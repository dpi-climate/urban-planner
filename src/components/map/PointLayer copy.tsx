import React, { useState, useEffect, useCallback, useMemo, useRef } from "react"
import { ScatterplotLayer } from "@deck.gl/layers"
import { MapboxOverlay } from "@deck.gl/mapbox"
import chroma from "chroma-js"
import { DataLoader } from "../../data-loader/DataLoader"
import { throttle } from "lodash"

interface IPointLayerProps {
  map: mapboxgl.Map | null
  layerProp: string | null
  threshold: { value: number; color: string }[] | null
  opacity: number
  source: string | null
}

const PointLayer: React.FC<IPointLayerProps> = (props) => {
  const [geojsonData, setGeojsonData] = useState<GeoJSON.FeatureCollection | null>(null)
  const hasFetchedData = useRef(false)
  const overlayRef = useRef<MapboxOverlay | null>(null)

  const fetchData = useCallback(() => {
    (async () => {
      if(props.source) {
        const response = await DataLoader.getData(props.source)
        if (response.data) setGeojsonData(response.data)
          // hasFetchedData.current = false
      }
    })()
  }, [props.source])

  const interpolateColor = useCallback(
    (value: number | null): [number, number, number, number] => {
      if (value === null || value === undefined || !props.threshold) {
        return [0, 0, 0, 0] // Transparent
      }


      let lower = props.threshold[0]
      let upper = props.threshold[props.threshold.length - 1]

      for (let i = 0; i < props.threshold.length - 1; i++) {
        if (value >= props.threshold[i].value && value <= props.threshold[i + 1].value) {
          lower = props.threshold[i]
          upper = props.threshold[i + 1]
          break
        }
      }

      const t = (value - lower.value) / (upper.value - lower.value)
      const color = chroma.mix(lower.color, upper.color, t).rgba()
      return [color[0], color[1], color[2], 255]
    },
    [props.threshold]
  )

  const colorCache = useMemo(() => {
    const cache: Record<number, [number, number, number, number]> = {}
    geojsonData?.features.forEach((feature) => {
      if (!feature.properties || !props.layerProp) return
      const value = feature.properties[props.layerProp]
      if (value !== null && value !== undefined && value !== 0) {
        cache[value] = interpolateColor(value)
      }
    })
    return cache
  }, [geojsonData, props.layerProp, interpolateColor])

  const getFillColor: (d: any) => [number, number, number, number] = (d) => {
    if (!d.properties || !props.layerProp) return [0, 0, 0, 0]
    const value = d.properties[props.layerProp]
    if (value === null || value === undefined || value === 0) {
      return [0, 0, 0, 0] // Transparent
    }
    const baseColor = colorCache[value] || [0, 0, 0, 0]
    return [baseColor[0], baseColor[1], baseColor[2], props.opacity]
  }

  const throttledUpdate = useRef(
    throttle((scatterplotLayer) => {
      if (overlayRef.current) {
        overlayRef.current.setProps({ layers: [scatterplotLayer] })
      }
    }, 100)
  ).current

  const updateLayer = useCallback(() => {
    if (!props.map || !geojsonData || !props.threshold || !props.opacity) return

    const scatterplotLayer = new ScatterplotLayer({
      id: "scatterplot-layer",
      data: geojsonData.features,
      getPosition: (d: any) => d.geometry.coordinates,
      getRadius: (d: any) => d.properties.radius || 500,
      getFillColor,
      updateTriggers: {
        getFillColor: [props.opacity, props.layerProp],
      },
      pickable: true,
      // onHover: ({ object, x, y }: any) => {
      //   const tooltip = document.getElementById("tooltip")
      //   if (object && tooltip && props.layerProp) {
      //     const { properties } = object
      //     const value = properties[props.layerProp]
      //     tooltip.style.top = `${y}px`
      //     tooltip.style.left = `${x}px`
      //     tooltip.innerHTML = `Value: ${value}`
      //     tooltip.style.display = "block"
      //   } else if (tooltip) {
      //     tooltip.style.display = "none"
      //   }
      // },
      // onClick: ({ object }: any) => {
      //   if (object) {
      //     alert(`Clicked on: ${JSON.stringify(object.properties)}`)
      //   }
      // },
    })

    if (!overlayRef.current) {
      overlayRef.current = new MapboxOverlay({
        layers: [scatterplotLayer],
      })
      props.map.addControl(overlayRef.current as unknown as mapboxgl.IControl);
    } else {
      throttledUpdate(scatterplotLayer) // Update layer if already initialized
    }

    return () => {
      if (overlayRef.current) {
        overlayRef.current.finalize() // Proper cleanup
        overlayRef.current = null
      }
    }

  },[props.map, geojsonData, props.layerProp, props.threshold, props.opacity, getFillColor])

  // useEffect(() => {
  //   if (!hasFetchedData.current) {
  //     fetchData()
  //     hasFetchedData.current = true
  //   }
  // }, [fetchData])

  useEffect(() => {if (props.source) fetchData() }, [props.source, fetchData])
  useEffect(() => updateLayer(), [updateLayer])

  return (
    <>
      <div
        id="tooltip"
        style={{
          display: "none",
          position: "absolute",
          padding: "8px",
          background: "white",
          boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.5)",
          zIndex: 10,
          pointerEvents: "none",
        }}
      />
    </>
  )
}

export default PointLayer
