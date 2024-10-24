import "./Home.css"
import React from "react"

import Map from "../../components/mapbox-map/Map"

const Home = () => {
  return (
    <div className="home">
      <Map />
    </div>
  )
}

export default Home