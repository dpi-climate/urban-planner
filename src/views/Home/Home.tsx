import "./Home.css"
import React, { useCallback, useEffect, useState, useRef } from "react"

import Map from "../../components/map/Map"
import ElementWrapper from "../../components/element-wrapper/ElementWrapper"
import DrawerWrapper from "../../components/drawer-wrapper/DrawerWrapper"

import ClimateContent from "../../components/drawer-contents/ClimateContent"
import EVContent from "../../components/drawer-contents/EVContent"
import PeopleContent from "../../components/drawer-contents/PeopleContent"
import ClickedInfoContent from "../../components/drawer-contents/ClickedInfoContent"

import { DataLoader } from "../../data-loader/DataLoader"
import ColorBarWrapper from "../../components/map/ColorBarWrapper"
import { Row } from "react-bootstrap"
import ColorBar from "../../components/map/ColorBar"

import MySlider from "../../components/map/MySlider"

const Home = () => {
 
  // /////////////////////////////////////////////////////////////////////////////////
  // ////////////////   CLIMATE CONTENT   ////////////////////////////////////////////
  const initialIdx = 2
  
  const [climateVarsList, setClimateVarsList] = useState<{name: string, id: string, colors: number[], domain: number[]}[]>([])
  const [climateVarsItems, setClimateVarsItems] = useState<{name: string, id: string}[]>([])
  const [climateSpLvlList, setClimateSpLvlList] = useState<{ name: string, id: string }[]>([])
  const [climateTstampsList, setClimateTstampsList] = useState<number[]>([])

  const [yearIdx, setYearIdx]           = useState<number>(initialIdx)
  const [variableIdx, setVariableIdx]   = useState<number>(initialIdx)
  const [spatialAggIdx, setSpatialAggIdx]   = useState<number>(0)
  
  const [riskData, setRiskData] = useState<{ year: string, value: number}[]>([])
  
  const [activeDrawerBtn, setDrawerBtn] = useState<string | null>(null)
  const drawerBtns = ["Climate", "EV-Stations", "People"]
  // const drawerBtns = ["Layers", "Home"]

  const [showStations, setShowStations] = useState<boolean>(false)

  const [clickedLocal, setClickedLocal] = useState<{lat:number, lng: number, elevation: number | null} | null>(null)

  const [controlDrag, setControlDrag] = useState<boolean>(true)
  const [opacity, setOpacity] = useState<number>(1.0)
  const [boundOpacity, setBoundOpacity] = useState<number>(1.0)

  const [boundariesList, setBoundariesList] = useState<{id: string, name: string }[]>([])
  const [boundaryIdx, setBoundaryIdx] = useState<number>(1)

  const [socioInfo, setSocioInfo] = useState<{name: string, value: string}[]>([])
  
  // ////////////////   UPDATE FUNCTIONS   ///////////////////////////////////////////

  const updateLayer = (varIdx: number | null, yIdx: number | null, sIdx: number | null) => {
    if(varIdx !== null) {
      if(climateVarsItems[varIdx].id !== "prcp") {
        setClickedLocal(null)
        setRiskData([])
      }
      setVariableIdx(varIdx)
    }

    if(yIdx !== null)   setYearIdx(yIdx)
    if(sIdx !== null)   {
      if (climateSpLvlList[sIdx].id !== "pt") {
        setBoundaryIdx(0)
        setClickedLocal(null)
        setRiskData([])
      }
      setSpatialAggIdx(sIdx)
    }
  }

  const updateRiskData = async (ptIdx: number | [number, number] | null, elevation: number | null) => {
    if(ptIdx) {
      const _riskData = await DataLoader.getRiskData(ptIdx)
      // setClickedLocal({ lat: ptIdx[0], lng: ptIdx[1], elevation: elevation })
      setRiskData(_riskData)
    }
  }

  // ////////////////   USE EFFECT   ///////////////////////////////////////////

  const setClimateVarsCallback = useCallback(() => {
    ( async () => {

      // Climate Vars
      const vList = await DataLoader.getClimateVariablesList()
      const vItems = vList.map(({ colors, domain, ...rest }) => rest)
      
      setClimateVarsList(vList)
      setClimateVarsItems(vItems)

      // Climate Spatial Levels
      const spLvlList = await DataLoader.getClimateSpatialLevelList()
      setClimateSpLvlList(spLvlList)

      // Climate Time Stamps
      const climateTsmps = await DataLoader.getClimateTimeStampsList()
      setClimateTstampsList(climateTsmps)

      
    })()

  },[setClimateVarsList])

  useEffect(() => {
    (async () => {
      const bl = await DataLoader.getBoundariesList()
      setBoundariesList(bl)
    })()
  },[])

  useEffect(() => setClimateVarsCallback(), [setClimateVarsCallback])
  
  // /////////////////////////////////////////////////////////////////////////////////
  // ////////////////   RENDER FUNCTIONS   ///////////////////////////////////////////
  
  const renderMenu = () => {
    if(climateVarsItems.length > 0) {
      return  (
        <DrawerWrapper anchor={"right"} buttons={drawerBtns} setBtn={setDrawerBtn}>
          {activeDrawerBtn === 'Climate' && 
            <ClimateContent 
              variableIdx={variableIdx} 
              variables={climateVarsItems} 
              yearIdx={yearIdx}
              years={climateTstampsList}
              spatialAggIdx={spatialAggIdx}
              spatialAggList={climateSpLvlList}
              boundaryIdx={boundaryIdx}
              boundariesList={boundariesList}
              
              setBoundOpacity={setBoundOpacity}
              updateLayer={updateLayer}
              setBoundaryIdx={setBoundaryIdx}
              />}
            {activeDrawerBtn === 'EV-Stations' && 
            <EVContent 
              showStations={showStations}
              setShowStations={setShowStations}
              
              />}
              {activeDrawerBtn === 'People' && 
              <PeopleContent 
                // showStations={showStations}
                // setShowStations={setShowStations}
              />}
              
        </DrawerWrapper>
      )
    } else {
      return (
        <DrawerWrapper anchor={"right"} buttons={drawerBtns} setBtn={setDrawerBtn}></DrawerWrapper>
      )
    }
  }

  const renderColorMapWrapper = () => {
    if(climateVarsItems.length > 0 && climateVarsList.length > 0 && climateTstampsList.length > 0) {
      return (
        <ColorBarWrapper display={() => variableIdx && yearIdx ? "block" : "none"} controlDrag={controlDrag} >
          <Row key={`row-map-legend-${climateVarsItems[variableIdx].id}-${climateTstampsList[yearIdx]}`} style={{ marginTop:"5px" }}>
            <ColorBar 
              colorScheme={climateVarsList[variableIdx].colors} 
              legId= {`${climateVarsItems[variableIdx].id}`} 
              domain= {climateVarsList[variableIdx].domain} 
              label={`${climateVarsItems[variableIdx].name}`}/>
          </Row>
          <Row key="row-opacity" style={{ marginTop:"5px" }}>
            <MySlider title="Fill opacity"initialValue={1.0} min={0.0} max={1.0} step={0.1} setControlDrag={setControlDrag} onChange={setOpacity}/>
          </Row>
          <Row key="row-boundary-opacity" style={{ marginTop:"5px" }}>
            <MySlider title="Boundary opacity" initialValue={1.0} min={0.0} max={1.0} step={0.1} setControlDrag={setControlDrag} onChange={setBoundOpacity}/>
          </Row>
        </ColorBarWrapper>
      )

    } else {
      return null
    }
  }

  const renderMap = () => {
    return (
      
      <ElementWrapper height='95vh'>
        <Map 
          style="mapbox://styles/carolvfs/clxnzay8z02qh01qkhftqheen" 
          center={[-89.12987909766366, 40.09236099826568] as [number, number]}
          zoom={6}
          variable={climateVarsItems.length > 0 ? climateVarsItems[variableIdx].id : null}
          year={climateTstampsList.length > 0 ? climateTstampsList[yearIdx] : null}
          showStations={showStations}
          spatialLevel={climateSpLvlList.length > 0 ? climateSpLvlList[spatialAggIdx].id : null}
          clickedLocal={clickedLocal}
          opacity={opacity}
          boundOpacity={boundOpacity}
          boundaryId={boundariesList.length > 0 ? boundariesList[boundaryIdx].id : "None"}
          setSocioInfo={setSocioInfo}
          setClickedLocal={setClickedLocal}
          updateRiskData={updateRiskData}
        />
      </ElementWrapper>
    )
  }

  const renderMapElementWrapper = () => {
    return (
      // <ElementWrapper width='1850px' height='800px' right='-100px'>
      // <ElementWrapper height='95vh'>
      // <ElementWrapper width='1850px' height='800px' right='0px'>
      <ElementWrapper height='95vh'>
        {renderMap()}
        {renderColorMapWrapper()}
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
          socioInfo={socioInfo}
        />
      </DrawerWrapper>
    )
  }

  const renderHeader = () => {
    return (
      <ElementWrapper width='1850px' height='100px' right='0px'>

      </ElementWrapper>
      // <div className="logo-container">
      //   <img className="climate-logo" src="/new-climate-logo-background.png" alt="climate-logo"/>
      //   <img className="cleets-logo" src="/cleets-logo.png" alt="cleets-logo" />
      // </div>
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
        { renderMapElementWrapper() }
        {renderInfoDrawer()}
        {renderLogos()}
      </div>
    )
  }

  return render()
}

export default Home