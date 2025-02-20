import * as React from 'react';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';

interface MySliderProps {
  // Parent passes the current value here
  value: number;                    
  onChange: (value: number) => void;

  // Min, max, step, etc.
  min: number;
  max: number;
  step: number;

  // For pointer interactions
  setControlDrag: (isDragging: boolean) => void;

  // For labeling the slider
  title: string;
}

function MySlider({
  value,
  onChange,
  min,
  max,
  step,
  setControlDrag,
  title,
}: MySliderProps) {

  // Handler for slider moves
  const handleChange = (_event: Event, newValue: number | number[]) => {
    if (typeof newValue === 'number') {
      onChange(newValue); // Pass the updated value to the parent
    }
  };

  return (
    <Box
      sx={{
        userSelect: 'none',
        width: 100,
        position: 'relative',
        overflow: 'visible',
        marginLeft: '10px',
        marginRight: '10px',
      }}
      onPointerEnter={() => setControlDrag(false)}
      onPointerLeave={() => setControlDrag(true)}
    >
      <Box
        sx={{
          whiteSpace: 'nowrap',
          overflow: 'visible',
          // textOverflow: 'ellipsis',
          display: 'block',
        }}
      >
        {title}
      </Box>
      <Slider
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={handleChange}
        aria-label="Small"
        valueLabelDisplay="auto"
      />
    </Box>
  )
}

export default MySlider;
