import "./Home.css"
import React, { useCallback, useEffect, useState, useRef } from "react"

import Map from "../../components/map/Map"
import myConsts from "../../consts/consts"

import ElementWrapper from "../../components/element-wrapper/ElementWrapper"
import DrawerWrapper from "../../components/drawer/DrawerWrapper"
// import ClimateContent from "../../components/drawer/ClimateContent"
import ClimateContent from "../../components/drawer/LayersClimateContent"

import { DataLoader } from "../../data-loader/DataLoader"

const climateVariables = [
  { name: "Sum Precipitation", nick: "sumPrec", geoFile: "Yearly_Precipitation_Sum.json", properties: Array.from({ length: 2100 - 1980 + 1 }, (_, i) => (1980 + i).toString())},
  { name: "Max Precipitation", nick: "maxPrec", geoFile: "Yearly_Precipitation_Sum.json", properties: Array.from({ length: 2100 - 1980 + 1 }, (_, i) => (1980 + i).toString())},

]

const Home = () => {

  const [activeClimateVariable, setClimateVariable] = useState<string>("")
  const [activeYear, setYear] = useState<string>(climateVariables[0].properties[0])
  const [activeDrawerBtn, setDrawerBtn] = useState<string | null>(null)

  const [griddedLayerIdx, setGriddedLayerIdx] = useState<number>(0)
  const [activeSource, setSource] = useState<string | null>(climateVariables[0].geoFile)
  const [griddedLayer, setGriddedLayer] = useState<GeoJSON.FeatureCollection | null>(null)
  const [gridLayerProps, setGridLayerProps] = useState<string[] | null>(climateVariables[0].properties)
  const [activeProp, setProp] = useState<string | null>(climateVariables[0].properties[0])

  // const drawerBtns = ["Layers", "Home"]
  const drawerBtns = ["Layers"]

  const updateSource = (idx: number) => {  
    // check if file exists -- to do

    setGriddedLayerIdx(idx)
    setGridLayerProps(climateVariables[idx].properties)
    setProp(climateVariables[idx].properties[0])
    setSource(climateVariables[idx].geoFile)
  }

  const updateProp = (prop: string) => setProp(prop)
  
  const renderMenu = () => {
    return  (
      <DrawerWrapper anchor={"right"} buttons={drawerBtns} setBtn={setDrawerBtn}>
        {activeDrawerBtn === 'Layers' && 
          <ClimateContent 
            griddedLayerIdx={griddedLayerIdx} 
            year={activeYear} setYear={setYear} 
            climateVariable={activeClimateVariable} 
            setClimateVariable={setClimateVariable} 
            climateVariables={climateVariables} 
            properties={gridLayerProps} 
            activeProp={activeProp}
            updateSource={updateSource}
            updateProp={updateProp}
            />}
            
      </DrawerWrapper>
    )
  }

  const renderMap = () => {
    return (
      // <ElementWrapper width='1850px' height='800px' right='0px'>
      // <ElementWrapper width='1850px' height='800px' right='-100px'>
      <ElementWrapper height='95vh'>
        <Map 
          style="mapbox://styles/carolvfs/clxnzay8z02qh01qkhftqheen" 
          center={[-89.12987909766366, 40.09236099826568] as [number, number]}
          zoom={6}
          year={activeYear}
          climateVariable={activeClimateVariable}
          source={activeSource}
          layerProp={activeProp}
        />
      </ElementWrapper>
    )
  }

  const render = () => {
    return (
      <div className="home">
        { renderMenu() }
        { renderMap() }
      </div>
    )
  }

  // const fetchData = useCallback(() => {
  //   (async () => {
  //     const response = await DataLoader.getData()
  //     if (response.data) {
  //       setGriddedLayer(response.data)
      
  //     }
  //   })()
  // }, [])

  // useEffect(() => {
  //   if (!hasFetchedData.current) {
  //     fetchData()
  //     hasFetchedData.current = true
  //   }
  // }, [fetchData])

  return render()
}

export default Home