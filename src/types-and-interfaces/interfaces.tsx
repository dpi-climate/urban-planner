import { Dispatch, SetStateAction } from "react"
import { Anchor, RiskDataType } from "./types"

export interface DrawerWrapperProps {
  anchor: Anchor
  buttons?: string[]
  setBtn?: React.Dispatch<SetStateAction<string | null>>;//Dispatch<SetStateAction<string | null>>
  children?: React.ReactNode
  clickedLocal?: string | null
  setClickedLocal?: React.Dispatch<SetStateAction<string | null>>
}

export interface DrawerWrapperContentProps {
  updateLayer: (varIdx: number | null, yIdx: number | null, sIdx: number | null ) => void
  variableIdx: number
  years: string[]
  yearIdx: number
  variables: {name: string, id: string}[]
  spatialAggIdx: number
  spatialAggList: {name: string, id: string}[]
}

export interface InfoContentProps {
  clickedLocal: {lat:number, lng: number, elevation: number | null} | null
  riskData: RiskDataType
  socioInfo: {name: string, value: string}[]
}