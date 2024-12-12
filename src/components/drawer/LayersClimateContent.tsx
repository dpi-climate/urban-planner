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


  const renderFileDropdown = () => {
    return (
      <FormControl fullWidth sx={{ margin: 1, maxWidth: 200 }}>
        <InputLabel>Source</InputLabel>
        <Select
          value={`${props.griddedLayerIdx}`}
          label={props.climateVariables[props.griddedLayerIdx].name}
          onChange={(event: SelectChangeEvent) => props.updateSource(parseInt(event.target.value))}
        >
          {
            props.climateVariables.map((obj: {name: string, nick: string, properties: string[]}, idx: number) => <MenuItem key={`year_key_${obj.nick}`} value={idx}>{obj.name}</MenuItem>)
          }
        </Select>
      </FormControl>
    )
  }

  const renderProperties = () => {
    if(props.properties && props.activeProp) {
      return (
        <FormControl fullWidth sx={{ margin: 1, maxWidth: 200 }}>
        <InputLabel>Property</InputLabel>
        <Select
          value={props.activeProp}
          label="Props"
          onChange={(event: SelectChangeEvent) => props.updateProp(event.target.value)}
        >
          {
            
            props.properties.map((p: string) => <MenuItem key={`dropdown_prop_key_${p}`} value={p}>{p}</MenuItem>)
          }
        </Select>
      </FormControl>
      )
      
    } else {
      return null
    }

  }

  const renderUploadBtn = () => {
    return (
      // <Stack direction="row" spacing={2} sx={{ margin: 1, maxWidth: 200 }}></Stack>
      <Stack direction="row" sx={{ margin: 1, maxWidth: 200 }}>
        <LoadingButton
          // loading
          loading={false}
          loadingPosition="start"
          startIcon={<UploadIcon />}
          variant="outlined"
          // onClick={handleLoadBtnClick}
        >
          Load Layer
        </LoadingButton>
      </Stack>
    )
  }

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h6">{title}</Typography>
      <Typography variant="body1">
        {subtitle}
      </Typography>

      {renderFileDropdown()}
      {renderProperties()}
      
    </Box>
  )
}

export default ClimateContent
