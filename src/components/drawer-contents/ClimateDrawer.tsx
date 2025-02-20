import React from 'react'
import ClimateContent from './ClimateContent'

interface ClimateVariable {
  name: string
  id: string
}

// Props for our ClimateDrawer
interface ClimateDrawerProps {
  variableIdx: number | null
  variables: ClimateVariable[]
  yearIdx: number
  years: number[]
  spatialAggIdx: number
  spatialAggList: { id: string; name: string }[]
  setActiveSection: React.Dispatch<React.SetStateAction<'climate' | 'socio'>>
  updateLayer: (
    varIdx: number | null,
    yIdx: number | null,
    sIdx: number | null
  ) => void
  setBoundaryIdx: React.Dispatch<React.SetStateAction<number>>
}

const ClimateDrawer: React.FC<ClimateDrawerProps> = ({
  variableIdx,
  variables,
  yearIdx,
  years,
  spatialAggIdx,
  spatialAggList,
  setActiveSection,
  updateLayer,
  setBoundaryIdx,
}) => {
  return (
    <ClimateContent
      variableIdx={variableIdx}
      variables={variables}
      yearIdx={yearIdx}
      years={years}
      spatialAggIdx={spatialAggIdx}
      spatialAggList={spatialAggList}
      setActiveSection={setActiveSection}
      updateLayer={updateLayer}
      setBoundaryIdx={setBoundaryIdx}
    />
  )
}

export default ClimateDrawer
