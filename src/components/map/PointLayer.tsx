import React, { useState, useEffect, useCallback, useMemo, useRef } from "react"
import { ScatterplotLayer } from "@deck.gl/layers"
import { MapboxOverlay } from "@deck.gl/mapbox"
import chroma from "chroma-js"
import { DataLoader } from "../../data-loader/DataLoader"
import { throttle } from "lodash"

interface IPointLayerProps {
  map: mapboxgl.Map | null
  climateVariable: string
  year: string
  stops: { value: number; color: string }[]
  opacity: number
}

const PointLayer: React.FC<IPointLayerProps> = (props) => {
  const [geojsonData, setGeojsonData] = useState<GeoJSON.FeatureCollection | null>(null)
  const hasFetchedData = useRef(false)
  const overlayRef = useRef<MapboxOverlay | null>(null)

  const fetchData = useCallback(() => {
    (async () => {
      const response = await DataLoader.getData()
      if (response.data) setGeojsonData(response.data)
    })()
  }, [props.climateVariable])

  const interpolateColor = useCallback(
    (value: number | null): [number, number, number, number] => {
      if (value === null || value === undefined) {
        return [0, 0, 0, 0] // Transparent
      }

      let lower = props.stops[0]
      let upper = props.stops[props.stops.length - 1]

      for (let i = 0; i < props.stops.length - 1; i++) {
        if (value >= props.stops[i].value && value <= props.stops[i + 1].value) {
          lower = props.stops[i]
          upper = props.stops[i + 1]
          break
        }
      }

      const t = (value - lower.value) / (upper.value - lower.value)
      const color = chroma.mix(lower.color, upper.color, t).rgba()
      return [color[0], color[1], color[2], 255]
    },
    [props.stops]
  )

  const colorCache = useMemo(() => {
    const cache: Record<number, [number, number, number, number]> = {}
    geojsonData?.features.forEach((feature) => {
      if (!feature.properties) return
      const value = feature.properties[props.year]
      if (value !== null && value !== undefined) {
        cache[value] = interpolateColor(value)
      }
    })
    return cache
  }, [geojsonData, props.year, interpolateColor])

  const getFillColor: (d: any) => [number, number, number, number] = (d) => {
    if (!d.properties) return [0, 0, 0, 0]
    const value = d.properties[props.year]
    if (value === null || value === undefined) {
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

  // useEffect(() => {
  //   if (!hasFetchedData.current) {
  //     fetchData()
  //     hasFetchedData.current = true
  //   }
  // }, [fetchData])

  useEffect(() => {
    if (!props.map || !geojsonData || !props.stops || !props.opacity) return
    console.log(geojsonData)
    const scatterplotLayer = new ScatterplotLayer({
      id: "scatterplot-layer",
      data: geojsonData.features,
      getPosition: (d: any) => d.geometry.coordinates,
      getRadius: (d: any) => d.properties.radius || 500,
      getFillColor,
      updateTriggers: {
        getFillColor: [props.opacity, props.year],
      },
      pickable: true,
      onHover: ({ object, x, y }: any) => {
        const tooltip = document.getElementById("tooltip")
        if (object && tooltip) {
          const { properties } = object
          const value = properties[props.year]
          tooltip.style.top = `${y}px`
          tooltip.style.left = `${x}px`
          tooltip.innerHTML = `Value: ${value}`
          tooltip.style.display = "block"
        } else if (tooltip) {
          tooltip.style.display = "none"
        }
      },
      onClick: ({ object }: any) => {
        if (object) {
          alert(`Clicked on: ${JSON.stringify(object.properties)}`)
        }
      },
    })

    if (!overlayRef.current) {
      overlayRef.current = new MapboxOverlay({
        layers: [scatterplotLayer],
      })
      props.map.addControl(overlayRef.current)
    } else {
      throttledUpdate(scatterplotLayer) // Update layer if already initialized
    }

    return () => {
      if (overlayRef.current) {
        overlayRef.current.finalize() // Proper cleanup
        overlayRef.current = null
      }
    }
  }, [props.map, geojsonData, props.year, props.stops, props.opacity, getFillColor])

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



// import React, { useState, useEffect, useCallback, useRef } from "react"
// import { ScatterplotLayer } from "@deck.gl/layers"
// import { MapboxOverlay } from "@deck.gl/mapbox"
// import chroma from "chroma-js"
// import { DataLoader } from "../../data-loader/DataLoader"

// interface IPointLayerProps {
//   map: mapboxgl.Map | null
//   climateVariable: string
//   year: string
//   stops: { value: number, color: string }[]
//   opacity: number
// }

// const PointLayer: React.FC<IPointLayerProps> = (props) => {
//   const [geojsonData, setGeojsonData] = useState<GeoJSON.FeatureCollection | null>(null)
//   const hasFetchedData = useRef(false)
//   const overlayRef = useRef<MapboxOverlay | null>(null)

//   const fetchData = useCallback(() => {
//     (async () => {
//       const response = await DataLoader.getData()
//       if (response.data) setGeojsonData(response.data)
//     })()
//   }, [props.climateVariable])

//   useEffect(() => {
//     if (!hasFetchedData.current) {
//       fetchData()
//       hasFetchedData.current = true
//     }
//   }, [fetchData])

//   const interpolateColor = (value: number | null): [number, number, number, number] => {
//     if (value === null || value === undefined) {
//       return [0, 0, 0, 0] // Transparent
//     }

//     // Find the surrounding props.stops
//     let lower = props.stops[0]
//     let upper = props.stops[props.stops.length - 1]

//     for (let i = 0; i < props.stops.length - 1; i++) {
//       if (value >= props.stops[i].value && value <= props.stops[i + 1].value) {
//         lower = props.stops[i]
//         upper = props.stops[i + 1]
//         break
//       }
//     }

//     // Interpolate between stops
//     const t = (value - lower.value) / (upper.value - lower.value)
//     const color = chroma.mix(lower.color, upper.color, t).rgba()

//     return [color[0], color[1], color[2], 255] // Return RGBA
//   }

//   useEffect(() => {
//     if (!props.map || !geojsonData || !props.stops || !props.opacity) return

//     // Create a Deck.gl ScatterplotLayer
//     const scatterplotLayer = new ScatterplotLayer({
//       id: "scatterplot-layer",
//       data: geojsonData.features,
//       getPosition: (d: any) => d.geometry.coordinates,
//       getRadius: (d: any) => {
//         const baseRadius = d.properties.radius || 600
//         const zoomFactor = 1 /// Math.pow(200, zoom - 1)
//         return baseRadius * zoomFactor

//       },
//       getFillColor: (d: any) => {
//         const value = d.properties[props.year]
//         if (value === null || value === undefined) {
//           return [0, 0, 0, 0]
//         }
//         const baseColor = interpolateColor(value)
//         return [baseColor[0], baseColor[1], baseColor[2], props.opacity]
//       },
//       pickable: true, // Enable interactivity
//       onHover: ({ object, x, y }: any) => {
//         const tooltip = document.getElementById("tooltip")
//         if (object && tooltip) {
//           const { properties } = object
//           const value = properties[props.year]
//           tooltip.style.top = `${y}px`
//           tooltip.style.left = `${x}px`
//           tooltip.innerHTML = `Value: ${value}`
//           tooltip.style.display = "block"
//         }
//       },
//       onClick: ({ object }: any) => {
//         if (object) {
//           alert(`Clicked on: ${JSON.stringify(object.properties)}`)
//         }
//       },
//     })

//     // Initialize or update the MapboxOverlay
//     if (!overlayRef.current) {
//       overlayRef.current = new MapboxOverlay({
//         layers: [scatterplotLayer],
//       })
//       props.map.addControl(overlayRef.current)
//     } else {
//       overlayRef.current.setProps({ layers: [scatterplotLayer] })
//     }

//     return () => {
//       // Cleanup: Remove the overlay when the component unmounts
//       if (overlayRef.current) {
//         overlayRef.current.finalize()
//         overlayRef.current = null
//       }
//     }
//   }, [props.map, geojsonData, props.year, props.stops, props.opacity])

//   return (
//     <>
//       <div
//         id="tooltip"
//         style={{
//           display: "none",
//           position: "absolute",
//           padding: "8px",
//           background: "white",
//           boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.5)",
//           zIndex: 10,
//           pointerEvents: "none",
//         }}
//       />
//     </>
//   )
// }

// export default PointLayer
