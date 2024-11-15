import * as React from 'react'
import { SxProps, Theme, useTheme } from '@mui/material/styles'
import Button from '@mui/material/Button'
import SwipeableDrawer from '@mui/material/SwipeableDrawer'
import Box from '@mui/material/Box'

import InfoIcon from '@mui/icons-material/Info'
import HomeIcon from '@mui/icons-material/Home'
import SettingsIcon from '@mui/icons-material/Settings'
import LayersIcon from '@mui/icons-material/Layers'
import EvStationIcon from '@mui/icons-material/EvStation'

import Tooltip from '@mui/material/Tooltip'

import { DrawerWrapperProps } from '../../types-and-interfaces/interfaces'

import DrawerContent from './DrawerContent'

// Buttons Component
const Buttons: React.FC<{
  buttons: string[],
  onButtonClick: (event: React.MouseEvent | React.KeyboardEvent, label: string) => void,
  buttonContainerStyle: SxProps<Theme>,
  selectedButton: string | null, // Add this line
}> = ({ buttons, onButtonClick, buttonContainerStyle, selectedButton }) => { // Modify here
  return (
    <Box sx={buttonContainerStyle}>
      {buttons.map((label, index) => {
        let icon

        switch (label) {
          case "Layers":
            icon = <LayersIcon/>
            break
          case "EV-Stations":
            icon = <EvStationIcon/>
            break
          case 'Home':
            icon = <HomeIcon />
            break
          case 'Settings':
            icon = <SettingsIcon />
            break
          case 'Info':
            icon = <InfoIcon />
            break
          default:
            icon = <HomeIcon />
        }

        return (
          <Tooltip key={index} title={label} arrow>
            <Button
              key={index}
              onClick={(event) => onButtonClick(event, label)} // Pass label
              sx={{
                margin: 1,
                width: 40,
                height: 40,
                minWidth: 40,
                minHeight: 40,
                boxShadow: 3,
                backgroundColor: selectedButton === label ? 'blue' : 'white', // Change color when selected
                color: selectedButton === label ? 'white' : 'black', // Change text color for contrast
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
const DrawerWrapper: React.FC<DrawerWrapperProps> = ({ anchor, buttons }) => {
  const [isOpen, setIsOpen] = React.useState(false)
  const [selectedButton, setSelectedButton] = React.useState<string | null>(null) // Add this line
  const [transitionDuration, setTransitionDuration] = React.useState(0)
  const [transitionEasing, setTransitionEasing] = React.useState('')
  const theme = useTheme()

  const enteringScreen = 800
  const leavingScreen = 800

  const size = { top: 350, bottom: 350, left: 350, right: 350 }

  const toggleDrawer =
    (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event &&
        event.type === 'keydown' &&
        ((event as React.KeyboardEvent).key === 'Tab' ||
          (event as React.KeyboardEvent).key === 'Shift')
      ) {
        return
      }

      const duration = open
        ? enteringScreen
        : leavingScreen
      const easing = open
        ? theme.transitions.easing.easeOut
        : theme.transitions.easing.sharp

      setTransitionDuration(duration)
      setTransitionEasing(easing)
      setIsOpen(open)
    }

  // Modify the onButtonClick function
  const onButtonClick = (event: React.MouseEvent | React.KeyboardEvent, label: string) => {
    if (selectedButton === label && isOpen) {
      // Close the drawer and reset the selected button
      toggleDrawer(false)(event)
      setSelectedButton(null)
    } else {
      // Open the drawer and set the selected button
      toggleDrawer(true)(event)
      setSelectedButton(label)
    }
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

    switch (anchor) {
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
          transform: isOpen ? `translateY(${size.top}px)` : 'translateY(0)',
          flexDirection: 'row',
          width: '100vw',
        }
      case 'bottom':
        return {
          ...commonStyles,
          bottom: 0,
          left: 0,
          transform: isOpen ? `translateY(-${size.bottom}px)` : 'translateY(0)',
          flexDirection: 'row',
          width: '100vw',
        }
      default:
        return commonStyles
    }
  }

  return (
    <div style={{ position: 'relative' }}>
      <React.Fragment key={`drawer-${anchor}`}>
        {/* Pass selectedButton to Buttons component */}
        <Buttons
          buttons={buttons}
          onButtonClick={onButtonClick}
          buttonContainerStyle={getButtonContainerStyle()}
          selectedButton={selectedButton} // Add this line
        />
        <SwipeableDrawer
          anchor={anchor}
          open={isOpen}
          onClose={toggleDrawer(false)}
          onOpen={toggleDrawer(true)}
          ModalProps={{
            keepMounted: true, // Keeps the drawer in the DOM for performance
            BackdropProps: { style: { backgroundColor: 'transparent' } }, // Disables background dimming
          }}
          transitionDuration={{
            enter: enteringScreen,
            exit: leavingScreen,
          }}
        >
          <DrawerContent/>
          <Box
            sx={{
              width: anchor === 'left' || anchor === 'right' ? size[anchor] : 'auto',
              height: anchor === 'top' || anchor === 'bottom' ? size[anchor] : 'auto',
            }}
          />
        </SwipeableDrawer>
      </React.Fragment>
    </div>
  )
}

export default DrawerWrapper
