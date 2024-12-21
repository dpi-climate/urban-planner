import "./Home.css"
import React, { useCallback, useEffect, useState, useRef } from "react"

import Map from "../../components/map/Map"
import ElementWrapper from "../../components/element-wrapper/ElementWrapper"
import DrawerWrapper from "../../components/drawer-wrapper/DrawerWrapper"

import ClimateContent from "../../components/drawer-contents/ClimateContent"
import ClickedInfoContent from "../../components/drawer-contents/ClickedInfoContent"

import { CLIMATE_VARIABLES, CLIMATE_YEARS } from "../../consts/consts"
import { DataLoader } from "../../data-loader/DataLoader"

const Home = () => {
 
  // /////////////////////////////////////////////////////////////////////////////////
  // ////////////////   CLIMATE CONTENT   ////////////////////////////////////////////
  const initialIdx = 0
  
  const variablesList = CLIMATE_VARIABLES.map(({ threshold, ...rest }) => rest)
  
  const [yearIdx, setYearIdx]           = useState<number>(initialIdx)
  const [variableIdx, setVariableIdx]   = useState<number>(initialIdx)
  
  const [threshold, setThreshold]             = useState<{value: number, color: string}[] | null>(CLIMATE_VARIABLES[initialIdx].threshold)

  const [riskData, setRiskData] = useState<{ year: string, value: number}[]>([])
  
  const [activeDrawerBtn, setDrawerBtn] = useState<string | null>(null)
  const drawerBtns = ["Layers"]
  // const drawerBtns = ["Layers", "Home"]
  const infoDrawerBtns = ["Close"]

  const [clickedLocal, setClickedLocal] = useState<{lat:number, lng: number, elevation: number | null} | null>(null)
  
  // ////////////////   UPDATE FUNCTIONS   ///////////////////////////////////////////


  const updateLayer = (varIdx: number | null, yIdx: number | null) => {
    if(varIdx !== null) setVariableIdx(varIdx)
    if(yIdx !== null) setYearIdx(yIdx)
  }

  const updateRiskData = async (ptIdx: number) => {
    const _riskData = await DataLoader.getRiskData(ptIdx)
    setRiskData(_riskData)
  }

  // /////////////////////////////////////////////////////////////////////////////////
  // ////////////////   RENDER FUNCTIONS   ///////////////////////////////////////////
  
  const renderMenu = () => {
    return  (
      <DrawerWrapper anchor={"right"} buttons={drawerBtns} setBtn={setDrawerBtn}>
        {activeDrawerBtn === 'Layers' && 
          <ClimateContent 
            variableIdx={variableIdx} 
            variables={variablesList} 
            yearIdx={yearIdx}
            years={CLIMATE_YEARS}
            updateLayer={updateLayer}
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
          variable={variablesList[variableIdx].id}
          year={CLIMATE_YEARS[yearIdx]}
          threshold={threshold}
          clickedLocal={clickedLocal}
          setClickedLocal={setClickedLocal}
          updateRiskData={updateRiskData}
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
        
        <ClickedInfoContent 
          clickedLocal={clickedLocal}
          riskData={riskData}
        />
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