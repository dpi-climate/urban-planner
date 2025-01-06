import React from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'

// Icons
import InfoIcon from '@mui/icons-material/Info'
import LocationOnIcon from '@mui/icons-material/LocationOn'

// Interfaces
import { InfoContentProps } from '../../types-and-interfaces/interfaces'

// Charts
import BarChart from '../bar-chart/BarChartZoom'
import LineChart from '../line-chart/LineChart'

// Risk Legend
import CircleLegend from '../circle-legend/CircleLegend'

// Table
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableRow from '@mui/material/TableRow'

const title = ""//"Local Info"
const subtitle = ""

const ClickedInfoContent: React.FC<InfoContentProps> = (props) => {

  const legendItems = [
    { label: "2-year: Percentage risk for the selected location to experience frequent flooding (50% annual chance)", color: "#0A8C00" },
    { label: "5-year: Percentage risk for the selected location to experience flooding equivalent to design flood event (20% annual chance)", color: "#00CC6F" },
    { label: "10-year: Percentage risk for the selected location to experience moderate flood risk (10% annual chance)", color: "#BBBE00" },
    { label: "25-year: Percentage risk for the selected location to experience critical design flood event (4% annual chance)", color: "#FAFF00" },
    { label: "50-year: Percentage risk for the selected location to experience long-term risk like flood event (2% annual chance)", color: "#fee600" },
    { label: "100-year: Percentage risk for the selected location to experience extreme flood event (1% annual chance)", color: "#FF9E50" },
    { label: "200-year: Percentage risk for the selected location to experience extreme rare flood event (0.5% annual chance)", color: "#FE0000" },
    { label: "500-year: Percentage risk for the selected location to experience catastrophic event such as dam/flood wall failure (0.2% annual chance)", color: "#000000" },
  ]


  const renderCircleLegend = () => {
    if(props.riskData.length > 0) {
      return (
        <Box>
          <CircleLegend items={legendItems} width={1000} height={300} />
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
          <Box sx={{ minWidth: "150px"}}>
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
          <LineChart data={props.riskData} width={400} height={200} xAxisLabel="Return period (years)" yAxisLabel="Flooding Risk (%)" />
        </Box>
      )
    } else {
      return null
    }
  }

  const renderSocioInfo = () => {
    return (
      <>
        <TableContainer
          component={Paper}
          elevation={0}
          sx={{
            marginTop: 0.5,
            borderRadius: 2,
            maxWidth: '400px', // Limit the width of the table
            // margin: '0 auto', // Center the table horizontally
          }}
        >
          <Table size="small">
            <TableBody>
              {props.socioInfo.map((info, i) => (
                <TableRow key={`socio-info-${i}`}>
                  <TableCell component="th" scope="row">
                    <strong>{info.name}</strong>
                  </TableCell>
                  <TableCell align="left">{info.value}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

      </>
    );
  };

  return (
    <Box sx={{ padding: 0.5 }}>
      <Typography variant="h6">{title}</Typography>
      {subtitle && (
        <Typography variant="subtitle1">{subtitle}</Typography>
      )}
      <Paper
        elevation={0}
        sx={{
          padding: 1,
          marginTop: 0.5,
          borderRadius: 2,
          display: 'flex',
          // flexDirection: 'column',
          alignItems: 'start',
        }}
      >
        {renderPointInfo()}
        {renderLineChart()}
        {renderCircleLegend()}
      </Paper>

      {/* <Paper
        elevation={0}
        sx={{
          padding: 1, // Reduce padding to minimize vertical space
          marginTop: 0.5, // Space above the first Paper
          borderRadius: 2,
          display: 'flex',
          flexDirection: 'column', // Ensure content stacks vertically if needed
          alignItems: 'start',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {renderPointInfo()}
        </Box>
        {props.riskData.length > 0 && (
          <Box sx={{ marginTop: 1 }}>{renderLineChart()}</Box>
        )}
        {props.riskData.length > 0 && (
          <Box sx={{ marginTop: 1 }}>{renderCircleLegend()}</Box>
        )}
      </Paper> */}


      <Paper
        elevation={0}
        sx={{
          padding: 1,
          // marginTop: 0.2, // Reduced space between the Papers
          borderRadius: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'start',
        }}
      >
        {renderSocioInfo()}
      </Paper>
    </Box>

  )
}

export default ClickedInfoContent
