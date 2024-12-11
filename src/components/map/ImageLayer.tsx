import { useState, useCallback, useEffect, useRef } from "react"
import mapboxgl from "mapbox-gl"
import { DataLoader } from "../../data-loader/DataLoader"

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN as string

const ImageLayer = ({ map, climateVariable, year }: {map: mapboxgl.Map | null, climateVariable: string, year: string}) => {
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
      if (!map.getSource('image-source')) {
        map.addSource('image-source', {
            type: 'image',
        // url: './1980_custom_color_map.gif',
        url: './1980_custom_color_map_png_transparent.png',
        coordinates: 
        // [
        //     [-92.19994354248047, 42.923736572265625], 
        //     [-85.88238525390625, 42.923736572265625], 
        //     [-85.88238525390625, 36.51332092285156], 
        //     [-92.19994354248047, 36.51332092285156]
        // ]
        [[-92.19994354248047, 42.923736572265625], 
        [-85.88238525390625, 42.923736572265625], 
        [-85.88238525390625, 36.51332092285156], 
        [-92.19994354248047, 36.51332092285156]]
        })
      }

      if (!map.getLayer('image-layer')) {
        map.addLayer({
          id: 'image-layer',
          type: 'raster',
          source: 'image-source',
          paint: {
            'raster-fade-duration': 0
          }
        });
        
      }

      // Add a click event listener to the 'image-layer'
    //   map.on('click', 'image-layer', (e) => {
    //     const features = e.features
    //     if (!features || features.length === 0) return

    //     const properties = features[0].properties
    //     const value = properties["1980"]

    //     new mapboxgl.Popup()
    //       .setLngLat(e.lngLat)
    //       .setText(`Value: ${value}`)
    //       .addTo(map)
    //   })

      // Cleanup on component unmount
      return () => {
        if (map.getLayer('image-layer')) {
          map.removeLayer('image-layer')
        //   map.off('click', 'image-layer') 
        }
        if (map.getSource('image-source')) map.removeSource('image-source')
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



  return null
}

export default ImageLayer
