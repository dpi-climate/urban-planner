import React from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import LocationOnIcon from '@mui/icons-material/LocationOn'

import { InfoContentProps } from '../../types-and-interfaces/interfaces'

import BarChart from '../bar-chart/BarChartZoom'
import LineChart from '../line-chart/LineChart'
import CircleLegend from '../circle-legend/CircleLegend'


// import { BAR_CHART_DATA, LINE_CHART_DATA } from '../../consts/consts'

const title = ""//"Local Info"
const subtitle = ""

const ClickedInfoContent: React.FC<InfoContentProps> = (props) => {

  const legendItems = [
    // { label: "2-year return period: Frequent Event", color: "#A8D5BA" },
    // { label: "5-year return period: Design Event", color: "#4A90E2" },
    // { label: "10-year return period: Moderate Risk Event", color: "#F8E71C" },
    // { label: "25-year return period: Critical Design Event", color: "#F5A623" },
    // { label: "50-year return period: Long-term Risk Event", color: "#9013FE" },
    // { label: "100-year return period: Extreme Design Event", color: "#D0021B" },
    // { label: "200-year return period: Extreme Rare Event", color: "#660000" },
    // { label: "500-year return period: Catastrophic Event", color: "#000000" },

  //   { label: "2-year return period: Frequent Event", color: "#0A8C00" },
  //   { label: "5-year return period: Design Event", color: "#00CC6F" },
  //   { label: "10-year return period: Moderate Risk Event", color: "#BBBE00" },
  //   { label: "25-year return period: Critical Design Event", color: "#FAFF00" },
  //   { label: "50-year return period: Long-term Risk Event", color: "#fee600" },
  //   { label: "100-year return period: Extreme Design Event", color: "#FF9E50" },
  //   { label: "200-year return period: Extreme Rare Event", color: "#FE0000" },
  //   { label: "500-year return period: Catastrophic Event", color: "#000000" },

  { label: "2-year: Frequent Event", color: "#0A8C00" },
  { label: "5-year: Design Event", color: "#00CC6F" },
  { label: "10-year: Moderate Risk Event", color: "#BBBE00" },
  { label: "25-year: Critical Design Event", color: "#FAFF00" },
  { label: "50-year: Long-term Risk Event", color: "#fee600" },
  { label: "100-year: Extreme Design Event", color: "#FF9E50" },
  { label: "200-year: Extreme Rare Event", color: "#FE0000" },
  { label: "500-year: Catastrophic Event", color: "#000000" },
]
  // ]

  const renderCircleLegend = () => {
    if(props.riskData.length > 0) {
      return (
        <Box>
          <CircleLegend items={legendItems} width={300} height={300} />
        </Box>
      )
    }
  }

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
          {/* <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <img
              src={"/Electric_Charging_Station_Clean_Transparent.png"}
              alt="Location Icon"
              style={{
                // width: '72px',
                height: '72px',
                marginRight: '8px',
                filter: 'drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.4))',
              }}
            />
          </Box> */}
          <Box>
            <Typography variant="body2"><strong>Elevation:</strong> {props.clickedLocal.elevation?.toFixed(2)} m</Typography>
            <Typography variant="body2"><strong>Latitude:</strong> {props.clickedLocal.lat.toFixed(2)}°</Typography>
            <Typography variant="body2"><strong>Longitude:</strong> {props.clickedLocal.lng.toFixed(2)}°</Typography>
          </Box>
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
          <LineChart data={props.riskData} width={400} height={200} xAxisLabel="Return period (years)" yAxisLabel="Risk" />
        </Box>
      )
    } else {
      return <></>
    }
  }

  return (
    <Box sx={{ padding: 0.5 }}>
      <Typography variant="h6">{title}</Typography>
      {subtitle && (
        <Typography variant="subtitle1">{subtitle}</Typography>
      )}
      <Paper
          elevation={0}
          sx={{
            padding: 2,
            marginTop: 0.5,
            borderRadius: 2,
            display: 'flex',
            // alignItems: 'center',
            alignItems: 'start',
          }}
        >

      { renderPointInfo() }
      { renderLineChart() }
      { renderCircleLegend() }

        </Paper>
    </Box>
  )
}

export default ClickedInfoContent
