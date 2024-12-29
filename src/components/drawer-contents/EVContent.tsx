// EVContent.jsx
import React, { useState } from 'react'

import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'

import { DrawerWrapperContentProps } from '../../types-and-interfaces/interfaces'

const title = "EV Stations"
const subtitle = ""

const EVContent: React.FC = (props) => {
  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h6">{title}</Typography>
      <Typography variant="body1">
        {subtitle}
      </Typography>

    {/* Add content */}
      
    </Box>
  )
}

export default EVContent
