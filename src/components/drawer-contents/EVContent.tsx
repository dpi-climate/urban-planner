import React from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import { StationType } from '../../types-and-interfaces/types'

const title = "Alternative Fuel Stations"
const subtitle = ""

interface IEVContent {
  showStations: boolean
  activeStations: StationType[]
  setStations: (s: StationType[]) => void
  setShowStations: (s: boolean) => void
}

const EVContent: React.FC<IEVContent> = (props) => {

  const handleChange = (newItem: StationType) => {
    let newStations = [...props.activeStations]
    if (props.activeStations.includes(newItem)) {
      newStations = newStations.filter(item => item !== newItem)
      
    } else {
      newStations.push(newItem)
    }

    props.setStations(newStations)
  }
  console.log(props.activeStations)
  return (
    <>
      <Box sx={{ padding: 2 }}>
        <Typography variant="h6">{title}</Typography>
        <Typography variant="body1">
          {subtitle}
        </Typography>
        <FormControlLabel
          control={<Checkbox checked={props.activeStations.includes("electric")} onChange={() =>  handleChange("electric")}/>}
          label="Electric"
        />
        <FormControlLabel
          control={<Checkbox checked={props.activeStations.includes("cng")} onChange={() => handleChange("cng")} />}
          label="Compressed Natural Gas"
        />
        <FormControlLabel
          control={<Checkbox checked={props.activeStations.includes("biodiesel")} onChange={() => handleChange("biodiesel")} />}
          label="Biodiesel (B20 and above)"
        />
        <FormControlLabel
          control={<Checkbox checked={props.activeStations.includes("ethanol")} onChange={() => handleChange("ethanol")} />}
          label="E85 Ethanol"
        />
        <FormControlLabel
          control={<Checkbox checked={props.activeStations.includes("lng")} onChange={() => handleChange("lng")} />}
          label="Liquefied Natural Gas"
        />
        <FormControlLabel
          control={<Checkbox checked={props.activeStations.includes("lpg")} onChange={() => handleChange("lpg")} />}
          label="Liquefied Petroleum Gas (Propane)"
        />
      </Box>
    </>
  )
}

export default EVContent
// onChange={() => props.setShowStations(!props.showStations)}