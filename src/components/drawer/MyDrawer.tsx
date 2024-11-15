import * as React from 'react';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

type Anchor = 'top' | 'left' | 'bottom' | 'right';

export default function Drawer({ anchor, size, toggleDrawer, isOpen }: { anchor: Anchor, size: number, toggleDrawer: Function, isOpen: boolean }) {

  return (
    <div>
        <SwipeableDrawer
          anchor={anchor}
          open={isOpen}
          onClose={toggleDrawer(false)}
          onOpen={toggleDrawer(true)}
          ModalProps={{
            keepMounted: true, // Keeps the drawer in the DOM for performance
            BackdropProps: { style: { backgroundColor: 'transparent' } } // Disables background dimming
          }}
        >
          {/* Empty Box to hold drawer structure */}
          <Box
            sx={{
              width: anchor === 'top' || anchor === 'bottom' ? 'auto' : size,
              height: anchor === 'top' || anchor === 'bottom' ? size : 'auto',
            }}
          />
        </SwipeableDrawer>
    </div>
  );
}
