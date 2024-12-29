// ClimateContent.jsx
import React, { useState } from 'react'

import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'

import { DrawerWrapperContentProps } from '../../types-and-interfaces/interfaces'

const title = "Climate"
const subtitle = ""

const ClimateContent: React.FC<DrawerWrapperContentProps> = (props) => {

  const renderVariableDropdown = () => {
    return (
      <FormControl fullWidth sx={{ margin: 1, maxWidth: 200 }}>
        <InputLabel>Variable</InputLabel>
        <Select
          value={`${props.variableIdx}`}
          label={props.variables[props.variableIdx].name}
          onChange={(event: SelectChangeEvent) => props.updateLayer(parseInt(event.target.value), null, null)}
        >
          {
            props.variables.map((obj: {name: string, id: string}, idx: number) => <MenuItem key={`sources_key_${obj.id}`} value={idx}>{obj.name}</MenuItem>)
          }
        </Select>
      </FormControl>
    )
  }

  const renderProperties = () => {
    if(props.variables && props.yearIdx !== null) {
      return (
        <FormControl fullWidth sx={{ margin: 1, maxWidth: 200 }}>
          <InputLabel>Year</InputLabel>
          <Select
            value={`${props.yearIdx}`}
            label={props.years[props.yearIdx]}
            onChange={(event: SelectChangeEvent) => props.updateLayer(null, parseInt(event.target.value), null)}
          >
            {
              props.years.map((y: string, idx: number) => <MenuItem key={`dp_year_key_${idx}`} value={idx}>{y}</MenuItem>)
            }
          </Select>
        </FormControl>
      )
      
    } else {
      return null
    }
  }

  const renderSpatialResolution = () => {
    if(props.variables && props.yearIdx !== null) {
      return (
        <FormControl fullWidth sx={{ margin: 1, maxWidth: 200 }}>
          <InputLabel>Spatial Level</InputLabel>
          <Select
            value={`${props.spatialAggIdx}`}
            label={props.spatialAggList[props.spatialAggIdx].name}
            onChange={(event: SelectChangeEvent) => props.updateLayer(null, null, parseInt(event.target.value))}
          >
            {
              props.spatialAggList.map((s: string, idx: number) => <MenuItem key={`dp_sAgg_key_${idx}`} value={idx}>{s.name}</MenuItem>)
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

      {renderVariableDropdown()}
      {renderProperties()}
      {renderSpatialResolution()}
      
    </Box>
  )
}

export default ClimateContent
