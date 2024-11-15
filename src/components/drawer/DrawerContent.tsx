// DrawerContent.jsx
import React, { useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'

const title = "Climate"
const subtitle = ""

const DrawerContent: React.FC = () => {
  const [firstDropdown, setFirstDropdown] = useState<string>('')
  const [secondDropdown, setSecondDropdown] = useState<string>('')

  const handleFirstDropdownChange = (event: SelectChangeEvent) => {
    setFirstDropdown(event.target.value)
  }

  const handleSecondDropdownChange = (event: SelectChangeEvent) => {
    setSecondDropdown(event.target.value)
  }

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h6">{title}</Typography>
      <Typography variant="body1">
        {subtitle}
      </Typography>

      {/* First Dropdown */}
      <FormControl fullWidth sx={{ margin: 1, maxWidth: 200 }}>
        <InputLabel>Year</InputLabel>
        <Select
          value={firstDropdown}
          label="Year"
          onChange={handleFirstDropdownChange}
        >
          <MenuItem value="2023">2023</MenuItem>
          <MenuItem value="2022">2022</MenuItem>
          <MenuItem value="2021">2021</MenuItem>
        </Select>
      </FormControl>

      {/* Second Dropdown */}
      <FormControl fullWidth sx={{ margin: 1, maxWidth: 200 }}>
        <InputLabel>Variable</InputLabel>
        <Select
          value={secondDropdown}
          label="Variable"
          onChange={handleSecondDropdownChange}
        >
          <MenuItem value="precipitation">Precipitation</MenuItem>
          <MenuItem value="temperature">Temperature</MenuItem>
        </Select>
      </FormControl>
    </Box>
  )
}

export default DrawerContent
