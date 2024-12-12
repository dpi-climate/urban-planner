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
  // updateProp: (prop: string) => void
  updateProp: (propIdx: number) => void
  griddedLayerIdx: number
  properties: string[] | null
  // activeProp: string | null
  activePropIdx: number | null
  sources: {name: string, id: string, geoFile: string, properties: string[]}[]
}