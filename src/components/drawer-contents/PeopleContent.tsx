import React from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'

const title = "Socio-Demographics"
const subtitle = ""

interface IPeopleContent {
  // showStations: boolean
  // setShowStations: (s: boolean) => void
}

const PeopleContent: React.FC<IPeopleContent> = (props) => {
  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h6">{title}</Typography>
      <Typography variant="body1">
        {subtitle}
      </Typography>
      {/* <FormControlLabel
        control={<Checkbox checked={props.showStations} />}
        label="Current EV Stations"
      /> */}
    </Box>
  )
}

export default PeopleContent