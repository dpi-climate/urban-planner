import React from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import LocationOnIcon from '@mui/icons-material/LocationOn'

import { InfoContentProps } from '../../types-and-interfaces/interfaces'

import BarChart from '../bar-chart/BarChartZoom'
import LineChart from '../line-chart/LineChart'

import { BAR_CHART_DATA, LINE_CHART_DATA } from '../../consts/consts'

const title = "Local Info"
const subtitle = ""

const ClickedInfoContent: React.FC<InfoContentProps> = (props) => {

  const renderPointInfo = () => {
    if (props.clickedLocal) {
      return (
        <>
          <LocationOnIcon
            sx={{
              color: 'red',
              marginRight: 1,
              filter: 'drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.4))',
            }}
          />
          <Box>
            <Typography variant="body2"><strong>Elevation:</strong> {props.clickedLocal.elevation?.toFixed(2)} m</Typography>
            <Typography variant="body2"><strong>Latitude:</strong> {props.clickedLocal.lat.toFixed(2)}°</Typography>
            <Typography variant="body2"><strong>Longitude:</strong> {props.clickedLocal.lng.toFixed(2)}°</Typography>
          </Box>
          {/* <Box>
            <BarChart data={BAR_CHART_DATA} width={400} height={200} />
          </Box>
          <Box>
          <BarChart data={BAR_CHART_DATA} width={400} height={200} />
          </Box> */}
          {/* <Box>
            <LineChart data={LINE_CHART_DATA} width={400} height={200} />
          </Box> */}
          { renderLineChart() }
          </>
      )
    } else {
      return (
        <Typography variant="body2" sx={{ marginTop: 2, fontStyle: 'italic' }}>
          No location selected
        </Typography>
      )
    }
  }

  const renderLineChart = () => {
    if(props.riskData.length > 0) {
      return (
        <Box>
          <LineChart data={props.riskData} width={400} height={200} />
        </Box>
      )
    } else {
      return <></>
    }
  }

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h6">{title}</Typography>
      {subtitle && (
        <Typography variant="subtitle1">{subtitle}</Typography>
      )}
      <Paper
          elevation={3}
          sx={{
            padding: 2,
            marginTop: 2,
            borderRadius: 2,
            display: 'flex',
            alignItems: 'center',
          }}
        >

      { renderPointInfo() }
      {/* { renderLineChart() } */}

        </Paper>
    </Box>
  )
}

export default ClickedInfoContent
