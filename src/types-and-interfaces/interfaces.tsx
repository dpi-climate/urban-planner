import { Dispatch, SetStateAction } from "react"
import { Anchor } from "./types"

export interface DrawerWrapperProps {
  anchor: Anchor
  clickedLocal?: {lat:number, lng: number, elevation: number | null} | null
  setClickedLocal?: Dispatch<SetStateAction<{ lat: number; lng: number; elevation: number | null; } | null>>
  buttons?: string[]
  setBtn?: Dispatch<SetStateAction<string | null>>
  children?: React.ReactNode
}

export interface DrawerWrapperContentProps {
  updateSource: (idx: number) => void
  updateProp: (propIdx: number) => void
  griddedLayerIdx: number
  properties: string[] | null
  activePropIdx: number | null
  sources: {name: string, id: string, geoFile: string, properties: string[]}[]
}

export interface InfoContentProps {
  clickedLocal: {lat:number, lng: number, elevation: number | null} | null
}