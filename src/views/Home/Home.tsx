import "./Home.css"
import React, { useCallback, useEffect, useState, useRef } from "react"

import Map from "../../components/map/Map"
import ElementWrapper from "../../components/element-wrapper/ElementWrapper"
import DrawerWrapper from "../../components/drawer-wrapper/DrawerWrapper"

import ClimateContent from "../../components/drawer-contents/ClimateContent"
import ClickedInfoContent from "../../components/drawer-contents/ClickedInfoContent"
import EVContent from "../../components/drawer-contents/EVContent"

import { CLIMATE_VARIABLES, CLIMATE_YEARS } from "../../consts/consts"
import { DataLoader } from "../../data-loader/DataLoader"
import ColorBarWrapper from "../../components/map/ColorBarWrapper"
import { Row } from "react-bootstrap"
import ColorBar from "../../components/map/ColorBar"

import MySlider from "../../components/map/MySlider"

const Home = () => {
 
  // /////////////////////////////////////////////////////////////////////////////////
  // ////////////////   CLIMATE CONTENT   ////////////////////////////////////////////
  const initialIdx = 0
  
  // const variablesList = CLIMATE_VARIABLES.map(({ threshold, ...rest }) => rest)
  const variablesList = CLIMATE_VARIABLES.map(({ colors, domain, ...rest }) => rest)
  const spatialAggList = [{ name: "Points", id: "" }, { name: "Census Tract", id: "ct" }]
  
  const [yearIdx, setYearIdx]           = useState<number>(initialIdx)
  const [variableIdx, setVariableIdx]   = useState<number>(initialIdx)
  const [spatialAggIdx, setSpatialAggIdx]   = useState<number>(initialIdx)
  // const [spatialAggIdx, setSpatialAggIdx]   = useState<number>(1)
  

  const [riskData, setRiskData] = useState<{ year: string, value: number}[]>([])
  
  const [activeDrawerBtn, setDrawerBtn] = useState<string | null>(null)
  const drawerBtns = ["Layers", "EV-Stations"]
  // const drawerBtns = ["Layers", "Home"]

  const [showStations, setShowStations] = useState<boolean>(true)

  const [clickedLocal, setClickedLocal] = useState<{lat:number, lng: number, elevation: number | null} | null>(null)
  const [colorBarProps, setColorBarProps] = useState({ colors: CLIMATE_VARIABLES[initialIdx].colors, domain: CLIMATE_VARIABLES[initialIdx].domain})

  const [controlDrag, setControlDrag] = useState<boolean>(true)
  const [opacity, setOpacity] = useState<number>(1.0)
  
  // ////////////////   UPDATE FUNCTIONS   ///////////////////////////////////////////


  const updateLayer = (varIdx: number | null, yIdx: number | null, sIdx: number | null) => {
    
    
    if(varIdx !== null) {
      setVariableIdx(varIdx)

      if(variablesList[varIdx].id !== "prcp") {
        setClickedLocal(null)
        setRiskData([])
      }
    
    }

    if(yIdx !== null)   setYearIdx(yIdx)
    if(sIdx !== null)   setSpatialAggIdx(sIdx)

  }

  const updateRiskData = async (ptIdx: number | [number, number], elevation: number | null) => {
    const _riskData = await DataLoader.getRiskData(ptIdx)
    // setClickedLocal({ lat: ptIdx[0], lng: ptIdx[1], elevation: elevation })
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
            spatialAggIdx={spatialAggIdx}
            spatialAggList={spatialAggList}
            updateLayer={updateLayer}
            />}
          {activeDrawerBtn === 'EV-Stations' && 
          <EVContent 
            showStations={showStations}
            setShowStations={setShowStations}
            
            />}
            
      </DrawerWrapper>
    )
  }

  const renderMap = () => {
    return (
      // <ElementWrapper width='1850px' height='800px' right='-100px'>
      // <ElementWrapper height='95vh'>
      // <ElementWrapper width='1850px' height='800px' right='0px'>
      <ElementWrapper height='95vh'>
        <Map 
          style="mapbox://styles/carolvfs/clxnzay8z02qh01qkhftqheen" 
          center={[-89.12987909766366, 40.09236099826568] as [number, number]}
          zoom={6}
          variable={variablesList[variableIdx].id}
          year={CLIMATE_YEARS[yearIdx]}
          showStations={showStations}
          spatialLevel={spatialAggList[spatialAggIdx].id}
          clickedLocal={clickedLocal}
          opacity={opacity}
          setClickedLocal={setClickedLocal}
          updateRiskData={updateRiskData}
        />
        <ColorBarWrapper display={() => variableIdx && yearIdx ? "block" : "none"} controlDrag={controlDrag} >
          <Row key={`row-map-legend-${variablesList[variableIdx].id}-${CLIMATE_YEARS[yearIdx]}`} style={{ marginTop:"5px" }}>
            <ColorBar 
              colorScheme={CLIMATE_VARIABLES[variableIdx].colors} 
              legId= {`${variablesList[variableIdx].id}`} 
              domain= {CLIMATE_VARIABLES[variableIdx].domain} 
              label={`${variablesList[variableIdx].name}`}/>
          </Row>
          <Row key="row-opacity" style={{ marginTop:"5px" }}>
            <MySlider initialValue={1.0} min={0.0} max={1.0} step={0.1} setControlDrag={setControlDrag} onChange={setOpacity}/>
          </Row>
        </ColorBarWrapper>
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

  const renderLogos = () => {
    return (
      <div className="logo-container">
        <img className="climate-logo" src="/new-climate-logo-background.png" alt="climate-logo"/>
        <img className="cleets-logo" src="/cleets-logo.png" alt="cleets-logo" />
      </div>
    )
  }

  const render = () => {
    return (
      <div className="home">
        { renderMenu() }
        { renderMap() }
        {renderInfoDrawer()}
        {renderLogos()}
      </div>
    )
  }

  return render()
}

export default Home