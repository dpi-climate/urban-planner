import { Dispatch, SetStateAction } from "react"
import { Anchor, RiskDataType } from "./types"

export interface DrawerWrapperProps {
  anchor: Anchor
  clickedLocal?: {lat:number, lng: number, elevation: number | null} | null
  // setClickedLocal?: Dispatch<SetStateAction<{ lat: number; lng: number; elevation: number | null; } | null>>
  setClickedLocal: React.Dispatch<SetStateAction<{ lat: number; lng: number; elevation: number | null } | null>>;
  buttons?: string[]
  setBtn?: React.Dispatch<SetStateAction<{ lat: number; lng: number; elevation: number | null } | null>>;//Dispatch<SetStateAction<string | null>>
  children?: React.ReactNode
}

export interface DrawerWrapperContentProps {
  updateLayer: (varIdx: number | null, yIdx: number | null, sIdx: number | null ) => void
  variableIdx: number
  years: string[]
  yearIdx: number
  variables: {name: string, id: string}[]
  spatialAggIdx: number
  spatialAggList: {name: string, id: string}[]
  boundariesList: {name: string, id: string}[]
  boundaryIdx: number
  setBoundOpacity: React.Dispatch<SetStateAction<number>>
  setBoundaryIdx: React.Dispatch<SetStateAction<number>>
}

export interface InfoContentProps {
  clickedLocal: {lat:number, lng: number, elevation: number | null} | null
  riskData: RiskDataType
  socioInfo: {name: string, value: string}[]
}