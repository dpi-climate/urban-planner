import { Dispatch, SetStateAction } from "react"
import { Anchor, RiskDataType } from "./types"

export interface DrawerWrapperProps {
  anchor: Anchor
  clickedLocal?: {lat:number, lng: number, elevation: number | null} | null
  setClickedLocal?: Dispatch<SetStateAction<{ lat: number; lng: number; elevation: number | null; } | null>>
  buttons?: string[]
  setBtn?: Dispatch<SetStateAction<string | null>>
  children?: React.ReactNode
}

export interface DrawerWrapperContentProps {
  updateLayer: (varIdx: number | null, yIdx: number | null) => void
  variableIdx: number
  years: string[]
  yearIdx: number
  variables: {name: string, id: string}[]
}

export interface InfoContentProps {
  clickedLocal: {lat:number, lng: number, elevation: number | null} | null
  riskData: RiskDataType
}