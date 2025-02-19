// src/components/controls/ClimateControls.tsx
import React from "react";
import ClimateContent from "../../components/drawer-contents/ClimateContent";

interface ClimateControlsProps {
  variableIdx: number;
  variables: { name: string; id: string; colors: number[]; domain: number[] }[];
  yearIdx: number;
  years: number[];
  spatialAggIdx: number;
  spatialAggList: { name: string; id: string }[];
  boundaryIdx: number;
  boundariesList: { id: string; name: string }[];
  setActiveSection: (section: "climate" | "socio") => void;
  setBoundOpacity: (opacity: number) => void;
  updateLayer: (varIdx: number | null, yIdx: number | null, sIdx: number | null) => void;
  setBoundaryIdx: (idx: number) => void;
}

const ClimateControls: React.FC<ClimateControlsProps> = (props) => {
  return (
    <ClimateContent
      variableIdx={props.variableIdx}
      variables={props.variables}
      yearIdx={props.yearIdx}
      years={props.years}
      spatialAggIdx={props.spatialAggIdx}
      spatialAggList={props.spatialAggList}
      boundaryIdx={props.boundaryIdx}
      boundariesList={props.boundariesList}
      setActiveSection={props.setActiveSection}
      setBoundOpacity={props.setBoundOpacity}
      updateLayer={props.updateLayer}
      setBoundaryIdx={props.setBoundaryIdx}
    />
  );
};

export default ClimateControls;
