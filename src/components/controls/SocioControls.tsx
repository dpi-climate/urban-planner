import React from "react";
import PeopleContent from "../drawer-contents/PeopleContent";

interface SocioControlsProps {
  socioVariables: { id: string; name: string }[];
  socioVarIdx: number;
  setSocioVarIdx: (idx: number) => void;
  updateSocioLayer: (varIdx: number | null, sIdx: number | null) => void;
}

const SocioControls: React.FC<SocioControlsProps> = (props) => {
  return (
    <PeopleContent
      socioVariables={props.socioVariables}
      socioVarIdx={props.socioVarIdx}
      setSocioVarIdx={props.setSocioVarIdx}
      updateSocioLayer={props.updateSocioLayer}
    />
  );
};

export default SocioControls;
