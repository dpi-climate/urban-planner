import React from 'react'
import PeopleContent from './PeopleContent'

interface PeopleVariable {
  id: string
  name: string
}

interface PeopleDrawerProps {
  socioVariables: PeopleVariable[]
  socioVarIdx: number | null
  setSocioVarIdx: React.Dispatch<React.SetStateAction<number | null>>
  updateSocioLayer: (varIdx: number | null, sIdx: number | null) => void
}

const PeopleDrawer: React.FC<PeopleDrawerProps> = ({
  socioVariables,
  socioVarIdx,
  setSocioVarIdx,
  updateSocioLayer,
}) => {
  return (
    <PeopleContent
      socioVariables={socioVariables}
      socioVarIdx={socioVarIdx}
      setSocioVarIdx={setSocioVarIdx}
      updateSocioLayer={updateSocioLayer}
    />
  )
}

export default PeopleDrawer
