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
  griddedLayerIdx: number
  properties: string[]
  climateVariables: {name: string, nick: string, geoFile: string, properties: string[]}[]
  climateVariable: string
  setClimateVariable: (layer: string) => void
  year: string
  setYear: (year: string) => void
}