import { Dispatch, SetStateAction } from "react"
import { Anchor } from "./types"

export interface DrawerWrapperProps {
  anchor: Anchor
  buttons: string[]
  setBtn: Dispatch<SetStateAction<string | null>>
  children?: React.ReactNode
  // setLayerStr?: (layer: string) => void
  // setYear?: (year: string) => void
}

export interface DrawerWrapperContentProps {
  updateSource: (idx: number) => void
  updateProp: (prop: string) => void
  griddedLayerIdx: number
  properties: string[] | null
  activeProp: string | null
  climateVariables: {name: string, nick: string, geoFile: string, properties: string[]}[]
  climateVariable: string
  setClimateVariable: (layer: string) => void
  year: string
  setYear: (year: string) => void
}