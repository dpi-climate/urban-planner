import "./Home.css"
import React from "react"

import Map from "../../components/map/Map"
import myConsts from "../../consts/consts"
import MapDec from "../../components/map/Deck"


import DrawerWrapper from "../../components/drawer/DrawerWrapper"

const Home = () => {

  const renderMenu = () => {
    // const buttons = [
    //   { label: 'Home', icon: <HomeIcon /> },
    //   { label: 'Settings', icon: <SettingsIcon /> },
    //   { label: 'Info', icon: <InfoIcon /> },
    // ]
    const buttons = ['Home', 'Settings', 'Info'];

    return <DrawerWrapper anchor={"right"} buttons={buttons}/>
    // return <DrawerWrapper anchor={"left"} buttons={buttons}/>
  }

  const renderInfoDrawer = () => {
    // return <DrawerWrapper anchor={"top"} buttons={['Button 4', 'Button 5', 'Button 6']}/>
    const buttons = ['Home', 'Settings', 'Info'];
    // return <DrawerWrapper anchor={"top"} buttons={buttons}/>
    return <DrawerWrapper anchor={"bottom"} buttons={buttons}/>
  }

  const renderMap = () => {
    return (
      <div style={{
        position: 'relative',
        right: '-100px',
        display: 'flex',
        flexDirection: 'column',
        width: '1000px',
        height: '500px',
        backgroundColor: 'purple',
        margin: '10px',
        padding: '5px'
      }}>
        <MapDec {...myConsts.mapParams} />
      </div>
    )
  }

  const render = () => {
    return (
      <div className="home">
        { renderMenu() }
        { renderInfoDrawer() }
        { renderMap() }
      </div>
    )

  }

  return render()
}

export default Home