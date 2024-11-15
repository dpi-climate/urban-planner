// DrawerContent.jsx
import React, { useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';

const title = "Climate"
const subtitle = "Climate Data"

const DrawerContent = () => {
  const [selectedOption, setSelectedOption] = useState('')

  const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedOption(event.target.value);
  }

  const renderContent = () => {
    return (
      <RadioGroup
        value={selectedOption}
        onChange={handleOptionChange}
        sx={{ marginTop: 2 }}
      >
        <FormControlLabel value="2023" control={<Radio />} label="Option 1" />
        <FormControlLabel value="2022" control={<Radio />} label="Option 2" />
        <FormControlLabel value="2021" control={<Radio />} label="Option 3" />
      </RadioGroup>
    )
  }

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h6">{title}</Typography>
      <Typography variant="body1">
        {subtitle}
      </Typography>
      { renderContent() }
    </Box>
  )
}

export default DrawerContent
