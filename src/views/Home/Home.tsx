import "./Home.css"
import React, { useCallback, useEffect, useState, useRef } from "react"

import Map from "../../components/map/Map"
import ElementWrapper from "../../components/element-wrapper/ElementWrapper"
import DrawerWrapper from "../../components/drawer/DrawerWrapper"
// import ClimateContent from "../../components/drawer/ClimateContent"
import ClimateContent from "../../components/drawer/ClimateContent"

import { CLIMATE_VARIABLES } from "../../consts/consts"

const Home = () => {

  // /////////////////////////////////////////////////////////////////////////////////
  // ////////////////   CLIMATE CONTENT   ////////////////////////////////////////////
  const initialIdx = 0
  const [griddedLayerIdx, setGriddedLayerIdx] = useState<number>(initialIdx)
  const [activeSource, setSource]             = useState<string | null>(CLIMATE_VARIABLES[initialIdx].geoFile)
  const [gridLayerProps, setGridLayerProps]   = useState<string[] | null>(CLIMATE_VARIABLES[initialIdx].properties)
  // const [activeProp, setProp]                 = useState<string | null>(CLIMATE_VARIABLES[initialIdx].properties[0])
  const [activePropIdx, setPropIdx]           = useState<number>(initialIdx)
  const [threshold, setThreshold]             = useState<{value: number, color: string}[] | null>(CLIMATE_VARIABLES[initialIdx].threshold)
  
  // /////////////////////////////////////////////////////////////////////////////////
  // ////////////////   DRAWER   /////////////////////////////////////////////////////
  
  const [activeDrawerBtn, setDrawerBtn] = useState<string | null>(null)
  const drawerBtns = ["Layers"]
  // const drawerBtns = ["Layers", "Home"]
  const infoDrawerBtns = ["Close"]

  // /////////////////////////////////////////////////////////////////////////////////
  // ////////////////   MAP   ////////////////////////////////////////////////////////
  const [clickedLocal, setClickedLocal] = useState<{lat:number, lng: number, elevation: number | null} | null>(null)
  
  // /////////////////////////////////////////////////////////////////////////////////
  // ////////////////   UPDATE FUNCTIONS   ///////////////////////////////////////////

  const updateSource = (idx: number) => {
    // check if file exists -- to do

    setGriddedLayerIdx(idx)
    setGridLayerProps(CLIMATE_VARIABLES[idx].properties)
    // setProp(CLIMATE_VARIABLES[idx].properties[0])
    setPropIdx(0)
    setSource(CLIMATE_VARIABLES[idx].geoFile)
    setThreshold(CLIMATE_VARIABLES[idx].threshold)
  }

  // const updateProp = (prop: string, idx: number) => {setProp(prop); setPropIdx(idx)}
  const updateProp = (propIdx: number) => setPropIdx(propIdx)

  // /////////////////////////////////////////////////////////////////////////////////
  // ////////////////   RENDER FUNCTIONS   ///////////////////////////////////////////
  
  const renderMenu = () => {
    return  (
      <DrawerWrapper anchor={"right"} buttons={drawerBtns} setBtn={setDrawerBtn}>
        {activeDrawerBtn === 'Layers' && 
          <ClimateContent 
            griddedLayerIdx={griddedLayerIdx} 
            sources={CLIMATE_VARIABLES} 
            properties={gridLayerProps} 
            // activeProp={activeProp}
            activePropIdx={activePropIdx}
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
          source={activeSource}
          layerProp={CLIMATE_VARIABLES[griddedLayerIdx].properties[activePropIdx]}
          threshold={threshold}
          setClickedLocal={setClickedLocal}
        />
      </ElementWrapper>
    )
  }

  const renderInfoDrawer = () => {
    return (
      <DrawerWrapper 
        anchor={"bottom"} 
        clickedLocal={clickedLocal} 
        setClickedLocal={setClickedLocal}>
        Content
      </DrawerWrapper>
    )
  }

  const render = () => {
    return (
      <div className="home">
        { renderMenu() }
        { renderMap() }
        {renderInfoDrawer()}
      </div>
    )
  }
  return render()
}

export default Home