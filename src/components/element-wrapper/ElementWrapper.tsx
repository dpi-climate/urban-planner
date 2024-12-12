import React from "react"

const ElementWrapper = (props: any) => {
  return (
    <div style={{
      position: 'relative',
      right: props.right,
      display: 'flex',
      flexDirection: 'column',
      width: props.width,
      height: props.height,
      // backgroundColor: 'purple',
      margin: '10px',
      padding: '5px'
    }}>
      {props.children}
    </div>
  )
}

export default ElementWrapper