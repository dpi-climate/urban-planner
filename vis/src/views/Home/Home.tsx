import "./Home.css"
import React from "react"

import Map from "../../components/map/Map"
import myConsts from "../../consts/consts"
import MapDec from "../../components/map/Deck"

const Home = () => {

  const renderMap = () => {
    return (
      <div style={{ position: "absolute", width:"1000px", height:"500px", backgroundColor:"purple", margin:"10px", padding: "5px" }}>
        <div style={{ position: "absolute", width:"1000px", height:"500px"}}>
        {/* <MapDec /> */}
        <Map {...myConsts.mapParams}/>
        </div>
      </div>
    )
  }
  return (
    <div className="home">
      { renderMap() }
    </div>
  )
}

export default Home