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

const title = "Climate"
const subtitle = ""

const ClimateContent: React.FC<DrawerWrapperContentProps> = (props) => {

  const renderFileDropdown = () => {
    return (
      <FormControl fullWidth sx={{ margin: 1, maxWidth: 200 }}>
        <InputLabel>Source</InputLabel>
        <Select
          value={`${props.griddedLayerIdx}`}
          label={props.sources[props.griddedLayerIdx].name}
          onChange={(event: SelectChangeEvent) => props.updateSource(parseInt(event.target.value))}
        >
          {
            props.sources.map((obj: {name: string, id: string, properties: string[]}, idx: number) => <MenuItem key={`sources_key_${obj.id}`} value={idx}>{obj.name}</MenuItem>)
          }
        </Select>
      </FormControl>
    )
  }

  const renderProperties = () => {
    console.log(props.sources, props.griddedLayerIdx, props.activePropIdx, props.sources && props.griddedLayerIdx && props.activePropIdx)
    if(props.sources && props.activePropIdx !== null) {
      return (
        <FormControl fullWidth sx={{ margin: 1, maxWidth: 200 }}>
          <InputLabel>Colors</InputLabel>
          <Select
            value={props.activePropIdx.toString()}
            label={props.sources[props.griddedLayerIdx].properties[props.activePropIdx]}
            onChange={(event: SelectChangeEvent) => props.updateProp(parseInt(event.target.value))}
          >
            {
              props.sources[props.griddedLayerIdx].properties.map((p: string, i: number) => <MenuItem key={`dropdown_prop_key_${p}`} value={i}>{p}</MenuItem>)
            }
          </Select>
        </FormControl>
      )
      
    } else {
      return null
    }
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
