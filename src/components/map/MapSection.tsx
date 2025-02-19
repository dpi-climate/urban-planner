// src/components/map/MapSection.tsx
import React from "react";
import ElementWrapper from "../element-wrapper/ElementWrapper";
import Map from "./Map";
import ColorBarWrapper from "./ColorBarWrapper";
import { Row } from "react-bootstrap";
import ColorBar from "./ColorBar";
import MySlider from "./MySlider";

interface MapSectionProps {
  // Map configuration
  center: [number, number];
  zoom: number;
  // Climate props
  climateVarsItems: { name: string; id: string; colors: number[]; domain: number[] }[];
  climateTstampsList: number[];
  variableIdx: number;
  yearIdx: number;
  // Socio props
  socioVarsItems: { name: string; id: string; colors: number[]; domain: number[] }[];
  socioVarIdx: number;
  // Visibility & controls
  showStations: boolean;
  spatialLevel: string;
  setSpatialLevel: (level: string) => void;
  clickedLocal: { lat: number; lng: number; elevation: number | null } | null;
  boundariesList: { id: string; name: string }[];
  boundaryIdx: number;
  activeSection: "climate" | "socio";
  activeStations: string[];
  setSocioInfo: (info: { name: string; value: string }[]) => void;
  setClickedLocal: (local: { lat: number; lng: number; elevation: number | null } | null) => void;
  updateRiskData: (lat: number | null, lon: number | null, name: string | null) => Promise<void>;
  updateSocioLayer: (varIdx: number | null, sIdx: number | null) => void;
  // Opacity and slider controls
  initialOpacity: number;
  initialBoundOpacity: number;
  controlDrag: boolean;
  setControlDrag: (drag: boolean) => void;
  opacity: number;
  setOpacity: (val: number) => void;
  boundOpacity: number;
  setBoundOpacity: (val: number) => void;
}

const MapSection: React.FC<MapSectionProps> = (props) => {
  // For the color legend, choose based on active section.
  const colorSource = props.activeSection === "climate" ? props.climateVarsItems : props.socioVarsItems;

  return (
    <ElementWrapper height="95vh">
      <Map
        style="mapbox://styles/carolvfs/clxnzay8z02qh01qkhftqheen"
        center={props.center}
        zoom={props.zoom}
        variable={
          props.climateVarsItems.length > 0 ? props.climateVarsItems[props.variableIdx].id : null
        }
        year={
          props.climateTstampsList.length > 0 ? props.climateTstampsList[props.yearIdx] : null
        }
        socioVariable={
          props.socioVarsItems.length > 0 ? props.socioVarsItems[props.socioVarIdx].id : null
        }
        showStations={props.showStations}
        spatialLevel={props.spatialLevel}
        setSpatialLevel={props.setSpatialLevel}
        clickedLocal={props.clickedLocal}
        opacity={props.opacity}
        boundOpacity={props.boundOpacity}
        boundaryId={
          props.boundariesList.length > 0 ? props.boundariesList[props.boundaryIdx].id : "None"
        }
        activeSection={props.activeSection}
        activeStations={props.activeStations}
        setSocioInfo={props.setSocioInfo}
        setClickedLocal={props.setClickedLocal}
        updateRiskData={props.updateRiskData}
        updateSocioLayer={props.updateSocioLayer}
      />
      <ColorBarWrapper display={() => (props.variableIdx && props.yearIdx ? "block" : "none")} controlDrag={props.controlDrag}>
        <Row key={`row-map-legend-${colorSource[props.variableIdx].id}-${props.climateTstampsList[props.yearIdx]}`} style={{ marginTop: "5px" }}>
          <ColorBar
            colorScheme={colorSource[props.variableIdx].colors}
            legId={`${colorSource[props.variableIdx].id}`}
            domain={colorSource[props.variableIdx].domain}
            label={`${colorSource[props.variableIdx].name}`}
          />
        </Row>
        <Row key="row-opacity" style={{ marginTop: "5px" }}>
          <MySlider
            title="Fill opacity"
            initialValue={props.initialOpacity}
            min={0.0}
            max={1.0}
            step={0.1}
            setControlDrag={props.setControlDrag}
            onChange={props.setOpacity}
          />
        </Row>
        <Row key="row-boundary-opacity" style={{ marginTop: "5px" }}>
          <MySlider
            title="Boundary opacity"
            initialValue={props.initialBoundOpacity}
            min={0.0}
            max={1.0}
            step={0.1}
            setControlDrag={props.setControlDrag}
            onChange={props.setBoundOpacity}
          />
        </Row>
      </ColorBarWrapper>
    </ElementWrapper>
  );
};

export default MapSection;
