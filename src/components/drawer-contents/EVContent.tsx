import React from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'

const title = "EV Stations"
const subtitle = ""

interface IEVContent {
  showStations: boolean
  setShowStations: (s: boolean) => void
}

const EVContent: React.FC<IEVContent> = (props) => {
  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h6">{title}</Typography>
      <Typography variant="body1">
        {subtitle}
      </Typography>
      <FormControlLabel
        control={<Checkbox checked={props.showStations} onChange={() => props.setShowStations(!props.showStations)} />}
        label="Current EV Stations"
      />
    </Box>
  )
}

export default EVContent
// onChange={() => props.setShowStations(!props.showStations)}