import React, { useState } from 'react'
import ElementWrapper from '../element-wrapper/ElementWrapper'
import Map from './Map'
import ColorBarWrapper from './ColorBarWrapper'
import ColorBar from './ColorBar'
import MySlider from './MySlider'
import { Row } from 'react-bootstrap'
import { StationType } from '../../types-and-interfaces/types'

interface MapWrapperProps {
  climateVarsList: { name: string; id: string; colors: number[]; domain: number[] }[]
  climateVarsItems: { name: string; id: string }[]
  socioVarsList: { name: string; id: string; colors: number[]; domain: number[] }[]
  socioVarsItems: { name: string; id: string }[]
  climateTstampsList: number[]
  socioVarIdx: number
  variableIdx: number
  yearIdx: number
  activeSection: 'climate' | 'socio'
  showStations: boolean
  activeStations: StationType[]
  boundaryIdx: number
  boundariesList: { id: string; name: string }[]
  clickedLocal: { lat: number; lng: number; elevation: number | null } | null
  activeStation: string | null
  socioInfo: { name: string; value: string }[]
  setSocioInfo: React.Dispatch<React.SetStateAction<any>>
  setClickedLocal: React.Dispatch<React.SetStateAction<any>>
  updateRiskData: (lat: number | null, lon: number | null, name: string | null) => Promise<void>
  updateSocioLayer: (varIdx: number | null, sIdx: number | null) => void
}

const MapWrapper: React.FC<MapWrapperProps> = ({
  climateVarsList,
  climateVarsItems,
  socioVarsList,
  socioVarsItems,
  climateTstampsList,
  socioVarIdx,
  variableIdx,
  yearIdx,
  activeSection,
  showStations,
  activeStations,
  boundaryIdx,
  boundariesList,
  clickedLocal,
  activeStation,
  socioInfo,
  setSocioInfo,
  setClickedLocal,
  updateRiskData,
  updateSocioLayer,
}) => {

  const [controlDrag, setControlDrag] = useState<boolean>(true)

  const [opacity, setOpacity] = useState<number>(0.8)
  const [boundOpacity, setBoundOpacity] = useState<number>(0.5)

  const renderMap = () => {
    return (
      <ElementWrapper height="100%">
        <Map
          style="mapbox://styles/mapbox/standard-satellite"
          center={[-89.129879, 40.092361]}
          zoom={6}
          variable={climateVarsItems?.[variableIdx]?.id || null}
          year={climateTstampsList?.[yearIdx] || null}
          socioVariable={socioVarsItems?.[socioVarIdx]?.id || null}
          showStations={showStations}
          activeSection={activeSection}
          activeStations={activeStations}
          clickedLocal={clickedLocal}
          opacity={opacity}
          boundOpacity={boundOpacity}
          boundaryId={boundariesList?.[boundaryIdx]?.id || 'None'}
          setSocioInfo={setSocioInfo}
          setClickedLocal={setClickedLocal}
          updateRiskData={updateRiskData}
          updateSocioLayer={updateSocioLayer}
        />
      </ElementWrapper>
    )
  }

  const renderColorMapWrapper = () => {
    const arr = activeSection === 'climate' ? climateVarsList : socioVarsList
    const idx = variableIdx ? variableIdx : socioVarIdx

    if (!arr?.[idx]) return null

    return (
      <ColorBarWrapper display="block" controlDrag={controlDrag}>
        {/* <Row key={`row-map-legend-${arr[variableIdx].id}-${climateTstampsList[yearIdx]}`} style={{ marginTop: '5px' }}> */}
        <Row key={`row-map-legend-${arr[idx].id}-`} style={{ marginTop: '5px' }}>
          <ColorBar
            colorScheme={arr[idx].colors}
            legId={arr[idx].id}
            domain={arr[idx].domain}
            label={arr[idx].name}
          />
        </Row>

        <Row style={{ marginTop: '5px' }}>
          <MySlider
            title="Fill opacity"
            value={opacity}
            min={0}
            max={1}
            step={0.1}
            onChange={setOpacity}
            setControlDrag={setControlDrag}
          />
        </Row>

        <Row key="row-boundary-opacity" style={{ marginTop: '5px' }}>
          <MySlider
            title="Boundary opacity"
            value={boundOpacity}
            min={0}
            max={1}
            step={0.1}
            onChange={setBoundOpacity}
            setControlDrag={setControlDrag}
          />
        </Row>
      </ColorBarWrapper>
    )
  }

  return (
    <>
      {renderMap()}
      {renderColorMapWrapper()}
    </>
  )
}

export default MapWrapper
