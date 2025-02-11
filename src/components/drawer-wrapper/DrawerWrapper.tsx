// Import necessary modules and components
import React, { useEffect } from 'react'
import { SxProps, Theme, useTheme } from '@mui/material/styles'
import Button from '@mui/material/Button'
import Drawer from '@mui/material/Drawer'
import Box from '@mui/material/Box'
import Tooltip from '@mui/material/Tooltip'

// Import icons
import InfoIcon from '@mui/icons-material/Info'
import HomeIcon from '@mui/icons-material/Home'
import CloseIcon from '@mui/icons-material/Close'
import SettingsIcon from '@mui/icons-material/Settings'
import LayersIcon from '@mui/icons-material/Layers'
import EvStationIcon from '@mui/icons-material/EvStation'
import CloudIcon from '@mui/icons-material/Cloud'
import WbSunnyIcon from '@mui/icons-material/WbSunny'
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import LocationCityIcon from '@mui/icons-material/LocationCity';

// Import types
import { DrawerWrapperProps } from '../../types-and-interfaces/interfaces'

// Buttons Component
const Buttons: React.FC<{
  buttons: string[],
  onButtonClick: (label: string, event: React.MouseEvent | React.KeyboardEvent) => void,
  buttonContainerStyle: SxProps<Theme>,
}> = ({ buttons, onButtonClick, buttonContainerStyle }) => {
  return (
    <Box sx={buttonContainerStyle}>
      {buttons.map((label, index) => {
        let icon

        switch (label) {
          case "Climate":
            icon = <WbSunnyIcon/>
            break
          case "Structure":
            icon = <LocationCityIcon/>
            break
          case 'Home':
            icon = <HomeIcon />
            break
          case 'People':
            icon = <PeopleAltIcon />
            break
          case 'Settings':
            icon = <SettingsIcon />
            break
          case 'Info':
            icon = <InfoIcon />
            break
          default:
            // icon = <HomeIcon />
            icon = <LayersIcon/>
        }

        return (
          <Tooltip key={index} title={label} arrow>
            <Button
              onClick={(event) => onButtonClick(label, event)}
              sx={{
                margin: 1,
                width: 40,
                height: 40,
                minWidth: 40,
                minHeight: 40,
                boxShadow: 3,
                backgroundColor: 'white',
              }}
            >
              {icon}
            </Button>
          </Tooltip>
        )
      })}
    </Box>
  )
}

// DrawerWrapper Component
const DrawerWrapper: React.FC<DrawerWrapperProps> = (props) => {
  const [isOpen, setIsOpen] = React.useState(false)
  const theme = useTheme()

  const transitionDuration = 300 // Adjust as needed
  const transitionEasing = theme.transitions.easing.easeOut

  const size = { top: 350, bottom: 300, left: 350, right: 350 } // Drawer size

  const toggleDrawer = (open: boolean, label?: string) => (event: React.MouseEvent | React.KeyboardEvent) => {
    // Only allow closing via the close button
    if (open) {
      setIsOpen(true)
      if (label && props.setBtn) props.setBtn(label)
    } else {
      setIsOpen(false)
      if (props.setClickedLocal) props.setClickedLocal(null)
    }
  }

  const handleButtonClick = (label: string, event: React.MouseEvent | React.KeyboardEvent) => {
    toggleDrawer(true, label)(event)
  }

  const getButtonContainerStyle = (): SxProps<Theme> => {
    const commonStyles: SxProps<Theme> = {
      position: 'fixed',
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'flex-start',
      zIndex: 1000,
      transition: `transform ${transitionDuration}ms ${transitionEasing}`,
    }

    switch (props.anchor) {
      case 'right':
        return {
          ...commonStyles,
          top: 0,
          right: 0,
          transform: isOpen ? `translateX(-${size.right}px)` : 'translateX(0)',
          flexDirection: 'column',
          height: '100vh',
        }
      case 'left':
        return {
          ...commonStyles,
          top: 0,
          left: 0,
          transform: isOpen ? `translateX(${size.left}px)` : 'translateX(0)',
          flexDirection: 'column',
          height: '100vh',
        }
      case 'top':
        return {
          ...commonStyles,
          top: 0,
          left: 0,
          transform: isOpen ? `translateY(${size.top + 20}px)` : 'translateY(0)',
          flexDirection: 'row',
          width: '100vw',
        }
      case 'bottom':
        return {
          ...commonStyles,
          bottom: 0,
          left: 0,
          transform: isOpen ? `translateY(-${size.bottom + 20}px)` : 'translateY(0)',
          flexDirection: 'row',
          width: '100vw',
        }
      default:
        return commonStyles
    }
  }

  const renderBtns = () => {
    if(props.buttons) {
      return (
        <Buttons
          buttons={props.buttons}
          onButtonClick={handleButtonClick}
          buttonContainerStyle={getButtonContainerStyle()}
        />
      )
    } else {
      return null
    }
  }

  // useEffect(() => {
  //   if (props.clickedLocal) {
  //     setIsOpen(true)
  //     if (props.setBtn) props.setBtn(props.clickedLocal)
  //   } else {
  //     setIsOpen(false)
  //     if (props.setClickedLocal) {
  //       // props.setClickedLocal(null)
  //       props.setClickedLocal(
  //   props.clickedLocal ? JSON.stringify(props.clickedLocal) : null
  // );
  //     }
  //   }
  // }, [props.clickedLocal, props.setClickedLocal, props.setBtn])

  useEffect(() => {
    if (props.clickedLocal) {
      setIsOpen(true);
      if (props.setBtn) props.setBtn(props.clickedLocal);
    } else {
      setIsOpen(false);
      if (props.setClickedLocal) props.setClickedLocal(null);
    }
  }, [props.clickedLocal, props.setClickedLocal, props.setBtn]);
  

  return (
    <div style={{ position: 'relative' }}>
      {/* Buttons */}
      { renderBtns() }

      {/* Persistent Drawer */}
      <Drawer
        anchor={props.anchor}
        open={isOpen}
        variant="persistent"
        transitionDuration={{
          enter: transitionDuration,
          exit: transitionDuration,
        }}
        PaperProps={{
          sx: {
            width: props.anchor === 'left' || props.anchor === 'right' ? `${size[props.anchor]}px` : '100vw',
            height: props.anchor === 'top' || props.anchor === 'bottom' ? `${size[props.anchor]}px` : '100vh',
            overflow: 'hidden',
          }
        }}
      >
        {/* Close Button */}
        <Button
          onClick={toggleDrawer(false)}
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            zIndex: 1200,
            minWidth: 'auto',
            padding: 0,
          }}
        >
          <CloseIcon />
        </Button>

        {/* Scrollable Content */}
        <Box
          sx={{
            flex: 1,
            overflowY: 'auto',
            overflowX: 'hidden',
            padding: 0.5,
            marginTop: props.anchor === 'top' ? '48px' : 0,
            marginBottom: props.anchor === 'bottom' ? '48px' : 0,
          }}
        >
          {props.children}
        </Box>
      </Drawer>
    </div>
  )
}

export default DrawerWrapper
