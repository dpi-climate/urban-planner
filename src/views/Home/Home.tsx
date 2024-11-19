import "./Home.css"
import React from "react"

import Map from "../../components/map/Map"
import myConsts from "../../consts/consts"
import MapDec from "../../components/map/Deck"

import ElementWrapper from "../../components/element-wrapper/ElementWrapper"
import DrawerWrapper from "../../components/drawer/DrawerWrapper"

const Home = () => {

  const renderMenu = () => {
    const buttons = ["Layers"]

    return <DrawerWrapper anchor={"right"} buttons={buttons}/>
    // return <DrawerWrapper anchor={"bottom"} buttons={buttons}/>
  }

  const renderInfoDrawer = () => {
    // return <DrawerWrapper anchor={"top"} buttons={['Button 4', 'Button 5', 'Button 6']}/>
    const buttons = ['Home', 'Settings', 'Info']
    // return <DrawerWrapper anchor={"top"} buttons={buttons}/>
    return <DrawerWrapper anchor={"bottom"} buttons={buttons}/>
  }

  const renderMap = () => {
    return (
      <ElementWrapper>
        <MapDec {...myConsts.mapParams} />
      </ElementWrapper>
    )
  }

  const render = () => {
    return (
      <div className="home">
        { renderMenu() }
        {/* { renderInfoDrawer() } */}
        { renderMap() }
      </div>
    )

  }

  return render()
}

export default Home