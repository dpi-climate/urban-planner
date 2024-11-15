import React, { useEffect, useState, useCallback } from "react"
import { FeatureCollection, Geometry } from 'geojson'
import { MapboxOverlay } from '@deck.gl/mapbox'

import myConsts from "../../consts/consts"

import { ContourLayer } from '@deck.gl/aggregation-layers'

interface IMapLayers {
  map: mapboxgl.Map | null
  geoFile: string | null
}

const MapLayers: React.FC<IMapLayers> = (props) => {

  const [geojsonData, setGeojsonData] = useState<FeatureCollection<Geometry> | null>(null)

  useEffect(() => {
    if(!props.geoFile) return 
    
    fetch(props.geoFile)
      .then(response => response.json())
      .then(data => setGeojsonData(data))
      .catch(error => console.error('Error fetching data:', error))

  }, [props.geoFile])

  const populateMap = useCallback(() => {

    if (!props.map || !geojsonData) return

    // Create the Deck.gl ContourLayer
    const deckOverlay = new MapboxOverlay({
      interleaved: true,
      layers: [
        new ContourLayer({
          id: myConsts.contourLayerParams.id,
          data: geojsonData.features,
          getPosition: d => d.geometry.coordinates,
          getWeight: d => d.properties.temperature,
          contours: myConsts.contourLayerParams.contours,
          aggregation: myConsts.contourLayerParams.aggregation,
          cellSize: myConsts.contourLayerParams.cellSize, // Adjust based on data density
        }),
      ],
    })

    props.map.addControl(deckOverlay)

  },[geojsonData])

  useEffect(() => populateMap(), [populateMap])

  return null // This component doesn't render anything in the DOM
}

export default MapLayers
