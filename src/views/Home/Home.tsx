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
  
  // Climate
  const initialIdx = 2
  const initialOpacity = 0.8
  const initialBoundOpacity = 0.5
  
  const [climateVarsList, setClimateVarsList] = useState<{name: string, id: string, colors: number[], domain: number[]}[]>([])
  const [climateVarsItems, setClimateVarsItems] = useState<{name: string, id: string}[]>([])
  const [climateSpLvlList, setClimateSpLvlList] = useState<{ name: string, id: string }[]>([])
  const [climateTstampsList, setClimateTstampsList] = useState<number[]>([])

  const [yearIdx, setYearIdx]           = useState<number>(initialIdx)
  const [variableIdx, setVariableIdx]   = useState<number>(initialIdx)
  const [spatialAggIdx, setSpatialAggIdx]   = useState<number>(0)

  const [unitLevel, setUnitLevel] = useState<string>("pt")
  const [unitLevelList, setUnitLevelList] = useState<string[]>([])
  

  // Risk
  const [riskData, setRiskData] = useState<{ year: string, value: number}[]>([])
  
  const [activeDrawerBtn, setDrawerBtn] = useState<string | null>(null)
  const drawerBtns = ["Climate", "EV-Stations", "People"]
  
  // Stations
  const [showStations, setShowStations] = useState<boolean>(true)
  // const drawerBtns = ["Layers", "Home"]
  const [activeStation, setStation] = useState<string | null>(null)

  const [clickedLocal, setClickedLocal] = useState<{lat:number, lng: number, elevation: number | null} | null>(null)

  const [controlDrag, setControlDrag] = useState<boolean>(true)
  const [opacity, setOpacity] = useState<number>(initialOpacity)
  const [boundOpacity, setBoundOpacity] = useState<number>(initialBoundOpacity)

  const [boundariesList, setBoundariesList] = useState<{id: string, name: string }[]>([])
  const [boundaryIdx, setBoundaryIdx] = useState<number>(0)

  const [socioInfo, setSocioInfo] = useState<{name: string, value: string}[]>([])
  
  const [socioSpatialLevelList, setSocioSpatialLevelList] = useState<string[]>(["co", "ct"])
  const [socioVarIdx, setSocioVarIdx] = useState<number>(0)
  const [socioVarsList, setSocioVarsList] = useState<{name: string, id: string, colors: number[], domain: number[]}[]>([])
  const [socioVarsItems, setSocioVarsItems] = useState<{id: string, name: string }[]>([])

  const [activeSection, setActiveSection] = useState<"climate" | "socio">("climate")
  
  // ////////////////   UPDATE FUNCTIONS   ///////////////////////////////////////////

  const updateLayer = (varIdx: number | null, yIdx: number | null, sIdx: number | null) => {
    if(varIdx !== null) {
      if(climateVarsItems[varIdx].id !== "prcp") {
        setClickedLocal(null)
        setRiskData([])
      }
      setVariableIdx(varIdx)
      setActiveSection("climate")
    }

    if(yIdx !== null)  {
      setYearIdx(yIdx)
      setActiveSection("climate")
    }

    if(sIdx !== null)   {
      if (climateSpLvlList[sIdx].id !== "pt") {
        setBoundaryIdx(0)
        setClickedLocal(null)
        setRiskData([])
      }
      setSpatialAggIdx(sIdx)
    }
  }

  const updateSocioLayer = (varIdx: number | null, sIdx: number | null) => {
    if(varIdx !== null) {
      setSocioVarIdx(varIdx)
      setActiveSection("socio")
    }

  }

  // const updateRiskData = async (ptIdx: number | [number, number] | null, elevation: number | null) => {
  //   if(ptIdx) {
  //     const _riskData = await DataLoader.getRiskData(ptIdx)
  //     // setClickedLocal({ lat: ptIdx[0], lng: ptIdx[1], elevation: elevation })
  //     setRiskData(_riskData)
  //   }
  // }

  const updateRiskData = async (lat: number | null, lon: number | null, name: string | null) => {
    if(lat && lon && name) {
      const _riskData = await DataLoader.getRiskData(lat, lon)
      setRiskData(_riskData)
      setStation(name)
      
    } else {
      setRiskData([])
      setStation(null)
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
      const spIds = spLvlList.map((d: { id: string, name: string}) => d.id)

      setClimateSpLvlList(spLvlList)
      setUnitLevelList(spIds)

      // Climate Time Stamps
      const climateTsmps = await DataLoader.getClimateTimeStampsList()
      setClimateTstampsList(climateTsmps)

      // Socio
      const socioVars = await DataLoader.getSocioVariablesList()
      const socioIds = socioVars.map(({ colors, domain, ...rest }) => rest)
      setSocioVarsList(socioVars)
      setSocioVarsItems(socioIds)

      
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
              
              setActiveSection={setActiveSection}
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
              socioVariables={socioVarsItems}
              socioVarIdx={socioVarIdx}
              setSocioVarIdx={setSocioVarIdx}
              updateSocioLayer={updateSocioLayer}
 
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
    if(climateVarsList.length > 0 && climateTstampsList.length > 0) {
      let arr = activeSection === "climate"
        ? climateVarsList
        : socioVarsList

      return (
        <ColorBarWrapper display={() => variableIdx && yearIdx ? "block" : "none"} controlDrag={controlDrag} >
          <Row key={`row-map-legend-${arr[variableIdx].id}-${climateTstampsList[yearIdx]}`} style={{ marginTop:"5px" }}>
            <ColorBar 
              colorScheme={arr[variableIdx].colors} 
              legId= {`${arr[variableIdx].id}`} 
              domain= {arr[variableIdx].domain} 
              label={`${arr[variableIdx].name}`}/>
          </Row>
          <Row key="row-opacity" style={{ marginTop:"5px" }}>
            <MySlider title="Fill opacity"initialValue={initialOpacity} min={0.0} max={1.0} step={0.1} setControlDrag={setControlDrag} onChange={setOpacity}/>
          </Row>
          <Row key="row-boundary-opacity" style={{ marginTop:"5px" }}>
            <MySlider title="Boundary opacity" initialValue={initialBoundOpacity} min={0.0} max={1.0} step={0.1} setControlDrag={setControlDrag} onChange={setBoundOpacity}/>
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
          socioVariable={socioVarsItems.length > 0 ? socioVarsItems[socioVarIdx].id : null}
          showStations={showStations}
          spatialLevel={unitLevel}//{climateSpLvlList.length > 0 ? climateSpLvlList[spatialAggIdx].id : null}
          setSpatialLevel={setUnitLevel}
          clickedLocal={clickedLocal}
          opacity={opacity}
          boundOpacity={boundOpacity}
          boundaryId={boundariesList.length > 0 ? boundariesList[boundaryIdx].id : "None"}
          activeSection={activeSection}
          setSocioInfo={setSocioInfo}
          setClickedLocal={setClickedLocal}
          updateRiskData={updateRiskData}
          updateSocioLayer={updateSocioLayer}
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
        // clickedLocal={clickedLocal} 
        // setClickedLocal={setClickedLocal}
        clickedLocal={activeStation} 
        setClickedLocal={setStation}
        >
        
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