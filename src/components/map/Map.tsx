import "./Map.css"
import React, { useRef, useState, useCallback, useEffect } from "react"
import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"
import Draggable from "react-draggable"
import PointLayer from "./PointLayer"
import MySlider from "./MySlider"

// const opacity = 255 // Set opacity for valid values (0 to 255)
const stops = [
  { value: 0, color: "#FFFFFF" },
  { value: 76.2, color: "#E0F3DB" },
  { value: 127, color: "#C2E699" },
  { value: 203.2, color: "#78C679" },
  { value: 279.4, color: "#31A354" },
  { value: 330.2, color: "#006837" },
  { value: 406.4, color: "#FFEDA0" },
  { value: 457.2, color: "#FED976" },
  { value: 533.4, color: "#FEB24C" },
  { value: 609.6, color: "#FD8D3C" },
  { value: 660.4, color: "#FC4E2A" },
  { value: 736.6, color: "#E31A1C" },
  { value: 812.8, color: "#BD0026" },
  { value: 863.6, color: "#800026" },
  { value: 939.8, color: "#54278F" },
  { value: 990.6, color: "#756BB1" },
  { value: 1066.8, color: "#9E9AC8" },
  { value: 1143, color: "#CBC9E2" },
  { value: 1193.8, color: "#DADAEB" },
  { value: 1270, color: "#F2F0F7" },
] 

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN as string

interface IMap {
  style: string
  center: [number, number]
  zoom: number
  year: string
  climateVariable: string
  // geoFile: string

}

const Map: React.FC<IMap> = (props) => {

  const mapContainerRef = useRef<HTMLDivElement | null>(null)
  const [map, setMap] = useState<mapboxgl.Map | null>(null)
  const [controlDrag, setControlDrag] = useState<boolean>(true)
  
  const [opacity, setOpacity] = useState<number>(255) // Set opacity for valid values (0 to 255)

  const controlsRef = useRef<HTMLDivElement>(null)

  const startMap = useCallback(() => {
    if (!mapContainerRef.current) return

    // Initialize map only once
    const mapInstance = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: props.style,
      center: props.center,
      zoom: props.zoom
    })

    setMap(mapInstance)

    // Cleanup function to remove the map on component unmount
    return () => mapInstance.remove()

  },[])

  useEffect(() => startMap(), [startMap])

  const renderControls = () => {
    return (
      <Draggable nodeRef={controlsRef} disabled={!controlDrag}>
        <div
          className='layer-controls' id="layer-controls" 
          ref={controlsRef}
          style={{
            position: 'relative',
            backgroundColor: 'white',
            margin: '10px',
            padding: '5px',
            display: 'inline-block', // Ensures the div fits the content
            borderRadius: '5px',
            boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.2)',
            zIndex:1100
          }}
        >
          <MySlider 
            min={0}
            max={255}
            step={1}
            setControlDrag={setControlDrag}
            onChange={setOpacity}
            initialValue={255}

            />
        </div>
      </Draggable>
      
    )
  }

  const renderLayers = () => {
    return(
      <>
        {/* <PointLayer map={map} climateVariable={props.climateVariable} year={props.year} opacity={opacity} stops={stops}/> */}
        <PointLayer map={map} climateVariable={props.climateVariable} year={props.year} opacity={opacity} stops={stops}/>
      </>
    )
  }
  
  return (
    <div className="map-container" ref={mapContainerRef}>
      { map &&
      <>
        {renderLayers()}
        {/* {renderControls()} */}
      </>
            
      }

    </div>
  ) 
}

export default Map