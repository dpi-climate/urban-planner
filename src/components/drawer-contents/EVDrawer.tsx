import React from 'react'
import EVContent from './EVContent'

type StationType = 'electric' | 'biodiesel' | 'ethanol' | 'cng' | 'lng' | 'lpg'

interface EVDrawerProps {
  showStations: boolean
  setShowStations: React.Dispatch<React.SetStateAction<boolean>>
  activeStations: StationType[]
  setStations: React.Dispatch<React.SetStateAction<StationType[]>>
}

const EVDrawer: React.FC<EVDrawerProps> = ({
  showStations,
  setShowStations,
  activeStations,
  setStations,
}) => {
  return (
    <EVContent
      showStations={showStations}
      setShowStations={setShowStations}
      activeStations={activeStations}
      setStations={setStations}
    />
  )
}

export default EVDrawer
