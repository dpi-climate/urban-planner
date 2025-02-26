import "./Home.css"
import React, { useCallback, useEffect, useState } from "react"

import DrawerWrapper from "../../components/drawer-wrapper/DrawerWrapper"

import ClickedInfoContent from "../../components/drawer-contents/ClickedInfoContent"

import { DataLoader } from "../../data-loader/DataLoader"

import { StationType, RiskDataType } from "../../types-and-interfaces/types"
import MapWrapper from "../../components/map/MapWrapper"

import ClimateDrawer from "../../components/drawer-contents/ClimateDrawer"
import EVDrawer from "../../components/drawer-contents/EVDrawer"
import PeopleDrawer from "../../components/drawer-contents/PeopleDrawer"

const Home = () => {
  // /////////////////////////////////////////////////////////////////////////////////
  // ////////////////   CLIMATE CONTENT   ////////////////////////////////////////////
  
  // Climate
  const initialIdx = 2

  // const stationTypes = ["electric", "biodiesel", "ethanol", "cng", "lng"]
  
  const [climateVarsList, setClimateVarsList] = useState<{name: string, id: string, colors: number[], domain: number[]}[]>([])
  const [climateVarsItems, setClimateVarsItems] = useState<{name: string, id: string}[]>([])
  const [climateSpLvlList, setClimateSpLvlList] = useState<{ name: string, id: string }[]>([])
  const [climateTstampsList, setClimateTstampsList] = useState<number[]>([])

  const [yearIdx, setYearIdx]           = useState<number>(initialIdx)
  const [variableIdx, setVariableIdx]   = useState<number | null>(initialIdx)
  const [spatialAggIdx, setSpatialAggIdx]   = useState<number>(0)  

  // Risk
  const [riskData, setRiskData] = useState<RiskDataType>([])
  const [infoDrawerIsOpen, setInfoDrawerIsOpen] = useState<boolean>(false)
  
  // Menu
  const [activeDrawerBtn, setDrawerBtn] = useState<string | null>(null)
  const drawerBtns = ["Climate", "Structure", "People"]
  
  // Stations
  const [showStations, setShowStations] = useState<boolean>(true)
  const [activeStations, setStations] = useState<StationType[]>([])


  // const drawerBtns = ["Layers", "Home"]
  const [activeStation, setStation] = useState<string | null>(null)

  const [clickedLocal, setClickedLocal] = useState<{lat:number, lng: number, elevation: number | null} | null>(null)

  

  const [boundariesList, setBoundariesList] = useState<{id: string, name: string }[]>([])
  const [boundaryIdx, setBoundaryIdx] = useState<number>(0)

  const [socioInfo, setSocioInfo] = useState<{name: string, value: string}[]>([])
  
  const [socioVarIdx, setSocioVarIdx] = useState<number | null>(null)
  const [socioVarsList, setSocioVarsList] = useState<{name: string, id: string, colors: number[], domain: number[]}[]>([])
  const [socioVarsItems, setSocioVarsItems] = useState<{id: string, name: string }[]>([])

  const [activeSection, setActiveSection] = useState<"climate" | "socio">("climate")
  
  // ////////////////   UPDATE FUNCTIONS   ///////////////////////////////////////////

  const updateLayer = (varIdx: number | "" | null, yIdx: number | null, sIdx: number | null) => {
    
    if(varIdx !== null) {
      if (varIdx === "") {
        setVariableIdx(null)
        
      } else {
        setVariableIdx(varIdx)
      }
      
      setActiveSection("climate")
    }
    
    if(yIdx !== null)  {
      setYearIdx(yIdx)
      setActiveSection("climate")
    }
    
    if(sIdx !== null)   {
      if (climateSpLvlList[sIdx].id !== "pt") {
        setBoundaryIdx(0)
        // setClickedLocal(null)
        // setRiskData([])
      }
      setSpatialAggIdx(sIdx)
    }
    
    // setClickedLocal(null)
    setRiskData([])
    setSocioVarIdx(null)
  }

  const updateSocioLayer = (varIdx: number | "" | null, sIdx: number | null) => {
    if(varIdx !== null) {
      if (varIdx === "") {
        setSocioVarIdx(null)

      } else {
        setVariableIdx(null)
        setSocioVarIdx(varIdx)
        setActiveSection("socio")
      }
    }

    // setClickedLocal(null)
    setRiskData([])

  }

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
      // const spIds = spLvlList.map((d: { id: string, name: string}) => d.id)

      setClimateSpLvlList(spLvlList)

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
    return (
      <DrawerWrapper anchor="right" buttons={drawerBtns} setBtn={setDrawerBtn} setRiskData={setRiskData}>
        {activeDrawerBtn === 'Climate' && (
          <ClimateDrawer
            variableIdx={variableIdx}
            variables={climateVarsItems}
            yearIdx={yearIdx}
            years={climateTstampsList}
            spatialAggIdx={spatialAggIdx}
            spatialAggList={climateSpLvlList}
            setActiveSection={setActiveSection}
            updateLayer={updateLayer}
            setBoundaryIdx={setBoundaryIdx}
          />
        )}

        {activeDrawerBtn === 'Structure' && (
          <EVDrawer
            showStations={showStations}
            setShowStations={setShowStations}
            activeStations={activeStations}
            setStations={setStations}
          />
        )}

        {activeDrawerBtn === 'People' && (
          <PeopleDrawer
            socioVariables={socioVarsItems}
            socioVarIdx={socioVarIdx}
            setSocioVarIdx={setSocioVarIdx}
            updateSocioLayer={updateSocioLayer}
          />
        )}
      </DrawerWrapper>
    )
  }

  const renderInfoDrawer = () => {
    return (
      <DrawerWrapper 
        anchor={"bottom"}
        riskData={riskData}
        setRiskData={setRiskData}
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
      <div className="my-header">
        <div className="header-text">Flood Risks on Fuel Stations for the State of Illinois</div>
        <div className="logo-container">
          <img className="climate-logo" src="/new-climate-logo-background.png" alt="climate-logo"/>
          <img className="cleets-logo" src="/cleets logo-01.png" alt="cleets-logo" />
        </div>
      </div>
    )
  }

  const render = () => {
    return (
      <>
       {renderHeader()}
      <div className="content">
        <div className="home">
          { renderMenu() }
          <MapWrapper
            climateVarsList={climateVarsList}
            climateVarsItems={climateVarsItems}
            socioVarsList={socioVarsList}
            socioVarsItems={socioVarsItems}
            climateTstampsList={climateTstampsList}
            socioVarIdx={socioVarIdx}
            variableIdx={variableIdx}
            yearIdx={yearIdx}
            activeSection={activeSection}
            showStations={showStations}
            activeStations={activeStations}
            boundaryIdx={boundaryIdx}
            boundariesList={boundariesList}
            clickedLocal={clickedLocal}
            activeStation={activeStation}
            socioInfo={socioInfo}
            setSocioInfo={setSocioInfo}
            setClickedLocal={setClickedLocal}
            updateRiskData={updateRiskData}
            updateSocioLayer={updateSocioLayer}
          />
          {renderInfoDrawer()}
        </div>
        
      </div>
      </>
    )
  }

  return render()
}

export default Home