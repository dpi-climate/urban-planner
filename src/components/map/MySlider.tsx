import * as React from 'react'
import Box from '@mui/material/Box'
import Slider from '@mui/material/Slider'

interface MySliderProps {
  setControlDrag: (isDragging: boolean) => void
  min: number
  max: number
  step: number
  initialValue: number
  title: string
  onChange: (value: number) => void
}

function MySlider(props: MySliderProps) {
  const handleChange = (event: Event, value: number | number[]) => {
    if (props.onChange && typeof value === 'number') {
      props.onChange(value); // Call the passed onChange handler with the new value
    }
  }
  return (
    <Box
      sx={{
        userSelect: "none",
        width: 100,
        position: 'relative', // Ensure the Box is a positioned container
        overflow: 'visible',
        marginLeft: '10px',
        marginRight: '10px',
      }}
      onPointerEnter={() => props.setControlDrag(false)}
      onPointerLeave={() => {props.setControlDrag(true)}}
    > {props.title}
      <Slider
        min={props.min}
        max={props.max}
        // value={props.value}
        defaultValue={props.initialValue}
        step={props.step}
        size="small"
        onChangeCommitted={handleChange}
        aria-label="Small"
        valueLabelDisplay="auto"

      />
    </Box>
  )
}

export default MySlider