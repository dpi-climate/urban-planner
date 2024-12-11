// import { useState, useCallback, useEffect, useRef } from "react"
// import mapboxgl from "mapbox-gl"
// import { DataLoader } from "../../data-loader/DataLoader"

// mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN as string

// const PointLayer = ({ map, climateVariable, year }: {map: mapboxgl.Map | null, climateVariable: string, year: string}) => {
//   const [geojsonData, setGeojsonData] = useState<GeoJSON.FeatureCollection | null>(null)
//   const hasFetchedData = useRef(false)

//   const fetchData = useCallback(() => {(
//     async () => {
//       // if(climateVariable) {
//         const response = await DataLoader.getData()
//         if (response.data) setGeojsonData(response.data)
//       // }
//     })()

//   },[climateVariable])

//   const addPoints = useCallback(() => {
//     if (!map || !geojsonData) return

//     const add = () => {
//       if (!map.getSource('points-source')) {
//         map.addSource('points-source', {
//           type: 'geojson',
//           data: geojsonData
//         })
//       }

//       if (!map.getLayer('points-layer')) {
//         map.addLayer({
//           id: 'points-layer',
//           type: 'circle',
//           source: 'points-source',
//           paint: {
//             "circle-radius": 3.0,
//             "circle-color": [
//               'interpolate',
//               ['linear'],
//               // ['get', year], // 800 - 1000
//               ['get', '1980'], // 800 - 1000
//               0, '#FFFFFF',
//               76.2, '#E0F3DB',
//               127, '#C2E699',
//               203.2, '#78C679',
//               279.4, '#31A354',
//               330.2, '#006837',
//               406.4, '#FFEDA0',
//               457.2, '#FED976',
//               533.4, '#FEB24C',
//               609.6, '#FD8D3C',
//               660.4, '#FC4E2A',
//               736.6, '#E31A1C',
//               812.8, '#BD0026',
//               863.6, '#800026',
//               939.8, '#54278F',
//               990.6, '#756BB1',
//               1066.8, '#9E9AC8',
//               1143, '#CBC9E2',
//               1193.8, '#DADAEB',
//               1270, '#F2F0F7',
//             ],
//           }
//         })
//       }
    
//       // Cleanup on component unmount
//       return () => {
//         if (map.getLayer('points-layer')) map.removeLayer('points-layer')
//         if (map.getSource('points-source')) map.removeSource('points-source')
//       }
//     }

//     if (map.isStyleLoaded()) {
//       add()
//     } else {
//       map.on('load', add)
//     }


//   }, [map, geojsonData])

//   useEffect(() => {
//     if (!hasFetchedData.current) {
//       fetchData()
//       hasFetchedData.current = true
//     }
  
//   }, [fetchData])
//   useEffect(() => addPoints(), [addPoints])

//   return null

// }

// export default PointLayer

import { useState, useCallback, useEffect, useRef } from "react"
import mapboxgl from "mapbox-gl"
import { DataLoader } from "../../data-loader/DataLoader"

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN as string

const PointLayer = ({ map, climateVariable, year }: {map: mapboxgl.Map | null, climateVariable: string, year: string}) => {
  const [geojsonData, setGeojsonData] = useState<GeoJSON.FeatureCollection | null>(null)
  const hasFetchedData = useRef(false)

  const fetchData = useCallback(() => {(
    async () => {
      const response = await DataLoader.getData()
      if (response.data) setGeojsonData(response.data)
    })()
  },[climateVariable])

  const addPoints = useCallback(() => {
    if (!map || !geojsonData) return

    const add = () => {
      if (!map.getSource('points-source')) {
        map.addSource('points-source', {
          type: 'geojson',
          data: geojsonData
        })
      }

      if (!map.getLayer('points-layer')) {

        map.addLayer({
          id: 'points-layer',
          type: 'circle',
          source: 'points-source',
          paint: {
            "circle-radius": 3.0,
            "circle-color": [
              'case',
              ['==', ['get', '1980'], null],
              'rgba(0,0,0,0)', // Transparent if the value is undefined/null
              [
                'interpolate',
                ['linear'],
                ['get', '1980'],
                0, '#FFFFFF',
                76.2, '#E0F3DB',
                127, '#C2E699',
                203.2, '#78C679',
                279.4, '#31A354',
                330.2, '#006837',
                406.4, '#FFEDA0',
                457.2, '#FED976',
                533.4, '#FEB24C',
                609.6, '#FD8D3C',
                660.4, '#FC4E2A',
                736.6, '#E31A1C',
                812.8, '#BD0026',
                863.6, '#800026',
                939.8, '#54278F',
                990.6, '#756BB1',
                1066.8, '#9E9AC8',
                1143, '#CBC9E2',
                1193.8, '#DADAEB',
                1270, '#F2F0F7'
              ]
            ],
          }
        });
        
      }

      // Add a click event listener to the 'points-layer'
      map.on('click', 'points-layer', (e) => {
        const features = e.features
        if (!features || features.length === 0) return

        const properties = features[0].properties
        const value = properties["1980"]

        new mapboxgl.Popup()
          .setLngLat(e.lngLat)
          .setText(`Value: ${value}`)
          .addTo(map)
      })

      // Cleanup on component unmount
      return () => {
        if (map.getLayer('points-layer')) {
          map.removeLayer('points-layer')
          map.off('click', 'points-layer') 
        }
        if (map.getSource('points-source')) map.removeSource('points-source')
      }
    }

    if (map.isStyleLoaded()) {
      add()
    } else {
      map.on('load', add)
    }

  }, [map, geojsonData, year]) // Include 'year' in dependencies

  useEffect(() => {
    if (!hasFetchedData.current) {
      fetchData()
      hasFetchedData.current = true
    }
  }, [fetchData])

  useEffect(() => addPoints(), [addPoints])

  // Update 'circle-color' when 'year' changes
  useEffect(() => {
    if (map && map.getLayer('points-layer')) {
      map.setPaintProperty('points-layer', 'circle-color', [
        'interpolate',
        ['linear'],
        ['get', "1980"],
        0, '#FFFFFF',
        76.2, '#E0F3DB',
        127, '#C2E699',
        203.2, '#78C679',
        279.4, '#31A354',
        330.2, '#006837',
        406.4, '#FFEDA0',
        457.2, '#FED976',
        533.4, '#FEB24C',
        609.6, '#FD8D3C',
        660.4, '#FC4E2A',
        736.6, '#E31A1C',
        812.8, '#BD0026',
        863.6, '#800026',
        939.8, '#54278F',
        990.6, '#756BB1',
        1066.8, '#9E9AC8',
        1143, '#CBC9E2',
        1193.8, '#DADAEB',
        1270, '#F2F0F7',
      ])
    }
  }, [map, year])

  return null
}

export default PointLayer
