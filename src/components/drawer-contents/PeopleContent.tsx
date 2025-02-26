import React from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'


const title = "Socio-Demographics"
const subtitle = ""

interface IPeopleContent {
  socioVariables: {name: string, id: string}[]
  socioVarIdx: number
  updateSocioLayer: (varIdx: number | null, sIdx: number | null) => void

}

const PeopleContent: React.FC<IPeopleContent> = (props) => {

  const renderVariableDropdown = () => {
    if(props.socioVariables.length > 0) {
      return (
        <FormControl fullWidth sx={{ margin: 1, maxWidth: 200 }}>
          <InputLabel>Variable</InputLabel>
          <Select
            value={`${props.socioVarIdx}`}
            label={props.socioVariables[props.socioVarIdx].name}
            onChange={(event: SelectChangeEvent) => props.updateSocioLayer(parseInt(event.target.value), null)}
          >
            {
              props.socioVariables.map((obj: {name: string, id: string}, idx: number) => <MenuItem key={`sources_key_${obj.id}`} value={idx}>{obj.name}</MenuItem>)
            }
          </Select>
        </FormControl>
      )
    }
  }

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h6">{title}</Typography>
      <Typography variant="body1">
        {subtitle}
      </Typography>

      {renderVariableDropdown()}

    </Box>
  )
}

export default PeopleContent