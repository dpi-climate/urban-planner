import React from "react"

const ElementWrapper = (props: any) => {
  return (
    <div style={{
      position: 'relative',
      right: props.right,
      top: props.top,
      bottom: props.bottom,
      display: 'flex',
      flexDirection: 'column',
      width: props.width,
      height: props.height,
      margin: '2px',
      padding: '0px'
    }}>
      {props.children}
    </div>
  )
}

export default ElementWrapper