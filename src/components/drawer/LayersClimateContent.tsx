// ClimateContent.jsx
import React, { useState } from 'react'

import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import LoadingButton from '@mui/lab/LoadingButton'
import UploadIcon from '@mui/icons-material/Upload'
import Stack from '@mui/material/Stack'

import { DrawerWrapperContentProps } from '../../types-and-interfaces/interfaces'
import myConsts from '../../consts/consts'

const title = "Climate"
const subtitle = ""

const ClimateContent: React.FC<DrawerWrapperContentProps> = (props) => {
  const [firstDropdown, setFirstDropdown] = useState<string>('')
  const [secondDropdown, setSecondDropdown] = useState<string>('')
  const [thirdDropdown, setThirdDropdown] = useState<string>('')

  const handleFirstDropdownChange = (event: SelectChangeEvent) => {
    // setFirstDropdown(event.target.value)
  }

  const handleLoadBtnClick = () => {
    if(firstDropdown && secondDropdown) {
      const layerStr = `Yearly_${secondDropdown}_Sum.json`
      if(props.climateVariable !== secondDropdown) {
        props.setClimateVariable(layerStr)
      }

      if(props.year != firstDropdown) {
        props.setYear(firstDropdown)
      }

    }
  }

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h6">{title}</Typography>
      <Typography variant="body1">
        {subtitle}
      </Typography>

      {/* Geojson Dropdown */}
      <FormControl fullWidth sx={{ margin: 1, maxWidth: 200 }}>
        <InputLabel>Variable</InputLabel>
        <Select
          // value={secondDropdown}
          // value={props.activeGriddedLayerObj}
          // value={props.climateVariables[props.griddedLayerIdx].name}
          value={`${props.griddedLayerIdx}`}
          label={props.climateVariables[props.griddedLayerIdx].name}
          // onChange={handleFirstDropdownChange}
        >
          {
            props.climateVariables.map((obj: {name: string, nick: string, properties: string[]}, idx: number) => <MenuItem key={`year_key_${obj.nick}`} value={idx}>{obj.name}</MenuItem>)
          }
        </Select>
      </FormControl>
      
      {/* Second Dropdown */}
      {/* <FormControl fullWidth sx={{ margin: 1, maxWidth: 200 }}>
        <InputLabel>Property</InputLabel>
        <Select
          value={firstDropdown}
          label="Year"
          onChange={handleFirstDropdownChange}
        >
          {
            
            // myConsts.years.map((y: number) => <MenuItem key={`year_key_${y}`} value={y}>{y}</MenuItem>)
            props.properties.map((y: string) => <MenuItem key={`year_key_${y}`} value={y}>{y}</MenuItem>)
          }
        </Select>
      </FormControl> */}

      {/* Update Button */}
      {/* <Stack direction="row" spacing={2} sx={{ margin: 1, maxWidth: 200 }}> */}
      <Stack direction="row" sx={{ margin: 1, maxWidth: 200 }}>
        <LoadingButton
          // loading
          loading={false}
          loadingPosition="start"
          startIcon={<UploadIcon />}
          variant="outlined"
          onClick={handleLoadBtnClick}
        >
          Load Layer
        </LoadingButton>
      </Stack>
    </Box>
  )
}

export default ClimateContent
